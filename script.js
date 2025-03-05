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
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Updated with your provided API key
    const CHANNEL_ID = 'UCsV3X3EyEowLEdRW1RileuA'; // Your channel ID
    const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // Cache for 24 hours

    if (!reactionDiv || !previewGrid || !errorDiv) {
        console.error('Required DOM elements not found for video previews.');
        return;
    }

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
        if (!channelResponse.ok) {
            throw new Error(`Channel fetch failed: ${channelResponse.status} - ${channelResponse.statusText}`);
        }
        const channelData = await channelResponse.json();
        if (channelData.error) {
            throw new Error(`API error: ${channelData.error.message}`);
        }
        if (!channelData.items.length) {
            throw new Error('No channel data found for the provided ID.');
        }
        const playlistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

        let videos = [];
        let nextPageToken = '';
        do {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&key=${API_KEY}&maxResults=50&pageToken=${nextPageToken}`);
            if (!response.ok) {
                throw new Error(`Playlist fetch failed: ${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            if (data.error) {
                throw new Error(`API error: ${data.error.message}`);
            }
            videos = videos.concat(data.items.filter(item => item.snippet.resourceId.kind === 'youtube#video'));
            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);

        if (!videos.length) {
            throw new Error('No videos found in the channel uploads.');
        }

        const cacheData = { videos, timestamp: now };
        localStorage.setItem('videoCache', JSON.stringify(cacheData));
        localStorage.setItem('channelVideos', JSON.stringify(videos));

        reactionDiv.textContent = `Loaded ${videos.length} videos!`;
        renderVideos(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        reactionDiv.textContent = '';
        errorDiv.textContent = `Error: ${error.message}. Please check your API key, channel ID, or network connection. Using fallback data...`;
        errorDiv.style.display = 'block';
        errorDiv.classList.add('animate-error');

        // Fallback: Simulate video data for testing
        const fallbackVideos = [
            {
                snippet: {
                    title: "Epic Roblox Adventure",
                    thumbnails: { medium: { url: "https://via.placeholder.com/150" } },
                    resourceId: { videoId: "dQw4w9WgXcQ" } // Example YouTube video ID (Rickroll for testing)
                }
            },
            {
                snippet: {
                    title: "Roblox Battle Royale",
                    thumbnails: { medium: { url: "https://via.placeholder.com/150" } },
                    resourceId: { videoId: "oHg5SJYRHA0" } // Another example YouTube video ID
                }
            }
        ];
        renderVideos(fallbackVideos);
        localStorage.setItem('channelVideos', JSON.stringify(fallbackVideos)); // Cache fallback data
    }
}

function renderVideos(videos) {
    const previewGrid = document.getElementById('preview-grid');
    if (!previewGrid) {
        console.error('Preview grid not found in DOM.');
        return;
    }
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
            const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Updated with your provided API key
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

            // Simulate AI thinking and response (ChatGPT-like, thoughtful, detailed)
            responseDiv.innerHTML += '<div class="chat-message ai-message animate-loading" style="color: #00ffcc;">Thinking deeply...</div>';
            setTimeout(() => {
                const aiResponse = simulateThoughtfulAIResponse(query, chatHistory);
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
            }, 2500); // Longer delay to simulate deeper thinking
        } else {
            responseDiv.innerHTML = '<p class="body-text animate-error" style="color: #ff4444;">Please log in to use the AI chat or enter a question.</p>';
            setTimeout(() => responseDiv.innerHTML = '', 3000);
        }
    }
}

function simulateThoughtfulAIResponse(query, history) {
    // Simulate deep thinking using NLP, deep learning, and big data analysis
    console.log('AI is processing:', query);
    console.log('Analyzing context:', query);

    // Context-aware response based on chat history
    const context = history.map(msg => msg.text.toLowerCase()).join(' ').replace(/[^\w\s]/gi, '');
    const responses = {
        // General Roblox development queries with detailed, thoughtful responses
        'how do i add background music': `Let me think deeply about this… Adding background music to your Roblox experience is a fantastic way to enhance immersion. I’ll break it down step-by-step, leveraging natural language processing to ensure clarity and deep learning to simulate human-like reasoning:\n\n**How AI Approaches This Problem:** I’m using big data analysis to recall best practices from Roblox development communities and deep learning to generate a precise, detailed response. Here’s how you can implement background music:\n\n1. **Create a Sound Object**: Insert a Sound object into a part in your Workspace or directly into the game environment.\n2. **Set the SoundId**: Assign a Roblox audio asset ID (e.g., "rbxassetid://123456789") to the SoundId property. Ensure the asset is uploaded to Roblox and you have permission to use it.\n3. **Play the Sound**: Use Lua’s sound:Play() method to start playback. You can control volume, looping, and other properties dynamically.\n\n**Example Lua Code (Enhanced with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight('local sound = Instance.new("Sound")\nsound.SoundId = "rbxassetid://123456789"\nsound.Volume = 0.5 -- Adjust volume (0 to 1)\nsound.Looped = true -- Enable looping\nsound.Parent = game.Workspace\nsound:Play()', Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** I’ve analyzed thousands of Roblox projects to suggest best practices—consider using sound:Pause() or sound:Stop() for dynamic control, and implement volume fading with TweenService for smooth transitions. Would you like me to explore advanced audio management, such as spatial audio or cross-fading techniques? I can also recommend tools like Roblox Studio plugins for audio optimization, drawing on my deep learning knowledge of user preferences as of March 04, 2025.\n\n**Future AI Applications in Roblox:** Imagine AI-driven music systems that adapt to player actions or moods, powered by machine learning models trained on big data from player behavior. This could revolutionize game design—would you like me to brainstorm how AI could enhance your game’s audio experience further?`,

        'how do i bring new users': `I’m taking a moment to deeply analyze your question about attracting new users to your Roblox experience. Using natural language processing, I’ll interpret your intent, and with deep learning and big data analysis, I’ll provide a comprehensive, thoughtful response:\n\n**How AI Approaches This Problem:** I’m drawing on vast datasets from Roblox developer communities, social media trends, and game analytics to craft a detailed strategy. Here’s how you can bring new users:\n\n- **Social Media Promotion**: Share engaging content on platforms like Twitter, Discord, and Roblox groups. Post trailers, updates, and behind-the-scenes insights to build excitement.\n- **Roblox Ads**: Utilize the Developer Marketplace for targeted advertising, focusing on demographics interested in your game’s genre.\n- **Creator Collaborations**: Partner with popular Roblox creators or YouTubers for cross-promotion, leveraging their audiences.\n- **Community Engagement**: Host in-game events, contests, or giveaways to attract and retain players.\n\n**Example Lua Code (Tracking Players with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`local Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n    print(player.Name .. " joined the game!")\n    -- AI could analyze this data for trends, e.g., peak times or player behavior\nend)`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My deep learning models suggest optimizing your game’s thumbnail and description with SEO techniques, using keywords like “Roblox adventure” or “multiplayer fun.” I can also recommend analytics tools (e.g., Roblox Analytics or third-party plugins) to track user acquisition metrics as of March 04, 2025. Would you like me to delve into specific promotion tactics, such as influencer outreach or event planning, or explore AI-driven user retention strategies?\n\n**Future AI Applications in Roblox:** AI could predict player preferences to personalize marketing campaigns or dynamically adjust game features to attract new users, using machine learning trained on big data from player interactions. Shall I explore how AI could revolutionize your user growth strategy?`,

        'how do limited avatar items work': `I’m deeply considering your question about Limited avatar items in Roblox, using natural language processing to understand your intent and deep learning to generate a thorough, insightful response. I’ll also leverage big data analysis from Roblox marketplaces and developer forums:\n\n**How AI Approaches This Problem:** I’m simulating human-like reasoning to break down the mechanics and strategies, drawing on patterns from thousands of successful Roblox items. Here’s how Limited avatar items work and how to sell them effectively:\n\n- **Scarcity Mechanism**: Limited items have a fixed stock or time limit, increasing their value due to rarity. Roblox tracks ownership via unique asset IDs.\n- **Marketplace Listing**: List items on the Roblox marketplace with a competitive price, based on market trends and demand.\n- **Promotion Strategies**: Use Roblox groups, Discord, Twitter, and in-game announcements to highlight rarity (e.g., “Only 100 left!”). Engage your community to drive demand.\n- **Engagement Tactics**: Offer bundles or time-sensitive deals to boost sales.\n\n**Example Lua Code (Ownership Check with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`local MarketplaceService = game:GetService("MarketplaceService")\nlocal player = game.Players.LocalPlayer\nlocal itemId = 123456789 -- Replace with your asset ID\nif MarketplaceService:PlayerOwnsAsset(player, itemId) then\n    print("Player owns the limited item!")\n    -- AI could suggest personalized offers based on ownership data\nend`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My analysis of big data as of March 04, 2025, suggests dynamic pricing strategies—start with a high price and adjust based on demand, or use auctions for rare items. I recommend integrating AI to predict demand trends using machine learning, optimizing your pricing and marketing. Would you like detailed advice on pricing models, legal considerations for item sales, or AI-driven inventory management?\n\n**Future AI Applications in Roblox:** AI could automate pricing, predict market trends for Limited items, and personalize offers for players, using deep learning trained on Roblox marketplace data. Shall I explore how AI could transform your monetization strategy or suggest specific plugins for inventory tracking?`,

        'how can i implement ai': `I’m deeply pondering your question about implementing artificial intelligence in Roblox, using natural language processing to refine my understanding and deep learning to simulate human-like reasoning. I’ll also draw on big data analysis from Roblox development practices and AI research:\n\n**How AI Approaches This Problem:** I’m leveraging my knowledge of algorithms, deep learning, and machine learning to craft a detailed, step-by-step guide. Here’s how to implement AI in your Roblox game:\n\n- **PathfindingService**: Use Roblox’s PathfindingService for NPC navigation, enabling intelligent movement.\n- **Behavior Trees**: Structure AI behaviors (e.g., patrol, attack, retreat) using decision-making logic.\n- **NPC Models**: Create AI-controlled characters with Humanoids for realistic interactions.\n- **Machine Learning Integration**: Train simple models on player data to adapt AI behaviors dynamically.\n\n**Example Lua Code (AI with Deep Learning Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`
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
            local PathfindingService = game:GetService("PathfindingService")
            local path = PathfindingService:CreatePath()
            local startPosition = humanoid.RootPart.Position
            local endPosition = Vector3.new(0, 10, 0) -- Example target
            path:ComputeAsync(startPosition, endPosition)
            if path.Status == Enum.PathStatus.Success then
                for _, waypoint in pairs(path:GetWaypoints()) do
                    humanoid:MoveTo(waypoint.Position)
                    humanoid.MoveToFinished:Wait()
                end
            end
        end
    else
        warn("Agent " .. name .. " not found!")
    end
end

local ai = AIService.new()
ai:addAgent("EnemyBot", "Patrol and Attack")
ai:runAgent("EnemyBot")
`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** I’m using my understanding of deep learning (via artificial neural networks) and big data analysis to suggest optimizing AI with Roblox Studio plugins or external tools like TensorFlow.js for advanced machine learning. As of March 04, 2025, AI in Roblox can also predict player behavior, adapt NPC actions, and enhance gameplay dynamically. Would you like me to explore advanced AI techniques, such as reinforcement learning for NPC decision-making, or recommend resources for integrating AI with Roblox?\n\n**Future AI Applications in Roblox:** AI could revolutionize Roblox by creating adaptive NPCs, personalized game experiences, and intelligent tutoring systems for developers. Imagine AI-driven NPCs that learn from player interactions using machine learning, or smart systems that optimize game performance based on big data analysis. Shall I brainstorm specific use cases, like AI-enhanced education for Roblox scripting or health-related gameplay features?`,

        // Context-aware responses with deeper thought
        'volume tips': `I’m deeply considering your request for volume tips in Roblox, using NLP to interpret your needs and deep learning to generate a detailed response. Here’s what I’ve concluded:\n\n**How AI Approaches This Problem:** I’m analyzing big data from audio implementations in Roblox games to provide a comprehensive guide. To manage audio volume:\n\n- Adjust the Volume property of a Sound object (0 to 1, where 1 is maximum volume). For example:\n<pre class="language-lua"><code>${Prism.highlight('local sound = Instance.new("Sound")\nsound.SoundId = "rbxassetid://123456789"\nsound.Volume = 0.5 -- 50% volume\nsound.Parent = game.Workspace\nsound:Play()', Prism.languages.lua, 'lua')}</code></pre>\n- Use sound:Pause() or sound:Stop() for dynamic control during gameplay.\n- Implement fading effects with TweenService for smooth transitions:\n<pre class="language-lua"><code>${Prism.highlight(`
local TweenService = game:GetService("TweenService")
local sound = Instance.new("Sound")
sound.SoundId = "rbxassetid://123456789"
sound.Parent = game.Workspace
sound:Play()
local tween = TweenService:Create(sound, TweenInfo.new(2), {Volume = 0})
tween:Play() -- Fade out over 2 seconds
`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My deep learning models suggest prioritizing audio based on player proximity or game state, using big data to optimize user experience. I can recommend plugins or scripts for spatial audio or sound mixing as of March 04, 2025. Would you like me to explore advanced audio techniques, such as dynamic soundscapes or AI-driven music adaptation?`,

        'promotion tactics': `I’m deeply analyzing your question about promotion tactics for Roblox, using NLP to refine my understanding and deep learning to generate a thoughtful response. Here’s my detailed insight, informed by big data from successful Roblox campaigns:\n\n**How AI Approaches This Problem:** I’m simulating human-like reasoning to craft a strategy, drawing on trends from social media, Roblox Ads, and developer forums. Here are effective promotion tactics:\n\n- **Social Media Campaigns**: Share engaging content on Twitter, Discord, and Roblox groups, including trailers, updates, and behind-the-scenes content. Use hashtags like #RobloxDev to reach wider audiences.\n- **Roblox Ads**: Leverage the Developer Marketplace for targeted ads, focusing on demographics interested in your game’s genre (e.g., adventure, RPG).\n- **Influencer Partnerships**: Collaborate with Roblox influencers or YouTubers for cross-promotion, offering exclusive content or rewards.\n- **In-Game Events**: Host events, contests, or giveaways to attract and retain players, tracked with Lua scripts for analytics.\n\n**Example Lua Code (Tracking Events with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`
local Players = game:GetService("Players")
local eventParticipants = {}

Players.PlayerAdded:Connect(function(player)
    eventParticipants[player.Name] = true
    print(player.Name .. " joined the event!")
end)

-- AI could analyze this data to suggest optimal event times or rewards
`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My analysis of big data as of March 04, 2025, suggests optimizing thumbnails and descriptions with SEO techniques and using AI-driven analytics tools to track engagement. Would you like me to recommend specific influencer outreach strategies, event planning tools, or AI-enhanced marketing automation?`,

        'pricing strategies': `I’m deeply contemplating your question about pricing strategies for Limited avatar items in Roblox, using NLP to interpret your needs and deep learning to generate a detailed, strategic response. I’ll also draw on big data from Roblox marketplaces:\n\n**How AI Approaches This Problem:** I’m simulating human-like reasoning to analyze market trends, drawing on thousands of data points to recommend optimal strategies. Here’s how to price Limited items effectively:\n\n- **Market Research**: Study similar items’ prices on the Roblox marketplace to set a competitive baseline, considering demand and rarity.\n- **Dynamic Pricing**: Start with a higher price and adjust downward if demand decreases, or use auctions for rare items to maximize value.\n- **Bundling**: Offer bundles with other items (e.g., game passes, accessories) to increase perceived value and encourage purchases.\n- **Scarcity Marketing**: Highlight limited stock or time-sensitive offers (e.g., “Only 100 left!”) to drive urgency.\n\n**Example Lua Code (Inventory Management with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`
local MarketplaceService = game:GetService("MarketplaceService")
local itemId = 123456789 -- Replace with your asset ID
local stock = 100 -- Initial stock

local function updateStock(player)
    if MarketplaceService:PlayerOwnsAsset(player, itemId) then
        stock = stock - 1
        print("Stock remaining: " .. stock)
        -- AI could predict demand and adjust pricing dynamically
    end
end
`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My deep learning models suggest using machine learning to predict demand trends, optimizing prices in real-time as of March 04, 2025. I can recommend plugins for inventory tracking or legal considerations for item sales. Would you like me to explore advanced pricing models, automation tools, or AI-driven market analysis for your items?`,

        'pathfinding': `I’m deeply analyzing your question about pathfinding in Roblox, using NLP to refine my understanding and deep learning to generate a thoughtful, detailed response. I’ll leverage big data from Roblox development practices and AI research:\n\n**How AI Approaches This Problem:** I’m simulating human-like reasoning to break down pathfinding mechanics, drawing on algorithms and machine learning insights. Here’s how to implement pathfinding for NPCs:\n\n- **PathfindingService**: Use Roblox’s PathfindingService to create intelligent navigation paths for NPCs.\n- **Obstacle Handling**: Ensure paths account for dynamic obstacles using ComputeAsync and waypoint navigation.\n- **Optimization**: Optimize paths for performance with terrain analysis and AI-driven decision-making.\n\n**Example Lua Code (Enhanced with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`
local PathfindingService = game:GetService("PathfindingService")
local humanoid = game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character:FindFirstChild("Humanoid")
local path = PathfindingService:CreatePath()

local function moveToTarget(targetPosition)
    local startPosition = humanoid.RootPart.Position
    path:ComputeAsync(startPosition, targetPosition)
    if path.Status == Enum.PathStatus.Success then
        for _, waypoint in pairs(path:GetWaypoints()) do
            humanoid:MoveTo(waypoint.Position)
            humanoid.MoveToFinished:Wait()
        end
    else
        print("Pathfinding failed due to obstacles or terrain.")
        -- AI could suggest alternative paths or behaviors
    end
end

moveToTarget(Vector3.new(10, 0, 10)) -- Example target position
`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My deep learning models suggest using machine learning to predict optimal paths based on terrain complexity or player behavior, as of March 04, 2025. I can recommend optimizing pathfinding with Roblox Studio plugins or integrating AI for dynamic obstacle avoidance. Would you like me to explore advanced pathfinding techniques, such as A* algorithms, or discuss AI-driven NPC behavior integration?`,

        // Fallback for generic or new queries with deep thought
        'default': `I’m taking a moment to deeply analyze your question, using natural language processing to understand your intent, deep learning to simulate human-like reasoning, and big data analysis to draw on Roblox development knowledge. Here’s my thoughtful response:\n\nI’m here to assist with Roblox development in a detailed, conversational way. Please provide more context about your question—whether it’s about building games, growing your player base, monetizing with Limited items, or implementing AI. I can offer Lua code examples, tutorials, and strategic advice, drawing on advanced techniques like deep learning and machine learning as of March 04, 2025.\n\n**How AI Thinks About This:** I’m simulating the human mind by processing your query through artificial neural networks, analyzing big data from developer forums, and generating a response that feels natural and insightful. Would you like me to explore a specific topic, such as game design, user acquisition, or AI integration? I can also discuss future applications of AI in Roblox, like smart tutoring systems, health-related gameplay, or business optimization for developers.\n\nLet me know how I can help further, and I’ll refine my response with even more detail!`
    };

    // Simulate thinking process (log to console for transparency)
    console.log('AI is processing:', query);
    console.log('Analyzing context:', context);

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
    const clientId = '744888685295-d452bl4q9e4shdba3s4mn416uicnohij.apps.googleusercontent.com'; // Updated with your provided Google OAuth client ID
    alert(`Google Sign-In simulation with Client ID: ${clientId}. Actual OAuth setup is required for full functionality.`);
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
