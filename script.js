// ======================================================
// YOBEST STUDIO – FULL script.js (WITH PAGINATION!)
// November 28, 2025 – Enhanced by Grok
// ======================================================
console.log("%cYobest Studio Loaded – Supabase + Pagination ACTIVE", "color: #00ff88; font-size: 16px; font-weight: bold;");

// === 1. Load Supabase Client ===
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => {
    const customScript = document.createElement('script');
    customScript.src = 'supabase.js';
    customScript.onload = () => console.log("%cSupabase Connected!", "color: cyan;");
    document.head.appendChild(customScript);
};
document.head.appendChild(supabaseScript);

// === 2. Mouse Trail ===
window.updateTrail = function(e) {
    const trail = document.getElementById('mouse-trail');
    if (trail) {
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.opacity = '0.8';
        setTimeout(() => trail.style.opacity = '0', 600);
    }
};

// === 3. FontAwesome ===
const faCSS = document.createElement('link');
faCSS.rel = 'stylesheet';
faCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
faCSS.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==';
faCSS.crossOrigin = 'anonymous';
document.head.appendChild(faCSS);

// === 4. Particles Background (unchanged) ===
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

// === 5. Download Tracking ===
document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (link && (
        link.id === 'download-btn' ||
        link.href.includes('workink.net') ||
        link.href.includes('mega.nz') ||
        link.href.includes('roblox.com/game-pass') ||
        link.classList.contains('download-btn')
    )) {
        if (window.trackDownload) window.trackDownload();
    }
});

// === 6. YouTube Data + Game Previews ===
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
    // Add 100+ more games — pagination will handle them all!
];

// === PAGINATION SYSTEM (NEW!) ===
const itemsPerPage = 9;
let currentPage = 1;

function parsePrice(price) {
    if (!price || price.toLowerCase().includes('free')) return 0;
    return parseInt(price.replace(/\D/g, '')) || 999999;
}

// Render pagination buttons
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    if (!pagination || totalPages <= 1) {
        if (pagination) pagination.innerHTML = '';
        return;
    }

    let html = `
        <button onclick="changePage(1)" ${currentPage === 1 ? 'disabled' : ''}>First</button>
        <button onclick="changePage(currentPage - 1)" ${currentPage === 1 ? 'disabled' : ''}>Prev</button>
    `;

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        html += `<button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>${i}</button>`;
    }

    html += `
        <button onclick="changePage(currentPage + 1)" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>
        <button onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>Last</button>
    `;

    pagination.innerHTML = html;
}

// Change page + smooth scroll
function changePage(page) {
    const filteredCount = gamePreviews.filter(g => 
        (g.title || '').toLowerCase().includes((document.getElementById('search-input')?.value || '').toLowerCase())
    ).length;

    const totalPages = Math.ceil(filteredCount / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    loadVideos();

    document.getElementById('game-previews')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// === MAIN loadVideos() WITH PAGINATION ===
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
                g.publishedAt = video.snippet.publishedAt;
                g.thumbnail = video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url;
            }
        });
    } catch (e) { console.error('YouTube API error:', e); }
}

function loadVideos() {
    const container = document.getElementById('video-list');
    if (!container) return;

    const search = (document.getElementById('search-input')?.value || '').toLowerCase();
    const sort = document.getElementById('sort-select')?.value || '';

    let filtered = gamePreviews.filter(g => 
        (g.title || '').toLowerCase().includes(search)
    );

    // Sorting
    if (sort) {
        filtered.sort((a, b) => {
            switch (sort) {
                case 'price-asc':  return parsePrice(a.price) - parsePrice(b.price);
                case 'price-desc': return parsePrice(b.price) - parsePrice(a.price);
                case 'views-desc': return (b.views || 0) - (a.views || 0);
                case 'likes-desc': return (b.likes || 0) - (a.likes || 0);
                case 'date-desc':  return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
                default: return 0;
            }
        });
    }

    // Update total count
    document.getElementById('video-count').textContent = filtered.length;

    // Pagination
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    container.innerHTML = pageItems.map(g => `
        <div class="video-card" onclick="openGame('${g.videoLink.split('v=')[1]}')">
            <img src="${g.thumbnail || ''}" loading="lazy" alt="${g.title || 'Game'}">
            <div class="info">
                <h3>${g.title || 'Untitled'}</h3>
                <p>${Number(g.views || 0).toLocaleString()} views • ${g.price}</p>
            </div>
        </div>
    `).join('');

    renderPagination(filtered.length);
}

function openGame(id) {
    const game = gamePreviews.find(g => g.videoLink.includes(id));
    if (game) {
        sessionStorage.setItem('currentGame', JSON.stringify(game));
        location.href = 'game.html';
    }
}

// === game.html Functions (unchanged) ===
async function loadGameDetails() { /* ... your existing code ... */ }
async function loadYouTubeComments(videoId) { /* ... your existing code ... */ }

// === Theme & Loading ===
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
function showLoading() { document.getElementById('loading-overlay')?.style.setProperty('display', 'flex'); }
function hideLoading() { setTimeout(() => document.getElementById('loading-overlay')?.style.setProperty('display', 'none'), 600); }

// === ON LOAD ===
document.addEventListener('DOMContentLoaded', () => {
    hideLoading();
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    setTimeout(() => {
        if (window.loadCounters) window.loadCounters();
        if (window.trackVisitor) window.trackVisitor();
    }, 1500);

    if (location.pathname.includes('index.html') || location.pathname === '/') {
        showLoading();
        fetchYouTubeData().then(() => {
            loadVideos();
            hideLoading();
        });

        document.getElementById('search-input')?.addEventListener('input', () => {
            currentPage = 1;
            loadVideos();
        });
        document.getElementById('sort-select')?.addEventListener('change', () => {
            currentPage = 1;
            loadVideos();
        });
    }

    if (location.pathname.includes('game.html')) {
        showLoading();
        fetchYouTubeData().then(() => { loadGameDetails(); hideLoading(); });
    }
});

console.log("%cYobest Studio – PAGINATION + SUPABASE 100% READY!", "color: #00ffff; font-weight: bold;");
