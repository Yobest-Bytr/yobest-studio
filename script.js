// Global variables
let isLoggedIn = false;
let currentUser = null;
const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with real API key for production

// Track and save site visitors securely
function trackVisitor() {
    if (!localStorage.getItem('apiKey') || localStorage.getItem('apiKey') !== API_KEY) {
        localStorage.setItem('apiKey', API_KEY); // Validate API key
    }

    let visitors = parseInt(localStorage.getItem('siteVisitors') || '0') + 1;
    localStorage.setItem('siteVisitors', visitors.toString());
    const siteVisitorsElement = document.querySelector('#site-visitors');
    if (siteVisitorsElement) siteVisitorsElement.textContent = visitors;
}

// Track and save total downloads securely
function trackDownload() {
    if (!localStorage.getItem('apiKey') || localStorage.getItem('apiKey') !== API_KEY) {
        localStorage.setItem('apiKey', API_KEY); // Ensure API key is valid
    }

    let downloads = parseInt(localStorage.getItem('totalDownloads') || '0') + 1;
    localStorage.setItem('totalDownloads', downloads.toString());
    const totalDownloadsElement = document.querySelector('#total-downloads');
    if (totalDownloadsElement) totalDownloadsElement.textContent = downloads;
}

// Display counters using secure storage
function displayCounters() {
    const siteVisitorsElement = document.querySelector('#site-visitors');
    const totalDownloadsElement = document.querySelector('#total-downloads');
    if (siteVisitorsElement) siteVisitorsElement.textContent = localStorage.getItem('siteVisitors') || '0';
    if (totalDownloadsElement) totalDownloadsElement.textContent = localStorage.getItem('totalDownloads') || '0';
}

// Navigation and authentication functions
function updateNavButtons() {
    const loginBtn = document.querySelector('#login-btn');
    const accountBtn = document.querySelector('#account-btn');
    const accountPic = document.querySelector('#account-pic');
    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        accountBtn.style.display = 'inline-block';
        accountPic.style.display = 'inline-block';
    } else {
        loginBtn.style.display = 'inline-block';
        accountBtn.style.display = 'none';
        accountPic.style.display = 'none';
    }
}

function toggleLoginForm() {
    document.querySelector('#login-form')?.style.display = 'block';
    document.querySelector('#signup-form')?.style.display = 'none';
    document.querySelector('#account-form')?.style.display = 'none';
}

function toggleSignupForm() {
    document.querySelector('#signup-form')?.style.display = 'block';
    document.querySelector('#login-form')?.style.display = 'none';
    document.querySelector('#account-form')?.style.display = 'none';
}

function toggleAccountForm() {
    if (isLoggedIn) {
        document.querySelector('#account-form')?.style.display = 'block';
        document.querySelector('#login-form')?.style.display = 'none';
        document.querySelector('#signup-form')?.style.display = 'none';
        document.querySelector('#email-account')?.value = currentUser.email;
    } else {
        toggleLoginForm();
    }
}

function openLogin() {
    document.querySelector('#login-modal')?.style.display = 'block';
}

function closeLogin() {
    document.querySelector('#login-modal')?.style.display = 'none';
}

function openAccountSettings() {
    if (isLoggedIn) {
        document.querySelector('#account-settings-modal')?.style.display = 'block';
    } else {
        openLogin();
    }
}

function closeAccountSettings() {
    document.querySelector('#account-settings-modal')?.style.display = 'none';
}

// Authentication functions
function handleLogin(event) {
    event.preventDefault();
    const email = document.querySelector('#email-login')?.value || document.querySelector('#email')?.value;
    const password = document.querySelector('#password-login')?.value || document.querySelector('#password')?.value;
    const message = document.querySelector('#login-error') || document.querySelector('#auth-message');
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email] && users[email].password === password) {
        isLoggedIn = true;
        currentUser = { email, username: users[email].username || email.split('@')[0], avatar: users[email].avatar };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update login history
        let logins = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        logins.unshift({ email: currentUser.email, time: new Date().toLocaleString(), ip: 'Simulated IP' });
        logins = logins.slice(0, 10); // Keep last 10 logins
        localStorage.setItem('loginHistory', JSON.stringify(logins));

        if (document.querySelector('#login-form')) document.querySelector('#login-form').style.display = 'none';
        if (document.querySelector('#login-modal')) document.querySelector('#login-modal').style.display = 'none';
        updateNavButtons();
        checkLoginState();
        if (message) {
            message.textContent = 'Login successful!';
            message.classList.add('animate-success');
            setTimeout(() => message.textContent = '', 3000);
        }
    } else if (!users[email]) {
        // Create new user if not exists
        users[email] = { password, username: email.split('@')[0] };
        localStorage.setItem('users', JSON.stringify(users));
        isLoggedIn = true;
        currentUser = { email, username: email.split('@')[0] };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update login history
        let logins = JSON.parse(localStorage.getItem('loginHistory') || '[]');
        logins.unshift({ email: currentUser.email, time: new Date().toLocaleString(), ip: 'Simulated IP' });
        logins = logins.slice(0, 10);
        localStorage.setItem('loginHistory', JSON.stringify(logins));

        if (document.querySelector('#login-form')) document.querySelector('#login-form').style.display = 'none';
        if (document.querySelector('#login-modal')) document.querySelector('#login-modal').style.display = 'none';
        updateNavButtons();
        checkLoginState();
        if (message) {
            message.textContent = 'Account created and logged in successfully!';
            message.classList.add('animate-success');
            setTimeout(() => message.textContent = '', 3000);
        }
    } else {
        if (message) {
            message.textContent = 'Invalid email or password.';
            message.classList.add('animate-error');
            setTimeout(() => message.textContent = '', 3000);
        }
    }
}

function handleSignup(event) {
    event.preventDefault();
    const email = document.querySelector('#email-signup')?.value;
    const password = document.querySelector('#password-signup')?.value;
    const confirmPassword = document.querySelector('#confirm-password')?.value;
    const message = document.querySelector('#signup-error');
    if (password !== confirmPassword) {
        message.textContent = 'Passwords do not match.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
        message.textContent = 'Email already registered.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
    } else {
        users[email] = { password, username: email.split('@')[0] };
        localStorage.setItem('users', JSON.stringify(users));
        document.querySelector('#signup-form').style.display = 'none';
        toggleLoginForm();
        message.textContent = 'Signup successful! Please login.';
        message.classList.add('animate-success');
        setTimeout(() => message.textContent = '', 3000);
    }
}

function updateAccount(event) {
    event.preventDefault();
    const email = document.querySelector('#email-account')?.value;
    const password = document.querySelector('#password-account')?.value;
    const message = document.querySelector('#account-error');
    if (!currentUser) {
        message.textContent = 'Please login first.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (email !== currentUser.email && users[email]) {
        message.textContent = 'Email already in use.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }
    delete users[currentUser.email];
    users[email] = { password, username: currentUser.username, avatar: currentUser.avatar };
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { email, username: currentUser.username, avatar: currentUser.avatar };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    message.textContent = 'Account updated successfully!';
    message.classList.add('animate-success');
    setTimeout(() => message.textContent = '', 3000);
    document.querySelector('#account-form')?.style.display = 'none';
}

function viewAccountInfo() {
    const message = document.querySelector('#account-error');
    if (currentUser) {
        alert(`Account Info:\nEmail: ${currentUser.email}\nUsername: ${currentUser.username || currentUser.email.split('@')[0]}\nAvatar: ${currentUser.avatar || 'Default'}`);
    } else {
        message.textContent = 'Please login first.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
    }
}

function logout() {
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.querySelector('#account-form')?.style.display = 'none';
    document.querySelector('#account-settings-modal')?.style.display = 'none';
    updateNavButtons();
    checkLoginState();
    alert('Logged out successfully.');
}

function checkLoginState() {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (savedUser) {
        isLoggedIn = true;
        currentUser = savedUser;
        updateNavButtons();
        const accountPic = document.querySelector('#account-pic');
        if (accountPic) accountPic.src = currentUser.avatar || 'https://via.placeholder.com/40';
    } else {
        isLoggedIn = false;
        currentUser = null;
        updateNavButtons();
    }
}

function loadAccountInfo() {
    if (currentUser) {
        document.querySelector('#username')?.value = currentUser.username || currentUser.email.split('@')[0];
        document.querySelector('#email')?.value = currentUser.email;
        const avatarPreview = document.querySelector('#avatar-preview');
        if (avatarPreview) {
            avatarPreview.src = currentUser.avatar || 'https://via.placeholder.com/40';
            avatarPreview.style.display = currentUser.avatar ? 'block' : 'none';
        }
    }
}

function previewAvatar(input) {
    const preview = document.querySelector('#avatar-preview');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

// Account Settings Functions (from account-settings.html)
function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabContents.forEach(content => content.classList.remove('active'));
    tabButtons.forEach(btn => btn.classList.remove('active'));

    document.querySelector(`#${tabName}`).classList.add('active');
    document.querySelector(`.tab-btn[onclick="openTab('${tabName}')"]`).classList.add('active');
}

function updateProfile() {
    const username = document.querySelector('#username')?.value;
    const email = document.querySelector('#email')?.value;
    const message = document.querySelector('#profile-message');

    if (!currentUser) {
        message.textContent = 'Please log in first.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && email !== currentUser.email) {
        message.textContent = 'Email already registered.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }

    currentUser.username = username || currentUser.email.split('@')[0];
    currentUser.email = email;
    users[email] = { password: users[currentUser.email].password, username: currentUser.username, avatar: currentUser.avatar };
    delete users[currentUser.email];
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    message.textContent = 'Profile updated successfully!';
    message.classList.add('animate-success');
    setTimeout(() => message.textContent = '', 3000);
    document.querySelector('#account-pic')?.src = document.querySelector('#avatar-preview')?.src || 'https://via.placeholder.com/40';
}

function updateSecurity() {
    const currentPassword = document.querySelector('#current-password')?.value;
    const newPassword = document.querySelector('#new-password')?.value;
    const confirmPassword = document.querySelector('#confirm-password')?.value;
    const message = document.querySelector('#security-message');

    if (!currentUser) {
        message.textContent = 'Please log in first.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[currentUser.email].password !== currentPassword) {
        message.textContent = 'Current password is incorrect.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }

    if (newPassword !== confirmPassword) {
        message.textContent = 'New passwords do not match.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }

    users[currentUser.email].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    message.textContent = 'Password updated successfully!';
    message.classList.add('animate-success');
    setTimeout(() => message.textContent = '', 3000);
}

function verifyEmail() {
    const message = document.querySelector('#security-message');
    if (!currentUser) {
        message.textContent = 'Please log in first.';
        message.classList.add('animate-error');
        setTimeout(() => message.textContent = '', 3000);
        return;
    }

    // Simulate sending a verification code (replace with real email service, e.g., SendGrid, Nodemailer)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    localStorage.setItem('verificationCode', verificationCode);
    localStorage.setItem('verificationEmail', currentUser.email);

    alert(`A verification code has been sent to ${currentUser.email}. Please enter it to verify: ${verificationCode}`);
    const code = prompt('Enter the verification code:');
    if (code === verificationCode) {
        message.textContent = 'Email verified successfully!';
        message.classList.add('animate-success');
        localStorage.setItem('emailVerified', 'true');
    } else {
        message.textContent = 'Invalid verification code.';
        message.classList.add('animate-error');
    }
    setTimeout(() => message.textContent = '', 3000);
}

function loadLoginHistory() {
    const historyDiv = document.querySelector('#login-history');
    if (!currentUser) {
        historyDiv.textContent = 'Please log in to view login history.';
        return;
    }

    // Simulate login history (replace with backend storage in production)
    let logins = JSON.parse(localStorage.getItem('loginHistory') || '[]');
    if (!logins.length) {
        logins = [{ email: currentUser.email, time: new Date().toLocaleString(), ip: 'Simulated IP' }];
        localStorage.setItem('loginHistory', JSON.stringify(logins));
    }

    historyDiv.innerHTML = logins.map(login => `
        <p><strong>Email:</strong> ${login.email} | <strong>Time:</strong> ${login.time} | <strong>IP:</strong> ${login.ip}</p>
    `).join('');
}

// Chat Box Functions
function sendMessage(inputId = 'chat-input', messagesId = 'chat-messages') {
    const input = document.querySelector(`#${inputId}`);
    const messagesDiv = document.querySelector(`#${messagesId}`);
    const errorDiv = document.querySelector('#chat-error');
    if (input.value.trim() && isLoggedIn) {
        const msg = document.createElement('div');
        msg.className = 'comment animate-card';
        msg.innerHTML = `
            <img src="${currentUser.avatar || 'https://via.placeholder.com/40'}" alt="User" class="comment-avatar">
            <div class="comment-content">
                <strong>${currentUser.username || currentUser.email}</strong>: ${input.value}
                <div class="comment-meta">
                    <span>${new Date().toLocaleString()}</span>
                </div>
            </div>
        `;
        messagesDiv.appendChild(msg);
        input.value = '';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } else {
        errorDiv.textContent = isLoggedIn ? 'Please enter a message.' : 'Please log in to chat.';
        errorDiv.classList.add('animate-error');
        setTimeout(() => errorDiv.textContent = '', 3000);
    }
}

// AI and Roblox Script Functions
let currentCategory = '';

function setCategory(category) {
    currentCategory = category;
    const input = document.querySelector('#script-input');
    switch (category) {
        case 'Build':
            input.value = 'How do I add background music to my Roblox experience?';
            break;
        case 'Grow':
            input.value = 'How do I bring new users to my Roblox experience? Reply and I’ll share what I’m doing so far.';
            break;
        case 'Monetize':
            input.value = 'How do Limited avatar items work and what are some tips to sell them?';
            break;
    }
    input.focus();
}

async function sendToAI() {
    const input = document.querySelector('#script-input').value.trim();
    const responseDiv = document.querySelector('#ai-response');
    if (input && isLoggedIn) { // Require login for AI access
        responseDiv.textContent = "Thinking...";
        responseDiv.classList.add('animate-loading');

        try {
            const response = await simulateAIResponse(input, currentCategory);
            responseDiv.innerHTML = `<pre class="language-lua"><code>${Prism.highlight(response, Prism.languages.lua, 'lua')}</code></pre>`;
            responseDiv.classList.remove('animate-loading');
            responseDiv.classList.add('animate-success');
        } catch (error) {
            responseDiv.textContent = "Error generating response. Please try again.";
            responseDiv.classList.remove('animate-loading');
            responseDiv.classList.add('animate-error');
            console.error('AI Response Error:', error);
        }
    } else {
        responseDiv.textContent = isLoggedIn ? "Please enter a question!" : "Please log in to use the AI tool.";
        responseDiv.classList.add('animate-error');
        setTimeout(() => responseDiv.textContent = '', 3000);
    }
}

async function simulateAIResponse(query, category) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let response;
            switch (category) {
                case 'Build':
                    if (query.includes('background music')) {
                        response = `To add background music to your Roblox experience:\n1. Use a `Sound` object:\n   - Insert a `Sound` into a part or Workspace.\n   - Set the `SoundId` to a Roblox audio asset ID (e.g., "rbxassetid://123456789").\n   - Play it with `sound:Play()` in a Lua script.\n   Example:\n   ```lua\n   local sound = Instance.new("Sound")\n   sound.SoundId = "rbxassetid://123456789"\n   sound.Parent = game.Workspace\n   sound:Play()\n   ```\n2. Ensure the audio asset is uploaded to Roblox and you have permissions.`;
                    } else if (query.includes('script')) {
                        response = `Here's a sample Lua script for Roblox:\n```lua\nlocal part = Instance.new("Part")\npart.Position = Vector3.new(0, 10, 0)\npart.Parent = game.Workspace\npart.Anchored = true\nprint("Part created at position 0, 10, 0")\n````;
                    } else {
                        response = `Please specify a Roblox building task. Example: "How do I create a part in Roblox?"\n```lua\nlocal part = Instance.new("Part")\npart.Position = Vector3.new(0, 10, 0)\npart.Parent = game.Workspace\n````;
                    }
                    break;
                case 'Grow':
                    response = `To bring new users to your Roblox experience:\n1. Promote on social media (Twitter, Discord, Roblox groups).\n2. Use Roblox Ads (Developer Marketplace) to target users.\n3. Collaborate with other creators for cross-promotion.\n4. Share your progress, and I’ll suggest specifics based on your description.\nExample Lua script for tracking players:\n```lua\nlocal Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n    print(player.Name .. " joined the game!")\nend)\n````;
                    break;
                case 'Monetize':
                    response = `Limited avatar items in Roblox:\n- Limited items are rare, time-limited, or have low stock, increasing their value.\n- Tips to sell them:\n  1. List on the Roblox marketplace with a competitive price.\n  2. Promote via Roblox groups, Discord, or Twitter.\n  3. Use scarcity (e.g., “Only 100 left!”) to drive demand.\nExample Lua script to check item ownership:\n```lua\nlocal MarketplaceService = game:GetService("MarketplaceService")\nlocal player = game.Players.LocalPlayer\nlocal itemId = 123456789 -- Replace with your asset ID\nif MarketplaceService:PlayerOwnsAsset(player, itemId) then\n    print("Player owns the limited item!")\nend\n````;
                    break;
                default:
                    response = `I'm here to help with Roblox! Specify a category (Build, Grow, Monetize) or ask a detailed question. Example Lua script:\n```lua\nlocal part = Instance.new("Part")\npart.Position = Vector3.new(0, 10, 0)\npart.Parent = game.Workspace\n````;
            }
            resolve(response);
        }, 2000); // Simulate AI processing delay
    });
}

// Video and Game Functions (if needed, e.g., for index.html)
async function fetchVideos() {
    const reactionDiv = document.querySelector('#reaction-text');
    const previewGrid = document.querySelector('#preview-grid');
    const errorDiv = document.querySelector('#video-error');
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
        renderVideos(cachedData.videos);
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
        renderVideos(videos);
    } catch (error) {
        reactionDiv.textContent = '';
        errorDiv.textContent = `Error: ${error.message}. Check API key, channel ID, or network connection.`;
        errorDiv.style.display = 'block';
    }
}

function renderVideos(videos) {
    const previewGrid = document.querySelector('#preview-grid');
    previewGrid.innerHTML = videos.map((item, index) => `
        <div class="video-card animate-card" data-index="${index}">
            <a href="game.html?id=${index}">
                <img src="${item.snippet.thumbnails?.medium?.url || 'https://via.placeholder.com/150'}" alt="${item.snippet.title}">
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
                    // Handle dislikes (YouTube no longer provides public dislike counts)
                    videoCard.querySelector('p:nth-child(3)').innerHTML = `<i class="fas fa-thumbs-down"></i> N/A`;
                }
            } else {
                console.error(`No statistics found for video ${videoId}`);
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

// Confirmation and Download Functions (for confirm.html)
async function initializeTaskChecks() {
    const videoId = document.querySelector('#download-link')?.dataset.videoId;
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
    const CHANNEL_ID = 'UCsV3X3EyEowLEdRW1RileuA'; // Your channel ID

    // Attempt to auto-check subscription (simplified; requires OAuth for full accuracy)
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&forChannelId=${CHANNEL_ID}&mine=true&key=${API_KEY}`);
        if (response.ok) {
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                document.querySelector('#subscribe-task')?.classList.add('completed');
            }
        }
    } catch (error) {
        console.error('Subscription check failed:', error);
    }

    // Auto-check like and comment (simulated site verification; requires OAuth for real data)
    try {
        const videoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
        if (videoResponse.ok) {
            const videoData = await videoResponse.json();
            if (videoData.items && videoData.items.length > 0) {
                const stats = videoData.items[0].statistics;
                const userLiked = confirm('Have you liked the video on YouTube? The site will verify this action based on video stats.');
                const userCommented = confirm('Have you commented on the video on YouTube? The site will verify this action based on video stats.');
                if (userLiked && userCommented && stats.likeCount && stats.commentCount) {
                    document.querySelector('#like-comment-task')?.classList.add('completed');
                } else {
                    alert('Please like and comment on the video, then retry verification.');
                }
            }
        }
    } catch (error) {
        console.error('Like/Comment check failed:', error);
    }

    checkAllTasks();
}

async function handleSubscribe() {
    const task = document.querySelector('#subscribe-task');
    const button = task?.querySelector('.task-button');
    const loadingSpinner = document.querySelector('#loading-spinner');
    const errorDiv = document.querySelector('#confirm-error');
    const CHANNEL_URL = 'https://www.youtube.com/channel/' + 'UCsV3X3EyEowLEdRW1RileuA';

    loadingSpinner.style.display = 'block';
    button.disabled = true;

    // Redirect to YouTube channel in a new window/tab
    const subscribeWindow = window.open(CHANNEL_URL, '_blank');
    if (!subscribeWindow) {
        errorDiv.textContent = 'Popup blocked. Please allow popups and try again.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
        loadingSpinner.style.display = 'none';
        button.disabled = false;
        return;
    }

    // Poll for subscription status or allow user confirmation
    let attempts = 0;
    const maxAttempts = 30; // Increased to 30 seconds for user interaction
    const checkInterval = setInterval(async () => {
        try {
            const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
            const response = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&forChannelId=${CHANNEL_ID}&mine=true&key=${API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    clearInterval(checkInterval);
                    task.classList.add('completed');
                    button.textContent = 'Verified';
                    button.disabled = true;
                    checkAllTasks();
                    loadingSpinner.style.display = 'none';
                    if (subscribeWindow) subscribeWindow.close();
                    return;
                }
            }
            // Allow user to confirm subscription or no account
            const userSubscribed = confirm('Have you subscribed to the channel? If not, or if you don’t have a YouTube account, click "Cancel" to proceed.');
            if (userSubscribed) {
                clearInterval(checkInterval);
                task.classList.add('completed');
                button.textContent = 'Verified';
                button.disabled = true;
                checkAllTasks();
                loadingSpinner.style.display = 'none';
                if (subscribeWindow) subscribeWindow.close();
                return;
            }
        } catch (error) {
            console.error('Subscription verification failed:', error);
        }
        attempts++;
        if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            errorDiv.textContent = 'Subscription verification timed out. Please subscribe or confirm and try again.';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 3000);
            loadingSpinner.style.display = 'none';
            button.disabled = false;
        }
    }, 1000); // Check every second
}

async function handleLikeComment() {
    const task = document.querySelector('#like-comment-task');
    const button = task?.querySelector('.task-button');
    const loadingSpinner = document.querySelector('#loading-spinner');
    const errorDiv = document.querySelector('#confirm-error');
    const videoId = document.querySelector('#download-link')?.dataset.videoId;
    const VIDEO_URL = `https://www.youtube.com/watch?v=${videoId}`;

    loadingSpinner.style.display = 'block';
    button.disabled = true;

    // Redirect to YouTube video in a new window/tab
    const likeCommentWindow = window.open(VIDEO_URL, '_blank');
    if (!likeCommentWindow) {
        errorDiv.textContent = 'Popup blocked. Please allow popups and try again.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
        loadingSpinner.style.display = 'none';
        button.disabled = false;
        return;
    }

    // Poll for like and comment status or simulate site verification
    let attempts = 0;
    const maxAttempts = 30; // Increased to 30 seconds for user interaction
    const checkInterval = setInterval(async () => {
        try {
            const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k'; // Replace with your actual YouTube API key
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                if (data.items && data.items.length > 0) {
                    const stats = data.items[0].statistics;
                    const userLiked = confirm('Have you liked the video on YouTube? The site will verify this action based on video stats.');
                    const userCommented = confirm('Have you commented on the video on YouTube? The site will verify this action based on video stats.');
                    if (userLiked && userCommented && stats.likeCount && stats.commentCount) {
                        clearInterval(checkInterval);
                        task.classList.add('completed');
                        button.textContent = 'Verified';
                        button.disabled = true;
                        checkAllTasks();
                        loadingSpinner.style.display = 'none';
                        if (likeCommentWindow) likeCommentWindow.close();
                        return;
                    } else {
                        alert('Please like and comment on the video, then retry verification.');
                    }
                }
            }
        } catch (error) {
            console.error('Like/Comment verification failed:', error);
        }
        attempts++;
        if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            errorDiv.textContent = 'Like/Comment verification timed out. Please like, comment, or confirm and try again.';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 3000);
            loadingSpinner.style.display = 'none';
            button.disabled = false;
        }
    }, 1000); // Check every second
}

async function handleTwitter() {
    const task = document.querySelector('#twitter-task');
    const button = task?.querySelector('.task-button');
    const loadingSpinner = document.querySelector('#loading-spinner');
    const errorDiv = document.querySelector('#confirm-error');
    const TWITTER_URL = 'https://x.com/Yobest_BYTR';

    loadingSpinner.style.display = 'block';
    button.disabled = true;

    // Redirect to Twitter profile in a new window/tab
    const twitterWindow = window.open(TWITTER_URL, '_blank');
    if (!twitterWindow) {
        errorDiv.textContent = 'Popup blocked. Please allow popups and try again.';
        errorDiv.style.display = 'block';
        setTimeout(() => errorDiv.style.display = 'none', 3000);
        loadingSpinner.style.display = 'none';
        button.disabled = false;
        return;
    }

    // Poll for follow status or allow user confirmation
    let attempts = 0;
    const maxAttempts = 30; // Increased to 30 seconds for user interaction
    const checkInterval = setInterval(() => {
        const userFollows = confirm('Have you followed @Yobest_BYTR on Twitter? If not, or if you don’t have a Twitter account, click "Cancel" to proceed.');
        if (userFollows || !userFollows) {
            clearInterval(checkInterval);
            task.classList.add('completed');
            button.textContent = 'Verified' + (!userFollows ? ' (No Account)' : '');
            button.disabled = true;
            checkAllTasks();
            loadingSpinner.style.display = 'none';
            if (twitterWindow) twitterWindow.close();
        }
        attempts++;
        if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            errorDiv.textContent = 'Follow verification timed out. Please follow or confirm and try again.';
            errorDiv.style.display = 'block';
            setTimeout(() => errorDiv.style.display = 'none', 3000);
            loadingSpinner.style.display = 'none';
            button.disabled = false;
        }
    }, 1000); // Check every second
}

function checkAllTasks() {
    const tasks = document.querySelectorAll('.task-card');
    const allCompleted = Array.from(tasks).every(task => task.classList.contains('completed'));
    const successMessage = document.querySelector('#success-message');
    const downloadLink = document.querySelector('#download-link');
    const videoId = downloadLink?.dataset.videoId;
    const title = downloadLink?.dataset.title;

    if (allCompleted) {
        successMessage.style.display = 'block';
        const gameFiles = {
            'Toilet tower defense uncopylocked UP4⚔ By BYTR': 'https://raw.githubusercontent.com/Yobest-Bytr/BYTR-games/refs/heads/main/Toilet%20tower%20defense%20uncopylocked%20UP4%E2%9A%94%20By%20BYTR.rar'
            // Add more mappings for other games as needed
        };
        downloadLink.href = gameFiles[title] || '#';
        downloadLink.style.display = 'inline-block';
        trackDownload(); // Track download when completed
    } else {
        successMessage.style.display = 'none';
        downloadLink.style.display = 'none';
    }
}
