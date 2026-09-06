import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header({ supabase }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/">
            <a className="font-bold text-xl">Maa Kantabausuni Records</a>
          </Link>
        </div>
        <nav className="space-x-4">
          <Link href="/catalog"><a>Catalog</a></Link>
          <Link href="/dashboard"><a>Dashboard</a></Link>
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
