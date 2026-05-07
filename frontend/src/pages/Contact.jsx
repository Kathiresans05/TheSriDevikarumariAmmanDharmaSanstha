import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useTemple } from '../context/TempleContext';

const Contact = () => {
  const { templeData } = useTemple();

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <div>
            <h2 className="text-3xl font-serif text-temple-red mb-8">Get in Touch</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-temple-saffron/10 text-temple-saffron rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Temple Address</h4>
                  <p className="text-gray-600">{templeData.address}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-temple-saffron/10 text-temple-saffron rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone Number</h4>
                  <p className="text-gray-600">{templeData.phone}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-temple-saffron/10 text-temple-saffron rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Email ID</h4>
                  <p className="text-gray-600">{templeData.email}</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-temple-saffron/10 text-temple-saffron rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Office Hours</h4>
                  <p className="text-gray-600">{templeData.officeHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-serif text-temple-red mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-saffron outline-none transition-all" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-saffron outline-none transition-all" placeholder="Enter your email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-saffron outline-none transition-all">
                  <option>Pooja Booking Inquiry</option>
                  <option>Donation Information</option>
                  <option>Festival Schedule</option>
                  <option>General Query</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-saffron outline-none transition-all" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-temple-red text-white font-bold py-4 rounded-xl hover:bg-temple-saffron transition-all transform active:scale-95 shadow-lg">
                Submit Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Google Maps Integration Placeholder */}
      <section className="h-96 w-full bg-gray-200 grayscale hover:grayscale-0 transition-all duration-700">
        <iframe 
          title="Google Map"
          className="w-full h-full border-0"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15545.4578148943!2d80.12648795!3d13.0760432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52618a80000001%3A0x33e54b677a28e3!2sArulmigu%20Devi%20Karumariamman%20Temple!5e0!3m2!1sen!2sin!4v1714900000000!5m2!1sen!2sin" 
          allowFullScreen="" 
          loading="lazy"
        ></iframe>
      </section>
    </div>
  );
};

export default Contact;
