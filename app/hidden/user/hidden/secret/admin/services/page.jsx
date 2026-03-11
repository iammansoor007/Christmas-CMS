'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminShell from '../components/AdminShell';
import toast from 'react-hot-toast';

export default function ServicesPage() {
    const [services, setServices] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [deleting, setDeleting] = useState(null);

    const fetchServices = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 10 });
            if (search) params.set('search', search);
            if (statusFilter) params.set('status', statusFilter);
            const res = await fetch(`/api/services?${params}`);
            const data = await res.json();
            setServices(data.services || []);
            setPagination(data.pagination || {});
        } catch {
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    }, [page, search, statusFilter]);

    useEffect(() => { fetchServices(); }, [fetchServices]);

    const handleDelete = async (id, title) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeleting(id);
        try {
            const res = await fetch(`/api/services/${id}`, { method: 'DELETE', credentials: 'include' });
            if (!res.ok) throw new Error();
            toast.success('Service deleted');
            fetchServices();
        } catch {
            toast.error('Failed to delete service');
        } finally {
            setDeleting(null);
        }
    };

    const toggleStatus = async (svc) => {
        const newStatus = svc.status === 'active' ? 'inactive' : 'active';
        try {
            const res = await fetch(`/api/services/${svc._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error();
            toast.success(`Service ${newStatus}`);
            fetchServices();
        } catch {
            toast.error('Failed to update status');
        }
    };

    return (
        <AdminShell>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Services</h1>
                        <p className="text-gray-500 text-sm">{pagination.total ?? 0} total services</p>
                    </div>
                    <Link
                        href="/admin/services/new"
                        id="new-service-btn"
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-500/20"
                    >
                        ➕ New Service
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        id="search-services"
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="flex-1 px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                        className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading...</div>
                    ) : services.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 text-lg">No services found</p>
                            <Link href="/admin/services/new" className="text-amber-400 hover:text-amber-300 text-sm mt-2 inline-block">
                                Create your first service →
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Slug</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {services.map((svc) => (
                                        <tr key={svc._id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${svc.color}20`, border: `1px solid ${svc.color}30` }}>
                                                        {svc.image ? (
                                                            <img src={svc.image} alt={svc.title} className="w-10 h-10 rounded-xl object-cover" />
                                                        ) : '⚡'}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium text-sm">{svc.title}</p>
                                                        <p className="text-gray-500 text-xs line-clamp-1 max-w-xs">{svc.description?.substring(0, 60)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <code className="text-xs text-amber-400 bg-gray-800 px-2 py-1 rounded">{svc.slug}</code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(svc)}
                                                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${svc.status === 'active'
                                                        ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                                                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {svc.status === 'active' ? '● Active' : '○ Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/services/${svc._id}/edit`}
                                                        className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(svc._id, svc.title)}
                                                        disabled={deleting === svc._id}
                                                        className="px-3 py-1.5 text-xs bg-red-950/50 hover:bg-red-900/60 text-red-400 hover:text-red-300 rounded-lg transition-all disabled:opacity-50"
                                                    >
                                                        {deleting === svc._id ? '...' : 'Delete'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                Page {pagination.page} of {pagination.pages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg disabled:opacity-40 transition-all"
                                >
                                    ← Prev
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                                    disabled={page === pagination.pages}
                                    className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg disabled:opacity-40 transition-all"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminShell>
    );
}
