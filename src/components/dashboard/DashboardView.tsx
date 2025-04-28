
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import PPEDataTable from './PPEDataTable';
import { ppeData, PPERecord } from '../../data/mockData';

const DashboardView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<'all' | 'entry' | 'exit'>('all');
  
  // Filter data based on search term and filter action
  const filteredData = ppeData.filter((record) => {
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.area.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterAction === 'all') return matchesSearch;
    return matchesSearch && record.action === filterAction;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">PPE Monitoring Dashboard</h1>
          <p className="text-gray-500">Real-time monitoring of Personal Protective Equipment compliance</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none w-full md:w-64"
            />
          </div>
          
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value as 'all' | 'entry' | 'exit')}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
          >
            <option value="all">All Actions</option>
            <option value="entry">Entry Only</option>
            <option value="exit">Exit Only</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">PPE Compliance Records</h2>
          <PPEDataTable data={filteredData} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-3">Compliance Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Helmet Compliance</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Vest Compliance</span>
                <span className="font-medium">93%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '93%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Boots Compliance</span>
                <span className="font-medium">79%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '79%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-3">Active Zones</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Construction Site A</span>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">7 People</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Warehouse Zone B</span>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">4 People</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Factory Floor C</span>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">12 People</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Maintenance Bay D</span>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">3 People</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Loading Dock E</span>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">5 People</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-3">Recent Violations</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                ⚠️
              </div>
              <div>
                <p className="font-medium">Priya Patel</p>
                <p className="text-sm text-gray-500">Missing helmet in Maintenance Bay</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                ⚠️
              </div>
              <div>
                <p className="font-medium">Maria Rodriguez</p>
                <p className="text-sm text-gray-500">Missing vest in Warehouse Zone</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-full flex items-center justify-center text-red-500">
                ⚠️
              </div>
              <div>
                <p className="font-medium">Robert Johnson</p>
                <p className="text-sm text-gray-500">Missing boots in Loading Dock</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
