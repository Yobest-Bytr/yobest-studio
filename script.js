// ======================================================
// YOBEST STUDIO – FINAL & COMPLETE script.js
// Animated Background + YouTube Data + Vercel Analytics
// November 21, 2025 – Fully Working on Vercel
// ======================================================

const canvas = document.getElementById('particles-canvas');
const ctx = canvas?.getContext('2d');
const trail = document.getElementById('mouse-trail');

if (canvas && ctx) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    let particles = [];
    const numParticles = 130;

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

    const init = () => { particles = []; for (let i = 0; i < numParticles; i++) particles.push(new Particle()); };
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    };
    const connectParticles = () => {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const distance = Math.hypot(particles[a].x - particles[b].x, particles[a].y - particles[b].y);
                if (distance < 130) {
                    ctx.strokeStyle = `rgba(0,238,255,${1 - distance / 130})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    };

    window.addEventListener('resize', () => { canvas.width = innerWidth; canvas.height = innerHeight; init(); });
    window.updateTrail = e => {
        if (trail) {
            trail.style.left = e.clientX + 'px';
            trail.style.top = e.clientY + 'px';
            trail.style.opacity = '0.7';
            setTimeout(() => trail.style.opacity = '0', 600);
        }
    };

    init();
    animate();
}

// ==================== Vercel Analytics (Visitors & Downloads) ====================
async function trackEvent(type) {
    try {
        await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type })
        });
    } catch (e) { /* silent */ }
}

async function updateCounters() {
    try {
        const res = await fetch('/api/track');
        if (!res.ok) return;
        const data = await res.json();
        if (document.getElementById('site-visitors')) {
            document.getElementById('site-visitors').textContent = Number(data.visitors || 0).toLocaleString();
        }
        if (document.getElementById('total-downloads')) {
            document.getElementById('total-downloads').textContent = Number(data.downloads || 0).toLocaleString();
        }
    } catch (e) { console.error(e); }
}

// Track visitor on first load
trackEvent('visitor');
updateCounters();
setInterval(updateCounters, 5000);

// Track downloads when clicking any download button
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && (
        link.id === 'download-btn' ||
        link.href.includes('workink.net') ||
        link.href.includes('mega.nz') ||
        link.href.includes('roblox.com/game-pass')
    )) {
        trackEvent('download');
    }
});

// ==================== YouTube Data ====================
const YT_API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k';

let gamePreviews = [
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=gHeW6FvXmkk",downloadLink:"https://workink.net/1RdO/o1tps3s0",download:true,gameLink:"https://www.roblox.com/games/102296952865049/Yobest-Ball-Game",gamePlay:true,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=XiGrxZNzpZM",downloadLink:"https://workink.net/1RdO/d072o5mz",download:true,gameLink:"https://www.roblox.com/games/16907652511/Yobests-Anime-Guardian-Clash-Up2",gamePlay:true,price:"Free"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=o3VxS9r2OwY",downloadLink:"https://www.roblox.com/game-pass/1012039728/Display-All-Units",download:true,gameLink:"",gamePlay:false,price:"290 Robux"},
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
    } catch (e) { console.error(e); }
}

function loadVideos() {
    const container = document.getElementById('video-list');
    if (!container) return;
    document.getElementById('video-count').textContent = gamePreviews.length;
    container.innerHTML = gamePreviews.map(g => `
        <div class="video-card" onclick="openGame('${g.videoLink.split('v=')[1]}')">
            <img src="${g.thumbnail}" loading="lazy" alt="${g.title}">
            <div class="info">
                <h3>${g.title}</h3>
                <p>${Number(g.views).toLocaleString()} views • ${g.price}</p>
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
    document.getElementById('video-title').textContent = game.title || "Amazing Game";
    document.getElementById('video-views').textContent = Number(game.views || 0).toLocaleString();
    document.getElementById('video-likes').textContent = Number(game.likes || 0).toLocaleString();
    document.getElementById('video-date').textContent = game.publishedAt || "2025";
    document.getElementById('video-price').textContent = game.price;

    document.getElementById('video-description').innerHTML = (game.description || "No description available.").replace(/\n/g, '<br>');

    const dlBtn = document.getElementById('download-btn');
    const playBtn = document.getElementById('try-game-btn');
    if (game.download && game.downloadLink) { dlBtn.href = game.downloadLink; dlBtn.style.display = 'inline-flex'; }
    if (game.gamePlay && game.gameLink) { playBtn.href = game.gameLink; playBtn.style.display = 'inline-flex'; }

    await loadYouTubeComments(game.videoLink.split('v=')[1]);
}

async function loadYouTubeComments(videoId) {
    const container = document.getElementById('youtube-comments');
    if (!container) return;
    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?key=${YT_API_KEY}&videoId=${videoId}&part=snippet&maxResults=20`);
        const data = await res.json();
        container.innerHTML = data.items?.map(item => {
            const c = item.snippet.topLevelComment.snippet;
            return `<div class="comment"><div class="comment-header"><strong>${c.authorDisplayName}</strong><span>${new Date(c.publishedAt).toLocaleDateString()}</span></div><p>${c.textDisplay.replace(/</g,'&lt;')}</p><small>${c.likeCount} likes</small></div>`;
        }).join('') || '<p>No comments yet.</p>';
    } catch { container.innerHTML = '<p>Comments disabled or failed to load.</p>'; }
}

// ==================== Theme & Loading ====================
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

function showLoading() { document.getElementById('loading-overlay')?.style.setProperty('display', 'flex'); }
function hideLoading() { setTimeout(() => document.getElementById('loading-overlay')?.style.setProperty('display', 'none'), 600); }

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
    hideLoading();
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    if (location.pathname.includes('index.html') || location.pathname === '/') {
        showLoading();
        fetchYouTubeData().then(() => { loadVideos(); hideLoading(); updateCounters(); });
    }

    if (location.pathname.includes('game.html')) {
        showLoading();
        fetchYouTubeData().then(() => { loadGameDetails(); hideLoading(); });
    }
});
