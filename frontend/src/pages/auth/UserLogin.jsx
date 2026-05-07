import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTemple } from '../../context/TempleContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useTemple();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-8 bg-temple-red text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <span className="text-3xl">ॐ</span>
          </div>
          <h1 className="text-2xl font-serif font-bold">Welcome Back</h1>
          <p className="text-white/70 text-sm mt-2">Sign in to book poojas and make donations</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-temple-red transition-all"
                placeholder="devotee@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-temple-red transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-temple-red text-white py-4 rounded-2xl font-bold shadow-lg shadow-temple-red/20 hover:bg-temple-saffron transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight size={18} />
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account? {' '}
            <Link to="/register" className="text-temple-red font-bold hover:underline">Register Now</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
