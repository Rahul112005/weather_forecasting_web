
const API_KEY  = '65cd5ed6ec1043571124abe7a044bf9c';     
const USE_API  = true;                     
const UNITS    = 'metric';                 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';



const canvas = document.getElementById('starfield');
const ctx    = canvas.getContext('2d');
let stars    = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 220 }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    r:  Math.random() * 1.3 + 0.2,
    a:  Math.random(),
    da: (Math.random() - 0.5) * 0.004
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, '#04080f');
  g.addColorStop(1, '#0a1422');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.a += s.da;
    if (s.a <= 0 || s.a >= 1) s.da *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(200,216,240,${s.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();



function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toUTCString().split(' ').slice(1, 5).join(' ');
  const h   = now.getHours() + now.getMinutes() / 60;
  const pct = Math.max(0, Math.min(100, ((h - 6) / 14.5) * 100));
  document.getElementById('sunProgress').style.width = pct + '%';
  document.getElementById('sunNow').textContent =
    now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
setInterval(updateClock, 1000);
updateClock();



function drawGauge(id, value, max, c1, c2) {
  const el  = document.getElementById(id);
  const cx  = el.getContext('2d');
  const W = el.width, H = el.height;
  const cx0 = W / 2, cy0 = H / 2, r = W / 2 - 9;
  const sA = Math.PI * 0.75, eA = Math.PI * 2.25;
  const fA = sA + Math.min(value / max, 1) * (eA - sA);

  cx.clearRect(0, 0, W, H);

  cx.beginPath(); cx.arc(cx0, cy0, r, sA, eA);
  cx.strokeStyle = '#112040'; cx.lineWidth = 6; cx.lineCap = 'round'; cx.stroke();

  const g = cx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  cx.beginPath(); cx.arc(cx0, cy0, r, sA, fA);
  cx.strokeStyle = g; cx.lineWidth = 6; cx.lineCap = 'round'; cx.stroke();

  for (let i = 0; i <= 10; i++) {
    const a = sA + (i / 10) * (eA - sA);
    cx.beginPath();
    cx.moveTo(cx0 + (r-9) * Math.cos(a), cy0 + (r-9) * Math.sin(a));
    cx.lineTo(cx0 + (r-5) * Math.cos(a), cy0 + (r-5) * Math.sin(a));
    cx.strokeStyle = i % 5 === 0 ? '#3a5a8a' : '#1e3050';
    cx.lineWidth   = i % 5 === 0 ? 1.5 : 1; cx.stroke();
  }

  cx.beginPath(); cx.arc(cx0, cy0, 4, 0, Math.PI * 2);
  cx.fillStyle = c2; cx.shadowColor = c2; cx.shadowBlur = 8; cx.fill(); cx.shadowBlur = 0;
}


/* ══════════════════════════════════════════════════════════
   SVG WEATHER ICONS
   ══════════════════════════════════════════════════════════ */
const icons = {
  CLEAR:  `<svg viewBox="0 0 24 24" fill="none" stroke="#f5a623" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  SUNNY:  `<svg viewBox="0 0 24 24" fill="none" stroke="#ffcc44" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  PARTLY: `<svg viewBox="0 0 24 24" fill="none" stroke="#6fa3d8" stroke-width="1.5"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  CLOUDY: `<svg viewBox="0 0 24 24" fill="none" stroke="#5a7aaa" stroke-width="1.5"><path d="M17 8h1a4 4 0 0 1 0 8h-1M3 12a4 4 0 0 1 7.5-1.8A3.5 3.5 0 1 1 12 16H3a4 4 0 0 1 0-8z"/></svg>`,
  RAIN:   `<svg viewBox="0 0 24 24" fill="none" stroke="#4ea3ff" stroke-width="1.5"><path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 15.9"/><line x1="8" y1="19" x2="8" y2="21"/><line x1="8" y1="13" x2="8" y2="15"/><line x1="16" y1="19" x2="16" y2="21"/><line x1="16" y1="13" x2="16" y2="15"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="12" y1="15" x2="12" y2="17"/></svg>`,
  SNOW:   `<svg viewBox="0 0 24 24" fill="none" stroke="#c8d8f0" stroke-width="1.5"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><line x1="8" y1="16" x2="8" y2="21"/><line x1="8" y1="16" x2="5" y2="13"/><line x1="8" y1="16" x2="11" y2="13"/><line x1="16" y1="16" x2="16" y2="21"/><line x1="16" y1="16" x2="13" y2="13"/><line x1="16" y1="16" x2="19" y2="13"/></svg>`
};

function getIcon(cond) {
  const k = cond.toUpperCase();
  if (k.includes('SNOW'))                              return icons.SNOW;
  if (k.includes('RAIN') || k.includes('SHOWER'))     return icons.RAIN;
  if (k.includes('SUNNY'))                             return icons.SUNNY;
  if (k.includes('CLEAR'))                             return icons.CLEAR;
  if (k.includes('PARTLY') || k.includes('P.CLOUDY')) return icons.PARTLY;
  return icons.CLOUDY;
}

/* Map OpenWeatherMap condition codes → our icon keys */
function owmCodeToCondition(id) {
  if (id >= 200 && id < 300) return 'THUNDERSTORM';
  if (id >= 300 && id < 400) return 'RAIN';
  if (id >= 500 && id < 600) return 'RAIN';
  if (id >= 600 && id < 700) return 'SNOW';
  if (id >= 700 && id < 800) return 'HAZY';
  if (id === 800)             return 'CLEAR';
  if (id === 801)             return 'PARTLY CLOUDY';
  if (id >= 802)              return 'CLOUDY';
  return 'CLOUDY';
}

/* Convert wind degrees → compass direction */
function degreesToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

/* Convert Unix timestamp + offset → "HH:MM" */
function unixToTime(unix, offsetSec) {
  const d = new Date((unix + offsetSec) * 1000);
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;
}


/* ══════════════════════════════════════════════════════════
   ② API FUNCTIONS
   ══════════════════════════════════════════════════════════ */

/**
 * Fetch current weather from OpenWeatherMap for a city name.
 * Returns a normalised data object compatible with renderCity().
 */
async function fetchCurrentWeather(cityName) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${UNITS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  const j = await res.json();

  return {
    // Coordinates
    lat:      j.coord.lat,
    lon:      j.coord.lon,
    // Temperature
    temp:     Math.round(j.main.temp),
    feels:    Math.round(j.main.feels_like),
    lo:       Math.round(j.main.temp_min),
    hi:       Math.round(j.main.temp_max),
    hum:      j.main.humidity,
    pressure: j.main.pressure,
    // Wind
    wind:     Math.round(j.wind.speed * 3.6),   // m/s → km/h
    wdir:     degreesToCompass(j.wind.deg || 0),
    // Visibility (API returns metres)
    vis:      Math.round((j.visibility || 10000) / 1000),
    // Dew point approximation
    dew:      Math.round(j.main.temp - ((100 - j.main.humidity) / 5)),
    // Condition
    cond:     owmCodeToCondition(j.weather[0].id),
    // Sun times (localised to city timezone)
    sunrise:  unixToTime(j.sys.sunrise, j.timezone),
    sunset:   unixToTime(j.sys.sunset,  j.timezone),
    // Placeholders — filled by forecast fetch or defaults
    uv:       0,
    rain:     j.rain ? +(j.rain['1h'] || j.rain['3h'] || 0).toFixed(1) : 0,
    aq:       0,
    // API source flag
    _live: true
  };
}

/**
 * Fetch 5-day / 3-hour forecast and return arrays for hourly + weekly display.
 */
async function fetchForecast(cityName) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=${UNITS}&cnt=40`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast API error ${res.status}`);
  const j = await res.json();
  return j.list;   // Array of 3-hour forecast entries
}

/**
 * Fetch Air Quality Index from OpenWeatherMap Air Pollution API.
 */
async function fetchAQI(lat, lon) {
  const url = `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const j = await res.json();
  // OWM AQI scale: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
  // Map to a 0-300 US-style AQI approximation
  const scale = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
  return scale[j.list[0].main.aqi] || 50;
}


/* ══════════════════════════════════════════════════════════
   LOADING & ERROR UI
   ══════════════════════════════════════════════════════════ */
function showLoading() {
  document.getElementById('cityName').textContent   = 'LOADING...';
  document.getElementById('tempBig').textContent    = '--';
  document.getElementById('condBadge').innerHTML    = '<span style="opacity:.5">FETCHING DATA</span>';
  document.getElementById('cityCoords').textContent = 'Contacting weather servers…';
}

function showError(msg) {
  document.getElementById('cityName').textContent   = 'ERROR';
  document.getElementById('tempBig').textContent    = '!';
  document.getElementById('condBadge').innerHTML    =
    `<span style="color:#f56c6c">⚠ ${msg}</span>`;
  document.getElementById('cityCoords').textContent = 'Falling back to static data…';
}

function showAPIBadge(isLive) {
  const existing = document.getElementById('api-badge');
  if (existing) existing.remove();

  const badge = document.createElement('div');
  badge.id = 'api-badge';
  badge.style.cssText = `
    position: fixed; bottom: 18px; right: 22px; z-index: 9998;
    font-family: 'Share Tech Mono', monospace; font-size: .65rem;
    padding: 5px 12px; border-radius: 2px; letter-spacing: .1em;
    border: 1px solid ${isLive ? '#6fcba0' : '#5a7aaa'};
    background: ${isLive ? 'rgba(111,203,160,.1)' : 'rgba(90,122,170,.1)'};
    color: ${isLive ? '#6fcba0' : '#5a7aaa'};
    pointer-events: none;
  `;
  badge.textContent = isLive ? '⬤  LIVE DATA' : '⬤  STATIC DATA';
  document.body.appendChild(badge);
}


/* ══════════════════════════════════════════════════════════
   STATIC FALLBACK DATA
   ══════════════════════════════════════════════════════════ */
const cities = {
  // ── Global ──
  'New York':  { lat: 40.71,  lon: -74.00, temp: 28, lo: 19, hi: 31, feels: 25, hum: 62, wind: 18, wdir: 'SW', pressure: 1013, uv: 6,  vis: 14, dew: 19, rain: 2.4,  aq: 42,  cond: 'PARTLY CLOUDY', sunrise: '06:12', sunset: '20:34' },
  'London':    { lat: 51.50,  lon:  -0.12, temp: 14, lo: 10, hi: 17, feels: 12, hum: 78, wind: 22, wdir: 'W',  pressure: 1008, uv: 3,  vis:  9, dew: 10, rain: 8.1,  aq: 38,  cond: 'OVERCAST',      sunrise: '05:44', sunset: '20:18' },
  'Tokyo':     { lat: 35.68,  lon: 139.69, temp: 31, lo: 26, hi: 34, feels: 35, hum: 70, wind: 12, wdir: 'SE', pressure: 1010, uv: 8,  vis: 12, dew: 24, rain: 1.2,  aq: 55,  cond: 'CLEAR',          sunrise: '04:50', sunset: '18:55' },
  'Dubai':     { lat: 25.20,  lon:  55.27, temp: 41, lo: 36, hi: 44, feels: 48, hum: 45, wind:  8, wdir: 'NW', pressure: 1005, uv: 11, vis: 18, dew: 22, rain: 0.0,  aq: 62,  cond: 'SUNNY',          sunrise: '06:03', sunset: '19:28' },
  'Sydney':    { lat:-33.86,  lon: 151.20, temp: 24, lo: 18, hi: 27, feels: 23, hum: 66, wind: 20, wdir: 'NE', pressure: 1018, uv: 5,  vis: 16, dew: 17, rain: 4.5,  aq: 29,  cond: 'SHOWERS',        sunrise: '07:10', sunset: '17:48' },
  'Reykjavik': { lat: 64.12,  lon: -21.82, temp:  6, lo:  2, hi:  9, feels:  2, hum: 85, wind: 35, wdir: 'N',  pressure:  990, uv: 1,  vis:  5, dew:  4, rain: 12.0, aq: 15,  cond: 'SNOW',           sunrise: '08:40', sunset: '17:10' },
  // ── Indian Cities ──
  'Mumbai':    { lat: 19.08,  lon:  72.88, temp: 33, lo: 27, hi: 36, feels: 40, hum: 82, wind: 16, wdir: 'SW', pressure: 1008, uv: 9,  vis:  8, dew: 28, rain: 6.5,  aq: 88,  cond: 'HUMID & HAZY',   sunrise: '06:08', sunset: '19:02' },
  'Delhi':     { lat: 28.61,  lon:  77.21, temp: 38, lo: 28, hi: 42, feels: 44, hum: 35, wind: 14, wdir: 'NW', pressure: 1002, uv: 10, vis:  6, dew: 18, rain: 0.2,  aq: 156, cond: 'HAZY',            sunrise: '05:42', sunset: '19:18' },
  'Bengaluru': { lat: 12.97,  lon:  77.59, temp: 28, lo: 20, hi: 31, feels: 29, hum: 60, wind: 10, wdir: 'SE', pressure: 1013, uv: 8,  vis: 14, dew: 19, rain: 3.2,  aq: 62,  cond: 'PARTLY CLOUDY',  sunrise: '06:10', sunset: '18:38' },
  'Chennai':   { lat: 13.08,  lon:  80.27, temp: 36, lo: 29, hi: 38, feels: 42, hum: 75, wind: 18, wdir: 'SE', pressure: 1006, uv: 10, vis:  9, dew: 29, rain: 1.8,  aq: 74,  cond: 'SUNNY',           sunrise: '05:58', sunset: '18:30' },
  'Kolkata':   { lat: 22.57,  lon:  88.36, temp: 34, lo: 26, hi: 37, feels: 41, hum: 78, wind: 12, wdir: 'S',  pressure: 1005, uv: 9,  vis:  7, dew: 27, rain: 8.0,  aq: 112, cond: 'CLOUDY',          sunrise: '05:15', sunset: '18:22' },
  'Hyderabad': { lat: 17.39,  lon:  78.49, temp: 35, lo: 24, hi: 38, feels: 38, hum: 45, wind: 12, wdir: 'W',  pressure: 1008, uv: 10, vis: 12, dew: 20, rain: 0.5,  aq: 68,  cond: 'CLEAR',           sunrise: '06:02', sunset: '18:42' },
  'Jaipur':    { lat: 26.91,  lon:  75.79, temp: 40, lo: 28, hi: 44, feels: 46, hum: 22, wind: 18, wdir: 'NW', pressure: 1000, uv: 11, vis: 10, dew: 14, rain: 0.0,  aq: 92,  cond: 'SUNNY & DRY',     sunrise: '05:52', sunset: '19:08' },
  'Ahmedabad': { lat: 23.02,  lon:  72.57, temp: 39, lo: 27, hi: 43, feels: 45, hum: 28, wind: 16, wdir: 'NW', pressure: 1001, uv: 11, vis: 11, dew: 16, rain: 0.0,  aq: 98,  cond: 'SUNNY',           sunrise: '06:20', sunset: '19:20' },
  'Pune':      { lat: 18.52,  lon:  73.86, temp: 30, lo: 22, hi: 33, feels: 32, hum: 58, wind:  8, wdir: 'W',  pressure: 1010, uv: 8,  vis: 15, dew: 20, rain: 2.4,  aq: 55,  cond: 'PARTLY CLOUDY',  sunrise: '06:12', sunset: '18:52' },
  'Varanasi':  { lat: 25.32,  lon:  82.97, temp: 37, lo: 27, hi: 41, feels: 43, hum: 40, wind: 10, wdir: 'E',  pressure: 1003, uv: 10, vis:  8, dew: 21, rain: 0.8,  aq: 130, cond: 'HAZY',            sunrise: '05:28', sunset: '18:44' }
};


/* ══════════════════════════════════════════════════════════
   HOURLY & WEEKLY STATIC HELPERS
   ══════════════════════════════════════════════════════════ */
const hourConds = ['CLEAR','CLEAR','PARTLY','PARTLY','CLOUDY','CLOUDY','RAIN','RAIN','PARTLY','CLEAR','CLEAR','SUNNY','PARTLY','CLOUDY','RAIN','PARTLY','CLEAR','CLEAR','PARTLY','CLOUDY','CLOUDY','PARTLY','CLEAR','CLEAR'];
const weekDays  = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const weekDescs = ['Partly Cloudy','Overcast & Rain','Thunderstorms','Clearing Skies','Sunny Intervals','Mostly Sunny','Clear Skies'];
const weekConds = ['PARTLY','RAIN','RAIN','PARTLY','SUNNY','SUNNY','CLEAR'];


/* ══════════════════════════════════════════════════════════
   RENDER — PAINT UI WITH DATA OBJECT
   ══════════════════════════════════════════════════════════ */
function renderCity(name, d) {
  if (!d) d = cities[name] || cities['Mumbai'];

  // Header
  document.getElementById('cityName').textContent = name.toUpperCase();
  const latStr = `${Math.abs(d.lat).toFixed(2)}°${d.lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(d.lon).toFixed(2)}°${d.lon >= 0 ? 'E' : 'W'}`;
  document.getElementById('cityCoords').textContent =
    `${latStr} / ${lonStr} · ELEVATION ${Math.round(Math.abs(d.lat))}m`;

  // Temperature
  document.getElementById('tempBig').textContent   = d.temp;
  document.getElementById('feelsLike').textContent = d.feels + '°';
  document.getElementById('hiTemp').textContent    = d.hi + '°';
  document.getElementById('loTemp').textContent    = d.lo + '°';
  document.getElementById('humidity').textContent  = d.hum + '%';
  document.getElementById('condBadge').innerHTML   = `${getIcon(d.cond)} ${d.cond}`;

  // Gauges
  document.getElementById('windVal').innerHTML  = `${d.wind} <span class="gauge-unit">km/h</span>`;
  document.getElementById('pressVal').innerHTML = `${d.pressure} <span class="gauge-unit">hPa</span>`;
  document.getElementById('uvVal').innerHTML    = `${d.uv} <span class="gauge-unit">idx</span>`;
  document.getElementById('visVal').innerHTML   = `${d.vis} <span class="gauge-unit">km</span>`;

  drawGauge('g-wind',     d.wind,           60, '#1a4a9e', '#4ea3ff');
  drawGauge('g-pressure', d.pressure - 950, 80, '#2a6a4a', '#6fcba0');
  drawGauge('g-uv',       d.uv,             12, '#7a3a00', '#f5a623');
  drawGauge('g-vis',      d.vis,            20, '#4a1a6a', '#c46eff');

  // Stats
  document.getElementById('statDew').innerHTML       = `${d.dew}<span class="stat-suffix">°C</span>`;
  document.getElementById('statWind').textContent    = d.wdir;
  document.getElementById('statWindSub').textContent = `Gusts up to ${d.wind + 10} km/h`;
  document.getElementById('statRain').innerHTML      = `${d.rain}<span class="stat-suffix">mm</span>`;
  document.getElementById('statAQ').innerHTML        = `${d.aq}<span class="stat-suffix"> AQI</span>`;
  document.getElementById('statAQsub').textContent   =
    d.aq < 50  ? 'Good — Low health risk' :
    d.aq < 100 ? 'Moderate — Acceptable'  :
    d.aq < 150 ? 'Unhealthy for sensitive groups' : 'Unhealthy — Limit outdoor activity';

  // Sun times
  document.getElementById('sunriseTime').textContent = d.sunrise;
  document.getElementById('sunsetTime').textContent  = d.sunset;

  buildHourly(d.temp, d._forecastList || null);
  buildWeekly(d.lo, d.hi, d._forecastList || null);
}


/* ══════════════════════════════════════════════════════════
   BUILD HOURLY STRIP
   ══════════════════════════════════════════════════════════ */
function buildHourly(base, forecastList) {
  const strip = document.getElementById('hourlyStrip');
  strip.innerHTML = '';

  if (forecastList && forecastList.length > 0) {
    // ── Live API hourly data ──
    forecastList.slice(0, 24).forEach((item, i) => {
      const dt    = new Date(item.dt * 1000);
      const label = i === 0 ? 'NOW' : `${String(dt.getHours()).padStart(2,'0')}:00`;
      const temp  = Math.round(item.main.temp);
      const cond  = owmCodeToCondition(item.weather[0].id);
      const rain  = item.rain ? `${+(item.rain['3h'] || 0).toFixed(1)}mm` : '—';
      const el    = document.createElement('div');
      el.className = 'hour-card';
      el.style.animationDelay = `${i * 0.04}s`;
      el.innerHTML =
        `<div class="hour-time">${label}</div>` +
        `<div class="hour-icon">${getIcon(cond)}</div>` +
        `<div class="hour-temp">${temp}°</div>` +
        `<div class="hour-rain">${rain}</div>`;
      strip.appendChild(el);
    });
  } else {
    // ── Static fallback hourly ──
    const now = new Date().getHours();
    for (let i = 0; i < 24; i++) {
      const h     = (now + i) % 24;
      const label = i === 0 ? 'NOW' : `${String(h).padStart(2,'0')}:00`;
      const temp  = Math.round(base + Math.sin((h - 14) * Math.PI / 12) * 5 + (Math.random() - 0.5) * 2);
      const cond  = hourConds[h];
      const rain  = cond === 'RAIN' ? `${(Math.random() * 4 + 0.5).toFixed(1)}mm` : '—';
      const el    = document.createElement('div');
      el.className = 'hour-card';
      el.style.animationDelay = `${i * 0.04}s`;
      el.innerHTML =
        `<div class="hour-time">${label}</div>` +
        `<div class="hour-icon">${getIcon(cond)}</div>` +
        `<div class="hour-temp">${temp}°</div>` +
        `<div class="hour-rain">${rain}</div>`;
      strip.appendChild(el);
    }
  }
}


/* ══════════════════════════════════════════════════════════
   BUILD WEEKLY TABLE
   ══════════════════════════════════════════════════════════ */
function buildWeekly(lo, hi, forecastList) {
  const tbl = document.getElementById('weekTable');
  tbl.innerHTML = '';

  if (forecastList && forecastList.length >= 8) {
    // ── Live API: group 3-hour slots into daily summaries ──
    const days = {};
    forecastList.forEach(item => {
      const d   = new Date(item.dt * 1000);
      const key = d.toLocaleDateString('en-GB', { weekday: 'long' });
      if (!days[key]) days[key] = { temps: [], conds: [], rain: 0 };
      days[key].temps.push(item.main.temp);
      days[key].conds.push(item.weather[0].id);
      days[key].rain += item.rain ? (item.rain['3h'] || 0) : 0;
    });

    Object.entries(days).slice(0, 7).forEach(([day, data]) => {
      const dlo    = Math.round(Math.min(...data.temps));
      const dhi    = Math.round(Math.max(...data.temps));
      const rng    = Math.max(dhi - dlo, 1);
      const barW   = Math.round((rng / Math.max(hi - lo + 1, 1)) * 55 + 20);
      const cond   = owmCodeToCondition(data.conds[Math.floor(data.conds.length / 2)]);
      const precip = data.rain > 0 ? `${data.rain.toFixed(1)}mm` : '—';
      tbl.innerHTML +=
        `<tr>
          <td class="day-name">${day}</td>
          <td class="day-icon">${getIcon(cond)}</td>
          <td class="day-desc">${cond}</td>
          <td class="day-bar-wrap"><div class="day-bar-track"><div class="day-bar-fill" style="width:${barW}%"></div></div></td>
          <td class="day-lo">${dlo}°</td>
          <td class="day-hi">${dhi}°</td>
          <td class="day-precip">${precip}</td>
        </tr>`;
    });
  } else {
    // ── Static fallback weekly ──
    weekDays.forEach((day, i) => {
      const dlo  = lo + Math.round((Math.random() - 0.4) * 5);
      const dhi  = hi + Math.round((Math.random() - 0.5) * 5);
      const barW = Math.round((Math.max(dhi - dlo, 1) / Math.max(hi - lo + 1, 1)) * 55 + 20);
      const precip = Math.random() > 0.5 ? `${(Math.random() * 9).toFixed(1)}mm` : '—';
      tbl.innerHTML +=
        `<tr>
          <td class="day-name">${day}</td>
          <td class="day-icon">${getIcon(weekConds[i])}</td>
          <td class="day-desc">${weekDescs[i]}</td>
          <td class="day-bar-wrap"><div class="day-bar-track"><div class="day-bar-fill" style="width:${barW}%"></div></div></td>
          <td class="day-lo">${dlo}°</td>
          <td class="day-hi">${dhi}°</td>
          <td class="day-precip">${precip}</td>
        </tr>`;
    });
  }
}


/* ══════════════════════════════════════════════════════════
   ③ MAIN LOAD FUNCTION — API or static depending on USE_API
   ══════════════════════════════════════════════════════════ */
async function loadCity(name) {
  if (!USE_API || API_KEY === 'YOUR_API_KEY_HERE') {
    // Static / demo mode
    renderCity(name, cities[name] || null);
    showAPIBadge(false);
    return;
  }

  showLoading();

  try {
    // Fetch current weather + forecast in parallel
    const [current, forecastList] = await Promise.all([
      fetchCurrentWeather(name),
      fetchForecast(name)
    ]);

    // Fetch AQI separately (non-blocking)
    try {
      current.aq = await fetchAQI(current.lat, current.lon) || 0;
    } catch (_) {
      current.aq = 0;
    }

    // Attach forecast list for hourly/weekly builders
    current._forecastList = forecastList;

    // Cache in cities object for instant re-render on tab re-click
    cities[name] = current;

    renderCity(name, current);
    showAPIBadge(true);

  } catch (err) {
    console.error('API fetch failed:', err);
    showError(err.message);

    // Graceful fallback to static data after 1.5 s
    setTimeout(() => {
      renderCity(name, cities[name] || null);
      showAPIBadge(false);
    }, 1500);
  }
}


/* ══════════════════════════════════════════════════════════
   CITY SELECTION & SEARCH
   ══════════════════════════════════════════════════════════ */
function selectCity(btn, name) {
  document.querySelectorAll('.city-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadCity(name);
}

function changeCity() {
  const val = document.getElementById('cityInput').value.trim();
  if (!val) return;

  // Try to match against known cities first
  const match = Object.keys(cities).find(c =>
    c.toLowerCase().includes(val.toLowerCase())
  );

  document.querySelectorAll('.city-tab').forEach(b => b.classList.remove('active'));

  if (match) {
    loadCity(match);
  } else {
    // Unknown city — try live API, or generate random static
    if (USE_API && API_KEY !== 'YOUR_API_KEY_HERE') {
      loadCity(val);
    } else {
      const t = Math.round(Math.random() * 42 - 5);
      cities[val] = {
        lat: +(Math.random() * 160 - 80).toFixed(2),
        lon: +(Math.random() * 360 - 180).toFixed(2),
        temp: t, lo: t - 8, hi: t + 6, feels: t - 2,
        hum: Math.round(50 + Math.random() * 40),
        wind: Math.round(5 + Math.random() * 40),
        wdir: ['N','NE','E','SE','S','SW','W','NW'][Math.floor(Math.random() * 8)],
        pressure: Math.round(990 + Math.random() * 30),
        uv: Math.round(Math.random() * 12),
        vis: Math.round(5 + Math.random() * 20),
        dew: Math.round(t * 0.7),
        rain: +(Math.random() * 12).toFixed(1),
        aq: Math.round(Math.random() * 100),
        cond: ['CLEAR','PARTLY CLOUDY','CLOUDY','RAIN','SUNNY'][Math.floor(Math.random() * 5)],
        sunrise: '06:20', sunset: '19:45'
      };
      renderCity(val, cities[val]);
      showAPIBadge(false);
    }
  }

  document.getElementById('cityInput').value = '';
}

document.getElementById('cityInput')
  .addEventListener('keydown', e => { if (e.key === 'Enter') changeCity(); });


/* ══════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════ */
loadCity('Mumbai');