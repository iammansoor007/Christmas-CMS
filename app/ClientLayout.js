// app/ClientLayout.js
'use client';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import QuickQuote from './components/QuickQuote'; // COMMENT THIS OUT

export default function ClientLayout({ children }) {
    return (
        <>
            <Navbar />
            {/* <QuickQuote /> */} {/* COMMENT THIS OUT */}
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}