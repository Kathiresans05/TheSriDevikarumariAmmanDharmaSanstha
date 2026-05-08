import React, { useEffect, useState } from 'react';
import { useTemple } from '../../context/TempleContext';
import { Calendar, Heart, User, LogOut, Search, Bell, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user, logout, templeData } = useTemple();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getSevaName = (id) => {
    const seva = templeData.sevas?.find(s => s.id === id || s.id === parseInt(id));
    return seva ? seva.name : 'Pooja';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-temple-red rounded-full flex items-center justify-center text-white font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-gray-800 leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">Devotee Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'bookings' ? 'bg-temple-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Calendar size={18} /> My Bookings
          </button>
          <button 
            onClick={() => setActiveTab('donations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'donations' ? 'bg-temple-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <Heart size={18} /> My Donations
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-temple-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
          >
            <User size={18} /> My Profile
          </button>
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {/* Topbar */}
        <header className="bg-white h-20 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <h2 className="text-xl font-serif font-bold text-gray-800">Welcome, {user.name.split(' ')[0]}</h2>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-gray-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-temple-red rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-temple-gold/10 text-temple-gold rounded-full flex items-center justify-center font-bold lg:hidden">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 bg-temple-red/10 text-temple-red rounded-2xl flex items-center justify-center shadow-inner">
                  <Calendar size={28} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Bookings</p>
                  <h4 className="text-3xl font-bold text-gray-800">{user.bookings?.length || 0}</h4>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shadow-inner">
                  <Heart size={28} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Total Donations</p>
                  <h4 className="text-3xl font-bold text-gray-800">{user.donations?.length || 0}</h4>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">Recent Pooja Bookings</h3>
                  <button onClick={() => navigate('/pooja')} className="text-temple-red text-sm font-bold hover:underline">+ New Booking</button>
                </div>
                
                <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest">
                          <th className="px-8 py-5">Pooja Type</th>
                          <th className="px-8 py-5">Date & Time</th>
                          <th className="px-8 py-5">Amount</th>
                          <th className="px-8 py-5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {user.bookings && user.bookings.length > 0 ? user.bookings.map((booking, i) => (
                          <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                            <td className="px-8 py-5">
                              <p className="font-bold text-gray-800">{getSevaName(booking.sevaId)}</p>
                              <p className="text-[10px] text-gray-400">ID: BK-{i+1000}</p>
                            </td>
                            <td className="px-8 py-5">
                              <p className="text-sm text-gray-600 flex items-center gap-2"><Clock size={14} className="text-gray-400" /> {new Date(booking.date).toLocaleDateString()}</p>
                              <p className="text-[10px] text-gray-400 ml-6">{booking.time}</p>
                            </td>
                            <td className="px-8 py-5 font-bold text-temple-red">{booking.amount}</td>
                            <td className="px-8 py-5">
                              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 w-fit ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {booking.status === 'Confirmed' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                              <p className="mb-4">No bookings found</p>
                              <button onClick={() => navigate('/pooja')} className="bg-temple-red text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg">Book Now</button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">My Donation History</h3>
                  <button onClick={() => navigate('/donations')} className="text-temple-red text-sm font-bold hover:underline">+ New Donation</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.donations && user.donations.length > 0 ? user.donations.map((don, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between hover:border-temple-gold transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-50 p-3 rounded-2xl text-green-600"><Heart size={20} /></div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${don.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {don.status || 'Pending'}
                        </span>
                      </div>
                      <h5 className="font-bold text-gray-800 mb-1">{don.cause}</h5>
                      <p className="text-xs text-gray-400 mb-4">{new Date(don.date).toLocaleDateString()}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <p className="text-lg font-bold text-temple-red">{don.amount}</p>
                        {don.receipt && <a href={don.receipt} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-500 hover:underline">View Receipt</a>}
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                       No donations recorded yet.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm max-w-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-8">Devotee Profile</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Full Name</p>
                      <p className="font-bold text-gray-800">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email ID</p>
                      <p className="font-bold text-gray-800">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone Number</p>
                      <p className="font-bold text-gray-800">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Account Since</p>
                      <p className="font-bold text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all">Edit Profile</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
