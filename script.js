// ======================================================
//      YOBEST STUDIO – FULL script.js (2025 FINAL)
//  Pagination + Supabase + YouTube + game.html + Everything
// ======================================================
console.log("%cYobest Studio Loaded – FULL POWER MODE", "color: #00ffea; font-size: 18px; font-weight: bold;");

// ==================== 1. SUPABASE ====================
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => {
    const customScript = document.createElement('script');
    customScript.src = 'supabase.js'; // Your Supabase config file
    customScript.onload = () => console.log("%cSupabase Connected & Ready!", "color: cyan;");
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
faCSS.integrity = 'sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==';
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

// ==================== 6. YOUTUBE + GAMES DATA ====================
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

// ==================== 7. PAGINATION SYSTEM ====================
const itemsPerPage = 9;
let currentPage = 1;

function parsePrice(price) {
    if (!price || price.toLowerCase().includes('free')) return 0;
    return parseInt(price.replace(/\D/g, '')) || 999999;
}

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

function changePage(page) {
    const search = (document.getElementById('search-input')?.value || '').toLowerCase();
    const filteredCount = gamePreviews.filter(g => (g.title || '').toLowerCase().includes(search)).length;
    const totalPages = Math.ceil(filteredCount / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    loadVideos();

    document.getElementById('game-previews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==================== 8. FETCH YOUTUBE DATA ====================
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
    } catch (e) {
        console.error('YouTube API Error:', e);
    }
}

// ==================== 9. LOAD VIDEOS (WITH PAGINATION) ====================
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

    document.getElementById('video-count').textContent = filtered.length;

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

// ==================== 10. OPEN GAME → game.html ====================
function openGame(id) {
    const game = gamePreviews.find(g => g.videoLink.includes(id));
    if (game) {
        sessionStorage.setItem('currentGame', JSON.stringify(game));
        location.href = 'game.html';
    }
}

// ==================== 11. GAME.HTML: LOAD DETAILS & COMMENTS ====================
async function loadGameDetails() {
    const game = JSON.parse(sessionStorage.getItem('currentGame') || 'null');
    if (!game) return location.href = 'index.html';

    document.getElementById('video-player').src = `https://www.youtube.com/embed/${game.videoLink.split('v=')[1]}?autoplay=1&rel=0&modestbranding=1`;
    document.getElementById('video-title').textContent = game.title || "Game";
    document.getElementById('video-views').textContent = Number(game.views || 0).toLocaleString();
    document.getElementById('video-likes').textContent = Number(game.likes || 0).toLocaleString();
    document.getElementById('video-date').textContent = new Date(game.publishedAt || Date.now()).toLocaleDateString('en-GB');
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
    } catch {
        container.innerHTML = '<p>Comments failed to load.</p>';
    }
}

// ==================== 12. THEME & LOADING ====================
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
function showLoading() { document.getElementById('loading-overlay')?.style.setProperty('display', 'flex'); }
function hideLoading() { setTimeout(() => document.getElementById('loading-overlay')?.style.setProperty('display', 'none'), 600); }

// ==================== 13. ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', () => {
    hideLoading();
    if (localStorage.getItem('theme') === 'light') document.body.classList.add('light-mode');
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

    // Load Supabase counters
    setTimeout(() => {
        if (window.loadCounters) window.loadCounters();
        if (window.trackVisitor) window.trackVisitor();
    }, 1500);

    // INDEX PAGE
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

    // GAME PAGE
    if (location.pathname.includes('game.html')) {
        showLoading();
        fetchYouTubeData().then(() => {
            loadGameDetails();
            hideLoading();
        });
    }
});

console.log("%cYobest Studio – GOD MODE ACTIVATED", "color: #ff00ff; font-size: 20px; font-weight: bold;");
