import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home({ supabase }) {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/tracks-list');
      const json = await res.json();
      setTracks(json.tracks || []);
    }
    load();
  }, []);

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-bold">Welcome to Maa Kantabausuni Records</h1>
        <p className="text-gray-600">Discover and upload music — publisher and copyright are fixed.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Latest uploads</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tracks.map(t => (
            <Link key={t.id} href={`/track/${t.id}`}>
              <a className="p-4 border rounded hover:shadow">
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-500">{t.publisher_p_line}</div>
              </a>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
