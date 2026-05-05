import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Image as ImageIcon, 
  Heart, 
  Settings, 
  LogOut,
  Bell,
  Search,
  Plus,
  Star
} from 'lucide-react';

import { useTemple } from '../../context/TempleContext';

const AdminDashboard = () => {
  const { templeData, updateTempleData } = useTemple();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState(templeData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('image'); // 'image', 'video', 'booking', 'event'
  const [modalData, setModalData] = useState({ name: '', title: '', price: '', desc: '', date: '', src: '', icon: 'ॐ' });

  const handleAddEntry = () => {
    let newData = { ...templeData };
    
    if (modalType === 'seva') {
      const newSeva = {
        id: Date.now(),
        name: modalData.name || modalData.title,
        price: modalData.price,
        desc: modalData.desc,
        icon: modalData.icon || 'ॐ'
      };
      newData.sevas = [...(newData.sevas || []), newSeva];
    }

    updateTempleData(newData);
    setIsModalOpen(false);
    setModalData({ name: '', title: '', price: '', desc: '', date: '', src: '' });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateTempleData(formData);
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const stats = [
    { label: 'Total Bookings', value: '1,284', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Donations', value: '₹ 4,52,000', icon: Heart, color: 'bg-red-500' },
    { label: 'Monthly Visitors', value: '12,500', icon: Users, color: 'bg-green-500' },
    { label: 'Active Events', value: '5', icon: ImageIcon, color: 'bg-purple-500' },
  ];

  const recentBookings = [
    { id: 1, user: 'Rajesh Kumar', pooja: 'Abishekam', date: '2026-05-10', status: 'Confirmed' },
    { id: 2, user: 'Senthil Mani', pooja: 'Thanga Ratham', date: '2026-05-12', status: 'Pending' },
    { id: 3, user: 'Meena Iyer', pooja: 'Laksharchana', date: '2026-05-15', status: 'Confirmed' },
    { id: 4, user: 'Anand Dev', pooja: 'Annadhanam', date: '2026-05-08', status: 'Completed' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-temple-gold rounded-full flex items-center justify-center">
              <span className="text-temple-red font-bold text-xl">ॐ</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm leading-tight">TEMPLE ADMIN</h1>
              <p className="text-[10px] text-gray-400">Control Panel v1.0</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'sevas', label: 'Manage Sevas', icon: Star },
            { id: 'bookings', label: 'Pooja Bookings', icon: Calendar },
            { id: 'donations', label: 'Donations', icon: Heart },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'events', label: 'Events', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                activeTab === item.id 
                ? 'bg-temple-gold text-temple-red shadow-lg shadow-temple-gold/20 scale-[1.02]' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} className="flex-shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-lg text-sm transition-all">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search bookings, transactions..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-gray-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">Admin User</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-temple-red rounded-full flex items-center justify-center text-white font-bold">A</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Dashboard Overview</h2>
                <button 
                  onClick={() => { setModalType('booking'); setIsModalOpen(true); }}
                  className="bg-temple-red text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-temple-saffron transition-all shadow-md active:scale-95"
                >
                  <Plus size={18} /> Add New Entry
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                        <stat.icon size={24} />
                      </div>
                      <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded">+12.5%</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <h4 className="text-2xl font-bold text-gray-800">{stat.value}</h4>
                  </div>
                ))}
              </div>

              {/* Recent Activity Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">Recent Pooja Bookings</h3>
                  <button className="text-temple-red text-sm font-bold hover:underline">View All</button>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Devotee Name</th>
                      <th className="px-6 py-4">Pooja Type</th>
                      <th className="px-6 py-4">Booking Date</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-400">#00{booking.id}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-800">{booking.user}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{booking.pooja}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-gray-400 hover:text-gray-600 text-xs font-bold">Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Manage Pooja Bookings</h2>
                <div className="flex gap-3">
                  <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all">Filter</button>
                  <button className="bg-temple-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-temple-saffron transition-all shadow-md">Export PDF</button>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Devotee</th>
                      <th className="px-6 py-4">Pooja Type</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { id: '101', name: 'Rajesh Kumar', pooja: 'Abishekam', date: 'Oct 10, 2026', time: '06:00 AM', status: 'Confirmed', amount: '₹ 501' },
                      { id: '102', name: 'Senthil Mani', pooja: 'Thanga Ratham', date: 'Oct 12, 2026', time: '10:30 AM', status: 'Pending', amount: '₹ 5,000' },
                      { id: '103', name: 'Meena Iyer', pooja: 'Laksharchana', date: 'Oct 15, 2026', time: '09:00 AM', status: 'Confirmed', amount: '₹ 1,001' },
                      { id: '104', name: 'Anand Dev', pooja: 'Annadhanam', date: 'Oct 08, 2026', time: '12:00 PM', status: 'Completed', amount: '₹ 10,001' },
                      { id: '105', name: 'Vijay Ram', pooja: 'Archana', date: 'Oct 20, 2026', time: '05:30 PM', status: 'Confirmed', amount: '₹ 101' },
                    ].map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-400">#{row.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-800">{row.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.pooja}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{row.date}<br/><span className="text-[10px] text-gray-400">{row.time}</span></td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                            row.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                            row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-temple-red">{row.amount}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button className="text-gray-400 hover:text-blue-600 transition-colors"><Plus size={16} /></button>
                          <button className="text-gray-400 hover:text-red-600 transition-colors"><LogOut size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Donation History</h2>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold">Total this month: ₹ 1,24,000</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Dr. Subramanian', amount: '₹ 25,000', cause: 'Temple Renovation', date: '2 hours ago' },
                  { name: 'Anonymous Devotee', amount: '₹ 5,000', cause: 'Daily Annadhanam', date: '5 hours ago' },
                  { name: 'Mrs. Lakshmi Narayanan', amount: '₹ 10,001', cause: 'Goshala Maintenance', date: '1 day ago' },
                  { name: 'Siva & Family', amount: '₹ 1,116', cause: 'Lamp Oil Seva', date: '2 days ago' },
                ].map((don, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-temple-red/10 text-temple-red rounded-full flex items-center justify-center">
                        <Heart size={20} />
                      </div>
                      <span className="text-xs text-gray-400 italic">{don.date}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1">{don.name}</h4>
                    <p className="text-2xl font-serif font-bold text-temple-red mb-3">{don.amount}</p>
                    <p className="text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full inline-block">{don.cause}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-800">Temple Media Manager</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage images and spiritual videos for the gallery</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setModalType('image'); setIsModalOpen(true); }}
                    className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
                  >
                    <ImageIcon size={18} /> Add Image
                  </button>
                  <button 
                    onClick={() => { setModalType('video'); setIsModalOpen(true); }}
                    className="bg-temple-red text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-temple-saffron transition-all shadow-md flex items-center gap-2 active:scale-95"
                  >
                    <Plus size={18} /> Add Video
                  </button>
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[
                  { type: 'image', src: '/hero-temple.png' },
                  { type: 'video', src: '/hero-night.png', label: 'Temple Evening Aarti' },
                  { type: 'image', src: '/hero-pond.png' },
                  { type: 'video', src: '/hero-festival.png', label: 'Navaratri Celebrations' },
                  { type: 'image', src: '/hero-temple.png' },
                ].map((item, i) => (
                  <div key={i} className="group relative aspect-video md:aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={item.src} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      alt="Gallery Asset"
                    />
                    {item.type === 'video' && (
                      <div className="absolute top-2 right-2 bg-temple-red text-white p-1.5 rounded-lg shadow-lg">
                        <Plus size={14} className="rotate-45" /> {/* Video Icon placeholder */}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      {item.type === 'video' && <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2"><Plus size={20} className="text-white" /></div>}
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-3">{item.type}</p>
                      <div className="flex gap-2">
                        <button className="p-2 bg-white text-gray-800 rounded-lg hover:bg-temple-gold transition-colors"><Search size={16} /></button>
                        <button className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"><LogOut size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-temple-gold hover:text-temple-gold transition-all hover:bg-gray-50">
                  <Plus size={32} />
                  <span className="text-xs font-bold mt-2">Add Media</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Festival & Event Calendar</h2>
                <button 
                  onClick={() => { setModalType('event'); setIsModalOpen(true); }}
                  className="bg-temple-red text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-temple-saffron transition-all active:scale-95 shadow-md"
                >
                  <Plus size={18} /> Add Event
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Navaratri Festival', date: 'Oct 15 - Oct 24, 2026', type: 'Grand Festival', attendees: '50,000+' },
                  { name: 'Deepavali Special Pooja', date: 'Nov 01, 2026', type: 'Special Pooja', attendees: '15,000+' },
                  { name: 'Karthigai Deepam', date: 'Nov 20, 2026', type: 'Lamp Festival', attendees: '25,000+' },
                  { name: 'Pournami Abishekam', date: 'Dec 05, 2026', type: 'Monthly Ritual', attendees: '5,000+' },
                ].map((ev, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-temple-gold transition-colors">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-temple-gold/10 text-temple-gold rounded-xl flex flex-col items-center justify-center font-bold">
                        <span className="text-[10px] uppercase">OCT</span>
                        <span className="text-xl leading-none">15</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{ev.name}</h4>
                        <p className="text-sm text-gray-500">{ev.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                      <div className="text-right hidden md:block">
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Expected Crowd</p>
                        <p className="text-sm font-bold text-gray-700">{ev.attendees}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-3 py-1 rounded-full">{ev.type}</span>
                      <button className="text-temple-red font-bold text-sm hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sevas' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-800">Temple Sevas & Rituals</h2>
                  <p className="text-sm text-gray-500 mt-1">Configure the sacred offerings and their pricing</p>
                </div>
                <button 
                  onClick={() => { setModalType('seva'); setIsModalOpen(true); }}
                  className="bg-temple-red text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-temple-saffron transition-all shadow-md"
                >
                  <Plus size={18} /> Add New Seva
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templeData.sevas?.map((seva) => (
                  <div key={seva.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:border-temple-gold transition-all relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-temple-gold/10 text-temple-gold rounded-xl flex items-center justify-center font-bold text-xl">{seva.icon || 'ॐ'}</div>
                      <div className="flex gap-1">
                        <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Search size={16} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><LogOut size={16} className="rotate-45" /></button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{seva.name}</h4>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">{seva.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <span className="text-temple-red font-bold">{seva.price}</span>
                      <button className="text-xs font-bold text-temple-gold uppercase tracking-widest hover:underline">Edit Details</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <h2 className="text-2xl font-serif font-bold text-gray-800">System Settings</h2>
              
              {/* Temple Profile */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-temple-red/10 text-temple-red rounded-lg flex items-center justify-center"><Settings size={18} /></div>
                  Temple Profile Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Temple Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-temple-gold outline-none" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Primary Contact Email</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-gold outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Primary Phone Number</label>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-gold outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Office Hours</label>
                    <input 
                      type="text" 
                      value={formData.officeHours} 
                      onChange={(e) => setFormData({...formData, officeHours: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-gold outline-none transition-all" 
                      placeholder="e.g. Mon-Sun: 9 AM - 6 PM"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Special Days Timing</label>
                    <input 
                      type="text" 
                      value={formData.specialDays} 
                      onChange={(e) => setFormData({...formData, specialDays: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-temple-gold outline-none transition-all" 
                      placeholder="e.g. 6:00 AM - 10:00 PM"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Temple Address</label>
                    <textarea 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-temple-gold outline-none h-24" 
                    />
                  </div>
                </div>
              </div>

              {/* Timing Settings */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Calendar size={18} /></div>
                  Darshan & Pooja Hours
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase">Morning Session</p>
                    <div className="flex gap-4">
                      <input type="time" defaultValue="06:00" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                      <span className="flex items-center">to</span>
                      <input type="time" defaultValue="12:30" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase">Evening Session</p>
                    <div className="flex gap-4">
                      <input type="time" defaultValue="16:00" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                      <span className="flex items-center">to</span>
                      <input type="time" defaultValue="21:00" className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-colors">Discard Changes</button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`bg-temple-red text-white px-10 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center gap-3 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:bg-temple-saffron'}`}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : 'Save Settings'}
                </button>
              </div>

              {/* Success Toast */}
              {showToast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce-in z-50">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Settings Saved!</p>
                    <p className="text-[10px] text-gray-400">Temple configuration updated successfully.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add New Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] w-full max-w-xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-2xl font-serif font-bold text-gray-800 capitalize">Add New {modalType}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {modalType === 'image' || modalType === 'video' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-temple-gold transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-temple-gold/10 group-hover:text-temple-gold transition-all">
                      <Plus size={32} />
                    </div>
                    <p className="font-bold text-gray-800">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Description / Caption</label>
                    <input 
                      type="text" 
                      value={modalData.desc}
                      onChange={(e) => setModalData({...modalData, desc: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                      placeholder="Enter a brief description..." 
                    />
                  </div>
                </div>
              ) : modalType === 'seva' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Seva Name</label>
                      <input 
                        type="text" 
                        value={modalData.name}
                        onChange={(e) => setModalData({...modalData, name: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="e.g. Special Abishekam" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Price</label>
                      <input 
                        type="text" 
                        value={modalData.price}
                        onChange={(e) => setModalData({...modalData, price: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="e.g. ₹501" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase block mb-3">Choose Sacred Icon</label>
                    <div className="flex gap-3">
                      {['ॐ', '🪔', '🔔', '🌸', '🍲', '🔱', '🕯️'].map((icon) => (
                        <button 
                          key={icon}
                          onClick={() => setModalData({...modalData, icon})}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${modalData.icon === icon ? 'bg-temple-gold text-white scale-110 shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea 
                      value={modalData.desc}
                      onChange={(e) => setModalData({...modalData, desc: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all h-24" 
                      placeholder="Describe the ritual details..."
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Title / Name</label>
                      <input 
                        type="text" 
                        value={modalData.title}
                        onChange={(e) => setModalData({...modalData, title: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="Enter title" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Date</label>
                      <input 
                        type="date" 
                        value={modalData.date}
                        onChange={(e) => setModalData({...modalData, date: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Additional Notes</label>
                    <textarea 
                      value={modalData.desc}
                      onChange={(e) => setModalData({...modalData, desc: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all h-24" 
                      placeholder="Enter details..."
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                <button 
                  onClick={handleAddEntry}
                  className="flex-1 bg-temple-red text-white px-6 py-4 rounded-xl font-bold hover:bg-temple-saffron shadow-lg shadow-temple-red/20 transition-all active:scale-95"
                >
                  Create Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
