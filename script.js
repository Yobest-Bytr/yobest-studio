let isLoggedIn = false;
let currentUser = null;

function updateNavButtons() {
    const loginBtn = document.getElementById('login-btn');
    const accountBtn = document.getElementById('account-btn');
    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        accountBtn.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        accountBtn.style.display = 'none';
    }
}

function toggleLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('account-form').style.display = 'none';
}

function toggleSignupForm() {
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('account-form').style.display = 'none';
}

function toggleAccountForm() {
    if (isLoggedIn) {
        document.getElementById('account-form').style.display = 'block';
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('email-account').value = currentUser.email;
    } else {
        toggleLoginForm();
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;
    const errorDiv = document.getElementById('login-error');
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email].password === password) {
        isLoggedIn = true;
        currentUser = { email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('login-form').style.display = 'none';
        updateNavButtons();
        alert('Login successful!');
    } else {
        errorDiv.textContent = 'Invalid email or password.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    }
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorDiv = document.getElementById('signup-error');
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
        errorDiv.textContent = 'Email already registered.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    } else {
        users[email] = { password };
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('signup-form').style.display = 'none';
        toggleLoginForm();
        alert('Signup successful! Please login.');
    }
}

function updateAccount(event) {
    event.preventDefault();
    const email = document.getElementById('email-account').value;
    const password = document.getElementById('password-account').value;
    const errorDiv = document.getElementById('account-error');
    if (!currentUser) {
        errorDiv.textContent = 'Please login first.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (email !== currentUser.email && users[email]) {
        errorDiv.textContent = 'Email already in use.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
        return;
    }
    delete users[currentUser.email];
    users[email] = { password };
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { email };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    errorDiv.textContent = 'Account updated successfully!';
    errorDiv.style.color = '#00ff00';
    errorDiv.style.display = 'block';
    setTimeout(() => { errorDiv.style.display = 'none'; errorDiv.style.color = '#ff0000'; }, 3000);
}

function viewAccountInfo() {
    const errorDiv = document.getElementById('account-error');
    if (currentUser) {
        alert(`Account Info:\nEmail: ${currentUser.email}`);
    } else {
        errorDiv.textContent = 'Please login first.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    }
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('account-form').style.display = 'none';
    updateNavButtons();
    alert('Logged out successfully.');
}

function sendMessage(inputId = 'chat-input', messagesId = 'chat-messages') {
    const input = document.getElementById(inputId);
    const messagesDiv = document.getElementById(messagesId);
    const errorDiv = document.getElementById('chat-error');
    if (input.value.trim()) {
        const msg = document.createElement('div');
        msg.className = 'comment animate-card';
        msg.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="User" class="comment-avatar">
            <div class="comment-content">
                <strong>${isLoggedIn && currentUser ? currentUser.email : 'Anonymous'}</strong>: ${input.value}
                <div class="comment-meta">
                    <span>${new Date().toLocaleString()}</span>
                </div>
            </div>
        `;
        messagesDiv.appendChild(msg);
        input.value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } else {
        errorDiv.textContent = 'Please enter a message.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    }
}

function trackVisitor() {
    let visitors = parseInt(localStorage.getItem('siteVisitors') || '0') + 1;
    localStorage.setItem('siteVisitors', visitors.toString());
    const siteVisitorsElement = document.getElementById('site-visitors');
    if (siteVisitorsElement) siteVisitorsElement.textContent = visitors;
}

function trackPageVisitors() {
    const pageKey = `pageVisitors_game_${new URLSearchParams(window.location.search).get('id') || '0'}`;
    let visitors = parseInt(localStorage.getItem(pageKey) || '0') + 1;
    localStorage.setItem(pageKey, visitors.toString());
    const pageVisitorsElement = document.getElementById('page-visitors');
    if (pageVisitorsElement) pageVisitorsElement.textContent = visitors;
}

function displayCounters() {
    const siteVisitorsElement = document.getElementById('site-visitors');
    const totalDownloadsElement = document.getElementById('total-downloads');
    if (siteVisitorsElement) siteVisitorsElement.textContent = localStorage.getItem('siteVisitors') || '0';
    if (totalDownloadsElement) totalDownloadsElement.textContent = localStorage.getItem('totalDownloads') || '0';
}

async function loadYouTubeComments(videoId) {
    const commentsList = document.getElementById('youtube-comments-list');
    const errorDiv = document.getElementById('youtube-comments-error');
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${API_KEY}&maxResults=20`);
        const data = await response.json();
        if (data.error) throw new Error(data.error.message);
        commentsList.innerHTML = data.items.map(item => `
            <div class="comment animate-card">
                <img src="${item.snippet.topLevelComment.snippet.authorProfileImageUrl || 'https://via.placeholder.com/40'}" alt="User" class="comment-avatar">
                <div class="comment-content">
                    <strong>${item.snippet.topLevelComment.snippet.authorDisplayName}</strong>: ${item.snippet.topLevelComment.snippet.textDisplay}
                    <div class="comment-meta"><span>${new Date(item.snippet.topLevelComment.snippet.publishedAt).toLocaleString()}</span></div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        errorDiv.textContent = `Error loading comments: ${error.message}`;
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
    }
}

async function fetchVideos() {
    const reactionDiv = document.getElementById('reaction-text');
    const previewGrid = document.getElementById('preview-grid');
    const errorDiv = document.getElementById('video-error');
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
    const CHANNEL_ID = 'UCsV3X3EyEowLEdRW1RileuA'; // Your channel ID
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // Cache for 24 hours

    if (!reactionDiv || !previewGrid || !errorDiv) return;

    reactionDiv.textContent = 'Fetching videos...';

    // Check cache first
    const cachedData = JSON.parse(localStorage.getItem('videoCache') || '{}');
    const now = Date.now();
    if (cachedData.videos && cachedData.timestamp && (now - cachedData.timestamp < CACHE_EXPIRY)) {
        reactionDiv.textContent = `Loaded ${cachedData.videos.length} videos from cache!`;
        previewGrid.innerHTML = cachedData.videos.map((item, index) => `
            <div class="video-card animate-card">
                <a href="game.html?id=${index}">
                    <img src="${item.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/150'}" alt="${item.snippet.title}">
                    <h3 class="animate-text">${item.snippet.title}</h3>
                </a>
            </div>
        `).join('');
        localStorage.setItem('channelVideos', JSON.stringify(cachedData.videos));
        return;
    }

    try {
        // Get uploads playlist ID from channel
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`);
        if (!channelResponse.ok) throw new Error(`Channel fetch failed: ${channelResponse.statusText}`);
        const channelData = await channelResponse.json();
        if (channelData.error || !channelData.items.length) throw new Error('Invalid channel ID or API key');
        const playlistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        // Fetch all videos from the uploads playlist
        let videos = [];
        let nextPageToken = '';
        do {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50&pageToken=${nextPageToken}`);
            if (!response.ok) throw new Error(`Playlist fetch failed: ${response.statusText}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            videos = videos.concat(data.items.filter(item => item.snippet.resourceId.kind === 'youtube#video')); // Filter only videos
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        if (!videos.length) throw new Error('No videos found in the channel uploads.');

        // Store in cache and localStorage
        const cacheData = { videos, timestamp: now };
        localStorage.setItem('videoCache', JSON.stringify(cacheData));
        localStorage.setItem('channelVideos', JSON.stringify(videos));

        reactionDiv.textContent = `Loaded ${videos.length} videos!`;
        previewGrid.innerHTML = videos.map((item, index) => `
            <div class="video-card animate-card">
                <a href="game.html?id=${index}">
                    <img src="${item.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/150'}" alt="${item.snippet.title}">
                    <h3 class="animate-text">${item.snippet.title}</h3>
                </a>
            </div>
        `).join('');
    } catch (error) {
        reactionDiv.textContent = '';
        errorDiv.textContent = `Error: ${error.message}. Check API key, channel ID, or network connection.`;
        errorDiv.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
        isLoggedIn = true;
        currentUser = savedUser;
        updateNavButtons();
    }
});
//AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k