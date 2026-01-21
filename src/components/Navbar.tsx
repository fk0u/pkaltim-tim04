import Link from 'next/link';
// HMR Trigger
import { Menu, Search, X, ChevronRight, Globe, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useContent } from '@/contexts/ContentContext';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Navbar({ isTransparent = true }: { isTransparent?: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { t, locale, toggleLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const { packages, events } = useContent();
  const router = useRouter();

  // Search Logic
  const getSearchResults = () => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();
    const allItems = [
      ...packages.map(p => ({ ...p, type: 'package', url: `/packages/${p.id}` })),
      ...events.map(e => ({ ...e, type: 'event', url: `/events/${e.id}` }))
    ];

    return allItems.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const locationMatch = item.location.toLowerCase().includes(query);
      const categoryMatch = ((item as any).category || '').toLowerCase().includes(query);
      return titleMatch || locationMatch || categoryMatch;
    }).slice(0, 5); // Limit to 5 results
  };

  const searchResults = getSearchResults();
  const recommendations = [
    ...packages.slice(0, 2).map(p => ({ ...p, type: 'package', url: `/packages/${p.id}` })),
    ...events.slice(0, 1).map(e => ({ ...e, type: 'event', url: `/events/${e.id}` }))
  ];

  const handleNavigate = (url: string) => {
    router.push(url);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Combine scroll state with prop (if not transparent, always behave as scrolled/solid)
  const isSolid = isScrolled || !isTransparent;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const menuItems = [
    { title: t.nav.home, href: '/' },
    { title: t.nav.events, href: '/events' },
    { title: t.nav.packages, href: '/packages' },
    { title: t.nav.about, href: '/about' },
    { title: t.nav.sustainability, href: '/sustainability' },
    { title: t.nav.contact, href: '/contact' },
  ];

  return (
    <>
      <nav
        className={`fixed w-full z-100 transition-all duration-500 will-change-transform ${isSolid ? 'glass shadow-sm py-3' : 'bg-transparent py-4 md:py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center gap-2 group relative z-101 outline-none">
              <span className={`text-2xl font-extrabold tracking-tight transition-colors ${isSolid ? 'text-green-800' : 'text-white'
                }`}>
                BorneoTrip<span className="text-emerald-500">.</span>
              </span>
            </Link>

            {/* Desktop Menu - Conditional Rendering */}
            <div className="hidden md:block flex-1 mx-8 relative h-10 flex items-center justify-center pt-3">
              <AnimatePresence mode="wait">
                {!isSearchOpen ? (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex space-x-8 items-center justify-center"
                  >
                    {menuItems.slice(0, 5).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-sm font-bold tracking-wide hover:text-emerald-500 transition-colors ${isSolid ? 'text-gray-600' : 'text-white/90'}`}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="search"
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: "100%", opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-full max-w-lg relative group">
                      {/* Search Input Container */}
                      <div className="relative z-20">
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50"></div>
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 z-30" />
                        <input
                          type="text"
                          autoFocus
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari destinasi, event, atau paket..."
                          className="w-full pl-12 pr-12 py-3 rounded-2xl bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none font-medium relative z-30"
                        />
                        <button
                          type="button"
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition z-30"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Results Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20 p-2"
                      >
                        {searchQuery ? (
                          searchResults.length > 0 ? (
                            <div className="py-2">
                              <h4 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Hasil Pencarian</h4>
                              {searchResults.map((result: any) => (
                                <button
                                  key={result.id}
                                  onClick={() => handleNavigate(result.url)}
                                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 rounded-xl flex items-center gap-3 transition group/item"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                    <img src={result.imageUrl} alt={result.title} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-gray-900 group-hover/item:text-emerald-700 clamp-1">{result.title}</p>
                                    <p className="text-xs text-gray-500 capitalize">{result.type} • {result.location}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 text-center text-gray-500">
                              <p className="text-sm">Tidak ditemukan hasil untuk "{searchQuery}"</p>
                            </div>
                          )
                        ) : (
                          <div className="py-2">
                            <h4 className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Rekomendasi</h4>
                            {recommendations.map((rec: any) => (
                              <button
                                key={rec.id}
                                onClick={() => handleNavigate(rec.url)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 rounded-xl flex items-center gap-3 transition group/item"
                              >
                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                  <img src={rec.imageUrl} alt={rec.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900 group-hover/item:text-blue-700 clamp-1">{rec.title}</p>
                                  <p className="text-xs text-gray-500 capitalize">{rec.type}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Language Toggle */}
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className={`p-2 rounded-full flex items-center gap-2 font-bold text-xs transition border ${isSolid ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' : 'bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm'}`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{locale.toUpperCase()}</span>
                  <ChevronRight className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 overflow-hidden z-50"
                      onMouseLeave={() => setIsLangMenuOpen(false)}
                    >
                      {[
                        { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
                        { code: 'en', label: 'English', flag: '🇬🇧' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            if (locale !== lang.code) toggleLanguage();
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition ${locale === lang.code ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          <span className="text-base">{lang.flag}</span>
                          {lang.label}
                          {locale === lang.code && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full hover:bg-black/5 transition relative overflow-hidden ${isSolid ? 'text-gray-600' : 'text-white'}`}
                aria-label="Search"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div key="search" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Search className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition ${isSolid ? 'bg-gray-100/80 hover:bg-gray-200' : 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white'}`}
                  >
                    <Image
                      src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      alt={user.name}
                      className="rounded-full border border-white/50"
                      width={28}
                      height={28}
                    />
                    <span className={`text-sm font-bold max-w-25 truncate ${isSolid ? 'text-gray-900' : 'text-white'}`}>{user.name}</span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden"
                        onMouseLeave={() => setIsUserMenuOpen(false)}
                      >
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                        </div>
                        <Link href={`/dashboard/${user.role === 'client' ? 'client' : 'admin'}`} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition text-left"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link href="/login" className={`flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-full transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isSolid
                  ? 'text-white bg-green-800 hover:bg-green-900'
                  : 'text-green-900 bg-white hover:bg-gray-50'
                  }`}>
                  {t.common.signIn}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button - Removed in favor of FAB */}
            {/* <div className="md:hidden"></div> */}
          </div>
        </div>

        {/* Floating Pop-up Menu (Stack Style) */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop to close on click outside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 z-[95] md:hidden backdrop-blur-sm"
              />

              {/* Floating Menu Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="fixed bottom-28 left-6 right-6 z-[100] md:hidden glass-dark rounded-3xl p-6 shadow-2xl overflow-hidden ring-1 ring-white/10"
              >
                <div className="flex flex-col space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 text-lg font-bold text-white hover:bg-white/10 rounded-xl transition-colors flex items-center justify-between group"
                    >
                      {item.title}
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition" />
                    </Link>
                  ))}

                  {/* Socials / Contact Mini-Footer within the Card */}
                  <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Socials</p>
                      <div className="flex gap-3">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-emerald-400 transition"><span className="sr-only">IG</span>📸</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-emerald-400 transition"><span className="sr-only">TW</span>🐦</a>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact</p>
                      <p className="text-xs text-gray-300">hello@borneotrip.id</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </nav>

      {/* Mobile Bottom Dock - Premium Navigation */}
      {/* Moved outside nav to avoid containing block issues with transform/will-change */}
      {/* Show only when scrolled past Hero (isScrolled is true/solid) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="md:hidden fixed bottom-6 left-6 right-6 z-[90]"
          >
            <div className="glass-dark rounded-2xl flex items-center justify-between px-6 py-4 shadow-2xl shadow-black/40 ring-1 ring-white/10">
              <Link href="/" className={`flex flex-col items-center gap-1 ${router.pathname === '/' ? 'text-emerald-500' : 'text-gray-400'}`}>
                <div className="p-2 rounded-xl bg-white/5 active:scale-95 transition">
                  {/* Replaced emoji with Lucide icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                </div>
              </Link>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex flex-col items-center gap-1 text-gray-400 active:text-white transition"
              >
                <div className="p-2 rounded-xl bg-white/5 active:scale-95 transition">
                  <Search className="w-5 h-5" />
                </div>
              </button>

              {/* Center Main Action - "Menu" trigger for full overlay */}
              <button
                onClick={() => setIsMenuOpen(true)}
                className="flex flex-col items-center gap-1 -mt-8"
              >
                <div className="p-4 rounded-full bg-emerald-600 text-white shadow-lg active:scale-95 transition ring-4 ring-black/50">
                  <Menu className="w-6 h-6" />
                </div>
              </button>

              <button
                onClick={toggleLanguage}
                className="flex flex-col items-center gap-1 text-gray-400 active:text-white transition"
              >
                <div className="p-2 rounded-xl bg-white/5 active:scale-95 transition">
                  <span className="text-xs font-bold">{locale === 'en' ? 'EN' : 'ID'}</span>
                </div>
              </button>

              {isAuthenticated ? (
                <Link href={`/dashboard/${user?.role === 'client' ? 'client' : 'admin'}`} className={`flex flex-col items-center gap-1 ${router.pathname.includes('dashboard') ? 'text-emerald-500' : 'text-gray-400'}`}>
                  <div className="p-2 rounded-xl bg-white/5 active:scale-95 transition">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                </Link>
              ) : (
                <Link href="/login" className="flex flex-col items-center gap-1 text-gray-400">
                  <div className="p-2 rounded-xl bg-white/5 active:scale-95 transition">
                    <span className="text-xl font-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

