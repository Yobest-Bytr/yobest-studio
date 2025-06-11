// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-e03MCfDrp909_wSziGxsw8JPvSYuhoI",
    projectId: "yobest-bytr",
    storageBucket: "yobest-bytr.firebasestorage.app",
    messagingSenderId: "661309795820",
    appId: "1:661309795820:web:e16ba92bdd31d2f090a4c9",
    measurementId: "G-841WBKEVR0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Grok AI API Key
const GROK_API_KEY = 'XAI-VET7JAOPYCFCVAVUXGVBB418xatb7vecq4MGCT1GVAVYVBWTDHIBSJAZABUPO90CGLCLCT5VMHF3';

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Loading Overlay
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

// AdBlocker Detection
function detectAdBlocker() {
    return new Promise((resolve) => {
        const testAd = document.createElement('div');
        testAd.className = 'adsbygoogle';
        document.body.appendChild(testAd);
        setTimeout(() => {
            const adBlocked = testAd.offsetHeight === 0;
            document.body.removeChild(testAd);
            resolve(adBlocked);
        }, 100);
    });
}

// YouTube API Integration
const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with a valid YouTube API key
let gamePreviews = [
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=6mDovQ4d87M", downloadLink: "https://workink.net/1RdO/fhj69ej0", download: true, gameLink: "https://www.roblox.com/games/15958463952/skibidi-tower-defense-BYTR-UP-4", gamePlay: true, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=pMrRFF7dHYM", downloadLink: "https://mega.nz/file/YTd1gJqa#NzndT5ZOZS4wjo1gc9j7XHdsuBOMFvvHkb9y34EbESw", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=97f1sqtWy6o", downloadLink: "https://workink.net/1RdO/lmm1ufst", download: true, gameLink: "https://www.roblox.com/games/14372275044/tower-defense-Anime", gamePlay: true, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=dsDqBZBLpfg", downloadLink: "https://workink.net/1RdO/lmfdv0b3", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=sPauNcqbkBU", downloadLink: "", download: false, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=IKmXPPhLeLk", downloadLink: "", download: false, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=w9OLn8YValE", downloadLink: "https://workink.net/1RdO/ltk7rklv", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=kXMamYt5Zd8", downloadLink: "https://workink.net/1RdO/lu5jed0c", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=5BYv9x_E2Iw", downloadLink: "https://workink.net/1RdO/lsgkci8u", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=bW3ILQnV6Rw", downloadLink: "https://workink.net/1RdO/ln08hlhk", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=ofOqiIa_Q3Y", downloadLink: "https://workink.net/1RdO/lmkp2h0j", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=KATJLumZSOs", downloadLink: "https://workink.net/1RdO/lm95jqw3", download: true, gameLink: "", gamePlay: false, price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=pMrRFF7dHYM", downloadLink: "https://workink.net/1RdO/lu5jed0c", download: true, gameLink: "", gamePlay: false, price: "Free" }
];

async function fetchYouTubeVideos() {
    showLoading();
    const videoIds = gamePreviews.map(video => video.videoLink.split('v=')[1]).join(',');
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,statistics`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch video data');
        const data = await response.json();

        gamePreviews = gamePreviews.map((video, index) => {
            const item = data.items.find(i => i.id === video.videoLink.split('v=')[1]) || {};
            return {
                ...video,
                title: item.snippet?.title || "Untitled",
                thumbnail: item.snippet?.thumbnails?.high?.url || "https://img.youtube.com/vi/6mDovQ4d87M/maxresdefault.jpg",
                views: item.statistics?.viewCount || "0",
                likes: item.statistics?.likeCount || "0",
                date: item.snippet?.publishedAt?.split('T')[0] || "Unknown",
                description: item.snippet?.description || "No description available."
            };
        });
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        showNotification('Failed to load videos. Using fallback data.', 'error');
        gamePreviews = gamePreviews.map(video => ({
            ...video,
            title: "Fallback Title",
            thumbnail: "https://img.youtube.com/vi/6mDovQ4d87M/maxresdefault.jpg",
            views: "10000",
            likes: "500",
            date: "2025-03-01",
            description: "This is a fallback description."
        }));
    } finally {
        hideLoading();
    }
}

function loadVideos() {
    const videoList = document.getElementById('video-list');
    const videoCount = document.getElementById('video-count');
    if (videoList) {
        videoList.innerHTML = gamePreviews.map(video => `
            <div class="video-card" onclick="window.location.href='game.html?video=${encodeURIComponent(video.videoLink)}'">
                <img src="${video.thumbnail}" alt="${video.title}">
                <div class="info">
                    <h3>${video.title}</h3>
                    <p><i class="fas fa-user"></i> ${video.creator}</p>
                    <p><i class="fas fa-eye"></i> ${video.views}</p>
                    <p><i class="fas fa-thumbs-up"></i> ${video.likes}</p>
                    <p><i class="fas fa-calendar"></i> ${video.date}</p>
                    <p><i class="fas fa-money-bill"></i> ${video.price}</p>
                </div>
            </div>
        `).join('');
        if (videoCount) videoCount.textContent = gamePreviews.length;
    }
}

function loadGameDetails() {
    const params = new URLSearchParams(window.location.search);
    const videoLink = params.get('video');
    const video = gamePreviews.find(v => v.videoLink === decodeURIComponent(videoLink));
    if (video) {
        document.getElementById('video-player').src = `https://www.youtube.com/embed/${video.videoLink.split('v=')[1]}`;
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-description').textContent = video.description;
        document.getElementById('video-views').textContent = video.views;
        document.getElementById('video-likes').textContent = video.likes;
        document.getElementById('video-date').textContent = video.date;
        document.getElementById('video-price').textContent = video.price;
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.href = video.downloadLink;
        downloadBtn.onclick = () => {
            db.ref('siteStats').transaction(stats => {
                stats = stats || { visitors: 0, downloads: 0 };
                stats.downloads++;
                return stats;
            });
            updateStats();
        };
        if (video.gamePlay) {
            const tryButton = document.getElementById('try-game-btn');
            tryButton.href = video.gameLink;
            tryButton.style.display = 'inline-block';
        }
        loadYouTubeComments(video.videoLink.split('v=')[1]);
    } else {
        showNotification('Video not found!', 'error');
    }
}

async function loadYouTubeComments(videoId) {
    const commentsList = document.getElementById('youtube-comments');
    if (commentsList) {
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?key=${API_KEY}&videoId=${videoId}&part=snippet&maxResults=10`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch YouTube comments');
            const data = await response.json();
            const comments = data.items.map(item => ({
                username: item.snippet.topLevelComment.snippet.authorDisplayName,
                content: item.snippet.topLevelComment.snippet.textDisplay,
                date: item.snippet.topLevelComment.snippet.publishedAt.split('T')[0],
                likes: item.snippet.topLevelComment.snippet.likeCount || 0
            }));
            commentsList.innerHTML = comments.map(c => `
                <div class="comment">
                    <div class="comment-header">
                        <span>${c.username}</span>
                        <span>${c.date}</span>
                    </div>
                    <p>${c.content}</p>
                    <div class="comment-likes">
                        <i class="fas fa-thumbs-up"></i> ${c.likes}
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching YouTube comments:', error);
            showNotification('Failed to load YouTube comments.', 'error');
            commentsList.innerHTML = '<p>Unable to load comments at this time.</p>';
        }
    }
}

// AI Chat with Grok Integration
async function sendToAI() {
    const input = document.getElementById('ai-input');
    const chatHistory = document.getElementById('chat-history');
    const message = input.value.trim();

    if (!message) return;

    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message';
    userMessage.innerHTML = `<strong>You:</strong> ${message}`;
    chatHistory.appendChild(userMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const response = await fetch('https://api.x.ai/v1/grok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROK_API_KEY}`
            },
            body: JSON.stringify({ query: message })
        });

        if (!response.ok) throw new Error('Failed to get AI response');
        const data = await response.json();
        const aiReply = data.response || 'Sorry, I could not process your request.';

        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.innerHTML = `<strong>Grok AI:</strong> ${aiReply}`;
        chatHistory.appendChild(aiMessage);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        // Save chat history to localStorage
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        history.push({ user: message, ai: aiReply, timestamp: Date.now() });
        localStorage.setItem('chatHistory', JSON.stringify(history.slice(-50))); // Limit to last 50 messages
    } catch (error) {
        console.error('AI chat error:', error);
        showNotification('Failed to get AI response.', 'error');
    }

    input.value = '';
}

// Stats Update
function updateStats() {
    db.ref('siteStats').once('value', (snapshot) => {
        const stats = snapshot.val() || { visitors: 0, downloads: 0 };
        const siteVisitors = document.getElementById('site-visitors');
        const totalDownloads = document.getElementById('total-downloads');
        if (siteVisitors) siteVisitors.textContent = stats.visitors;
        if (totalDownloads) totalDownloads.textContent = stats.downloads;
    });
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html')) {
        fetchYouTubeVideos().then(() => loadVideos());
        db.ref('siteStats').transaction(stats => {
            stats = stats || { visitors: 0, downloads: 0 };
            stats.visitors++;
            return stats;
        });
        updateStats();
    } else if (window.location.pathname.includes('game.html')) {
        fetchYouTubeVideos().then(() => loadGameDetails());
    }

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') document.body.classList.add('light-mode');
        themeToggle.addEventListener('click', toggleTheme);
    }

    detectAdBlocker().then(adBlocked => {
        if (adBlocked) showNotification('Please disable your ad blocker to support us!', 'error');
    });

    // Load AI chat history
    if (window.location.pathname.includes('ai.html')) {
        const chatHistory = document.getElementById('chat-history');
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        history.forEach(item => {
            const userMessage = document.createElement('div');
            userMessage.className = 'ai-message';
            userMessage.innerHTML = `<strong>You:</strong> ${item.user}`;
            chatHistory.appendChild(userMessage);

            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-message';
            aiMessage.innerHTML = `<strong>Grok AI:</strong> ${item.ai}`;
            chatHistory.appendChild(aiMessage);
        });
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});
