import { useState, useEffect } from "react";

export default function AnalyticsDisplay() {
  const [analytics, setAnalytics] = useState({ visitors: 0, downloads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30s for live updates
  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading metrics...</div>;

  return (
    <div className="analytics">
      <h3>Site Metrics</h3>
      <p>Site Visitors: {analytics.visitors.toLocaleString()}</p>
      <p>Total Downloads: {analytics.downloads.toLocaleString()}</p>
    </div>
  );
}
