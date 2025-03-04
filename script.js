// Global variables
let isLoggedIn = false;
let currentUser = null;

// Load Prism.js for syntax highlighting
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    checkLoginState();
    handlePageTasks();
    initializePrism(); // Initialize Prism.js for Lua highlighting
});

// Utility Functions for Prism.js
function initializePrism() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    } else {
        console.error('Prism.js not loaded. Check script inclusion.');
    }
}

// Login Functions
function openLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'block';
}

function closeLogin() {
    const modal = document.getElementById('login-modal');
    if (modal) modal.style.display = 'none';
}

function openAccountSettings() {
    if (isLoggedIn) {
        window.location.href = 'account-settings.html';
    } else {
        openLogin();
    }
}

function closeAccountSettings() {
    const modal = document.getElementById('account-settings-modal');
    if (modal) modal.style.display = 'none';
}

function checkLoginState() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (savedUser && savedUser.email && typeof savedUser.email === 'string') {
        isLoggedIn = true;
        currentUser = savedUser;
        updateNavButtons();
    } else {
        isLoggedIn = false;
        currentUser = null;
        updateNavButtons();
    }
}

function authUser(email, password, callback) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email].password === password) {
        isLoggedIn = true;
        currentUser = { email, username: users[email].username || email.split('@')[0], avatar: users[email].avatar || 'https://via.placeholder.com/40' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNavButtons();
        callback({ success: true, message: 'Login successful!' });
    } else if (!users[email]) {
        users[email] = { password, username: email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        localStorage.setItem('users', JSON.stringify(users));
        isLoggedIn = true;
        currentUser = { email, username: email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNavButtons();
        callback({ success: true, message: 'Account created and logged in successfully!' });
    } else {
        callback({ success: false, message: 'Invalid email or password.' });
    }
}

function updateAccount(username, email, password, callback) {
    if (!currentUser) {
        callback({ success: false, message: 'Please log in first.' });
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (email && email !== currentUser.email && users[email]) {
        callback({ success: false, message: 'Email already in use.' });
        return;
    }

    const newEmail = email || currentUser.email;
    const newUsername = username || currentUser.username || currentUser.email.split('@')[0];
    delete users[currentUser.email];
    users[newEmail] = { password: password || users[currentUser.email]?.password || '', username: newUsername, avatar: currentUser.avatar || 'https://via.placeholder.com/40' };
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { email: newEmail, username: newUsername, avatar: currentUser.avatar || 'https://via.placeholder.com/40' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateNavButtons();
    callback({ success: true, message: 'Account updated successfully!' });
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNavButtons();
    alert('Logged out successfully.');
}

function updateNavButtons() {
    const loginBtn = document.getElementById('login-btn');
    const accountBtn = document.getElementById('account-btn');
    const accountPic = document.getElementById('account-pic');

    if (loginBtn && accountBtn && accountPic) {
        if (isLoggedIn) {
            loginBtn.style.display = 'none';
            accountBtn.style.display = 'inline-block';
            accountPic.style.display = 'inline-block';
            accountPic.src = currentUser.avatar;
        } else {
            loginBtn.style.display = 'inline-block';
            accountBtn.style.display = 'none';
            accountPic.style.display = 'none';
        }
    }
}

function previewAvatar(input) {
    const preview = document.getElementById('avatar-preview');
    const file = input.files[0];
    if (file && currentUser) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.avatar = e.target.result;
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            users[currentUser.email].avatar = currentUser.avatar;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            preview.src = currentUser.avatar;
            preview.style.display = 'block';
            updateNavButtons();
        };
        reader.readAsDataURL(file);
    }
}

// Site Stats Functions
function trackVisitor() {
    let stats = parseInt(localStorage.getItem('siteVisitors') || '0') + 1;
    localStorage.setItem('siteVisitors', stats.toString());
    localStorage.setItem('totalDownloads', stats.toString()); // Sync with site visitors
    displayStats();
}

function trackDownload() {
    let stats = parseInt(localStorage.getItem('siteVisitors') || '0') + 1;
    localStorage.setItem('siteVisitors', stats.toString());
    localStorage.setItem('totalDownloads', stats.toString());
    displayStats();
}

function displayStats() {
    const statsElements = document.querySelectorAll('#site-stats');
    statsElements.forEach(element => {
        if (element) element.textContent = localStorage.getItem('siteVisitors') || '0';
    });
}

// Video and Game Functions
async function fetchVideos() {
    const reactionDiv = document.getElementById('reaction-text');
    const previewGrid = document.getElementById('preview-grid');
    const errorDiv = document.getElementById('video-error');
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
    const CHANNEL_ID = 'UCsV3X3EyEowLEdRW1RileuA'; // Your channel ID
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // Cache for 24 hours

    if (!reactionDiv || !previewGrid || !errorDiv) return;

    reactionDiv.textContent = 'Fetching videos...';
    reactionDiv.classList.add('animate-text');

    const cachedData = JSON.parse(localStorage.getItem('videoCache') || '{}');
    const now = Date.now();
    if (cachedData.videos && cachedData.timestamp && (now - cachedData.timestamp < CACHE_EXPIRY)) {
        reactionDiv.textContent = `Loaded ${cachedData.videos.length} videos from cache!`;
        renderVideos(cachedData.videos);
        localStorage.setItem('channelVideos', JSON.stringify(cachedData.videos));
        return;
    }

    try {
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`);
        if (!channelResponse.ok) throw new Error(`Channel fetch failed: ${channelResponse.statusText}`);
        const channelData = await channelResponse.json();
        if (channelData.error || !channelData.items.length) throw new Error('Invalid channel ID or API key');
        const playlistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        let videos = [];
        let nextPageToken = '';
        do {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50&pageToken=${nextPageToken}`);
            if (!response.ok) throw new Error(`Playlist fetch failed: ${response.statusText}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error.message);
            videos = videos.concat(data.items.filter(item => item.snippet.resourceId.kind === 'youtube#video'));
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        if (!videos.length) throw new Error('No videos found in the channel uploads.');

        const cacheData = { videos, timestamp: now };
        localStorage.setItem('videoCache', JSON.stringify(cacheData));
        localStorage.setItem('channelVideos', JSON.stringify(videos));

        reactionDiv.textContent = `Loaded ${videos.length} videos!`;
        renderVideos(videos);
    } catch (error) {
        reactionDiv.textContent = '';
        errorDiv.textContent = `Error: ${error.message}. Check API key, channel ID, or network connection.`;
        errorDiv.style.display = 'block';
        errorDiv.classList.add('animate-error');
    }
}

function renderVideos(videos) {
    const previewGrid = document.getElementById('preview-grid');
    previewGrid.innerHTML = videos.map((item, index) => `
        <div class="video-card animate-card" data-index="${index}">
            <a href="game.html?id=${index}">
                <img src="${item.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/150'}" alt="${item.snippet.title}" class="animate-image">
                <div class="video-stats">
                    <p><i class="fas fa-eye"></i> Loading views...</p>
                    <p><i class="fas fa-thumbs-up"></i> Loading likes...</p>
                    <p><i class="fas fa-thumbs-down"></i> Loading dislikes...</p>
                </div>
                <h3 class="animate-text">${item.snippet.title}</h3>
            </a>
        </div>
    `).join('');
    loadVideoStats(videos);
}

async function loadVideoStats(videos) {
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
    for (const video of videos) {
        const videoId = video.snippet.resourceId.videoId;
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
            const data = await response.json();
            if (data.error) throw new Error(`API error: ${data.error.message}`);
            if (data.items && data.items.length > 0) {
                const stats = data.items[0].statistics;
                const videoCard = document.querySelector(`.video-card[data-index="${videos.indexOf(video)}"] .video-stats`);
                if (videoCard) {
                    videoCard.querySelector('p:nth-child(1)').innerHTML = `<i class="fas fa-eye"></i> ${stats.viewCount || 0} Views`;
                    videoCard.querySelector('p:nth-child(2)').innerHTML = `<i class="fas fa-thumbs-up"></i> ${stats.likeCount || 0} Likes`;
                    videoCard.querySelector('p:nth-child(3)').innerHTML = `<i class="fas fa-thumbs-down"></i> N/A`;
                }
            }
        } catch (error) {
            console.error(`Error loading stats for video ${videoId}:`, error);
            const videoCard = document.querySelector(`.video-card[data-index="${videos.indexOf(video)}"] .video-stats`);
            if (videoCard) {
                videoCard.querySelector('p:nth-child(1)').innerHTML = `<i class="fas fa-eye"></i> Failed to load views`;
                videoCard.querySelector('p:nth-child(2)').innerHTML = `<i class="fas fa-thumbs-up"></i> Failed to load likes`;
                videoCard.querySelector('p:nth-child(3)').innerHTML = `<i class="fas fa-thumbs-down"></i> N/A`;
            }
        }
    }
}

function loadGameDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    if (gameId) {
        const cachedVideos = JSON.parse(localStorage.getItem('channelVideos') || '[]');
        const video = cachedVideos[gameId];
        if (video) {
            const gameContent = document.querySelector('.game-content');
            if (gameContent) {
                gameContent.innerHTML = `
                    <h3 class="animate-text">${video.snippet.title}</h3>
                    <p class="animate-text">Description of the game, featuring exciting gameplay and features...</p>
                    <img src="${video.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/300'}" alt="${video.snippet.title}" class="game-screenshot animate-image">
                    <div class="video-stats">
                        <p><i class="fas fa-eye"></i> ${loadVideoStat(video.snippet.resourceId.videoId, 'viewCount') || 'Loading views...'}</p>
                        <p><i class="fas fa-thumbs-up"></i> ${loadVideoStat(video.snippet.resourceId.videoId, 'likeCount') || 'Loading likes...'}</p>
                    </div>
                `;
            }
        } else {
            console.error(`Video with ID ${gameId} not found in cache`);
        }
    }
}

async function loadVideoStat(videoId, statType) {
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        const data = await response.json();
        if (data.error) throw new Error(`API error: ${data.error.message}`);
        if (data.items && data.items.length > 0) {
            return data.items[0].statistics[statType] || 'N/A';
        }
        return 'N/A';
    } catch (error) {
        console.error(`Error loading ${statType} for video ${videoId}:`, error);
        return 'Failed to load';
    }
}

// AI and Roblox Script Functions
function setCategory(category, inputElementId = 'script-input') {
    const input = document.getElementById(inputElementId);
    if (input) {
        const samples = {
            'Build': 'How do I add background music to my Roblox experience?',
            'Grow': 'How do I bring new users to my Roblox experience? Reply and I’ll share what I’m doing so far.',
            'Monetize': 'How do Limited avatar items work and what are some tips to sell them?',
            'ArtificialIntelligence': 'How can I implement artificial intelligence in my Roblox game?'
        };
        input.value = samples[category] || 'Ask a question about Roblox development...';
        input.focus();
    }
}

function sendToAI(inputElementId = 'script-input', responseElementId = 'ai-response') {
    const input = document.getElementById(inputElementId);
    const responseDiv = document.getElementById(responseElementId);
    if (input && responseDiv) {
        const query = input.value.trim().toLowerCase();
        if (query && isLoggedIn) {
            responseDiv.textContent = "Thinking...";
            responseDiv.classList.add('animate-loading');

            setTimeout(() => {
                let response;
                if (query.includes('artificial intelligence')) {
                    response = generateAIInterface(responseElementId);
                } else {
                    response = simulateAIResponse(query);
                }
                responseDiv.innerHTML = response;
                responseDiv.classList.remove('animate-loading');
                responseDiv.classList.add('animate-success');
            }, 2000);
        } else {
            responseDiv.textContent = isLoggedIn ? "Please enter a question!" : "Please log in to use the AI tool.";
            responseDiv.classList.add('animate-error');
            setTimeout(() => responseDiv.textContent = '', 3000);
        }
    }
}

function simulateAIResponse(query) {
    const responses = {
        'background music': `To add background music to your Roblox experience:\n1. Use a `Sound` object:\n   - Insert a `Sound` into a part or Workspace.\n   - Set the `SoundId` to a Roblox audio asset ID (e.g., "rbxassetid://123456789").\n   - Play it with `sound:Play()` in a Lua script.\n   Example:\n   <pre class="language-lua"><code>${Prism.highlight(`local sound = Instance.new("Sound")\nsound.SoundId = "rbxassetid://123456789"\nsound.Parent = game.Workspace\nsound:Play()`, Prism.languages.lua, 'lua')}</code></pre>\n2. Ensure the audio asset is uploaded to Roblox and you have permissions.`,
        'new users': `To bring new users to your Roblox experience:\n1. Promote on social media (Twitter, Discord, Roblox groups).\n2. Use Roblox Ads (Developer Marketplace) to target users.\n3. Collaborate with other creators for cross-promotion.\nExample Lua script for tracking players:\n<pre class="language-lua"><code>${Prism.highlight(`local Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n    print(player.Name .. " joined the game!")\nend)`, Prism.languages.lua, 'lua')}</code></pre>`,
        'limited avatar items': `Limited avatar items in Roblox:\n- Limited items are rare, time-limited, or have low stock, increasing their value.\n- Tips to sell them:\n  1. List on the Roblox marketplace with a competitive price.\n  2. Promote via Roblox groups, Discord, or Twitter.\n  3. Use scarcity (e.g., “Only 100 left!”) to drive demand.\nExample Lua script to check item ownership:\n<pre class="language-lua"><code>${Prism.highlight(`local MarketplaceService = game:GetService("MarketplaceService")\nlocal player = game.Players.LocalPlayer\nlocal itemId = 123456789 -- Replace with your asset ID\nif MarketplaceService:PlayerOwnsAsset(player, itemId) then\n    print("Player owns the limited item!")\nend`, Prism.languages.lua, 'lua')}</code></pre>`
    };
    for (const key in responses) {
        if (query.includes(key)) return responses[key];
    }
    return `I'm here to help with Roblox! Specify a category (Build, Grow, Monetize, ArtificialIntelligence) or ask a detailed question. Example Lua script:\n<pre class="language-lua"><code>${Prism.highlight(`local part = Instance.new("Part")\npart.Position = Vector3.new(0, 10, 0)\npart.Parent = game.Workspace`, Prism.languages.lua, 'lua')}</code></pre>`;
}

function generateAIInterface(responseElementId = 'ai-response') {
    return `
        <div class="ai-interface animate-card" style="background-color: #121212; color: white; font-family: Arial, sans-serif; text-align: center; padding: 20px; border-radius: 5px; margin: 10px;">
            <h2 class="animate-text">Artificial Intelligence in Roblox</h2>
            <p class="animate-text">Here's how to implement AI in your Roblox game using Lua:</p>
            <div class="video-container">
                <img src="https://via.placeholder.com/200" alt="AI Demo" class="animate-image" style="width: 200px; height: auto; cursor: pointer; margin: 10px;" onclick="alert('Click to view AI demo video!')">
            </div>
            <pre class="language-lua"><code>${Prism.highlight(`
local AIService = {}
AIService.__index = AIService

function AIService.new()
    local self = setmetatable({}, AIService)
    self.agents = {}
    return self
end

function AIService:addAgent(name, behavior)
    self.agents[name] = behavior
    print(name .. " AI agent added with behavior: " .. behavior)
end

function AIService:runAgent(name)
    if self.agents[name] then
        print("Running " .. name .. " AI behavior...")
        -- Simulate AI behavior (e.g., pathfinding, decision-making)
        local humanoid = game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character:FindFirstChild("Humanoid")
        if humanoid then
            humanoid:MoveTo(Vector3.new(0, 10, 0)) -- Example: Move to a position
        end
    else
        warn("Agent " .. name .. " not found!")
    end
end

-- Example usage
local ai = AIService.new()
ai:addAgent("EnemyBot", "Patrol and Attack")
ai:runAgent("EnemyBot")
`, Prism.languages.lua, 'lua')}</code></pre>
            <p class="animate-text">Click the image above to see a demo of AI in action!</p>
            <button class="btn actionbtn animate-btn" onclick="expandAIInterface('${responseElementId}')">Expand Details</button>
        </div>
        <script>
            function expandAIInterface(responseElementId) {
                const responseDiv = document.getElementById(responseElementId);
                responseDiv.innerHTML += '<p class="animate-text">Expanding AI details: Use Roblox\'s PathfindingService for navigation, Behavior Trees for decision-making, and NPC models for AI characters. Example: local path = game:GetService("PathfindingService"):CreatePath()</p>';
            }
        </script>
    `;
}

// Comment Functions
function updateCommentVisibility(commentSectionId = 'comment-section', toggleButtonId = 'toggle-comments') {
    const commentSection = document.getElementById(commentSectionId);
    const toggleButton = document.getElementById(toggleButtonId);
    if (commentSection && toggleButton) {
        const isVisible = commentSection.style.display === 'block';
        commentSection.style.display = isVisible ? 'none' : 'block';
        toggleButton.textContent = isVisible ? 'Show Comments' : 'Hide Comments';
        toggleButton.classList.add('animate-btn');
    }
}

function addComment(commentInputId = 'comment-input', commentsListId = 'comments-list') {
    const commentInput = document.getElementById(commentInputId);
    const commentText = commentInput?.value.trim();
    if (commentText && isLoggedIn) {
        const commentsList = document.getElementById(commentsListId);
        if (commentsList) {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment animate-card';
            commentDiv.textContent = `${currentUser.username || currentUser.email}: ${commentText}`;
            commentsList.appendChild(commentDiv);
            commentInput.value = '';
            saveComments(commentsListId);
        }
    } else {
        alert('Please log in to add a comment!');
    }
}

function saveComments(commentsListId = 'comments-list') {
    const commentsList = document.getElementById(commentsListId);
    if (commentsList) {
        const comments = Array.from(commentsList.children).map(comment => comment.textContent);
        localStorage.setItem('gameComments', JSON.stringify(comments));
    }
}

function loadComments(commentsListId = 'comments-list') {
    const comments = JSON.parse(localStorage.getItem('gameComments') || '[]');
    const commentsList = document.getElementById(commentsListId);
    if (commentsList) {
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment animate-card';
            commentDiv.textContent = comment;
            commentsList.appendChild(commentDiv);
        });
    }
}

// Task Confirmation Functions
function checkTask(button, taskType) {
    if (confirm(`Have you completed the ${taskType.replace('-', ' ')} task?`)) {
        button.parentElement.classList.add('completed');
        button.parentElement.classList.add('animate-success');
        checkAllTasks();
    }
}

function checkAllTasks() {
    const tasks = document.querySelectorAll('.task-card');
    const allCompleted = Array.from(tasks).every(task => task.classList.contains('completed'));
    const successMessage = document.getElementById('success-message');
    const downloadLink = document.getElementById('download-link');

    if (allCompleted) {
        if (successMessage) {
            successMessage.style.display = 'block';
            successMessage.classList.add('animate-success');
        }
        if (downloadLink) {
            downloadLink.style.display = 'inline-block';
            downloadLink.classList.add('animate-btn');
        }
    } else {
        if (successMessage) {
            successMessage.style.display = 'none';
            successMessage.classList.remove('animate-success');
        }
        if (downloadLink) {
            downloadLink.style.display = 'none';
            downloadLink.classList.remove('animate-btn');
        }
    }
}

// OAuth Simulations
function googleLogin() {
    alert('Google Sign-In requires OAuth setup. This is a simulation.');
}

function microsoftLogin() {
    alert('Microsoft Sign-In requires OAuth setup. This is a simulation.');
}

// Page-Specific Tasks Handler
function handlePageTasks() {
    const path = window.location.pathname;
    if (path.includes('index.html')) {
        fetchVideos();
        trackVisitor();
        displayStats();
    } else if (path.includes('game.html')) {
        trackPageVisitors();
        loadGameDetails();
        loadComments();
        updateCommentVisibility();
    } else if (path.includes('ai.html')) {
        // Handled by user interaction via onclick
    } else if (path.includes('confirm.html')) {
        // Handled by user interaction via onclick
    } else if (path.includes('login.html')) {
        trackVisitor();
        displayStats();
    } else if (path.includes('account-settings.html')) {
        trackVisitor();
        displayStats();
    }
}

function trackPageVisitors() {
    let pageVisits = parseInt(localStorage.getItem('gamePageVisits') || '0') + 1;
    localStorage.setItem('gamePageVisits', pageVisits.toString());
    console.log(`Game page visited ${pageVisits} times`);
}

// Tab Switching for Account Settings
function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-btn[onclick="openTab('${tabName}')"]`).classList.add('active');
    tabContents.forEach(content => content.classList.add('animate-card'));
    tabButtons.forEach(btn => btn.classList.add('animate-btn'));
}
