import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      remove(id);
    }, 4000);
  };

  const remove = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const success = (msg) => show(msg, 'success');
  const error = (msg) => show(msg, 'error');

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed top-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto min-w-[300px] bg-white rounded-2xl shadow-2xl p-4 border flex items-center gap-4 ${
                toast.type === 'success' ? 'border-green-100' : 'border-red-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
              }`}>
                {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-bold text-gray-800">{toast.message}</p>
              </div>
              <button onClick={() => remove(toast.id)} className="text-gray-300 hover:text-gray-500 p-1">
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
