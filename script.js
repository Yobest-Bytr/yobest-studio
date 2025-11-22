// ======================================================
// YOBEST STUDIO – FINAL script.js (November 22, 2025)
// Site Visitors & Total Downloads 100% WORKING on Vercel
// No errors • No 403 • Counters increase live
// ======================================================

// 1. Fix "updateTrail is not defined" — Define FIRST
window.updateTrail = function(e) {
    const trail = document.getElementById('mouse-trail');
    if (!trail) return;
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.opacity = '0.8';
    setTimeout(() => trail.style.opacity = '0', 600);
};

// 2. Load Font Awesome & Emoji (NO 403)
const fa = document.createElement('link');
fa.rel = 'stylesheet';
fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
fa.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==';
fa.crossOrigin = 'anonymous';
document.head.appendChild(fa);

const emoji = document.createElement('link');
emoji.rel = 'stylesheet';
emoji.href = 'https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap';
document.head.appendChild(emoji);

// 3. Firebase Counters – WORKING 100%
let db = null;
let initialized = false;

function initCounters() {
    if (initialized) return;
    initialized = true;

    const firebaseConfig = {
        apiKey: "AIzaSyC-e03MCfDrp909_wSziGxsw8JPvSYuhoI",
        authDomain: "yobest-bytr.firebaseapp.com",
        databaseURL: "https://yobest-bytr-default-rtdb.firebaseio.com",
        projectId: "yobest-bytr",
        storageBucket: "yobest-bytr.firebasestorage.app",
        messagingSenderId: "661309795820",
        appId: "1:661309795820:web:e16ba92bdd31d2f090a4c9"
    };

    firebase.initializeApp(firebaseConfig);
    db = firebase.database();

    // +1 Visitor
    db.ref('stats/visitors').transaction(v => (v || 0) + 1);

    // Update display
    updateDisplay();
    setInterval(updateDisplay, 3000);
}

function updateDisplay() {
    if (!db) return;
    db.ref('stats').once('value').then(snap => {
        const data = snap.val() || { visitors: 0, downloads: 0 };
        document.querySelectorAll('#site-visitors').forEach(el => {
            el.textContent = Number(data.visitors || 0).toLocaleString();
        });
        document.querySelectorAll('#total-downloads').forEach(el => {
            el.textContent = Number(data.downloads || 0).toLocaleString();
        });
    });
}

// Track downloads
document.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (a && (a.id === 'download-btn' || a.id === 'try-game-btn' || 
        a.href.includes('workink.net') || a.href.includes('mega.nz') || a.href.includes('roblox.com'))) {
        if (db) {
            db.ref('stats/downloads').transaction(v => (v || 0) + 1);
            updateDisplay();
        }
    }
});

// Load Firebase only once
const loadFirebase = () => {
    const app = document.createElement('script');
    app.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js';
    app.onload = () => {
        const dbScript = document.createElement('script');
        dbScript.src = 'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js';
        dbScript.onload = initCounters;
        document.head.appendChild(dbScript);
    };
    document.head.appendChild(app);
};
loadFirebase();

// 4. Particles Background (Optional but beautiful)
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 1;
            this.speedX = Math.random() * 1.2 - 0.6;
            this.speedY = Math.random() * 1.2 - 0.6;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0,212,255,0.9)';
            ctx.strokeStyle = '#00eeff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }

    const init = () => {
        particles = [];
        for (let i = 0; i < 130; i++) particles.push(new Particle());
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    init();
    animate();
}

// 5. Theme & Loading
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => document.getElementById('loading-overlay')?.remove(), 800);
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
});
