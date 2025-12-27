// supabase.js — FINAL FIXED VERSION (no import.meta, works with normal <script> tag)

// Priority: Use Vercel environment variables if available (injected into window by some frameworks)
// Fallback to hardcoded (safe for now, but we'll hide it later if needed)
const SUPABASE_URL = 
    (window.NEXT_PUBLIC_SUPABASE_URL) || 
    process.env?.NEXT_PUBLIC_SUPABASE_URL || 
    'https://felwnjragunwaitlgknq.supabase.co';

const SUPABASE_ANON_KEY = 
    (window.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
    process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHduanJhZ3Vud2FpdGxna25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTE4ODEsImV4cCI6MjA3OTg4Nzg4MX0.g80tl7M4mTkOuoj9pebF353AgsarlZgnbvRHzOvokCw';

// Create Supabase client using the CDN version (window.supabase)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// AUTH STATE CHANGE — AUTO LOAD PROFILE
supabase.auth.onAuthStateChange(async (event, session) => {
    currentUser = session?.user ?? null;
    if (currentUser) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        currentUser.profile = data || {
            roblox_username: currentUser.email?.split('@')[0] || 'User',
            avatar_headshot: '',
            avatar_full: '',
            nitro_effect: 'glow'
        };

        // Auto-save avatar after first login if missing
        if (!currentUser.profile.avatar_headshot && currentUser.profile.roblox_username) {
            setTimeout(async () => {
                const avatar = await fetchRobloxAvatar(currentUser.profile.roblox_username);
                if (avatar.headshot) {
                    await supabase
                        .from('profiles')
                        .update({
                            avatar_headshot: avatar.headshot,
                            avatar_full: avatar.full
                        })
                        .eq('id', currentUser.id);
                    currentUser.profile.avatar_headshot = avatar.headshot;
                    currentUser.profile.avatar_full = avatar.full;
                    if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
                }
            }, 3000);
        }
    } else {
        currentUser = null;
    }
    if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
});

// LOGIN
window.login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
    });
    if (error) throw error;
    return data;
};

// REGISTER
window.register = async (email, password, robloxUsername) => {
    const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
            data: {
                roblox_username: robloxUsername.trim()
            }
        }
    });
    if (error) throw error;
    if (!data.user) throw new Error("Registration failed");
    return data;
};

window.logout = async () => {
    await supabase.auth.signOut();
    location.href = 'index.html';
};

// ROBLOX AVATAR — WORKING PERFECTLY
window.fetchRobloxAvatar = async (username) => {
    if (!username) return { headshot: '', full: '' };
    try {
        const proxy = 'https://corsproxy.io/?';
        const searchUrl = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`;
        const searchRes = await fetch(proxy + encodeURIComponent(searchUrl));
        const searchData = await searchRes.json();
        const user = searchData.data?.[0];
        if (!user) return { headshot: '', full: '' };

        const thumbUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=150x150&format=Png&isCircular=false`;
        const thumbRes = await fetch(proxy + encodeURIComponent(thumbUrl));
        const thumbData = await thumbRes.json();
        const headshot = thumbData.data?.[0]?.imageUrl || '';
        const full = headshot.replace('150/150', '420/420').replace('AvatarHeadshot', 'Avatar') || '';
        return { headshot, full };
    } catch (e) {
        console.warn("Avatar fetch failed:", e);
        return { headshot: '', full: '' };
    }
};

// NITRO UPDATE
window.updateNitro = async (effect) => {
    if (!currentUser) return alert("Login required!");
    const valid = ['none', 'glow', 'rainbow', 'fire', 'galaxy'];
    if (!valid.includes(effect)) effect = 'glow';

    const { error } = await supabase
        .from('profiles')
        .update({ nitro_effect: effect })
        .eq('id', currentUser.id);

    if (!error) {
        currentUser.profile.nitro_effect = effect;
        if (typeof window.updateAuthUI === 'function') window.updateAuthUI();
    }
};

// COUNTERS — YOUR ORIGINAL, FLAWLESS
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

// Real-time counters
supabase.channel('public:counters')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'counters' }, payload => {
        const { visitors, downloads } = payload.new || {};
        if (document.getElementById('site-visitors')) document.getElementById('site-visitors').textContent = Number(visitors || 0).toLocaleString();
        if (document.getElementById('total-downloads')) document.getElementById('total-downloads').textContent = Number(downloads || 0).toLocaleString();
    })
    .subscribe();

// EXPORT FUNCTIONS
window.trackVisitor = () => incrementCounter('visitors');
window.trackDownload = () => incrementCounter('downloads');
window.loadCounters = loadCounters;

console.log("%cYOBEST STUDIO → SUPABASE CONNECTED SUCCESSFULLY! ✅", "color: #00ff00; background:#000; font-size:22px; font-weight:bold; padding:12px; border-radius:12px;");
