import Link from 'next/link';
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
    <nav
      className={`fixed w-full z-100 transition-all duration-500 will-change-transform ${isSolid ? 'glass shadow-sm py-3' : 'bg-transparent py-4 md:py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2 group relative z-101 outline-none">
            <span className={`text-2xl font-extrabold tracking-tight transition-colors ${isSolid || isMenuOpen ? 'text-green-800' : 'text-white'
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
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-full flex items-center gap-1 font-bold text-xs transition ${isSolid ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'}`}
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span>{locale.toUpperCase()}</span>
            </button>

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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-101 gap-4">
            {/* Mobile Lang Toggle */}
            <button
              onClick={toggleLanguage}
              className={`p-1.5 rounded-full flex items-center gap-1 font-bold text-[10px] transition ${isSolid || isMenuOpen ? 'bg-gray-100 text-gray-700' : 'bg-white/10 text-white backdrop-blur-sm'
                }`}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale.toUpperCase()}</span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-colors duration-300 ${isSolid || isMenuOpen ? 'text-green-900' : 'text-white'}`}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode='wait'>
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                    <X className="w-8 h-8" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Menu className="w-8 h-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-100 bg-white text-black md:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-screen px-6 pt-32 pb-12">
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: 0.1 + (idx * 0.1), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-5xl font-black tracking-tighter text-gray-900 hover:text-emerald-600 transition-colors"
                    >
                      {item.title}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-12 border-t border-gray-100 mt-auto"
              >
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.common.socials}</h4>
                    <ul className="space-y-2 text-sm font-medium text-gray-600">
                      <li><a href="#" className="hover:text-emerald-600">Instagram</a></li>
                      <li><a href="#" className="hover:text-emerald-600">Twitter (X)</a></li>
                      <li><a href="#" className="hover:text-emerald-600">LinkedIn</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t.common.contact}</h4>
                    <p className="text-sm font-medium text-gray-600 mb-2">hello@borneotrip.id</p>
                    <p className="text-sm font-medium text-gray-600">+62 812 3456 7890</p>
                  </div>
                </div>

                {isAuthenticated && user ? (
                  <Link href={`/dashboard/${user.role === 'client' ? 'client' : 'admin'}`} onClick={() => setIsMenuOpen(false)} className="w-full py-4 bg-green-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-800 transition shadow-xl mb-4">
                    <LayoutDashboard className="w-5 h-5" /> Dashboard
                  </Link>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-4 bg-green-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-800 transition shadow-xl">
                    {t.common.signIn} <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
