import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Calendar, Heart, ArrowRight, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useTemple } from '../context/TempleContext';

const Home = () => {
  const { t } = useTranslation();
  const { templeData, loading } = useTemple();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [heroImages, setHeroImages] = useState([
    '/hero-temple.png',
    '/hero-night.png',
    '/hero-pond.png',
    '/hero-festival.png'
  ]);

  useEffect(() => {
    if (templeData.gallery && templeData.gallery.length > 0) {
      // Prioritize featured images for the hero slider
      const featured = templeData.gallery.filter(item => item.isFeatured).map(item => item.url);
      const all = templeData.gallery.map(item => item.url);
      
      const newImages = featured.length > 0 ? featured : all;
      setHeroImages(newImages);
    }
  }, [templeData.gallery]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-temple-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-temple-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-temple-red font-serif font-bold animate-pulse">Loading Divine Grace...</p>
        </div>
      </div>
    );
  }

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % heroImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="overflow-hidden bg-temple-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={heroImages[currentImage]}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              alt="Temple Hero"
              className="w-full h-full object-cover brightness-[0.7] md:brightness-[0.8]"
              style={{ objectPosition: '50% 40%' }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-temple-red/30"></div>
        </div>

        {/* Slider Controls */}
        <button onClick={prevImage} className="absolute left-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all hidden md:block">
          <ChevronLeft size={32} />
        </button>
        <button onClick={nextImage} className="absolute right-4 z-20 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all hidden md:block">
          <ChevronRight size={32} />
        </button>

        <div className="relative z-10 max-w-4xl px-4 drop-shadow-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-4xl md:text-7xl font-serif mb-6 leading-tight drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Divine Grace of Sri Devikarumari
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 italic text-temple-gold drop-shadow-md" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              A Sacred Sanctuary for Inner Peace and Spiritual Awakening
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button 
                onClick={() => navigate('/pooja')}
                className="w-full sm:w-auto max-w-[260px] sm:max-w-none mx-auto sm:mx-0 bg-temple-saffron hover:bg-temple-red text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 text-sm md:text-base"
              >
                Book Pooja <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => navigate('/gallery')}
                className="w-full sm:w-auto max-w-[260px] sm:max-w-none mx-auto sm:mx-0 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all text-sm md:text-base"
              >
                Virtual Tour
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Daily Highlights */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 -mt-32 relative z-20">
            {/* Pooja Timings Card */}
            <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-temple-red">
              <div className="w-16 h-16 bg-temple-red/10 text-temple-red rounded-2xl flex items-center justify-center mb-8">
                <Clock size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-6 text-gray-800">Darshan Timings</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">Morning</span>
                  <span className="font-bold text-temple-red">{templeData.timings.morning.open} - {templeData.timings.morning.close}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <span className="text-gray-500 font-medium">Evening</span>
                  <span className="font-bold text-temple-red">{templeData.timings.evening.open} - {templeData.timings.evening.close}</span>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Events - Dynamic Month */}
            <motion.div whileHover={{ y: -10 }} className="bg-temple-red text-white p-10 rounded-3xl shadow-2xl">
              <div className="w-16 h-16 bg-white/10 text-temple-gold rounded-2xl flex items-center justify-center mb-8">
                <Calendar size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-temple-gold">{currentMonthName} Calendar</h3>
              <p className="opacity-90 mb-8 text-sm leading-relaxed">Join us for the auspicious celebrations and special rituals scheduled for the month of {currentMonthName}. Seek the divine blessings of Mother Amman.</p>
              <button onClick={() => navigate('/events')} className="text-temple-gold font-bold flex items-center gap-2 hover:underline">View All Events <ArrowRight size={16} /></button>
            </motion.div>

            {/* Donation */}
            <motion.div whileHover={{ y: -10 }} className="bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-temple-gold">
              <div className="w-16 h-16 bg-temple-gold/10 text-temple-gold rounded-2xl flex items-center justify-center mb-8">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-800">Annadhanam Seva</h3>
              <p className="text-gray-500 mb-8 text-sm leading-relaxed">Help us serve daily meals to hundreds of devotees. Your small contribution makes a massive spiritual impact.</p>
              <button className="bg-temple-gold text-white px-8 py-3 rounded-full font-bold hover:bg-temple-saffron transition-all">Donate Now</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section Snippet */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-temple-red mb-8">Sacred Abode of the Mother</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-12">The Sri Devikarumari Amman Temple is a living sanctuary where thousands of devotees find solace and spiritual strength. We are dedicated to preserving Vedic traditions while serving the community.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div><div className="text-3xl font-bold text-temple-saffron">50+</div><div className="text-xs uppercase tracking-widest text-gray-400">Years Legacy</div></div>
            <div><div className="text-3xl font-bold text-temple-saffron">10k+</div><div className="text-xs uppercase tracking-widest text-gray-400">Monthly Devotees</div></div>
            <div><div className="text-3xl font-bold text-temple-saffron">100%</div><div className="text-xs uppercase tracking-widest text-gray-400">Daily Seva</div></div>
            <div><div className="text-3xl font-bold text-temple-saffron">24/7</div><div className="text-xs uppercase tracking-widest text-gray-400">Divine Grace</div></div>
          </div>
        </div>
      </section>

      {/* Featured Sevas Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-temple-red mb-4">Divine Sevas & Offerings</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Participate in our ancient rituals and seek the blessings of the Divine Mother through various dedicated sevas.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {templeData.sevas?.filter(s => s.isFeatured).map((seva, i) => (
              <div key={i} className="group p-4 md:p-8 rounded-3xl bg-temple-white border border-gray-100 hover:border-temple-gold transition-all duration-500 hover:shadow-2xl">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-temple-red text-white rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 font-bold shadow-lg group-hover:scale-110 transition-transform text-sm md:text-base">{seva.icon || 'ॐ'}</div>
                <h4 className="text-base md:text-xl font-bold text-gray-800 mb-2 md:mb-3">{seva.name}</h4>
                <p className="text-gray-500 text-[10px] md:text-sm mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">{seva.desc}</p>
                <div className="flex flex-row justify-between items-center gap-2 pt-4 border-t border-gray-50">
                  <span className="text-sm md:text-base font-bold text-temple-red">{seva.price}</span>
                  <button className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-temple-gold hover:text-temple-red transition-colors flex items-center gap-1 whitespace-nowrap">
                    Book Now <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gallery Snippet */}
      <section className="py-24 bg-temple-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-serif text-temple-red mb-2">Temple Splendor</h2>
              <p className="text-gray-500">A glimpse into the architectural and spiritual majesty of our abode.</p>
            </div>
            <button 
              onClick={() => window.location.href='/gallery'}
              className="bg-white border border-gray-200 px-8 py-3 rounded-full font-bold hover:bg-temple-red hover:text-white transition-all shadow-md"
            >
              Explore Full Gallery
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-1 h-auto md:h-[700px]">
            {templeData.gallery && templeData.gallery.filter(item => item.isFeatured).length > 0 ? (
              (() => {
                const featured = templeData.gallery.filter(item => item.isFeatured);
                return (
                  <>
                    <div className="col-span-2 row-span-1 md:row-span-2 rounded-2xl md:rounded-none overflow-hidden shadow-xl border-2 md:border-0 border-white aspect-video md:aspect-auto">
                      <img src={featured[0]?.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Temple" />
                    </div>
                    <div className="rounded-2xl md:rounded-none overflow-hidden shadow-xl border-2 md:border-0 border-white aspect-square md:aspect-auto">
                      <img src={featured[1]?.url || featured[0]?.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Temple" />
                    </div>
                    <div className="rounded-2xl md:rounded-none overflow-hidden shadow-xl border-2 md:border-0 border-white aspect-square md:aspect-auto">
                      <img src={featured[2]?.url || featured[0]?.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Temple" />
                    </div>
                    <div className="col-span-2 rounded-2xl md:rounded-none overflow-hidden shadow-xl border-2 md:border-0 border-white aspect-video md:aspect-auto">
                      <img src={featured[3]?.url || featured[0]?.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Temple" />
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="col-span-2 md:col-span-4 flex items-center justify-center text-gray-400 py-12">No featured gallery images.</div>
            )}
          </div>
        </div>
      </section>

      {/* Devotee Experience */}
      <section className="py-16 md:py-24 gradient-mixed text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <div className="w-64 h-64 md:w-96 md:h-96 border-[20px] md:border-[40px] border-white rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="md:w-1/2 w-full">
            <h2 className="text-3xl md:text-5xl font-serif mb-8 text-center md:text-left">Devotee Experiences</h2>
            <div className="bg-white/10 backdrop-blur-lg p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-white/20 relative">
              <div className="text-4xl md:text-6xl font-serif text-temple-gold absolute -top-2 md:-top-4 -left-2 md:-left-4">"</div>
              <p className="text-base md:text-xl italic mb-6 md:mb-8 leading-relaxed">
                Visiting this temple is like returning home to a mother's embrace. The peaceful atmosphere and the divine energy of Karumari Amman have guided me through many challenges. Truly a blessed place.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-temple-gold rounded-full flex items-center justify-center font-bold text-temple-red shadow-lg">R</div>
                <div>
                  <h5 className="font-bold text-sm md:text-base">Rajesh Kumar</h5>
                  <p className="text-[10px] md:text-xs opacity-60 uppercase tracking-widest">Devotee for 15 years</p>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 space-y-8">
            <h3 className="text-3xl font-serif text-temple-gold">Plan Your Pilgrimage</h3>
            <p className="opacity-80">We welcome you to participate in our daily rituals. The temple is easily accessible and provides all necessary facilities for devotees visiting from afar.</p>
            <ul className="space-y-4">
              {[
                'Daily Free Annadhanam at 12:30 PM',
                'Special Queue for Senior Citizens & Differently Abled',
                'Safe Locker Facilities for Belongings',
                'Clean Drinking Water & Restroom Facilities'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-temple-gold rounded-full flex items-center justify-center text-temple-red">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <button className="bg-white text-temple-red px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-temple-gold hover:text-white transition-all transform hover:scale-105">
              Contact Office
            </button>
          </div>
        </div>
      </section>

      {/* Spiritual Wisdom Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block px-4 py-1 bg-temple-red/10 text-temple-red rounded-full text-xs font-bold uppercase tracking-widest mb-6">Traditional Learning</div>
              <h2 className="text-4xl font-serif text-gray-800 mb-8">Path to Spiritual Enlightenment</h2>
              <p className="text-gray-600 mb-10 leading-relaxed">Beyond a place of worship, we are a center for Vedic learning and cultural preservation. Join our weekly sessions to deepen your understanding of our sacred traditions.</p>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6">
                {[
                  { title: 'Veda Pathshala', time: 'Every Morning 7:00 AM', desc: 'Sanskrit chanting and Vedic studies for young seekers.' },
                  { title: 'Bhagavad Gita Satsang', time: 'Sundays 5:00 PM', desc: 'Discourse on the timeless wisdom of the Gita and its modern application.' },
                  { title: 'Divine Bhajans', time: 'Fridays 6:30 PM', desc: 'Soul-stirring devotional music sessions to uplift the spirit.' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col sm:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-temple-white border border-gray-50 hover:border-temple-gold transition-all">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-temple-gold text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md text-sm md:text-base">ॐ</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm md:text-base line-clamp-1">{item.title}</h4>
                      <p className="text-[10px] md:text-xs text-temple-red font-bold mb-1 md:mb-2">{item.time}</p>
                      <p className="text-[10px] md:text-sm text-gray-500 line-clamp-2 md:line-clamp-none">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <img src="/hero-temple.png" className="rounded-2xl shadow-lg mt-12" alt="Spiritual" />
                <img src="/hero-night.png" className="rounded-2xl shadow-lg" alt="Spiritual" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-temple-gold">
                <span className="text-4xl text-temple-red font-serif">शांति</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event & Festival Calendar Section */}
      <section className="py-24 bg-temple-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl font-serif text-temple-red">Events</h2>
              <p className="text-gray-500 mt-2">Upcoming auspicious celebrations and sacred dates.</p>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-temple-red hover:text-white transition-all"><ChevronLeft size={20} /></button>
              <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-temple-red hover:text-white transition-all"><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(templeData.events && templeData.events.length > 0 ? templeData.events.filter(ev => ev.isFeatured) : [
              { month: 'May', date: '10', title: 'Akshaya Tritiya', desc: 'A day of eternal prosperity. Special Lakshmi Pooja at sunrise.', isFeatured: true },
              { month: 'Jun', date: '21', title: 'Vaikasi Visakam', desc: 'Celebration of Lord Murugan\'s birth with grand abhishekam.', isFeatured: true },
              { month: 'Jul', date: '15', title: 'Aadi Perukku', desc: 'Festival of life-giving water and gratitude to Mother Nature.', isFeatured: true },
            ]).slice(0, 3).map((item, i) => {
              const dateParts = item.date?.split(' ') || [];
              const month = dateParts[0] || item.month || '...';
              const day = dateParts[1]?.replace(',', '') || item.date || '...';
              
              return (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-b-4 border-temple-gold group">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-xs uppercase font-bold text-gray-400">{month}</div>
                      <div className="text-3xl font-serif font-bold text-temple-red">{day}</div>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-100"></div>
                    <h4 className="text-xl font-bold text-gray-800 group-hover:text-temple-red transition-colors">{item.title || item.event}</h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                  <button className="text-xs font-bold text-temple-gold flex items-center gap-2">REMIND ME <ArrowRight size={14} /></button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-4 md:pt-8 pb-24 bg-temple-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-temple-red mb-4">Common Questions</h2>
            <p className="text-gray-500">Essential information for your sacred visit.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is there a specific dress code for Darshan?', a: 'Devotees are requested to wear traditional Indian attire (Dhoti/Veshti for men, Saree/Salwar for women) to maintain the sanctity of the temple.' },
              { q: 'Can I book special Poojas online?', a: 'Yes, most of our regular and special poojas can be booked via our Online Seva portal at least 48 hours in advance.' },
              { q: 'What are the peak hours during festivals?', a: 'Mornings (7 AM - 10 AM) and Friday evenings are usually busy. During festivals like Navaratri, expect larger crowds throughout the day.' },
              { q: 'Is photography allowed inside the sanctum?', a: 'Photography and videography are strictly prohibited inside the main sanctum to preserve the sanctity of the rituals.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button className="w-full p-6 text-left flex justify-between items-center group">
                  <span className="font-bold text-gray-800 group-hover:text-temple-red transition-colors">{faq.q}</span>
                  <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-temple-red group-hover:text-white transition-all">+</span>
                </button>
                <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-4">
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
