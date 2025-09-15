import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useService } from '@/contexts/ServiceContext';
import { 
  Users, 
  Car, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  IndianRupee,
  BarChart3
} from 'lucide-react';

const mockStats = {
  totalUsers: 1247,
  totalDrivers: 89,
  activeDrivers: 67,
  totalRequests: 3456,
  completedToday: 23,
  pendingRequests: 8,
  revenue: 45678,
  completionRate: 94.2
};

const serviceTypeLabels = {
  ambulance: 'Emergency Transport',
  medicine: 'Medicine Delivery', 
  gas: 'Gas Cylinder',
  groceries: 'Groceries',
  food: 'Food Delivery',
  documents: 'Document Service',
  others: 'Other Service'
};

export const AdminDashboard = () => {
  const { requests } = useService();
  
  const recentRequests = requests.slice(0, 10);
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock },
      accepted: { variant: 'default' as const, icon: CheckCircle },
      in_progress: { variant: 'secondary' as const, icon: Clock },
      completed: { variant: 'default' as const, icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config?.variant || 'secondary'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Monitor and manage the A-Z Anything emergency delivery system
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{mockStats.totalUsers}</p>
                <p className="text-xs text-success">+12% this month</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                <Car className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Drivers</p>
                <p className="text-2xl font-bold">{mockStats.activeDrivers}/{mockStats.totalDrivers}</p>
                <p className="text-xs text-success">75% online rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{mockStats.completionRate}%</p>
                <p className="text-xs text-success">+2.3% improvement</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mr-4">
                <IndianRupee className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{mockStats.revenue.toLocaleString()}</p>
                <p className="text-xs text-success">+18% growth</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                Pending Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingCount}</div>
              <p className="text-sm text-muted-foreground">Awaiting driver assignment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">{inProgressCount}</div>
              <p className="text-sm text-muted-foreground">Currently being serviced</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-success mr-2" />
                Completed Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">{completedCount}</div>
              <p className="text-sm text-muted-foreground">Successfully completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Service Requests</CardTitle>
              <CardDescription>Latest emergency service requests in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRequests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent requests</p>
                ) : (
                  recentRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm">{serviceTypeLabels[request.serviceType]}</p>
                          {request.serviceType === 'ambulance' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {request.pickupLocation.substring(0, 40)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Important notifications and system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">High Demand Alert</p>
                    <p className="text-xs text-orange-700">
                      Medicine delivery requests increased by 40% in the last hour. Consider activating more drivers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Performance Update</p>
                    <p className="text-xs text-blue-700">
                      Average response time improved to 8 minutes. Great job team!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium text-green-800">System Status</p>
                    <p className="text-xs text-green-700">
                      All systems operational. 99.8% uptime maintained.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Administrative tools and system management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Manage Users</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <Car className="h-6 w-6 mb-2" />
                  <span className="text-sm">Manage Drivers</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Reports</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  <span className="text-sm">System Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};