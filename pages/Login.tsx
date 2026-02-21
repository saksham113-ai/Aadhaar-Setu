
import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Info } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      {/* Top Banner */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="https://uidai.gov.in/images/logo/aadhaar_english_logo.svg" alt="Aadhaar" className="h-14" />
            <div className="h-10 w-px bg-gray-300"></div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" alt="GoI Emblem" className="h-12" />
          </div>
          <div className="text-right hidden sm:block">
            <h2 className="text-sm font-bold text-[#003366]">Government of India</h2>
            <p className="text-xs text-gray-500">Unique Identification Authority of India</p>
          </div>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#003366] p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <ShieldCheck className="text-white" size={32} />
              </div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Aadhaar Analytics</h1>
              <p className="text-blue-200 text-sm mt-1">Administrative Login for State/District Officials</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Government ID / Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="e.g. admin_mh_01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:underline font-medium">Forgot Password?</a>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-3 px-4 rounded-lg shadow-lg transform active:scale-[0.98] transition"
                >
                  SECURE LOGIN
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-start space-x-3 text-gray-500 text-xs">
                  <Info size={24} className="mt-0.5 text-blue-400 flex-shrink-0" />
                  <p>
                    Unauthorized access to this portal is strictly prohibited and subject to legal action under IT Act 2000. 
                    Please ensure you have official credentials provided by UIDAI HQ.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-gray-700 text-xs font-medium">Terms of Use</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-xs font-medium">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 text-xs font-medium">Support Helpdesk</a>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-6 text-center text-xs text-gray-500">
          <p>© 2024 Unique Identification Authority of India (UIDAI). All rights reserved.</p>
          <p className="mt-1">Digital India initiative by Govt of India.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
