#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ============================================================
# Kernal-X0 — Netflix Intro (3 Stages) + PCs Flying in Space
# ============================================================
import sys
import os
import requests

os.environ["QTWEBENGINE_CHROMIUM_FLAGS"] = "--no-sandbox --disable-gpu-sandbox --disable-dev-shm-usage"
os.environ["QTWEBENGINE_DISABLE_SANDBOX"] = "1"

from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QStackedWidget
)
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWebEngineCore import QWebEngineProfile, QWebEnginePage
from PySide6.QtCore import Qt, QTimer, QUrl

# ════════════════════════════════════════════════════════════
# ⚙️ CONFIG
# ════════════════════════════════════════════════════════════
WEB_APP_URL = "https://promal.aymenlinux.workers.dev"
LOGIN_URL = f"{WEB_APP_URL}/"

SPLASH_DURATION = 6500
APP_NAME = "Kernal-X0"

ACCESS_KEY = "Kernal-X0-admin"

# ════════════════════════════════════════════════════════════
# 🎬 INTRO HTML — 3 Stages + Flying PCs
# ════════════════════════════════════════════════════════════
INTRO_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
    height: 100%; width: 100%;
    background: #000;
    overflow: hidden;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; justify-content: center;
    perspective: 1200px;
}

/* ═══════════════════════════════════════════════════════
   ⭐ STARS
   ═══════════════════════════════════════════════════════ */
#stars {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
}
.star {
    position: absolute;
    width: 2px; height: 2px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 5px #fff;
    animation: twinkle 3s ease-in-out infinite;
}
@keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
}

/* ═══════════════════════════════════════════════════════
   🌍 3D GLOBE
   ═══════════════════════════════════════════════════════ */
#globe-container {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%) scale(0.3);
    width: 100%; height: 100%;
    z-index: 1;
    opacity: 0;
    transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1);
}
#globe-container.show {
    opacity: 0.85;
    transform: translate(-50%, -50%) scale(1);
}
#globe-container.zoom-in {
    transform: translate(-50%, -50%) scale(6);
    opacity: 0;
    transition: all 2s cubic-bezier(0.16, 1, 0.3, 1);
}
#globeViz { width: 100%; height: 100%; }

/* ═══════════════════════════════════════════════════════
   💻 FLYING PCs (SVG Computers)
   ═══════════════════════════════════════════════════════ */
#pcs-container {
    position: absolute;
    inset: 0;
    z-index: 8;
    pointer-events: none;
    perspective: 800px;
    overflow: hidden;
}

.pc {
    position: absolute;
    width: 60px;
    height: 60px;
    opacity: 0;
    will-change: transform, opacity;
    transition: opacity 0.8s;
}
.pc.show {
    opacity: 1;
}

.pc svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 8px #00ff88) drop-shadow(0 0 16px #00ff88);
}

/* 💫 PC Pulse Ring */
.pc::before {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 80px; height: 80px;
    border: 1px solid #00ff88;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pcPulse 2.5s ease-out infinite;
    pointer-events: none;
}
.pc::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 120px; height: 120px;
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: pcPulse 2.5s ease-out 0.8s infinite;
    pointer-events: none;
}
@keyframes pcPulse {
    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

/* 🏷️ PC Label */
.pc-label {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    color: #00ff88;
    letter-spacing: 1px;
    font-family: 'JetBrains Mono', monospace;
    text-shadow: 0 0 10px #00ff88;
    white-space: nowrap;
    pointer-events: none;
}

/* ═══════════════════════════════════════════════════════
   🔗 CONNECTIONS
   ═══════════════════════════════════════════════════════ */
.connection {
    position: absolute;
    height: 1px;
    background: linear-gradient(90deg, transparent, #00ff88, transparent);
    z-index: 7;
    pointer-events: none;
    transform-origin: left center;
    animation: connectionPulse 3s ease-in-out infinite;
    opacity: 0;
    transition: opacity 1s;
}
.connection.show {
    opacity: 0.6;
}
@keyframes connectionPulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.8; }
}

/* ═══════════════════════════════════════════════════════
   📡 SIGNALS
   ═══════════════════════════════════════════════════════ */
.signal {
    position: absolute;
    width: 4px; height: 4px;
    background: #00ffff;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ffff;
    z-index: 9;
    pointer-events: none;
    animation: signalMove 3s linear infinite;
}
@keyframes signalMove {
    0% { opacity: 0; transform: scale(0.5); }
    10% { opacity: 1; transform: scale(1); }
    90% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.5); }
}

/* ═══════════════════════════════════════════════════════
   🎯 STAGE 1: NAME
   ═══════════════════════════════════════════════════════ */
.stage-name {
    position: relative;
    z-index: 20;
    text-align: center;
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.stage-name.hide {
    opacity: 0;
    transform: scale(2);
    filter: blur(30px);
}

.logo-text {
    font-size: 110px;
    font-weight: 900;
    letter-spacing: 10px;
    color: #ff0040;
    text-transform: uppercase;
    position: relative;
    display: inline-block;
    text-shadow:
        0 0 30px #ff0040,
        0 0 60px #ff0040,
        0 0 90px #ff0040;
    animation: 
        logoEnter 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards,
        logoGlow 2s ease-in-out 1.2s infinite,
        logoShake 0.4s ease-in-out 1.2s;
}

@keyframes logoEnter {
    0% {
        opacity: 0;
        transform: scale(0.1) rotateY(90deg);
        filter: blur(30px);
        letter-spacing: 80px;
    }
    30% { opacity: 1; filter: blur(5px); }
    60% { transform: scale(1.2) rotateY(0deg); filter: blur(0); }
    100% {
        opacity: 1;
        transform: scale(1) rotateY(0deg);
        letter-spacing: 10px;
        filter: blur(0);
    }
}

@keyframes logoGlow {
    0%, 100% {
        text-shadow: 0 0 30px #ff0040, 0 0 60px #ff0040, 0 0 90px #ff0040;
    }
    50% {
        text-shadow: 0 0 50px #ff0040, 0 0 100px #ff0040, 0 0 150px #ff0040;
    }
}

@keyframes logoShake {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-3px, 3px); }
    50% { transform: translate(3px, -3px); }
    75% { transform: translate(-3px, -3px); }
}

.logo-text::before,
.logo-text::after {
    content: 'Kernal-X0';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 100%;
    opacity: 0;
}
.logo-text::before {
    color: #00ffff;
    z-index: -1;
    animation: glitchCyan 3s ease-in-out infinite;
}
.logo-text::after {
    color: #ff00ff;
    z-index: -2;
    animation: glitchMagenta 3s ease-in-out infinite;
}
@keyframes glitchCyan {
    0%, 85%, 100% { opacity: 0; transform: translate(0, 0); }
    87% { opacity: 0.9; transform: translate(-5px, 3px); }
    89% { opacity: 0.9; transform: translate(5px, -3px); }
    91% { opacity: 0.9; transform: translate(-3px, -5px); }
    93% { opacity: 0.9; transform: translate(3px, 5px); }
}
@keyframes glitchMagenta {
    0%, 85%, 100% { opacity: 0; transform: translate(0, 0); }
    86% { opacity: 0.9; transform: translate(5px, -3px); }
    88% { opacity: 0.9; transform: translate(-5px, 3px); }
    90% { opacity: 0.9; transform: translate(3px, 5px); }
    92% { opacity: 0.9; transform: translate(-3px, -5px); }
}

.subtitle {
    font-size: 16px;
    color: #888;
    letter-spacing: 10px;
    margin-top: 30px;
    opacity: 0;
    animation: fadeUp 1s ease-out 1.2s forwards;
}
@keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); letter-spacing: 30px; }
    to { opacity: 1; transform: translateY(0); letter-spacing: 10px; }
}

/* ═══════════════════════════════════════════════════════
   🌩️ LIGHTNING
   ═══════════════════════════════════════════════════════ */
.lightning {
    position: absolute;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #fff, #00ffff, #fff, transparent);
    box-shadow: 0 0 20px #fff, 0 0 40px #00ffff;
    opacity: 0;
    z-index: 90;
    pointer-events: none;
    animation: lightningStrike 5s ease-in-out infinite;
}
.lightning:nth-child(1) {
    left: 12%;
    animation-delay: 0.4s;
    transform: rotate(-6deg);
}
.lightning:nth-child(2) {
    left: 88%;
    animation-delay: 2.4s;
    transform: rotate(6deg);
}
@keyframes lightningStrike {
    0%, 100% { opacity: 0; transform: scaleY(0); }
    2% { opacity: 0.9; transform: scaleY(1); }
    4% { opacity: 0; transform: scaleY(1); }
    6% { opacity: 0.5; transform: scaleY(1); }
    8% { opacity: 0; transform: scaleY(1); }
}

/* ═══════════════════════════════════════════════════════
   ⚡ THUNDER
   ═══════════════════════════════════════════════════════ */
.thunder {
    position: absolute;
    inset: 0;
    background: #fff;
    opacity: 0;
    z-index: 100;
    pointer-events: none;
    animation: thunderFlash 5s ease-in-out infinite;
}
@keyframes thunderFlash {
    0%, 100% { opacity: 0; }
    1% { opacity: 0.7; }
    2% { opacity: 0; }
    3% { opacity: 0.5; }
    4% { opacity: 0; }
    5% { opacity: 0.3; }
    6% { opacity: 0; }
    50% { opacity: 0; }
    51% { opacity: 0.4; }
    52% { opacity: 0; }
    53% { opacity: 0.2; }
    54% { opacity: 0; }
}

/* ═══════════════════════════════════════════════════════
   SCAN LINE
   ═══════════════════════════════════════════════════════ */
.scan-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, #ff0040, #fff, #ff0040, transparent);
    animation: scan 2s linear infinite;
    opacity: 0.6;
    z-index: 95;
    box-shadow: 0 0 30px #ff0040;
    pointer-events: none;
}
@keyframes scan {
    0% { top: 0; }
    100% { top: 100%; }
}
</style>
</head>
<body>

<!-- ⭐ Stars -->
<div id="stars"></div>

<!-- 🌍 3D GLOBE -->
<div id="globe-container">
    <div id="globeViz"></div>
</div>

<!-- 💻 FLYING PCs -->
<div id="pcs-container"></div>

<!-- 🌩️ Lightning -->
<div class="lightning"></div>
<div class="lightning"></div>

<!-- Scan Line -->
<div class="scan-line"></div>

<!-- Stage 1: NAME -->
<div class="stage-name" id="stageName">
    <div class="logo-text">Kernal-X0</div>
    <div class="subtitle">C2 COMMAND & CONTROL</div>
</div>

<!-- 🌍 GLOBE.GL LIBRARY -->
<script src="https://cdn.jsdelivr.net/npm/globe.gl@2.32.0/dist/globe.gl.min.js"></script>
<script>
// ═══════════════════════════════════════════════════════
// ⭐ STARS
// ═══════════════════════════════════════════════════════
function createStar() {
    var s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 3 + 's';
    s.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.getElementById('stars').appendChild(s);
}
for (var i = 0; i < 200; i++) createStar();

// ═══════════════════════════════════════════════════════
// 💻 PCs SVG (كمبيوترات حقيقية)
// ═══════════════════════════════════════════════════════
var PC_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <!-- Monitor screen -->
    <rect x="8" y="8" width="48" height="34" rx="3" fill="#0a1a0a" stroke="#00ff88" stroke-width="2"/>
    <!-- Screen glow -->
    <rect x="12" y="12" width="40" height="26" rx="1" fill="#001a0a"/>
    <!-- Screen lines -->
    <line x1="14" y1="18" x2="42" y2="18" stroke="#00ff88" stroke-width="0.8" opacity="0.6"/>
    <line x1="14" y1="23" x2="36" y2="23" stroke="#00ff88" stroke-width="0.8" opacity="0.6"/>
    <line x1="14" y1="28" x2="40" y2="28" stroke="#00ff88" stroke-width="0.8" opacity="0.6"/>
    <line x1="14" y1="33" x2="30" y2="33" stroke="#00ff88" stroke-width="0.8" opacity="0.6"/>
    <!-- Cursor -->
    <rect x="30" y="32" width="6" height="2" fill="#00ff88">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
    </rect>
    <!-- Monitor stand -->
    <rect x="28" y="42" width="8" height="8" fill="#0a1a0a" stroke="#00ff88" stroke-width="1.5"/>
    <!-- Monitor base -->
    <rect x="20" y="50" width="24" height="4" rx="1" fill="#0a1a0a" stroke="#00ff88" stroke-width="1.5"/>
    <!-- Power LED -->
    <circle cx="32" cy="52" r="1.5" fill="#00ff88">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
    </circle>
</svg>
`;

// ═══════════════════════════════════════════════════════
// 💻 FLYING PCs (كتحرك بحال النجوم فـ الفضاء)
// ═══════════════════════════════════════════════════════
var pcs = [];
var pcPositions = [];

function createPC(id) {
    var pc = document.createElement('div');
    pc.className = 'pc';
    pc.id = 'pc-' + id;
    pc.innerHTML = PC_SVG;

    // ⭐ Label
    var label = document.createElement('div');
    label.className = 'pc-label';
    label.textContent = 'PC_' + String(id).padStart(2, '0');
    pc.appendChild(label);

    document.getElementById('pcs-container').appendChild(pc);

    // ⭐ Position فـ الفضاء
    var x = Math.random() * 80 + 10;
    var y = Math.random() * 60 + 20;
    pc.style.left = x + '%';
    pc.style.top = y + '%';

    // ⭐ Random direction for flying
    var angle = Math.random() * Math.PI * 2;
    var speed = Math.random() * 0.3 + 0.15;

    pcs.push({
        id: id,
        el: pc,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.5,
        scale: Math.random() * 0.3 + 0.7,
        z: Math.random() * 200 - 100,
    });

    pcPositions.push({ id: id, x: x, y: y, el: pc });
}

// ⭐ نصنعو 8 PCs
for (var i = 1; i <= 8; i++) {
    createPC(i);
}

// ═══════════════════════════════════════════════════════
// 🚀 ANIMATION LOOP (كيتحركو بحال النجوم)
// ═══════════════════════════════════════════════════════
var lastTime = performance.now();

function animatePcs(now) {
    var dt = (now - lastTime) / 16.67;  // normalize to ~60fps
    lastTime = now;

    pcs.forEach(function(pc) {
        // ⭐ Update position
        pc.x += pc.vx * dt;
        pc.y += pc.vy * dt;

        // ⭐ Bounce من الحدود (wrap around)
        if (pc.x < 5) { pc.x = 5; pc.vx *= -1; }
        if (pc.x > 95) { pc.x = 95; pc.vx *= -1; }
        if (pc.y < 10) { pc.y = 10; pc.vy *= -1; }
        if (pc.y > 90) { pc.y = 90; pc.vy *= -1; }

        // ⭐ Update rotation
        pc.rotation += pc.rotationSpeed * dt;

        // ⭐ 3D depth effect (Z position affects scale)
        pc.z += (Math.random() - 0.5) * 0.5;
        if (pc.z > 100) pc.z = 100;
        if (pc.z < -100) pc.z = -100;
        var depthScale = 1 + (pc.z / 300);
        var opacity = 0.6 + (pc.z / 250);

        // ⭐ Apply transform
        pc.el.style.left = pc.x + '%';
        pc.el.style.top = pc.y + '%';
        pc.el.style.transform =
            'translate(-50%, -50%) ' +
            'scale(' + (pc.scale * depthScale) + ') ' +
            'rotate(' + pc.rotation + 'deg)';
        pc.el.style.opacity = Math.max(0.4, Math.min(1, opacity));
    });

    requestAnimationFrame(animatePcs);
}

requestAnimationFrame(animatePcs);

// ═══════════════════════════════════════════════════════
// 🔗 CONNECTIONS
// ═══════════════════════════════════════════════════════
function createConnection(pc1, pc2) {
    var dx = pc2.x - pc1.x;
    var dy = pc2.y - pc1.y;
    var length = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;

    var conn = document.createElement('div');
    conn.className = 'connection';
    conn.style.left = pc1.x + '%';
    conn.style.top = pc1.y + '%';
    conn.style.width = length + '%';
    conn.style.transform = 'rotate(' + angle + 'deg)';
    conn.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('pcs-container').appendChild(conn);
    return conn;
}

var connections = [];
setTimeout(function() {
    for (var i = 0; i < pcPositions.length - 1; i++) {
        connections.push(createConnection(pcPositions[i], pcPositions[i + 1]));
    }
    if (pcPositions.length > 2) {
        connections.push(createConnection(pcPositions[pcPositions.length - 1], pcPositions[0]));
    }
}, 1500);

// ═══════════════════════════════════════════════════════
// 📡 SIGNALS
// ═══════════════════════════════════════════════════════
function createSignal() {
    var signal = document.createElement('div');
    signal.className = 'signal';
    signal.style.left = Math.random() * 100 + '%';
    signal.style.top = Math.random() * 100 + '%';
    signal.style.animationDelay = Math.random() * 3 + 's';
    signal.style.animationDuration = (Math.random() * 2 + 2) + 's';
    document.getElementById('pcs-container').appendChild(signal);
    setTimeout(function() { signal.remove(); }, 5000);
}

// ═══════════════════════════════════════════════════════
// 🌍 3D GLOBE
// ═══════════════════════════════════════════════════════
var globe = null;

var COUNTRIES = [
    { code: 'DZ', name: 'Algeria', lat: 28.03, lng: 1.66 },
    { code: 'US', name: 'USA', lat: 37.09, lng: -95.71 },
    { code: 'FR', name: 'France', lat: 46.22, lng: 2.21 },
    { code: 'DE', name: 'Germany', lat: 51.16, lng: 10.45 },
    { code: 'GB', name: 'UK', lat: 55.37, lng: -3.43 },
    { code: 'CN', name: 'China', lat: 35.86, lng: 104.19 },
    { code: 'JP', name: 'Japan', lat: 36.20, lng: 138.25 },
    { code: 'RU', name: 'Russia', lat: 61.52, lng: 105.31 },
    { code: 'BR', name: 'Brazil', lat: -14.23, lng: -51.92 },
    { code: 'IN', name: 'India', lat: 20.59, lng: 78.96 },
    { code: 'AU', name: 'Australia', lat: -25.27, lng: 133.77 },
    { code: 'ZA', name: 'South Africa', lat: -30.55, lng: 22.93 },
];

function initGlobe() {
    try {
        globe = Globe()
            .globeImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg')
            .bumpImageUrl('https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png')
            .backgroundColor('rgba(0,0,0,0)')
            .atmosphereColor('#ff0040')
            .atmosphereAltitude(0.35)
            .showGraticules(true)

            .pointsData(COUNTRIES)
            .pointLat('lat')
            .pointLng('lng')
            .pointColor(function() { return '#00ff88'; })
            .pointAltitude(0.01)
            .pointRadius(0.4)
            .pointsMerge(false)

            .arcsData(generateArcs())
            .arcColor(function() { return ['#00ff88', '#00ffff']; })
            .arcAltitude(0.2)
            .arcStroke(0.5)
            .arcDashLength(0.4)
            .arcDashGap(0.2)
            .arcDashAnimateTime(2000)

            .ringsData(COUNTRIES.slice(0, 6))
            .ringColor(function() { return function(t) { return 'rgba(0, 255, 136, ' + (1 - t) + ')'; }; })
            .ringMaxRadius(5)
            .ringPropagationSpeed(2)
            .ringRepeatPeriod(1000)
            .ringAltitude(0.015)

            (document.getElementById('globeViz'));

        globe.width(window.innerWidth);
        globe.height(window.innerHeight);
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 1.2;
        globe.controls().enableDamping = true;
        globe.controls().dampingFactor = 0.1;
        globe.controls().enableZoom = false;
        globe.controls().enablePan = false;
        globe.pointOfView({ lat: 36.74, lng: 3.11, altitude: 2.5 }, 0);

    } catch(e) {
        console.error('Globe init error:', e);
    }
}

function generateArcs() {
    var algeria = COUNTRIES[0];
    var arcs = [];
    for (var i = 1; i < COUNTRIES.length; i++) {
        arcs.push({
            startLat: algeria.lat,
            startLng: algeria.lng,
            endLat: COUNTRIES[i].lat,
            endLng: COUNTRIES[i].lng,
        });
    }
    return arcs;
}

window.addEventListener('resize', function() {
    if (globe) {
        globe.width(window.innerWidth);
        globe.height(window.innerHeight);
    }
});

// ═══════════════════════════════════════════════════════
// 🎬 STAGES TIMELINE
// ═══════════════════════════════════════════════════════

// ⭐ Stage 2: بعد 2.5s — Globe + PCs
setTimeout(function() {
    console.log('[Stage 2] Showing globe + PCs');

    // Globe
    document.getElementById('globe-container').classList.add('show');
    setTimeout(initGlobe, 100);

    // PCs
    setTimeout(function() {
        var pcEls = document.querySelectorAll('.pc');
        pcEls.forEach(function(pc, i) {
            setTimeout(function() {
                pc.classList.add('show');
            }, i * 150);
        });
    }, 500);

    // Connections
    setTimeout(function() {
        connections.forEach(function(conn, i) {
            setTimeout(function() {
                conn.classList.add('show');
            }, i * 100);
        });
    }, 1000);

    // Signals
    setTimeout(function() {
        setInterval(createSignal, 300);
    }, 1500);

}, 2500);

// ⭐ Stage 3: بعد 4.5s — Name hide + Globe zoom
setTimeout(function() {
    console.log('[Stage 3] Hiding name + zooming globe');

    document.getElementById('stageName').classList.add('hide');

    setTimeout(function() {
        document.getElementById('globe-container').classList.add('zoom-in');
    }, 800);

}, 4500);

// ⭐ Stage 4: بعد 6s — Fade out
setTimeout(function() {
    console.log('[Stage 4] Fade out');
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '0';
}, 6000);
</script>
</body>
</html>"""

# ════════════════════════════════════════════════════════════
# 🔑 KEY HTML
# ════════════════════════════════════════════════════════════
KEY_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;900&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
    height: 100%; width: 100%;
    background: #000; overflow: hidden;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
}
body::before {
    content: '';
    position: absolute; top: 50%; left: 50%;
    width: 100%; height: 100%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle at center,
        rgba(255, 0, 64, 0.15) 0%,
        rgba(0, 102, 255, 0.1) 30%,
        transparent 70%);
    animation: bgPulse 3s ease-in-out infinite;
    z-index: 0;
}
@keyframes bgPulse {
    0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}
.container {
    position: relative; z-index: 10; text-align: center;
    display: flex; flex-direction: column; align-items: center;
    max-width: 600px; padding: 40px;
}
.icon {
    font-size: 60px; margin-bottom: 20px;
    animation: iconPulse 3s ease-in-out infinite;
    filter: drop-shadow(0 0 20px #ff0040);
}
@keyframes iconPulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
}
.logo {
    font-size: 48px; font-weight: 900;
    letter-spacing: 6px; color: #ff0040;
    text-transform: uppercase;
    text-shadow: 0 0 30px #ff0040, 0 0 60px #ff0040;
    animation: logoGlow 2s ease-in-out infinite;
    margin-bottom: 10px;
}
@keyframes logoGlow {
    0%, 100% { text-shadow: 0 0 20px #ff0040, 0 0 40px #ff0040, 0 0 60px #ff0040; }
    50% { text-shadow: 0 0 40px #ff0040, 0 0 80px #ff0040, 0 0 120px #ff0040; }
}
.subtitle {
    font-size: 11px; color: #888;
    letter-spacing: 6px; margin-bottom: 40px;
}
.status {
    font-size: 12px; color: #888;
    letter-spacing: 4px; margin-bottom: 25px;
    text-transform: uppercase;
}
.input-container {
    position: relative; width: 100%; max-width: 450px;
    margin-bottom: 20px;
}
.key-input {
    width: 100%; padding: 18px 60px 18px 20px;
    background: rgba(15, 15, 24, 0.8);
    border: 2px solid #2a2a44; border-radius: 12px;
    color: #00ffff; font-family: 'JetBrains Mono', monospace;
    font-size: 16px; font-weight: 700;
    letter-spacing: 2px; outline: none;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    text-align: center;
}
.key-input:focus {
    border-color: #ff0040;
    box-shadow: 0 0 30px rgba(255, 0, 64, 0.4),
                inset 0 0 20px rgba(255, 0, 64, 0.1);
    background: rgba(20, 5, 15, 0.9);
}
.key-input::placeholder {
    color: #444; letter-spacing: 4px; font-size: 12px;
}
.eye-btn {
    position: absolute; right: 15px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; color: #666;
    font-size: 20px; cursor: pointer; padding: 5px;
    transition: color 0.2s; user-select: none;
}
.eye-btn:hover { color: #ff0040; }
.error {
    font-size: 12px; color: #ff0040;
    letter-spacing: 2px; margin-bottom: 20px;
    height: 20px; text-shadow: 0 0 10px #ff0040;
    opacity: 0; transition: opacity 0.3s;
}
.error.show {
    opacity: 1; animation: shake 0.4s;
}
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}
.submit-btn {
    width: 100%; max-width: 450px;
    padding: 18px 40px;
    background: linear-gradient(90deg, #ff0040, #0066ff);
    color: #fff; border: none; border-radius: 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px; font-weight: 900;
    letter-spacing: 4px; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative; overflow: hidden;
}
.submit-btn::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 100%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}
.submit-btn:hover::before { left: 100%; }
.submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 40px rgba(255, 0, 64, 0.5);
}
.submit-btn:active { transform: translateY(0); }
.submit-btn:disabled {
    background: #1a1a2e; color: #444; cursor: not-allowed;
}
.hint {
    font-size: 10px; color: #444;
    letter-spacing: 4px; margin-top: 30px;
}
.scan-line {
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ff0040, transparent);
    animation: scan 3s linear infinite;
    opacity: 0.5; z-index: 5;
}
@keyframes scan { 0% { top: 0; } 100% { top: 100%; } }
.container.success .logo {
    animation: successPulse 0.5s;
}
@keyframes successPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); text-shadow: 0 0 60px #00ff88, 0 0 120px #00ff88; color: #00ff88; }
    100% { transform: scale(1); }
}
</style>
</head>
<body>
<div class="scan-line"></div>
<div class="container" id="container">
    <div class="icon">🔑</div>
    <div class="logo">Kernal-X0</div>
    <div class="subtitle">C2 COMMAND & CONTROL</div>
    <div class="status" id="status">ENTER ACCESS KEY</div>
    <div class="input-container">
        <input type="password" class="key-input" id="keyInput" placeholder="ENTER ACCESS KEY" autocomplete="off" autofocus>
        <button class="eye-btn" id="eyeBtn" title="Show/Hide">👁</button>
    </div>
    <div class="error" id="error">❌ INVALID ACCESS KEY</div>
    <button class="submit-btn" id="submitBtn">▶ AUTHENTICATE</button>
    <div class="hint">© 2026 — Kernal-X0</div>
</div>
<script>
var ACCESS_KEY = "%ACCESS_KEY%";
window.keyStatus = 'pending';

var input = document.getElementById('keyInput');
var submitBtn = document.getElementById('submitBtn');
var errorEl = document.getElementById('error');
var statusEl = document.getElementById('status');
var eyeBtn = document.getElementById('eyeBtn');

eyeBtn.addEventListener('click', function() {
    if (input.type === 'password') {
        input.type = 'text';
        eyeBtn.textContent = '🙈';
    } else {
        input.type = 'password';
        eyeBtn.textContent = '👁';
    }
    input.focus();
});

function submitKey() {
    var entered = input.value.trim();
    if (!entered) {
        showError('❌ ENTER ACCESS KEY');
        return;
    }
    submitBtn.textContent = '⏳ AUTHENTICATING...';
    submitBtn.disabled = true;

    setTimeout(function() {
        if (entered === ACCESS_KEY) {
            onKeyCorrect();
        } else {
            onKeyWrong();
        }
    }, 500);
}

function onKeyCorrect() {
    errorEl.classList.remove('show');
    statusEl.textContent = '✓ ACCESS GRANTED';
    statusEl.style.color = '#00ff88';
    submitBtn.textContent = '✓ SUCCESS';
    document.getElementById('container').classList.add('success');
    window.keyStatus = 'success';
}

function onKeyWrong() {
    showError('❌ INVALID ACCESS KEY');
    input.value = '';
    input.focus();
    submitBtn.textContent = '❌ DENIED';
    submitBtn.disabled = false;
    setTimeout(function() {
        submitBtn.textContent = '▶ AUTHENTICATE';
    }, 1500);
}

function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('show');
}

submitBtn.addEventListener('click', submitKey);
input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') submitKey();
});
input.addEventListener('input', function() {
    errorEl.classList.remove('show');
});
input.focus();
</script>
</body>
</html>"""

# ════════════════════════════════════════════════════════════
# 🌐 ERROR PAGE
# ════════════════════════════════════════════════════════════
ERROR_PAGE_HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
    height: 100%; width: 100%;
    background: #000; color: #fff;
    font-family: 'JetBrains Mono', monospace;
    display: flex; align-items: center; justify-content: center;
}
.container { text-align: center; padding: 40px; }
.icon { font-size: 100px; margin-bottom: 20px; animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.title {
    font-size: 28px; font-weight: 700;
    color: #ff0040; letter-spacing: 4px;
    margin-bottom: 16px; text-shadow: 0 0 20px #ff0040;
}
.status {
    display: inline-block; padding: 8px 16px;
    background: rgba(255, 0, 64, 0.1);
    border: 1px solid #ff0040; border-radius: 6px;
    color: #ff0040; font-size: 11px;
    letter-spacing: 2px; margin-bottom: 20px;
}
.subtitle { font-size: 13px; color: #888; line-height: 1.6; }
</style>
</head>
<body>
<div class="container">
    <div class="icon">📡</div>
    <div class="title">NO INTERNET</div>
    <div class="status">● CONNECTION FAILED</div>
    <div class="subtitle">
        Unable to reach the C2 server.<br>
        Auto-retrying every 10 seconds...
    </div>
</div>
</body>
</html>"""

# ════════════════════════════════════════════════════════════
# 🌐 CUSTOM WEB PAGE
# ════════════════════════════════════════════════════════════
class CustomWebPage(QWebEnginePage):
    def javaScriptConsoleMessage(self, level, message, line, source):
        pass

# ════════════════════════════════════════════════════════════
# 🖥️ MAIN WINDOW
# ════════════════════════════════════════════════════════════
class KernalX0(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Kernal-X0 — C2 PANEL")
        self.resize(1600, 950)

        self.is_connected = False
        self.retry_timer = None
        self.intro_timer = None
        self.key_timer = None

        self.profile = QWebEngineProfile.defaultProfile()
        self.profile.setPersistentCookiesPolicy(
            QWebEngineProfile.ForcePersistentCookies
        )
        cookie_path = os.path.expanduser("~/.c2cli/webengine")
        os.makedirs(cookie_path, exist_ok=True)
        self.profile.setPersistentStoragePath(cookie_path)
        self.profile.setCachePath(os.path.join(cookie_path, "cache"))
        self.profile.setHttpCacheMaximumSize(100 * 1024 * 1024)

        central = QWidget()
        self.setCentralWidget(central)
        layout = QVBoxLayout(central)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        self.stack = QStackedWidget()
        layout.addWidget(self.stack)

        # Page 0: INTRO
        self.intro_view = QWebEngineView()
        self.intro_view.setStyleSheet("background: #000; border: none;")
        self.intro_view.setHtml(INTRO_HTML, QUrl("about:blank"))
        self.stack.addWidget(self.intro_view)

        # Page 1: KEY
        self.key_view = QWebEngineView()
        self.key_view.setStyleSheet("background: #000; border: none;")
        self.key_page = CustomWebPage(self.profile, self.key_view)
        self.key_view.setPage(self.key_page)
        self.key_view.loadFinished.connect(self._on_key_loaded)

        key_html = KEY_HTML.replace("%ACCESS_KEY%", ACCESS_KEY)
        self.key_page.setHtml(key_html, QUrl("about:blank"))

        self.stack.addWidget(self.key_view)

        # Page 2: APP
        self.web_view = QWebEngineView()
        self.web_page = CustomWebPage(self.profile, self.web_view)
        self.web_view.setPage(self.web_page)
        self.web_view.urlChanged.connect(self._on_url_changed)
        self.web_view.loadFinished.connect(self._on_load_finished)

        print("[+] ⏳ Preloading website in background...")
        self.web_view.setUrl(QUrl(LOGIN_URL))

        self.stack.addWidget(self.web_view)

        # Intro
        self.stack.setCurrentIndex(0)
        print(f"[+] Showing intro ({SPLASH_DURATION/1000}s)...")

        self.intro_timer = QTimer()
        self.intro_timer.timeout.connect(self._switch_to_key)
        self.intro_timer.start(SPLASH_DURATION)

    def _switch_to_key(self):
        if self.intro_timer:
            self.intro_timer.stop()
            self.intro_timer = None
        print("[+] Intro finished — showing KEY page")
        self.stack.setCurrentIndex(1)

    def _on_key_loaded(self, ok):
        if ok:
            print("[+] KEY page loaded")
            self.key_timer = QTimer()
            self.key_timer.timeout.connect(self._check_key_status)
            self.key_timer.start(500)

    def _check_key_status(self):
        self.key_page.runJavaScript(
            "window.keyStatus || 'pending';",
            self._on_key_status_result
        )

    def _on_key_status_result(self, result):
        if result == "success":
            print("[+] KEY correct — switching to app")
            if self.key_timer:
                self.key_timer.stop()
                self.key_timer = None
            QTimer.singleShot(1500, self._go_to_app)

    def _go_to_app(self):
        print("[+] Switching to app view")
        url = self.web_view.url().toString()
        if not url or "about:blank" in url:
            print("[+] Website not loaded — loading now...")
            self._check_connection_and_load()
        self.stack.setCurrentIndex(2)

    def _check_connection(self, url=WEB_APP_URL, timeout=5):
        try:
            r = requests.get(url, timeout=timeout, allow_redirects=True)
            return r.status_code < 500
        except Exception:
            return False

    def _check_connection_and_load(self):
        print(f"[NET] Checking {WEB_APP_URL}...")
        if self._check_connection():
            print("[NET] ✅ Connected")
            self.is_connected = True
            self.web_view.setUrl(QUrl(LOGIN_URL))
        else:
            print("[NET] ❌ No connection")
            self.is_connected = False
            self._show_error_page()
            self._start_retry_timer()

    def _show_error_page(self):
        self.web_view.setHtml(ERROR_PAGE_HTML, QUrl("about:blank"))

    def _start_retry_timer(self):
        if self.retry_timer:
            self.retry_timer.stop()
        self.retry_timer = QTimer()
        self.retry_timer.timeout.connect(self._retry_connection)
        self.retry_timer.start(10000)

    def _stop_retry_timer(self):
        if self.retry_timer:
            self.retry_timer.stop()
            self.retry_timer = None

    def _retry_connection(self):
        print("[RETRY] Attempting...")
        if self._check_connection():
            print("[RETRY] ✅ Reconnected!")
            self.is_connected = True
            self._stop_retry_timer()
            self.web_view.setUrl(QUrl(LOGIN_URL))

    def _on_url_changed(self, url):
        print(f"[URL] {url.toString()}")

    def _on_load_finished(self, ok):
        if ok:
            print("[+] Page loaded")
            url = self.web_view.url().toString()
            if "about:blank" not in url and not url.startswith("data:"):
                self.is_connected = True
                self._stop_retry_timer()
        else:
            print("[-] Page failed")
            if self.is_connected:
                self.is_connected = False
                self._show_error_page()
                self._start_retry_timer()

    def closeEvent(self, event):
        self._stop_retry_timer()
        if self.intro_timer:
            self.intro_timer.stop()
        if self.key_timer:
            self.key_timer.stop()
        event.accept()


# ════════════════════════════════════════════════════════════
# 🚀 MAIN
# ════════════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print(f"  {APP_NAME} — Netflix Intro + Flying PCs")
    print(f"  URL: {WEB_APP_URL}")
    print(f"  Key: {'*' * len(ACCESS_KEY)}")
    print("=" * 60)

    app = QApplication(sys.argv)

    win = KernalX0()
    win.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()