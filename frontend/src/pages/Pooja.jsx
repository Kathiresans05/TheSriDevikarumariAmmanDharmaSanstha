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

  const [showModal, setShowModal] = useState(false);
  const [selectedSeva, setSelectedSeva] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    devoteeName: user?.name || '',
    gothram: '',
    nakshatram: '',
    date: '',
    time: 'Morning',
    transactionId: ''
  });
  const [step, setStep] = useState(1); // 1: Details, 2: Payment

  const handleBookClick = (seva) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedSeva(seva);
    setStep(1);
    setShowModal(true);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!bookingForm.date) {
      setStatus({ type: 'error', msg: 'Please select a date' });
      return;
    }
    setStep(2);
  };

  const handleFinalBooking = async (e) => {
    e.preventDefault();
    if (!bookingForm.transactionId) {
      setStatus({ type: 'error', msg: 'Please enter Payment Transaction ID' });
      return;
    }

    setStatus({ type: 'success', msg: 'Verifying Transaction...' });
    
    setTimeout(async () => {
      const result = await bookSeva({
        ...bookingForm,
        sevaId: selectedSeva.id,
        amount: selectedSeva.price
      });

      if (result.success) {
        setStatus({ type: 'success', msg: 'Booking Submitted! Pending Admin Verification.' });
        setShowModal(false);
      } else {
        setStatus({ type: 'error', msg: result.message });
      }
    }, 1500);
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
                    onClick={() => handleBookClick(p)}
                    className="bg-temple-red text-white h-9 md:h-12 px-3 md:px-6 rounded-lg md:rounded-xl font-bold hover:bg-temple-saffron transition-all shadow-lg active:scale-95 text-[10px] md:text-base whitespace-nowrap"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
              >
                <div className="p-6 bg-temple-red text-white flex justify-between items-center">
                  <h3 className="text-xl font-serif font-bold">
                    {step === 1 ? 'Pooja Booking Details' : 'Secure Payment'}
                  </h3>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="p-8">
                  <div className="bg-temple-gold/10 p-4 rounded-2xl flex justify-between items-center mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-temple-gold uppercase tracking-widest">Selected Pooja</p>
                      <p className="font-bold text-gray-800">{selectedSeva?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-temple-gold uppercase tracking-widest">Amount</p>
                      <p className="text-xl font-bold text-temple-red">{selectedSeva?.price.includes('₹') ? selectedSeva?.price : `₹${selectedSeva?.price}`}</p>
                    </div>
                  </div>

                  {step === 1 ? (
                    <form onSubmit={handleNextStep} className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Devotee Name</label>
                          <input 
                            type="text" 
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-temple-red"
                            value={bookingForm.devoteeName}
                            onChange={(e) => setBookingForm({...bookingForm, devoteeName: e.target.value})}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Gothram</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-temple-red"
                              placeholder="Optional"
                              value={bookingForm.gothram}
                              onChange={(e) => setBookingForm({...bookingForm, gothram: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nakshatram</label>
                            <input 
                              type="text" 
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-temple-red"
                              placeholder="Optional"
                              value={bookingForm.nakshatram}
                              onChange={(e) => setBookingForm({...bookingForm, nakshatram: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Pooja Date</label>
                            <input 
                              type="date" 
                              required
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-temple-red"
                              value={bookingForm.date}
                              onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Session</label>
                            <select 
                              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 outline-none focus:border-temple-red"
                              value={bookingForm.time}
                              onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
                            >
                              <option>Morning</option>
                              <option>Afternoon</option>
                              <option>Evening</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-temple-red text-white py-4 rounded-2xl font-bold shadow-lg shadow-temple-red/20 hover:bg-temple-saffron transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
                      >
                        Proceed to Payment
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleFinalBooking} className="space-y-6">
                      <div className="text-center space-y-4">
                        <p className="text-sm text-gray-600">Please scan the QR code below to pay <span className="font-bold text-temple-red">{selectedSeva?.price.includes('₹') ? selectedSeva?.price : `₹${p.price}`}</span></p>
                        
                        {/* Dummy QR Code */}
                        <div className="w-48 h-48 bg-white border-2 border-dashed border-gray-200 mx-auto rounded-3xl flex items-center justify-center relative overflow-hidden group">
                           <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=temple@upi&pn=SriDevikarumariAmman&am=${selectedSeva?.price.replace(/[^0-9]/g, '')}&cu=INR`} 
                            alt="Payment QR Code" 
                            className="w-40 h-40"
                           />
                           <div className="absolute inset-0 bg-temple-red/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <p className="text-[10px] font-bold text-temple-red uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">Scan to Pay</p>
                           </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">UPI ID</p>
                          <p className="text-lg font-bold text-gray-800">temple@upi</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Transaction ID / UTR Number</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Enter 12-digit Transaction ID"
                          className="w-full px-4 py-4 rounded-2xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-red font-mono text-center tracking-widest"
                          value={bookingForm.transactionId}
                          onChange={(e) => setBookingForm({...bookingForm, transactionId: e.target.value})}
                        />
                        <p className="text-[9px] text-gray-400 mt-2 text-center italic">Example: 412389021345</p>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex-1 px-4 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
                        >
                          Back
                        </button>
                        <button 
                          type="submit"
                          className="flex-[2] bg-temple-red text-white py-4 rounded-2xl font-bold shadow-lg shadow-temple-red/20 hover:bg-temple-saffron transition-all active:scale-[0.98]"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </form>
                  )}
                  <p className="text-center text-[10px] text-gray-400 uppercase tracking-tighter mt-6">Manual Verification by Temple Administration</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
