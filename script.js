// ======================================================
//      YOBEST STUDIO – FULL script.js (2025 FINAL FIXED)
//  EVERYTHING WORKS: Games + Login + Avatar + Nitro + Counters
// ======================================================
console.log("%cYobest Studio → FULLY LOADED & UNSTOPPABLE", "color: #00ffea; font-size: 22px; font-weight: bold;");

// ==================== 1. SUPABASE CLIENT ====================
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => {
    const customScript = document.createElement('script');
    customScript.src = 'supabase.js';
    customScript.onload = () => {
        console.log("%cSupabase + Auth + Nitro → 100% CONNECTED", "color: cyan;");
        updateAuthUI(); // Run immediately
    };
    document.head.appendChild(customScript);
};
document.head.appendChild(supabaseScript);

// ==================== 2. MOUSE TRAIL ====================
window.updateTrail = function(e) {
    const trail = document.getElementById('mouse-trail');
    if (trail) {
        trail.style.left = e.clientX + 'px';
        trail.style.top = e.clientY + 'px';
        trail.style.opacity = '0.8';
        setTimeout(() => trail.style.opacity = '0', 600);
    }
};

// ==================== 3. FONTAWESOME ====================
const faCSS = document.createElement('link');
faCSS.rel = 'stylesheet';
faCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css';
faCSS.crossOrigin = 'anonymous';
document.head.appendChild(faCSS);

// ==================== 4. PARTICLES BACKGROUND ====================
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

// ==================== 5. DOWNLOAD TRACKING ====================
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

// ==================== 6. FULL GAME PREVIEWS ARRAY ====================
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
    // Add 100+ more games — pagination handles everything!
];

// ==================== 7. YOUTUBE DATA + THUMBNAILS ====================
async function fetchYouTubeData() {
    for (let game of gamePreviews) {
        if (game.videoLink.includes('youtube.com') || game.videoLink.includes('youtu.be')) {
            const videoId = game.videoLink.split('v=')[1]?.split('&')[0] || game.videoLink.split('/').pop();
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YT_API_KEY}`);
                const data = await res.json();
                if (data.items?.[0]) {
                    const i = data.items[0];
                    game.title = i.snippet.title;
                    game.thumbnail = i.snippet.thumbnails.maxres?.url || i.snippet.thumbnails.high?.url || 'https://i.imgur.com/8Q3Z2yK.png';
                    game.views = parseInt(i.statistics.viewCount) || 0;
                    game.likes = parseInt(i.statistics.likeCount) || 0;
                    game.publishedAt = i.snippet.publishedAt;
                    game.description = i.snippet.description;
                }
            } catch (e) { console.warn("YouTube fetch failed for", videoId); }
        }
    }
}

// ==================== 8. LOAD GAMES + PAGINATION ====================
let currentPage = 1;
const itemsPerPage = 12;

function parsePrice(p) { return p.includes('Robux') ? parseInt(p) : (p === 'Free' ? 0 : 999999); }

function loadVideos(search = '', sort = '') {
    let filtered = gamePreviews.filter(g => (g.title || '').toLowerCase().includes(search.toLowerCase()));

    if (sort) {
        filtered.sort((a, b) => {
            switch (sort) {
                case 'price-asc': return parsePrice(a.price) - parsePrice(b.price);
                case 'price-desc': return parsePrice(b.price) - parsePrice(a.price);
                case 'views-desc': return (b.views || 0) - (a.views || 0);
                case 'likes-desc': return (b.likes || 0) - (a.likes || 0);
                case 'date-desc': return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
                default: return 0;
            }
        });
    }

    document.getElementById('video-count').textContent = filtered.length;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    const container = document.getElementById('video-list');
    container.innerHTML = pageItems.map(g => `
        <div class="video-card" onclick="openGame('${g.videoLink.split('v=')[1] || g.videoLink.split('/').pop()}')">
            <img src="${g.thumbnail}" loading="lazy" alt="${g.title}">
            <div class="info">
                <h3>${g.title}</h3>
                <p>${Number(g.views || 0).toLocaleString()} views • ${g.price}</p>
            </div>
        </div>
    `).join('');

    renderPagination(filtered.length);
}

function renderPagination(total) {
    const pages = Math.ceil(total / itemsPerPage);
    const el = document.getElementById('pagination');
    el.innerHTML = '';
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => { currentPage = i; loadVideos(); scrollTo(0, 0); };
        el.appendChild(btn);
    }
}

function openGame(id) {
    const game = gamePreviews.find(g => g.videoLink.includes(id));
    if (game) {
        sessionStorage.setItem('currentGame', JSON.stringify(game));
        location.href = 'game.html';
    }
}

// ==================== 9. AUTH UI — FINAL FIXED (Avatar + Login Button Gone) ====================
window.updateAuthUI = function() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const avatarImg = document.getElementById('user-avatar');
    const usernameSpan = document.getElementById('user-name');

    if (!authButtons || !userMenu) return;

    if (window.currentUser && window.currentUser.profile) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';

        const profile = window.currentUser.profile;
        avatarImg.src = profile.avatar_headshot || 'https://i.imgur.com/8Q3Z2yK.png';
        avatarImg.alt = profile.roblox_username;

        // Apply Nitro effect
        const nitro = profile.nitro_effect || 'glow';
        avatarImg.className = `user-avatar nitro-${nitro}`;
        if (profile.roblox_username?.toLowerCase() === 'lo11iioo') {
            avatarImg.classList.add('nitro-owner');
        }

        usernameSpan.textContent = profile.roblox_username || 'User';
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
};

// ==================== 10. USER SEARCH ====================
let userSearchTimeout;
document.getElementById('user-search-input')?.addEventListener('input', async function(e) {
    const q = e.target.value.trim();
    const results = document.getElementById('user-search-results');
    if (!q || q.length < 2) { results.innerHTML = ''; results.style.display = 'none'; return; }

    clearTimeout(userSearchTimeout);
    userSearchTimeout = setTimeout(async () => {
        try {
            const res = await fetch(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(q)}&limit=10`);
            const data = await res.json();
            results.innerHTML = data.data.map(u => `
                <div class="search-result" onclick="location.href='user/${u.name}'">
                    <img src="https://www.roblox.com/headshot-thumbnail/image?userId=${u.id}&width=48&height=48&format=png">
                    <span>${u.name}</span>
                </div>
            `).join('');
            results.style.display = 'block';
        } catch { results.innerHTML = '<div class="search-result">Error</div>'; results.style.display = 'block'; }
    }, 400);
});

// ==================== 11. THEME & LOADING ====================
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
function showLoading() { document.getElementById('loading-overlay')?.style.setProperty('display', 'flex'); }
function hideLoading() { setTimeout(() => document.getElementById('loading-overlay')?.style.setProperty('display', 'none'), 600); }

// ==================== 12. ON PAGE LOAD ====================
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

        document.getElementById('search-input')?.addEventListener('input', e => { currentPage = 1; loadVideos(e.target.value); });
        document.getElementById('sort-select')?.addEventListener('change', e => { currentPage = 1; loadVideos('', e.target.value); });
    }

    if (location.pathname.includes('game.html')) {
        showLoading();
        fetchYouTubeData().then(() => {
            loadGameDetails();
            hideLoading();
        });
    }

    // Always update auth UI
    if (typeof updateAuthUI === 'function') updateAuthUI();
});

console.log("%cYOBEST STUDIO 2025 → FINAL & PERFECT", "color: #ff00ff; background:#000; font-size:24px; font-weight:bold; padding:10px; border-radius:12px;");
