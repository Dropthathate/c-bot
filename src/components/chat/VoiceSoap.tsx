<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SomaSync AI - Professional Documentation System</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --primary: #1e40af;
      --primary-light: #3b82f6;
      --accent: #0ea5e9;
      --success: #059669;
      --warning: #d97706;
      --danger: #dc2626;
      --bg: #0f172a;
      --bg-card: #1e293b;
      --bg-elevated: #334155;
      --border: #334155;
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --shadow: 0 20px 25px -5px rgb(0 0 0 / 0.4);
    }

    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: var(--text);
      min-height: 100vh;
    }

    .app {
      display: grid;
      grid-template-columns: 380px 1fr;
      height: 100vh;
      max-width: 2000px;
      margin: 0 auto;
    }

    /* SIDEBAR */
    .sidebar {
      background: var(--bg-card);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .sidebar::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 300px;
      background: linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
      pointer-events: none;
    }

    .header {
      padding: 24px;
      border-bottom: 1px solid var(--border);
      position: relative;
      z-index: 1;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
    }

    .logo-img {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary-light), var(--accent));
      padding: 2px;
    }

    .logo-img img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 10px;
      background: var(--bg-card);
    }

    .logo-info {
      flex: 1;
    }

    .logo-title {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: -0.3px;
      background: linear-gradient(135deg, var(--text), var(--text-muted));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .logo-subtitle {
      font-size: 11px;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }

    .status-card {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.1));
      border: 1px solid rgba(59, 130, 246, 0.2);
      border-radius: 14px;
      padding: 16px 18px;
      display: flex;
      align-items: center;
      gap: 12px;
      backdrop-filter: blur(10px);
    }

    .status-pulse {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--text-muted);
      position: relative;
    }

    .status-pulse.active {
      background: var(--success);
      box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7);
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0% {
        box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(5, 150, 105, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(5, 150, 105, 0);
      }
    }

    .status-pulse.paused { background: var(--warning); }
    .status-pulse.generating { background: var(--accent); }

    .status-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
    }

    /* CONTROLS */
    .controls {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
      z-index: 1;
    }

    .btn {
      width: 100%;
      padding: 14px 20px;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
      transform: translateX(-100%);
      transition: transform 0.6s;
    }

    .btn:hover::before {
      transform: translateX(100%);
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }

    .btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none !important;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary-light), var(--accent));
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .btn-warning {
      background: linear-gradient(135deg, #f59e0b, var(--warning));
      color: white;
    }

    .btn-danger {
      background: linear-gradient(135deg, #ef4444, var(--danger));
      color: white;
    }

    .btn-secondary {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      color: var(--text);
    }

    /* TRANSCRIPT */
    .transcript-section {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }

    .section-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-header::before {
      content: '';
      width: 3px;
      height: 14px;
      background: linear-gradient(180deg, var(--primary-light), var(--accent));
      border-radius: 2px;
    }

    .transcript-item {
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 10px;
      transition: all 0.2s;
    }

    .transcript-item:hover {
      border-color: rgba(59, 130, 246, 0.3);
      background: rgba(59, 130, 246, 0.05);
    }

    .transcript-meta {
      font-size: 10px;
      color: var(--text-muted);
      margin-bottom: 6px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .transcript-text {
      font-size: 13px;
      line-height: 1.6;
      color: var(--text);
    }

    /* MAIN */
    .main {
      background: var(--bg);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .main::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 50%;
      height: 50%;
      background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent);
      pointer-events: none;
    }

    .topbar {
      padding: 24px 36px;
      border-bottom: 1px solid var(--border);
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(10px);
      position: relative;
      z-index: 1;
    }

    .topbar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .topbar-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, var(--text), var(--text-muted));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .topbar-badge {
      background: linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(14, 165, 233, 0.2));
      border: 1px solid rgba(5, 150, 105, 0.3);
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--success);
    }

    .topbar-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .content {
      flex: 1;
      padding: 36px;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }

    .soap-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      max-width: 1600px;
      margin: 0 auto;
    }

    .soap-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      min-height: 200px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .soap-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, transparent, currentColor, transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }

    .soap-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow);
      border-color: rgba(59, 130, 246, 0.4);
    }

    .soap-card:hover::before {
      opacity: 0.5;
    }

    .subjective { color: #3b82f6; }
    .objective { color: #10b981; }
    .assessment { color: #8b5cf6; }
    .plan { color: #f59e0b; }

    .soap-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }

    .soap-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: currentColor;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 800;
      opacity: 0.9;
    }

    .soap-label {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }

    .soap-body {
      font-size: 14px;
      line-height: 1.8;
      color: var(--text);
      white-space: pre-wrap;
    }

    .billing-card {
      grid-column: 1 / -1;
      background: linear-gradient(135deg, var(--bg-card), var(--bg-elevated));
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .billing-section {
      margin-bottom: 24px;
    }

    .billing-section:last-child {
      margin-bottom: 0;
    }

    .billing-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 12px;
    }

    .code-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .code-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      transition: all 0.2s;
    }

    .code-chip:hover {
      border-color: var(--primary-light);
      background: rgba(59, 130, 246, 0.05);
    }

    .code-number {
      font-weight: 700;
      color: var(--primary-light);
      font-size: 14px;
    }

    .code-desc {
      font-size: 13px;
      color: var(--text);
    }

    .code-units {
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 600;
    }

    .necessity-box {
      background: rgba(5, 150, 105, 0.05);
      border: 1px solid rgba(5, 150, 105, 0.2);
      border-radius: 12px;
      padding: 16px 20px;
      font-size: 14px;
      line-height: 1.7;
      color: var(--text);
    }

    .empty-state {
      text-align: center;
      padding: 120px 40px;
    }

    .empty-icon {
      font-size: 72px;
      margin-bottom: 24px;
      opacity: 0.2;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text);
    }

    .empty-subtitle {
      font-size: 14px;
      color: var(--text-muted);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border);
      border-top-color: var(--primary-light);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 24px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: var(--bg);
    }

    ::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--bg-elevated);
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="sidebar">
      <div class="header">
        <div class="logo-container">
          <div class="logo-img">
            <img src="ss.png" alt="SomaSync AI">
          </div>
          <div class="logo-info">
            <div class="logo-title">SomaSync AI</div>
            <div class="logo-subtitle">Pro Documentation</div>
          </div>
        </div>
        <div class="status-card">
          <div class="status-pulse" id="statusPulse"></div>
          <div class="status-label" id="statusLabel">Ready to Record</div>
        </div>
      </div>

      <div class="controls">
        <button class="btn btn-primary" id="startBtn" onclick="start()">
          <span>●</span> Start Recording
        </button>
        <button class="btn btn-warning" id="pauseBtn" onclick="pause()" disabled>
          <span>⏸</span> Pause
        </button>
        <button class="btn btn-secondary" id="resumeBtn" onclick="resume()" disabled>
          <span>▶</span> Resume
        </button>
        <button class="btn btn-danger" id="endBtn" onclick="end()" disabled>
          <span>⏹</span> Generate Documentation
        </button>
      </div>

      <div class="transcript-section">
        <div class="section-header">Session Transcript</div>
        <div id="transcript">
          <div style="text-align: center; color: var(--text-muted); padding: 60px 20px; font-size: 13px; line-height: 1.6;">
            Click <strong style="color: var(--primary-light);">Start Recording</strong> to begin voice dictation
          </div>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="topbar">
        <div class="topbar-header">
          <div>
            <div class="topbar-title">Insurance-Grade Documentation</div>
            <div class="topbar-subtitle">ICD-10 & CPT Coded • Billable SOAP Notes</div>
          </div>
          <div class="topbar-badge">✓ Insurance Ready</div>
        </div>
      </div>

      <div class="content" id="content">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-title">No Documentation Generated</div>
          <div class="empty-subtitle">Start recording your session to generate billable SOAP notes with ICD-10 and CPT codes</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const SUPABASE_URL = 'https://ucqprtpuuyflnxjmatwo.supabase.co';
    const 'Authorization': Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcXBydHB1dXlmbG54am1hdHdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDE5MDYsImV4cCI6MjA3MzU3NzkwNn0.6bbdGyQ4rURrbrujTBaq-G6Kd9OymOk_0KcxKjPo2OU;

    let recognition;
    let state = 'idle';
    let transcript = [];

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (e) => {
        const result = e.results[e.results.length - 1];
        if (result.isFinal) handleSpeech(result[0].transcript.trim());
      };
      recognition.onend = () => {
        if (state === 'active') try { recognition.start(); } catch(e) {}
      };
    }

    function start() {
      state = 'active';
      transcript = [];
      document.getElementById('transcript').innerHTML = '';
      recognition.start();
      updateUI();
      addTranscript('Session started', 'system');
    }

    function pause() {
      state = 'paused';
      recognition.stop();
      updateUI();
      addTranscript('Paused', 'system');
    }

    function resume() {
      state = 'active';
      recognition.start();
      updateUI();
      addTranscript('Resumed', 'system');
    }

    async function end() {
      state = 'generating';
      recognition.stop();
      updateUI();
      
      const notes = transcript.join('. ');
      if (!notes.trim()) {
        alert('No content recorded');
        state = 'idle';
        updateUI();
        return;
      }

      showLoading();
      await generate(notes);
    }

    function handleSpeech(text) {
      if (text.toLowerCase().includes('pause')) return pause();
      if (text.toLowerCase().includes('end session')) return end();
      transcript.push(text);
      addTranscript(text, 'voice');
    }

    async function generate(rawNotes) {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-soap`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ rawNotes })
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        displaySOAP(data.soap);
        addTranscript('✓ Documentation generated', 'system');
        state = 'idle';
        updateUI();
      } catch (error) {
        showError(error.message);
        state = 'idle';
        updateUI();
      }
    }

    function displaySOAP(soap) {
      const html = `
        <div class="soap-grid">
          <div class="soap-card subjective">
            <div class="soap-header">
              <div class="soap-icon">S</div>
              <div class="soap-label">Subjective</div>
            </div>
            <div class="soap-body">${soap.subjective || 'Not documented'}</div>
          </div>

          <div class="soap-card objective">
            <div class="soap-header">
              <div class="soap-icon">O</div>
              <div class="soap-label">Objective</div>
            </div>
            <div class="soap-body">${soap.objective || 'Not documented'}</div>
          </div>

          <div class="soap-card assessment">
            <div class="soap-header">
              <div class="soap-icon">A</div>
              <div class="soap-label">Assessment</div>
            </div>
            <div class="soap-body">${soap.assessment || 'Not documented'}</div>
          </div>

          <div class="soap-card plan">
            <div class="soap-header">
              <div class="soap-icon">P</div>
              <div class="soap-label">Plan</div>
            </div>
            <div class="soap-body">${soap.plan || 'Not documented'}</div>
          </div>

          <div class="soap-card billing-card">
            <div class="soap-header">
              <div class="soap-icon" style="background: linear-gradient(135deg, #10b981, #059669);">💰</div>
              <div class="soap-label">Billing Codes</div>
            </div>
            
            <div class="billing-section">
              <div class="billing-title">ICD-10 Diagnosis Codes</div>
              <div class="code-chips">
                ${(soap.icd10 || []).map(c => `
                  <div class="code-chip">
                    <span class="code-number">${c.code}</span>
                    <span class="code-desc">${c.description}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="billing-section">
              <div class="billing-title">CPT Procedure Codes</div>
              <div class="code-chips">
                ${(soap.cpt || []).map(c => `
                  <div class="code-chip">
                    <span class="code-number">${c.code}</span>
                    <span class="code-desc">${c.description}</span>
                    ${c.units ? `<span class="code-units">(${c.units}u)</span>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>

            ${soap.medical_necessity ? `
              <div class="billing-section">
                <div class="billing-title">Medical Necessity Statement</div>
                <div class="necessity-box">${soap.medical_necessity}</div>
              </div>
            ` : ''}
          </div>
        </div>
      `;
      document.getElementById('content').innerHTML = html;
    }

    function showLoading() {
      document.getElementById('content').innerHTML = `
        <div class="empty-state">
          <div class="spinner"></div>
          <div class="empty-title">Generating Insurance Documentation</div>
          <div class="empty-subtitle">Creating SOAP note with ICD-10 and CPT codes...</div>
        </div>
      `;
    }

    function showError(msg) {
      document.getElementById('content').innerHTML = `
        <div class="empty-state">
          <div class="empty-icon" style="color: var(--danger);">⚠</div>
          <div class="empty-title">Generation Failed</div>
          <div class="empty-subtitle">${msg}</div>
        </div>
      `;
    }

    function addTranscript(text, type) {
      const div = document.createElement('div');
      div.className = 'transcript-item';
      div.innerHTML = `
        <div class="transcript-meta">${new Date().toLocaleTimeString()} · ${type}</div>
        <div class="transcript-text">${text}</div>
      `;
      const container = document.getElementById('transcript');
      if (container.textContent.includes('Start Recording')) container.innerHTML = '';
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function updateUI() {
      const pulse = document.getElementById('statusPulse');
      const label = document.getElementById('statusLabel');
      const btns = {
        start: document.getElementById('startBtn'),
        pause: document.getElementById('pauseBtn'),
        resume: document.getElementById('resumeBtn'),
        end: document.getElementById('endBtn')
      };

      pulse.className = 'status-pulse';
      
      if (state === 'active') {
        pulse.classList.add('active');
        label.textContent = 'Recording Session';
        btns.start.disabled = true;
        btns.pause.disabled = false;
        btns.resume.disabled = true;
        btns.end.disabled = false;
      } else if (state === 'paused') {
        pulse.classList.add('paused');
        label.textContent = 'Session Paused';
        btns.start.disabled = true;
        btns.pause.disabled = true;
        btns.resume.disabled = false;
        btns.end.disabled = false;
      } else if (state === 'generating') {
        pulse.classList.add('generating');
        label.textContent = 'AI Processing...';
        Object.values(btns).forEach(b => b.disabled = true);
      } else {
        label.textContent = 'Ready to Record';
        btns.start.disabled = false;
        btns.pause.disabled = true;
        btns.resume.disabled = true;
        btns.end.disabled = true;
      }
    }
  </script>
</body>
</html>