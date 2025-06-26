import React, { useState, useEffect } from 'react';
import { Search, Download } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, Database } from 'firebase/database';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReprimandSystem from './ReprimandSystem';

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
  'Hardhat': number;
  'Vest': number;
  'Gloves': number;
  'Entry-Exit'?: string;
}

const DashboardView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
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
          console.log("Received Firebase data:", data);

          // Create entries from timestamp-based data
          const entries = Object.entries(data)
            .filter(([key, value]) => 
              // Filter for timestamp entries (not status fields)
              key.includes(':') && typeof value === 'object' && value !== null
            )
            .map(([timestamp, value]: [string, any]) => {
              // Determine entry/exit based on front/back values
              let entryExit = 'Unknown';
              if (value['front'] === 1) {
                entryExit = 'Entry';
              } else if (value['back'] === 1) {
                entryExit = 'Exit';
              }

              return {
                id: timestamp,
                timestamp: timestamp,
                'ID Number': value['ID Number'] || 'Unknown',
                'Hardhat': value['hardhat'] || 0,
                'Vest': value['vest'] || 0,
                'Gloves': value['gloves'] || 0,
                'Entry-Exit': entryExit
              };
            });

          console.log("Processed entries:", entries);

          // Sort by timestamp in descending order (newest first)
          const sortedData = entries.sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          // Take only the latest 20 entries
          const latestEntries = sortedData.slice(0, 20);
          setDwsData(latestEntries);
        } else {
          console.log("No data found in Firebase");
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
        console.log("Auto-refresh triggered - data will update via Firebase listener");
      }
    }, 5000);
    return () => {
      clearInterval(refreshInterval);
    };
  }, [database]);

  // Filter data based on search term only
  const filteredData = dwsData.filter(record => {
    return record['ID Number']?.toLowerCase().includes(searchTerm.toLowerCase());
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

  // Generate real chart data from Firebase data
  const generateRealChartData = () => {
    if (dwsData.length === 0) {
      // Return empty data if no Firebase data available
      return [];
    }

    // Group data by date
    const dataByDate: { [key: string]: DWSEntry[] } = {};
    
    dwsData.forEach(entry => {
      const date = entry.timestamp.split(' ')[0]; // Extract date part
      if (!dataByDate[date]) {
        dataByDate[date] = [];
      }
      dataByDate[date].push(entry);
    });

    // Convert to chart data format
    return Object.entries(dataByDate)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-7) // Last 7 days
      .map(([date, entries]) => {
        const compliantEntries = entries.filter(entry => 
          entry.Hardhat === 1 && entry.Vest === 1 && entry.Gloves === 1
        );
        const complianceRate = entries.length > 0 ? Math.round((compliantEntries.length / entries.length) * 100) : 0;

        return {
          day: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
          compliance: complianceRate,
          total: entries.length
        };
      });
  };

  const chartData = generateRealChartData();
  const chartConfig = {
    compliance: { label: "Compliance %", color: "#10b981" },
    total: { label: "Total Records", color: "#3b82f6" }
  };

  // Get non-compliant records
  const nonCompliantRecords = filteredData.filter(record => 
    record['Hardhat'] === 0 || record['Vest'] === 0 || record['Gloves'] === 0
  );

  // Generate PPE breakdown data for pie chart
  const generatePPEBreakdownData = () => {
    if (dwsData.length === 0) return [];
    
    const hardhatCompliant = dwsData.filter(entry => entry.Hardhat === 1).length;
    const vestCompliant = dwsData.filter(entry => entry.Vest === 1).length;
    const glovesCompliant = dwsData.filter(entry => entry.Gloves === 1).length;
    
    return [
      { name: 'Hardhat', value: hardhatCompliant, color: '#10b981' },
      { name: 'Vest', value: vestCompliant, color: '#3b82f6' },
      { name: 'Gloves', value: glovesCompliant, color: '#8b5cf6' }
    ];
  };

  // Generate hourly activity data
  const generateHourlyActivityData = () => {
    if (dwsData.length === 0) return [];
    
    const hourlyData: { [key: string]: { entries: number; exits: number } } = {};
    
    dwsData.forEach(entry => {
      const hour = entry.timestamp.split(' ')[1]?.split(':')[0] || '00';
      if (!hourlyData[hour]) {
        hourlyData[hour] = { entries: 0, exits: 0 };
      }
      
      if (entry['Entry-Exit'] === 'Entry') {
        hourlyData[hour].entries++;
      } else if (entry['Entry-Exit'] === 'Exit') {
        hourlyData[hour].exits++;
      }
    });
    
    return Object.entries(hourlyData)
      .map(([hour, data]) => ({
        hour: `${hour}:00`,
        entries: data.entries,
        exits: data.exits,
        total: data.entries + data.exits
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  };

  const ppeBreakdownData = generatePPEBreakdownData();
  const hourlyActivityData = generateHourlyActivityData();

  // Download data as CSV
  const downloadData = () => {
    try {
      // Prepare CSV headers
      const headers = ['Timestamp', 'ID Number', 'Hardhat', 'Vest', 'Gloves'];
      
      // Prepare CSV rows
      const csvRows = [
        headers.join(','),
        ...filteredData.map(entry => [
          `"${formatTimestamp(entry.timestamp)}"`,
          `"${entry['ID Number']}"`,
          entry['Hardhat'] === 1 ? 'Yes' : 'No',
          entry['Vest'] === 1 ? 'Yes' : 'No',
          entry['Gloves'] === 1 ? 'Yes' : 'No'
        ].join(','))
      ];

      // Create CSV content
      const csvContent = csvRows.join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ppe-monitoring-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Data downloaded successfully");
    } catch (error) {
      console.error("Error downloading data:", error);
      setError("Failed to download data. Please try again.");
    }
  };

  // Generate violation patterns data
  const generateViolationPatternsData = () => {
    if (dwsData.length === 0) return [];
    
    const violations = {
      'Hardhat Only': 0,
      'Vest Only': 0,
      'Gloves Only': 0,
      'Hardhat + Vest': 0,
      'Hardhat + Gloves': 0,
      'Vest + Gloves': 0,
      'All Missing': 0
    };
    
    dwsData.forEach(entry => {
      const missingItems = [];
      if (entry.Hardhat === 0) missingItems.push('Hardhat');
      if (entry.Vest === 0) missingItems.push('Vest');
      if (entry.Gloves === 0) missingItems.push('Gloves');
      
      if (missingItems.length === 1) {
        violations[`${missingItems[0]} Only`]++;
      } else if (missingItems.length === 2) {
        violations[`${missingItems[0]} + ${missingItems[1]}`]++;
      } else if (missingItems.length === 3) {
        violations['All Missing']++;
      }
    });
    
    return Object.entries(violations)
      .filter(([_, count]) => count > 0)
      .map(([pattern, count]) => ({
        pattern,
        count,
        percentage: Math.round((count / dwsData.length) * 100)
      }));
  };

  // Generate daily summary data
  const generateDailySummaryData = () => {
    if (dwsData.length === 0) return [];
    
    const dailyData: { [key: string]: { entries: number; exits: number; violations: number; total: number } } = {};
    
    dwsData.forEach(entry => {
      const date = entry.timestamp.split(' ')[0];
      if (!dailyData[date]) {
        dailyData[date] = { entries: 0, exits: 0, violations: 0, total: 0 };
      }
      
      dailyData[date].total++;
      if (entry['Entry-Exit'] === 'Entry') dailyData[date].entries++;
      if (entry['Entry-Exit'] === 'Exit') dailyData[date].exits++;
      if (entry.Hardhat === 0 || entry.Vest === 0 || entry.Gloves === 0) {
        dailyData[date].violations++;
      }
    });
    
    return Object.entries(dailyData)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .slice(-14) // Last 14 days
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        entries: data.entries,
        exits: data.exits,
        violations: data.violations,
        compliance: data.total > 0 ? Math.round(((data.total - data.violations) / data.total) * 100) : 0
      }));
  };

  // Generate time-based compliance data
  const generateTimeBasedComplianceData = () => {
    if (dwsData.length === 0) return [];
    
    const timeSlots = {
      'Morning (6-12)': { total: 0, compliant: 0 },
      'Afternoon (12-18)': { total: 0, compliant: 0 },
      'Evening (18-24)': { total: 0, compliant: 0 },
      'Night (0-6)': { total: 0, compliant: 0 }
    };
    
    dwsData.forEach(entry => {
      const hour = parseInt(entry.timestamp.split(' ')[1]?.split(':')[0] || '0');
      let timeSlot = 'Morning (6-12)';
      
      if (hour >= 12 && hour < 18) timeSlot = 'Afternoon (12-18)';
      else if (hour >= 18 && hour < 24) timeSlot = 'Evening (18-24)';
      else if (hour >= 0 && hour < 6) timeSlot = 'Night (0-6)';
      
      timeSlots[timeSlot as keyof typeof timeSlots].total++;
      if (entry.Hardhat === 1 && entry.Vest === 1 && entry.Gloves === 1) {
        timeSlots[timeSlot as keyof typeof timeSlots].compliant++;
      }
    });
    
    return Object.entries(timeSlots).map(([timeSlot, data]) => ({
      timeSlot,
      compliance: data.total > 0 ? Math.round((data.compliant / data.total) * 100) : 0,
      total: data.total,
      violations: data.total - data.compliant
    }));
  };

  const violationPatternsData = generateViolationPatternsData();
  const dailySummaryData = generateDailySummaryData();
  const timeBasedComplianceData = generateTimeBasedComplianceData();

  // Generate compliance vs violation data for donut chart
  const generateComplianceViolationData = () => {
    if (dwsData.length === 0) return [];
    
    const compliantRecords = dwsData.filter(entry => 
      entry.Hardhat === 1 && entry.Vest === 1 && entry.Gloves === 1
    ).length;
    const violationRecords = dwsData.length - compliantRecords;
    
    const compliantPercentage = Math.round((compliantRecords / dwsData.length) * 100);
    const violationPercentage = Math.round((violationRecords / dwsData.length) * 100);
    
    return [
      { 
        name: 'Compliant', 
        value: compliantRecords, 
        percentage: compliantPercentage,
        color: '#10b981' 
      },
      { 
        name: 'Violations', 
        value: violationRecords, 
        percentage: violationPercentage,
        color: '#ef4444' 
      }
    ];
  };

  const complianceViolationData = generateComplianceViolationData();

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

          <button
            onClick={downloadData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            disabled={filteredData.length === 0}
          >
            <Download size={18} />
            <span className="hidden md:inline">Download CSV</span>
          </button>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="monitoring" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monitoring">PPE Monitoring</TabsTrigger>
          <TabsTrigger value="reprimands">Reprimand System</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitoring" className="space-y-6">
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
                            {entry['Hardhat'] === 1 ? (
                              <span className="text-green-600 text-lg">✔️</span>
                            ) : (
                              <span className="text-red-600 text-lg">❌</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {entry['Vest'] === 1 ? (
                              <span className="text-green-600 text-lg">✔️</span>
                            ) : (
                              <span className="text-red-600 text-lg">❌</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {entry['Gloves'] === 1 ? (
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
                  No records found. Try adjusting your search.
                </div>
              )}
            </div>
          </div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Total Entries</span>
                      <span className="font-medium text-2xl">
                        {dwsData.length}
                      </span>
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
                          entry['Hardhat'] === 1 && entry['Vest'] === 1 && entry['Gloves'] === 1
                        ).length} / {dwsData.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{
                          width: `${dwsData.length > 0 ? 
                            (dwsData.filter(entry => 
                              entry['Hardhat'] === 1 && entry['Vest'] === 1 && entry['Gloves'] === 1
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
                      {error ? 'Check your network connection' : 'Real-time updates enabled'}
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
                {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-gray-500">
                    No data available for chart
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Record Count</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="total" fill="var(--color-total)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-gray-500">
                    No data available for chart
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Statistical Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>PPE Equipment Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                {ppeBreakdownData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ppeBreakdownData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {ppeBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available for chart
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Hourly Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {hourlyActivityData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="total" 
                          stackId="1" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="entries" 
                          stackId="2" 
                          stroke="var(--color-entries)" 
                          fill="var(--color-entries)" 
                          fillOpacity={0.8}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="exits" 
                          stackId="3" 
                          stroke="var(--color-exits)" 
                          fill="var(--color-exits)" 
                          fillOpacity={0.8}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available for chart
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Compliance vs Violations Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance vs Violations</CardTitle>
              </CardHeader>
              <CardContent>
                {complianceViolationData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={complianceViolationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {complianceViolationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[350px] flex items-center justify-center text-gray-500">
                    No data available for chart
                  </div>
                )}
              </CardContent>
            </Card>

            <div></div>
          </div>

          {/* Daily Trends and Time-based Analysis */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Summary Trends (Last 14 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {dailySummaryData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailySummaryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar yAxisId="left" dataKey="entries" fill="var(--color-entries)" />
                        <Bar yAxisId="left" dataKey="exits" fill="var(--color-exits)" />
                        <Line yAxisId="right" type="monotone" dataKey="compliance" stroke="var(--color-compliance)" strokeWidth={3} />
                        <Line yAxisId="left" type="monotone" dataKey="violations" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[400px] flex items-center justify-center text-gray-500">
                    No data available for chart
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance by Time of Day</CardTitle>
              </CardHeader>
              <CardContent>
                {timeBasedComplianceData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={timeBasedComplianceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timeSlot" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="compliance" fill="var(--color-compliance)" />
                        <Bar dataKey="violations" fill="#ef4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No data available for chart
                  </div>
                )}
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
                        if (entry['Hardhat'] === 0) missingPPE.push("Hardhat");
                        if (entry['Vest'] === 0) missingPPE.push("Vest");
                        if (entry['Gloves'] === 0) missingPPE.push("Gloves");
                        
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
        </TabsContent>
        
        <TabsContent value="reprimands" className="space-y-6">
          <ReprimandSystem nonCompliantRecords={nonCompliantRecords} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardView;
