// public/script.js - Fully Updated & Firebase-Free (2025)
// Uses Vercel Blob via /api/visitors and /api/downloads
// Works perfectly on Vercel with zero conflicts

console.log("%cYobest Studio Scripts Loaded", "color: #00ff88; font-size: 14px;");

// === 1. Track Visitor on Page Load (runs once per visit) ===
(function trackVisitor() {
  // Use navigator.sendBeacon for reliable tracking even if user closes tab quickly
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/visitors', '');
  } else {
    fetch('/api/visitors', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' }
    }).catch(() => {});
  }
})();

// === 2. Handle All Download Buttons/Links ===
document.addEventListener('DOMContentLoaded', function () {
  // Find all elements that trigger a download (adjust selector if needed)
  const downloadTriggers = document.querySelectorAll('a[href$=".apk"], a[href$=".zip"], a[href*="/download"], .download-btn, [data-download]');

  downloadTriggers.forEach(element => {
    element.addEventListener('click', function (e) {
      // Optional: prevent default only if you want to handle download manually
      // e.preventDefault();

      const downloadUrl = this.getAttribute('href') || this.dataset.download;

      if (!downloadUrl) return;

      // Open the file (normal download behavior)
      window.open(downloadUrl, '_blank');

      // Track download count via Vercel Blob
      fetch('/api/downloads', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.ok && res.json())
      .then(data => {
        console.log('%cDownload Tracked! Total:', 'color: #00ff88;', data?.downloads || 'updated');
      })
      .catch(err => {
        console.warn('Download tracking failed (non-critical):', err);
      });
    });
  });

  console.log(`Found ${downloadTriggers.length} download trigger(s) and attached tracking.`);
});

// === 3. Optional: Refresh Analytics Display Every 30 Seconds ===
(function autoRefreshAnalytics() {
  const analyticsElement = document.querySelector('.analytics');
  if (!analyticsElement) return;

  setInterval(() => {
    fetch('/api/analytics')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          document.querySelectorAll('[data-visitors]').forEach(el => {
            el.textContent = Number(data.visitors).toLocaleString();
          });
          document.querySelectorAll('[data-downloads]').forEach(el => {
            el.textContent = Number(data.downloads).toLocaleString();
          });
        }
      })
      .catch(() => {});
  }, 30000);
})();

// === 4. Optional: Smooth Scroll, Mobile Menu, etc. (keep your existing features below) ===
// Example: Mobile menu toggle (adjust selectors to match your HTML)
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }
});

// Add any other non-Firebase scripts you had below this line
// (e.g. particles.js, animations, theme switcher, etc.)

console.log("%cAll tracking active: Vercel Blob + Firebase removed", "color: cyan; font-weight: bold;");
