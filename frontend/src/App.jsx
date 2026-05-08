import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Pooja from './pages/Pooja';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import Donation from './pages/Donation';
import Contact from './pages/Contact';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import UserLogin from './pages/auth/UserLogin';
import UserRegister from './pages/auth/UserRegister';
import UserDashboard from './pages/auth/UserDashboard';
import { ToastProvider } from './components/Toast';
import { TempleProvider, useTemple } from './context/TempleContext';
import './i18n/config';

// Simple Protected Route Component for Admins
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

// Protected Route for Registered Users
const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useTemple();
  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/pooja" element={<Pooja />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/donations" element={<Donation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route 
            path="/dashboard" 
            element={
              <UserProtectedRoute>
                <UserDashboard />
              </UserProtectedRoute>
            } 
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <TempleProvider>
          <AppContent />
        </TempleProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
