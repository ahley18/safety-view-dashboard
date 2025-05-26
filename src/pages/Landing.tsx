import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Eye, UserCheck, BarChart } from 'lucide-react';
import { developers } from '@/data/mockData';
import DeveloperCard from '@/components/developers/DeveloperCard';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header with Logo */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="container mx-auto flex items-center">
          <img 
            src="/lovable-uploads/d2a72d0c-934d-4013-8400-1bc710e93f8b.png" 
            alt="PPE Detection and Monitoring Systems Logo" 
            className="h-12 w-auto"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20" style={{
          backgroundImage: "url('/lovable-uploads/666af25b-439a-48fb-95ce-bf4d3d0c6f8e.png')"
        }}></div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight animate-fade-in">
              PPE Detection and Monitoring Systems Dashboard
            </h1>
            <p className="mt-6 text-lg text-gray-700 animate-fade-in">
              Enhance workplace safety with our intelligent PPE monitoring solution. Real-time detection and compliance tracking for a safer environment.
            </p>
            <Button className="mt-8 text-lg px-8 py-6 animate-fade-in" size="lg" onClick={() => navigate('/dashboard')}>
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#services" className="text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Our Services</h2>
            <p className="mt-4 text-lg text-gray-600">Comprehensive PPE monitoring solutions for your workplace</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md animate-slide-in">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-primary mb-6">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Real-time PPE Monitoring</h3>
              <p className="mt-4 text-gray-600">Continuously monitor PPE compliance in real-time across all designated areas</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md animate-slide-in">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-primary mb-6">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">PPE Detection</h3>
              <p className="mt-4 text-gray-600">Advanced computer vision technology to detect helmets, vests, boots, and other safety equipment</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md animate-slide-in">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-primary mb-6">
                <UserCheck size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Entry/Exit Tracking</h3>
              <p className="mt-4 text-gray-600">Track and log all personnel movements with accurate timestamps and compliance status</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md animate-slide-in">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center text-primary mb-6">
                <BarChart size={28} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h3>
              <p className="mt-4 text-gray-600">Comprehensive analytics and reporting to identify trends and improve safety compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <img alt="Safety First" className="rounded-xl shadow-lg w-full object-cover" src="/lovable-uploads/9885d0d1-cc58-4869-b60d-952fea45102f.png" />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900">About Us</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary">Our Mission</h3>
                  <p className="mt-2 text-gray-600">
                    To enhance workplace safety through innovative technology solutions that ensure proper use of personal protective equipment at all times.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">Our Vision</h3>
                  <p className="mt-2 text-gray-600">
                    A world where every workplace prioritizes safety, with zero preventable injuries through proper PPE compliance and monitoring.
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    We believe that through advanced computer vision and real-time monitoring, we can create safer workplaces while providing valuable insights to safety managers and supervisors. Our technology is designed to be unobtrusive yet effective, ensuring that safety standards are maintained without disrupting productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Developers Section */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Meet the Developers</h2>
            <p className="mt-4 text-lg text-gray-600">The talented team behind our PPE monitoring system</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map(developer => <div key={developer.id} className="animate-slide-in">
                <DeveloperCard developer={developer} />
              </div>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0 flex items-center">
              <img 
                src="/lovable-uploads/d2a72d0c-934d-4013-8400-1bc710e93f8b.png" 
                alt="PPE Monitor Logo" 
                className="h-8 w-auto mr-3 brightness-0 invert"
              />
              <div>
                <h3 className="text-xl font-bold">PPE Monitor</h3>
                <p className="mt-2 text-gray-400">Enhancing workplace safety through technology</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                  <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                  <li><a href="#team" className="text-gray-400 hover:text-white transition-colors">Team</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Services</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">PPE Monitoring</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Safety Analytics</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance Reports</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li className="text-gray-400">info@ppemonitor.com</li>
                  <li className="text-gray-400">+1 (555) 123-4567</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} PPE Monitor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
