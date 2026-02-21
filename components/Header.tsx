
import React from 'react';
import { User, LogOut, LayoutDashboard, PieChart, Upload } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, currentPage, onNavigate }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <img src="https://uidai.gov.in/images/logo/aadhaar_english_logo.svg" alt="Aadhaar" className="h-12" />
            <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[#003366] leading-tight">Insight Portal</h1>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">National Analytics Dashboard</p>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
              { id: 'demographics', label: 'Demographics', icon: <PieChart size={16} /> },
              { id: 'upload', label: 'Data Ingestion', icon: <Upload size={16} /> }
            ].map(nav => (
              <button 
                key={nav.id}
                onClick={() => onNavigate(nav.id)}
                className={`px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition-colors ${
                  currentPage === nav.id 
                    ? 'text-[#003366] bg-blue-50' 
                    : 'text-gray-600 hover:text-[#003366] hover:bg-gray-50'
                }`}
              >
                {nav.icon}
                {nav.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <div className="w-8 h-8 bg-[#003366] rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">AD</div>
            <div className="hidden md:block">
               <p className="text-xs font-bold text-[#003366] leading-none">Admin_UIDAI</p>
               <p className="text-[9px] text-green-600 font-bold uppercase mt-1">Status: Online</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Secure Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
