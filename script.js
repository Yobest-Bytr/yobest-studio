// Global variables
let isLoggedIn = false;
let currentUser = null;

// Check login state on page load with detailed debugging
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, checking login state...');
    checkLoginState();
});

function openLogin() {
    document.getElementById('login-modal')?.style.display = 'block';
    document.getElementById('login-form')?.style.display = 'block';
}

function closeLogin() {
    document.getElementById('login-modal')?.style.display = 'none';
    document.getElementById('login-form')?.style.display = 'none';
}

function openAccountSettings() {
    if (isLoggedIn) {
        window.location.href = 'account-settings.html';
    } else {
        openLogin();
    }
}

function closeAccountSettings() {
    document.getElementById('account-settings-modal')?.style.display = 'none';
    document.getElementById('account-form')?.style.display = 'none';
}

function checkLoginState() {
    console.log('Checking login state...');
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    console.log('Saved user from localStorage:', savedUser);

    if (savedUser && savedUser.email && typeof savedUser.email === 'string') {
        isLoggedIn = true;
        currentUser = savedUser;
        console.log('User is logged in:', currentUser);
        updateNavButtons();
    } else {
        isLoggedIn = false;
        currentUser = null;
        console.log('User is not logged in');
        updateNavButtons();
    }
}

function authUser(email, password, callback) {
    const users = JSON.parse(localStorage.getItem('users') || '{}');

    if (users[email] && users[email].password === password) {
        isLoggedIn = true;
        currentUser = { email, username: users[email].username || email.split('@')[0], avatar: users[email].avatar };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('Logged in user:', currentUser);
        updateNavButtons();
        callback('Login successful!');
    } else if (!users[email]) {
        users[email] = { password, username: email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        localStorage.setItem('users', JSON.stringify(users));
        isLoggedIn = true;
        currentUser = { email, username: email.split('@')[0], avatar: 'https://via.placeholder.com/40' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('New user created and logged in:', currentUser);
        updateNavButtons();
        callback('Account created and logged in successfully!');
    } else {
        callback('Invalid email or password.');
    }
}

function updateAccount(email, password, callback) {
    if (!currentUser) {
        callback('Please log in first.');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (email !== currentUser.email && users[email]) {
        callback('Email already in use.');
        return;
    }

    delete users[currentUser.email];
    users[email] = { password, username: currentUser.username, avatar: currentUser.avatar || 'https://via.placeholder.com/40' };
    localStorage.setItem('users', JSON.stringify(users));
    currentUser = { email, username: currentUser.username, avatar: currentUser.avatar || 'https://via.placeholder.com/40' };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    callback('Account updated successfully!');
    updateNavButtons();
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
            accountPic.src = currentUser.avatar || 'https://via.placeholder.com/40';
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
            updateNavButtons(); // Update account pic in nav
        };
        reader.readAsDataURL(file);
    }
}

// Track site visitors (for reference, though not login-related, kept for consistency)
function trackVisitor() {
    let visitors = parseInt(localStorage.getItem('siteVisitors') || '0') + 1;
    localStorage.setItem('siteVisitors', visitors.toString());
    displayCounters();
}

function displayCounters() {
    const siteVisitorsElement = document.querySelector('#site-visitors');
    const totalDownloadsElement = document.querySelector('#total-downloads');
    if (siteVisitorsElement) siteVisitorsElement.textContent = localStorage.getItem('siteVisitors') || '0';
    if (totalDownloadsElement) totalDownloadsElement.textContent = localStorage.getItem('totalDownloads') || '0';
}
