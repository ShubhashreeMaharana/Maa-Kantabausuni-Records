import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function TrackPage() {
  const router = useRouter();
  const { id } = router.query;
  const [track, setTrack] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const res = await fetch(`/api/tracks/${id}`);
      if (!res.ok) return;
      const json = await res.json();
      setTrack(json.track);
    }
    load();
  }, [id]);

  if (!track) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{track.title}</h1>
      <div className="text-sm text-gray-600 mb-4">Publisher: {track.publisher_p_line}</div>

      <div className="mb-4">
        {track.signed_url ? (
          <audio controls src={track.signed_url} className="w-full" />
        ) : (
          <div className="text-sm text-red-500">Streaming unavailable</div>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">Validation status: {track.validation_status}</div>

      {track.price_cents > 0 ? (
        <form action="/api/create-checkout-session" method="POST">
          <input type="hidden" name="track_id" value={track.id} />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Buy for {track.price_cents / 100} INR</button>
        </form>
      ) : null}
    </div>
  );
}
