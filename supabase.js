// supabase.js
const SUPABASE_URL = 'https://felwnjragunwaitlgknq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHduanJhZ3Vud2FpdGxna25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTE4ODEsImV4cCI6MjA3OTg4Nzg4MX0.g80tl7M4mTkOuoj9pebF353AgsarlZgnbvRHzOvokCw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function incrementCounter(type) {
    try {
        const { data, error } = await supabase
            .from('counters')
            .upsert({ id: 1, [type]: supabase.raw(`${type} + 1`) }, { onConflict: 'id' })
            .select();
        if (error) throw error;
        return data[0];
    } catch (err) {
        console.error("Supabase error:", err);
    }
}

async function getCounters() {
    try {
        const { data, error } = await supabase
            .from('counters')
            .select('*')
            .eq('id', 1)
            .single();
        if (error && error.code === 'PGRST116') {
            // Table empty → create first row
            await supabase.from('counters').insert({ id: 1, visitors: 0, downloads: 0 });
            return { visitors: 0, downloads: 0 };
        }
        if (error) throw error;
        return data || { visitors: 0, downloads: 0 };
    } catch (err) {
        console.error("Failed to load counters:", err);
        return { visitors: 0, downloads: 0 };
    }
}

// Real-time listener (optional, for instant updates across tabs)
supabase
    .channel('public:counters')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'counters' }, payload => {
        updateCounterDisplay(payload.new);
    })
    .subscribe();

function updateCounterDisplay(data) {
    if (document.getElementById('site-visitors')) {
        document.getElementById('site-visitors').textContent = Number(data.visitors || 0).toLocaleString();
    }
    if (document.getElementById('total-downloads')) {
        document.getElementById('total-downloads').textContent = Number(data.downloads || 0).toLocaleString();
    }
}

async function loadCounters() {
    const data = await getCounters();
    updateCounterDisplay(data);
}

// Track visitor on page load
async function trackVisitor() {
    await incrementCounter('visitors');
}

// Track download click
async function trackDownload() {
    await incrementCounter('downloads');
}

window.trackDownload = trackDownload;
window.loadCounters = loadCounters;
window.trackVisitor = trackVisitor;
