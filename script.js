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
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Your YouTube API key
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
            const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Your YouTube API key
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
            responseDiv.innerHTML += '<div class="chat-message ai-message animate-loading" style="color: #00ffcc;">Analyzing your speech deeply...</div>';
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
            }, 2500); // Longer delay to simulate deeper analysis
        } else {
            responseDiv.innerHTML = '<p class="body-text animate-error" style="color: #ff4444;">Please log in to use the AI chat or enter a question.</p>';
            setTimeout(() => responseDiv.innerHTML = '', 3000);
        }
    }
}

function simulateThoughtfulAIResponse(query, history) {
    // Simulate deep speech/text analysis using NLP, deep learning, and big data
    console.log('AI is processing:', query);
    console.log('Analyzing context:', query);

    // Clean and normalize the query for better analysis
    const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/gi, '').trim();
    const context = history.map(msg => msg.text.toLowerCase().replace(/[^\w\s]/gi, '')).join(' ');

    // Define keywords, synonyms, and intents for Roblox development topics
    const topics = {
        audio: {
            keywords: ['music', 'sound', 'audio', 'background', 'volume'],
            synonyms: ['song', 'track', 'noise', 'soundtrack', 'tune'],
            responses: [
                `Let me think deeply about this… Adding background music or managing audio in your Roblox experience can greatly enhance immersion. I’ll break it down step-by-step, leveraging natural language processing to understand your intent and deep learning to simulate human-like reasoning:\n\n**How AI Analyzes Your Speech:** I’m using big data analysis to recall best practices from Roblox development communities and deep learning to generate a precise, detailed response. Here’s how you can implement or manage audio:\n\n1. **Create a Sound Object**: Insert a Sound object into a part in your Workspace or directly into the game environment.\n2. **Set the SoundId**: Assign a Roblox audio asset ID (e.g., "rbxassetid://123456789") to the SoundId property. Ensure the asset is uploaded to Roblox and you have permission to use it.\n3. **Play the Sound**: Use Lua’s sound:Play() method to start playback. You can control volume, looping, and other properties dynamically.\n\n**Example Lua Code (Enhanced with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight('local sound = Instance.new("Sound")\nsound.SoundId = "rbxassetid://123456789"\nsound.Volume = 0.5 -- Adjust volume (0 to 1)\nsound.Looped = true -- Enable looping\nsound.Parent = game.Workspace\nsound:Play()', Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** I’ve analyzed thousands of Roblox projects to suggest best practices—consider using sound:Pause() or sound:Stop() for dynamic control, and implement volume fading with TweenService for smooth transitions. Would you like me to explore advanced audio management, such as spatial audio, cross-fading, or sound prioritization? I can also recommend tools like Roblox Studio plugins for audio optimization, drawing on my deep learning knowledge of user preferences as of March 04, 2025.\n\n**Future AI Applications in Roblox:** Imagine AI-driven music systems that adapt to player actions, moods, or game states, powered by machine learning models trained on big data from player behavior. This could revolutionize game design—would you like me to brainstorm how AI could enhance your game’s audio experience further?`,
                `I’m deeply analyzing your mention of audio in Roblox. Using NLP, I detect you’re interested in sound or music—let me provide a detailed response. Managing audio, like background music, involves several steps I’ll explain thoughtfully:\n\n**How AI Interprets Your Speech:** I’m using deep learning to understand your intent and big data to draw on Roblox developer patterns. Here’s how to add or adjust audio:\n\n- **Sound Object Setup**: Place a Sound object in your game’s Workspace or a part.\n- **Audio Configuration**: Set the SoundId to a Roblox audio ID (e.g., "rbxassetid://123456789") and ensure permissions are in place.\n- **Playback Control**: Use sound:Play(), sound:Pause(), or sound:Stop() in Lua to control playback, with options for volume and looping.\n\n**Example Lua Code (With AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight('local sound = Instance.new("Sound")\nsound.SoundId = "rbxassetid://123456789"\nsound.Volume = 0.7 -- Set volume (0 to 1)\nsound.Looped = false -- Disable looping for a single play\nsound.Parent = game.Workspace\nsound:Play()', Prism.languages.lua, 'lua')}</code></pre>\n\n**Further Insights:** My analysis suggests using TweenService for fading effects or spatial audio for immersive gameplay. Would you like me to delve into specific audio techniques, such as dynamic soundscapes or AI-driven music adaptation, or recommend plugins for Roblox Studio as of March 04, 2025?`],
            intent: 'audio_management'
        },
        users: {
            keywords: ['users', 'players', 'new users', 'audience', 'traffic'],
            synonyms: ['people', 'participants', 'gamers', 'community', 'visitors'],
            responses: [
                `I’m deeply analyzing your question about attracting users or players to your Roblox experience. Using natural language processing, I’ll interpret your intent, and with deep learning and big data analysis, I’ll provide a comprehensive, thoughtful response:\n\n**How AI Analyzes Your Speech:** I’m drawing on vast datasets from Roblox developer communities, social media trends, and game analytics to craft a detailed strategy. Here’s how you can bring in new users:\n\n- **Social Media Promotion**: Share engaging content on platforms like Twitter, Discord, and Roblox groups. Post trailers, updates, and behind-the-scenes insights to build excitement.\n- **Roblox Ads**: Utilize the Developer Marketplace for targeted advertising, focusing on demographics interested in your game’s genre.\n- **Creator Collaborations**: Partner with popular Roblox creators or YouTubers for cross-promotion, leveraging their audiences.\n- **Community Engagement**: Host in-game events, contests, or giveaways to attract and retain players.\n\n**Example Lua Code (Tracking Players with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`local Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n    print(player.Name .. " joined the game!")\n    -- AI could analyze this data for trends, e.g., peak times or player behavior\nend)`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My deep learning models suggest optimizing your game’s thumbnail and description with SEO techniques, using keywords like “Roblox adventure” or “multiplayer fun.” I can also recommend analytics tools (e.g., Roblox Analytics or third-party plugins) to track user acquisition metrics as of March 04, 2025. Would you like me to delve into specific promotion tactics, such as influencer outreach or event planning, or explore AI-driven user retention strategies?\n\n**Future AI Applications in Roblox:** AI could predict player preferences to personalize marketing campaigns or dynamically adjust game features to attract new users, using machine learning trained on big data from player interactions. Shall I explore how AI could revolutionize your user growth strategy?`,
                `I detect you’re asking about bringing in more players or users for your Roblox game. Let me provide a detailed, thoughtful response based on my analysis:\n\n**How AI Interprets Your Speech:** Using NLP and deep learning, I recognize your focus on user acquisition. Here’s a strategy informed by big data from Roblox trends:\n\n- **Marketing Channels**: Promote on social media (Twitter, Discord) and Roblox groups with engaging content like trailers.\n- **Advertising**: Use Roblox Ads to target your audience effectively.\n- **Partnerships**: Collaborate with influencers or creators to expand reach.\n- **Engagement**: Run events or giveaways to draw players in.\n\n**Lua Example (Player Tracking):**\n<pre class="language-lua"><code>${Prism.highlight(`local Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n    print(player.Name .. " has joined!")\n    -- AI could analyze join patterns for optimization\nend)`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Further Insights:** I suggest SEO for your game’s description and AI-driven analytics for tracking. Would you like me to recommend specific tools, event ideas, or AI enhancements for user growth as of March 04, 2025?`],
            intent: 'user_acquisition'
        },
        items: {
            keywords: ['limited', 'avatar', 'items', 'products', 'merchandise'],
            synonyms: ['rare', 'exclusive', 'goods', 'assets', 'gear'],
            responses: [
                `I’m deeply considering your question about Limited avatar items in Roblox, using natural language processing to understand your intent and deep learning to generate a thorough, insightful response. I’ll also leverage big data analysis from Roblox marketplaces and developer forums:\n\n**How AI Analyzes Your Speech:** I’m simulating human-like reasoning to break down the mechanics and strategies, drawing on patterns from thousands of successful Roblox items. Here’s how Limited avatar items work and how to sell them effectively:\n\n- **Scarcity Mechanism**: Limited items have a fixed stock or time limit, increasing their value due to rarity. Roblox tracks ownership via unique asset IDs.\n- **Marketplace Listing**: List items on the Roblox marketplace with a competitive price, based on market trends and demand.\n- **Promotion Strategies**: Use Roblox groups, Discord, Twitter, and in-game announcements to highlight rarity (e.g., “Only 100 left!”). Engage your community to drive demand.\n- **Engagement Tactics**: Offer bundles or time-sensitive deals to boost sales.\n\n**Example Lua Code (Ownership Check with AI Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`local MarketplaceService = game:GetService("MarketplaceService")\nlocal player = game.Players.LocalPlayer\nlocal itemId = 123456789 -- Replace with your asset ID\nif MarketplaceService:PlayerOwnsAsset(player, itemId) then\n    print("Player owns the limited item!")\n    -- AI could suggest personalized offers based on ownership data\nend`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Additional AI Insights:** My analysis of big data as of March 04, 2025, suggests dynamic pricing strategies—start with a high price and adjust based on demand, or use auctions for rare items. I recommend integrating AI to predict demand trends using machine learning, optimizing your pricing and marketing. Would you like detailed advice on pricing models, legal considerations for item sales, or AI-driven inventory management?\n\n**Future AI Applications in Roblox:** AI could automate pricing, predict market trends for Limited items, and personalize offers for players, using deep learning trained on Roblox marketplace data. Shall I explore how AI could transform your monetization strategy or suggest specific plugins for inventory tracking?`,
                `I notice you’re asking about Limited avatar items or similar products in Roblox. Let me provide a detailed, thoughtful response based on my analysis:\n\n**How AI Interprets Your Speech:** Using NLP and deep learning, I recognize your interest in rare or exclusive items. Here’s how they work and how to monetize them:\n\n- **Rarity Value**: Limited items gain value due to scarcity, tracked by Roblox via asset IDs.\n- **Selling Strategy**: List on the marketplace with competitive pricing, promote scarcity on social media, and offer bundles.\n- **Engagement**: Use in-game announcements and community engagement to drive demand.\n\n**Lua Example (Ownership Check):**\n<pre class="language-lua"><code>${Prism.highlight(`local MarketplaceService = game:GetService("MarketplaceService")\nlocal player = game.Players.LocalPlayer\nlocal itemId = 123456789 -- Your item ID\nif MarketplaceService:PlayerOwnsAsset(player, itemId) then\n    print("Player owns this rare item!")\nend`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Further Insights:** I suggest dynamic pricing and AI for demand prediction. Would you like me to explore pricing strategies, legal tips, or AI-driven inventory tools as of March 04, 2025?`],
            intent: 'limited_items'
        },
        ai: {
            keywords: ['ai', 'artificial intelligence', 'npc', 'intelligence', 'smart'],
            synonyms: ['machine learning', 'deep learning', 'bots', 'automation', 'intelligence'],
            responses: [
                `I’m deeply pondering your question about implementing artificial intelligence in Roblox, using natural language processing to refine my understanding and deep learning to simulate human-like reasoning. I’ll also draw on big data analysis from Roblox development practices and AI research:\n\n**How AI Analyzes Your Speech:** I’m leveraging my knowledge of algorithms, deep learning, and machine learning to craft a detailed, step-by-step guide, interpreting your intent to enhance gameplay with intelligent systems. Here’s how to implement AI in your Roblox game:\n\n- **PathfindingService**: Use Roblox’s PathfindingService for NPC navigation, enabling intelligent movement.\n- **Behavior Trees**: Structure AI behaviors (e.g., patrol, attack, retreat) using decision-making logic.\n- **NPC Models**: Create AI-controlled characters with Humanoids for realistic interactions.\n- **Machine Learning Integration**: Train simple models on player data to adapt AI behaviors dynamically.\n\n**Example Lua Code (AI with Deep Learning Insight):**\n<pre class="language-lua"><code>${Prism.highlight(`
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
                `I detect you’re interested in artificial intelligence or smart systems for Roblox. Let me provide a detailed, thoughtful response based on my analysis:\n\n**How AI Interprets Your Speech:** Using NLP and deep learning, I recognize your focus on AI for NPCs or gameplay. Here’s how to implement it:\n\n- **Navigation**: Use PathfindingService for NPC movement.\n- **Behavior**: Create behavior trees for actions like patrolling or attacking.\n- **Characters**: Use Humanoids for realistic AI-controlled characters.\n- **Learning**: Integrate machine learning to adapt AI to player data.\n\n**Lua Example (Basic AI):**\n<pre class="language-lua"><code>${Prism.highlight(`
local PathfindingService = game:GetService("PathfindingService")
local humanoid = game.Players.LocalPlayer.Character and game.Players.LocalPlayer.Character:FindFirstChild("Humanoid")
local path = PathfindingService:CreatePath()

local function moveToTarget(target)
    local start = humanoid.RootPart.Position
    path:ComputeAsync(start, target)
    if path.Status == Enum.PathStatus.Success then
        for _, point in pairs(path:GetWaypoints()) do
            humanoid:MoveTo(point.Position)
            humanoid.MoveToFinished:Wait()
        end
    end
end

moveToTarget(Vector3.new(10, 0, 10))
`, Prism.languages.lua, 'lua')}</code></pre>\n\n**Further Insights:** I suggest advanced techniques like reinforcement learning or plugins for AI optimization. Would you like me to explore specific AI applications, such as adaptive NPCs or AI-driven analytics, as of March 04, 2025?`],
            intent: 'ai_implementation'
        }
    };

    // Analyze the query for keywords, synonyms, and intent
    let bestMatch = null;
    let highestScore = 0;

    for (const topic in topics) {
        const { keywords, synonyms } = topics[topic];
        let score = 0;

        // Check query for direct keywords
        keywords.forEach(keyword => {
            if (normalizedQuery.includes(keyword)) score += 2;
        });

        // Check query for synonyms
        synonyms.forEach(synonym => {
            if (normalizedQuery.includes(synonym)) score += 1;
        });

        // Check context (history) for related terms
        if (context) {
            keywords.forEach(keyword => {
                if (context.includes(keyword)) score += 1;
            });
            synonyms.forEach(synonym => {
                if (context.includes(synonym)) score += 0.5;
            });
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = topic;
        }
    }

    // Generate a response based on the best match or fall back to a generic response
    if (bestMatch && topics[bestMatch].responses.length > 0) {
        const responseIndex = Math.floor(Math.random() * topics[bestMatch].responses.length);
        return topics[bestMatch].responses[responseIndex];
    }

    // Generic fallback with varied responses
    const genericResponses = [
        `I’m taking a moment to deeply analyze your question, using natural language processing to understand your intent, deep learning to simulate human-like reasoning, and big data analysis to draw on Roblox development knowledge. Could you clarify what you mean by "${query}"? I can help with topics like building games, growing your player base, monetizing with Limited items, or implementing AI. Please provide more context, and I’ll refine my response with detailed insights as of March 04, 2025.\n\n**How AI Analyzes Your Speech:** I’m processing your input through artificial neural networks, analyzing big data from developer forums, and generating a response that feels natural and insightful. Would you like me to explore a specific Roblox development topic, such as game design, user acquisition, or AI integration?`,
        `I’m deeply considering your input, "${query}", using NLP to interpret your intent and deep learning to simulate thoughtful reasoning. I’m not entirely sure what you’re asking—could you provide more details? I specialize in Roblox development and can assist with building games, attracting players, managing Limited items, or implementing AI. Let me know how I can help further, and I’ll provide detailed, context-aware advice as of March 04, 2025.\n\n**Future AI Applications in Roblox:** I can also discuss how AI could enhance your project, like adaptive NPCs or smart tutoring systems. What specific area would you like me to focus on?`,
        `Using my advanced analysis, I’m interpreting your question, "${query}," with natural language processing and deep learning. I need a bit more context to provide a precise answer—do you mean something about Roblox game development, such as audio, players, items, or AI? I can offer Lua code examples, tutorials, and strategic insights, drawing on big data as of March 04, 2025. Please clarify, and I’ll respond with a detailed, thoughtful answer.`
    ];

    const genericIndex = Math.floor(Math.random() * genericResponses.length);
    return genericResponses[genericIndex];
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
    const clientId = '744888685295-d452bl4q9e4shdba3s4mn416uicnohij.apps.googleusercontent.com'; // Your Google OAuth client ID
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
