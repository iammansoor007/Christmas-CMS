import { Montserrat } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';
import connectDB from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  await connectDB();
  const settings = await SiteSettings.findOne();
  const faviconBase = '/api/favicon';
  const faviconVersion = settings?.updatedAt
    ? new Date(settings.updatedAt).getTime()
    : Date.now();
  const favicon = `${faviconBase}?v=${faviconVersion}`;

  return {
    title: {
      default: settings?.seo?.siteTitle || 'Christmas Lighting Services | Luminous Holiday',
      template: `%s | ${settings?.seo?.siteTitle || 'Luminous Holiday'}`,
    },
    description: settings?.seo?.metaDescription || 'Professional holiday lighting installation & design services.',
    keywords: settings?.seo?.keywords || 'christmas lights, holiday lighting, installation',
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    }
  };
}

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} font-sans`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
