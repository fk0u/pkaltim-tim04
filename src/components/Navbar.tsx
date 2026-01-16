import Link from 'next/link';
import { Menu, Search, User, X } from 'lucide-react';
import { useState, useEffect } from 'react';

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

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <span className={`text-2xl font-extrabold tracking-tight transition-colors ${
              isScrolled ? 'text-green-700' : 'text-white'
            }`}>
              BorneoTrip<span className="text-green-400">.</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {['Home', 'Events', 'Packages', 'Sustainability'].map((item) => (
              <Link 
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className={`font-medium text-sm hover:text-green-400 transition-colors ${
                  isScrolled ? 'text-gray-600' : 'text-white/90'
                }`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className={`p-2 rounded-full hover:bg-white/10 transition ${
               isScrolled ? 'text-gray-600' : 'text-white'
            }`}>
               <Search className="w-5 h-5" />
            </button>
            <button className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition shadow-lg ${
               isScrolled 
                 ? 'text-white bg-green-600 hover:bg-green-700' 
                 : 'text-green-900 bg-white hover:bg-gray-100'
            }`}>
              <User className="w-4 h-4" /> Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className={`p-2 transition ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
         isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setIsMenuOpen(false)}></div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 shadow-2xl md:hidden ${
         isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
         <div className="p-6">
            <div className="flex justify-between items-center mb-8">
               <span className="text-xl font-bold text-green-700">Menu</span>
               <button onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-500" />
               </button>
            </div>
            <div className="space-y-4">
              {['Home', 'Events', 'Packages', 'Sustainability'].map((item) => (
                <Link 
                   key={item}
                   href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                   className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition"
                   onClick={() => setIsMenuOpen(false)}
                >
                   {item}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-100">
                 <button className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200">
                    Sign In
                 </button>
              </div>
            </div>
         </div>
      </div>
    </nav>
  );
}
