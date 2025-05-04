
import React from 'react';
import { Developer } from '../../data/mockData';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface DeveloperCardProps {
  developer: Developer;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({
  developer
}) => {
  const initials = developer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      <div className="p-6">
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={developer.image} alt={developer.name} className="object-cover" />
              {developer.name === 'Clarence Jay Fetalino' ? <AvatarFallback>
                  <img alt="Clarence Jay Fetalino" className="h-full w-full object-cover" src="/lovable-uploads/0ef4ecf0-4d64-46c2-b1f5-7207d4f93401.png" />
                </AvatarFallback> : 
                developer.name === 'Princess Bacay' ? <AvatarFallback>
                  <img alt="Princess Bacay" className="h-full w-full object-cover" src="/lovable-uploads/b905a6aa-e59e-4129-993a-2770f4b17d30.png" />
                </AvatarFallback> : 
                developer.name === 'Abegail Andres' ? <AvatarFallback>
                  <img alt="Abegail Andres" className="h-full w-full object-cover" src="/lovable-uploads/2a6b0786-ef20-4466-a7c9-90e022f1c3ed.png" />
                </AvatarFallback> :
                developer.name === 'Eunice Oronce' ? <AvatarFallback>
                  <img alt="Eunice Oronce" className="h-full w-full object-cover" src="/lovable-uploads/8c0c7809-b579-4470-bf1f-b1e3b0553b1d.png" />
                </AvatarFallback> :
                developer.name === 'Marie Antonette Ampo' ? <AvatarFallback>
                  <img alt="Marie Antonette Ampo" className="h-full w-full object-cover" src="/lovable-uploads/8c0c7809-b579-4470-bf1f-b1e3b0553b1d.png" />
                </AvatarFallback> :
                <AvatarFallback className="text-base">{initials}</AvatarFallback>}
            </Avatar>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{developer.name}</h3>
            <p className="text-sm text-primary font-medium">{developer.role}</p>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600 text-sm">{developer.bio}</p>
        
        <div className="mt-4 flex gap-3">
          {developer.socialLinks.facebook && <a href={developer.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>}
          {developer.socialLinks.instagram && <a href={developer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>}
          {developer.socialLinks.linkedin && <a href={developer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-800 transition-colors" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>}
        </div>
      </div>
    </div>;
};
export default DeveloperCard;
