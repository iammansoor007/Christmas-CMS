'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '🏠', exact: true },
    { href: '/admin/services', label: 'Services', icon: '⚡' },
    { href: '/admin/homepage', label: 'Homepage', icon: '🏡' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/admin/recent-work', label: 'Recent Work', icon: '🖼️' },
    { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
];

export default function AdminShell({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(d => d.user && setUser(d.user));
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        toast.success('Logged out');
        router.push('/admin/login');
    };

    const isActive = (item) =>
        item.exact ? pathname === item.href : pathname.startsWith(item.href);

    return (
        <div className="flex h-screen bg-gray-950 overflow-hidden">
            {/* Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-lg">🎄</div>
                    <div>
                        <p className="font-bold text-white text-sm leading-tight">Christmas CMS</p>
                        <p className="text-gray-500 text-xs">Admin Panel</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive(item)
                                    ? 'bg-gradient-to-r from-red-600/30 to-amber-600/10 text-amber-400 border border-amber-500/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User footer */}
                <div className="px-4 py-4 border-t border-gray-800">
                    {user && (
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-xs font-bold">
                                {user.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors"
                    >
                        <span>🚪</span> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-4 flex-shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex-1" />
                    <Link
                        href="/"
                        target="_blank"
                        className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                    >
                        <span>🔗</span> View Site
                    </Link>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}



