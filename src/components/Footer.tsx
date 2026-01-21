import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white pt-12 md:pt-20 pb-10 rounded-t-[2.5rem] md:rounded-t-[3.5rem] mt-16 md:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section: CTA & Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 pb-12 md:pb-16 border-b border-gray-800 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 font-display">{t.footer.ctaTitle} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">{t.footer.ctaTitleHighlight}</span></h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              {t.footer.ctaDesc}
            </p>
          </div>

          <div className="w-full md:w-auto">
            <div className="bg-gray-800/50 p-2 rounded-full flex items-center border border-gray-700 w-full md:min-w-[400px]">
              <input
                type="email"
                placeholder={t.footer.emailPlaceholder}
                className="bg-transparent border-none focus:ring-0 text-white flex-grow px-4 placeholder-gray-500"
              />
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-emerald-900/50">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-white">
              BorneoTrip<span className="text-emerald-500">.</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>
            <div className="flex gap-4 pt-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300 text-gray-400">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-6 text-white">{t.footer.company}</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/careers" className="hover:text-emerald-400 transition-colors">{t.footer.careers}</Link></li>
              <li><Link href="/partners" className="hover:text-emerald-400 transition-colors">{t.footer.partners}</Link></li>
              <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">{t.footer.blog}</Link></li>
            </ul>
          </div>

          {/* Support (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-6 text-white">{t.footer.support}</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">{t.nav.contact}</Link></li>
              <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">{t.footer.faq}</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">{t.footer.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">{t.footer.terms}</Link></li>
            </ul>
          </div>

          {/* Contact Info (4 cols) */}
          <div className="lg:col-span-4 bg-gray-800/30 p-8 rounded-3xl border border-gray-700/50">
            <h4 className="font-bold text-lg mb-6 text-white">{t.footer.office}</h4>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                <span>Jl. Jenderal Sudirman No. 45, Balikpapan Kota, Kalimantan Timur 76114</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>hello@borneotrip.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2026 {t.footer.rights}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">{t.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-white">{t.footer.terms}</Link>
            <Link href="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
