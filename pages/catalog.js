import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Catalog() {
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
      <h1 className="text-2xl font-bold mb-4">Catalog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map(t => (
          <Link key={t.id} href={`/track/${t.id}`}>
            <a className="p-4 border rounded hover:shadow flex items-center justify-between">
              <div>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-500">{t.publisher_p_line}</div>
              </div>
              <div className="text-sm text-gray-400">Play</div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
