
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
    image: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    bio: 'Alex leads the technical development of our PPE monitoring system, with expertise in computer vision and real-time data processing.',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '2',
    name: 'Marie Antonette Ampo',
    role: 'Backend Developer',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    bio: 'Sarah specializes in database architecture and Firebase integration, ensuring our data storage is optimized and secure.',
    socialLinks: {
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '3',
    name: 'Abegail Andres',
    role: 'Frontend Developer',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    bio: 'Jamal creates intuitive user interfaces that help safety managers quickly assess PPE compliance across their work sites.',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '4',
    name: 'Princess Bacay',
    role: 'Computer Vision Specialist',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    bio: 'Elena develops the advanced algorithms that detect PPE equipment with high accuracy in various lighting and environmental conditions.',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: '5',
    name: 'Eunice Oronce',
    role: 'DevOps Engineer',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
    bio: 'Michael ensures our monitoring system is reliable and scalable, with minimal downtime and rapid deployment of new features.',
    socialLinks: {
      linkedin: 'https://linkedin.com',
    },
  },
];

