import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          onClick={onClose}
        ></motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${type === 'danger' ? 'bg-red-50 text-red-500' : 'bg-temple-gold/10 text-temple-gold'}`}>
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            </div>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
              {message}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all border border-gray-100"
              >
                {cancelText}
              </button>
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all shadow-lg active:scale-95 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-temple-red hover:bg-temple-saffron shadow-temple-red/20'}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
