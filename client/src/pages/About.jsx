import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div>
      <section className="gradient-mixed text-white py-12 md:py-20 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-serif mb-4 md:mb-6">Our History & Legacy</h1>
        <div className="w-20 h-1 bg-temple-gold mx-auto"></div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src="/interior-deity.png" 
              alt="Sri Devikarumari Amman" 
              className="rounded-2xl shadow-2xl temple-border border-8"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-serif text-temple-red mb-6">The Story of Goddess Devikarumari</h2>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Legend says that Goddess Karumari took the form of a soothsayer to teach a lesson to the egoistic Surya (Sun God). The temple at Thiruverkadu is believed to be the place where the Goddess resides in her most powerful and benevolent form.
              </p>
              <p>
                The name "Karumari" comes from 'Karum' (Dark/Rain cloud) and 'Mari' (Rain), signifying the Goddess as the bringer of life-sustaining rain and the protector of the universe.
              </p>
              <h3 className="text-2xl font-serif text-temple-saffron mt-8">Our Mission</h3>
              <p>
                To preserve and promote the rich Vedic traditions, perform ancient rituals with devotion, and serve the community through humanitarian acts (Dharma).
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-temple-cream py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-serif text-center text-temple-red mb-16">Temple Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6">
              <div className="text-4xl mb-4 text-temple-gold font-serif italic">01.</div>
              <h4 className="text-xl font-bold mb-4">Bhakti (Devotion)</h4>
              <p className="text-gray-600 text-sm">Fostering a deep spiritual connection with the Divine through prayer and rituals.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4 text-temple-gold font-serif italic">02.</div>
              <h4 className="text-xl font-bold mb-4">Seva (Service)</h4>
              <p className="text-gray-600 text-sm">Selfless service to devotees and the underprivileged through Annadhanam and healthcare.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4 text-temple-gold font-serif italic">03.</div>
              <h4 className="text-xl font-bold mb-4">Dharma (Righteousness)</h4>
              <p className="text-gray-600 text-sm">Upholding the eternal principles of truth, compassion, and spiritual integrity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
