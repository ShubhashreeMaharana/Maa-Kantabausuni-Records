import '../styles/globals.css';
import { createBrowserSupabaseClient } from '@supabase/supabase-js';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header supabase={supabaseClient} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Component {...pageProps} supabase={supabaseClient} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
