// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
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
        testAd.className = 'ad-placeholder';
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
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value.trim();

    let users = JSON.parse(localStorage.getItem('users') || '{}');
    let userStats = JSON.parse(localStorage.getItem('userStats') || '{}');

    if (users[username]) {
        if (users[username].password === password) {
            currentUser = { username, email: users[username].email, bio: users[username].bio || '', favoriteGames: users[username].favoriteGames || '' };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            userStats[username] = userStats[username] || { downloads: 0, visits: 0 };
            userStats[username].visits++;
            localStorage.setItem('userStats', JSON.stringify(userStats));
            showNotification('Login successful!', 'success');

            // Check for AdBlocker on first login
            const firstLogin = !localStorage.getItem('firstLogin');
            if (firstLogin) {
                showLoading();
                const adBlocked = await detectAdBlocker();
                if (adBlocked) {
                    showNotification('Please disable AdBlocker to continue.', 'error');
                    setTimeout(() => {
                        logout();
                        window.location.href = 'login.html';
                    }, 4000);
                    return;
                }
                setTimeout(() => {
                    hideLoading();
                    localStorage.setItem('firstLogin', 'true');
                    window.location.href = 'index.html';
                }, 4000);
            } else {
                window.location.href = 'index.html';
            }
        } else {
            showNotification('Incorrect password!', 'error');
        }
    } else {
        users[username] = { password, email, bio: '', favoriteGames: '' };
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = { username, email, bio: '', favoriteGames: '' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        userStats[username] = { downloads: 0, visits: 1 };
        localStorage.setItem('userStats', JSON.stringify(userStats));
        showNotification('Account created and logged in!', 'success');

        // Check for AdBlocker on first login
        showLoading();
        const adBlocked = await detectAdBlocker();
        if (adBlocked) {
            showNotification('Please disable AdBlocker to continue.', 'error');
            setTimeout(() => {
                logout();
                window.location.href = 'login.html';
            }, 4000);
            return;
        }
        setTimeout(() => {
            hideLoading();
            localStorage.setItem('firstLogin', 'true');
            window.location.href = 'index.html';
        }, 4000);
    }
}

function updateAccount() {
    const password = document.getElementById('account-password').value;
    const email = document.getElementById('account-email').value.trim();
    const bio = document.getElementById('account-bio').value.trim();
    const favoriteGames = document.getElementById('favorite-games').value.trim();

    if (currentUser) {
        let users = JSON.parse(localStorage.getItem('users') || '{}');
        if (users[currentUser.username]) {
            users[currentUser.username].password = password || users[currentUser.username].password;
            users[currentUser.username].email = email || users[currentUser.username].email;
            users[currentUser.username].bio = bio;
            users[currentUser.username].favoriteGames = favoriteGames;
            localStorage.setItem('users', JSON.stringify(users));
            currentUser.email = email || currentUser.email;
            currentUser.bio = bio;
            currentUser.favoriteGames = favoriteGames;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showNotification('Account updated!', 'success');
            updateAccountUI();
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showNotification('Logged out successfully!', 'success');
    updateUI();
    window.location.href = 'login.html';
}

function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const accountBtn = document.getElementById('account-btn');
    if (currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (accountBtn) accountBtn.style.display = 'inline-block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (accountBtn) accountBtn.style.display = 'none';
    }
    updateStats();
    updateAccountUI();
}

function updateStats() {
    let siteStats = JSON.parse(localStorage.getItem('siteStats') || '{"visitors": 0, "downloads": 0}');
    const siteVisitors = document.getElementById('site-visitors');
    const totalDownloads = document.getElementById('total-downloads');
    if (siteVisitors) siteVisitors.textContent = siteStats.visitors;
    if (totalDownloads) totalDownloads.textContent = siteStats.downloads;
}

function updateAccountUI() {
    if (window.location.pathname.includes('account.html') && currentUser) {
        const userStats = JSON.parse(localStorage.getItem('userStats') || '{}')[currentUser.username] || { downloads: 0, visits: 0 };
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        document.getElementById('account-username-display').textContent = currentUser.username;
        document.getElementById('account-email-display').textContent = currentUser.email || 'Not set';
        document.getElementById('user-downloads').textContent = userStats.downloads;
        document.getElementById('user-visits').textContent = userStats.visits;
        document.getElementById('account-email').value = currentUser.email || '';
        document.getElementById('account-bio').value = users[currentUser.username].bio || '';
        document.getElementById('favorite-games').value = users[currentUser.username].favoriteGames || '';
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
            const item = data.items[index];
            return {
                ...video,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.high.url,
                views: item.statistics.viewCount,
                likes: item.statistics.likeCount,
                date: item.snippet.publishedAt.split('T')[0],
                description: item.snippet.description
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
    const video = gamePreviews.find(v => v.videoLink === videoLink);
    if (video) {
        document.getElementById('video-player').src = `https://www.youtube.com/embed/${videoLink.split('v=')[1]}`;
        document.getElementById('video-title').textContent = video.title;
        document.getElementById('video-description').textContent = video.description || "No description available.";
        document.getElementById('video-views').textContent = video.views;
        document.getElementById('video-likes').textContent = video.likes;
        document.getElementById('video-date').textContent = video.date;
        document.getElementById('video-price').textContent = video.price;
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.href = video.downloadLink;
        downloadBtn.onclick = () => {
            let siteStats = JSON.parse(localStorage.getItem('siteStats') || '{"visitors": 0, "downloads": 0}');
            siteStats.downloads++;
            localStorage.setItem('siteStats', JSON.stringify(siteStats));
            if (currentUser) {
                let userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
                userStats[currentUser.username] = userStats[currentUser.username] || { downloads: 0, visits: 0 };
                userStats[currentUser.username].downloads++;
                localStorage.setItem('userStats', JSON.stringify(userStats));
            }
            updateStats();
        };
    } else {
        showNotification('Video not found!', 'error');
    }
    loadComments();
    loadYouTubeComments(videoLink.split('v=')[1]);
    setupRating(videoLink);
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
        const comments = JSON.parse(localStorage.getItem('comments') || '{}');
        const videoId = new URLSearchParams(window.location.search).get('video');
        comments[videoId] = comments[videoId] || [];
        comments[videoId].push({
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
        const videoId = new URLSearchParams(window.location.search).get('video');
        const comments = JSON.parse(localStorage.getItem('comments') || '{}')[videoId] || [];
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
    const videoId = new URLSearchParams(window.location.search).get('video');
    const comments = JSON.parse(localStorage.getItem('comments') || '{}');
    const comment = comments[videoId].find(c => c.date === date);
    if (comment) {
        comment.likes++;
        localStorage.setItem('comments', JSON.stringify(comments));
        showNotification('Comment liked!', 'success');
        loadComments();
    }
}

function editComment(date) {
    const videoId = new URLSearchParams(window.location.search).get('video');
    const comments = JSON.parse(localStorage.getItem('comments') || '{}');
    const comment = comments[videoId].find(c => c.date === date);
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
        const videoId = new URLSearchParams(window.location.search).get('video');
        let comments = JSON.parse(localStorage.getItem('comments') || '{}');
        comments[videoId] = comments[videoId].filter(c => c.date !== date || c.owner !== currentUser.username);
        localStorage.setItem('comments', JSON.stringify(comments));
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
            setTimeout(() => document.getElementById('rating-message').textContent = '', 2000);
            displayPublicRatings(videoLink);
        });
    });
    displayPublicRatings(videoLink);
}

function saveRating(videoLink, rating) {
    let ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
    ratings[videoLink] = ratings[videoLink] || [];
    ratings[videoLink].push({ username: currentUser.username, rating });
    localStorage.setItem('ratings', JSON.stringify(ratings));
}

function displayPublicRatings(videoLink) {
    const ratings = JSON.parse(localStorage.getItem('ratings') || '{}')[videoLink] || [];
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
}

// Enhanced AI Chat
const aiResponses = {
    scripting: {
        keywords: ['script', 'lua', 'code', 'programming', 'function', 'event', 'variable'],
        responses: [
            `Let's write a Roblox script! Here's a basic part spawner:\n\n\`\`\`lua\nlocal part = Instance.new("Part")\npart.Size = Vector3.new(5, 1, 5)\npart.Position = Vector3.new(0, 10, 0)\npart.Anchored = true\npart.Parent = game.Workspace\n\`\`\`\nWhat kind of script would you like to create?`,
            `For a player touch event in Roblox:\n\n\`\`\`lua\nlocal part = game.Workspace.Part\npart.Touched:Connect(function(hit)\n    local player = game.Players:GetPlayerFromCharacter(hit.Parent)\n    if player then\n        print(player.Name .. " touched the part!")\n    end\nend)\n\`\`\`\nWhat scripting topic do you want to explore?`,
            `Here's how to create a function in Lua:\n\n\`\`\`lua\nlocal function spawnPart(position)\n    local part = Instance.new("Part")\n    part.Position = position\n    part.Parent = game.Workspace\nend\nspawnPart(Vector3.new(10, 5, 10))\n\`\`\`\nWhat function would you like to write?`
        ]
    },
    game_design: {
        keywords: ['design', 'game', 'build', 'create', 'level', 'mechanic', 'terrain'],
        responses: [
            `Game design in Roblox is all about creativity! Start with a theme like sci-fi or adventure. Here's a teleporter script:\n\n\`\`\`lua\nlocal teleporter = game.Workspace.Teleporter\nteleporter.Touched:Connect(function(hit)\n    hit.Parent.HumanoidRootPart.Position = Vector3.new(100, 10, 100)\nend)\n\`\`\`\nWhat design element are you working on?`,
            `For player engagement, add rewards! Here's a simple coin system:\n\n\`\`\`lua\nlocal player = game.Players.LocalPlayer\nplayer.leaderstats.Coins.Value += 100\n\`\`\`\nWhat game mechanic would you like to add?`,
            `To design a level, use Roblox Studio's terrain editor. Add lighting for atmosphere:\n\n\`\`\`lua\nlocal lighting = game.Lighting\nlighting.Ambient = Color3.fromRGB(50, 50, 50)\nlighting.Brightness = 1\n\`\`\`\nNeed help with a specific design aspect?`
        ]
    },
    debugging: {
        keywords: ['error', 'bug', 'fix', 'problem', 'issue', 'debug', 'crash'],
        responses: [
            `Debugging in Roblox? Check the Output window for errors. For "attempt to index nil", ensure the object exists:\n\n\`\`\`lua\nlocal part = game.Workspace:FindFirstChild("Part")\nif part then\n    part.Position = Vector3.new(0, 10, 0)\nelse\n    warn("Part not found!")\nend\n\`\`\`\nWhat's the error you're facing?`,
            `If an event isn't firing, check your connections:\n\n\`\`\`lua\nlocal part = game.Workspace.Part\npart.Touched:Connect(function(hit)\n    print("Part touched!")\nend)\n\`\`\`\nEnsure the part exists and has collision enabled. What's the bug?`,
            `Infinite loops can crash your game. Add a wait:\n\n\`\`\`lua\nwhile true do\n    print("Looping")\n    wait(1)\nend\n\`\`\`\nWhat issue are you trying to fix?`
        ]
    },
    code_execution: {
        keywords: ['execute', 'run', 'test', 'simulate', 'output'],
        responses: [
            `I can simulate simple Lua code for you! Please provide the code you'd like to execute, and I'll tell you the expected output.`,
            `Let's run your code. Share the Lua script, and I'll simulate the result for you.`,
            `I can execute basic Roblox scripts. Provide the code, and I'll describe what it would do.`
        ]
    },
    general: {
        keywords: ['help', 'how', 'what', 'why', 'explain'],
        responses: [
            `I'm here to help! What would you like to know about Roblox development? I can assist with scripting, game design, debugging, or even execute code for you.`,
            `Need assistance? I can explain Roblox concepts, write scripts, or debug issues. What do you need?`,
            `Let's dive into Roblox development! Ask me anything about scripting, designing, or debugging, and I'll help you out.`
        ]
    },
    roblox_specific: {
        keywords: ['roblox', 'studio', 'player', 'workspace', 'leaderstats', 'humanoid'],
        responses: [
            `In Roblox, you can add leaderstats for players like this:\n\n\`\`\`lua\nlocal Players = game:GetService("Players")\nPlayers.PlayerAdded:Connect(function(player)\n    local leaderstats = Instance.new("Folder")\n    leaderstats.Name = "leaderstats"\n    leaderstats.Parent = player\n    local coins = Instance.new("IntValue")\n    coins.Name = "Coins"\n    coins.Value = 0\n    coins.Parent = leaderstats\nend)\n\`\`\`\nWhat Roblox feature are you working on?`,
            `To change a player's speed in Roblox:\n\n\`\`\`lua\nlocal player = game.Players.LocalPlayer\nlocal humanoid = player.Character and player.Character:FindFirstChild("Humanoid")\nif humanoid then\n    humanoid.WalkSpeed = 32\nend\n\`\`\`\nWhat do you want to modify in Roblox?`,
            `For a Roblox GUI button:\n\n\`\`\`lua\nlocal button = script.Parent\nbutton.MouseButton1Click:Connect(function()\n    print("Button clicked!")\nend)\n\`\`\`\nWhat Roblox UI element are you creating?`
        ]
    },
    math: {
        keywords: ['math', 'calculate', 'number', 'random', 'position', 'vector'],
        responses: [
            `Let's do some math! In Roblox, you can generate a random position:\n\n\`\`\`lua\nlocal random = Random.new()\nlocal position = Vector3.new(random:NextNumber(-50, 50), 5, random:NextNumber(-50, 50))\n\`\`\`\nWhat math operation do you need help with?`,
            `To calculate distance between two parts in Roblox:\n\n\`\`\`lua\nlocal part1 = game.Workspace.Part1\nlocal part2 = game.Workspace.Part2\nlocal distance = (part1.Position - part2.Position).Magnitude\nprint("Distance: " .. distance)\n\`\`\`\nWhat calculation do you need?`,
            `For a smooth rotation in Roblox:\n\n\`\`\`lua\nlocal part = game.Workspace.Part\npart.CFrame = part.CFrame * CFrame.Angles(0, math.rad(90), 0)\n\`\`\`\nWhat math-related task are you working on?`
        ]
    }
};

// Simulate Lua code execution
function simulateLuaCode(code) {
    try {
        // Basic Lua code simulation (not a full Lua interpreter, but handles common patterns)
        let output = [];
        let variables = {};

        // Split code into lines
        const lines = code.split('\n').map(line => line.trim()).filter(line => line);

        for (let line of lines) {
            // Handle variable declarations (e.g., local x = 5)
            if (line.startsWith('local')) {
                const parts = line.split('=');
                if (parts.length === 2) {
                    const varName = parts[0].replace('local', '').trim();
                    let value = parts[1].trim();
                    // Evaluate simple expressions
                    if (value.includes('Vector3.new')) {
                        const vecMatch = value.match(/Vector3\.new\(([^)]+)\)/);
                        if (vecMatch) {
                            const [x, y, z] = vecMatch[1].split(',').map(v => parseFloat(v.trim()));
                            variables[varName] = `Vector3(${x}, ${y}, ${z})`;
                        }
                    } else if (value.includes('Instance.new')) {
                        const instanceMatch = value.match(/Instance\.new\("([^"]+)"\)/);
                        if (instanceMatch) {
                            variables[varName] = `Instance(${instanceMatch[1]})`;
                        }
                    } else {
                        variables[varName] = eval(value); // Simple number evaluation
                    }
                }
            }
            // Handle print statements
            else if (line.startsWith('print')) {
                const printMatch = line.match(/print\(([^)]+)\)/) || line.match(/print\("([^"]+)"\)/);
                if (printMatch) {
                    let value = printMatch[1];
                    if (variables[value]) {
                        output.push(variables[value]);
                    } else {
                        output.push(value.replace(/"/g, ''));
                    }
                }
            }
            // Handle property assignments (e.g., part.Position = ...)
            else if (line.includes('=')) {
                const [varName, value] = line.split('=').map(part => part.trim());
                const varParts = varName.split('.');
                if (varParts.length > 1) {
                    const obj = varParts[0];
                    const prop = varParts[1];
                    if (variables[obj]) {
                        variables[obj] = `${variables[obj]} with ${prop}=${value}`;
                    }
                }
            }
            // Handle loops (basic simulation)
            else if (line.startsWith('for')) {
                const loopMatch = line.match(/for (\w+) = (\d+), (\d+)/);
                if (loopMatch) {
                    const varName = loopMatch[1];
                    const start = parseInt(loopMatch[2]);
                    const end = parseInt(loopMatch[3]);
                    for (let i = start; i <= end; i++) {
                        variables[varName] = i;
                        // Look for print in the loop
                        const nextLine = lines[lines.indexOf(line) + 1];
                        if (nextLine && nextLine.startsWith('print')) {
                            const printMatch = nextLine.match(/print\(([^)]+)\)/);
                            if (printMatch) {
                                let value = printMatch[1];
                                if (value === varName) {
                                    output.push(i);
                                }
                            }
                        }
                    }
                }
            }
        }

        return output.length > 0 ? `Output:\n${output.join('\n')}` : 'No output generated.';
    } catch (error) {
        return `Error simulating code: ${error.message}`;
    }
}

function sendToAI() {
    const input = document.getElementById('ai-input');
    const chatHistory = document.getElementById('chat-history');
    const message = input.value.trim().toLowerCase();

    if (!message) return;

    // Add user message to chat
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message';
    userMessage.innerHTML = `<strong>You:</strong> ${message}`;
    chatHistory.appendChild(userMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Check for code execution request
    if (message.includes('execute') || message.includes('run') || message.includes('simulate')) {
        const codeMatch = message.match(/```lua\n([\s\S]*?)\n```/);
        if (codeMatch) {
            const code = codeMatch[1];
            const output = simulateLuaCode(code);
            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-message';
            aiMessage.innerHTML = `<strong>AI:</strong> I simulated your code. Here's the result:\n\n${output}`;
            chatHistory.appendChild(aiMessage);
            chatHistory.scrollTop = chatHistory.scrollHeight;
            input.value = '';
            return;
        }
    }

    // Determine response category
    let response = '';
    for (let category in aiResponses) {
        const { keywords, responses } = aiResponses[category];
        if (keywords.some(keyword => message.includes(keyword))) {
            response = responses[Math.floor(Math.random() * responses.length)];
            break;
        }
    }

    // Fallback to general response if no category matches
    if (!response) {
        response = aiResponses.general.responses[Math.floor(Math.random() * aiResponses.general.responses.length)];
    }

    // Add AI response to chat
    const aiMessage = document.createElement('div');
    aiMessage.className = 'ai-message';
    aiMessage.innerHTML = `<strong>AI:</strong> ${response}`;
    chatHistory.appendChild(aiMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

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

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    // Load current user
    currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Update site visitors
    let siteStats = JSON.parse(localStorage.getItem('siteStats') || '{"visitors": 0, "downloads": 0}');
    siteStats.visitors++;
    localStorage.setItem('siteStats', JSON.stringify(siteStats));

    // Update UI
    updateUI();

    // Load videos on index page
    if (window.location.pathname.includes('index.html')) {
        fetchYouTubeVideos();
    }

    // Load game details on game page
    if (window.location.pathname.includes('game.html')) {
        loadGameDetails();
    }

    // Redirect to account page on cover image or "Edit Account" click
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
});
