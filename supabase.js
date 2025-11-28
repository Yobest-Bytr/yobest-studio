// supabase.js → FULLY WORKING +1 INCREMENT (November 28, 2025)
const SUPABASE_URL = 'https://felwnjragunwaitlgknq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHduanJhZ3Vud2FpdGxna25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTE4ODEsImV4cCI6MjA3OTg4Nzg4MX0.g80tl7M4mTkOuoj9pebF353AgsarlZgnbvRHzOvokCw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// FUNCTION THAT ACTUALLY +1 (THIS IS THE FIX!)
async function incrementCounter(type) {
    try {
        // First get current value
        const { data } = await supabase
            .from('counters')
            .select(type)
            .eq('id', 1)
            .single();

        const current = data?.[type] || 0;

        // Then update with +1
        const { error } = await supabase
            .from('counters')
            .update({ [type]: current + 1 })
            .eq('id', 1);

        if (error) throw error;

        // Refresh display instantly
        await loadCounters();
    } catch (err) {
        console.error("Increment failed:", err);
    }
}

async function getCounters() {
    try {
        let { data, error } = await supabase
            .from('counters')
            .select('visitors, downloads')
            .eq('id', 1)
            .single();

        if (error && error.code === 'PGRST116') {
            // No row → create it
            await supabase.from('counters').insert({ id: 1, visitors: 0, downloads: 0 });
            return { visitors: 0, downloads: 0 };
        }
        if (error) throw error;
        return data;
    } catch (err) {
        console.error("getCounters error:", err);
        return { visitors: 0, downloads: 0 };
    }
}

async function loadCounters() {
    const data = await getCounters();
    if (document.getElementById('site-visitors')) {
        document.getElementById('site-visitors').textContent = Number(data.visitors || 0).toLocaleString();
    }
    if (document.getElementById('total-downloads')) {
        document.getElementById('total-downloads').textContent = Number(data.downloads || 0).toLocaleString();
    }
}

// Real-time listener (optional – updates all tabs instantly)
supabase
    .channel('counters-channel')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'counters' }, payload => {
        const newData = payload.new;
        if (document.getElementById('site-visitors')) {
            document.getElementById('site-visitors').textContent = Number(newData.visitors || 0).toLocaleString();
        }
        if (document.getElementById('total-downloads')) {
            document.getElementById('total-downloads').textContent = Number(newData.downloads || 0).toLocaleString();
        }
    })
    .subscribe();

// EXPORT FUNCTIONS TO WINDOW
window.trackVisitor = () => incrementCounter('visitors');
window.trackDownload = () => incrementCounter('downloads');
window.loadCounters = loadCounters;

console.log("%cSupabase Counter System → READY & WORKING!", "color: #00ff00; font-weight: bold;");
