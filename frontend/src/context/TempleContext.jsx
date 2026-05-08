import React, { createContext, useContext, useState, useEffect } from 'react';

const TempleContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || (['localhost', '127.0.0.1'].includes(window.location.hostname) ? 'http://localhost:5001/api' : 'https://thesridevikarumariammandharmasanstha.onrender.com/api');

export const TempleProvider = ({ children }) => {
  const [templeData, setTempleData] = useState({
    name: "The Sri Devikarumari Amman Dharma Sanstha",
    email: "info@devikarumari.org",
    phone: "+91 44 2680 0430",
    address: "123, Amman Koil Street, Thiruverkadu, Chennai - 600077",
    timings: {
      morning: { open: "06:00 AM", close: "12:30 PM" },
      evening: { open: "04:00 PM", close: "09:00 PM" }
    },
    sevas: [],
    gallery: []
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const SETTINGS_API = `${API_BASE}/settings`;
  const AUTH_API = `${API_BASE}/auth`;

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await fetch(`${AUTH_API}/user`, {
            headers: { 'x-auth-token': token }
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (err) {
          console.error('Auth error:', err);
        }
      }
      // Settings fetch is independent
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(SETTINGS_API);
        if (response.ok) {
          const data = await response.json();
          setTempleData(data);
        }
      } catch (err) {
        console.error("Failed to fetch settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${AUTH_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data?.message || `Error: ${response.status} ${response.statusText}` };
    } catch (err) {
      console.error('Login Error:', err);
      return { success: false, message: 'Connection Error: Please check if the server is running' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${AUTH_API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data?.message || `Error: ${response.status} ${response.statusText}` };
    } catch (err) {
      console.error('Register Error:', err);
      return { success: false, message: 'Connection Error: Please check if the server is running' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateTempleData = async (newData) => {
    try {
      setTempleData(prev => ({ ...prev, ...newData }));
      await fetch(SETTINGS_API, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newData)
      });
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const bookSeva = async (bookingData) => {
    if (!token) return { success: false, message: 'Please login to book' };
    try {
      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(bookingData)
      });
      if (response.ok) return { success: true };
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      return { success: false, message: data?.message || 'Booking failed' };
    } catch (err) {
      console.error('Booking Error:', err);
      return { success: false, message: 'Connection Error: Please check if the server is running' };
    }
  };

  const submitDonation = async (donationData) => {
    if (!token) return { success: false, message: 'Please login to donate' };
    try {
      const response = await fetch(`${API_BASE}/donations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(donationData)
      });
      if (response.ok) return { success: true };
      
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      return { success: false, message: data?.message || 'Donation submission failed' };
    } catch (err) {
      console.error('Donation Error:', err);
      return { success: false, message: 'Connection Error: Please check if the server is running' };
    }
  };

  return (
    <TempleContext.Provider value={{ 
      templeData, updateTempleData, loading, 
      user, login, register, logout, bookSeva, submitDonation, token 
    }}>
      {children}
    </TempleContext.Provider>
  );
};

export const useTemple = () => useContext(TempleContext);
