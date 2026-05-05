import React, { createContext, useContext, useState, useEffect } from 'react';

const TempleContext = createContext();

export const TempleProvider = ({ children }) => {
  const [templeData, setTempleData] = useState({
    name: "The Sri Devikarumari Amman Dharma Sanstha",
    email: "info@devikarumari.org",
    phone: "+91 44 2680 0430",
    address: "123, Amman Koil Street, Thiruverkadu, Chennai - 600077",
    officeHours: "Monday - Sunday: 9:00 AM - 6:00 PM",
    specialDays: "6:00 AM - 10:00 PM",
    timings: {
      morning: { open: "06:00 AM", close: "12:30 PM" },
      evening: { open: "04:00 PM", close: "09:00 PM" }
    },
    sevas: [
      { id: 1, name: 'Nitya Pooja', desc: 'Daily ritual performed for the well-being of all devotees.', price: '₹101', icon: 'ॐ' },
      { id: 2, name: 'Abishekam', desc: 'Sacred bathing ritual with milk, honey, and herbal powders.', price: '₹501', icon: '🪔' },
      { id: 3, name: 'Anna Prasadam', desc: 'Sponsoring the daily sacred meal for 50+ devotees.', price: '₹2500', icon: '🍲' },
      { id: 4, name: 'Kalyana Utsavam', desc: 'Grand ceremonial wedding ritual for the Divine Couple.', price: '₹5000', icon: '🌸' },
    ]
  });
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/settings';

  // Load from Backend on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setTempleData(data);
        }
      } catch (err) {
        console.error("Failed to fetch settings from backend", err);
        // Fallback to localStorage if backend fails
        const savedData = localStorage.getItem('templeData');
        if (savedData) setTempleData(JSON.parse(savedData));
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateTempleData = async (newData) => {
    try {
      console.log("Attempting to update settings in backend with:", newData);
      setTempleData(prev => ({ ...prev, ...newData }));
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      
      if (response.ok) {
        const updated = await response.json();
        console.log("Successfully updated backend:", updated);
        setTempleData(updated);
        localStorage.setItem('templeData', JSON.stringify(updated));
      } else {
        const errorText = await response.text();
        console.error("Backend returned error:", errorText);
      }
    } catch (err) {
      console.error("Network or Fetch Error:", err);
      // Still save to localStorage as backup
      localStorage.setItem('templeData', JSON.stringify({ ...templeData, ...newData }));
    }
  };

  return (
    <TempleContext.Provider value={{ templeData, updateTempleData, loading }}>
      {children}
    </TempleContext.Provider>
  );
};

export const useTemple = () => useContext(TempleContext);
