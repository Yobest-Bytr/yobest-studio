import { useEffect } from 'react';
import '../styles/globals.css'; // Assuming global styles

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetch('/api/visitors', { method: 'POST' })
      .catch(err => console.error('Visitor tracking failed:', err));
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
