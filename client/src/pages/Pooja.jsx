import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

import { useTemple } from '../context/TempleContext';

const Pooja = () => {
  const { templeData, user, bookSeva, loading } = useTemple();
  const poojas = templeData.sevas || [];
  const navigate = useNavigate();
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleBook = async (seva) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = await bookSeva({
      sevaId: seva.id,
      date: new Date(),
      time: 'TBD',
      amount: seva.price
    });

    if (result.success) {
      setStatus({ type: 'success', msg: `Successfully booked ${seva.name}!` });
    } else {
      setStatus({ type: 'error', msg: result.message });
    }
    
    setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-temple-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-temple-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {status.msg && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4`}
          >
            <div className={`${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                {status.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
                <p className="font-bold text-sm">{status.msg}</p>
              </div>
              <button onClick={() => setStatus({ type: '', msg: '' })}><X size={18} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="gradient-saffron text-white py-20 px-4 text-center">
        <h1 className="text-5xl font-serif mb-6">Pooja & Seva Services</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">Participate in our sacred rituals and receive the blessings of Sri Devikarumari Amman.</p>
      </section>

      <section className="py-12 md:py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {poojas.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative bg-white rounded-[24px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
            >
              <div className="p-4 md:p-8 relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-temple-saffron to-temple-red rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-temple-red/20 transform group-hover:rotate-12 transition-transform duration-500">
                    <span className="text-white text-xl md:text-3xl font-serif">{p.icon || 'ॐ'}</span>
                  </div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-temple-gold/5 rounded-full -mr-8 -mt-8 flex items-center justify-center">
                    <span className="text-temple-gold/10 text-3xl font-serif">{p.icon || 'ॐ'}</span>
                  </div>
                </div>

                <h3 className="text-lg md:text-2xl font-serif text-gray-900 mb-2 md:mb-4 group-hover:text-temple-red transition-colors capitalize leading-tight">
                  {p.name}
                </h3>
                
                <p className="text-gray-500 text-[10px] md:text-sm leading-relaxed mb-4 md:mb-8 flex-grow line-clamp-2 md:line-clamp-none">
                  {p.desc}
                </p>

                <div className="flex flex-row items-center justify-between mt-auto pt-4 md:pt-6 border-t border-gray-100 gap-2">
                  <span className="text-base md:text-2xl font-bold text-temple-red tracking-tight">
                    {p.price.includes('₹') ? p.price : `₹${p.price}`}
                  </span>
                  <button 
                    onClick={() => handleBook(p)}
                    className="bg-temple-red text-white h-9 md:h-12 px-3 md:px-6 rounded-lg md:rounded-xl font-bold hover:bg-temple-saffron transition-all shadow-lg active:scale-95 text-[10px] md:text-base whitespace-nowrap"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="gradient-red text-white py-16 px-4 mb-20 rounded-3xl max-w-7xl mx-auto overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-temple-gold/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-serif mb-6">Need assistance with booking?</h2>
          <p className="mb-8 opacity-80">Our temple office is open from 9:00 AM to 6:00 PM for all inquiries.</p>
          <a href="tel:+914426800430" className="inline-block bg-white text-temple-red px-8 py-3 rounded-full font-bold hover:bg-temple-gold hover:text-white transition-all">
            Call Temple Office
          </a>
        </div>
      </section>
    </div>
  );
};

export default Pooja;
