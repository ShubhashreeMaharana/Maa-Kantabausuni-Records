import { useEffect, useState } from 'react';

export default function Dashboard({ supabase }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');

  function onFile(e) {
    setFile(e.target.files[0]);
  }

  async function upload(e) {
    e.preventDefault();
    if (!file) return alert('Choose a file');

    const form = new FormData();
    form.append('file', file);
    form.append('title', title);

    setStatus('Uploading...');
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const json = await res.json();
    if (json.ok) setStatus('Uploaded — background checks queued');
    else setStatus('Upload failed');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Artist Dashboard</h1>
      <form onSubmit={upload} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm">Audio file (WAV/FLAC/MP3)</label>
          <input type="file" accept="audio/*" onChange={onFile} />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload</button>
        </div>
        <div className="text-sm text-gray-600">{status}</div>
      </form>
    </div>
  );
}
