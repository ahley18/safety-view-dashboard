
import React from 'react';
import DeveloperCard from './DeveloperCard';
import { developers } from '../../data/mockData';

const DevelopersView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Meet the Developers</h1>
        <p className="text-gray-500">The talented team behind our PPE monitoring system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((developer) => (
          <div key={developer.id} className="animate-slide-in">
            <DeveloperCard developer={developer} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopersView;
