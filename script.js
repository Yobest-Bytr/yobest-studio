// Global variables
let isLoggedIn = false;
let currentUser = null;
let chatHistory = []; // For AI chat history

// Load Prism.js for syntax highlighting
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    checkLoginState();
    handlePageTasks();
    initializePrism(); // Initialize Prism.js for Lua highlighting
    initializeButtonAnimations(); // Initialize button animations
    loadChatHistory(); // Load AI chat history
});

// Utility Functions for Prism.js
function initializePrism() {
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    } else {
        console.error('Prism.js not loaded. Check script inclusion.');
    }
}

// Button Animation Initialization
function initializeButtonAnimations() {
    const buttons = document.querySelectorAll('.btn, .nav-btn, .socialbtn, .actionbtn, .send-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.classList.add('glow');
        });
        button.addEventListener('mouseout', () => {
            button.classList.remove('glow');
        });
        button.addEventListener('click', () => {
            button.classList.add('pulse-click');
            setTimeout(() => button.classList.remove('pulse-click'), 500);
        });
    });
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
        updateAIState(); // Update AI tool state based on login
    } else {
        isLoggedIn = false;
        currentUser = null;
        updateNavButtons();
        updateAIState(); // Update AI tool state based on login
    }
}

function updateAIState() {
    const responseDiv = document.getElementById('chat-history');
    if (responseDiv && !isLoggedIn) {
        responseDiv.innerHTML = '<p class="body-text animate-error" style="color: #ff4444;">Please log in to use the AI chat.</p>';
        setTimeout(() => responseDiv.innerHTML = '', 3000);
    }
}

function authUser(email, password, callback) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email].password === password) {
        isLoggedIn = true;
        currentUser = { email, username: users[email].username || email.split('@')[0], avatar: users[email].avatar || 'https://via.placeholder.com/40' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNavButtons();
        updateAIState(); // Update AI state after login
        callback({ success: true, message: 'Login successful!' });
    } else if (!users[email]) {
        users[email] = { password, username: email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        localStorage.setItem('users', JSON.stringify(users));
        isLoggedIn = true;
        currentUser = { email, username: email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNavButtons();
        updateAIState(); // Update AI state after login
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
    updateAIState(); // Update AI state after logout
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
                </div>
                <h3 class="animate-text">${item.snippet.title}</h3>
            </a>
        </div>
    `).join('');
    loadVideoStats(videos);
}

async function loadVideoStats() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');
    if (gameId) {
        const cachedVideos = JSON.parse(localStorage.getItem('channelVideos') || '[]');
        const video = cachedVideos[gameId];
        if (video) {
            const videoId = video.snippet.resourceId.videoId;
            const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
            try {
                const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
                if (!response.ok) throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
                const data = await response.json();
                if (data.error) throw new Error(`API error: ${data.error.message}`);
                if (data.items && data.items.length > 0) {
                    const stats = data.items[0].statistics;
                    document.getElementById('video-views').textContent = stats.viewCount || 0;
                    document.getElementById('video-likes').textContent = stats.likeCount || 0;
                }
            } catch (error) {
                console.error(`Error loading stats for video ${videoId}:`, error);
                document.getElementById('video-views').textContent = 'Failed to load';
                document.getElementById('video-likes').textContent = 'Failed to load';
            }
            // Simulated visitors (based on site visits)
            const visitors = localStorage.getItem('gamePageVisits') || 0;
            document.getElementById('video-visitors').textContent = visitors;
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
                // Simulated YouTube video data (since we can't search the web)
                const videoData = {
                    title: video.snippet.title,
                    description: "An epic Roblox game featuring exciting gameplay and features created by Yobest Studio.",
                    videoId: video.snippet.resourceId.videoId,
                    publishedAt: "2024-03-01T12:00:00Z" // Simulated publish date
                };

                gameContent.innerHTML = `
                    <h3 class="animate-text title-large" style="color: #00ffcc;">${videoData.title}</h3>
                    <p class="body-text animate-text" style="color: #a0a0a0;">${videoData.description} <i class="fas fa-gamepad"></i></p>
                    <div class="video-player">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoData.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <p class="small-text animate-text" style="color: #888;">Published on ${new Date(videoData.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} (March 04, 2025)</p>
                `;
            }
        } else {
            console.error(`Video with ID ${gameId} not found in cache`);
        }
    }
}

// AI and Chat Functions
function loadChatHistory() {
    chatHistory = JSON.parse(localStorage.getItem('aiChatHistory') || '[]');
    const chatHistoryDiv = document.getElementById('chat-history');
    if (chatHistoryDiv) {
        chatHistoryDiv.innerHTML = chatHistory.map(msg => `
            <div class="chat-message ${msg.isUser ? 'user-message' : 'ai-message'} animate-card">
                <p class="body-text animate-text" style="color: ${msg.isUser ? '#00ffcc' : '#a0a0a0'};">${msg.text}</p>
                <p class="small-text animate-text" style="color: #888;">${new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
        `).join('');
        chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
    }
}

function saveChatHistory() {
    localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory));
}

function sendToAI(inputElementId = 'ai-input', responseElementId = 'chat-history') {
    const input = document.getElementById(inputElementId);
    const responseDiv = document.getElementById(responseElementId);
    if (input && responseDiv) {
        const query = input.value.trim();
        if (query && isLoggedIn) {
            // Add user message to chat history
            const userMessage = { text: query, isUser: true, timestamp: new Date().toISOString() };
            chatHistory.push(userMessage);
            responseDiv.innerHTML += `
                <div class="chat-message user-message animate-card">
                    <p class="body-text animate-text" style="color: #00ffcc;">${userMessage.text}</p>
                    <p class="small-text animate-text" style="color: #888;">${new Date(userMessage.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            `;
            input.value = '';

            // Simulate AI response (ChatGPT-like)
            responseDiv.innerHTML += '<div class="chat-message ai-message animate-loading" style="color: #00ffcc;">Thinking...</div>';
            setTimeout(() => {
                const aiResponse = simulateChatGPTResponse(query, chatHistory);
                const aiMessage = { text: aiResponse, isUser: false, timestamp: new Date().toISOString() };
                chatHistory.push(aiMessage);
                saveChatHistory();
                responseDiv.innerHTML = chatHistory.map(msg => `
                    <div class="chat-message ${msg.isUser ? 'user-message' : 'ai-message'} animate-card">
                        <p class="body-text animate-text" style="color: ${msg.isUser ? '#00ffcc' : '#a0a0a0'};">${msg.text}</p>
                        <p class="small-text animate-text" style="color: #888;">${new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                `).join('');
                responseDiv.classList.remove('animate-loading');
                responseDiv.classList.add('animate-success');
                responseDiv.scrollTop = responseDiv.scrollHeight;
            }, 2000);
        } else {
            responseDiv.innerHTML = '<p class="body-text animate-error" style="color: #ff4444;">Please log in to use the AI chat or enter a question.</p>';
            setTimeout(() => responseDiv.innerHTML = '', 3000);
        }
    }
}

function simulateChatGPTResponse(query, history) {
    // Context-aware response based on chat history
    const context = history.map(msg => msg.text.toLowerCase()).join(' ').replace(/[^\w\s]/gi, '');
    const responses = {
        // General Roblox development queries
        'how do i add background music': `To add background music to your Roblox experience, you can use a Sound object. Here’s how:\n1. Insert a Sound object into a part or directly into Workspace.\n2. Set the `SoundId` property to a Roblox audio asset ID (e.g., "rbxassetid://123456789").\n3. Play it using `sound:Play()` in a Lua script.\nExample:\n<pre class="language-lua"><code>${Prism.highlight('local sound = Instance.new("Sound")\nsound.SoundId = "rbxassetid://123456789"\nsound.Parent = game.Workspace\nsound:Play()', Prism.languages.lua, 'lua')}</code></pre>\nEnsure the audio asset is uploaded to Roblox and you have the necessary permissions. Would you like tips on managing audio volume, looping, or cross-fading?`,

        'how do i bring new users': `Attracting new users to your Roblox experience involves several strategies:\n- **Promote on Social Media**: Share your game on platforms like Twitter, Discord, and Roblox groups.\n- **Use Roblox Ads**: Leverage the Developer Marketplace for targeted advertising.\n- **Collaborate with Creators**: Partner with other developers for cross-promotion.\n- **Engage Your Community**: Host events or giveaways to draw attention.\nHere’s a Lua script to track player joins:\n<pre class="language-lua"><code>${Prism.highlight(`local Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n    print(player.Name .. " joined the game!")\nend)`, Prism.languages.lua, 'lua')}</code></pre>\nDo you want advice on specific promotion tactics, analytics tools, or community engagement strategies?`,

        'how do limited avatar items work': `Limited avatar items in Roblox are rare or time-limited items that increase in value due to scarcity. Here’s how they work and tips to sell them:\n- **Scarcity**: Limited items have a fixed stock or are available for a limited time, making them valuable.\n- **Marketplace Listing**: List them on the Roblox marketplace with a competitive price.\n- **Promotion**: Use Roblox groups, Discord, or Twitter to promote, emphasizing rarity (e.g., “Only 100 left!”).\n- **Engagement**: Engage your community to drive demand.\nExample Lua script to check ownership:\n<pre class="language-lua"><code>${Prism.highlight(`local MarketplaceService = game:GetService("MarketplaceService")\nlocal player = game.Players.LocalPlayer\nlocal itemId = 123456789 -- Replace with your asset ID\nif MarketplaceService:PlayerOwnsAsset(player, itemId) then\n    print("Player owns the limited item!")\nend`, Prism.languages.lua, 'lua')}</code></pre>\nWould you like more details on pricing strategies, legal considerations, or marketing techniques?`,

        'how can i implement ai': `Implementing artificial intelligence in Roblox can enhance gameplay with NPCs or smart systems. Here’s a basic approach using Lua:\n- **PathfindingService**: Use for NPC navigation.\n- **Behavior Trees**: Structure AI behavior (e.g., patrol, attack, retreat).\n- **NPC Models**: Create AI-controlled characters with Humanoids.\nExample:\n<pre class="language-lua"><code>${Prism.highlight(`
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
        local humanoid = game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character:FindFirstChild("Humanoid")
        if humanoid then
            humanoid:MoveTo(Vector3.new(0, 10, 0)) -- Example: Move to a position
        end
    else
        warn("Agent " .. name .. " not found!")
    end
end

local ai = AIService.new()
ai:addAgent("EnemyBot", "Patrol and Attack")
ai:runAgent("EnemyBot")
`, Prism.languages.lua, 'lua')}</code></pre>\nWould you like examples for pathfinding, decision-making, integrating with Roblox Studio plugins, or advanced AI techniques like machine learning?`,

        // Context-aware responses
        'volume tips': `For managing audio volume in Roblox, you can adjust the `Volume` property of a Sound object (0 to 1, where 1 is max volume). Example:\n<pre class="language-lua"><code>${Prism.highlight('local sound = Instance.new("Sound")\nsound.SoundId = "rbxassetid://123456789"\nsound.Volume = 0.5 -- 50% volume\nsound.Parent = game.Workspace\nsound:Play()', Prism.languages.lua, 'lua')}</code></pre>\nYou can also use `sound:Pause()` or `sound:Stop()` to control playback. Would you like to learn about fading effects or sound prioritization?`,

        'promotion tactics': `Here are specific promotion tactics for your Roblox experience:\n- **Social Media Campaigns**: Post engaging content on Twitter, Discord, and Roblox forums, including trailers and updates.\n- **Roblox Events**: Host in-game events or contests to attract players.\n- **Influencer Partnerships**: Collaborate with Roblox influencers or YouTubers to showcase your game.\n- **SEO Optimization**: Use relevant keywords in your game description and thumbnails.\nWould you like Lua scripts for tracking event participation or analytics tools?`,

        'pricing strategies': `For pricing Limited avatar items on Roblox:\n- **Market Research**: Check similar items’ prices on the marketplace to set a competitive price.\n- **Dynamic Pricing**: Start high and lower prices if demand decreases, or use auctions for rarity.\n- **Bundling**: Offer bundles with other items to increase perceived value.\n- **Scarcity Marketing**: Highlight limited stock or time-sensitive offers.\nWould you like Lua code for tracking sales or managing inventory?`,

        'pathfinding': `For pathfinding in Roblox, use the `PathfindingService`. Here’s a basic example:\n<pre class="language-lua"><code>${Prism.highlight(`
local PathfindingService = game:GetService("PathfindingService")
local path = PathfindingService:CreatePath()
local startPosition = Vector3.new(0, 0, 0)
local endPosition = Vector3.new(10, 0, 10)

path:ComputeAsync(startPosition, endPosition)
if path.Status == Enum.PathStatus.Success then
    for _, waypoint in pairs(path:GetWaypoints()) do
        humanoid:MoveTo(waypoint.Position)
        humanoid.MoveToFinished:Wait()
    end
end
`, Prism.languages.lua, 'lua')}</code></pre>\nWould you like tips on optimizing pathfinding for complex terrains or handling obstacles?`,

        // Fallback for generic or new queries
        'default': `I'm here to assist with Roblox development! Please provide more details about your question—whether it’s about building, growing your player base, monetizing, or implementing AI. I can offer Lua code examples, tutorials, and advice. What specific topic would you like to explore? If you’ve asked something before, feel free to build on it, and I’ll refine my response.`
    };

    // Check for specific keywords or phrases, considering context from history
    for (const key in responses) {
        if (query.toLowerCase().includes(key)) {
            return responses[key];
        }
    }
    return responses['default'];
}

// Comment Functions for Site (Unified for index.html and game.html)
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
                owner: currentUser.email // Track comment owner for edit/delete
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

// Comment Functions for YouTube (Simulated, read-only)
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
    const writingInput = document.querySelector('.writing-input');
    const text = writingInput?.value.trim();
    if (text && isLoggedIn) {
        alert(`Your writing has been saved: ${text}`);
        writingInput.value = '';
    } else {
        alert('Please log in to save your writing!');
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
            successMessage.style.color = '#00ffcc';
            successMessage.style.fontFamily = '"Inter", sans-serif';
            successMessage.style.fontSize = '1.1em';
        }
        if (downloadLink) {
            downloadLink.style.display = 'inline-block';
            downloadLink.classList.add('animate-btn');
            downloadLink.style.fontFamily = '"Inter", sans-serif';
            downloadLink.style.fontSize = '1em';
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
        loadSiteComments('site-comments-list');
        initializeChat();
    } else if (path.includes('game.html')) {
        trackPageVisitors();
        loadGameDetails();
        loadVideoStats();
        loadYouTubeComments();
        loadSiteComments('site-comments-list');
        initializeChat();
    } else if (path.includes('ai.html')) {
        trackVisitor();
        displayStats();
        checkLoginState(); // Ensure login state is checked on AI page load
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

// Response Handlers
function handleAuthResponse(response) {
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.textContent = response.message;
        errorDiv.style.display = response.success ? 'none' : 'block';
        errorDiv.classList.remove('animate-error');
        errorDiv.classList.add(response.success ? 'animate-success' : 'animate-error');
        errorDiv.style.color = response.success ? '#00ffcc' : '#ff4444';
        errorDiv.style.fontFamily = '"Inter", sans-serif';
        errorDiv.style.fontSize = '1em';
        if (response.success) {
            window.location.href = 'index.html';
        }
        setTimeout(() => errorDiv.textContent = '', 3000);
    }
}

function handleAccountResponse(response) {
    const messageDiv = document.getElementById('account-message');
    if (messageDiv) {
        messageDiv.textContent = response.message;
        messageDiv.style.display = response.success ? 'block' : 'none';
        messageDiv.classList.remove('animate-error');
        messageDiv.classList.add(response.success ? 'animate-success' : 'animate-error');
        messageDiv.style.color = response.success ? '#00ffcc' : '#ff4444';
        messageDiv.style.fontFamily = '"Inter", sans-serif';
        messageDiv.style.fontSize = '1em';
        setTimeout(() => messageDiv.textContent = '', 3000);
    }
}

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
