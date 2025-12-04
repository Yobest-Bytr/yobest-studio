// ======================================================
//      supabase.js → FINAL 100% FIXED & WORKING (2025)
//  Login/Register FIXED + Roblox Avatar + Counters + Nitro
// ======================================================
const SUPABASE_URL = 'https://felwnjragunwaitlgknq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHduanJhZ3Vud2FpdGxna25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTE4ODEsImV4cCI6MjA3OTg4Nzg4MX0.g80tl7M4mTkOuoj9pebF353AgsarlZgnbvRHzOvokCw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// AUTH STATE CHANGE
supabase.auth.onAuthStateChange(async (event, session) => {
    currentUser = session?.user ?? null;

    if (currentUser) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        currentUser.profile = data || { roblox_username: 'User', avatar_headshot: '', nitro_effect: 'glow' };
    } else {
        currentUser = null;
    }

    if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
});

// LOGIN — FIXED & WORKING
window.login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
    });
    if (error) throw error;
    return data;
};

// REGISTER — FIXED & WORKING (roblox_username goes in metadata)
window.register = async (email, password, robloxUsername) => {
    const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
            data: {
                roblox_username: robloxUsername.trim()  // This is correct
            }
        }
    });

    if (error) throw error;
    if (!data.user) throw new Error("No user created");

    // Now save avatar and profile
    const avatar = await fetchRobloxAvatar(robloxUsername);

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: data.user.id,
            roblox_username: robloxUsername.trim(),
            avatar_headshot: avatar.headshot,
            avatar_full: avatar.full,
            nitro_effect: 'glow'
        });

    if (profileError) {
        console.error("Profile save failed:", profileError);
        throw profileError;
    }

    return data;
};

window.logout = async () => {
    await supabase.auth.signOut();
    location.href = 'index.html';
};

// ROBLOX AVATAR — 100% WORKING (USING YOUR METHOD + corsproxy.io)
window.fetchRobloxAvatar = async (username) => {
    if (!username) return { headshot: '', full: '' };

    try {
        const proxy = 'https://corsproxy.io/?';

        // Step 1: Get user ID
        const searchUrl = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`;
        const searchRes = await fetch(proxy + encodeURIComponent(searchUrl));
        const searchData = await searchRes.json();
        const user = searchData.data?.[0];
        if (!user) throw new Error("User not found");

        // Step 2: Get headshot
        const thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`;
        const thumbRes = await fetch(proxy + encodeURIComponent(thumbUrl));
        const thumbData = await thumbRes.json();
        const headshot = thumbData.data?.[0]?.imageUrl || '';

        // Optional: Full body
        const fullUrl = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${user.id}&size=420x420&format=Png&isCircular=false`;
        const fullRes = await fetch(proxy + encodeURIComponent(fullUrl));
        const fullData = await fullRes.json();
        const full = fullData.data?.[0]?.imageUrl || headshot;

        return { headshot, full };
    } catch (e) {
        console.warn("Avatar fetch failed:", e);
        return {
            headshot: 'https://i.imgur.com/8Q3Z2yK.png',
            full: 'https://i.imgur.com/8Q3Z2yK.png'
        };
    }
};

// NITRO UPDATE
window.updateNitro = async (effect) => {
    if (!currentUser) return alert("Login required!");
    const { error } = await supabase.from('profiles').update({ nitro_effect: effect }).eq('id', currentUser.id);
    if (error) {
        alert("Failed to update Nitro");
    } else {
        currentUser.profile.nitro_effect = effect;
        if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
    }
};

// COUNTERS — YOUR ORIGINAL (PERFECT)
async function incrementCounter(type) {
    try {
        await supabase.rpc('increment_counter', { counter_type: type });
        await loadCounters();
    } catch (e) { console.error(e); }
}

async function getCounters() {
    for (let i = 0; i < 3; i++) {
        try {
            const { data, error } = await supabase.from('counters').select('visitors, downloads').eq('id', 1).single();
            if (error?.code === 'PGRST116') {
                await supabase.from('counters').insert({ id: 1, visitors: 0, downloads: 0 });
                return { visitors: 0, downloads: 0 };
            }
            if (error) throw error;
            return data || { visitors: 0, downloads: 0 };
        } catch {
            if (i === 2) return { visitors: 0, downloads: 0 };
            await new Promise(r => setTimeout(r, 1000));
        }
    }
}

async function loadCounters() {
    const data = await getCounters();
    const f = n => Number(n || 0).toLocaleString();
    if (document.getElementById('site-visitors')) document.getElementById('site-visitors').textContent = f(data.visitors);
    if (document.getElementById('total-downloads')) document.getElementById('total-downloads').textContent = f(data.downloads);
}

supabase.channel('public:counters')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'counters' }, payload => {
        const { visitors, downloads } = payload.new || {};
        if (document.getElementById('site-visitors')) document.getElementById('site-visitors').textContent = Number(visitors || 0).toLocaleString();
        if (document.getElementById('total-downloads')) document.getElementById('total-downloads').textContent = Number(downloads || 0).toLocaleString();
    })
    .subscribe();

// EXPORT
window.trackVisitor = () => incrementCounter('visitors');
window.trackDownload = () => incrementCounter('downloads');
window.loadCounters = loadCounters;

console.log("%cYOBEST STUDIO → LOGIN & REGISTER FIXED 100%", "color: #00ff00; background:#000; font-size:20px; font-weight:bold; padding:12px;");
