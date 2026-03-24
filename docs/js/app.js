/* ═══════════════════════════════════════════════════════════
   SKYE — Weather App · Main Application Logic
   ═══════════════════════════════════════════════════════════ */
'use strict';

// OpenWeatherMap API Configuration
const API_KEY = 'eac29b2db53439574e37af9ee1390ff2';
const OWM_BASE = 'https://api.openweathermap.org';

/* ── SVG Weather Icons ─────────────────────────────────────── */
const ICONS = {

  // ── Clear / Sunny
  clear: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g class="icon-sun-rays" style="transform-origin:60px 60px;animation:iconSunRotate 15s linear infinite">
      <line x1="60" y1="8"  x2="60" y2="22"  stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
      <line x1="60" y1="98" x2="60" y2="112" stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
      <line x1="8"  y1="60" x2="22" y2="60"  stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
      <line x1="98" y1="60" x2="112" y2="60" stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.85"/>
      <line x1="21" y1="21" x2="31" y2="31"  stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
      <line x1="89" y1="89" x2="99" y2="99"  stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
      <line x1="99" y1="21" x2="89" y2="31"  stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
      <line x1="21" y1="99" x2="31" y2="89"  stroke="#FFD700" stroke-width="4" stroke-linecap="round" opacity="0.65"/>
    </g>
    <circle cx="60" cy="60" r="24" fill="#FFD700" style="animation:iconSunPulse 3s ease-in-out infinite"/>
    <circle cx="60" cy="60" r="18" fill="#FFF176" opacity="0.6"/>
  </svg>`,

  // ── Few Clouds / Partly Cloudy
  clouds_few: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="55" r="16" fill="#FFD700" style="animation:iconSunPulse 3s ease-in-out infinite" opacity="0.9"/>
    <g style="animation:iconCloudDrift 4s ease-in-out infinite">
      <ellipse cx="65" cy="72" rx="30" ry="17" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
      <ellipse cx="50" cy="78" rx="22" ry="14" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
      <ellipse cx="78" cy="78" rx="18" ry="13" fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
    </g>
  </svg>`,

  // ── Overcast / Broken Clouds
  clouds: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g style="animation:iconCloudDrift 4.5s ease-in-out infinite">
      <ellipse cx="58" cy="52" rx="26" ry="16" fill="rgba(180,190,220,0.35)" stroke="rgba(200,210,240,0.5)" stroke-width="1.5"/>
    </g>
    <g style="animation:iconCloudDrift 5s ease-in-out infinite;animation-delay:-2s">
      <ellipse cx="62" cy="68" rx="34" ry="20" fill="rgba(200,210,240,0.4)" stroke="rgba(210,220,250,0.55)" stroke-width="2"/>
      <ellipse cx="44" cy="76" rx="24" ry="16" fill="rgba(200,210,240,0.45)" stroke="rgba(210,220,250,0.55)" stroke-width="2"/>
      <ellipse cx="82" cy="76" rx="22" ry="15" fill="rgba(200,210,240,0.42)" stroke="rgba(210,220,250,0.55)" stroke-width="2"/>
    </g>
  </svg>`,

  // ── Rain
  rain: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g style="animation:iconCloudDrift 5s ease-in-out infinite">
      <ellipse cx="62" cy="52" rx="32" ry="18" fill="rgba(100,140,200,0.45)" stroke="rgba(130,170,230,0.6)" stroke-width="2"/>
      <ellipse cx="44" cy="60" rx="24" ry="15" fill="rgba(100,140,200,0.5)" stroke="rgba(130,170,230,0.6)" stroke-width="2"/>
      <ellipse cx="82" cy="60" rx="22" ry="14" fill="rgba(100,140,200,0.48)" stroke="rgba(130,170,230,0.6)" stroke-width="2"/>
    </g>
    <line x1="42" y1="80" x2="36" y2="100" stroke="#4fc3f7" stroke-width="2.5" stroke-linecap="round" style="animation:iconRainDrop 1s ease-in infinite;animation-delay:0s"/>
    <line x1="58" y1="80" x2="52" y2="100" stroke="#4fc3f7" stroke-width="2.5" stroke-linecap="round" style="animation:iconRainDrop 1s ease-in infinite;animation-delay:0.2s"/>
    <line x1="74" y1="80" x2="68" y2="100" stroke="#4fc3f7" stroke-width="2.5" stroke-linecap="round" style="animation:iconRainDrop 1s ease-in infinite;animation-delay:0.4s"/>
    <line x1="50" y1="90" x2="44" y2="110" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" style="animation:iconRainDrop 1s ease-in infinite;animation-delay:0.6s" opacity="0.7"/>
    <line x1="66" y1="90" x2="60" y2="110" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" style="animation:iconRainDrop 1s ease-in infinite;animation-delay:0.8s" opacity="0.7"/>
  </svg>`,

  // ── Drizzle
  drizzle: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g style="animation:iconCloudDrift 5s ease-in-out infinite">
      <ellipse cx="60" cy="52" rx="30" ry="17" fill="rgba(120,170,220,0.4)" stroke="rgba(150,200,240,0.55)" stroke-width="2"/>
      <ellipse cx="44" cy="60" rx="22" ry="14" fill="rgba(120,170,220,0.45)" stroke="rgba(150,200,240,0.55)" stroke-width="2"/>
      <ellipse cx="78" cy="60" rx="20" ry="13" fill="rgba(120,170,220,0.42)" stroke="rgba(150,200,240,0.55)" stroke-width="2"/>
    </g>
    <circle cx="42" cy="88"  r="2.5" fill="#74cfe8" style="animation:iconRainDrop 1.5s ease-in infinite;animation-delay:0s" opacity="0.9"/>
    <circle cx="58" cy="85"  r="2"   fill="#74cfe8" style="animation:iconRainDrop 1.5s ease-in infinite;animation-delay:0.4s" opacity="0.75"/>
    <circle cx="72" cy="90"  r="2.5" fill="#74cfe8" style="animation:iconRainDrop 1.5s ease-in infinite;animation-delay:0.8s" opacity="0.9"/>
    <circle cx="50" cy="98"  r="2"   fill="#74cfe8" style="animation:iconRainDrop 1.5s ease-in infinite;animation-delay:1.1s" opacity="0.7"/>
    <circle cx="65" cy="100" r="2"   fill="#74cfe8" style="animation:iconRainDrop 1.5s ease-in infinite;animation-delay:0.2s" opacity="0.7"/>
  </svg>`,

  // ── Thunderstorm
  thunderstorm: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g style="animation:iconCloudDrift 4s ease-in-out infinite">
      <ellipse cx="60" cy="44" rx="34" ry="20" fill="rgba(60,50,100,0.7)" stroke="rgba(140,120,200,0.5)" stroke-width="2"/>
      <ellipse cx="40" cy="54" rx="26" ry="16" fill="rgba(60,50,100,0.75)" stroke="rgba(140,120,200,0.5)" stroke-width="2"/>
      <ellipse cx="82" cy="54" rx="24" ry="15" fill="rgba(60,50,100,0.72)" stroke="rgba(140,120,200,0.5)" stroke-width="2"/>
    </g>
    <polygon points="68,70 56,90 63,90 52,112 74,85 65,85" fill="#FFE55C" style="animation:iconLightning 2.5s ease-in-out infinite" filter="drop-shadow(0 0 8px #FFE55C)"/>
    <line x1="38" y1="78" x2="34" y2="96" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" style="animation:iconRainDrop 0.9s ease-in infinite;animation-delay:0.3s" opacity="0.8"/>
    <line x1="86" y1="78" x2="82" y2="96" stroke="#4fc3f7" stroke-width="2" stroke-linecap="round" style="animation:iconRainDrop 0.9s ease-in infinite;animation-delay:0.7s" opacity="0.8"/>
  </svg>`,

  // ── Snow
  snow: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g style="animation:iconCloudDrift 5s ease-in-out infinite">
      <ellipse cx="60" cy="50" rx="32" ry="18" fill="rgba(180,210,240,0.4)" stroke="rgba(210,235,255,0.6)" stroke-width="2"/>
      <ellipse cx="42" cy="59" rx="24" ry="15" fill="rgba(180,210,240,0.45)" stroke="rgba(210,235,255,0.6)" stroke-width="2"/>
      <ellipse cx="80" cy="59" rx="22" ry="14" fill="rgba(180,210,240,0.42)" stroke="rgba(210,235,255,0.6)" stroke-width="2"/>
    </g>
    <text x="40" y="92"  font-size="16" fill="#e8f4fd" style="animation:iconSnowDrift 2s linear infinite;animation-delay:0s;transform-origin:40px 88px"   text-anchor="middle" font-family="sans-serif">❄</text>
    <text x="62" y="96"  font-size="14" fill="#e8f4fd" style="animation:iconSnowDrift 2.5s linear infinite;animation-delay:0.7s;transform-origin:62px 90px" text-anchor="middle" font-family="sans-serif">❄</text>
    <text x="80" y="88"  font-size="12" fill="#e8f4fd" style="animation:iconSnowDrift 1.8s linear infinite;animation-delay:1.2s;transform-origin:80px 84px" text-anchor="middle" font-family="sans-serif">❄</text>
    <text x="52" y="108" font-size="10" fill="#cee8fb" style="animation:iconSnowDrift 2.2s linear infinite;animation-delay:0.4s;transform-origin:52px 104px" text-anchor="middle" font-family="sans-serif">❄</text>
  </svg>`,

  // ── Mist / Fog / Haze
  mist: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="22" y1="44" x2="98" y2="44" stroke="rgba(200,210,220,0.5)" stroke-width="4" stroke-linecap="round" style="animation:iconMistDrift 3s ease-in-out infinite"/>
    <line x1="14" y1="58" x2="106" y2="58" stroke="rgba(200,210,220,0.6)" stroke-width="5" stroke-linecap="round" style="animation:iconMistDrift 3.5s ease-in-out infinite;animation-delay:-1s"/>
    <line x1="22" y1="72" x2="98" y2="72" stroke="rgba(200,210,220,0.5)" stroke-width="4" stroke-linecap="round" style="animation:iconMistDrift 4s ease-in-out infinite;animation-delay:-2s"/>
    <line x1="30" y1="86" x2="90" y2="86" stroke="rgba(200,210,220,0.35)" stroke-width="3" stroke-linecap="round" style="animation:iconMistDrift 3.2s ease-in-out infinite;animation-delay:-0.5s"/>
  </svg>`,

  // ── Night Clear
  night_clear: `
  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M78 30 Q52 34 46 60 Q40 86 62 100 Q36 96 26 72 Q16 48 40 32 Q54 24 78 30Z" fill="#C8D8FF" opacity="0.9" style="animation:iconSunPulse 4s ease-in-out infinite"/>
    <circle cx="85" cy="28" r="3" fill="#fff" opacity="0.7" style="animation:iconSunPulse 2.5s ease-in-out infinite;animation-delay:0.3s"/>
    <circle cx="95" cy="45" r="2" fill="#fff" opacity="0.5" style="animation:iconSunPulse 3s ease-in-out infinite;animation-delay:0.8s"/>
    <circle cx="78" cy="50" r="2.5" fill="#fff" opacity="0.6" style="animation:iconSunPulse 2.8s ease-in-out infinite;animation-delay:1.2s"/>
  </svg>`,

};

/* ── Icon Code Mapping ─────────────────────────────────────── */
function getIconSvg(iconCode, conditionMain) {
  const n = iconCode && iconCode.endsWith('n');
  const cond = (conditionMain || '').toLowerCase();

  if (n && (cond === 'clear'))          return ICONS.night_clear;
  if (cond === 'clear')                 return ICONS.clear;
  if (cond === 'thunderstorm')          return ICONS.thunderstorm;
  if (cond === 'drizzle')               return ICONS.drizzle;
  if (cond === 'rain')                  return ICONS.rain;
  if (cond === 'snow')                  return ICONS.snow;
  if (['mist','fog','haze','smoke','dust','sand','ash','squall','tornado'].includes(cond)) return ICONS.mist;
  if (cond === 'clouds') {
    // few clouds vs broken
    if (iconCode === '02d' || iconCode === '02n') return ICONS.clouds_few;
    return ICONS.clouds;
  }
  return ICONS.clear; // fallback
}

/* ── Small icon for hourly / forecast (OWM img) ───────────── */
function getOWMIconUrl(code) {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
}

/* ═══════════════════════════════════════════════════════════
   Particle Wave System (Canvas-based)
   ═══════════════════════════════════════════════════════════ */
class ParticleWave {
  constructor(canvasId) {
    this.canvas  = document.getElementById(canvasId);
    this.ctx     = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse   = { x: -9999, y: -9999 };
    this.count   = 90;
    this.maxDist = 160;       // max line distance
    this.color   = '56,189,248';  // r,g,b string
    this.raf     = null;
    this.time    = 0;

    this._resize();
    this._initParticles();
    this._bindEvents();
    this._loop();
  }

  _resize() {
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  _initParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x:    Math.random() * this.canvas.width,
        y:    Math.random() * this.canvas.height,
        vx:   (Math.random() - 0.5) * 0.55,
        vy:   (Math.random() - 0.5) * 0.55,
        r:    Math.random() * 2.2 + 1,
        // wave parameters
        waveAmp:   Math.random() * 60 + 20,
        waveFreq:  Math.random() * 0.001 + 0.0005,
        wavePhase: Math.random() * Math.PI * 2,
        baseY:     0,  // set after placement
        opacity:   Math.random() * 0.5 + 0.3,
      });
      this.particles[i].baseY = this.particles[i].y;
    }
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this._resize();
      this._initParticles();
    });
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    document.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  setColor(rgbString) {
    // e.g. '56,189,248'
    this.color = rgbString;
  }

  _loop() {
    this.raf = requestAnimationFrame(() => this._loop());
    this.time++;
    this._draw();
  }

  _draw() {
    const ctx = this.ctx;
    const W   = this.canvas.width;
    const H   = this.canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Update + draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Wave motion on Y
      p.y = p.baseY + Math.sin(this.time * p.waveFreq * 60 + p.wavePhase) * p.waveAmp;

      // Drift
      p.x += p.vx;
      p.baseY += p.vy * 0.5;

      // Mouse repel
      const dx   = p.x - this.mouse.x;
      const dy   = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.x += dx * force * 0.04;
        p.baseY += dy * force * 0.04;
      }

      // Wrap edges
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.baseY < -20) p.baseY = H + 20;
      if (p.baseY > H + 20) p.baseY = -20;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${p.opacity})`;
      ctx.fill();

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const q    = this.particles[j];
        const ddx  = p.x - q.x;
        const ddy  = p.y - q.y;
        const d    = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < this.maxDist) {
          const alpha = (1 - d / this.maxDist) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${this.color},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }
}

/* ═══════════════════════════════════════════════════════════
   WeatherApp Class
   ═══════════════════════════════════════════════════════════ */
class WeatherApp {
  constructor() {
    // DOM refs
    this.body          = document.getElementById('app-body');
    this.searchInput   = document.getElementById('search-input');
    this.searchBox     = document.getElementById('search-box');
    this.searchClear   = document.getElementById('search-clear');
    this.searchBtn     = document.getElementById('search-btn');
    this.acList        = document.getElementById('autocomplete-list');
    this.geoBtn        = document.getElementById('geo-btn');
    this.loadingScreen = document.getElementById('loading-screen');
    this.weatherContent= document.getElementById('weather-content');
    this.errorToast    = document.getElementById('error-toast');
    this.errorMsg      = document.getElementById('error-msg');
    this.errorClose    = document.getElementById('error-close');

    // State
    this.debounceTimer   = null;
    this.acIndex         = -1;
    this.acItems         = [];
    this.clockInterval   = null;
    this.currentData     = null;
    this.errorTimeout    = null;
    this.initialized     = false;

    this._bindEvents();
    this._initAos();
    this.particles = new ParticleWave('particle-canvas');
    this._autoLoad();
  }

  /* ── Initialization ──────────────────────────────────────── */
  _initAos() {
    AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true, offset: 40 });
  }

  _bindEvents() {
    // Search input
    this.searchInput.addEventListener('input', () => this._onSearchInput());
    this.searchInput.addEventListener('keydown', (e) => this._onSearchKeydown(e));
    this.searchClear.addEventListener('click', () => this._clearSearch());
    this.searchBtn.addEventListener('click', () => this._searchCurrent());

    // Geo
    this.geoBtn.addEventListener('click', () => this._geoLocate());

    // Click outside autocomplete
    document.addEventListener('click', (e) => {
      if (!this.searchBox.contains(e.target) && !this.acList.contains(e.target)) {
        this._closeAc();
      }
    });

    // Error dismiss
    this.errorClose.addEventListener('click', () => this._hideError());
  }

  _autoLoad() {
    // Try geolocation first, then fallback to Mumbai
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          this.fetchWeather({ q: 'Mumbai' });
        },
        { timeout: 5000 }
      );
    } else {
      this.fetchWeather({ q: 'Mumbai' });
    }
  }

  /* ── Search Logic ────────────────────────────────────────── */
  _onSearchInput() {
    const val = this.searchInput.value.trim();
    this.searchClear.style.display = val ? 'flex' : 'none';

    clearTimeout(this.debounceTimer);
    if (val.length < 2) { this._closeAc(); return; }

    this.debounceTimer = setTimeout(() => this._fetchAutocomplete(val), 300);
  }

  _onSearchKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.acIndex >= 0 && this.acItems[this.acIndex]) {
        this._selectAcItem(this.acItems[this.acIndex]);
      } else {
        this._searchCurrent();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this._moveAc(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this._moveAc(-1);
    } else if (e.key === 'Escape') {
      this._closeAc();
      this.searchInput.blur();
    }
  }

  _clearSearch() {
    this.searchInput.value = '';
    this.searchClear.style.display = 'none';
    this._closeAc();
    this.searchInput.focus();
  }

  _searchCurrent() {
    const val = this.searchInput.value.trim();
    if (!val) return;
    this._closeAc();
    this.fetchWeather({ q: val });
  }

  async _fetchAutocomplete(query) {
    try {
      const url = `${OWM_BASE}/geo/1.0/direct`;
      const res = await fetch(`${url}?q=${encodeURIComponent(query)}&limit=6&appid=${API_KEY}`);
      const data = await res.json();
      
      const results = [];
      const seen = new Set();
      
      data.forEach(item => {
        const key = `${item.name}-${item.country}`;
        if (!seen.has(key)) {
          seen.add(key);
          results.push({
            name: item.name,
            country: item.country,
            state: item.state || '',
            lat: item.lat,
            lon: item.lon,
            label: `${item.name}, ${item.state ? item.state + ' ' : ''}${item.country}`
          });
        }
      });
      
      this._renderAc(results);
    } catch (_) {
      this._closeAc();
    }
  }

  _renderAc(items) {
    this.acItems = items;
    this.acIndex = -1;
    this.acList.innerHTML = '';

    if (!items || items.length === 0) { this._closeAc(); return; }

    items.forEach((item, i) => {
      const li = document.createElement('li');
      li.className = 'autocomplete-item';
      li.setAttribute('role', 'option');
      li.setAttribute('id', `ac-item-${i}`);
      li.innerHTML = `
        <svg class="ac-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
        <span class="ac-name">${this._esc(item.name)}</span>
        <span class="ac-sub">${this._esc(item.state ? item.state + ', ' : '')}${this._esc(item.country)}</span>
      `;
      li.addEventListener('click', () => this._selectAcItem(item));
      li.addEventListener('mouseenter', () => {
        this.acIndex = i;
        this._highlightAc();
      });
      this.acList.appendChild(li);
    });

    this.acList.classList.add('open');
  }

  _moveAc(dir) {
    if (!this.acItems.length) return;
    this.acIndex = Math.max(-1, Math.min(this.acItems.length - 1, this.acIndex + dir));
    this._highlightAc();
  }

  _highlightAc() {
    Array.from(this.acList.children).forEach((el, i) => {
      el.classList.toggle('active', i === this.acIndex);
    });
  }

  _selectAcItem(item) {
    this.searchInput.value = item.label || item.name;
    this.searchClear.style.display = 'flex';
    this._closeAc();
    this.fetchWeather({ lat: item.lat, lon: item.lon });
  }

  _closeAc() {
    this.acList.classList.remove('open');
    this.acItems = [];
    this.acIndex = -1;
  }

  /* ── Geo Locate ──────────────────────────────────────────── */
  _geoLocate() {
    if (!navigator.geolocation) {
      this._showError('Geolocation is not supported by your browser.');
      retucoords;

      // Get coordinates from city name or use provided coords
      if (params.lat != null && params.lon != null) {
        coords = { lat: params.lat, lon: params.lon };
      } else if (params.q) {
        const geoUrl = `${OWM_BASE}/geo/1.0/direct`;
        const geoRes = await fetch(`${geoUrl}?q=${encodeURIComponent(params.q)}&limit=1&appid=${API_KEY}`);
        const geoData = await geoRes.json();
        
        if (!geoData || geoData.length === 0) {
          this._showError('City not found');
          this._hideLoading();
          return;
        }
        
        coords = { lat: geoData[0].lat, lon: geoData[0].lon };
      } else {
        this._showError('Provide city or coordinates');
        this._hideLoading();
        return;
      }

      // Fetch current weather
      const weatherUrl = `${OWM_BASE}/data/2.5/weather`;
      const weatherRes = await fetch(`${weatherUrl}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`);
      const weatherData = await weatherRes.json();

      // Fetch 5-day forecast
      const forecastUrl = `${OWM_BASE}/data/2.5/forecast`;
      const forecastRes = await fetch(`${forecastUrl}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric`);
      const forecastData = await forecastRes.json();

      if (!weatherRes.ok || !forecastRes.ok) {
        this._showError('Failed to fetch weather data');
        this._hideLoading();
        return;
      }

      // Transform data
      const processed = this._processWeatherData(weatherData, forecastData);
      this.currentData = processed;
      this._render(processed);
    } catch (err) {
      console.error(err);
      this._showError('Network error. Please check your connection.');
      this._hideLoading();
    }
  }

  /* ── Process Weather Data ────────────────────────────────── */
  _processWeatherData(current, forecast) {
    // Current weather
    const curr = {
      city: current.name,
      country: current.sys.country,
      temp: Math.round(current.main.temp),
      feels_like: Math.round(current.main.feels_like),
      condition_main: current.weather[0].main,
      description: current.weather[0].description,
      icon: current.weather[0].icon,
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      wind_speed: Math.round(current.wind.speed * 10) / 10,
      wind_deg: current.wind.deg,
      wind_dir: this._windDirection(current.wind.deg),
      clouds: current.clouds.all,
      visibility: Math.round(current.visibility / 1000 * 10) / 10,
      sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timezone_offset: current.timezone
    };

    // Hourly forecast (next 24 hours)
    const hourly = [];
    const forecastList = forecast.list.slice(0, 8);
    forecastList.forEach(item => {
      hourly.push({
        time: new Date(item.dt * 1000).getHours(),
        temp: Math.round(item.main.temp),
        icon: item.weather[0].icon,
        pop: Math.round(item.pop * 100)
      });
    });

    // 5-day forecast
    const forecastByDay = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!forecastByDay[date]) {
        forecastByDay[date] = [];
      }
      forecastByDay[date].push(item);
    });

    const dailyForecast = Object.values(forecastByDay).slice(0, 5).map(dayItems => {
      const temps = dayItems.map(it => it.main.temp);
      return {
        date: new Date(dayItems[0].dt * 1000),
        temp_max: Math.round(Math.max(...temps)),
        temp_min: Math.round(Math.min(...temps)),
        condition: dayItems[0].weather[0].main,
        description: dayItems[0].weather[0].description,
        icon: dayItems[0].weather[0].icon,
        pop: Math.round(dayItems.reduce((a, it) => a + it.pop, 0) / dayItems.length * 100)
      };
    });

    return {
      current: curr,
      hourly: hourly,
      forecast: dailyForecast
    };
  }

  _windDirection(degrees) {
    const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const idx = Math.round(degrees / 22.5) % 16;
    return dirs[idx]; if (params.lat != null && params.lon != null) {
        url += `lat=${params.lat}&lon=${params.lon}`;
      } else {
        url += `q=${encodeURIComponent(params.q)}`;
      }

      const res  = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        this._showError(data.error || 'Failed to fetch weather data.');
        this._hideLoading();
        return;
      }

      this.currentData = data;
      this._render(data);
    } catch (err) {
      this._showError('Network error. Please check your connection.');
      this._hideLoading();
    }
  }

  /* ── Render All ──────────────────────────────────────────── */
  _render(data) {
    // Pull real daily hi/lo from today's forecast (more accurate than current weather)
    const todayFc = data.forecast && data.forecast[0];
    const dayMin  = todayFc ? todayFc.temp_min : null;
    const dayMax  = todayFc ? todayFc.temp_max : null;

    this._renderCurrent(data.current, dayMin, dayMax);
    this._renderHourly(data.hourly);
    this._renderForecast(data.forecast);
    this._updateBackground(data.current.condition_main);
    this._hideLoading();
    this._showContent();

    if (!this.initialized) {
      this.initialized = true;
      this._runEntranceAnimation();
    }

    this._startClock(data.current.timezone_offset);
    AOS.refresh();
  }

  /* ── Current Weather ─────────────────────────────────────── */
  _renderCurrent(c, dayMin, dayMax) {
    document.getElementById('city-name').textContent    = c.city;
    document.getElementById('country-name').textContent = c.country;
    document.getElementById('hero-temp').innerHTML      = `${c.temp}<sup>°C</sup>`;
    document.getElementById('hero-description').textContent = c.description;
    document.getElementById('feels-like').textContent   = c.feels_like;

    // Show hi/lo range only when they meaningfully differ
    const rangeEl = document.querySelector('.hero-temp-range');
    const hiEl    = document.getElementById('temp-max');
    const loEl    = document.getElementById('temp-min');
    if (dayMax !== null && dayMin !== null && dayMax !== dayMin) {
      if (hiEl) hiEl.textContent = `H: ${dayMax}°`;
      if (loEl) loEl.textContent = `L: ${dayMin}°`;
      if (rangeEl) rangeEl.style.display = '';
    } else {
      if (rangeEl) rangeEl.style.display = 'none';
    }

    // Big animated icon
    document.getElementById('weather-icon-big').innerHTML = getIconSvg(c.icon, c.condition_main);

    // Details tiles
    this._setVal('d-humidity',   c.humidity);
    this._setVal('d-wind',       c.wind_speed);
    this._setVal('d-pressure',   c.pressure);
    this._setVal('d-visibility', c.visibility);
    this._setVal('d-sunrise',    c.sunrise);
    this._setVal('d-sunset',     c.sunset);
    this._setVal('d-clouds',     c.clouds);
    this._setVal('d-condition',  c.description);
    this._setVal('d-wind-dir',   `${c.wind_dir} · ${c.wind_deg}°`);

    // Animated progress bars
    setTimeout(() => {
      const hBar = document.getElementById('humidity-bar');
      const cBar = document.getElementById('clouds-bar');
      if (hBar) hBar.style.width = `${c.humidity}%`;
      if (cBar) cBar.style.width = `${c.clouds}%`;
    }, 400);
  }

  /* ── Hourly ──────────────────────────────────────────────── */
  _renderHourly(hourly) {
    const strip = document.getElementById('hourly-strip');
    strip.innerHTML = '';
    const nowHour = new Date().getHours();

    hourly.forEach((h, i) => {
      const card = document.createElement('div');
      card.className = 'hourly-card fade-in';
      card.style.animationDelay = `${i * 0.05}s`;

      const isNow = i === 0;
      if (isNow) card.classList.add('current-hour');

      const popHtml = h.pop > 0
        ? `<div class="hourly-pop"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6 10 4 14 4 17a8 8 0 0 0 16 0c0-3-2-7-8-15z"/></svg>${h.pop}%</div>`
        : '';

      card.innerHTML = `
        <div class="hourly-time">${isNow ? 'Now' : h.time}</div>
        <img class="hourly-icon" src="${getOWMIconUrl(h.icon)}" alt="${this._esc(h.description)}" loading="lazy"/>
        <div class="hourly-temp">${h.temp}°</div>
        ${popHtml}
      `;
      strip.appendChild(card);
    });
  }

  /* ── 5-Day Forecast ──────────────────────────────────────── */
  _renderForecast(forecast) {
    const container = document.getElementById('forecast-cards');
    container.innerHTML = '';

    forecast.forEach((day, i) => {
      const card = document.createElement('div');
      card.className = 'forecast-card';
      if (i === 0) card.classList.add('today');

      const popHtml = day.pop > 0
        ? `<div class="forecast-pop"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6 10 4 14 4 17a8 8 0 0 0 16 0c0-3-2-7-8-15z"/></svg>${day.pop}%</div>`
        : '';

      card.innerHTML = `
        <div class="forecast-day">${i === 0 ? 'Today' : day.short_day}</div>
        <div class="forecast-date">${day.date}</div>
        <img class="forecast-icon" src="${getOWMIconUrl(day.icon)}" alt="${this._esc(day.description)}" loading="lazy"/>
        <div class="forecast-desc">${this._esc(day.description)}</div>
        <div class="forecast-temps">
          <span class="fc-max">${day.temp_max}°</span>
          <span class="fc-min">${day.temp_min}°</span>
        </div>
        ${popHtml}
      `;
      container.appendChild(card);
    });

    // GSAP stagger — works regardless of scroll position
    gsap.from('#forecast-cards .forecast-card', {
      y: 28, opacity: 0, duration: 0.55,
      stagger: 0.07, ease: 'power2.out',
      delay: 0.1, clearProps: 'all'
    });
  }

  /* ── Background Theme ────────────────────────────────────── */
  _updateBackground(condition) {
    const cls = 'weather-' + (condition || 'clear').toLowerCase();
    const validClasses = [
      'weather-clear','weather-clouds','weather-rain','weather-drizzle',
      'weather-thunderstorm','weather-snow','weather-mist','weather-fog',
      'weather-haze','weather-smoke','weather-dust','weather-sand',
      'weather-ash','weather-squall','weather-tornado'
    ];
    validClasses.forEach(c => this.body.classList.remove(c));
    const active = validClasses.includes(cls) ? cls : 'weather-clear';
    this.body.classList.add(active);
    // Sync particle color to the new weather theme
    requestAnimationFrame(() => {
      const raw = getComputedStyle(document.body).getPropertyValue('--particle-color').trim();
      const m   = raw.match(/\d+/g);
      if (m && m.length >= 3) this.particles.setColor(`${m[0]},${m[1]},${m[2]}`);
    });
  }

  /* ── Live Clock ──────────────────────────────────────────── */
  _startClock(timezoneOffset) {
    if (this.clockInterval) clearInterval(this.clockInterval);
    const update = () => {
      const utcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
      const local  = new Date(utcMs + timezoneOffset * 1000);
      const h = String(local.getHours()).padStart(2, '0');
      const m = String(local.getMinutes()).padStart(2, '0');
      const s = String(local.getSeconds()).padStart(2, '0');
      document.getElementById('live-time').textContent = `${h}:${m}:${s}`;
      document.getElementById('live-date').textContent = local.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
      });
    };
    update();
    this.clockInterval = setInterval(update, 1000);
  }

  /* ── GSAP Entrance Animation ─────────────────────────────── */
  _runEntranceAnimation() {
    gsap.from('#hero-section', {
      y: 40, opacity: 0, duration: 0.9,
      ease: 'power3.out', clearProps: 'all'
    });
    gsap.from('.detail-tile', {
      y: 30, opacity: 0, duration: 0.7,
      stagger: 0.06, ease: 'power2.out',
      delay: 0.3, clearProps: 'all'
    });
  }

  /* ── Loading / Content Helpers ───────────────────────────── */
  _showLoading() {
    this.loadingScreen.style.display = 'flex';
    this.weatherContent.style.display = 'none';
  }

  _hideLoading() {
    this.loadingScreen.style.display = 'none';
  }

  _showContent() {
    this.weatherContent.style.display = 'block';
  }

  /* ── Error Toast ─────────────────────────────────────────── */
  _showError(msg) {
    this.errorMsg.textContent = msg;
    this.errorToast.classList.add('show');
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => this._hideError(), 5000);
  }

  _hideError() {
    this.errorToast.classList.remove('show');
  }

  /* ── Utilities ───────────────────────────────────────────── */
  _setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '—';
  }

  _esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
}

/* ── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  window.skyWatchApp = new WeatherApp();
});
