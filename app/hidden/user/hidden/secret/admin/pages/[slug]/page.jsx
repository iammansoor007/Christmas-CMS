'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminShell from '../../components/AdminShell';
import toast from 'react-hot-toast';

export default function PageEditor() {
  const { slug } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jsonText, setJsonText] = useState('{\n  \n}');

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/pages/${slug}`)
      .then(r => r.json())
      .then(d => {
        const data = d.page?.data || {};
        setJsonText(JSON.stringify(data, null, 2));
      })
      .catch(() => toast.error('Failed to load page content'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText || '{}');
      setJsonText(JSON.stringify(parsed, null, 2));
    } catch (err) {
      toast.error('Invalid JSON');
    }
  };

  const handleSave = async () => {
    let parsed;
    try {
      parsed = JSON.parse(jsonText || '{}');
    } catch (err) {
      toast.error('Invalid JSON. Please fix before saving.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error();
      toast.success('Page content saved');
    } catch {
      toast.error('Failed to save page content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white capitalize">{slug} Content</h1>
            <p className="text-gray-500 text-sm">Edit the JSON content for this page.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
            >
              Back
            </button>
            <button
              onClick={handleFormat}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700"
            >
              Format JSON
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-lg text-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={28}
            className="w-full bg-gray-950 text-gray-200 font-mono text-xs sm:text-sm p-4 rounded-xl border border-gray-800 focus:outline-none focus:border-amber-500"
          />
          <p className="text-xs text-gray-500 mt-3">
            Tip: Paste structured JSON for this page. If empty, the page will use its built-in defaults.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
