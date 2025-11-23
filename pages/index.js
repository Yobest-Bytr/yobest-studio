import Head from 'next/head';
import AnalyticsDisplay from '../components/AnalyticsDisplay';

export default function Home() {
  return (
    <>
      <Head>
        <title>Yobest Studio</title>
        {/* OLD: <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js"></script> REMOVED */}
        {/* OLD: <script src="https://www.gstatic.com/firebasejs/9.x.x/firebase-database-compat.js"></script> REMOVED */}
      </Head>
      <main>
        <AnalyticsDisplay />
        {/* Rest of your content */}
      </main>
    </>
  );
}
