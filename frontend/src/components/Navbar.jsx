import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, User, LogOut, ArrowRight, Heart, Bell } from 'lucide-react';
import { useTemple } from '../context/TempleContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useTemple();

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
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-temple-gold rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-inner">
                <span className="text-temple-red font-bold text-xl">ॐ</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif text-[15px] md:text-xl font-bold leading-none tracking-wide block">
                  SRI DEVIKARUMARI
                </span>
                <span className="text-[9px] md:text-[11px] font-sans font-bold tracking-[0.1em] md:tracking-[0.2em] text-temple-gold block mt-0.5">
                  AMMAN DHARMA SANSTHA
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden lg:block">
            <div className="ml-8 flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="whitespace-nowrap text-sm font-bold text-white hover:text-temple-gold transition-colors relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-temple-gold transition-all group-hover:w-full"></span>
                </Link>
              ))}
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link to="/dashboard" className="flex items-center gap-2 group/user">
                      <div className="w-8 h-8 bg-temple-gold/20 rounded-full flex items-center justify-center border border-temple-gold/30 group-hover/user:bg-temple-gold transition-all">
                        <User size={14} className="text-temple-gold group-hover/user:text-temple-red" />
                      </div>
                      <span className="text-sm font-bold text-white group-hover/user:text-temple-gold transition-colors uppercase tracking-tight">{user.name.split(' ')[0]}</span>
                    </Link>
                    <button 
                      onClick={logout}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                      title="Logout"
                    >
                      <LogOut size={16} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 bg-white text-temple-red px-6 py-2 rounded-full text-sm font-bold hover:bg-temple-gold hover:text-white transition-all shadow-md active:scale-95 whitespace-nowrap"
                  >
                    <User size={16} />
                    {t('nav.login') || 'Login'}
                  </Link>
                )}

                <Link 
                  to="/pooja"
                  className="flex items-center gap-2 bg-temple-gold text-temple-red px-6 py-2 rounded-full text-sm font-bold hover:bg-white transition-all shadow-md active:scale-95 whitespace-nowrap uppercase"
                >
                  <Bell size={16} />
                  {t('nav.book_pooja') || 'Book Pooja'}
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-3">
            {!user && (
              <Link to="/login" className="bg-white text-temple-red p-2 rounded-full shadow-sm">
                <User size={18} />
              </Link>
            )}
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
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-temple-red/95 backdrop-blur-xl border-t border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-8 space-y-2">
              {user && (
                <div className="space-y-2 mb-4">
                  <Link 
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-6 border-b border-white/10 flex items-center justify-between bg-white/5 rounded-2xl group hover:bg-white/10 transition-all"
                  >
                    <div>
                      <p className="text-[10px] text-temple-gold uppercase font-bold tracking-[0.2em] mb-1">My Dashboard</p>
                      <p className="text-xl font-serif font-bold text-white">{user.name}</p>
                    </div>
                    <ArrowRight size={20} className="text-temple-gold" />
                  </Link>
                  <button 
                    onClick={logout} 
                    className="w-full p-4 flex items-center justify-center gap-2 bg-white/5 text-red-400 rounded-2xl active:scale-95 transition-transform font-bold text-sm"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium text-white/90 hover:bg-white/10 hover:text-temple-gold transition-all active:translate-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="pt-6 mt-4 border-t border-white/10 flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-base font-bold bg-white text-temple-red shadow-lg active:scale-[0.98] transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} />
                    {t('nav.login') || 'Login / Register'}
                  </Link>
                </div>
              )}
              
              <div className="pt-4 flex items-center justify-center">
                 <div className="w-12 h-1.5 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
