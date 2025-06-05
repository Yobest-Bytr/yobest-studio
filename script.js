// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-e03MCfDrp909_wSziGxsw8JPvSYuhoI",
    authDomain: "yobest-bytr.firebaseapp.com",
    projectId: "yobest-bytr",
    storageBucket: "yobest-bytr.firebasestorage.app",
    messagingSenderId: "661309795820",
    appId: "1:661309795820:web:e16ba92bdd31d2f090a4c9",
    measurementId: "G-841WBKEVR0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

// Google OAuth Configuration
const googleClientId = "744888685295-d452bl4q9e4shdba3s4mn416uicnohij.apps.googleusercontent.com";
const googleClientSecret = "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";

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

// Authentication
let currentUser = null;

async function authUser() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const username = document.getElementById('username')?.value.trim() || '';

    if (window.isSignUp) {
        if (!username) {
            showNotification('Username is required for sign up!', 'error');
            return;
        }
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            await db.ref('users/' + user.uid).set({
                username,
                email,
                bio: '',
                favoriteInvestments: '',
                visits: 1,
                downloads: 0
            });
            currentUser = { uid: user.uid, username, email, bio: '', favoriteInvestments: '', visits: 1, downloads: 0 };
            saveUserData();
            showNotification('Account created and logged in!', 'success');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Sign up error:', error);
            showNotification(error.message, 'error');
        }
    } else {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const snapshot = await db.ref('users/' + user.uid).once('value');
            const userData = snapshot.val();
            currentUser = {
                uid: user.uid,
                username: userData.username,
                email: userData.email,
                bio: userData.bio || '',
                favoriteInvestments: userData.favoriteInvestments || '',
                visits: userData.visits || 0,
                downloads: userData.downloads || 0
            };
            await db.ref('users/' + user.uid).update({ visits: currentUser.visits + 1 });
            currentUser.visits++;
            saveUserData();
            showNotification('Login successful!', 'success');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Sign in error:', error);
            showNotification(error.message, 'error');
        }
    }
}

async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;
        const snapshot = await db.ref('users/' + user.uid).once('value');
        if (!snapshot.exists()) {
            await db.ref('users/' + user.uid).set({
                username: user.displayName,
                email: user.email,
                bio: '',
                favoriteInvestments: '',
                visits: 1,
                downloads: 0
            });
        }
        currentUser = {
            uid: user.uid,
            username: user.displayName,
            email: user.email,
            bio: (await db.ref('users/' + user.uid + '/bio').once('value')).val() || '',
            favoriteInvestments: (await db.ref('users/' + user.uid + '/favoriteInvestments').once('value')).val() || '',
            visits: (await db.ref('users/' + user.uid + '/visits').once('value')).val() || 0,
            downloads: (await db.ref('users/' + user.uid + '/downloads').once('value')).val() || 0
        };
        await db.ref('users/' + user.uid).update({ visits: currentUser.visits + 1 });
        currentUser.visits++;
        saveUserData();
        showNotification('Google login successful!', 'success');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google sign in error:', error);
        showNotification(error.message, 'error');
    }
}

function resetPassword() {
    const email = document.getElementById('email').value.trim();
    if (!email) {
        showNotification('Please enter your email to reset password!', 'error');
        return;
    }
    auth.sendPasswordResetEmail(email)
        .then(() => showNotification('Password reset email sent!', 'success'))
        .catch(error => showNotification(error.message, 'error'));
}

function updateAccount() {
    const password = document.getElementById('account-password')?.value;
    const email = document.getElementById('account-email')?.value.trim();
    const bio = document.getElementById('account-bio')?.value.trim();
    const favoriteInvestments = document.getElementById('favorite-games')?.value.trim();

    if (currentUser) {
        const updates = {};
        if (password) {
            auth.currentUser.updatePassword(password)
                .catch(error => showNotification(error.message, 'error'));
        }
        if (email) updates.email = email;
        if (bio) updates.bio = bio;
        if (favoriteInvestments) updates.favoriteInvestments = favoriteInvestments;

        db.ref('users/' + currentUser.uid).update(updates)
            .then(() => {
                currentUser.email = email || currentUser.email;
                currentUser.bio = bio;
                currentUser.favoriteInvestments = favoriteInvestments;
                saveUserData();
                showNotification('Account updated!', 'success');
                updateAccountUI();
            })
            .catch(error => showNotification(error.message, 'error'));
    }
}

function logout() {
    auth.signOut()
        .then(() => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            showNotification('Logged out successfully!', 'success');
            updateUI();
            window.location.href = 'login.html';
        })
        .catch(error => showNotification(error.message, 'error'));
}

function saveUserData() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const accountBtn = document.getElementById('account-btn');
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (accountBtn) accountBtn.style.display = 'inline-flex';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (accountBtn) accountBtn.style.display = 'none';
    }
    updateStats();
    updateAccountUI();
}

function updateStats() {
    db.ref('siteStats').once('value', (snapshot) => {
        const stats = snapshot.val() || { visitors: 0, downloads: 0 };
        const siteVisitors = document.getElementById('site-visitors');
        const totalDownloads = document.getElementById('total-downloads');
        if (siteVisitors) siteVisitors.textContent = stats.visitors;
        if (totalDownloads) totalDownloads.textContent = stats.downloads;
    });
}

function updateAccountUI() {
    if (window.location.pathname.includes('account.html') && currentUser) {
        document.getElementById('account-username-display').textContent = currentUser.username;
        document.getElementById('account-email-display').textContent = currentUser.email || 'Not set';
        document.getElementById('user-downloads').textContent = currentUser.downloads;
        document.getElementById('user-visits').textContent = currentUser.visits;
        document.getElementById('account-email').value = currentUser.email || '';
        document.getElementById('account-bio').value = currentUser.bio || '';
        document.getElementById('favorite-games').value = currentUser.favoriteInvestments || '';
    }
}

// YouTube API Integration
const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k';
let gamePreviews = [
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=6mDovQ4d87M", downloadLink: "https://workink.net/1RdO/m0wpmz0s", price: "150 Robux" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=IKmXPPhLeLk", downloadLink: "https://workink.net/1RdO/m0wpmz0s", price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=sPauNcqbkBU", downloadLink: "https://workink.net/1RdO/lmm1ufst", price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=97f1sqtWy6o", downloadLink: "https://workink.net/1RdO/lmm1ufst", price: "Free" },
    { creator: "Yobest", videoLink: "https://www.youtube.com/watch?v=pMrRFF7dHYM", downloadLink: "https://workink.net/1RdO/lu5jed0c", price: "Free" }
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

        loadVideos();
        hideLoading();
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
        loadVideos();
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
            if (currentUser) {
                db.ref('users/' + currentUser.uid).transaction(user => {
                    user.downloads = (user.downloads || 0) + 1;
                    currentUser.downloads = user.downloads;
                    saveUserData();
                    return user;
                });
            }
            updateStats();
        };
    } else {
        showNotification('Video not found!', 'error');
    }
    loadComments();
    loadYouTubeComments(video.videoLink.split('v=')[1]);
    setupRating(video.videoLink);
}

// Comments
function addComment() {
    if (!currentUser) {
        showNotification('Please log in to comment!', 'error');
        return;
    }
    const input = document.getElementById('comment-input');
    const comment = input.value.trim();
    if (comment) {
        const commentsRef = db.ref('comments/' + encodeURIComponent(new URLSearchParams(window.location.search).get('video')));
        commentsRef.push({
            username: currentUser.username,
            content: comment,
            date: new Date().toISOString(),
            likes: 0,
            owner: currentUser.username
        });
        input.value = '';
        showNotification('Comment added!', 'success');
        loadComments();
    }
}

function loadComments() {
    const commentsList = document.getElementById('site-comments');
    if (commentsList) {
        const videoId = encodeURIComponent(new URLSearchParams(window.location.search).get('video'));
        db.ref('comments/' + videoId).on('value', snapshot => {
            const comments = [];
            snapshot.forEach(child => {
                comments.push({ key: child.key, ...child.val() });
            });
            commentsList.innerHTML = comments.map(c => `
                <div class="comment">
                    <div class="comment-header">
                        <span>${c.username}</span>
                        <span>${new Date(c.date).toLocaleDateString()}</span>
                    </div>
                    <p>${c.content}</p>
                    <div class="comment-actions">
                        <button onclick="likeComment('${c.key}')"><i class="fas fa-thumbs-up"></i> ${c.likes}</button>
                        ${currentUser && c.owner === currentUser.username ? `
                            <button onclick="editComment('${c.key}')"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteComment('${c.key}')"><i class="fas fa-trash"></i></button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        });
    }
}

function likeComment(key) {
    if (!currentUser) {
        showNotification('Please log in to like comments!', 'error');
        return;
    }
    const videoId = encodeURIComponent(new URLSearchParams(window.location.search).get('video'));
    db.ref(`comments/${videoId}/${key}/likes`).transaction(likes => (likes || 0) + 1);
    showNotification('Comment liked!', 'success');
    loadComments();
}

function editComment(key) {
    const videoId = encodeURIComponent(new URLSearchParams(window.location.search).get('video'));
    db.ref(`comments/${videoId}/${key}`).once('value', snapshot => {
        const comment = snapshot.val();
        if (comment && currentUser.username === comment.owner) {
            const newContent = prompt('Edit comment:', comment.content);
            if (newContent) {
                db.ref(`comments/${videoId}/${key}`).update({ content: newContent.trim() });
                showNotification('Comment updated!', 'success');
                loadComments();
            }
        }
    });
}

function deleteComment(key) {
    if (confirm('Delete this comment?')) {
        const videoId = encodeURIComponent(new URLSearchParams(window.location.search).get('video'));
        db.ref(`comments/${videoId}/${key}`).remove();
        showNotification('Comment deleted!', 'success');
        loadComments();
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
                date: item.snippet.topLevelComment.snippet.publishedAt.split('T')[0]
            }));
            commentsList.innerHTML = comments.map(c => `
                <div class="comment">
                    <div class="comment-header">
                        <span>${c.username}</span>
                        <span>${c.date}</span>
                    </div>
                    <p>${c.content}</p>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching YouTube comments:', error);
            showNotification('Failed to load YouTube comments.', 'error');
            commentsList.innerHTML = '<p>Unable to load comments at this time.</p>';
        }
    }
}

// Rating System
function setupRating(videoLink) {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please log in to rate!', 'error');
                return;
            }
            const value = parseInt(star.dataset.value);
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('active');
            }
            saveRating(videoLink, value);
            showNotification(`Rated ${value} stars!`, 'success');
            document.getElementById('rating-message').textContent = '';
            displayPublicRatings(videoLink);
        });
    });
    displayPublicRatings(videoLink);
}

function saveRating(videoLink, rating) {
    const ratingsRef = db.ref('ratings/' + encodeURIComponent(videoLink));
    ratingsRef.push({ username: currentUser.username, rating, timestamp: Date.now() });
}

function displayPublicRatings(videoLink) {
    const videoId = encodeURIComponent(videoLink);
    db.ref('ratings/' + videoId).on('value', snapshot => {
        const ratings = [];
        snapshot.forEach(child => ratings.push(child.val()));
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let total = 0;
        let count = ratings.length;

        ratings.forEach(r => {
            ratingCounts[r.rating]++;
            total += r.rating;
        });

        const maxCount = Math.max(...Object.values(ratingCounts), 1);
        for (let i = 1; i <= 5; i++) {
            const bar = document.getElementById(`bar-${i}`);
            if (bar) {
                const width = (ratingCounts[i] / maxCount) * 100;
                bar.style.setProperty('--width', `${width}%`);
                bar.style.width = `${width}%`;
            }
        }

        const average = count > 0 ? (total / count).toFixed(1) : 0;
        document.getElementById('average-rating').textContent = average;
        document.getElementById('total-ratings').textContent = count;
    });
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

// Community Chat Toggle
function toggleChat() {
    const chatContent = document.querySelector('.chat-content');
    const chevron = document.querySelector('.chat-header i');
    if (chatContent.style.display === 'block') {
        chatContent.style.display = 'none';
        chevron.classList.remove('fa-chevron-up');
        chevron.classList.add('fa-chevron-down');
    } else {
        chatContent.style.display = 'block';
        chevron.classList.remove('fa-chevron-down');
        chevron.classList.add('fa-chevron-up');
    }
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        db.ref('users/' + currentUser.uid).on('value', (snapshot) => {
            const userData = snapshot.val();
            currentUser = { ...currentUser, ...userData };
            saveUserData();
            updateUI();
        });
    }

    db.ref('siteStats').transaction(stats => {
        stats = stats || { visitors: 0, downloads: 0 };
        stats.visitors++;
        return stats;
    });

    updateUI();

    if (window.location.pathname.includes('index.html')) {
        fetchYouTubeVideos();
    }

    if (window.location.pathname.includes('game.html')) {
        loadGameDetails();
    }

    const accountBtn = document.getElementById('account-btn');
    if (accountBtn) {
        accountBtn.addEventListener('click', () => {
            if (currentUser) {
                window.location.href = 'account.html';
            } else {
                showNotification('Please log in to access your account!', 'error');
                window.location.href = 'login.html';
            }
        });
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
});
