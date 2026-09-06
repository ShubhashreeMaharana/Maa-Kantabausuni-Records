import Link from 'next/link';
import { useEffect, useState } from 'react';
import { strings } from '../src/i18n';

export default function Header({ supabase }) {
  const [session, setSession] = useState(null);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (saved) setLang(saved);
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  function toggleLang() {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('lang', next);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  const t = strings[lang];

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/">
            <a className="font-bold text-xl">Maa Kantabausuni Records</a>
          </Link>
        </div>
        <nav className="space-x-4 flex items-center">
          <Link href="/catalog"><a className="mr-4">{t.catalog}</a></Link>
          <Link href="/dashboard"><a className="mr-4">{t.dashboard}</a></Link>
          <button onClick={toggleLang} className="mr-4 border px-2 rounded">{lang === 'en' ? 'HI' : 'EN'}</button>
          {session ? (
            <button onClick={signOut} className="ml-4">Sign out</button>
          ) : (
            <Link href="/"><a className="ml-4">Sign in</a></Link>
          )}
        </nav>
      </div>
    </header>
  );
}
