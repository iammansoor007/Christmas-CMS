'use client';
import Link from 'next/link';
import AdminShell from '../components/AdminShell';

const pages = [
  { slug: 'global', label: 'Global Sections', description: 'Shared content like CTA, map, badges.' },
  { slug: 'about', label: 'About Page', description: 'Hero, founder story, mission, images.' },
  { slug: 'contact', label: 'Contact Page', description: 'Form copy, budgets, lighting areas, benefits.' },
  { slug: 'service-area', label: 'Service Area Page', description: 'Hero, communities, service area list.' },
  { slug: 'privacy', label: 'Privacy Policy', description: 'Legal content, last updated, contact info.' },
  { slug: 'terms', label: 'Terms & Conditions', description: 'Legal content, last updated, contact info.' },
];

export default function PagesIndex() {
  return (
    <AdminShell>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Pages</h1>
          <p className="text-gray-500 text-sm">Edit page-specific content and shared sections.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page) => (
            <div key={page.slug} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-3">
              <div>
                <h2 className="text-white font-semibold">{page.label}</h2>
                <p className="text-gray-500 text-sm">{page.description}</p>
              </div>
              <div className="mt-auto">
                <Link
                  href={`/admin/pages/${page.slug}`}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 text-white text-sm font-semibold hover:from-red-500 hover:to-amber-500 transition-all"
                >
                  Edit Content
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
