import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  transparentNavbar?: boolean;
  ogImage?: string;
  keywords?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function Layout({
  children,
  title = 'BorneoTrip - Sustainable Tourism in East Kalimantan',
  description = 'Jelajahi keindahan alam Kalimantan Timur dengan paket wisata ramah lingkungan dan event budaya otentik.',
  transparentNavbar = false,
  ogImage = 'https://borneotrip-platform.vercel.app/images/og-default.jpg', // Fallback image (needs to be created or hosted)
  keywords = 'borneo tourism, ecotourism, kalimantan timur, travel indonesia, sustainable travel',
  url = 'https://borneotrip.com',
  type = 'website'
}: LayoutProps) {
  const siteTitle = title.includes('BorneoTrip') ? title : `${title} | BorneoTrip`;

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col font-sans text-slate-900 bg-slate-50">
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={type} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="BorneoTrip" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta property="twitter:title" content={siteTitle} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />
      </Head>

      <Navbar isTransparent={transparentNavbar} />

      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
