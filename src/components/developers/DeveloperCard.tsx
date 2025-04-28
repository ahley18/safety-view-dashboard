
import React from 'react';
import { Developer } from '../../data/mockData';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

interface DeveloperCardProps {
  developer: Developer;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-primary/20">
              <img
                src={developer.image}
                alt={developer.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{developer.name}</h3>
            <p className="text-sm text-primary font-medium">{developer.role}</p>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600 text-sm">{developer.bio}</p>
        
        <div className="mt-4 flex gap-3">
          {developer.socialLinks.facebook && (
            <a
              href={developer.socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
          )}
          {developer.socialLinks.instagram && (
            <a
              href={developer.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-pink-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          )}
          {developer.socialLinks.linkedin && (
            <a
              href={developer.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-800 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeveloperCard;
