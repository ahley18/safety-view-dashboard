
// Mock data for PPE monitoring
export interface PPERecord {
  id: string;
  name: string;
  timestamp: string;
  action: 'entry' | 'exit';
  compliance: {
    helmet: boolean;
    vest: boolean;
    boots: boolean;
  };
  area: string;
}

export const ppeData: PPERecord[] = [
  {
    id: '1',
    name: 'John Smith',
    timestamp: '2025-04-28T08:32:45',
    action: 'entry',
    compliance: {
      helmet: true,
      vest: true,
      boots: true,
    },
    area: 'Construction Site A'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    timestamp: '2025-04-28T09:15:22',
    action: 'entry',
    compliance: {
      helmet: true,
      vest: false,
      boots: true,
    },
    area: 'Warehouse Zone B'
  },
  {
    id: '3',
    name: 'David Chen',
    timestamp: '2025-04-28T10:05:18',
    action: 'entry',
    compliance: {
      helmet: true,
      vest: true,
      boots: true,
    },
    area: 'Factory Floor C'
  },
  {
    id: '4',
    name: 'John Smith',
    timestamp: '2025-04-28T15:47:31',
    action: 'exit',
    compliance: {
      helmet: true,
      vest: true,
      boots: true,
    },
    area: 'Construction Site A'
  },
  {
    id: '5',
    name: 'Priya Patel',
    timestamp: '2025-04-28T11:23:10',
    action: 'entry',
    compliance: {
      helmet: false,
      vest: true,
      boots: true,
    },
    area: 'Maintenance Bay D'
  },
  {
    id: '6',
    name: 'Maria Rodriguez',
    timestamp: '2025-04-28T16:32:09',
    action: 'exit',
    compliance: {
      helmet: true,
      vest: true,
      boots: true,
    },
    area: 'Warehouse Zone B'
  },
  {
    id: '7',
    name: 'Robert Johnson',
    timestamp: '2025-04-28T12:15:43',
    action: 'entry',
    compliance: {
      helmet: true,
      vest: true,
      boots: false,
    },
    area: 'Loading Dock E'
  },
  {
    id: '8',
    name: 'Priya Patel',
    timestamp: '2025-04-28T17:05:34',
    action: 'exit',
    compliance: {
      helmet: false,
      vest: true,
      boots: true,
    },
    area: 'Maintenance Bay D'
  },
];

// Mock Developer data
export interface Developer {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export const developers: Developer[] = [
  {
    id: '1',
    name: 'Clarence Jay Fetalino',
    role: 'Lead Developer',
    image: '/lovable-uploads/938ad379-c5cd-4234-938c-63a25b8bfdfc.png',
    bio: 'A seasoned developer, aspiring Data Scientist and AI Engineer, passionate about bridging the gap between hardware and data. Leveraging my expertise in Python, I\'ve competed in multiple Hackathons, where I\'ve showcased innovative solutions through data-driven applications. I\'m here to redefine how we integrate technology, pushing the boundaries of data science to drive meaningful change.',
    socialLinks: {
      facebook: 'https://facebook.com/clarencejay.fetalino/',
      instagram: 'https://instagram.com/jclarence_1001/',
      linkedin: 'https://www.linkedin.com/in/clarence-fetalino-45b313223',
    },
  },
  {
    id: '2',
    name: 'Marie Antonette Ampo',
    role: 'Backend Developer',
    image: '/lovable-uploads/9f0d14f1-52dc-4261-9314-f53d913e9c74.png',
    bio: 'Sarah specializes in database architecture and Firebase integration, ensuring our data storage is optimized and secure.',
    socialLinks: {
      facebook: 'https://www.facebook.com/share/16Uhnv6H1p/',
      instagram: 'https://www.instagram.com/antontteampo?igsh=MXBvZnZ1YTE2b2xtNg==',
      linkedin: 'https://www.linkedin.com/in/marie-antonette-ampo-1b7b9b363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    },
  },
  {
    id: '3',
    name: 'Abegail Andres',
    role: 'Frontend Developer',
    image: '/lovable-uploads/9f0d14f1-52dc-4261-9314-f53d913e9c74.png',
    bio: 'A passionate frontend developer who believes great design goes beyond aesthetics—it\'s about how users feel when they interact with technology. With a strong foundation in responsive design and modern UI frameworks, I turn ideas into clean, intuitive experiences. I\'m here to build user interfaces that don\'t just work—they connect with people.',
    socialLinks: {
      facebook: 'https://www.facebook.com/augusleven/',
      instagram: 'https://www.instagram.com/augusleven/',
      linkedin: 'https://www.linkedin.com/in/abegail-andres-641360312',
    },
  },
  {
    id: '4',
    name: 'Princess Bacay',
    role: 'Computer Vision Specialist',
    image: '/lovable-uploads/9f0d14f1-52dc-4261-9314-f53d913e9c74.png',
    bio: 'Elena develops the advanced algorithms that detect PPE equipment with high accuracy in various lighting and environmental conditions.',
    socialLinks: {
      facebook: 'https://www.facebook.com/cessbacay',
      instagram: 'https://www.instagram.com/cessbacay',
      linkedin: 'https://www.linkedin.com/in/princess-bacay',
    },
  },
  {
    id: '5',
    name: 'Eunice Oronce',
    role: 'DevOps Engineer',
    image: '/lovable-uploads/9f0d14f1-52dc-4261-9314-f53d913e9c74.png',
    bio: 'Michael ensures our monitoring system is reliable and scalable, with minimal downtime and rapid deployment of new features.',
    socialLinks: {
      facebook: 'https://www.facebook.com/share/1KmTjpxgoL/',
      instagram: 'https://www.instagram.com/euniceangela__/?hl=en',
      linkedin: 'https://www.linkedin.com/in/oronce-eunice?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    },
  },
];
