function sendMessage(inputId = 'chat-input', messagesId = 'communication-messages') {
    const input = document.getElementById(inputId);
    const messagesDiv = document.getElementById(messagesId);
    if (input.value.trim()) {
        const username = localStorage.getItem('loggedInUsername');
        if (!username) {
            alert('Please log in to send messages.');
            return;
        }
        const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
        const userData = accounts[username] || { username: username, avatar: 'https://via.placeholder.com/40' };
        const msg = document.createElement("div");
        msg.className = 'comment animate-card';
        msg.innerHTML = `
            <img src="${userData.avatar}" alt="${userData.username}" class="comment-avatar">
            <div class="comment-content">
                <strong>${userData.username}</strong>: ${input.value}
                <div class="comment-meta">
                    <span>${new Date().toLocaleString()}</span>
                </div>
            </div>
        `;
        messagesDiv.appendChild(msg);
        input.value = "";
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Store message in localStorage for communication page
        const messages = JSON.parse(localStorage.getItem('communicationMessages')) || [];
        messages.push({
            username: username,
            text: input.value,
            timestamp: new Date().toISOString(),
            file: null
        });
        localStorage.setItem('communicationMessages', JSON.stringify(messages));
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
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('auth-message');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        // Existing user, check password
        if (users[username].password === password) {
            localStorage.setItem('loggedInUsername', username);
            message.textContent = "🎉 Welcome back, " + username + "!";
            message.style.color = '#00d4ff';
            message.classList.add('animate-success');
        } else {
            message.textContent = "❌ Incorrect password!";
            message.style.color = '#ff3366';
            message.classList.add('animate-error');
            return;
        }
    } else {
        message.textContent = "❌ Username not found. Please create an account or try again.";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    setTimeout(() => {
        closeLogin();
        updateLoginState();
        loadAccountInfo();
    }, 1500);
}

function handleGoogleSignIn(response) {
    // Optional: Keep Google Sign-In if desired, but it’s not used for username/password
    console.log('Google Sign-In triggered, but username/password login is prioritized.');
}

function checkLoginState() {
    console.log('checkLoginState called'); // Debug log to confirm function is loaded
    const loggedInUsername = localStorage.getItem('loggedInUsername');
    const loginBtn = document.getElementById('login-btn');
    const accountPic = document.getElementById('account-pic');

    if (loggedInUsername) {
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
    const username = localStorage.getItem('loggedInUsername');
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    const userData = accounts[username] || { username: username, avatar: 'https://via.placeholder.com/40' };

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

function openCreateAccount() {
    document.getElementById('create-account-modal').style.display = 'block';
    document.getElementById('create-account-modal').classList.add('animate-modal');
}

function closeCreateAccount() {
    const modal = document.getElementById('create-account-modal');
    modal.style.display = 'none';
    modal.classList.remove('animate-modal');
    document.getElementById('create-message').textContent = '';
}

function createAccount() {
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const message = document.getElementById('create-message');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (username === '') {
        message.textContent = "❌ Please enter a username!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    if (users[username]) {
        message.textContent = "❌ Username already exists!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    if (password !== confirmPassword) {
        message.textContent = "❌ Passwords do not match!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    if (password.length < 6) {
        message.textContent = "❌ Password must be at least 6 characters long!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    users[username] = { password: password, created: new Date().toISOString() };
    localStorage.setItem('users', JSON.stringify(users));
    message.textContent = "✅ Account created successfully! You can now log in.";
    message.style.color = '#00d4ff';
    message.classList.add('animate-success');

    setTimeout(() => {
        closeCreateAccount();
    }, 1500);
}

function openForgotPassword() {
    document.getElementById('forgot-password-modal').style.display = 'block';
    document.getElementById('forgot-password-modal').classList.add('animate-modal');
}

function closeForgotPassword() {
    const modal = document.getElementById('forgot-password-modal');
    modal.style.display = 'none';
    modal.classList.remove('animate-modal');
    document.getElementById('forgot-message').textContent = '';
}

function resetPassword() {
    const username = document.getElementById('forgot-username').value.trim();
    const message = document.getElementById('forgot-message');
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (!users[username]) {
        message.textContent = "❌ Username not found!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    // Simulate password reset (generate a temporary password and store it)
    const tempPassword = Math.random().toString(36).slice(-8); // Generate random 8-character password
    users[username].password = tempPassword;
    localStorage.setItem('users', JSON.stringify(users));
    message.textContent = `✅ Password reset successful! Your new temporary password is: ${tempPassword}. Please log in and update it in Account Settings.`;
    message.style.color = '#00d4ff';
    message.classList.add('animate-success');

    setTimeout(() => {
        closeForgotPassword();
    }, 3000);
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
    const username = localStorage.getItem('loggedInUsername');
    const newUsername = document.getElementById('username').value.trim();
    const fileInput = document.getElementById('avatar-upload');
    const message = document.getElementById('account-message');
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (!newUsername) {
        message.textContent = "❌ Please enter a username!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    if (newUsername !== username && users[newUsername]) {
        message.textContent = "❌ Username already exists!";
        message.style.color = '#ff3366';
        message.classList.add('animate-error');
        return;
    }

    let avatarUrl = accounts[username]?.avatar || 'https://via.placeholder.com/40';
    if (fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                avatarUrl = e.target.result; // Store as base64 for local testing
                saveAccountChanges(username, newUsername, avatarUrl);
            };
            reader.readAsDataURL(file);
        } else {
            message.textContent = "❌ Please upload an image file!";
            message.style.color = '#ff3366';
            message.classList.add('animate-error');
            return;
        }
    } else {
        saveAccountChanges(username, newUsername, avatarUrl);
    }
}

function saveAccountChanges(oldUsername, newUsername, avatarUrl) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Update accounts
    if (oldUsername !== newUsername) {
        accounts[newUsername] = accounts[oldUsername] || { username: newUsername, avatar: avatarUrl };
        delete accounts[oldUsername];
    } else {
        accounts[newUsername] = { username: newUsername, avatar: avatarUrl };
    }
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // Update users if username changed
    if (oldUsername !== newUsername) {
        const userData = users[oldUsername];
        delete users[oldUsername];
        users[newUsername] = userData;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUsername', newUsername);
    }

    document.getElementById('account-pic').src = avatarUrl;
    document.getElementById('account-message').textContent = "✅ Account updated successfully!";
    document.getElementById('account-message').style.color = '#00d4ff';
    document.getElementById('account-message').classList.add('animate-success');
    closeAccountSettings();
    loadAccountInfo();
}

function loadAccountInfo() {
    const username = localStorage.getItem('loggedInUsername');
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    const userData = accounts[username] || { username: username, avatar: 'https://via.placeholder.com/40' };

    document.getElementById('account-pic').src = userData.avatar;
    document.getElementById('welcome-username').textContent = userData.username;
    document.getElementById('account-pic').classList.add('animate-fade-in');
}

// Comment Functions (for game.html)
function loadSiteComments(videoId) {
    const commentsList = document.getElementById('site-comments-list');
    const comments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || [];
    const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const userData = accounts[comment.username] || { username: comment.username, avatar: 'https://via.placeholder.com/40' };
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
    const username = localStorage.getItem('loggedInUsername');

    if (!username) {
        alert('Please log in to comment.');
        return;
    }

    const commentText = commentInput.value.trim();
    if (commentText) {
        const comments = JSON.parse(localStorage.getItem(`comments_${videoId}`)) || [];
        comments.push({
            username: username,
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
        const username = localStorage.getItem('loggedInUsername');
        const formData = new FormData();
        formData.append('file', file);

        // Simulate file upload (replace with actual backend endpoint)
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileUrl = e.target.result; // Base64 or Blob URL for local testing
            if (username) {
                const scripts = JSON.parse(localStorage.getItem('robloxScripts')) || {};
                scripts[username] = scripts[username] || {};
                scripts[username].gameFile = fileUrl;
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

// Upload communication file function (for communication.html)
function uploadCommunicationFile(input) {
    const file = input.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('text/'))) {
        const username = localStorage.getItem('loggedInUsername');
        if (!username) {
            alert('Please log in to upload files.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const fileUrl = e.target.result; // Base64 or Blob URL for local testing
            const messages = JSON.parse(localStorage.getItem('communicationMessages')) || [];
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && !lastMessage.file) { // Link file to the last message
                lastMessage.file = fileUrl;
                localStorage.setItem('communicationMessages', JSON.stringify(messages));
            } else {
                messages.push({
                    username: username,
                    text: `File: ${file.name}`,
                    timestamp: new Date().toISOString(),
                    file: fileUrl
                });
                localStorage.setItem('communicationMessages', JSON.stringify(messages));
            }
            loadCommunicationMessages();
            alert(`File (${file.name}) uploaded successfully!`);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload an image, PDF, or text file.');
    }
}

// Fetch YouTube comments with replies, likes, and dates (for game.html)
async function loadYouTubeComments(videoId) {
    const commentsList = document.getElementById('youtube-comments-list');
    const API_KEY = 'AIzaSyAHLMunc1uf9O61UxbTGYj4r8cixc13Eq0';
    try {
        let allComments = [];
        let nextPageToken = '';

        do {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}&maxResults=20&pageToken=${nextPageToken}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, Message: ${await response.text()}`);
            }
            const data = await response.json();
            if (data.items) {
                allComments = allComments.concat(data.items);
                nextPageToken = data.nextPageToken || '';
            } else if (data.error) {
                throw new Error(`API error: ${data.error.message || 'Unknown error'}`);
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
        commentsList.innerHTML = '<p class="animate-error">Error loading YouTube comments. Please ensure the video ID, API key, and playlist ID are correct.</p>';
    }
}

// AI Functions (for ai.html and communication page)
let currentCategory = '';

function setCategory(category) {
    currentCategory = category;
    const input = document.getElementById('script-input') || document.getElementById('chat-input'); // Support both AI and communication
    if (!input) {
        console.error('Input element not found.');
        return;
    }
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

function sendToAI(inputId = 'script-input', responseId = 'ai-response') {
    const input = document.getElementById(inputId);
    const responseDiv = document.getElementById(responseId);
    if (!input || !responseDiv) {
        console.error(`${inputId} or ${responseId} element not found.`);
        return;
    }

    const question = input.value.trim();
    if (question) {
        responseDiv.textContent = "Thinking...";
        responseDiv.classList.add('animate-loading');
        setTimeout(() => {
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
                    response = `I'm here to help with Roblox and general questions! Specify a category (Build, Grow, Monetize) or ask anything.`;
            }
            responseDiv.innerHTML = `<pre class="language-lua"><code>${Prism.highlight(response, Prism.languages.lua, 'lua')}</code></pre>`;
            responseDiv.classList.remove('animate-loading');
            responseDiv.classList.add('animate-success');
        }, 2000); // Simulate AI processing delay
    } else {
        responseDiv.textContent = "Please enter a question or message!";
        responseDiv.classList.add('animate-error');
        setTimeout(() => responseDiv.textContent = '', 3000);
    }
}

// Fetch YouTube videos for the home page (index.html) and game.html
async function fetchVideos() {
    const reactionDiv = document.getElementById('reaction-text');
    const previewGrid = document.getElementById('preview-grid');
    const videoError = document.getElementById('video-error');
    const API_KEY = 'AIzaSyAHLMunc1uf9O61UxbTGYj4r8cixc13Eq0'; // Provided API key
    const PLAYLIST_ID = 'UUsV3X3EyEowLEdRW1RileuA'; // Updated playlist ID

    if (!reactionDiv || !previewGrid || !videoError) {
        console.error('DOM elements for video display not found in index.html or game.html.');
        return;
    }

    reactionDiv.textContent = "🔥 Connecting to YouTube HQ...";
    reactionDiv.classList.add('animate-loading');

    let videos = [];
    let nextPageToken = '';

    try {
        // If PLAYLIST_ID is a channel ID, fetch the uploads playlist dynamically
        if (PLAYLIST_ID.startsWith('UU')) {
            const channelResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${PLAYLIST_ID}&key=${API_KEY}`
            );
            if (!channelResponse.ok) {
                throw new Error(`HTTP error fetching channel! Status: ${channelResponse.status}, Message: ${await channelResponse.text()}`);
            }
            const channelData = await channelResponse.json();
            if (channelData.items && channelData.items.length > 0) {
                const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
                console.log('Using uploads playlist ID:', uploadsPlaylistId);
                PLAYLIST_ID = uploadsPlaylistId; // Update PLAYLIST_ID to the uploads playlist
            } else {
                throw new Error('Channel not found or no uploads playlist available.');
            }
        }

        do {
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=50&pageToken=${nextPageToken}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${await response.text()}`);
            }
            const data = await response.json();
            console.log('API Response:', data); // Log the response for debugging
            if (data.items) {
                videos = videos.concat(data.items);
                nextPageToken = data.nextPageToken || '';
            } else if (data.error) {
                throw new Error(`API error: ${data.error.message || 'Unknown error'}`);
            }
        } while (nextPageToken);

        if (videos.length === 0) {
            throw new Error('No videos found in the playlist. Please verify the PLAYLIST_ID.');
        }

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

            if (!videoId || !title || !thumbnail) {
                console.warn(`Skipping video at index ${index} due to missing data.`);
                return;
            }

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

// Add at the end of script.js for events
document.addEventListener('DOMContentLoaded', () => {
    // Keyboard event for Enter key in communication
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage('chat-input', 'communication-messages');
            }
        });
    }

    // Mouse event for hover on video cards (enhance existing hover in styles.css)
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('hovered'));
        card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    });
});
