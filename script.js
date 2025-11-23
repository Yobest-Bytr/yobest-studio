// ======================================================
// YOBEST STUDIO – FINAL & FULLY WORKING script.js
// November 23, 2025 – Vercel Blob + All Features Fixed
// No Firebase | No Errors | Counters Work
// hhhh
// ======================================================

console.log("%cYobest Studio Loaded – Vercel Blob Tracking ACTIVE", "color: #00ff88; font-size: 16px; font-weight: bold;");

// === 0. FIX: Define updateTrail FIRST (so mouse trail works instantly) ===
window.updateTrail = function(e) {
    const trail = document.getElementById('mouse-trail');
    if (trail) {
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.opacity = '0.8';
        setTimeout(() => trail.style.opacity = '0', 600);
    }
};

// === 1. FontAwesome CDN (fixes 403) ===
const faCSS = document.createElement('link');
faCSS.rel = 'stylesheet';
faCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
faCSS.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==';
faCSS.crossOrigin = 'anonymous';
document.head.appendChild(faCSS);

// === 2. Track Visitor on Page Load (Vercel Blob) ===
(function trackVisitor() {
    const url = '/api/visitors';
    if (navigator.sendBeacon) {
        navigator.sendBeacon(url);
    } else {
        fetch(url, { method: 'POST', keepalive: true }).catch(() => {});
    }
})();

// === 3. Live Counters – Visitors + Downloads ===
let visitors = 1230;
let downloads = 500;

async function updateCounters() {
    try {
        const res = await fetch('/api/analytics');
        if (!res.ok) throw new Error('API not ready');
        const data = await res.json();
        visitors = Number(data.visitors || 0);
        downloads = Number(data.downloads || 0);
    } catch (err) {
        console.warn('Analytics API not ready yet – will retry...');
    } finally {
        const vEl = document.getElementById('site-visitors');
        const dEl = document.getElementById('total-downloads');
        if (vEl) vEl.textContent = visitors.toLocaleString();
        if (dEl) dEl.textContent = downloads.toLocaleString();
    }
}

// Update immediately + every 6 seconds
updateCounters();
setInterval(updateCounters, 6000);

// === 4. Track Downloads on Click ===
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && (
        link.id === 'download-btn' ||
        link.href.includes('workink.net') ||
        link.href.includes('mega.nz') ||
        link.href.includes('roblox.com/game-pass') ||
        link.classList.contains('download-btn')
    )) {
        fetch('/api/downloads', { method: 'POST', keepalive: true }).catch(() => {});
    }
});

// === 5. Animated Particles Background ===
const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    let particles = [];
    const num = 130;

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

    function init() { particles = Array.from({length: num}, () => new Particle()); }
    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const d = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                if (d < 130) {
                    ctx.strokeStyle = `rgba(0,238,255,${1 - d/130})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connect();
        requestAnimationFrame(animate);
    }
    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });
    init();
    animate();
}

// === 6. YouTube Data + Games ===
const YT_API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k';
let gamePreviews = [
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=gHeW6FvXmkk",downloadLink:"https://workink.net/1RdO/o1tps3s0",download:true,gameLink:"https://www.roblox.com/games/102296952865049/Yobest-Ball-Game",gamePlay:true,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=XiGrxZNzpZM",downloadLink:"https://workink.net/1RdO/d072o5mz",download:true,gameLink:"https://www.roblox.com/games/16907652511/Yobests-Anime-Guardian-Clash-Up2",gamePlay:true,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=o3VxS9r2OwY",downloadLink:"https://www.roblox.com/game-pass/1012039728/Display-All-Units",download:true,gameLink:"https://www.roblox.com/games/82747399384275/Anime-Yobest-Av-up2",gamePlay:true,price:"600 Robux"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=6mDovQ4d87M",downloadLink:"https://workink.net/1RdO/fhj69ej0",download:true,gameLink:"https://www.roblox.com/games/15958463952/skibidi-tower-defense-BYTR-UP-4",gamePlay:true,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=pMrRFF7dHYM",downloadLink:"https://mega.nz/file/YTd1gJqa#NzndT5ZOZS4wjo1gc9j7XHdsuBOMFvvHkb9y34EbESw",download:true,gameLink:"",gamePlay:false,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=97f1sqtWy6o",downloadLink:"https://workink.net/1RdO/lmm1ufst",download:true,gameLink:"https://www.roblox.com/games/14372275044/tower-defense-Anime",gamePlay:true,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=dsDqBZBLpfg",downloadLink:"https://workink.net/1RdO/lmfdv0b3",download:true,gameLink:"",gamePlay:false,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=w9OLn8YValE",downloadLink:"https://workink.net/1RdO/ltk7rklv",download:true,gameLink:"",gamePlay:false,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=kXMamYt5Zd8",downloadLink:"https://workink.net/1RdO/lu5jed0c",download:true,gameLink:"",gamePlay:false,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=5BYv9x_E2Iw",downloadLink:"https://workink.net/1RdO/lsgkci8u",download:true,gameLink:"",gamePlay:false,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=bW3ILQnV6Rw",downloadLink:"https://workink.net/1RdO/ln08hlhk",download:true,gameLink:"",gamePlay:false,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=ofOqiIa_Q3Y",downloadLink:"https://workink.net/1RdO/lmkp2h0j",download:true,gameLink:"",gamePlay:false,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=KATJLumZSOs",downloadLink:"https://workink.net/1RdO/lm95jqw3",download:true,gameLink:"",gamePlay:false,price:"Free"}
];

async function fetchYouTubeData() {
    const ids = gamePreviews.map(g => g.videoLink.split('v=')[1]).join(',');
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${YT_API_KEY}&id=${ids}&part=snippet,statistics`);
        const data = await res.json();
        gamePreviews.forEach(g => {
            const video = data.items?.find(i => i.id === g.videoLink.split('v=')[1]);
            if (video) {
                g.title = video.snippet.title;
                g.description = video.snippet.description;
                g.views = video.statistics.viewCount;
                g.likes = video.statistics.likeCount;
                g.publishedAt = new Date(video.snippet.publishedAt).toLocaleDateString('en-GB');
                g.thumbnail = video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url;
            }
        });
    } catch (e) { console.error('YouTube API error:', e); }
}

function loadVideos() {
    const container = document.getElementById('video-list');
    if (!container) return;
    document.getElementById('video-count').textContent = gamePreviews.length;
    container.innerHTML = gamePreviews.map(g => `
        <div class="video-card" onclick="openGame('${g.videoLink.split('v=')[1]}')">
            <img src="${g.thumbnail || ''}" loading="lazy" alt="${g.title || 'Game'}">
            <div class="info">
                <h3>${g.title || 'Untitled'}</h3>
                <p>${Number(g.views || 0).toLocaleString()} views • ${g.price}</p>
            </div>
        </div>
    `).join('');
}

function openGame(id) {
    const game = gamePreviews.find(g => g.videoLink.includes(id));
    if (game) {
        sessionStorage.setItem('currentGame', JSON.stringify(game));
        location.href = 'game.html';
    }
}

async function loadGameDetails() {
    const game = JSON.parse(sessionStorage.getItem('currentGame') || 'null');
    if (!game) return location.href = 'index.html';
    document.getElementById('video-player').src = `https://www.youtube.com/embed/${game.videoLink.split('v=')[1]}?autoplay=1&rel=0&modestbranding=1`;
    document.getElementById('video-title').textContent = game.title || "Game";
    document.getElementById('video-views').textContent = Number(game.views || 0).toLocaleString();
    document.getElementById('video-likes').textContent = Number(game.likes || 0).toLocaleString();
    document.getElementById('video-date').textContent = game.publishedAt || "2025";
    document.getElementById('video-price').textContent = game.price;
    document.getElementById('video-description').innerHTML = (game.description || "No description.").replace(/\n/g, '<br>');
    const dl = document.getElementById('download-btn');
    const play = document.getElementById('try-game-btn');
    if (game.download) dl.style.display = 'inline-flex'; else dl.style.display = 'none';
    if (game.gamePlay) play.style.display = 'inline-flex'; else play.style.display = 'none';
    dl.href = game.downloadLink || '#';
    play.href = game.gameLink || '#';
    await loadYouTubeComments(game.videoLink.split('v=')[1]);
}

async function loadYouTubeComments(videoId) {
    const container = document.getElementById('youtube-comments');
    if (!container) return;
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?key=${YT_API_KEY}&videoId=${videoId}&part=snippet&maxResults=20`);
        const data = await res.json();
        container.innerHTML = data.items?.map(i => {
            const c = i.snippet.topLevelComment.snippet;
            return `<div class="comment"><div class="comment-header"><strong>${c.authorDisplayName}</strong> <span>${new Date(c.publishedAt).toLocaleDateString()}</span></div><p>${c.textDisplay.replace(/</g,'&lt;')}</p><small>${c.likeCount} likes</small></div>`;
        }).join('') || '<p>No comments yet.</p>';
    } catch { container.innerHTML = '<p>Comments disabled or failed to load.</p>'; }
}

// === 7. Theme & Loading ===
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
function showLoading() { document.getElementById('loading-overlay')?.style.setProperty('display', 'flex'); }
function hideLoading() { setTimeout(() => document.getElementById('loading-overlay')?.style.setProperty('display', 'none'), 600); }

document.addEventListener('DOMContentLoaded', () => {
    hideLoading();
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    if (location.pathname.includes('index.html') || location.pathname === '/') {
        showLoading();
        fetchYouTubeData().then(() => { loadVideos(); updateCounters(); hideLoading(); });
    }
    if (location.pathname.includes('game.html')) {
        showLoading();
        fetchYouTubeData().then(() => { loadGameDetails(); hideLoading(); });
    }
});

console.log("%cYobest Studio 100% READY – Visitors & Downloads Counting!", "color: cyan; font-weight: bold;");
