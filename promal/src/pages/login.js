// ============================================================
// 🔐 Login Page — Smart Lock + Master Key Input
// ============================================================
export function getLoginPage() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Sign In</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #e8e8e8;
    color: #333;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .login-container {
    width: 100%;
    max-width: 380px;
    background: #ffffff;
    border: 1px solid #cccccc;
    padding: 30px 25px;
  }
  .login-title {
    text-align: center;
    font-size: 22px;
    color: #333;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .login-subtitle {
    text-align: center;
    font-size: 12px;
    color: #888;
    margin-bottom: 25px;
  }
  .input-group { margin-bottom: 15px; }
  .input-group label {
    display: block;
    font-size: 13px;
    color: #555;
    margin-bottom: 5px;
  }
  .input-group input {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #cccccc;
    background: #ffffff;
    color: #333;
    font-size: 14px;
    font-family: Arial, sans-serif;
    outline: none;
  }
  .input-group input:focus { border-color: #888; }
  .input-group input:disabled {
    background: #f0f0f0;
    color: #aaa;
  }
  .login-btn {
    width: 100%;
    padding: 10px;
    background: #e0e0e0;
    border: 1px solid #bbbbbb;
    color: #333;
    font-size: 14px;
    font-family: Arial, sans-serif;
    cursor: pointer;
    margin-top: 5px;
  }
  .login-btn:hover { background: #d0d0d0; }
  .login-btn:active { background: #c0c0c0; }
  .login-btn:disabled {
    background: #eaeaea;
    color: #aaa;
    cursor: not-allowed;
  }
  .error-msg {
    margin-top: 12px;
    padding: 8px;
    background: #ffeeee;
    border: 1px solid #ffbbbb;
    color: #cc0000;
    font-size: 13px;
    text-align: center;
    display: none;
  }
  .error-msg.show { display: block; }
  .lock-msg {
    margin-top: 15px;
    padding: 12px;
    background: #fff4e0;
    border: 1px solid #ffcc88;
    color: #cc6600;
    font-size: 13px;
    text-align: center;
    display: none;
    font-weight: bold;
  }
  .lock-msg.show { display: block; }
  .lock-msg.danger {
    background: #ffeeee;
    border-color: #ffbbbb;
    color: #cc0000;
  }
  .login-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 11px;
    color: #999;
  }

  /* ═══════════════════════════════════════════════════════
     Master Key Section (Hidden by default)
     ═══════════════════════════════════════════════════════ */
  .master-section {
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed #dddddd;
    display: none;
  }
  .master-section.show {
    display: block;
  }
  .master-label {
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
    text-align: center;
  }
  .master-input {
    width: 100%;
    padding: 8px 10px;
    border: 1px dashed #cccccc;
    background: #fafafa;
    color: #666;
    font-size: 13px;
    font-family: Arial, sans-serif;
    outline: none;
    text-align: center;
  }
  .master-input:focus {
    border-color: #888;
    background: #ffffff;
  }
  .master-btn {
    width: 100%;
    padding: 8px;
    background: #f0f0f0;
    border: 1px solid #cccccc;
    color: #555;
    font-size: 13px;
    font-family: Arial, sans-serif;
    cursor: pointer;
    margin-top: 8px;
  }
  .master-btn:hover { background: #e0e0e0; }
  .toggle-master {
    display: block;
    text-align: center;
    margin-top: 15px;
    font-size: 11px;
    color: #aaaaaa;
    cursor: pointer;
    text-decoration: underline;
  }
  .toggle-master:hover { color: #666; }
</style>
</head>
<body>

<div class="login-container">
  <div class="login-title">Sign In</div>
  <div class="login-subtitle">Please enter your credentials</div>

  <div class="input-group">
    <label for="userField">Username or Email</label>
    <input type="text" id="userField" name="user_field" placeholder="Enter username or email" autocomplete="off" autofocus>
  </div>

  <div class="input-group">
    <label for="passField">Password</label>
    <input type="password" id="passField" name="pass_field" placeholder="Enter password" autocomplete="off">
  </div>

  <button class="login-btn" id="loginBtn" onclick="doLogin()">
    Sign In
  </button>

  <div class="error-msg" id="errorMsg"></div>
  <div class="lock-msg" id="lockMsg"></div>

  <!-- ═══════════════════════════════════════════════════════
       🔑 Master Key Section (Hidden, toggle to show)
       ═══════════════════════════════════════════════════════ -->
  <div class="master-section" id="masterSection">
    <div class="master-label">Access Code</div>
    <input type="password" id="masterField" class="master-input" placeholder="Enter access code" autocomplete="off">
    <button class="master-btn" onclick="doMasterLogin()">
      Unlock
    </button>
  </div>

  <span class="toggle-master" onclick="toggleMaster()" id="toggleText">
    ▸ Need access code?
  </span>

  <div class="login-footer">
    © ${new Date().getFullYear()} — All rights reserved
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════
// 🔑 MASTER KEY (Base64)
// ═══════════════════════════════════════════════════════════
const MASTER_KEY = "bWFzdGVyLTIwMjYtYXltZW4=";  // "master-2026-aymen"

// ═══════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════
const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 10 * 1000;
const SESSION_LOCK_KEY = '_session_lock';

let attempts = 0;
let lockedUntil = 0;
let sessionLocked = false;
let lockTimer = null;

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
function loadState() {
  try {
    if (localStorage.getItem(SESSION_LOCK_KEY)) {
      sessionLocked = true;
      return;
    }
    const state = JSON.parse(localStorage.getItem('_auth_state') || '{}');
    attempts = state.attempts || 0;
    lockedUntil = state.lockedUntil || 0;
  } catch (e) {
    attempts = 0;
    lockedUntil = 0;
    sessionLocked = false;
  }
}

function saveState() {
  try {
    localStorage.setItem('_auth_state', JSON.stringify({
      attempts: attempts,
      lockedUntil: lockedUntil
    }));
  } catch (e) {}
}

function lockSession() {
  try {
    localStorage.setItem(SESSION_LOCK_KEY, '1');
    sessionLocked = true;
  } catch (e) {}
}

function unlockSession() {
  try {
    localStorage.removeItem(SESSION_LOCK_KEY);
    localStorage.removeItem('_auth_state');
    sessionLocked = false;
    attempts = 0;
    lockedUntil = 0;
  } catch (e) {}
}

function isLocked() {
  return Date.now() < lockedUntil;
}

function getRemainingSeconds() {
  const ms = lockedUntil - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / 1000);
}

// ═══════════════════════════════════════════════════════════
// 🔑 MASTER KEY FUNCTIONS
// ═══════════════════════════════════════════════════════════
function toggleMaster() {
  const section = document.getElementById('masterSection');
  const toggleText = document.getElementById('toggleText');
  if (section.classList.contains('show')) {
    section.classList.remove('show');
    toggleText.textContent = '▸ Need access code?';
  } else {
    section.classList.add('show');
    toggleText.textContent = '▾ Hide access code';
    setTimeout(() => document.getElementById('masterField').focus(), 100);
  }
}

function isMasterKey(input) {
  try {
    const decoded = atob(MASTER_KEY);
    return input === decoded;
  } catch (e) {
    return false;
  }
}

async function doMasterLogin() {
  const masterField = document.getElementById('masterField');
  const masterVal = masterField.value.trim();

  if (!masterVal) {
    showError('Please enter access code');
    return;
  }

  // التحقق من Master Key
  if (!isMasterKey(masterVal)) {
    showError('Invalid access code');
    return;
  }

  // ✅ Master Key صحيح — دخول مباشر
  unlockSession();

  // طلب جلسة من السيرفر
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_field: '',
        pass_field: masterVal
      })
    });
    const data = await res.json();

    if (data.status === 'ok') {
      // قفل الجلسة
      lockSession();

      const btn = document.getElementById('loginBtn');
      btn.textContent = 'Master Access';
      btn.style.background = '#e0ffe0';

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    } else {
      showError('Access denied by server');
    }
  } catch (e) {
    showError('Network error');
  }
}

// ═══════════════════════════════════════════════════════════
// LOGIN (Normal)
// ═══════════════════════════════════════════════════════════
async function doLogin() {
  if (sessionLocked) {
    showSessionLock();
    return;
  }
  if (isLocked()) {
    showLock();
    return;
  }

  const userInput = document.getElementById('userField');
  const passInput = document.getElementById('passField');
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('errorMsg');

  const userVal = userInput.value.trim();
  const passVal = passInput.value.trim();

  if (!userVal) { showError('Please enter username or email'); return; }
  if (!passVal) { showError('Please enter password'); return; }

  btn.disabled = true;
  btn.textContent = 'Signing in...';
  err.classList.remove('show');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_field: userVal,
        pass_field: passVal
      })
    });
    const data = await res.json();

    if (data.status === 'ok') {
      attempts = 0;
      lockedUntil = 0;
      saveState();
      lockSession();

      btn.textContent = 'Success';
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    } else {
      attempts++;
      saveState();

      if (attempts >= MAX_ATTEMPTS) {
        lockedUntil = Date.now() + LOCK_DURATION;
        saveState();
        showLock();
        disableForm();
        startLockTimer();
      } else {
        const remaining = MAX_ATTEMPTS - attempts;
        showError('Invalid credentials. ' + remaining + ' attempt(s) remaining.');
        resetBtn();
      }
    }
  } catch (e) {
    showError('Network error. Please try again.');
    resetBtn();
  }
}

// ═══════════════════════════════════════════════════════════
// UI HELPERS
// ═══════════════════════════════════════════════════════════
function showError(msg) {
  const err = document.getElementById('errorMsg');
  err.textContent = msg;
  err.classList.add('show');
}

function showLock() {
  const lockMsg = document.getElementById('lockMsg');
  const err = document.getElementById('errorMsg');
  err.classList.remove('show');
  const sec = getRemainingSeconds();
  lockMsg.textContent = 'Too many failed attempts. Try again in ' + sec + 's.';
  lockMsg.classList.add('show');
  lockMsg.classList.remove('danger');
  disableForm();
}

function showSessionLock() {
  const lockMsg = document.getElementById('lockMsg');
  const err = document.getElementById('errorMsg');
  err.classList.remove('show');
  lockMsg.textContent = 'Session locked. Another user is logged in.';
  lockMsg.classList.add('show');
  lockMsg.classList.add('danger');
  disableForm();
  document.getElementById('loginBtn').textContent = 'Locked';
}

function disableForm() {
  document.getElementById('userField').disabled = true;
  document.getElementById('passField').disabled = true;
  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  if (!sessionLocked) btn.textContent = 'Locked';
}

function enableForm() {
  document.getElementById('userField').disabled = false;
  document.getElementById('passField').disabled = false;
  const btn = document.getElementById('loginBtn');
  btn.disabled = false;
  btn.textContent = 'Sign In';
}

function resetBtn() {
  const btn = document.getElementById('loginBtn');
  btn.disabled = false;
  btn.textContent = 'Sign In';
}

// ═══════════════════════════════════════════════════════════
// TIMER
// ═══════════════════════════════════════════════════════════
function startLockTimer() {
  if (lockTimer) clearInterval(lockTimer);
  lockTimer = setInterval(() => {
    if (!isLocked()) {
      clearInterval(lockTimer);
      lockTimer = null;
      attempts = 0;
      lockedUntil = 0;
      saveState();
      document.getElementById('lockMsg').classList.remove('show');
      enableForm();
      document.getElementById('userField').focus();
      return;
    }
    const sec = getRemainingSeconds();
    document.getElementById('lockMsg').textContent =
      'Too many failed attempts. Try again in ' + sec + 's.';
  }, 1000);
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
window.addEventListener('load', () => {
  loadState();
  if (sessionLocked) {
    showSessionLock();
    return;
  }
  if (isLocked()) {
    showLock();
    startLockTimer();
    return;
  }
  setTimeout(() => document.getElementById('userField').focus(), 100);
});

// Enter key
document.getElementById('userField').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') document.getElementById('passField').focus();
});
document.getElementById('passField').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') doLogin();
});
document.getElementById('masterField').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') doMasterLogin();
});
</script>
</body>
</html>`;
}
