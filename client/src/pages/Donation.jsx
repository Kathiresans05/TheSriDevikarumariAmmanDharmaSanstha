import React, { useState } from 'react';
import { CreditCard, Landmark, QrCode, Heart, LogIn, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTemple } from '../context/TempleContext';

const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001/api`;

const Donation = () => {
  const { user, submitDonation } = useTemple();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCause, setSelectedCause] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDonateAction = (cause) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedCause(cause);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://${window.location.hostname}:5001/api/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server returned ' + response.status);
      }
      const data = await response.json();
      setReceiptUrl(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Receipt upload failed: ' + err.message + '. Please check if server is running on port 5001.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDonation = async (e) => {
    e.preventDefault();
    if (!receiptUrl) {
      alert('Please upload your payment receipt screenshot first.');
      return;
    }
    setIsSubmitting(true);
    
    const result = await submitDonation({
      amount: `₹ ${amount}`,
      cause: selectedCause,
      transactionId,
      receipt: receiptUrl
    });

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setShowSuccess(false);
        setAmount('');
        setTransactionId('');
        setReceiptUrl('');
      }, 3000);
    } else {
      alert(result.message);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start gap-6 hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-16 h-16 bg-red-50 text-temple-red rounded-2xl flex items-center justify-center flex-shrink-0">
                <Heart size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Annadhanam Scheme</h4>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Feed 100 devotees daily. A donation of ₹ 5,000 sponsors one full day of Annadhanam.</p>
                <button onClick={() => handleDonateAction('Annadhanam')} className="bg-red-50 text-temple-red px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-temple-red hover:text-white transition-all">Select This Cause</button>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-start gap-6 hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Landmark size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Temple Renovation</h4>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Help us maintain the architectural glory of the temple. Support the Kumbabishekam fund.</p>
                <button onClick={() => handleDonateAction('Temple Renovation')} className="bg-amber-50 text-amber-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 hover:text-white transition-all">Select This Cause</button>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="relative">
            {!user && (
              <div className="absolute inset-0 z-20 backdrop-blur-[2px] bg-white/40 flex items-center justify-center rounded-3xl overflow-hidden">
                <div className="bg-white p-10 rounded-[32px] shadow-2xl border border-temple-gold/20 text-center max-w-sm transform hover:scale-105 transition-transform duration-500">
                  <div className="w-20 h-20 bg-temple-red/10 text-temple-red rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <LogIn size={40} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">Login Required</h3>
                  <p className="text-gray-500 text-sm mb-8">Please login to access payment details and contribute to the temple's Dharma.</p>
                  <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-temple-red text-white py-4 rounded-2xl font-bold hover:bg-temple-saffron shadow-lg shadow-temple-red/20 transition-all flex items-center justify-center gap-2"
                  >
                    Login to Continue
                  </button>
                </div>
              </div>
            )}
            
            <div className={`bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 ${!user ? 'grayscale-[0.5] opacity-50 blur-[1px]' : ''}`}>
              <h3 className="text-2xl font-serif text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-temple-saffron/10 text-temple-saffron rounded-xl flex items-center justify-center">
                  <QrCode size={20} />
                </div>
                Payment Information
              </h3>

              <div className="space-y-8">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Landmark size={18} className="text-temple-saffron" /> Official Bank Account
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b border-gray-200/50 pb-3"><span className="text-gray-500">Bank Name:</span> <span className="font-bold text-gray-800">State Bank of India</span></div>
                    <div className="flex justify-between border-b border-gray-200/50 pb-3"><span className="text-gray-500">Account No:</span> <span className="font-bold text-gray-800 tracking-wider">12345678901</span></div>
                    <div className="flex justify-between border-b border-gray-200/50 pb-3"><span className="text-gray-500">IFSC Code:</span> <span className="font-bold text-gray-800 tracking-wider">SBIN0001234</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Branch:</span> <span className="font-bold text-gray-800">Thiruverkadu, Chennai</span></div>
                  </div>
                </div>

                <div className="text-center p-8 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-100">
                  <div className="w-48 h-48 bg-white mx-auto rounded-2xl flex flex-col items-center justify-center border-2 border-gray-100 shadow-inner mb-6 p-4">
                    <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                       <QrCode size={80} className="text-gray-300" />
                    </div>
                  </div>
                  <p className="text-lg font-black text-gray-900 mb-1">devikarumari@sbi</p>
                  <p className="text-xs text-gray-400 font-medium">Scan with any UPI App (GPay, PhonePe, Paytm)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-md relative z-10 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            {showSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-500">Your contribution details have been recorded. Our administrative team will verify and issue the receipt soon.</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmDonation} className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Confirm Contribution</h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Selected Cause</label>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold text-temple-red">
                      {selectedCause}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Donation Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-temple-red outline-none font-bold text-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Transaction ID / Ref No.</label>
                    <input 
                      type="text" 
                      required
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 123456789012"
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-temple-red outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Upload Receipt Screenshot</label>
                    <div className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all ${receiptUrl ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-temple-red'}`}>
                      {isUploading ? (
                        <div className="py-2 text-sm text-gray-500 animate-pulse">Uploading...</div>
                      ) : receiptUrl ? (
                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold text-sm">
                          <CheckCircle2 size={16} /> Receipt Uploaded
                        </div>
                      ) : (
                        <label className="cursor-pointer block">
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                          <div className="text-xs text-gray-400">Click to upload screenshot</div>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-[10px] text-blue-700 leading-relaxed font-medium">
                    Please ensure you have completed the payment via Bank Transfer or UPI before submitting this form. This helps our team track and confirm your donation.
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="w-full bg-temple-red text-white py-4 rounded-2xl font-bold hover:bg-temple-saffron shadow-lg shadow-temple-red/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Submission'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Donation;
