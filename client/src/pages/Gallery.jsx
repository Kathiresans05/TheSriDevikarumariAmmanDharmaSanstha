import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTemple } from '../context/TempleContext';

const Gallery = () => {
  const { templeData } = useTemple();
  const [filter, setFilter] = useState('all');

  const mediaItems = templeData.gallery || [];

  const filteredItems = filter === 'all' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === filter); // Support type filter if added later

  return (
    <div className="bg-temple-white min-h-screen pb-20">
      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center gap-4">
        {['all', 'photo', 'video'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-8 py-2 rounded-full font-bold transition-all ${
              filter === tab 
              ? 'bg-temple-red text-white shadow-lg' 
              : 'bg-white text-gray-500 hover:text-temple-red'
            }`}
          >
            {tab === 'all' ? 'All Media' : tab === 'photo' ? 'Photos' : 'Videos'}
          </button>
        ))}
      </div>

      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group overflow-hidden rounded-3xl shadow-xl bg-white border border-gray-100 hover:border-temple-gold transition-all duration-500"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img 
                  src={item.url} 
                  alt={item.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block ${
                      item.type === 'video' ? 'bg-temple-red text-white' : 'bg-white text-temple-red'
                    }`}>
                      {item.type}
                    </span>
                    <h4 className="text-white font-serif text-xl">{item.title}</h4>
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
