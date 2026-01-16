import Link from 'next/link';
import { Menu, Search, User, X, ChevronRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
    { title: 'Home', href: '/' },
    { title: 'Events', href: '/events' },
    { title: 'Packages', href: '/packages' },
    { title: 'About Us', href: '/about' },
    { title: 'Sustainability', href: '/sustainability' },
    { title: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-4 md:py-6'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group relative z-[101]">
            <span className={`text-2xl font-extrabold tracking-tight transition-colors ${isScrolled || isMenuOpen ? 'text-green-800' : 'text-white'
              }`}>
              BorneoTrip<span className="text-emerald-500">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 items-center">
            {menuItems.slice(0, 5).map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`text-sm font-bold tracking-wide hover:text-emerald-500 transition-colors ${isScrolled ? 'text-gray-600' : 'text-white/90'
                  }`}
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className={`p-2 rounded-full hover:bg-black/5 transition ${isScrolled ? 'text-gray-600' : 'text-white'
              }`}>
              <Search className="w-5 h-5" />
            </button>
            <Link href="/contact" className={`flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-full transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${isScrolled
                ? 'text-white bg-green-800 hover:bg-green-900'
                : 'text-green-900 bg-white hover:bg-gray-50'
              }`}>
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-[101]">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 transition-colors duration-300 ${isScrolled || isMenuOpen ? 'text-green-900' : 'text-white'}`}
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
            className="fixed inset-0 z-[100] bg-white text-black md:hidden overflow-y-auto"
          >
            <div className="flex flex-col min-h-screen px-6 pt-32 pb-12">
              <div className="flex-1 flex flex-col justify-center space-y-6">
                {menuItems.map((item, idx) => (
                  <motion.div
                    key={item.title}
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
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Socials</h4>
                    <ul className="space-y-2 text-sm font-medium text-gray-600">
                      <li><a href="#" className="hover:text-emerald-600">Instagram</a></li>
                      <li><a href="#" className="hover:text-emerald-600">Twitter (X)</a></li>
                      <li><a href="#" className="hover:text-emerald-600">LinkedIn</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contact</h4>
                    <p className="text-sm font-medium text-gray-600 mb-2">hello@borneotrip.id</p>
                    <p className="text-sm font-medium text-gray-600">+62 812 3456 7890</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-green-900 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-green-800 transition shadow-xl">
                  Sign In / Register <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
