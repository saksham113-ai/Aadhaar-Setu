
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Demographics from './pages/Demographics';
import Upload from './pages/Upload';
import { Page, AadhaarRecord } from './types';
import { MOCK_DATA } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [data, setData] = useState<AadhaarRecord[]>(MOCK_DATA);

  // Persistence check (Mock)
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (loggedIn) setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setCurrentPage('dashboard');
  };

  const handleDataUpdate = (newData: AadhaarRecord[]) => {
    setData(newData);
    setCurrentPage('dashboard'); // Redirect to dashboard after upload
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard data={data} />}
        {currentPage === 'demographics' && <Demographics data={data} />}
        {currentPage === 'upload' && <Upload onDataUpdate={handleDataUpdate} />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <div className="flex items-center space-x-4">
            <img src="https://uidai.gov.in/images/logo/aadhaar_english_logo.svg" alt="Aadhaar" className="h-8 grayscale opacity-50" />
            <p>© 2024 UIDAI Portal • Secure Administrative Dashboard</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600">Site Map</a>
            <a href="#" className="hover:text-blue-600">Grievance Redressal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
