
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './dashboard/DashboardView';

type Tab = 'dashboard';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background dark">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-background">
        <div className="animate-fade-in">
          <DashboardView />
        </div>
      </main>
    </div>
  );
};

export default Layout;
