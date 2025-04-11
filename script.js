// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Loading Overlay
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Authentication
let currentUser = null;

function authUser() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value.trim();

    let users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[username]) {
        if (users[username].password === password) {
            currentUser = { username, email: users[username].email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                closeModal('login-modal');
                updateUI();
            }, 1000);
        } else {
            showNotification('Incorrect password!', 'error');
        }
    } else {
        users[username] = { password, email };
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = { username, email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showNotification('Account created and logged in!', 'success');
        setTimeout(() => {
            closeModal('login-modal');
            updateUI();
        }, 1000);
    }
}

function updateAccount() {
    const username = document.getElementById('account-username').value.trim();
    const email = document.getElementById('account-email').value.trim();
    const password = document.getElementById('account-password').value;

    if (currentUser) {
        let users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[currentUser.username]) {
            if (username !== currentUser.username && users[username]) {
                showNotification('Username already exists!', 'error');
                return;
            }
            users[username] = {
                password: password || users[currentUser.username].password,
                email: email || users[currentUser.username].email
            };
            if (username !== currentUser.username) {
                delete users[currentUser.username];
            }
            localStorage.setItem('users', JSON.stringify(users));
            currentUser = { username, email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotification('Account updated!', 'success');
            setTimeout(() => closeModal('account-modal'), 1000);
            updateUI();
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!', 'success');
    updateUI();
    closeModal('account-modal');
}

function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const accountBtn = document.getElementById('account-btn');
    if (currentUser) {
        loginBtn.style.display = 'none';
        accountBtn.style.display = 'inline-block';
        if (document.getElementById('account-username')) {
            document.getElementById('account-username').value = currentUser.username;
            document.getElementById('account-email').value = currentUser.email || '';
        }
    } else {
        loginBtn.style.display = 'inline-block';
        accountBtn.style.display = 'none';
    }
}

function openLogin() {
    document.getElementById('login-modal').style.display = 'block';
}

function openAccount() {
    document.getElementById('account-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    const message = document.getElementById(modalId === 'login-modal' ? 'auth-message' : 'account-message');
    if (message) message.textContent = '';
}

// YouTube API Integration
const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k';
let gamePreviews = [
    {//ttd up4
        creator: "Yobest",
        videoLink: "https://www.youtube.com/watch?v=6mDovQ4d87M",
        downloadLink: "https://workink.net/1RdO/m0wpmz0s",
        price: "Free"
    },
    {//ttd up3
        creator: "Yobest",
        videoLink: "https://www.youtube.com/watch?v=IKmXPPhLeLk",
        downloadLink: "https://workink.net/1RdO/m0wpmz0s",
        price: "Free"
    },
    {//anime
        creator: "Yobest",
        videoLink: "https://www.youtube.com/watch?v=sPauNcqbkBU",
        downloadLink: "https://workink.net/1RdO/lmm1ufst",
        price: "Free"
    },
    {//anime 1
        creator: "Yobest",
        videoLink: "https://www.youtube.com/watch?v=97f1sqtWy6o",
        downloadLink: "https://workink.net/1RdO/lmm1ufst",
        price: "Free"
    },
    {//trade
        creator: "Yobest",
        videoLink: "https://www.youtube.com/watch?v=pMrRFF7dHYM",
        downloadLink: "https://workink.net/1RdO/lu5jed0c",
        price: "Free "
    }
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
            const item = data.items[index];
            return {
                ...video,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high.url,
                views: item.statistics.viewCount,
                likes: item.statistics.likeCount,
                date: item.snippet.publishedAt.split('T')[0]
            };
        });

        loadVideos();
        hideLoading();
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        showNotification('Failed to load videos. Using fallback data.', 'error');
        gamePreviews = gamePreviews.map(video => ({
            ...video,
            title: "Roblox Studio Tutorial - Advanced Game Mechanics",
            thumbnail: "https://img.youtube.com/vi/6mDovQ4d87M/maxresdefault.jpg",
            views: "10000",
            likes: "500",
            date: "2025-03-01"
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
    const video = gamePreviews.find(v => v.videoLink === videoLink);
    if (video) {
        document.getElementById('video-player').src = `https://www.youtube.com/embed/${videoLink.split('v=')[1]}`;
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-description').textContent = "Learn advanced game mechanics in this comprehensive Roblox Studio tutorial."; // Update with API if available
        document.getElementById('video-views').textContent = video.views;
        document.getElementById('video-likes').textContent = video.likes;
        document.getElementById('video-date').textContent = video.date;
        document.getElementById('video-price').textContent = video.price;
        document.getElementById('download-btn').href = video.downloadLink;
    } else {
        showNotification('Video not found!', 'error');
    }
    loadComments();
    loadYouTubeComments();
    setupRating();
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
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        comments.push({
            username: currentUser.username,
            content: comment,
            date: new Date().toISOString(),
            likes: 0,
            owner: currentUser.username
        });
        localStorage.setItem('comments', JSON.stringify(comments));
        input.value = '';
        showNotification('Comment added!', 'success');
        loadComments();
    }
}

function loadComments() {
    const commentsList = document.getElementById('site-comments');
    if (commentsList) {
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        commentsList.innerHTML = comments.map(c => `
            <div class="comment">
                <div class="comment-header">
                    <span>${c.username}</span>
                    <span>${new Date(c.date).toLocaleDateString()}</span>
                </div>
                <p>${c.content}</p>
                <div class="comment-actions">
                    <button onclick="likeComment('${c.date}')"><i class="fas fa-thumbs-up"></i> ${c.likes}</button>
                    ${currentUser && c.owner === currentUser.username ? `
                        <button onclick="editComment('${c.date}')"><i class="fas fa-edit"></i></button>
                        <button onclick="deleteComment('${c.date}')"><i class="fas fa-trash"></i></button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
}

function likeComment(date) {
    if (!currentUser) {
        showNotification('Please log in to like comments!', 'error');
        return;
    }
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const comment = comments.find(c => c.date === date);
    if (comment) {
        comment.likes++;
        localStorage.setItem('comments', JSON.stringify(comments));
        showNotification('Comment liked!', 'success');
        loadComments();
    }
}

function editComment(date) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const comment = comments.find(c => c.date === date);
    if (comment && currentUser.username === comment.owner) {
        const newContent = prompt('Edit comment:', comment.content);
        if (newContent) {
            comment.content = newContent.trim();
            localStorage.setItem('comments', JSON.stringify(comments));
            showNotification('Comment updated!', 'success');
            loadComments();
        }
    }
}

function deleteComment(date) {
    if (confirm('Delete this comment?')) {
        let comments = JSON.parse(localStorage.getItem('comments') || '[]');
        comments = comments.filter(c => c.date !== date || c.owner !== currentUser.username);
        localStorage.setItem('comments', JSON.stringify(comments));
        showNotification('Comment deleted!', 'success');
        loadComments();
    }
}

function loadYouTubeComments() {
    const commentsList = document.getElementById('youtube-comments');
    if (commentsList) {
        const comments = [
            { username: "RobloxFan", content: "Amazing script!", date: "2025-03-02" },
            { username: "GameDev", content: "Really helpful tutorial!", date: "2025-03-01" }
        ]; // Placeholder, integrate YouTube API comments if needed
        commentsList.innerHTML = comments.map(c => `
            <div class="comment">
                <div class="comment-header">
                    <span>${c.username}</span>
                    <span>${c.date}</span>
                </div>
                <p>${c.content}</p>
            </div>
        `).join('');
    }
}

// Rating
function setupRating() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            if (!currentUser) {
                showNotification('Please log in to rate!', 'error');
                return;
            }
            const value = star.dataset.value;
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 0; i < value; i++) {
                stars[i].classList.add('active');
            }
            showNotification(`Rated ${value} stars!`, 'success');
            setTimeout(() => document.getElementById('rating-message').textContent = '', 2000);
        });
    });
}

// AI Chat
const aiTopics = {
    scripting: {
        keywords: ['script', 'lua', 'code', 'programming', 'function', 'event'],
        synonyms: ['coding', 'development', 'write', 'program'],
        responses: [
            `Let's dive into Roblox scripting! Here's a basic Lua script for a part spawner:\n\n\`\`\`lua\nlocal part = Instance.new("Part")\npart.Size = Vector3.new(5, 1, 5)\npart.Position = Vector3.new(0, 10, 0)\npart.Anchored = true\npart.Parent = game.Workspace\n\`\`\`\n\nWhat scripting topic would you like to explore? (e.g., events, GUI, physics)`,
            `Roblox Lua is powerful! For example, to detect a player touch event:\n\n\`\`\`lua\nlocal part = game.Workspace.Part\npart.Touched:Connect(function(hit)\n    local player = game.Players:GetPlayerFromCharacter(hit.Parent)\n    if player then\n        print(player.Name .. " touched the part!")\n    end\nend)\n\`\`\`\n\nWhat scripting challenge are you facing?`,
            `Need help with a function? Here's how to create a simple function in Lua:\n\n\`\`\`lua\nlocal function spawnPart(position)\n    local part = Instance.new("Part")\n    part.Position = position\n    part.Parent = game.Workspace\nend\nspawnPart(Vector3.new(10, 5, 10))\n\`\`\`\n\nWhat kind of function do you need help with?`
        ]
    },
    game_design: {
        keywords: ['design', 'game', 'build', 'create', 'level', 'mechanic'],
        synonyms: ['make', 'construct', 'develop', 'craft'],
        responses: [
            `Game design in Roblox is all about creativity! Start with a clear theme, like sci-fi or adventure. Use Studio tools to build terrain, add lighting, and script interactions. For example, a basic teleporter:\n\n\`\`\`lua\nlocal teleporter = game.Workspace.Teleporter\nteleporter.Touched:Connect(function(hit)\n    hit.Parent.HumanoidRootPart.Position = Vector3.new(100, 10, 100)\nend)\n\`\`\`\n\nNeed tips on level design or mechanics?`,
            `Building a Roblox game? Focus on player engagement. Add checkpoints, rewards, and smooth controls. A simple reward script:\n\n\`\`\`lua\nlocal player = game.Players.LocalPlayer\nplayer.leaderstats.Coins.Value += 100\n\`\`\`\n\nWhat design element are you working on?`,
            `For a great game mechanic, consider adding a leaderboard. Here's a simple example:\n\n\`\`\`lua\ngame.Players.PlayerAdded:Connect(function(player)\n    local leaderstats = Instance.new("Folder")\n    leaderstats.Name = "leaderstats"\n    leaderstats.Parent = player\n    local coins = Instance.new("IntValue")\n    coins.Name = "Coins"\n    coins.Value = 0\n    coins.Parent = leaderstats\nend)\n\`\`\`\n\nWhat kind of mechanic would you like to add?`
        ]
    },
    debugging: {
        keywords: ['error', 'bug', 'fix', 'problem', 'issue', 'debug'],
        synonyms: ['troubleshoot', 'solve', 'resolve'],
        responses: [
            `Debugging in Roblox can be tricky! First, check the Output window in Studio for error messages. Common issues include nil references or incorrect instance paths. For example, if you see "attempt to index nil with 'Position'", ensure the object exists:\n\n\`\`\`lua\nlocal part = game.Workspace:FindFirstChild("Part")\nif part then\n    part.Position = Vector3.new(0, 10, 0)\nelse\n    warn("Part not found!")\nend\n\`\`\`\n\nWhat error are you encountering?`,
            `A common bug in Roblox is with events not firing. Ensure you're connecting them correctly:\n\n\`\`\`lua\nlocal part = game.Workspace.Part\npart.Touched:Connect(function(hit)\n    print("Part touched!")\nend)\n\`\`\`\nIf it's not working, check if the part exists and has collision enabled. What's the bug you're facing?`,
            `If you're getting a script timeout or infinite loop, check for unterminated loops. For example:\n\n\`\`\`lua\nwhile true do\n    print("Looping")\n    wait(1) -- Add a wait to prevent freezing\nend\n\`\`\`\nWithout the wait, this could crash. What issue are you trying to fix?`
        ]
    }
};

function sendToAI() {
    const input = document.getElementById('ai-input');
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    const history = document.getElementById('chat-history');
    history.innerHTML += `<div class="ai-message">You: ${query}</div>`;

    let response = '';
    let maxScore = 0;
    let bestTopic = null;

    for (const topic in aiTopics) {
        const { keywords, synonyms } = aiTopics[topic];
        let score = 0;
        keywords.forEach(k => { if (query.includes(k)) score += 2; });
        synonyms.forEach(s => { if (query.includes(s)) score += 1; });
        if (score > maxScore) {
            maxScore = score;
            bestTopic = topic;
        }
    }

    if (bestTopic && maxScore > 0) {
        const responses = aiTopics[bestTopic].responses;
        response = responses[Math.floor(Math.random() * responses.length)];
    } else {
        response = `I'm not sure about "${query}". Could you clarify? I can help with Roblox scripting, game design, debugging, or other development topics!`;
    }

    history.innerHTML += `<div class="ai-message">AI: ${response}</div>`;
    history.scrollTop = history.scrollHeight;
    input.value = '';
}

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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    updateUI();
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        fetchYouTubeVideos();
    } else if (window.location.pathname.includes('game.html')) {
        fetchYouTubeVideos().then(loadGameDetails);
    }
});
