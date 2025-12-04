// ======================================================
//      supabase.js → FINAL ULTIMATE VERSION (2025)
//  Counters + Auth + Profiles + Nitro + Real-time
// ======================================================
const SUPABASE_URL = 'https://felwnjragunwaitlgknq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHduanJhZ3Vud2FpdGxna25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTE4ODEsImV4cCI6MjA3OTg4Nzg4MX0.g80tl7M4mTkOuoj9pebF353AgsarlZgnbvRHzOvokCw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== CURRENT USER (GLOBAL) ====================
let currentUser = null;

// Listen to auth changes (login/logout)
supabase.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user ?? null;
    if (typeof updateAuthUI === 'function') updateAuthUI();
    if (typeof loadUserProfile === 'function') loadUserProfile();
});

// ==================== AUTH FUNCTIONS ====================
async function login(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
}

async function register(email, password, robloxUsername) {
    // First sign up
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { roblox_username: robloxUsername }
        }
    });
    if (error) throw error;

    // Fetch Roblox avatar
    const avatar = await fetchRobloxAvatar(robloxUsername);

    // Update profile with avatar
    await supabase
        .from('profiles')
        .upsert({
            id: data.user.id,
            roblox_username: robloxUsername,
            avatar_headshot: avatar.headshot,
            avatar_full: avatar.full,
            nitro_effect: 'none'
        });

    return data;
}

async function logout() {
    await supabase.auth.signOut();
    location.href = '/index.html';
}

// ==================== ROBLOX AVATAR FETCH ====================
async function fetchRobloxAvatar(username) {
    if (!username) return { headshot: '', full: '' };
    try {
        // Find user ID
        const searchRes = await fetch(`https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=1`);
        const searchData = await searchRes.json();
        const user = searchData.data?.[0];
        if (!user) return { headshot: '', full: '' };

        // Get headshot
        const headRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png`);
        const headData = await headRes.json();
        const headshot = headData.data[0]?.imageUrl || '';

        // Get full body
        const fullRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=420x420&format=Png`);
        const fullData = await fullRes.json();
        const full = fullData.data[0]?.imageUrl || '';

        return { headshot, full };
    } catch (err) {
        console.warn("Avatar fetch failed:", err);
        return {
            headshot: 'https://i.imgur.com/8Q3Z2yK.png',
            full: 'https://i.imgur.com/8Q3Z2yK.png'
        };
    }
}

// ==================== NITRO EFFECT UPDATE ====================
async function updateNitro(effect) {
    if (!currentUser) return alert("You must be logged in!");
    const valid = ['none', 'glow', 'rainbow', 'fire', 'galaxy'];
    if (!valid.includes(effect)) effect = 'none';

    const { error } = await supabase
        .from('profiles')
        .update({ nitro_effect: effect })
        .eq('id', currentUser.id);

    if (error) {
        alert("Failed to update Nitro effect");
        console.error(error);
    } else {
        alert(`Nitro effect set to: ${effect.toUpperCase()}!`);
        // Update currentUser metadata in memory
        if (currentUser.user_metadata) {
            currentUser.user_metadata.nitro_effect = effect;
        }
    }
}

// ==================== COUNTERS (Your Original Working System) ====================
async function incrementCounter(type) {
    try {
        const { error } = await supabase.rpc('increment_counter', { counter_type: type });
        if (error) throw error;
        await loadCounters();
    } catch (err) {
        console.error(`Failed to increment ${type}:`, err.message);
    }
}

async function getCounters() {
    for (let i = 0; i < 3; i++) {
        try {
            const { data, error } = await supabase
                .from('counters')
                .select('visitors, downloads')
                .eq('id', 1)
                .single();

            if (error?.code === 'PGRST116') {
                await supabase.from('counters').insert({ id: 1, visitors: 0, downloads: 0 });
                return { visitors: 0, downloads: 0 };
            }
            if (error) throw error;

            return data || { visitors: 0, downloads: 0 };
        } catch (err) {
            console.warn(`Counter read attempt ${i + 1} failed:`, err.message);
            if (i === 2) return { visitors: 0, downloads: 0 };
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        }
    }
}

async function loadCounters() {
    const data = await getCounters();
    const format = n => Number(n || 0).toLocaleString();

    if (document.getElementById('site-visitors')) {
        document.getElementById('site-visitors').textContent = format(data.visitors);
    }
    if (document.getElementById('total-downloads')) {
        document.getElementById('total-downloads').textContent = format(data.downloads);
    }
}

// Real-time counter updates
supabase
    .channel('public:counters')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'counters' }, payload => {
        const { visitors, downloads } = payload.new;
        if (document.getElementById('site-visitors')) {
            document.getElementById('site-visitors').textContent = Number(visitors || 0).toLocaleString();
        }
        if (document.getElementById('total-downloads')) {
            document.getElementById('total-downloads').textContent = Number(downloads || 0).toLocaleString();
        }
    })
    .subscribe();

// ==================== EXPORT GLOBAL FUNCTIONS ====================
window.supabase = supabase;
window.currentUser = () => currentUser;

window.login = login;
window.register = register;
window.logout = logout;
window.fetchRobloxAvatar = fetchRobloxAvatar;
window.updateNitro = updateNitro;

window.trackVisitor = () => incrementCounter('visitors');
window.trackDownload = () => incrementCounter('downloads');
window.loadCounters = loadCounters;

console.log("%cYOBEST STUDIO → SUPABASE FULLY LOADED (Counters + Auth + Nitro)", "color: #ff00ff; font-size: 20px; font-weight: bold; background: #000; padding: 10px; border-radius: 10px;");
