'use client';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuickQuote from './components/QuickQuote';

export default function ClientLayout({ children }) {
    return (
        <>
            <Navbar />
            <QuickQuote />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}