
import React from 'react';
import { LayoutDashboard, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: 'dashboard';
  setActiveTab: (tab: 'dashboard') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  return (
    <div className="w-20 md:w-64 bg-card border-r border-border shadow-sm dark">
      <div className="p-4 flex items-center">
        <img 
          src="/lovable-uploads/c89ed7bd-531b-48a6-9547-2372db63fbf4.png" 
          alt="PPE Monitor Logo" 
          className="h-8 w-auto mr-3 md:mr-2"
        />
        <h1 className="text-xl font-bold text-primary hidden md:block">PPE Monitor</h1>
      </div>
      
      <nav className="mt-6">
        <ul>
          <li>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center p-4 text-left transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                  ? 'text-primary bg-accent border-r-4 border-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span className="hidden md:inline-block">Dashboard</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
