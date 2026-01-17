import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  transparentNavbar?: boolean;
}

export default function Layout({ 
  children, 
  title = 'BorneoTrip - Sustainable Tourism', 
  transparentNavbar = false 
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Jelajahi Event & Paket Wisata Berkelanjutan di Kalimantan Timur" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar isTransparent={transparentNavbar} />

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}
