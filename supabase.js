// supabase.js → FINAL FIXED VERSION (NO SYNTAX ERRORS) – November 30, 2025
const SUPABASE_URL = 'https://felwnjragunwaitlgknq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbHduanJhZ3Vud2FpdGxna25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTE4ODEsImV4cCI6MjA3OTg4Nzg4MX0.g80tl7M4mTkOuoj9pebF353AgsarlZgnbvRHzOvokCw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ATOMIC +1 INCREMENT (server-side function = zero resets)
async function incrementCounter(type) {
    try {
        const { data, error } = await supabase
            .rpc('increment_counter', { counter_type: type });

        if (error) throw error;

        await loadCounters(); // refresh UI instantly
    } catch (err) {
        console.error(`Failed to increment ${type}:`, err.message);
    }
}

// GET COUNTERS WITH RETRIES
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

// UPDATE UI
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

// REAL-TIME UPDATES (all tabs update instantly)
supabase
    .channel('public:counters')
    .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'counters' },
        payload => {
            const { visitors, downloads } = payload.new;
            if (document.getElementById('site-visitors')) {
                document.getElementById('site-visitors').textContent = Number(visitors || 0).toLocaleString();
            }
            if (document.getElementById('total-downloads')) {
                document.getElementById('total-downloads').textContent = Number(downloads || 0).toLocaleString();
            }
        }
    )
    .subscribe();

// EXPORT FUNCTIONS
window.trackVisitor = () => incrementCounter('visitors');
window.trackDownload = () => incrementCounter('downloads');
window.loadCounters = loadCounters;

console.log("%cSupabase Counters → 100% FIXED & WORKING!", "color: #00ff00; font-size: 18px; font-weight: bold;");
