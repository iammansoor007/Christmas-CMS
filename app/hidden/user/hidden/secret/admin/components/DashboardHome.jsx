'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const statCards = [
    { label: 'Services', icon: '⚡', href: '/admin/services', color: 'from-blue-600 to-blue-400', api: '/api/services?limit=1' },
    { label: 'Testimonials', icon: '⭐', href: '/admin/testimonials', color: 'from-amber-600 to-amber-400', api: '/api/testimonials?limit=1' },
    { label: 'Gallery Items', icon: '🖼️', href: '/admin/gallery', color: 'from-emerald-600 to-emerald-400', api: '/api/gallery?limit=1' },
    { label: 'Recent Work', icon: '🖼️', href: '/admin/recent-work', color: 'from-purple-600 to-purple-400', api: '/api/recent-work?limit=1' },
];

const quickLinks = [
    { label: 'Add Service', href: '/admin/services/new', icon: '➕' },
    { label: 'Edit Homepage', href: '/admin/homepage', icon: '✏️' },
    { label: 'Add Testimonial', href: '/admin/testimonials', icon: '⭐' },
    { label: 'Upload to Gallery', href: '/admin/gallery', icon: '🖼️' },
    { label: 'Recent Work', href: '/admin/recent-work', icon: '🖼️' },
    { label: 'Site Settings', href: '/admin/settings', icon: '⚙️' },
    { label: 'View Live Site', href: '/', icon: '🔗', external: true },
];

export default function DashboardHome() {
    const [stats, setStats] = useState({});
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        statCards.forEach(async (card) => {
            try {
                const res = await fetch(card.api);
                const data = await res.json();
                setStats(prev => ({ ...prev, [card.label]: data.pagination?.total ?? 0 }));
            } catch { }
        });
    }, []);

    const handleSeed = async () => {
        if (!confirm('This will seed / reset the database from data.json. Continue?')) return;
        setSeeding(true);
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            toast.success('Database seeded successfully!');
            // re-fetch stats
            statCards.forEach(async (card) => {
                const r = await fetch(card.api);
                const d = await r.json();
                setStats(prev => ({ ...prev, [card.label]: d.pagination?.total ?? 0 }));
            });
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Welcome to your Christmas Lighting CMS</p>
                </div>
                <button
                    onClick={handleSeed}
                    disabled={seeding}
                    id="seed-btn"
                    className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 hover:text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                    {seeding ? '⏳ Seeding...' : '🌱 Seed Database'}
                </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((card) => (
                    <Link key={card.label} href={card.href} className="group block">
                        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-gray-600 transition-all duration-200 hover:scale-[1.02]">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-xl mb-4 shadow-lg`}>
                                {card.icon}
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">
                                {stats[card.label] !== undefined ? stats[card.label] : '—'}
                            </p>
                            <p className="text-gray-500 text-sm">{card.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            target={link.external ? '_blank' : undefined}
                            className="flex items-center gap-3 p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 hover:bg-gray-800 transition-all group"
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-red-950/40 to-amber-950/20 border border-red-800/40 rounded-2xl p-6 flex gap-4 items-start">
                <span className="text-2xl">💡</span>
                <div>
                    <p className="text-white font-medium mb-1">First time setup</p>
                    <p className="text-gray-400 text-sm">
                        Make sure your <code className="text-amber-400 bg-gray-800 px-1 py-0.5 rounded text-xs">MONGODB_URI</code> is set in{' '}
                        <code className="text-amber-400 bg-gray-800 px-1 py-0.5 rounded text-xs">.env.local</code>, then hit{' '}
                        <strong className="text-white">Seed Database</strong> to import your existing content from{' '}
                        <code className="text-amber-400 bg-gray-800 px-1 py-0.5 rounded text-xs">data.json</code>.
                    </p>
                </div>
            </div>
        </div>
    );
}

