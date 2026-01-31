import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const InteractiveCursor = dynamic(() => import('./InteractiveCursor'), { ssr: false });


interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  transparentNavbar?: boolean;
  ogImage?: string;
  keywords?: string;
  url?: string;
  type?: 'website' | 'article';
  hideFooter?: boolean;
  hideBottomNav?: boolean;
}

export default function Layout({
  children,
  title = 'BorneoTrip - Sustainable Tourism in East Kalimantan',
  description = 'Jelajahi keindahan alam Kalimantan Timur dengan paket wisata ramah lingkungan dan event budaya otentik.',
  transparentNavbar = false,
  ogImage = 'https://borneotrip-platform.vercel.app/images/og-default.jpg', // Fallback image (needs to be created or hosted)
  keywords = 'borneo tourism, ecotourism, kalimantan timur, travel indonesia, sustainable travel',
  url = 'https://borneotrip.com',
  type = 'website',
  hideFooter = false,
  hideBottomNav = false
}: LayoutProps) {
  const siteTitle = title.includes('BorneoTrip') ? title : `${title} | BorneoTrip`;

  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in, not on onboarding/login/register pages
    if (user && router.pathname !== '/onboarding' && router.pathname !== '/login' && router.pathname !== '/register') {
      // Check for missing strict profile fields
      const isProfileIncomplete = !user.phone || !user.idNumber || !user.bio || !user.onboardingCompleted;

      if (isProfileIncomplete) {
        addToast('⚠️ Profil belum lengkap. Mohon lengkapi data diri (HP, NIK, Bio) di halaman Profil Saya > Edit.', 'warning', 8000);
      }
    }
  }, [user, router.pathname, addToast]); // Add dependencies

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

      {!hideFooter && <Footer />}
      {!hideBottomNav && <MobileBottomNav />}

      {/* Interactive Cursor - Global */}
      <InteractiveCursor />
    </div>
  );
}
