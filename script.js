// ======================================================
//      YOBEST STUDIO – FULL script.js (2025 FINAL FIXED)
//  Everything Working: Games Show + Auth + Nitro + Counters
// ======================================================
console.log("%cYobest Studio Loaded – FULLY FIXED & GOD MODE", "color: #00ffea; font-size: 20px; font-weight: bold;");

// ==================== 1. SUPABASE CLIENT ====================
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => {
    const customScript = document.createElement('script');
    customScript.src = 'supabase.js';
    customScript.onload = () => {
        console.log("%cSupabase + Auth + Nitro → 100% CONNECTED", "color: cyan;");
        updateAuthUI();
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

// ==================== 6. FULL GAME PREVIEWS ARRAY (RESTORED & FIXED) ====================
const YT_API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k';

let gamePreviews = [
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=gHeW6FvXmkk",downloadLink:"https://workink.net/1RdO/o1tps3s0",download:true,gameLink:"https://www.roblox.com/games/102296952865049/Yobest-Ball-Game",gamePlay:true,price:"Free",title:"Yobest Ball Game",views:124000,likes:5200,publishedAt:"2025-01-15"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=XiGrxZNzpZM",downloadLink:"https://workink.net/1RdO/d072o5mz",download:true,gameLink:"https://www.roblox.com/games/16907652511/Yobests-Anime-Guardian-Clash-Up2",gamePlay:true,price:"Free",title:"Anime Guardian Clash UP2",views:289000,likes:13400,publishedAt:"2025-02-20"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=o3VxS9r2OwY",downloadLink:"https://www.roblox.com/game-pass/1012039728/Display-All-Units",download:true,gameLink:"https://www.roblox.com/games/82747399384275/Anime-Yobest-Av-up2",gamePlay:true,price:"600 Robux",title:"Anime Yobest AV UP2",views:412000,likes:18900,publishedAt:"2025-03-10"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=6mDovQ4d87M",downloadLink:"https://workink.net/1RdO/fhj69ej0",download:true,gameLink:"https://www.roblox.com/games/15958463952/skibidi-tower-defense-BYTR-UP-4",gamePlay:true,price:"Free",title:"Skibidi Tower Defense UP4",views:567000,likes:29800,publishedAt:"2025-04-05"},
    {creator:"Yobest",videoLink:"https://www.youtube.com/watch?v=pMrRFF7dHYM",downloadLink:"https://mega.nz/file/YTd1gJqa#NzndT5ZOZS4wjo1gc9j7XHdsuBOMFvvHkb9y34EbESw",download:true,gameLink:"",gamePlay:false,price:"Free",title:"Secret Project",views:89000,likes:6700,publishedAt:"2025-05-01"},
    // Add more games here...
];

// ==================== 7. YOUTUBE DATA + THUMBNAILS (FIXED) ====================
async function fetchYouTubeData() {
    for (let game of gamePreviews) {
        if (game.videoLink.includes('youtube.com') || game.videoLink.includes('youtu.be')) {
            const videoId = game.videoLink.split('v=')[1]?.split('&')[0] || game.videoLink.split('/').pop();
            try {
                const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YT_API_KEY}`);
                const data = await res.json();
                if (data.items?.[0]) {
                    const item = data.items[0];
                    game.title = item.snippet.title;
                    game.thumbnail = item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url;
                    game.views = parseInt(item.statistics.viewCount);
                    game.likes = parseInt(item.statistics.likeCount);
                    game.publishedAt = item.snippet.publishedAt;
                    game.description = item.snippet.description;
                }
            } catch (e) { console.warn("YouTube API failed for", videoId); }
        }
    }
}

// ==================== 8. LOAD VIDEOS + PAGINATION (FIXED) ====================
let currentPage = 1;
const itemsPerPage = 12;

function parsePrice(price) {
    return price.includes('Robux') ? parseInt(price) : (price === 'Free' ? 0 : 999999);
}

function loadVideos(search = '', sort = '') {
    let filtered = gamePreviews.filter(g => 
        (g.title || '').toLowerCase().includes(search.toLowerCase())
    );

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

    document.getElementById('video-count').textContent = filtered.length;

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = filtered.slice(start, end);

    const container = document.getElementById('video-list');
    container.innerHTML = pageItems.map(g => `
        <div class="video-card" onclick="openGame('${g.videoLink.split('v=')[1] || g.videoLink.split('/').pop()}')">
            <img src="${g.thumbnail || 'https://i.imgur.com/8Q3Z2yK.png'}" loading="lazy" alt="${g.title}">
            <div class="info">
                <h3>${g.title || 'Untitled Game'}</h3>
                <p>${Number(g.views || 0).toLocaleString()} views • ${g.price}</p>
            </div>
        </div>
    `).join('');

    renderPagination(filtered.length);
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentPage ? 'active' : '';
        btn.onclick = () => { currentPage = i; loadVideos(); window.scrollTo(0, 0); };
        pagination.appendChild(btn);
    }
}

function openGame(id) {
    const game = gamePreviews.find(g => g.videoLink.includes(id));
    if (game) {
        sessionStorage.setItem('currentGame', JSON.stringify(game));
        location.href = 'game.html';
    }
}

// ==================== 9. AUTH UI + USER SEARCH ====================
function updateAuthUI() {
    if (typeof currentUser === 'undefined') return;
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    if (!authButtons || !userMenu) return;

    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        const profile = currentUser.user_metadata || {};
        document.getElementById('user-avatar').src = profile.avatar_headshot || 'https://i.imgur.com/8Q3Z2yK.png';
        document.getElementById('user-name').textContent = profile.roblox_username || 'User';
        if (profile.roblox_username?.toLowerCase() === 'lo11iioo') {
            document.getElementById('user-avatar').classList.add('nitro-owner');
        }
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

let userSearchTimeout;
document.getElementById('user-search-input')?.addEventListener('input', async function(e) {
    const query = e.target.value.trim();
    const results = document.getElementById('user-search-results');
    if (!query || query.length < 2) {
        results.innerHTML = ''; results.style.display = 'none'; return;
    }
    clearTimeout(userSearchTimeout);
    userSearchTimeout = setTimeout(async () => {
        try {
            const res = await fetch(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(query)}&limit=10`);
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

// ==================== 10. THEME & LOADING ====================
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
function showLoading() { document.getElementById('loading-overlay')?.style.setProperty('display', 'flex'); }
function hideLoading() { setTimeout(() => document.getElementById('loading-overlay')?.style.setProperty('display', 'none'), 600); }

// ==================== 11. ON PAGE LOAD ====================
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

        document.getElementById('search-input')?.addEventListener('input', (e) => {
            currentPage = 1;
            loadVideos(e.target.value);
        });
        document.getElementById('sort-select')?.addEventListener('change', (e) => {
            currentPage = 1;
            loadVideos('', e.target.value);
        });
    }

    if (location.pathname.includes('game.html')) {
        showLoading();
        fetchYouTubeData().then(loadGameDetails).finally(hideLoading);
    }

    updateAuthUI();
});

console.log("%cYOBEST STUDIO 2025 → FULLY FIXED & UNSTOPPABLE", "color: #ff00ff; font-size: 22px; font-weight: bold;");
