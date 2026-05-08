import React, { useState, useEffect } from 'react';
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
  Star,
  Edit,
  Menu,
  X
} from 'lucide-react';

import { useTemple } from '../../context/TempleContext';
import { useToast } from '../../components/Toast';
import ConfirmModal from '../../components/ConfirmModal';

const API_BASE = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5001/api' : 'https://thesridevikarumariammandharmasanstha.onrender.com/api');

const AdminDashboard = () => {
  const { templeData, updateTempleData } = useTemple();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [adminBookings, setAdminBookings] = useState([]);
  const [adminDonations, setAdminDonations] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, onConfirm: () => {}, title: '', message: '' });

  useEffect(() => {
    fetchBookings();
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/donations`);
      if (response.ok) {
        const data = await response.json();
        setAdminDonations(data);
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    }
  };

  const fetchBookings = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/admin/bookings`);
      if (response.ok) {
        const data = await response.json();
        setAdminBookings(data);
      } else {
        const errData = await response.json();
        setError(`Server Error: ${errData.error || 'Unknown'}`);
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError(`Connection error: ${err.message}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleStatusUpdate = async (userId, bookingId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/admin/bookings/${userId}/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchBookings();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDonationStatusUpdate = async (userId, donationId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/admin/donations/${userId}/${donationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchDonations();
      }
    } catch (err) {
      console.error('Failed to update donation status:', err);
    }
  };

  // Local form state
  const [formData, setFormData] = useState(templeData);

  useEffect(() => {
    if (templeData) {
      setFormData(templeData);
    }
  }, [templeData]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('image'); // 'image', 'video', 'booking', 'event'
  const [modalData, setModalData] = useState({ name: '', title: '', price: '', desc: '', date: '', src: '', icon: 'ॐ', isFeatured: false });
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEditClick = (seva) => {
    setModalType('seva');
    setModalData({
      id: seva.id,
      name: seva.name,
      price: seva.price,
      desc: seva.desc,
      icon: seva.icon || 'ॐ',
      isFeatured: seva.isFeatured || false
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteSeva = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Seva',
      message: 'Are you sure you want to delete this seva? This action cannot be undone.',
      onConfirm: () => {
        let newData = { ...templeData };
        newData.sevas = newData.sevas.filter(s => s.id !== id);
        updateTempleData(newData);
        toast.success('Seva deleted successfully');
      }
    });
  };

  const handleDeleteGalleryItem = (id) => {
    setConfirmState({
      isOpen: true,
      title: 'Delete Media',
      message: 'Are you sure you want to delete this image? It will be removed from the gallery.',
      onConfirm: () => {
        let newData = { ...templeData };
        newData.gallery = newData.gallery.filter(item => item.id !== id);
        updateTempleData(newData);
        toast.success('Media deleted successfully');
      }
    });
  };

  const handleEditGalleryItem = (item) => {
    setModalType('image');
    setModalData({
      id: item.id,
      src: item.url,
      title: item.title,
      isFeatured: item.isFeatured || false
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleToggleFeaturedSeva = (id) => {
    let newData = { ...templeData };
    newData.sevas = newData.sevas.map(s => 
      s.id === id ? { ...s, isFeatured: !s.isFeatured } : s
    );
    updateTempleData(newData);
  };

  const handleToggleFeaturedGallery = (id) => {
    let newData = { ...templeData };
    newData.gallery = newData.gallery.map(item => 
      item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
    );
    updateTempleData(newData);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setModalData({ ...modalData, src: data.url });
      setIsUploading(false);
      toast.success('File uploaded successfully');
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed. Please try again.');
      setIsUploading(false);
    }
  };

  const handleAddEntry = () => {
    if (isUploading) {
      toast.error('Please wait for the upload to complete');
      return;
    }
    let newData = { ...templeData };
    
    if (modalType === 'seva') {
      if (isEditMode) {
        newData.sevas = newData.sevas.map(s => 
          s.id === modalData.id 
          ? { ...s, name: modalData.name, price: modalData.price, desc: modalData.desc, icon: modalData.icon, isFeatured: modalData.isFeatured } 
          : s
        );
      } else {
        const newSeva = {
          id: Date.now(),
          name: modalData.name || modalData.title,
          price: modalData.price,
          desc: modalData.desc,
          icon: modalData.icon || 'ॐ',
          isFeatured: modalData.isFeatured || false
        };
        newData.sevas = [...(newData.sevas || []), newSeva];
      }
    }

    if (modalType === 'festival' || modalType === 'event') {
      const type = modalType === 'festival' ? 'Festival' : 'Event';
      if (isEditMode) {
        newData.events = newData.events.map(ev => 
          ev.id === modalData.id 
          ? { ...ev, title: modalData.title, date: modalData.date, time: modalData.time, desc: modalData.desc, attendees: modalData.attendees, type, isFeatured: modalData.isFeatured, image: modalData.src } 
          : ev
        );
      } else {
        const newEntry = {
          id: Date.now().toString(),
          title: modalData.title,
          date: modalData.date,
          time: modalData.time || (modalType === 'festival' ? 'Full Day' : ''),
          desc: modalData.desc,
          attendees: modalData.attendees || '0',
          type,
          isFeatured: modalData.isFeatured || false,
          image: modalData.src || ''
        };
        newData.events = [...(newData.events || []), newEntry];
      }
    }

    if (modalType === 'image' || modalType === 'video') {
      if (isEditMode) {
        newData.gallery = newData.gallery.map(item => 
          item.id === modalData.id 
          ? { ...item, url: modalData.src, title: modalData.title, type: modalType === 'video' ? 'video' : 'photo', isFeatured: modalData.isFeatured } 
          : item
        );
      } else {
        const newMedia = {
          id: Date.now().toString(),
          url: modalData.src || '/hero-temple.png',
          title: modalData.title || 'Temple Media',
          type: modalType === 'video' ? 'video' : 'photo',
          isFeatured: modalData.isFeatured || false
        };
        newData.gallery = [...(newData.gallery || []), newMedia];
      }
    }

    updateTempleData(newData);
    setIsModalOpen(false);
    setIsEditMode(false);
    setModalData({ name: '', title: '', price: '', desc: '', date: '', src: '', icon: 'ॐ', isFeatured: false });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateTempleData(formData);
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = [
    { label: 'Total Bookings', value: adminBookings.length, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: `₹ ${(
      adminBookings.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '') || 0), 0) +
      adminDonations.reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '') || 0), 0)
    ).toLocaleString()}`, icon: Heart, color: 'bg-red-500' },
    { label: 'Active Events', value: templeData.events?.length || 0, icon: Users, color: 'bg-green-500' },
    { label: 'Gallery Items', value: templeData.gallery?.length || 0, icon: ImageIcon, color: 'bg-purple-500' },
  ];

  const recentBookings = [
    { id: 1, user: 'Rajesh Kumar', pooja: 'Abishekam', date: '2026-05-10', status: 'Confirmed' },
    { id: 2, user: 'Senthil Mani', pooja: 'Thanga Ratham', date: '2026-05-12', status: 'Pending' },
    { id: 3, user: 'Meena Iyer', pooja: 'Laksharchana', date: '2026-05-15', status: 'Confirmed' },
    { id: 4, user: 'Anand Dev', pooja: 'Annadhanam', date: '2026-05-08', status: 'Completed' },
  ];

  const getSevaName = (id) => {
    const seva = templeData.sevas?.find(s => s.id === id || s.id === parseInt(id));
    return seva ? seva.name : 'Unknown Pooja';
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-temple-gold rounded-full flex items-center justify-center">
              <span className="text-temple-red font-bold text-xl">ॐ</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm leading-tight">TEMPLE ADMIN</h1>
              <p className="text-[10px] text-gray-400">Control Panel v1.0</p>
            </div>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
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
              onClick={() => { 
                setActiveTab(item.id); 
                setIsSidebarOpen(false);
                if(item.id === 'bookings') fetchBookings(); 
                if(item.id === 'donations') fetchDonations(); 
              }}
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
          <button className="w-full flex items-center gap-3 px-4 py-4 text-gray-400 hover:text-white hover:bg-red-500/10 rounded-lg text-sm transition-all min-h-[44px]">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-lg lg:w-96">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-gray-400 hover:text-gray-600 p-2">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="flex items-center gap-3 md:border-l md:pl-6 border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">Admin User</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Super Admin</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-temple-red rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden">
          <div className="p-4 md:p-8">
            {activeTab === 'overview' && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800">Dashboard Overview</h2>
                  <button 
                    onClick={() => { setModalType('booking'); setIsEditMode(false); setIsModalOpen(true); }}
                    className="w-full sm:w-auto bg-temple-red text-white px-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-temple-saffron transition-all shadow-md active:scale-95"
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
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
                        {adminBookings.slice(0, 5).map((booking) => (
                          <tr key={booking.bookingId} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-400">#{booking.bookingId.slice(-4)}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-800">{booking.devoteeName}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{getSevaName(booking.pooja)}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.date).toLocaleDateString()}</td>
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
                              <button className="text-gray-400 hover:text-gray-600 text-xs font-bold p-2 min-h-[44px]">Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
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
                      {isFetching ? (
                        <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400">Loading bookings...</td></tr>
                      ) : error ? (
                        <tr><td colSpan="7" className="px-6 py-10 text-center text-red-500 font-bold">{error}</td></tr>
                      ) : adminBookings.length > 0 ? adminBookings.map((booking) => (
                        <tr key={booking.bookingId} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-400">#{booking.bookingId.slice(-4)}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">{booking.devoteeName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{getSevaName(booking.pooja)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(booking.date).toLocaleDateString()}
                            <br/><span className="text-[10px] text-gray-400">{booking.time}</span>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={booking.status}
                              onChange={(e) => handleStatusUpdate(booking.userId, booking.bookingId, e.target.value)}
                              className={`text-[10px] uppercase font-bold px-2 py-1.5 rounded outline-none border-none cursor-pointer min-h-[32px] ${
                                booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-temple-red">{booking.amount}</td>
                          <td className="px-6 py-4">
                            <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 min-h-[44px]"><Search size={16} /></button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-10 text-center text-gray-400">No bookings found in database</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Donation History</h2>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-bold">
                  Total Verified: ₹ {adminDonations.filter(d => d.status === 'Verified').reduce((acc, curr) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '') || 0), 0).toLocaleString()}
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                        <th className="px-6 py-4">Devotee</th>
                        <th className="px-6 py-4">Cause</th>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Receipt</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {adminDonations.length > 0 ? adminDonations.map((don, i) => (
                        <tr key={don.id || i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-gray-800">{don.devoteeName}</p>
                            <p className="text-[10px] text-gray-400">{new Date(don.date).toLocaleDateString()}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{don.cause}</td>
                          <td className="px-6 py-4 text-xs font-mono text-gray-500">{don.transactionId || 'N/A'}</td>
                          <td className="px-6 py-4">
                            {don.receipt ? (
                              <a href={don.receipt} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs flex items-center gap-1 min-h-[32px]">
                                View <ImageIcon size={12} />
                              </a>
                            ) : 'No Receipt'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                              don.status === 'Verified' ? 'bg-green-100 text-green-700' :
                              don.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {don.status || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-temple-red">{don.amount}</td>
                          <td className="px-6 py-4">
                            {don.status !== 'Verified' && (
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleDonationStatusUpdate(don.userId, don.id, 'Verified')}
                                  className="text-xs font-bold text-green-600 hover:underline p-2 min-h-[44px]"
                                >
                                  Verify
                                </button>
                                <button 
                                  onClick={() => handleDonationStatusUpdate(don.userId, don.id, 'Rejected')}
                                  className="text-xs font-bold text-red-400 hover:underline p-2 min-h-[44px]"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-400">No donations found in database</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800">Temple Media Manager</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage images and spiritual videos for the gallery</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => { setModalType('image'); setIsEditMode(false); setIsModalOpen(true); }}
                    className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
                  >
                    <ImageIcon size={18} /> Add Image
                  </button>
                  <button 
                    onClick={() => { setModalType('video'); setIsEditMode(false); setIsModalOpen(true); }}
                    className="flex-1 sm:flex-none bg-temple-red text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-temple-saffron transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
                  >
                    <Plus size={18} /> Add Video
                  </button>
                </div>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {templeData.gallery?.map((item) => (
                  <div key={item.id} className="group relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={item.url} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                      <p className="text-white text-[10px] font-bold uppercase tracking-widest mb-3">IMAGE</p>
                      <p className="text-white text-xs font-medium mb-4 line-clamp-1">{item.title}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleToggleFeaturedGallery(item.id)}
                          className={`p-2 rounded-lg transition-colors ${item.isFeatured ? 'bg-temple-gold text-white' : 'bg-white/20 text-white hover:bg-temple-gold'}`}
                          title="Feature on Home"
                        >
                          <Star size={16} fill={item.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={() => handleEditGalleryItem(item)}
                          className="p-2 bg-white text-gray-800 rounded-lg hover:bg-temple-gold hover:text-white transition-colors"
                          title="Edit Image"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Image"
                        >
                          <LogOut size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => { setModalType('image'); setIsEditMode(false); setIsModalOpen(true); }}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-temple-gold hover:text-temple-gold transition-all hover:bg-gray-50"
                >
                  <Plus size={32} />
                  <span className="text-xs font-bold mt-2">Add Media</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-12">
              {/* Festival Section */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800">Events</h2>
                    <p className="text-sm text-gray-500">Upcoming festivals and sacred events</p>
                  </div>
                  <button 
                    onClick={() => { setModalType('event'); setIsEditMode(false); setModalData({ title: '', date: '', time: 'Full Day', type: 'Event', desc: '', attendees: '', isFeatured: true }); setIsModalOpen(true); }}
                    className="w-full sm:w-auto bg-temple-red text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-temple-saffron transition-all shadow-md active:scale-95 min-h-[44px]"
                  >
                    <Plus size={18} /> Add Event
                  </button>
                </div>
                <div className="space-y-4">
                  {templeData.events?.map((ev, i) => (
                    <div key={ev.id || i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-temple-gold transition-colors">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-temple-gold/10 text-temple-gold rounded-xl flex flex-col items-center justify-center font-bold">
                          <span className="text-[10px] uppercase">{ev.date ? ev.date.split(' ')[0] : 'TBD'}</span>
                          <span className="text-xl leading-none">{ev.date && ev.date.split(' ')[1] ? ev.date.split(' ')[1].replace(',', '') : '-'}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{ev.title}</h4>
                          <p className="text-sm text-gray-500">{ev.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12">
                        <div className="text-right hidden md:block">
                          <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Expected Crowd</p>
                          <p className="text-sm font-bold text-gray-700">{ev.attendees}</p>
                        </div>
                        <span className="bg-temple-red/10 text-temple-red text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-temple-red/20">{ev.type}</span>
                        <div className="flex gap-2">
                          <button onClick={() => { setModalType('event'); setModalData({...ev, src: ev.image}); setIsEditMode(true); setIsModalOpen(true); }} className="text-blue-500 font-bold text-sm hover:underline">Edit</button>
                          <button 
                            onClick={() => { 
                              setConfirmState({
                                isOpen: true,
                                title: 'Delete Event',
                                message: `Are you sure you want to delete "${ev.title}"?`,
                                onConfirm: () => {
                                  updateTempleData({ ...templeData, events: templeData.events.filter(e => e.id !== ev.id) });
                                  toast.success('Event deleted successfully');
                                }
                              });
                            }} 
                            className="text-red-500 font-bold text-sm hover:underline ml-4"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!templeData.events || templeData.events.length === 0) && (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                      No events added yet.
                    </div>
                  )}
                </div>
              </div>


            </div>
          )}

          {activeTab === 'sevas' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-800">Temple Sevas & Rituals</h2>
                  <p className="text-sm text-gray-500 mt-1">Configure the sacred offerings and their pricing</p>
                </div>
                <button 
                  onClick={() => { setModalType('seva'); setIsEditMode(false); setIsModalOpen(true); }}
                  className="w-full sm:w-auto bg-temple-red text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-temple-saffron transition-all shadow-md active:scale-95 min-h-[44px]"
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
                        <button 
                          onClick={() => handleToggleFeaturedSeva(seva.id)}
                          className={`p-2 rounded-lg transition-colors ${seva.isFeatured ? 'text-temple-gold' : 'text-gray-400 hover:text-temple-gold'}`}
                        >
                          <Star size={16} fill={seva.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(seva)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Search size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSeva(seva.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <LogOut size={16} className="rotate-45" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">{seva.name}</h4>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">{seva.desc}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <span className="text-temple-red font-bold">{seva.price}</span>
                      <button 
                        onClick={() => handleEditClick(seva)}
                        className="text-xs font-bold text-temple-gold uppercase tracking-widest hover:underline"
                      >
                        Edit Details
                      </button>
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
                      <input 
                        type="text" 
                        value={formData.timings?.morning?.open || "06:00 AM"} 
                        onChange={(e) => setFormData({
                          ...formData, 
                          timings: {
                            ...formData.timings,
                            morning: { ...formData.timings?.morning, open: e.target.value }
                          }
                        })}
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
                      />
                      <span className="flex items-center">to</span>
                      <input 
                        type="text" 
                        value={formData.timings?.morning?.close || "12:30 PM"} 
                        onChange={(e) => setFormData({
                          ...formData, 
                          timings: {
                            ...formData.timings,
                            morning: { ...formData.timings?.morning, close: e.target.value }
                          }
                        })}
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase">Evening Session</p>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={formData.timings?.evening?.open || "04:00 PM"} 
                        onChange={(e) => setFormData({
                          ...formData, 
                          timings: {
                            ...formData.timings,
                            evening: { ...formData.timings?.evening, open: e.target.value }
                          }
                        })}
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
                      />
                      <span className="flex items-center">to</span>
                      <input 
                        type="text" 
                        value={formData.timings?.evening?.close || "09:00 PM"} 
                        onChange={(e) => setFormData({
                          ...formData, 
                          timings: {
                            ...formData.timings,
                            evening: { ...formData.timings?.evening, close: e.target.value }
                          }
                        })}
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm" 
                      />
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

              {/* Old Success Toast removed in favor of react-hot-toast */}
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Add New Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-none md:rounded-[32px] w-full max-w-xl h-full md:h-auto md:max-h-[90vh] relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col">
            <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-800 capitalize">
                {isEditMode ? 'Edit' : 'Add New'} {modalType}
              </h3>
              <button onClick={() => { setIsModalOpen(false); setIsEditMode(false); }} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
              {modalType === 'image' || modalType === 'video' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Upload File (Cloudinary)</label>
                      <div className="mt-2 relative">
                        <input 
                          type="file" 
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`w-full p-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${isUploading ? 'border-temple-gold bg-temple-gold/5 animate-pulse' : 'border-gray-200 hover:border-temple-gold'}`}>
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-temple-gold border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs font-bold text-temple-gold">Uploading to Cloudinary...</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon size={16} className="text-gray-400" />
                              <span className="text-xs font-bold text-gray-500">Choose Image/Video</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Or Image URL</label>
                      <input 
                        type="text" 
                        value={modalData.src}
                        onChange={(e) => setModalData({...modalData, src: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="https://example.com/image.jpg" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Title / Caption</label>
                    <input 
                      type="text" 
                      value={modalData.title}
                      onChange={(e) => setModalData({...modalData, title: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                      placeholder="Enter a brief title..." 
                    />
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input 
                      type="checkbox" 
                      id="feat_gallery"
                      checked={modalData.isFeatured}
                      onChange={(e) => setModalData({...modalData, isFeatured: e.target.checked})}
                      className="w-5 h-5 rounded border-gray-300 text-temple-red focus:ring-temple-red"
                    />
                    <label htmlFor="feat_gallery" className="text-sm font-bold text-gray-700 cursor-pointer">Show on Home Page</label>
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
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input 
                      type="checkbox" 
                      id="feat_seva"
                      checked={modalData.isFeatured}
                      onChange={(e) => setModalData({...modalData, isFeatured: e.target.checked})}
                      className="w-5 h-5 rounded border-gray-300 text-temple-red focus:ring-temple-red"
                    />
                    <label htmlFor="feat_seva" className="text-sm font-bold text-gray-700 cursor-pointer">Feature on Home Page</label>
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
                        type="text" 
                        value={modalData.date}
                        onChange={(e) => setModalData({...modalData, date: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="e.g. Oct 15, 2026"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Time / Duration</label>
                      <input 
                        type="text" 
                        value={modalData.time}
                        onChange={(e) => setModalData({...modalData, time: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="e.g. Full Day or 6 PM" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Expected Crowd</label>
                      <input 
                        type="text" 
                        value={modalData.attendees}
                        onChange={(e) => setModalData({...modalData, attendees: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="e.g. 10,000+" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Upload Cover Image</label>
                      <div className="mt-2 relative">
                        <input 
                          type="file" 
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                        />
                        <div className={`w-full p-3 rounded-xl border-2 border-dashed flex items-center justify-center gap-2 transition-all ${isUploading ? 'border-temple-gold bg-temple-gold/5 animate-pulse' : 'border-gray-200 hover:border-temple-gold'}`}>
                          {isUploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-temple-gold border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-xs font-bold text-temple-gold">Uploading...</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon size={16} className="text-gray-400" />
                              <span className="text-xs font-bold text-gray-500">Choose Image</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase">Or Image URL</label>
                      <input 
                        type="text" 
                        value={modalData.src}
                        onChange={(e) => setModalData({...modalData, src: e.target.value})}
                        className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all" 
                        placeholder="https://example.com/image.jpg" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea 
                      value={modalData.desc}
                      onChange={(e) => setModalData({...modalData, desc: e.target.value})}
                      className="w-full mt-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-temple-gold transition-all h-24" 
                      placeholder="Enter details..."
                    ></textarea>
                  </div>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <input 
                      type="checkbox" 
                      id="feat_event"
                      checked={modalData.isFeatured}
                      onChange={(e) => setModalData({...modalData, isFeatured: e.target.checked})}
                      className="w-5 h-5 rounded border-gray-300 text-temple-red focus:ring-temple-red"
                    />
                    <label htmlFor="feat_event" className="text-sm font-bold text-gray-700 cursor-pointer">Feature on Home Page</label>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                <button 
                  onClick={handleAddEntry}
                  disabled={isUploading}
                  className={`flex-1 bg-temple-red text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-temple-red/20 active:scale-95 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-temple-saffron'}`}
                >
                  {isUploading ? 'Uploading...' : (isEditMode ? 'Update Entry' : 'Create Entry')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
      />
    </div>
  );
};

export default AdminDashboard;
