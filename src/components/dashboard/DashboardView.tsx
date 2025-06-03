
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, Database } from 'firebase/database';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcNvKYuxSzlpl7SLbjDQcCXYkP-KLtQR4",
  databaseURL: "https://ode-project-734d6-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "ode-project-734d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Interface for the DWS data structure
interface DWSEntry {
  id: string;
  timestamp: string;
  'ID Number': string;
  'Hardhat'?: string | number;
  'Vest'?: string | number;
  'Gloves'?: string | number;
  'Entry-Exit'?: string;
}

const DashboardView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<'all' | 'entry' | 'exit'>('all');
  const [dwsData, setDwsData] = useState<DWSEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [database, setDatabase] = useState<Database | null>(null);

  // Initialize database connection
  useEffect(() => {
    try {
      const db = getDatabase(app);
      setDatabase(db);
    } catch (err) {
      console.error("Failed to initialize database:", err);
      setError("Failed to connect to database. Please try again later.");
      setLoading(false);
    }
  }, []);

  // Fetch data from Firebase
  useEffect(() => {
    if (!database) return;
    setLoading(true);
    const dwsRef = ref(database, 'DWS-In-Out');
    
    try {
      const listener = onValue(dwsRef, snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Filter out non-timestamp entries and create entries with PPE data
          const entries = Object.entries(data)
            .filter(([key, value]) => 
              key !== 'Door-Status' && 
              key !== 'Person-Nearby' && 
              typeof value === 'object'
            )
            .map(([key, value]: [string, any]) => ({
              id: key,
              timestamp: key,
              'ID Number': value['ID Number'] || 'Unknown',
              'Hardhat': Math.random() > 0.7 ? "1" : "0", // Simulated data
              'Vest': Math.random() > 0.6 ? "1" : "0", // Simulated data
              'Gloves': Math.random() > 0.8 ? "1" : "0", // Simulated data
              'Entry-Exit': Math.random() > 0.5 ? "Entry" : "Exit" // Simulated data
            }));

          // Sort by timestamp in descending order (newest first)
          const sortedData = entries.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          // Take only the latest 10 entries
          const latestEntries = sortedData.slice(0, 10);
          setDwsData(latestEntries);
        } else {
          setDwsData([]);
        }
        setLoading(false);
        setError(null);
      }, error => {
        console.error("Data fetch error:", error);
        setError("Failed to connect to database. Please try again later.");
        setLoading(false);
      });

      return () => {
        off(dwsRef, 'value', listener);
      };
    } catch (err) {
      console.error("Firebase query error:", err);
      setError("Failed to connect to database. Please try again later.");
      setLoading(false);
    }
  }, [database]);

  // Setup the auto-refresh every 5 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (database) {
        console.log("Checking for updates...");
      }
    }, 5000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, [database]);

  // Filter data based on search term and filter action
  const filteredData = dwsData.filter(record => {
    const matchesSearch = record['ID Number']?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterAction === 'all') return matchesSearch;
    if (filterAction === 'entry') return matchesSearch && record['Entry-Exit'] === "Entry";
    return matchesSearch && record['Entry-Exit'] === "Exit";
  });

  // Format timestamp to readable date and time
  const formatTimestamp = (timestamp: string): string => {
    if (!timestamp) {
      return 'Invalid Date';
    }
    try {
      return timestamp;
    } catch (error) {
      console.error("Error formatting timestamp:", error, "Timestamp value:", timestamp);
      return 'Error with Date';
    }
  };

  // Generate mock data for charts
  const generateChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      compliance: Math.floor(Math.random() * 30) + 70, // 70-100% compliance
      entries: Math.floor(Math.random() * 20) + 10,
      exits: Math.floor(Math.random() * 20) + 8
    }));
  };

  const chartData = generateChartData();
  const chartConfig = {
    compliance: { label: "Compliance %", color: "#10b981" },
    entries: { label: "Entries", color: "#3b82f6" },
    exits: { label: "Exits", color: "#8b5cf6" }
  };

  // Get non-compliant records
  const nonCompliantRecords = filteredData.filter(record => 
    record['Hardhat'] === "0" || record['Vest'] === "0" || record['Gloves'] === "0"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">PPE Monitoring Dashboard</h1>
          <p className="text-slate-200">Real-time PPE compliance monitoring</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID number..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none w-full md:w-64 bg-slate-950" 
            />
          </div>
          
          <select 
            value={filterAction} 
            onChange={e => setFilterAction(e.target.value as 'all' | 'entry' | 'exit')} 
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none bg-slate-950"
          >
            <option value="all">All Records</option>
            <option value="entry">Entries Only</option>
            <option value="exit">Exits Only</option>
          </select>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-slate-800">
          <h2 className="text-lg font-semibold mb-4">PPE Monitoring System - Latest Entries</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-500">Loading data...</p>
            </div>
          ) : filteredData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hardhat
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Gloves
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTimestamp(entry.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{entry['ID Number']}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {entry['Hardhat'] === "1" ? (
                          <span className="text-green-600 text-lg">✔️</span>
                        ) : (
                          <span className="text-red-600 text-lg">❌</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {entry['Vest'] === "1" ? (
                          <span className="text-green-600 text-lg">✔️</span>
                        ) : (
                          <span className="text-red-600 text-lg">❌</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {entry['Gloves'] === "1" ? (
                          <span className="text-green-600 text-lg">✔️</span>
                        ) : (
                          <span className="text-red-600 text-lg">❌</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No records found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Entries vs Exits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Entries</span>
                  <span className="font-medium">
                    {dwsData.filter(entry => entry['Entry-Exit'] === "Entry").length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{
                      width: `${dwsData.length > 0 ? 
                        (dwsData.filter(entry => entry['Entry-Exit'] === "Entry").length / dwsData.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Exits</span>
                  <span className="font-medium">
                    {dwsData.filter(entry => entry['Entry-Exit'] === "Exit").length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-purple-500 h-2.5 rounded-full" 
                    style={{
                      width: `${dwsData.length > 0 ? 
                        (dwsData.filter(entry => entry['Entry-Exit'] === "Exit").length / dwsData.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>PPE Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Compliant</span>
                  <span className="font-medium">
                    {dwsData.filter(entry => 
                      entry['Hardhat'] === "1" && entry['Vest'] === "1" && entry['Gloves'] === "1"
                    ).length} / {dwsData.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{
                      width: `${dwsData.length > 0 ? 
                        (dwsData.filter(entry => 
                          entry['Hardhat'] === "1" && entry['Vest'] === "1" && entry['Gloves'] === "1"
                        ).length / dwsData.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Non-Compliant</span>
                  <span className="font-medium">
                    {nonCompliantRecords.length} / {dwsData.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-red-500 h-2.5 rounded-full" 
                    style={{
                      width: `${dwsData.length > 0 ? (nonCompliantRecords.length / dwsData.length) * 100 : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                error ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-500'
              }`}>
                {error ? '⚠️' : '✓'}
              </div>
              <div>
                <p className="font-medium">{error ? 'Connection Error' : 'Connected to Firebase'}</p>
                <p className="text-sm text-gray-500">
                  {error ? 'Check your network connection' : 'Auto-refreshing every 5 seconds'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Database URL: ode-project-734d6-default-rtdb.asia-southeast1...
              </p>
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>PPE Compliance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="compliance" 
                  stroke="var(--color-compliance)" 
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entries vs Exits Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="entries" fill="var(--color-entries)" />
                <Bar dataKey="exits" fill="var(--color-exits)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Non-Compliant Records Table */}
      {nonCompliantRecords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Non-Compliant Records ({nonCompliantRecords.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Missing PPE
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nonCompliantRecords.map(entry => {
                    const missingPPE = [];
                    if (entry['Hardhat'] === "0") missingPPE.push("Hardhat");
                    if (entry['Vest'] === "0") missingPPE.push("Vest");
                    if (entry['Gloves'] === "0") missingPPE.push("Gloves");
                    
                    return (
                      <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(entry.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{entry['ID Number']}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-red-600 font-medium">{missingPPE.join(", ")}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardView;
