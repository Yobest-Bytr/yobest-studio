function sendMessage() {
    const input = document.getElementById("chat-input");
    const messages = document.getElementById("chat-messages");
    if (input.value.trim()) {
        const msg = document.createElement("p");
        msg.textContent = `You: ${input.value}`;
        msg.classList.add('animate-text');
        messages.appendChild(msg);
        input.value = "";
        messages.scrollTop = messages.scrollHeight;
    }
}

// Login Functions
function openLogin() {
    document.getElementById('login-modal').style.display = 'block';
    document.getElementById('login-modal').classList.add('animate-modal');
}

function closeLogin() {
    const modal = document.getElementById('login-modal');
    modal.style.display = 'none';
    modal.classList.remove('animate-modal');
    document.getElementById('auth-message').textContent = '';
}

function authUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('auth-message');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email]) {
        // Existing user, check password
        if (users[email].password === password) {
            localStorage.setItem('loggedInEmail', email);
            message.textContent = "🎉 Welcome back, " + email + "!";
            message.style.color = '#00d4ff';
            message.classList.add('animate-success');
        } else {
            message.textContent = "❌ Incorrect password!";
            message.style.color = '#ff3366';
            message.classList.add('animate-error');
            return;
        }
    } else {
        // New user, create account
        users[email] = { password: password, created: new Date().toISOString() };
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInEmail', email);
        message.textContent = "✅ Account created and logged in as " + email + "!";
        message.style.color = '#00d4ff';
        message.classList.add('animate-success');
    }

    setTimeout(() => {
        closeLogin();
        updateLoginState();
        loadAccountInfo();
    }, 1500);
}

function checkLoginState() {
    const loggedInEmail = localStorage.getItem('loggedInEmail');
    const loginBtn = document.getElementById('login-btn');
    const accountPic = document.getElementById('account-pic');

    if (loggedInEmail) {
        loginBtn.style.display = 'none';
        accountPic.style.display = 'block';
        accountPic.classList.add('animate-fade-in');
    } else {
        loginBtn.style.display = 'inline-block';
        accountPic.style.display = 'none';
    }
}

function updateLoginState() {
    checkLoginState();
}

function openAccountSettings() {
    const modal = document.getElementById('account-settings-modal');
    const email = localStorage.getItem('loggedInEmail');
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    const userData = accounts[email] || { username: '', avatar: 'https://via.placeholder.com/40' };

    document.getElementById('username').value = userData.username || '';
    document.getElementById('avatar-upload').value = '';
    document.getElementById('avatar-preview').src = userData.avatar;
    document.getElementById('avatar-preview').style.display = userData.avatar ? 'block' : 'none';
    modal.style.display = 'block';
    modal.classList.add('animate-modal');
}

function closeAccountSettings() {
    const modal = document.getElementById('account-settings-modal');
    modal.style.display = 'none';
    modal.classList.remove('animate-modal');
    document.getElementById('account-message').textContent = '';
}

function previewAvatar(input) {
    const file = input.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatar-preview').src = e.target.result;
            document.getElementById('avatar-preview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload an image file.');
    }
}

function updateAccount() {
    const email = localStorage.getItem('loggedInEmail');
    const username = document.getElementById('username').value.trim();
    const fileInput = document.getElementById('avatar-upload');
    const message = document.getElementById('account-message');
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};

    if (!username) {
        message.textContent = "❌ Please enter a username!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    let avatarUrl = accounts[email]?.avatar || 'https://via.placeholder.com/40';
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarUrl = e.target.result; // Store as base64 for local testing
                saveAccountChanges(email, username, avatarUrl);
            };
            reader.readAsDataURL(file);
        } else {
            message.textContent = "❌ Please upload an image file!";
            message.style.color = '#ff3366';
            message.classList.add('animate-error');
            return;
        }
    } else {
        saveAccountChanges(email, username, avatarUrl);
    }
}

function saveAccountChanges(email, username, avatarUrl) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    accounts[email] = { username, avatar: avatarUrl };
    localStorage.setItem('accounts', JSON.stringify(accounts));
    document.getElementById('account-pic').src = avatarUrl;
    document.getElementById('account-message').textContent = "✅ Account updated successfully!";
    document.getElementById('account-message').style.color = '#00d4ff';
    document.getElementById('account-message').classList.add('animate-success');
    closeAccountSettings();
    loadAccountInfo();
}

function loadAccountInfo() {
    const email = localStorage.getItem('loggedInEmail');
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    const userData = accounts[email] || { username: '', avatar: 'https://via.placeholder.com/40' };

    document.getElementById('account-pic').src = userData.avatar;
    document.getElementById('welcome-username').textContent = userData.username || email.split('@')[0];
    document.getElementById('account-pic').classList.add('animate-fade-in');
}

// Comment Functions (for game.html)
function loadSiteComments(videoId) {
    const commentsList = document.getElementById('site-comments-list');
    const comments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || [];
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const userData = accounts[comment.email] || { username: comment.email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment animate-card';
        commentDiv.innerHTML = `
            <img src="${userData.avatar}" alt="${userData.username}" class="comment-avatar">
            <div class="comment-content">
                <strong>${userData.username}</strong>: ${comment.text}
                <div class="comment-meta">
                    <span>${new Date(comment.timestamp).toLocaleString()}</span>
                </div>
            </div>
        `;
        commentsList.appendChild(commentDiv);
    });
}

function postComment() {
    const videoId = JSON.parse(localStorage.getItem('channelVideos'))[new URLSearchParams(window.location.search).get('id')]?.snippet.resourceId.videoId;
    const commentInput = document.getElementById('comment-input');
    const email = localStorage.getItem('loggedInEmail');

    if (!email) {
        alert('Please log in to comment.');
        return;
    }

    const commentText = commentInput.value.trim();
    if (commentText) {
        const comments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || [];
        comments.push({
            email: email,
            text: commentText,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(`comments_${videoId}`, JSON.stringify(comments));
        commentInput.value = '';
        loadSiteComments(videoId);
    }
}

// Track visitor and download counts
function trackVisitor() {
    let visitors = parseInt(localStorage.getItem('siteVisitors')) || 0;
    visitors++;
    localStorage.setItem('siteVisitors', visitors);
}

function trackPageVisitors() {
    const pageVisitorsKey = `pageVisitors_game_${new URLSearchParams(window.location.search).get('id')}`;
    let visitors = parseInt(localStorage.getItem(pageVisitorsKey)) || 0;
    visitors++;
    localStorage.setItem(pageVisitorsKey, visitors);
    document.getElementById('page-visitors').textContent = visitors;
}

function trackDownload() {
    let downloads = parseInt(localStorage.getItem('totalDownloads')) || 0;
    downloads++;
    localStorage.setItem('totalDownloads', downloads);
}

function displayCounters() {
    const siteVisitors = parseInt(localStorage.getItem('siteVisitors')) || 0;
    const downloads = parseInt(localStorage.getItem('totalDownloads')) || 0;
    document.getElementById('site-visitors').textContent = siteVisitors;
    document.getElementById('total-downloads').textContent = downloads;
}

// Upload game file function (for game.html and ai.html, including .rar, .rbxl, and .rbxlx)
function uploadGameFile(input) {
    const file = input.files[0];
    if (file && (file.type === 'application/x-rar-compressed' || file.name.endsWith('.rbxl') || file.name.endsWith('.rbxlx'))) {
        const email = localStorage.getItem('loggedInEmail');
        const formData = new FormData();
        formData.append('file', file);

        // Simulate file upload (replace with actual backend endpoint)
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileUrl = e.target.result; // Base64 or Blob URL for local testing
            if (email) {
                const scripts = JSON.parse(localStorage.getItem('robloxScripts')) || {};
                scripts[email] = scripts[email] || {};
                scripts[email].gameFile = fileUrl;
                localStorage.setItem('robloxScripts', JSON.stringify(scripts));
                alert(`Game file (${file.name}) uploaded successfully!`);
            } else {
                alert('Please log in to upload game files.');
            }
        };
        reader.readAsDataURL(file);
    } else if (file && file.type === 'application/x-rar-compressed') {
        const videoId = JSON.parse(localStorage.getItem('channelVideos'))[new URLSearchParams(window.location.search).get('id')]?.snippet.resourceId.videoId;
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileUrl = e.target.result;
            localStorage.setItem(`gameFile_${videoId}`, fileUrl);
            const downloadBtn = document.getElementById('download-btn');
            if (downloadBtn) {
                downloadBtn.href = fileUrl;
                alert(`Game file (.rar) uploaded successfully! Click "Download Game" to access.`);
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a .rar, .rbxl, or .rbxlx file.');
    }
}

// Fetch YouTube comments with replies, likes, and dates (for game.html)
async function loadYouTubeComments(videoId) {
    const commentsList = document.getElementById('youtube-comments-list');
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k';
    try {
        let allComments = [];
        let nextPageToken = '';

        do {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}&maxResults=20&pageToken=${nextPageToken}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.items) {
                allComments = allComments.concat(data.items);
                nextPageToken = data.nextPageToken || '';
            } else if (data.error) {
                throw new Error(`API error: ${data.error.message}`);
            }
        } while (nextPageToken);

        commentsList.innerHTML = '';
        allComments.forEach(item => {
            const comment = item.snippet.topLevelComment.snippet;
            const commentLikes = comment.likeCount || 0;
            const commentDislikes = 0; // Dislikes are no longer available via API as of 2021
            const commentDiv = document.createElement('div');
            commentDiv.className = 'comment animate-card';
            commentDiv.innerHTML = `
                <img src="${comment.authorProfileImageUrl || 'https://via.placeholder.com/40'}" alt="${comment.authorDisplayName}" class="comment-avatar">
                <div class="comment-content">
                    <strong>${comment.authorDisplayName}</strong>: ${comment.textDisplay}
                    <div class="comment-meta">
                        <span>${new Date(comment.publishedAt).toLocaleString()}</span>
                        <span class="comment-likes"><i class="fas fa-thumbs-up"></i> ${commentLikes} Likes</span>
                        <span class="comment-dislikes"><i class="fas fa-thumbs-down"></i> ${commentDislikes} Dislikes</span>
                    </div>
                </div>
            `;
            commentsList.appendChild(commentDiv);

            // Handle replies
            if (item.replies && item.replies.comments) {
                item.replies.comments.forEach(reply => {
                    const replySnippet = reply.snippet;
                    const replyLikes = reply.snippet.likeCount || 0;
                    const replyDislikes = 0; // Dislikes are no longer available
                    const replyDiv = document.createElement('div');
                    replyDiv.className = 'comment reply animate-card';
                    replyDiv.innerHTML = `
                        <img src="${replySnippet.authorProfileImageUrl || 'https://via.placeholder.com/40'}" alt="${replySnippet.authorDisplayName}" class="comment-avatar">
                        <div class="comment-content">
                            <strong>${replySnippet.authorDisplayName}</strong>: ${replySnippet.textDisplay}
                            <div class="comment-meta">
                                <span>${new Date(replySnippet.publishedAt).toLocaleString()}</span>
                                <span class="comment-likes"><i class="fas fa-thumbs-up"></i> ${replyLikes} Likes</span>
                                <span class="comment-dislikes"><i class="fas fa-thumbs-down"></i> ${replyDislikes} Dislikes</span>
                            </div>
                        </div>
                    `;
                    commentDiv.appendChild(replyDiv);
                });
            }
        });
    } catch (error) {
        console.error('Error fetching YouTube comments:', error);
        commentsList.innerHTML = '<p class="animate-error">Error loading YouTube comments.</p>';
    }
}

// AI and Roblox Script Functions (for ai.html)
let currentCategory = '';

function setCategory(category) {
    currentCategory = category;
    const input = document.getElementById('script-input');
    switch (category) {
        case 'Build':
            input.value = 'How do I add background music to my experience?';
            break;
        case 'Grow':
            input.value = 'How do I bring new users to my experience? Reply and I’ll share what I’m doing so far.';
            break;
        case 'Monetize':
            input.value = 'How do Limited avatar items work and what are some tips to sell them?';
            break;
    }
    input.focus();
}

function sendToAI() {
    const input = document.getElementById('script-input').value.trim();
    const responseDiv = document.getElementById('ai-response');
    if (input) {
        responseDiv.textContent = "Thinking...";
        responseDiv.classList.add('animate-loading');
        setTimeout(() => {
            // Placeholder AI response (simulate Grok-like Roblox AI)
            let response;
            switch (currentCategory) {
                case 'Build':
                    response = `To add background music to your Roblox experience:\n1. Use a `Sound` object: \n   - Insert a `Sound` into a part or Workspace.\n   - Set the `SoundId` to a Roblox audio asset ID (e.g., "rbxassetid://123456789").\n   - Play it with `sound:Play()` in a Lua script.\n   Example:\n   ```lua\n   local sound = Instance.new("Sound")\n   sound.SoundId = "rbxassetid://123456789"\n   sound.Parent = game.Workspace\n   sound:Play()\n   ```\n2. Ensure the audio asset is uploaded to Roblox and you have permissions.`;
                    break;
                case 'Grow':
                    response = `To bring new users to your Roblox experience:\n1. Promote on social media (Twitter, Discord, Roblox groups).\n2. Use Roblox Ads (Developer Marketplace) to target users.\n3. Collaborate with other creators for cross-promotion.\n4. Share your progress here, and I’ll suggest specifics based on your description.`;
                    break;
                case 'Monetize':
                    response = `Limited avatar items in Roblox:\n- Limited items are rare, time-limited, or have low stock, increasing their value.\n- Tips to sell them:\n  1. List on the Roblox marketplace with a competitive price.\n  2. Promote via Roblox groups, Discord, or Twitter.\n  3. Use scarcity (e.g., “Only 100 left!”) to drive demand.\n  Example Lua script to check item ownership:\n  ```lua\n  local MarketplaceService = game:GetService("MarketplaceService")\n  local player = game.Players.LocalPlayer\n  local itemId = 123456789 -- Replace with your asset ID\n  if MarketplaceService:PlayerOwnsAsset(player, itemId) then\n      print("Player owns the limited item!")\n  end\n  ````;
                    break;
                default:
                    response = `I'm here to help with Roblox! Specify a category (Build, Grow, Monetize) or ask a detailed question.`;
            }
            responseDiv.innerHTML = `<pre class="language-lua"><code>${Prism.highlight(response, Prism.languages.lua, 'lua')}</code></pre>`;
            responseDiv.classList.remove('animate-loading');
            responseDiv.classList.add('animate-success');
        }, 2000); // Simulate AI processing delay
    } else {
        responseDiv.textContent = "Please enter a question!";
        responseDiv.classList.add('animate-error');
        setTimeout(() => responseDiv.textContent = '', 3000);
    }
}

// Roblox APIs Functions (for roblox-apis.html)
async function checkPlaceId() {
    const placeId = document.getElementById('place-id').value.trim();
    const status = document.getElementById('place-status');
    const setDefaultBtn = document.getElementById('set-default-btn');

    if (!placeId) {
        status.textContent = "❌ Please enter a Place ID!";
        status.classList.remove('success', 'error');
        status.classList.add('error');
        setDefaultBtn.style.display = 'none';
        return;
    }

    try {
        // Simulate Roblox API check (replace with actual Roblox Open Cloud or Developer API endpoint)
        const response = await fetch(`https://api.roblox.com/universes/get-universe-containing-place?placeId=${placeId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.universeId) {
            status.textContent = "✅ Valid Place ID!";
            status.classList.remove('error');
            status.classList.add('success');
            setDefaultBtn.style.display = 'block';
        } else {
            throw new Error('Invalid Place ID');
        }
    } catch (error) {
        console.error('Error checking Place ID:', error);
        status.textContent = `❌ Invalid Place ID or API error: ${error.message}`;
        status.classList.remove('success');
        status.classList.add('error');
        setDefaultBtn.style.display = 'none';
    }
}

function setDefaultPlace() {
    const placeId = document.getElementById('place-id').value.trim();
    const status = document.getElementById('place-status');
    if (placeId) {
        // Simulate setting default place (replace with actual Roblox API call, e.g., Roblox Developer API)
        status.textContent = `✅ Place ID ${placeId} set as default!`;
        status.classList.remove('error');
        status.classList.add('success');
        alert(`Place ID ${placeId} has been set as the default place. (This is a simulation; actual API integration required.)`);
    } else {
        status.textContent = "❌ No Place ID provided!";
        status.classList.remove('success');
        status.classList.add('error');
    }
}

async function downloadAsset() {
    const assetId = document.getElementById('asset-id').value.trim();
    const status = document.getElementById('asset-status');

    if (!assetId) {
        status.textContent = "❌ Please enter an Asset ID!";
        status.classList.remove('success', 'error');
        status.classList.add('error');
        return;
    }

    try {
        // Simulate Roblox asset download (replace with actual Roblox Marketplace API endpoint)
        const response = await fetch(`https://api.roblox.com/marketplace/productinfo?assetId=${assetId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data && data.AssetId) {
            const assetUrl = `https://www.roblox.com/library/${assetId}`;
            const blob = await fetch(assetUrl).then(res => res.blob());
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `asset_${assetId}.rbxm`; // Roblox model file extension
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            status.textContent = `✅ Asset ID ${assetId} downloaded successfully!`;
            status.classList.remove('error');
            status.classList.add('success');
        } else {
            throw new Error('Invalid Asset ID');
        }
    } catch (error) {
        console.error('Error downloading asset:', error);
        status.textContent = `❌ Invalid Asset ID or API error: ${error.message}`;
        status.classList.remove('success');
        status.classList.add('error');
    }
}

// Fetch YouTube videos for the home page (index.html)
async function fetchVideos() {
    const reactionDiv = document.getElementById('reaction-text');
    const previewGrid = document.getElementById('preview-grid');
    const videoError = document.getElementById('video-error');
    const API_KEY = 'AIzaSyChwoHXMqlbmAfeh4lbRUFWx2HjIZ6VV2k';
    const PLAYLIST_ID = 'UUsV3X3EyEowLEdRW1RileuA';

    if (!reactionDiv || !previewGrid || !videoError) {
        console.error('DOM elements for video display not found.');
        return;
    }

    reactionDiv.textContent = "🔥 Connecting to YouTube HQ...";
    reactionDiv.classList.add('animate-loading');

    let videos = [];
    let nextPageToken = '';

    try {
        do {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=50&pageToken=${nextPageToken}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }
            const data = await response.json();
            if (data.items) {
                videos = videos.concat(data.items);
                nextPageToken = data.nextPageToken || '';
            } else if (data.error) {
                throw new Error(`API error: ${data.error.message || 'Unknown error'}`);
            }
        } while (nextPageToken);

        reactionDiv.textContent = `✅ Loaded ${videos.length} awesome videos!`;
        reactionDiv.classList.remove('animate-loading');
        reactionDiv.classList.add('animate-success');

        // Clear any previous error or content
        videoError.style.display = 'none';
        previewGrid.innerHTML = '';

        // Display videos with animations
        videos.forEach((item, index) => {
            const videoId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;
            const thumbnail = item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || 'https://via.placeholder.com/150';

            const card = document.createElement('div');
            card.className = 'video-card animate-card';
            card.innerHTML = `
                <a href="game.html?id=${index}">
                    <img src="${thumbnail}" alt="${title}">
                    <h3 class="animate-text">${title}</h3>
                </a>
            `;
            previewGrid.appendChild(card);
        });

        // Store videos in localStorage for other pages
        localStorage.setItem('channelVideos', JSON.stringify(videos));
    } catch (error) {
        console.error('Error fetching videos:', error);
        reactionDiv.textContent = '';
        reactionDiv.classList.remove('animate-loading');
        previewGrid.innerHTML = '';
        videoError.style.display = 'block';
        videoError.textContent = `Error loading videos. Please check your API key, playlist ID, or network connection. Details: ${error.message}`;
        videoError.classList.add('animate-error');

        // Additional debugging info
        console.log('API Key:', API_KEY);
        console.log('Playlist ID:', PLAYLIST_ID);
        console.log('Response Status:', response ? response.status : 'No response');
    }
}
