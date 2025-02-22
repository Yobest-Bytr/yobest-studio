// Type definitions for function parameters and return types
function sendMessage(inputId: string = 'chat-input', messagesId: string = 'communication-messages'): void {
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    const messagesDiv = document.getElementById(messagesId) as HTMLElement | null;

    if (input && messagesDiv && input.value.trim()) {
        const msg = document.createElement("div");
        msg.className = 'comment animate-card';
        msg.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="Anonymous" class="comment-avatar">
            <div class="comment-content">
                <strong>Anonymous</strong>: ${input.value}
                <div class="comment-meta">
                    <span>${new Date().toLocaleString()}</span>
                </div>
            </div>
        `;
        messagesDiv.appendChild(msg);
        input.value = "";
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // Store message in localStorage for communication page
        const messages = JSON.parse(localStorage.getItem('communicationMessages') || '[]') as Array<{ text: string, timestamp: string, file: string | null }>;
        messages.push({
            text: input.value,
            timestamp: new Date().toISOString(),
            file: null
        });
        localStorage.setItem('communicationMessages', JSON.stringify(messages));
    } else {
        console.error('Input or messages div not found or input is empty.');
    }
}

// Track visitor and download counts
function trackVisitor(): void {
    console.log('trackVisitor called');
    let visitors: number = parseInt(localStorage.getItem('siteVisitors') || '0') || 0;
    visitors++;
    localStorage.setItem('siteVisitors', visitors.toString());
}

function trackPageVisitors(): void {
    console.log('trackPageVisitors called');
    const pageVisitorsKey: string = `pageVisitors_game_${new URLSearchParams(window.location.search).get('id') || '0'}`;
    let visitors: number = parseInt(localStorage.getItem(pageVisitorsKey) || '0') || 0;
    visitors++;
    localStorage.setItem(pageVisitorsKey, visitors.toString());
    const pageVisitorsElement = document.getElementById('page-visitors') as HTMLElement | null;
    if (pageVisitorsElement) {
        pageVisitorsElement.textContent = visitors.toString();
    } else {
        console.error('Page visitors element not found.');
    }
}

function trackDownload(): void {
    console.log('trackDownload called');
    let downloads: number = parseInt(localStorage.getItem('totalDownloads') || '0') || 0;
    downloads++;
    localStorage.setItem('totalDownloads', downloads.toString());
}

function displayCounters(): void {
    console.log('displayCounters called');
    const siteVisitors: number = parseInt(localStorage.getItem('siteVisitors') || '0') || 0;
    const downloads: number = parseInt(localStorage.getItem('totalDownloads') || '0') || 0;
    const siteVisitorsElement = document.getElementById('site-visitors') as HTMLElement | null;
    const totalDownloadsElement = document.getElementById('total-downloads') as HTMLElement | null;
    if (siteVisitorsElement) siteVisitorsElement.textContent = siteVisitors.toString();
    if (totalDownloadsElement) totalDownloadsElement.textContent = downloads.toString();
    if (!siteVisitorsElement || !totalDownloadsElement) {
        console.error('Counter elements not found.');
    }
}

// Upload game file function (for game.html and ai.html, including .rar, .rbxl, and .rbxlx)
function uploadGameFile(input: HTMLInputElement): void {
    console.log('uploadGameFile called');
    const file: File | null = input.files?.[0] || null;
    if (file && (file.type === 'application/x-rar-compressed' || file.name.endsWith('.rbxl') || file.name.endsWith('.rbxlx'))) {
        const formData = new FormData();
        formData.append('file', file);

        // Simulate file upload (replace with actual backend endpoint)
        const reader = new FileReader();
        reader.onload = function(e: ProgressEvent<FileReader>): void {
            const fileUrl: string = e.target?.result as string; // Base64 or Blob URL for local testing
            const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
            const gameId: string | null = urlParams.get('id');
            const videoId: string | undefined = JSON.parse(localStorage.getItem('channelVideos') || '[]')[gameId ? parseInt(gameId) : -1]?.snippet.resourceId.videoId;
            if (videoId) {
                localStorage.setItem(`gameFile_${videoId}`, fileUrl);
                const downloadBtn = document.getElementById('download-btn') as HTMLAnchorElement | null;
                if (downloadBtn) {
                    downloadBtn.href = fileUrl;
                    alert(`Game file (${file.name}) uploaded successfully! Click "Download Game" to access.`);
                } else {
                    console.error('Download button not found.');
                }
            } else {
                console.error('Video ID not found for game upload.');
            }
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a .rar, .rbxl, or .rbxlx file.');
    }
}

// Upload communication file function (for communication.html)
function uploadCommunicationFile(input: HTMLInputElement): void {
    console.log('uploadCommunicationFile called');
    const file: File | null = input.files?.[0] || null;
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.startsWith('text/'))) {
        const reader = new FileReader();
        reader.onload = function(e: ProgressEvent<FileReader>): void {
            const fileUrl: string = e.target?.result as string; // Base64 or Blob URL for local testing
            const messages: Array<{ text: string, timestamp: string, file: string | null }> = JSON.parse(localStorage.getItem('communicationMessages') || '[]');
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && !lastMessage.file) { // Link file to the last message
                lastMessage.file = fileUrl;
                localStorage.setItem('communicationMessages', JSON.stringify(messages));
            } else {
                messages.push({
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
async function loadYouTubeComments(videoId: string): Promise<void> {
    console.log('loadYouTubeComments called for videoId:', videoId);
    const commentsList = document.getElementById('youtube-comments-list') as HTMLElement | null;
    if (!commentsList) {
        console.error('YouTube comments list element not found.');
        return;
    }
    const API_KEY: string = 'AIzaSyAHLMunc1uf9O61UxbTGYj4r8cixc13Eq0';
    try {
        let allComments: any[] = [];
        let nextPageToken: string | undefined = '';

        do {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}&maxResults=20&pageToken=${nextPageToken}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, Message: ${await response.text()}`);
            }
            const data = await response.json();
            if (data.items) {
                allComments = allComments.concat(data.items);
                nextPageToken = data.nextPageToken;
            } else if (data.error) {
                throw new Error(`API error: ${data.error.message || 'Unknown error'}`);
            }
        } while (nextPageToken);

        commentsList.innerHTML = '';
        allComments.forEach(item => {
            const comment = item.snippet.topLevelComment.snippet;
            const commentLikes: number = comment.likeCount || 0;
            const commentDislikes: number = 0; // Dislikes are no longer available via API as of 2021
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
                    const replyLikes: number = reply.snippet.likeCount || 0;
                    const replyDislikes: number = 0; // Dislikes are no longer available
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

// Communication Functions
function loadCommunicationMessages(): void {
    console.log('loadCommunicationMessages called');
    const messagesDiv = document.getElementById('communication-messages') as HTMLElement | null;
    if (!messagesDiv) {
        console.error('Communication messages div not found.');
        return;
    }
    const messages = JSON.parse(localStorage.getItem('communicationMessages') || '[]') as Array<{ text: string, timestamp: string, file: string | null }>;
    messagesDiv.innerHTML = '';
    messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'comment animate-card';
        msgDiv.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="Anonymous" class="comment-avatar">
            <div class="comment-content">
                <strong>Anonymous</strong>: ${msg.text}
                <div class="comment-meta">
                    <span>${new Date(msg.timestamp).toLocaleString()}</span>
                    ${msg.file ? `<a href="${msg.file}" target="_blank" class="file-link">📎 File</a>` : ''}
                </div>
            </div>
        `;
        messagesDiv.appendChild(msgDiv);
    });
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the bottom
}

// Comment Functions (for game.html)
function loadSiteComments(videoId: string): void {
    console.log('loadSiteComments called for videoId:', videoId);
    const commentsList = document.getElementById('site-comments-list') as HTMLElement | null;
    if (!commentsList) {
        console.error('Site comments list element not found.');
        return;
    }
    const comments = JSON.parse(localStorage.getItem(`comments_${videoId}`) || '[]') as Array<{ text: string, timestamp: string }>;
    commentsList.innerHTML = '';
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment animate-card';
        commentDiv.innerHTML = `
            <img src="https://via.placeholder.com/40" alt="Anonymous" class="comment-avatar">
            <div class="comment-content">
                <strong>Anonymous</strong>: ${comment.text}
                <div class="comment-meta">
                    <span>${new Date(comment.timestamp).toLocaleString()}</span>
                </div>
            </div>
        `;
        commentsList.appendChild(commentDiv);
    });
}

function postComment(): void {
    console.log('postComment called');
    const videoId = JSON.parse(localStorage.getItem('channelVideos') || '[]')[new URLSearchParams(window.location.search).get('id') || '0']?.snippet.resourceId.videoId;
    const commentInput = document.getElementById('comment-input') as HTMLInputElement | null;
    if (!commentInput) {
        console.error('Comment input element not found.');
        return;
    }

    const commentText = commentInput.value.trim();
    if (commentText) {
        const comments = JSON.parse(localStorage.getItem(`comments_${videoId || 'default'}`) || '[]') as Array<{ text: string, timestamp: string }>;
        comments.push({
            text: commentText,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(`comments_${videoId || 'default'}`, JSON.stringify(comments));
        commentInput.value = '';
        loadSiteComments(videoId || 'default');
    }
}

// AI Functions (for ai.html and communication page)
let currentCategory: string = '';

function setCategory(category: string): void {
    console.log('setCategory called with:', category);
    currentCategory = category;
    const input = document.getElementById('script-input') as HTMLInputElement | null || document.getElementById('chat-input') as HTMLInputElement | null;
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

function sendToAI(inputId: string = 'script-input', responseId: string = 'ai-response'): void {
    console.log('sendToAI called with inputId:', inputId, 'responseId:', responseId);
    const input = document.getElementById(inputId) as HTMLInputElement | null;
    const responseDiv = document.getElementById(responseId) as HTMLElement | null;
    if (!input || !responseDiv) {
        console.error(`${inputId} or ${responseId} element not found.`);
        return;
    }

    const question: string = input.value.trim();
    if (question) {
        responseDiv.textContent = "Thinking...";
        responseDiv.classList.add('animate-loading');
        setTimeout(() => {
            let response: string;
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
async function fetchVideos(): Promise<void> {
    console.log('fetchVideos called');
    const reactionDiv = document.getElementById('reaction-text') as HTMLElement | null;
    const previewGrid = document.getElementById('preview-grid') as HTMLElement | null;
    const videoError = document.getElementById('video-error') as HTMLElement | null;
    if (!reactionDiv || !previewGrid || !videoError) {
        console.error('DOM elements for video display not found in index.html or game.html.');
        return;
    }
    const API_KEY: string = 'AIzaSyAHLMunc1uf9O61UxbTGYj4r8cixc13Eq0'; // Provided API key
    const PLAYLIST_ID: string = 'UUsV3X3EyEowLEdRW1RileuA'; // Updated playlist ID

    reactionDiv.textContent = "🔥 Connecting to YouTube HQ...";
    reactionDiv.classList.add('animate-loading');

    let videos: any[] = [];
    let nextPageToken: string | undefined = '';

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
                const uploadsPlaylistId: string = channelData.items[0].contentDetails.relatedPlaylists.uploads;
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
                nextPageToken = data.nextPageToken;
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
        videos.forEach((item: any, index: number) => {
            const videoId: string = item.snippet.resourceId.videoId;
            const title: string = item.snippet.title;
            const thumbnail: string = item.snippet.thumbnails?.maxres?.url || item.snippet.thumbnails?.high?.url || 'https://via.placeholder.com/150';

            if (!videoId || !title || !thumbnail) {
                console.warn(`Skipping video at index ${index} due to missing data.`);
                return;
            }

            const card = document.createElement('div');
            card.className = 'video-card animate-card';
            card.innerHTML = `
                <a href="/yobest-studio/game.html?id=${index}">
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

// Add at the end of script.ts for events
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    // Keyboard event for Enter key in communication
    const chatInput = document.getElementById('chat-input') as HTMLInputElement | null;
    if (chatInput) {
        console.log('Chat input found, adding keypress listener');
        chatInput.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                sendMessage('chat-input', 'communication-messages');
            }
        });
    } else {
        console.error('Chat input element not found.');
    }

    // Mouse event for hover on video cards (enhance existing hover in styles.css)
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', () => card.classList.add('hovered'));
        card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    });
});
