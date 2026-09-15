// ============================================================
// 📄 Layout — Top Navbar + Global Helpers + Pro CSS
// ============================================================
export function getLayout(title, content, active) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — C2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --bg-0: #000000;
  --bg-1: #08080c;
  --bg-2: #0f0f18;
  --bg-3: #1a1a2e;
  --border: #1a1a2e;
  --border-hi: #2a2a44;
  --text: #ffffff;
  --text-dim: #8888aa;
  --text-mute: #444466;
  --accent-red: #ff0040;
  --accent-blue: #0066ff;
  --accent-cyan: #00ffff;
  --green: #00ff88;
  --yellow: #ffcc00;
  --orange: #ff6600;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-sans: 'Inter', -apple-system, sans-serif;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  height: 100%; width: 100%;
  background: var(--bg-0); color: var(--text);
  font-family: var(--font-sans); font-size: 14px;
  overflow-x: hidden;
}

/* ═══════════════════════════════════════════════════════
   BACKGROUND
   ═══════════════════════════════════════════════════════ */
body::before {
  content: '';
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(0, 102, 255, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(255, 0, 64, 0.12) 0%, transparent 50%);
  z-index: -2;
  animation: bgPulse 8s ease-in-out infinite;
  pointer-events: none;
}
@keyframes bgPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
body::after {
  content: '';
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-image:
    linear-gradient(rgba(0, 102, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 102, 255, 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1;
  animation: gridMove 15s linear infinite;
  pointer-events: none;
}
@keyframes gridMove {
  0% { background-position: 0 0; }
  100% { background-position: 50px 50px; }
}

/* ═══════════════════════════════════════════════════════
   LAYOUT
   ═══════════════════════════════════════════════════════ */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════════════════
   TOP NAVBAR
   ═══════════════════════════════════════════════════════ */
.navbar {
  background: rgba(15, 15, 24, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  height: 60px;
}
.navbar::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--accent-blue) 20%, 
    var(--accent-red) 50%, 
    var(--accent-blue) 80%, 
    transparent 100%);
  background-size: 200% 100%;
  animation: navScan 6s linear infinite;
  opacity: 0.6;
}
@keyframes navScan {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.nav-logo {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: var(--accent-red);
  letter-spacing: 3px;
  text-shadow: 0 0 15px var(--accent-red);
  padding-right: 24px;
  border-right: 1px solid var(--border-hi);
  margin-right: 24px;
  position: relative;
  animation: logoPulse 3s ease-in-out infinite;
  white-space: nowrap;
}
@keyframes logoPulse {
  0%, 100% { text-shadow: 0 0 15px var(--accent-red); }
  50% { text-shadow: 0 0 25px var(--accent-red), 0 0 40px var(--accent-red); }
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}
.nav-links a {
  padding: 10px 18px;
  color: var(--text-dim);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.nav-icon {
  font-size: 14px;
  transition: all 0.3s;
  filter: grayscale(1);
  opacity: 0.6;
}
.nav-links a:hover .nav-icon {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.2) rotate(5deg);
}
.nav-links a.active .nav-icon {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.15);
}
.nav-links a::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(0, 102, 255, 0.15) 0%, 
    rgba(0, 102, 255, 0.05) 100%);
  transform: translateY(100%);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}
.nav-links a:hover::before {
  transform: translateY(0);
}
.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-cyan));
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform: translateX(-50%);
}
.nav-links a:hover::after {
  width: 80%;
}
.nav-links a:hover {
  color: var(--text);
  transform: translateY(-2px);
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
}
.nav-links a.active {
  background: rgba(0, 102, 255, 0.12);
  color: var(--accent-red);
  font-weight: 700;
  text-shadow: 0 0 15px var(--accent-red);
  box-shadow: 
    inset 0 0 20px rgba(255, 0, 64, 0.1),
    0 0 20px rgba(255, 0, 64, 0.15);
}
.nav-links a.active::before {
  background: linear-gradient(135deg, 
    rgba(255, 0, 64, 0.2) 0%, 
    rgba(255, 0, 64, 0.05) 100%);
  transform: translateY(0);
}
.nav-links a.active::after {
  width: 80%;
  background: linear-gradient(90deg, var(--accent-red), var(--accent-blue));
  background-size: 200% 100%;
  animation: activeUnderline 2s linear infinite;
}
@keyframes activeUnderline {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

.logout-btn {
  background: rgba(255, 0, 64, 0.1);
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  padding: 8px 18px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border-radius: 6px;
  letter-spacing: 2px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}
.logout-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}
.logout-btn:hover::before {
  left: 100%;
}
.logout-btn:hover {
  background: var(--accent-red);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(255, 0, 64, 0.6);
}

/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */
.main {
  flex: 1;
  padding: 24px;
  position: relative;
  animation: mainFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes mainFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ═══════════════════════════════════════════════════════
   PAGE HEADER
   ═══════════════════════════════════════════════════════ */
.page-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 700;
  color: var(--accent-red);
  letter-spacing: 3px;
  text-shadow: 0 0 20px var(--accent-red);
  animation: titleGlow 4s ease-in-out infinite;
}
@keyframes titleGlow {
  0%, 100% { text-shadow: 0 0 20px var(--accent-red); }
  50% { text-shadow: 0 0 30px var(--accent-red), 0 0 50px var(--accent-red); }
}
.page-subtitle {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  margin-top: 3px;
  letter-spacing: 1px;
}

/* ═══════════════════════════════════════════════════════
   STATS GRID
   ═══════════════════════════════════════════════════════ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}
.stat-card {
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  border: 1px solid var(--border-hi);
  padding: 18px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
  opacity: 0.5;
}
.stat-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-blue);
  box-shadow: 0 10px 40px rgba(0, 102, 255, 0.2);
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-mute);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 8px;
}
.stat-value {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: 700;
  color: var(--text);
  line-height: 1;
}
.stat-value.green { color: var(--green); text-shadow: 0 0 15px var(--green); }
.stat-value.red { color: var(--accent-red); text-shadow: 0 0 15px var(--accent-red); }
.stat-value.yellow { color: var(--yellow); text-shadow: 0 0 15px var(--yellow); }
.stat-change {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-mute);
  margin-top: 6px;
  letter-spacing: 1px;
}

/* ═══════════════════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════════════════ */
.card {
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  border: 1px solid var(--border);
  padding: 18px;
  border-radius: 10px;
  position: relative;
}

/* ═══════════════════════════════════════════════════════
   LOADING
   ═══════════════════════════════════════════════════════ */
.loading {
  color: var(--text-mute);
  text-align: center;
  padding: 20px;
  font-family: var(--font-mono);
  font-size: 12px;
}

/* ═══════════════════════════════════════════════════════
   DEVICES GRID
   ═══════════════════════════════════════════════════════ */
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}
.device-card {
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  border: 1px solid var(--border-hi);
  border-radius: 12px;
  padding: 16px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
}
.device-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 3px;
  height: 100%;
  background: var(--accent-red);
  opacity: 0.5;
}
.device-card.online::before { background: var(--green); opacity: 1; }
.device-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent-blue);
  box-shadow: 0 15px 40px rgba(0, 102, 255, 0.2);
}
.device-name {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.device-status {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
}
.device-status.online { background: rgba(0, 255, 136, 0.15); color: var(--green); }
.device-status.offline { background: rgba(255, 0, 64, 0.15); color: var(--accent-red); }
.device-info {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.8;
  margin-top: 12px;
}
.device-info strong { color: var(--text-mute); }
.device-actions {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}
.device-action-btn {
  flex: 1;
  padding: 6px 10px;
  background: var(--bg-3);
  border: 1px solid var(--border-hi);
  color: var(--text-dim);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.2s;
}
.device-action-btn:hover {
  background: var(--accent-blue);
  color: #fff;
  border-color: var(--accent-blue);
}
.device-action-btn.pin.active {
  background: var(--yellow);
  color: #000;
  border-color: var(--yellow);
}
.device-action-btn.danger {
  background: rgba(255, 0, 64, 0.1);
  color: var(--accent-red);
  border-color: var(--accent-red);
}
.device-action-btn.danger:hover {
  background: var(--accent-red);
  color: #fff;
}

/* ═══════════════════════════════════════════════════════
   FILTER BAR
   ═══════════════════════════════════════════════════════ */
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}
.search-input {
  flex: 1;
  padding: 10px 14px;
  background: var(--bg-1);
  border: 1px solid var(--border-hi);
  border-radius: 8px;
  color: var(--accent-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
  outline: none;
  transition: all 0.2s;
}
.search-input:focus {
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
}
.filter-btn {
  padding: 10px 16px;
  background: var(--bg-2);
  border: 1px solid var(--border-hi);
  color: var(--text-dim);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.2s;
}
.filter-btn:hover {
  color: var(--text);
  border-color: var(--accent-blue);
}
.filter-btn.active {
  background: rgba(0, 102, 255, 0.15);
  color: var(--accent-blue);
  border-color: var(--accent-blue);
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.3);
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════ */
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .navbar { padding: 8px 12px; height: auto; flex-wrap: wrap; gap: 8px; }
  .nav-logo { border-right: none; margin-right: 0; font-size: 14px; padding-right: 0; }
  .nav-links { order: 3; width: 100%; overflow-x: auto; padding-bottom: 4px; }
  .nav-links a { padding: 8px 12px; font-size: 11px; }
  .logout-btn { padding: 6px 12px; font-size: 10px; }
}
@media (max-width: 600px) {
  .stats-grid { grid-template-columns: 1fr; }
  .main { padding: 12px; }
  .nav-links a span:not(.nav-icon) { display: none; }
  .nav-links a { padding: 8px 12px; }
}
</style>
</head>
<body>
<div class="layout">
  
  <!-- ═══════════════════════════════════════════════════════
       TOP NAVBAR
       ═══════════════════════════════════════════════════════ -->
  <nav class="navbar">
    <div class="nav-logo">C2 PANEL</div>
    
    <div class="nav-links">
      <a href="/dashboard" class="${active === 'dashboard' ? 'active' : ''}">
        <span class="nav-icon">📊</span>
        <span>Dashboard</span>
      </a>
      <a href="/world" class="${active === 'world' ? 'active' : ''}">
        <span class="nav-icon">🌍</span>
        <span>World</span>
      </a>
      <a href="/devices" class="${active === 'devices' ? 'active' : ''}">
        <span class="nav-icon">💻</span>
        <span>Devices</span>
      </a>
      <a href="/folderz" class="${active === 'folderz' ? 'active' : ''}">
        <span class="nav-icon">📁</span>
        <span>Folderz</span>
      </a>
      <a href="/terminal" class="${active === 'terminal' ? 'active' : ''}">
        <span class="nav-icon">⌨️</span>
        <span>Terminal</span>
      </a>
    </div>
    
    <button class="logout-btn" onclick="logout()">
      <span>🚪</span>
      <span>LOGOUT</span>
    </button>
  </nav>
  
  <!-- ═══════════════════════════════════════════════════════
       MAIN CONTENT
       ═══════════════════════════════════════════════════════ -->
  <main class="main">
    ${content}
  </main>
  
</div>

<script>
// ═══════════════════════════════════════════════════════
// 🚪 LOGOUT
// ═══════════════════════════════════════════════════════
async function logout() {
  localStorage.removeItem('_session_lock');
  localStorage.removeItem('_auth_state');
  try {
    await fetch('/api/logout');
  } catch (e) {}
  window.location.href = '/';
}

// ═══════════════════════════════════════════════════════
// 🛡️ GLOBAL HELPERS
// ═══════════════════════════════════════════════════════
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

function formatTime(ms) {
  if (!ms) return 'never';
  var elapsed = Math.floor((Date.now() - ms) / 1000);
  if (elapsed < 60) return elapsed + 's ago';
  if (elapsed < 3600) return Math.floor(elapsed / 60) + 'm ago';
  if (elapsed < 86400) return Math.floor(elapsed / 3600) + 'h ago';
  return Math.floor(elapsed / 86400) + 'd ago';
}

function getPingClass(ping, isOnline) {
  if (!isOnline) return 'ping-offline';
  if (ping === null || ping === undefined) return 'ping-offline';
  if (ping < 100) return 'ping-good';
  if (ping < 400) return 'ping-ok';
  if (ping < 700) return 'ping-mid';
  return 'ping-bad';
}

// ═══════════════════════════════════════════════════════
// ⌨️ KEYBOARD SHORTCUTS
// ═══════════════════════════════════════════════════════
document.addEventListener('keydown', function(e) {
  if (e.altKey) {
    if (e.key === '1') window.location.href = '/dashboard';
    if (e.key === '2') window.location.href = '/world';
    if (e.key === '3') window.location.href = '/devices';
    if (e.key === '4') window.location.href = '/folderz';
    if (e.key === '5') window.location.href = '/terminal';
  }
});

console.log('[LAYOUT] Loaded - title:', '${title}', '- active:', '${active}');
</script>
</body>
</html>`;
}
