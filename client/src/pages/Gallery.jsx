import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemple } from '../context/TempleContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const { templeData } = useTemple();
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const mediaItems = templeData.gallery || [];

  const filteredItems = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === filter);

  const handleNext = (e) => {
    e?.stopPropagation();
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  return (
    <div className="bg-temple-white min-h-screen pb-20">
      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedItem(null)}
          >
            {/* Close Button */}
            <motion.button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[210] p-2"
              onClick={() => setSelectedItem(null)}
            >
              <X size={32} />
            </motion.button>

            {/* Navigation Buttons */}
            <button 
              onClick={handlePrev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[210] p-2 bg-white/5 hover:bg-white/10 rounded-full"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-all z-[210] p-2 bg-white/5 hover:bg-white/10 rounded-full"
            >
              <ChevronRight size={32} />
            </button>

            <motion.div 
              key={selectedItem.url} // Change key to trigger animation on next/prev
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedItem.type === 'video' ? (
                <video 
                  src={selectedItem.url} 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl"
                />
              ) : (
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title} 
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
              <div className="mt-6 text-center">
                <h3 className="text-white text-2xl font-serif mb-2">{selectedItem.title}</h3>
                <p className="text-white/60 text-sm uppercase tracking-widest">{selectedItem.type}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
        {['all', 'photo', 'video'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 md:px-8 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
              filter === tab 
              ? 'bg-temple-red text-white shadow-md' 
              : 'bg-white text-gray-500 hover:text-temple-red border border-gray-100'
            }`}
          >
            {tab === 'all' ? 'All Media' : tab === 'photo' ? 'Photos' : 'Videos'}
          </button>
        ))}
      </div>

      <section className="max-w-7xl mx-auto md:px-4">
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-[1px] md:gap-8">
          {filteredItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="relative group cursor-pointer overflow-hidden bg-gray-200"
              onClick={() => setSelectedItem(item)}
            >
              <div className="aspect-[3/4] md:aspect-[4/3] overflow-hidden relative">
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Media Type Icons (Top Right) */}
                <div className="absolute top-2 right-2 text-white drop-shadow-md">
                  {item.type === 'video' && (
                    <div className="bg-black/20 p-1 rounded-md backdrop-blur-sm">
                      <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                    </div>
                  )}
                </div>

                {/* Desktop Hover Info */}
                <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center p-6 text-center">
                   <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform">
                      <h4 className="text-white font-serif text-xl mb-2">{item.title}</h4>
                      <p className="text-white/70 text-xs uppercase tracking-widest">{item.type}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
