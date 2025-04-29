
import React from 'react';
import { Developer } from '../../data/mockData';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface DeveloperCardProps {
  developer: Developer;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer }) => {
  const initials = developer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
    
  // Special case for Clarence Jay Fetalino
  const isClareceJay = developer.name === "Clarence Jay Fetalino";
  const imagePath = isClareceJay 
    ? "/lovable-uploads/62d9fee5-237c-4733-abca-fa7c90d4551a.png"
    : developer.image;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage 
                src={imagePath} 
                alt={developer.name}
                className="object-cover"
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
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
