import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ta' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.pooja'), path: '/pooja' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.donations'), path: '/donations' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <nav className="gradient-red text-white sticky top-0 z-50 shadow-lg border-b border-temple-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-12 h-12 bg-temple-gold rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-inner">
                <span className="text-temple-red font-bold text-xl">ॐ</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg leading-tight tracking-wide md:block hidden">
                  SRI DEVIKARUMARI
                </span>
                <span className="text-[10px] font-sans font-medium tracking-[0.2em] text-temple-gold/90 md:block hidden">
                  AMMAN DHARMA SANSTHA
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-1 py-2 text-sm font-medium hover:text-temple-gold transition-all relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-temple-gold transition-all group-hover:w-full"></span>
                </Link>
              ))}
              <button
                onClick={toggleLanguage}
                className="ml-4 flex items-center gap-1 bg-temple-gold text-temple-red px-4 py-1.5 rounded-full text-sm font-bold hover:bg-white transition-all shadow-md active:scale-95"
              >
                <Globe size={16} />
                {i18n.language === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 bg-temple-gold text-temple-red px-3 py-1 rounded-full text-xs font-bold shadow-sm"
            >
              <Globe size={14} />
              {i18n.language === 'en' ? 'தமிழ்' : 'ENG'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden gradient-red border-t border-temple-gold/20 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/10 hover:text-temple-gold transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
