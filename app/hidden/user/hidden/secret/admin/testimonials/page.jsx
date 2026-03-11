'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import AdminShell from '../components/AdminShell';
import toast from 'react-hot-toast';

const EMPTY = { quote: '', author: '', role: '', company: '', rating: 5, image: '', location: '', service: '', status: 'active' };

export default function TestimonialsPage() {
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null); // null = new, object = existing
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef();

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/testimonials?page=${page}&limit=10`);
            const data = await res.json();
            setItems(data.testimonials || []);
            setPagination(data.pagination || {});
        } catch { toast.error('Failed to load testimonials'); }
        finally { setLoading(false); }
    }, [page]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
    const openEdit = (item) => {
        setEditing(item);
        setForm({ quote: item.quote, author: item.author, role: item.role || '', company: item.company || '', rating: item.rating || 5, image: item.image || '', location: item.location || '', service: item.service || '', status: item.status });
        setShowModal(true);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
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
            const url = editing ? `/api/testimonials/${editing._id}` : '/api/testimonials';
            const method = editing ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success(editing ? 'Testimonial updated!' : 'Testimonial created!');
            setShowModal(false);
            fetchItems();
        } catch (err) { toast.error(err.message); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id, author) => {
        if (!confirm(`Delete testimonial by "${author}"?`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
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
                        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
                        <p className="text-gray-500 text-sm">{pagination.total ?? 0} total testimonials</p>
                    </div>
                    <button id="new-testimonial-btn" onClick={openNew}
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20">
                        ➕ New Testimonial
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 bg-gray-900 rounded-2xl border border-gray-800">
                        <p className="text-gray-500">No testimonials yet. Create your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <div key={item._id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5 hover:border-gray-700 transition-all">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                        {item.image ? (
                                            <img src={item.image} alt={item.author} className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white font-bold text-sm">
                                                {item.author?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-medium text-sm">{item.author}</p>
                                            <p className="text-gray-500 text-xs">{item.role}{item.company ? ` · ${item.company}` : ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${item.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                                            {item.status}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-3 italic mb-4">"{item.quote}"</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <span key={s} className={s <= item.rating ? 'text-amber-400' : 'text-gray-700'}>★</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(item)} className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all">Edit</button>
                                        <button onClick={() => handleDelete(item._id, item.author)} disabled={deleting === item._id}
                                            className="px-3 py-1.5 text-xs bg-red-950/50 hover:bg-red-900/60 text-red-400 rounded-lg transition-all disabled:opacity-50">
                                            {deleting === item._id ? '...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
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
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white transition-colors text-xl">✕</button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Quote *</label>
                                <textarea required value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} rows={3}
                                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm resize-none"
                                    placeholder="Customer review text..." />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Author Name *</label>
                                    <input type="text" required value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Sarah Johnson" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Role</label>
                                    <input type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Homeowner" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Company</label>
                                    <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Company Name" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Location</label>
                                    <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Portland, OR" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Service</label>
                                    <input type="text" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="Residential Lighting" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Rating</label>
                                    <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: Number(e.target.value) }))}
                                        className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm">
                                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Avatar image</label>
                                <div className="flex gap-3 items-center">
                                    {form.image && <img src={form.image} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-700" />}
                                    <input type="file" ref={fileRef} accept="image/*" onChange={handleUpload} className="hidden" />
                                    <button type="button" onClick={() => fileRef.current.click()} disabled={uploading}
                                        className="flex-1 px-3 py-2 bg-gray-800 border border-dashed border-gray-600 hover:border-amber-500 text-gray-400 hover:text-white rounded-xl text-sm transition-all disabled:opacity-50 text-center">
                                        {uploading ? '⏳ Uploading...' : '📁 Choose Photo'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Status</label>
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm">
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-sm transition-all">Cancel</button>
                                <button type="submit" disabled={saving}
                                    className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50">
                                    {saving ? '⏳ Saving...' : editing ? '✓ Update' : '✓ Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminShell>
    );
}
