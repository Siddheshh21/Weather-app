from flask import Flask, render_template, jsonify, request
import requests
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

API_KEY = os.getenv("API_KEY", "eac29b2db53439574e37af9ee1390ff2")
OWM_BASE = "https://api.openweathermap.org"


def kelvin_to_celsius(k):
    return round(k - 273.15, 1)


def kelvin_to_fahrenheit(k):
    return round((k - 273.15) * 9 / 5 + 32, 1)


def wind_direction(degrees):
    dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    idx = round(degrees / 22.5) % 16
    return dirs[idx]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/autocomplete")
def autocomplete():
    q = request.args.get("q", "").strip()
    if not q or len(q) < 2:
        return jsonify([])
    try:
        url = f"{OWM_BASE}/geo/1.0/direct"
        params = {"q": q, "limit": 6, "appid": API_KEY}
        resp = requests.get(url, params=params, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        results = []
        seen = set()
        for item in data:
            label = f"{item['name']}, {item.get('state', '')} {item['country']}".strip(", ")
            key = (item["name"], item["country"])
            if key not in seen:
                seen.add(key)
                results.append({
                    "name": item["name"],
                    "country": item["country"],
                    "state": item.get("state", ""),
                    "lat": item["lat"],
                    "lon": item["lon"],
                    "label": label,
                })
        return jsonify(results)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/weather")
def weather():
    q = request.args.get("q", "").strip()
    lat = request.args.get("lat", "").strip()
    lon = request.args.get("lon", "").strip()

    try:
        # --- Resolve coordinates ---
        if lat and lon:
            coords = {"lat": float(lat), "lon": float(lon)}
            # Reverse geocode for city name
            geo_url = f"{OWM_BASE}/geo/1.0/reverse"
            geo_resp = requests.get(geo_url, params={"lat": lat, "lon": lon, "limit": 1, "appid": API_KEY}, timeout=5)
            geo_data = geo_resp.json()
            city_name = geo_data[0]["name"] if geo_data else "Unknown"
            country = geo_data[0]["country"] if geo_data else ""
        elif q:
            geo_url = f"{OWM_BASE}/geo/1.0/direct"
            geo_resp = requests.get(geo_url, params={"q": q, "limit": 1, "appid": API_KEY}, timeout=5)
            geo_data = geo_resp.json()
            if not geo_data:
                return jsonify({"error": "City not found"}), 404
            coords = {"lat": geo_data[0]["lat"], "lon": geo_data[0]["lon"]}
            city_name = geo_data[0]["name"]
            country = geo_data[0]["country"]
        else:
            return jsonify({"error": "Provide city name or coordinates"}), 400

        # --- Current weather ---
        current_url = f"{OWM_BASE}/data/2.5/weather"
        current_params = {
            "lat": coords["lat"], "lon": coords["lon"],
            "appid": API_KEY, "units": "metric"
        }
        curr_resp = requests.get(current_url, params=current_params, timeout=5)
        curr_resp.raise_for_status()
        curr = curr_resp.json()

        # --- 5-day / 3-hour forecast ---
        forecast_url = f"{OWM_BASE}/data/2.5/forecast"
        fore_resp = requests.get(forecast_url, params=current_params, timeout=5)
        fore_resp.raise_for_status()
        fore = fore_resp.json()

        # --- Build current block ---
        sunrise = datetime.fromtimestamp(curr["sys"]["sunrise"]).strftime("%H:%M")
        sunset = datetime.fromtimestamp(curr["sys"]["sunset"]).strftime("%H:%M")

        current_block = {
            "city": city_name,
            "country": country,
            "temp": round(curr["main"]["temp"]),
            "feels_like": round(curr["main"]["feels_like"]),
            "temp_min": round(curr["main"]["temp_min"]),
            "temp_max": round(curr["main"]["temp_max"]),
            "humidity": curr["main"]["humidity"],
            "pressure": curr["main"]["pressure"],
            "visibility": round(curr.get("visibility", 0) / 1000, 1),
            "wind_speed": round(curr["wind"]["speed"] * 3.6, 1),
            "wind_deg": curr["wind"].get("deg", 0),
            "wind_dir": wind_direction(curr["wind"].get("deg", 0)),
            "description": curr["weather"][0]["description"].title(),
            "icon": curr["weather"][0]["icon"],
            "condition_id": curr["weather"][0]["id"],
            "condition_main": curr["weather"][0]["main"],
            "sunrise": sunrise,
            "sunset": sunset,
            "clouds": curr.get("clouds", {}).get("all", 0),
            "uv": None,  # OWM free tier doesn't expose UV in current endpoint
            "timestamp": curr["dt"],
            "timezone_offset": curr["timezone"],
        }

        # --- Build hourly (next 12 entries = 36 hours) ---
        hourly = []
        for item in fore["list"][:12]:
            hourly.append({
                "time": datetime.fromtimestamp(item["dt"]).strftime("%H:%M"),
                "date": datetime.fromtimestamp(item["dt"]).strftime("%a %d"),
                "temp": round(item["main"]["temp"]),
                "icon": item["weather"][0]["icon"],
                "condition_main": item["weather"][0]["main"],
                "description": item["weather"][0]["description"].title(),
                "pop": round(item.get("pop", 0) * 100),
            })

        # --- Build daily forecast (group by date, take midday reading) ---
        daily_map = {}
        for item in fore["list"]:
            day = datetime.fromtimestamp(item["dt"]).strftime("%Y-%m-%d")
            hour = datetime.fromtimestamp(item["dt"]).hour
            if day not in daily_map:
                daily_map[day] = []
            daily_map[day].append({
                "hour": hour,
                "temp": round(item["main"]["temp"]),
                "temp_min": round(item["main"]["temp_min"]),
                "temp_max": round(item["main"]["temp_max"]),
                "icon": item["weather"][0]["icon"],
                "condition_main": item["weather"][0]["main"],
                "description": item["weather"][0]["description"].title(),
                "pop": round(item.get("pop", 0) * 100),
            })

        forecast = []
        for day, readings in list(daily_map.items())[:6]:
            # prefer midday reading
            best = min(readings, key=lambda x: abs(x["hour"] - 13))
            max_temp = max(r["temp_max"] for r in readings)
            min_temp = min(r["temp_min"] for r in readings)
            max_pop = max(r["pop"] for r in readings)
            dt = datetime.strptime(day, "%Y-%m-%d")
            forecast.append({
                "day": dt.strftime("%A"),
                "short_day": dt.strftime("%a"),
                "date": dt.strftime("%b %d"),
                "temp_max": max_temp,
                "temp_min": min_temp,
                "icon": best["icon"],
                "condition_main": best["condition_main"],
                "description": best["description"],
                "pop": max_pop,
            })

        return jsonify({
            "current": current_block,
            "hourly": hourly,
            "forecast": forecast,
        })

    except requests.exceptions.HTTPError as e:
        return jsonify({"error": "City not found or API error"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
