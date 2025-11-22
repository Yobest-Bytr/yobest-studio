import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [visitors, setVisitors] = useState(0);
  const [downloads, setDownloads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data
  useEffect(() => {
    fetch('/api/analytics')
      .then(res => {
        if (!res.ok) throw new Error('Fetch failed');
        return res.json();
      })
      .then(data => {
        setVisitors(data.visitors || 0);
        setDownloads(data.downloads || 0);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Increment visitors on page load (avoid duplicates with a session check if needed)
    fetch('/api/analytics/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metric: 'visitors' }),
    }).catch(console.error);  // Fire-and-forget
  }, []);

  // Example: Increment downloads on button click (adapt to your download link)
  const handleDownload = async () => {
    // Your download logic here, e.g., window.location = '/download/file.zip';
    await fetch('/api/analytics/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metric: 'downloads' }),
    });
    // Then trigger download
  };

  if (loading) return <p>Loading metrics...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Site Stats</h2>
      <p>Site Visitors: {visitors}</p>
      <p>Total Downloads: {downloads}</p>
      <button onClick={handleDownload}>Download (Increments Counter)</button>
    </div>
  );
}
