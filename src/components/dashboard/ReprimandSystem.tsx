import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getDatabase, ref, push, onValue, update, off } from 'firebase/database';

interface ReprimandRecord {
  id: string;
  employeeId: string;
  timestamp: string;
  violations: string[];
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'acknowledged' | 'resolved' | 'retraining';
  issueDate: string;
  notes?: string;
  retrainingType?: 'safety_briefing' | 'ppe_training' | 'comprehensive_safety' | 'supervisor_meeting';
  retrainingDate?: string;
  retrainingCompleted?: boolean;
}

interface ReprimandSystemProps {
  nonCompliantRecords: Array<{
    id: string;
    timestamp: string;
    'ID Number': string;
    'Hardhat': number;
    'Vest': number;
    'Gloves': number;
  }>;
}

const ReprimandSystem: React.FC<ReprimandSystemProps> = ({ nonCompliantRecords }) => {
  const [reprimands, setReprimands] = useState<ReprimandRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [showRetrainingDialog, setShowRetrainingDialog] = useState(false);
  const [selectedReprimand, setSelectedReprimand] = useState<ReprimandRecord | null>(null);
  const [retrainingType, setRetrainingType] = useState<ReprimandRecord['retrainingType']>('safety_briefing');
  const { toast } = useToast();

  const database = getDatabase();

  // Load reprimands from Firebase on component mount
  useEffect(() => {
    const reprimandsRef = ref(database, 'reprimands');
    
    const listener = onValue(reprimandsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const reprimandsList = Object.entries(data).map(([key, value]: [string, any]) => ({
          id: key,
          ...value
        }));
        setReprimands(reprimandsList);
      } else {
        setReprimands([]);
      }
    });

    return () => {
      off(reprimandsRef, 'value', listener);
    };
  }, [database]);

  // Calculate reprimand statistics by employee
  const getEmployeeStats = () => {
    const stats: { [key: string]: { total: number; pending: number; violations: string[] } } = {};
    
    nonCompliantRecords.forEach(record => {
      const employeeId = record['ID Number'];
      if (!stats[employeeId]) {
        stats[employeeId] = { total: 0, pending: 0, violations: [] };
      }
      stats[employeeId].total++;
      
      // Track specific violations
      if (record['Hardhat'] === 0) stats[employeeId].violations.push('Hardhat');
      if (record['Vest'] === 0) stats[employeeId].violations.push('Vest');
      if (record['Gloves'] === 0) stats[employeeId].violations.push('Gloves');
    });

    reprimands.forEach(reprimand => {
      if (stats[reprimand.employeeId] && reprimand.status === 'pending') {
        stats[reprimand.employeeId].pending++;
      }
    });

    return stats;
  };

  const issueReprimand = async (employeeId: string, violations: string[]) => {
    const severity = violations.length >= 3 ? 'high' : violations.length >= 2 ? 'medium' : 'low';
    const newReprimand: Omit<ReprimandRecord, 'id'> = {
      employeeId,
      timestamp: new Date().toISOString(),
      violations,
      severity,
      status: 'pending',
      issueDate: new Date().toLocaleDateString(),
      notes: `PPE violations detected: ${violations.join(', ')}`
    };

    try {
      const reprimandsRef = ref(database, 'reprimands');
      await push(reprimandsRef, newReprimand);
      
      toast({
        title: "Reprimand Issued",
        description: `Reprimand issued to ${employeeId} for ${violations.join(', ')} violations.`,
        variant: "destructive"
      });
      setShowIssueDialog(false);
    } catch (error) {
      console.error("Error issuing reprimand:", error);
      toast({
        title: "Error",
        description: "Failed to issue reprimand. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateReprimandStatus = async (reprimandId: string, newStatus: ReprimandRecord['status']) => {
    try {
      const reprimandRef = ref(database, `reprimands/${reprimandId}`);
      await update(reprimandRef, { status: newStatus });
      
      toast({
        title: "Status Updated",
        description: `Reprimand status updated to ${newStatus}.`
      });
    } catch (error) {
      console.error("Error updating reprimand status:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const assignRetraining = async (reprimandId: string, type: ReprimandRecord['retrainingType']) => {
    try {
      const reprimandRef = ref(database, `reprimands/${reprimandId}`);
      await update(reprimandRef, {
        status: 'retraining',
        retrainingType: type,
        retrainingDate: new Date().toISOString(),
        retrainingCompleted: false
      });
      
      toast({
        title: "Retraining Assigned",
        description: `${getRetrainingLabel(type)} assigned successfully.`
      });
      setShowRetrainingDialog(false);
      setSelectedReprimand(null);
    } catch (error) {
      console.error("Error assigning retraining:", error);
      toast({
        title: "Error",
        description: "Failed to assign retraining. Please try again.",
        variant: "destructive"
      });
    }
  };

  const markRetrainingComplete = async (reprimandId: string) => {
    try {
      const reprimandRef = ref(database, `reprimands/${reprimandId}`);
      await update(reprimandRef, {
        status: 'resolved',
        retrainingCompleted: true
      });
      
      toast({
        title: "Retraining Completed",
        description: "Retraining marked as completed and reprimand resolved."
      });
    } catch (error) {
      console.error("Error marking retraining complete:", error);
      toast({
        title: "Error",
        description: "Failed to update retraining status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRetrainingLabel = (type?: ReprimandRecord['retrainingType']) => {
    switch (type) {
      case 'safety_briefing': return 'Safety Briefing';
      case 'ppe_training': return 'PPE Training';
      case 'comprehensive_safety': return 'Comprehensive Safety Training';
      case 'supervisor_meeting': return 'Supervisor Meeting';
      default: return 'Unknown';
    }
  };

  const getSeverityColor = (severity: ReprimandRecord['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: ReprimandRecord['status']) => {
    switch (status) {
      case 'pending': return 'bg-orange-500';
      case 'acknowledged': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      case 'retraining': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const employeeStats = getEmployeeStats();
  const highRiskEmployees = Object.entries(employeeStats)
    .filter(([_, stats]) => stats.total >= 3)
    .sort(([_, a], [__, b]) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* Reprimand Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {reprimands.filter(r => r.status === 'pending').length}
            </div>
            <p className="text-sm text-gray-600">Pending Reprimands</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {reprimands.filter(r => r.status === 'retraining').length}
            </div>
            <p className="text-sm text-gray-600">In Retraining</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {reprimands.length}
            </div>
            <p className="text-sm text-gray-600">Total Reprimands</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {highRiskEmployees.length}
            </div>
            <p className="text-sm text-gray-600">High Risk Employees</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {reprimands.filter(r => r.severity === 'high').length}
            </div>
            <p className="text-sm text-gray-600">Critical Violations</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Issue Reprimand */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Issue New Reprimand
            <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Issue Reprimand</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Issue Reprimand</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Employee ID</label>
                    <select 
                      value={selectedEmployee} 
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Employee</option>
                      {Object.keys(employeeStats).map(employeeId => (
                        <option key={employeeId} value={employeeId}>
                          {employeeId} ({employeeStats[employeeId].total} violations)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedEmployee && employeeStats[selectedEmployee] && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Recent violations:</p>
                      <div className="flex flex-wrap gap-2">
                        {[...new Set(employeeStats[selectedEmployee].violations)].map(violation => (
                          <Badge key={violation} variant="destructive">{violation}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => {
                      if (selectedEmployee && employeeStats[selectedEmployee]) {
                        const violations = [...new Set(employeeStats[selectedEmployee].violations)];
                        issueReprimand(selectedEmployee, violations);
                      }
                    }}
                    disabled={!selectedEmployee}
                    className="w-full"
                  >
                    Issue Reprimand
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Retraining Assignment Dialog */}
      <Dialog open={showRetrainingDialog} onOpenChange={setShowRetrainingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Retraining</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Employee: <strong>{selectedReprimand?.employeeId}</strong>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Violations: {selectedReprimand?.violations.join(', ')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Retraining Type</label>
              <select 
                value={retrainingType || 'safety_briefing'} 
                onChange={(e) => setRetrainingType(e.target.value as ReprimandRecord['retrainingType'])}
                className="w-full border rounded px-3 py-2"
              >
                <option value="safety_briefing">Safety Briefing (1 hour)</option>
                <option value="ppe_training">PPE Training (2 hours)</option>
                <option value="comprehensive_safety">Comprehensive Safety Training (4 hours)</option>
                <option value="supervisor_meeting">Supervisor Meeting</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (selectedReprimand && retrainingType) {
                    assignRetraining(selectedReprimand.id, retrainingType);
                  }
                }}
                className="flex-1"
              >
                Assign Retraining
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowRetrainingDialog(false);
                  setSelectedReprimand(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* High Risk Employees */}
      {highRiskEmployees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>High Risk Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskEmployees.map(([employeeId, stats]) => (
                <Alert key={employeeId} className="border-red-200">
                  <AlertTitle className="flex justify-between items-center">
                    <span>{employeeId}</span>
                    <div className="flex gap-2">
                      <Badge variant="destructive">{stats.total} violations</Badge>
                      {stats.pending > 0 && (
                        <Badge className="bg-orange-500">{stats.pending} pending</Badge>
                      )}
                    </div>
                  </AlertTitle>
                  <AlertDescription>
                    Recent violations: {[...new Set(stats.violations)].join(', ')}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Reprimands */}
      <Card>
        <CardHeader>
          <CardTitle>Active Reprimands</CardTitle>
        </CardHeader>
        <CardContent>
          {reprimands.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Violations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Retraining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reprimands.map(reprimand => (
                    <tr key={reprimand.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        {reprimand.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {reprimand.issueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {reprimand.violations.map(violation => (
                            <Badge key={violation} variant="outline" className="text-xs">
                              {violation}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getSeverityColor(reprimand.severity)} text-white`}>
                          {reprimand.severity.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getStatusColor(reprimand.status)} text-white`}>
                          {reprimand.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {reprimand.retrainingType ? (
                          <div>
                            <p className="font-medium">{getRetrainingLabel(reprimand.retrainingType)}</p>
                            {reprimand.retrainingCompleted ? (
                              <Badge className="bg-green-500 text-white text-xs">Completed</Badge>
                            ) : (
                              <Badge className="bg-yellow-500 text-white text-xs">In Progress</Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2 flex-wrap">
                          {reprimand.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateReprimandStatus(reprimand.id, 'acknowledged')}
                              >
                                Acknowledge
                              </Button>
                              <Button
                                size="sm"
                                className="bg-purple-500 hover:bg-purple-600"
                                onClick={() => {
                                  setSelectedReprimand(reprimand);
                                  setShowRetrainingDialog(true);
                                }}
                              >
                                Assign Retraining
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateReprimandStatus(reprimand.id, 'resolved')}
                              >
                                Resolve
                              </Button>
                            </>
                          )}
                          {reprimand.status === 'acknowledged' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-purple-500 hover:bg-purple-600"
                                onClick={() => {
                                  setSelectedReprimand(reprimand);
                                  setShowRetrainingDialog(true);
                                }}
                              >
                                Assign Retraining
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateReprimandStatus(reprimand.id, 'resolved')}
                              >
                                Resolve
                              </Button>
                            </>
                          )}
                          {reprimand.status === 'retraining' && !reprimand.retrainingCompleted && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => markRetrainingComplete(reprimand.id)}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reprimands issued yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReprimandSystem;
