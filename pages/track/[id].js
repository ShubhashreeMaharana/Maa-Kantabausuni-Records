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
        <audio controls src={track.file_url} className="w-full" />
      </div>

      <div className="text-sm text-gray-500">Validation status: {track.validation_status}</div>
    </div>
  );
}
