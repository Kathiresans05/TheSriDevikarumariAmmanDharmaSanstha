import React from 'react';
import { useTranslation } from 'react-i18next';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { useTemple } from '../context/TempleContext';

const Footer = () => {
  const { t } = useTranslation();
  const { templeData } = useTemple();

  return (
    <footer className="bg-gray-900 text-white py-16 border-t-4 border-temple-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-serif font-bold text-temple-gold mb-6">{templeData.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Dedicated to the worship of Goddess Devikarumari and the spiritual upliftment of our community through tradition, seva, and devotion.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                <a key={social} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-temple-red transition-all group">
                  <div className={`w-5 h-5 text-gray-400 group-hover:text-white`}></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-bold text-temple-gold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['About History', 'Pooja Timings', 'Temple Gallery', 'Online Seva', 'Reach Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-temple-gold transition-colors text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-temple-red rounded-full"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Timings */}
          <div>
            <h3 className="text-xl font-serif font-bold text-temple-gold mb-6">Daily Timings</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Morning:</span>
                <span className="font-bold">{templeData.timings.morning.open} - {templeData.timings.morning.close}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Evening:</span>
                <span className="font-bold">{templeData.timings.evening.open} - {templeData.timings.evening.close}</span>
              </div>
              <div className="pt-4">
                <span className="text-temple-gold font-bold block mb-1">Special Days:</span>
                <span className="text-gray-400">{templeData.specialDays}</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-bold text-temple-gold mb-6">Contact Us</h3>
            <ul className="space-y-6 text-sm">
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-temple-gold">📍</span></div>
                <p className="text-gray-400">{templeData.address}</p>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-temple-gold">📞</span></div>
                <p className="text-gray-400">{templeData.phone}</p>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-temple-gold">✉️</span></div>
                <p className="text-gray-400">{templeData.email}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/40 gap-4">
          <p>© 2026 The Sri Devikarumari Amman Dharma Sanstha. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-temple-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-temple-gold transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-temple-gold transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
