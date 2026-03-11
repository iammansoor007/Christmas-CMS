'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import AdminShell from '../components/AdminShell';
import toast from 'react-hot-toast';

const EMPTY = { title: '', image: '', category: 'General', description: '', status: 'active', order: 0 };
const CATEGORIES = ['General', 'Residential', 'Commercial', 'Permanent', 'Featured'];

export default function GalleryPage() {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const fileRef = useRef();

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 12 });
            if (categoryFilter) params.set('category', categoryFilter);
            const res = await fetch(`/api/gallery?${params}`);
            const data = await res.json();
            setItems(data.items || []);
            setPagination(data.pagination || {});
        } catch { toast.error('Failed to load gallery'); }
        finally { setLoading(false); }
    }, [page, categoryFilter]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const openNew = () => { setEditing(null); setForm(EMPTY); setImagePreview(''); setShowModal(true); };
    const openEdit = (item) => {
        setEditing(item);
        setForm({ title: item.title, image: item.image, category: item.category || 'General', description: item.description || '', status: item.status, order: item.order || 0 });
        setImagePreview(item.image || '');
        setShowModal(true);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        setImagePreview(URL.createObjectURL(file));
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setForm(f => ({ ...f, image: data.path }));
            toast.success('Image uploaded');
        } catch (err) { toast.error(err.message); }
        finally { setUploading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editing ? `/api/gallery/${editing._id}` : '/api/gallery';
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(editing ? 'Updated!' : 'Added to gallery!');
            setShowModal(false);
            fetchItems();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id, title) => {
        if (!confirm(`Remove "${title}" from gallery?`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            toast.success('Deleted');
            fetchItems();
        } catch { toast.error('Failed to delete'); }
        finally { setDeleting(null); }
    };

    return (
        <AdminShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gallery</h1>
                        <p className="text-gray-500 text-sm">{pagination.total ?? 0} images</p>
                    </div>
                    <button id="new-gallery-btn" onClick={openNew}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20">
                        ➕ Upload Image
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto">
                    {['', ...CATEGORIES].map(cat => (
                        <button key={cat}
                            onClick={() => { setCategoryFilter(cat); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${categoryFilter === cat
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-gray-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                                }`}>
                            {cat || 'All'}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
                        <p className="text-4xl mb-3">🖼️</p>
                        <p className="text-gray-500">No gallery items yet. Upload your first image!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {items.map((item) => (
                            <div key={item._id} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all">
                                <div className="aspect-square">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                    />
                                </div>
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                                    <p className="text-white text-xs font-medium text-center line-clamp-2">{item.title}</p>
                                    <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-400">{item.category}</span>
                                    <div className="flex gap-2 mt-1">
                                        <button onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all">Edit</button>
                                        <button onClick={() => handleDelete(item._id, item.title)} disabled={deleting === item._id}
                                            className="px-3 py-1.5 text-xs bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded-lg transition-all disabled:opacity-50">
                                            {deleting === item._id ? '...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                                {/* Status badge */}
                                {item.status === 'inactive' && (
                                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs bg-gray-800/90 text-gray-400">Hidden</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-3">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                            className="px-4 py-2 text-sm bg-gray-900 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white rounded-xl disabled:opacity-40 transition-all">
                            ← Prev
                        </button>
                        <span className="text-gray-500 text-sm">Page {page} of {pagination.pages}</span>
                        <button onClick={() => setPage(p => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                            className="px-4 py-2 text-sm bg-gray-900 border border-gray-700 hover:border-gray-600 text-gray-400 hover:text-white rounded-xl disabled:opacity-40 transition-all">
                            Next →
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">{editing ? 'Edit Image' : 'Upload Image'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white text-xl transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            {/* Image upload */}
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Image *</label>
                                {imagePreview && (
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl border border-gray-700 mb-2" />
                                )}
                                <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} className="hidden" />
                                <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
                                    className="w-full px-4 py-3 bg-gray-800 border border-dashed border-gray-600 hover:border-amber-500 text-gray-400 hover:text-white rounded-xl text-sm transition-all disabled:opacity-50">
                                    {uploading ? '⏳ Uploading...' : imagePreview ? '📁 Change Image' : '📁 Choose Image'}
                                </button>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Title *</label>
                                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Gallery image title" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Status</label>
                                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm">
                                        <option value="active">Active</option>
                                        <option value="inactive">Hidden</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Optional description" />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-all">Cancel</button>
                                <button type="submit" disabled={saving || !form.image}
                                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50">
                                    {saving ? '⏳ Saving...' : editing ? '✓ Update' : '✓ Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
