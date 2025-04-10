// Authentication State
let isLoggedIn = false;
let currentUser = null;

// Simulated Database for Videos, Stats, and Game Previews
let videos = JSON.parse(localStorage.getItem('videos')) || [];
let siteStats = JSON.parse(localStorage.getItem('siteStats')) || { views: 0, likes: 0, visitors: 0, registeredUsers: 193, guests: 1026 };

// Simulated Game Previews Data
let gamePreviews = [
    {
        title: "Fartsaken Script GUI",
        creator: "ivan",
        views: "65.9K",
        timestamp: "2 minutes ago",
        image: "https://via.placeholder.com/200x150?text=Fartsaken",
        bumped: true
    },
    {
        title: "Arise Crossover Hub",
        creator: "NO6NO6NO67",
        views: "366",
        timestamp: "4 hours ago",
        image: "https://via.placeholder.com/200x150?text=Arise",
        bumped: false
    },
    {
        title: "Murder Mystery 2 MM2 OP Script",
        creator: "likemertsafi",
        views: "361",
        timestamp: "4 hours ago",
        image: "https://via.placeholder.com/200x150?text=Murder+Mystery",
        bumped: false
    },
    {
        title: "Arise Crossover OP Auto Gamepass Unlock and...",
        creator: "whohurtyouudeart",
        views: "591",
        timestamp: "6 hours ago",
        image: "https://via.placeholder.com/200x150?text=Arise+Crossover",
        bumped: false
    },
    {
        title: "Killaura Expansion Anti Void",
        creator: "dev_guru",
        views: "1.2K",
        timestamp: "1 day ago",
        image: "https://via.placeholder.com/200x150?text=Killaura",
        bumped: true
    },
    {
        title: "Blade Ball Auto Parry Script",
        creator: "proplayer123",
        views: "2.5K",
        timestamp: "2 days ago",
        image: "https://via.placeholder.com/200x150?text=Blade+Ball",
        bumped: false
    },
    {
        title: "Pet Simulator X Dupe Script",
        creator: "scripterx",
        views: "10K",
        timestamp: "3 days ago",
        image: "https://via.placeholder.com/200x150?text=Pet+Simulator",
        bumped: true
    },
    {
        title: "Adopt Me Auto Farm",
        creator: "farmking",
        views: "8.7K",
        timestamp: "4 days ago",
        image: "https://via.placeholder.com/200x150?text=Adopt+Me",
        bumped: false
    }
];

// Pagination
let currentPage = 1;
const gamesPerPage = 4;

// Authentication Functions
function authUser(email, password, callback) {
    setTimeout(() => {
        const user = { email, password, username: email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        localStorage.setItem('currentUser', JSON.stringify(user));
        isLoggedIn = true;
        currentUser = user;
        siteStats.registeredUsers += 1; // Increment registered users on new login
        localStorage.setItem('siteStats', JSON.stringify(siteStats));
        checkLoginState();
        callback({ success: true, message: 'Login successful!' });
    }, 1000);
}

function googleLogin() {
    authUser('googleuser@example.com', 'googlepass', handleAuthResponse);
}

function microsoftLogin() {
    authUser('microsoftuser@example.com', 'microsoftpass', handleAuthResponse);
}

function handleAuthResponse(response) {
    const loginError = document.getElementById('login-error');
    if (loginError) {
        loginError.style.display = 'block';
        loginError.textContent = response.message;
        loginError.className = response.success ? 'reaction-text animate-success' : 'reaction-text animate-error';
        if (response.success) {
            setTimeout(() => {
                closeLogin();
                window.location.reload();
            }, 1000);
        }
    }
}

function updateAccount(username, email, newPassword, callback) {
    setTimeout(() => {
        if (isLoggedIn && currentUser) {
            currentUser.username = username || currentUser.username;
            currentUser.email = email || currentUser.email;
            if (newPassword) currentUser.password = newPassword;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            callback({ success: true, message: 'Account updated successfully!' });
        } else {
            callback({ success: false, message: 'Please log in to update your account!' });
        }
    }, 1000);
}

function handleAccountResponse(response) {
    const accountMessage = document.getElementById('account-message');
    if (accountMessage) {
        accountMessage.style.display = 'block';
        accountMessage.textContent = response.message;
        accountMessage.className = response.success ? 'reaction-text animate-success' : 'reaction-text animate-error';
        if (response.success) {
            setTimeout(() => {
                closeAccountSettings();
                window.location.reload();
            }, 1000);
        }
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    isLoggedIn = false;
    currentUser = null;
    checkLoginState();
    window.location.href = 'index.html';
}

function checkLoginState() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('login-btn');
    const accountBtn = document.getElementById('account-btn');
    const accountPic = document.getElementById('account-pic');

    if (user) {
        isLoggedIn = true;
        currentUser = user;
        if (loginBtn) loginBtn.style.display = 'none';
        if (accountBtn) accountBtn.style.display = 'inline-block';
        if (accountPic) {
            accountPic.src = user.avatar;
            accountPic.style.display = 'inline-block';
        }
    } else {
        isLoggedIn = false;
        currentUser = null;
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (accountBtn) accountBtn.style.display = 'none';
        if (accountPic) accountPic.style.display = 'none';
    }

    // Update user stats
    const registeredUsersElement = document.getElementById('registered-users');
    const guestUsersElement = document.getElementById('guest-users');
    if (registeredUsersElement) registeredUsersElement.textContent = siteStats.registeredUsers;
    if (guestUsersElement) guestUsersElement.textContent = siteStats.guests;
}

function openLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'block';
}

function closeLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

function openAccountSettings() {
    const modal = document.getElementById('account-settings-modal');
    if (modal) modal.style.display = 'block';
}

function closeAccountSettings() {
    const modal = document.getElementById('account-settings-modal');
    if (modal) modal.style.display = 'none';
}

function previewAvatar(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('avatar-preview');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
            if (isLoggedIn && currentUser) {
                currentUser.avatar = e.target.result;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                checkLoginState();
            }
        };
        reader.readAsDataURL(file);
    }
}

// Stats and Tracking Functions
function trackVisitor() {
    siteStats.visitors = (siteStats.visitors || 0) + 1;
    siteStats.guests += 1;
    localStorage.setItem('siteStats', JSON.stringify(siteStats));
    displayStats();
}

function displayStats() {
    const registeredUsersElement = document.getElementById('registered-users');
    const guestUsersElement = document.getElementById('guest-users');
    if (registeredUsersElement) registeredUsersElement.textContent = siteStats.registeredUsers;
    if (guestUsersElement) guestUsersElement.textContent = siteStats.guests;
}

// Game Previews Functions
function loadGamePreviews() {
    const gameGrid = document.getElementById('game-grid');
    if (!gameGrid) return;

    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const paginatedGames = gamePreviews.slice(startIndex, endIndex);

    gameGrid.innerHTML = paginatedGames.map(game => `
        <div class="video-card animate-card">
            ${game.bumped ? '<span class="bumped-tag">~ Bumped</span>' : ''}
            <img src="${game.image}" alt="${game.title}">
            <div class="video-stats">
                <p class="game-title">${game.title}</p>
                <p class="creator"><img src="https://via.placeholder.com/20" alt="${game.creator}">${game.creator}</p>
                <p><i class="fas fa-eye"></i> ${game.views} views • ${game.timestamp}</p>
            </div>
        </div>
    `).join('');
}

function searchGames() {
    const searchInput = document.getElementById('game-search');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase();
    const filteredGames = gamePreviews.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.creator.toLowerCase().includes(query)
    );

    const gameGrid = document.getElementById('game-grid');
    if (gameGrid) {
        gameGrid.innerHTML = filteredGames.map(game => `
            <div class="video-card animate-card">
                ${game.bumped ? '<span class="bumped-tag">~ Bumped</span>' : ''}
                <img src="${game.image}" alt="${game.title}">
                <div class="video-stats">
                    <p class="game-title">${game.title}</p>
                    <p class="creator"><img src="https://via.placeholder.com/20" alt="${game.creator}">${game.creator}</p>
                    <p><i class="fas fa-eye"></i> ${game.views} views • ${game.timestamp}</p>
                </div>
            </div>
        `).join('');
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadGamePreviews();
    }
}

function nextPage() {
    const maxPage = Math.ceil(gamePreviews.length / gamesPerPage);
    if (currentPage < maxPage) {
        currentPage++;
        loadGamePreviews();
    }
}

function addYourScript() {
    if (isLoggedIn) {
        alert('Add your script functionality coming soon!');
    } else {
        alert('Please log in to add a script!');
        openLogin();
    }
}

// Chat Functions
function initializeChat() {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message';
            msgDiv.textContent = `${msg.username}: ${msg.content}`;
            chatMessages.appendChild(msgDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    if (chatInput && chatMessages && chatInput.value.trim()) {
        if (!isLoggedIn) {
            alert('Please log in to send a message!');
            return;
        }
        const message = {
            username: currentUser.username || currentUser.email,
            content: chatInput.value.trim(),
            timestamp: new Date().toISOString()
        };
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(messages));
        initializeChat();
        chatInput.value = '';
    }
}

// Comment Functions for Site
function addSiteComment(commentInputId = 'site-comment-input', commentsListId = 'site-comments-list') {
    const commentInput = document.getElementById(commentInputId);
    const commentText = commentInput?.value.trim();
    if (commentText && isLoggedIn) {
        const commentsList = document.getElementById(commentsListId);
        if (commentsList) {
            const comment = {
                username: currentUser.username || currentUser.email,
                avatar: currentUser.avatar || 'https://via.placeholder.com/40',
                content: commentText,
                likes: 0,
                response: '',
                date: new Date().toISOString(),
                owner: currentUser.email
            };
            saveSiteComment(comment, commentsListId);
            loadSiteComments(commentsListId);
            commentInput.value = '';
        }
    } else {
        alert('Please log in to add a comment!');
    }
}

function saveSiteComment(comment, commentsListId) {
    let commentsKey = commentsListId === 'site-comments-list' ? 'siteComments' : 'siteGameComments';
    let comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    comments.push(comment);
    localStorage.setItem(commentsKey, JSON.stringify(comments));
}

function loadSiteComments(commentsListId = 'site-comments-list') {
    let commentsKey = commentsListId === 'site-comments-list' ? 'siteComments' : 'siteGameComments';
    const comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    const commentsList = document.getElementById(commentsListId);
    if (commentsList) {
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const isOwner = isLoggedIn && currentUser.email === comment.owner;
            const commentDiv = document.createElement('div');
            commentDiv.className = 'site-comment animate-card';
            commentDiv.innerHTML = `
                <div class="comment-header">
                    <img src="${comment.avatar}" alt="${comment.username}" class="comment-avatar">
                    <span class="neon-text">${comment.username}</span>
                </div>
                <p class="body-text animate-text" style="color: #a0a0a0;">${comment.content}</p>
                <div class="comment-actions">
                    <button class="btn-small animate-btn" onclick="likeSiteComment('${comment.date}', '${commentsListId}')"><i class="fas fa-thumbs-up"></i> ${comment.likes}</button>
                    ${isOwner ? `
                        <button class="btn-small animate-btn" onclick="editSiteComment('${comment.date}', '${commentsListId}')"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn-small animate-btn" onclick="deleteSiteComment('${comment.date}', '${commentsListId}')"><i class="fas fa-trash"></i> Delete</button>
                    ` : ''}
                    <p class="small-text animate-text" style="color: #888;">${new Date(comment.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                ${comment.response ? `<p class="body-text animate-text response" style="color: #a0a0a0;">Response: ${comment.response}</p>` : ''}
            `;
            commentDiv.style.color = '#a0a0a0';
            commentDiv.style.fontFamily = '"Inter", sans-serif';
            commentsList.appendChild(commentDiv);
        });
    }
}

function likeSiteComment(commentDate, commentsListId) {
    if (isLoggedIn) {
        let commentsKey = commentsListId === 'site-comments-list' ? 'siteComments' : 'siteGameComments';
        let comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        const comment = comments.find(c => c.date === commentDate);
        if (comment) {
            comment.likes = (comment.likes || 0) + 1;
            localStorage.setItem(commentsKey, JSON.stringify(comments));
            loadSiteComments(commentsListId);
        }
    } else {
        alert('Please log in to like a comment!');
    }
}

function editSiteComment(commentDate, commentsListId) {
    if (isLoggedIn) {
        let commentsKey = commentsListId === 'site-comments-list' ? 'siteComments' : 'siteGameComments';
        let comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        const comment = comments.find(c => c.date === commentDate);
        if (comment && currentUser.email === comment.owner) {
            const newContent = prompt('Edit your comment:', comment.content);
            if (newContent && newContent.trim()) {
                comment.content = newContent.trim();
                localStorage.setItem(commentsKey, JSON.stringify(comments));
                loadSiteComments(commentsListId);
            }
        } else {
            alert('You can only edit your own comments!');
        }
    } else {
        alert('Please log in to edit a comment!');
    }
}

function deleteSiteComment(commentDate, commentsListId) {
    if (isLoggedIn) {
        let commentsKey = commentsListId === 'site-comments-list' ? 'siteComments' : 'siteGameComments';
        let comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
        const commentIndex = comments.findIndex(c => c.date === commentDate);
        if (commentIndex !== -1 && currentUser.email === comments[commentIndex].owner) {
            if (confirm('Are you sure you want to delete this comment?')) {
                comments.splice(commentIndex, 1);
                localStorage.setItem(commentsKey, JSON.stringify(comments));
                loadSiteComments(commentsListId);
            }
        } else {
            alert('You can only delete your own comments!');
        }
    } else {
        alert('Please log in to delete a comment!');
    }
}

// Comment Functions for YouTube
function loadYouTubeComments(commentsListId = 'youtube-comments-list') {
    const comments = JSON.parse(localStorage.getItem('youtubeComments') || '[]');
    const commentsList = document.getElementById(commentsListId);
    if (commentsList) {
        commentsList.innerHTML = comments.map(comment => `
            <div class="youtube-comment animate-card">
                <span class="neon-text">${comment.username}</span>
                <p class="body-text animate-text" style="color: #a0a0a0;">${comment.content}</p>
                <p class="small-text animate-text" style="color: #888;">${new Date(comment.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
        `).join('');
    }
}

// Writing Frame Functions
function saveWriting() {
    const writingInput = document.getElementById('writing-input');
    if (writingInput && writingInput.value.trim()) {
        if (!isLoggedIn) {
            alert('Please log in to save your writing!');
            return;
        }
        const writing = {
            username: currentUser.username || currentUser.email,
            content: writingInput.value.trim(),
            date: new Date().toISOString()
        };
        const writings = JSON.parse(localStorage.getItem('writings') || '[]');
        writings.push(writing);
        localStorage.setItem('writings', JSON.stringify(writings));
        alert('Writing saved successfully!');
        writingInput.value = '';
    }
}

function loadWritings() {
    const writingsList = document.getElementById('writings-list');
    if (writingsList) {
        const writings = JSON.parse(localStorage.getItem('writings') || '[]');
        writingsList.innerHTML = writings.map(writing => `
            <div class="writing animate-card">
                <span class="neon-text">${writing.username}</span>
                <p class="body-text animate-text" style="color: #a0a0a0;">${writing.content}</p>
                <p class="small-text animate-text" style="color: #888;">${new Date(writing.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            </div>
        `).join('');
    }
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginState();
    trackVisitor();
    displayStats();
    loadGamePreviews();
    initializeChat();
    loadSiteComments();
    loadYouTubeComments();
    loadWritings();
});
