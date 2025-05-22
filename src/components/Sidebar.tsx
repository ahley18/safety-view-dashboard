
import React from 'react';
import { LayoutDashboard, Users, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: 'dashboard' | 'developers';
  setActiveTab: (tab: 'dashboard' | 'developers') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="w-20 md:w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4">
        <h1 className="text-xl font-bold text-primary hidden md:block">PPE Monitor</h1>
        <h1 className="text-xl font-bold text-primary md:hidden">PPE</h1>
      </div>
      
      <nav className="mt-6">
        <ul>
          <li>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center p-4 text-left transition-colors text-gray-600 hover:bg-gray-100"
            >
              <Home className="h-5 w-5 mr-3" />
              <span className="hidden md:inline-block">Home</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center p-4 text-left transition-colors ${
                activeTab === 'dashboard'
                  ? 'text-primary bg-blue-50 border-r-4 border-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span className="hidden md:inline-block">Dashboard</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('developers')}
              className={`w-full flex items-center p-4 text-left transition-colors ${
                activeTab === 'developers'
                  ? 'text-primary bg-blue-50 border-r-4 border-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              <span className="hidden md:inline-block">Developers</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
