import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  transparentNavbar?: boolean;
}

export default function Layout({
  children,
  title = 'BorneoTrip - Sustainable Tourism',
  description = 'Jelajahi keindahan alam Kalimantan Timur dengan paket wisata ramah lingkungan dan event budaya otentik.',
  transparentNavbar = false
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
