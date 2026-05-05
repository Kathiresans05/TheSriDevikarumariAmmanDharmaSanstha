import React from 'react';
import { CreditCard, Landmark, QrCode, Heart } from 'lucide-react';

const Donation = () => {
  return (
    <div>
      <section className="bg-gradient-to-r from-temple-red to-temple-saffron text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 border-8 border-white rounded-full -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-8 border-white rounded-full -mr-48 -mb-48"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-5xl font-serif mb-6">Sacred Contribution (Daan)</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            "Your contribution is a seed of Dharma that will grow into a tree of spiritual abundance for all."
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Donation Options */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif text-temple-red mb-8">Support our Initiatives</h2>
            
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-start gap-6 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-temple-saffron/10 text-temple-saffron rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Annadhanam Scheme</h4>
                <p className="text-gray-600 text-sm mb-4">Feed 100 devotees daily. A donation of ₹ 5,000 sponsors one full day of Annadhanam.</p>
                <button className="text-temple-red font-bold hover:underline">Select This Cause</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-start gap-6 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-temple-gold/10 text-temple-gold rounded-xl flex items-center justify-center flex-shrink-0">
                <Landmark size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-2">Temple Renovation</h4>
                <p className="text-gray-600 text-sm mb-4">Help us maintain the architectural glory of the temple. Support the Kumbabishekam fund.</p>
                <button className="text-temple-red font-bold hover:underline">Select This Cause</button>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-temple-cream p-10 rounded-3xl border-2 border-temple-gold/20">
            <h3 className="text-2xl font-serif text-temple-red mb-8 flex items-center gap-3">
              <QrCode className="text-temple-saffron" /> Payment Information
            </h3>

            <div className="space-y-8">
              <div className="bg-white p-6 rounded-2xl border border-temple-gold/30">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Landmark size={18} className="text-temple-saffron" /> Bank Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Bank Name:</span> <span className="font-semibold text-gray-800">State Bank of India</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Account No:</span> <span className="font-semibold text-gray-800">12345678901</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">IFSC Code:</span> <span className="font-semibold text-gray-800">SBIN0001234</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Branch:</span> <span className="font-semibold text-gray-800">Thiruverkadu, Chennai</span></div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-48 h-48 bg-gray-200 mx-auto rounded-xl flex items-center justify-center border-4 border-white shadow-lg mb-4">
                  <span className="text-gray-400 font-bold">UPI QR CODE</span>
                </div>
                <p className="text-sm font-bold text-gray-700">UPI ID: devikarumari@sbi</p>
                <p className="text-xs text-gray-500 mt-2">Scan to donate instantly via GPay, PhonePe, or Paytm</p>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button className="w-full bg-temple-gold text-white font-bold py-4 rounded-xl hover:bg-temple-saffron transition-all shadow-lg flex items-center justify-center gap-3">
                  <CreditCard size={20} /> Pay via Credit/Debit Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donation;
