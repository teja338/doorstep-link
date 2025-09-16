import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useService } from '@/contexts/ServiceContext';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Car, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  IndianRupee,
  BarChart3,
  Search,
  ArrowLeft,
  Trash2,
  UserCheck,
  UserX
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

export const AdminDashboard = () => {
  const { 
    requests, 
    deleteRequest, 
    getAllUsers, 
    getAllDrivers, 
    approveDriver, 
    removeDriver, 
    deleteUser 
  } = useService();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'drivers' | 'requests' | 'reports'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Safely get users and drivers with fallback
  const users = getAllUsers() || [];
  const drivers = getAllDrivers() || [];
  const recentRequests = requests?.slice(0, 10) || [];
  const pendingCount = requests?.filter(r => r.status === 'pending').length || 0;
  const completedCount = requests?.filter(r => r.status === 'completed').length || 0;
  const inProgressCount = requests?.filter(r => r.status === 'in_progress').length || 0;

  // Filter functions
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredRequests = requests?.filter(request => 
    request.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.status.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Action handlers with toast notifications  
  const handleDeleteUser = (userId: string, userName: string) => {
    deleteUser(userId);
    toast({
      title: "User deleted",
      description: `${userName} has been removed from the system.`,
      variant: "destructive"
    });
  };

  const handleApproveDriver = (driverId: string, driverName: string) => {
    approveDriver(driverId);
    toast({
      title: "Driver approved",
      description: `${driverName} has been approved and can now accept requests.`,
    });
  };

  const handleRemoveDriver = (driverId: string, driverName: string) => {
    removeDriver(driverId);
    toast({
      title: "Driver removed",
      description: `${driverName} has been removed from the system.`,
      variant: "destructive"
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    deleteRequest(requestId);
    toast({
      title: "Request deleted",
      description: "The service request has been removed from the system.",
      variant: "destructive"
    });
  };

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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              {activeTab !== 'overview' && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveTab('overview')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Overview</span>
                </Button>
              )}
              <div>
                <h1 className="text-3xl font-bold">
                  {activeTab === 'overview' ? 'Admin Dashboard' : 
                   activeTab === 'users' ? 'User Management' :
                   activeTab === 'drivers' ? 'Driver Management' :
                   activeTab === 'requests' ? 'Request Management' :
                   'System Reports'}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {activeTab === 'overview' ? 'Monitor and manage the A-Z Anything emergency delivery system' :
                   activeTab === 'users' ? 'Manage all registered users in the system' :
                   activeTab === 'drivers' ? 'Approve and manage delivery drivers' :
                   activeTab === 'requests' ? 'View and manage all service requests' :
                   'View detailed analytics and system reports'}
                </p>
              </div>
            </div>
          </div>
          
          {activeTab !== 'overview' && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          )}
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
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
                    <p className="text-2xl font-bold">{drivers.filter(d => d.status === 'approved').length}/{drivers.length}</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">
                                {request.vehicleType === 'bike' ? '🏍️' : 
                                 request.vehicleType === 'auto' ? '🛺' : 
                                 request.vehicleType === 'car' ? '🚗' : 
                                 request.vehicleType === 'ambulance' ? '🚑' : 
                                 request.vehicleType === 'mini-truck' ? '🚚' : '🚐'}
                              </span>
                              <div>
                                <p className="font-medium text-sm capitalize">{request.serviceType}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {request.vehicleType.replace('-', ' ')}
                                </p>
                              </div>
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
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Administrative tools and system management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('users')}
                  >
                    <Users className="h-6 w-6 mb-2" />
                    <span className="text-sm">Manage Users</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('drivers')}
                  >
                    <Car className="h-6 w-6 mb-2" />
                    <span className="text-sm">Manage Drivers</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('reports')}
                  >
                    <BarChart3 className="h-6 w-6 mb-2" />
                    <span className="text-sm">View Reports</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-16 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('requests')}
                  >
                    <AlertTriangle className="h-6 w-6 mb-2" />
                    <span className="text-sm">All Requests</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchQuery ? 'No users found matching your search.' : 'No users registered yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="flex items-center space-x-2"
                          >
                            <UserX className="h-4 w-4" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Driver Management Tab */}
        {activeTab === 'drivers' && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Driver Management</CardTitle>
                <CardDescription>Manage driver approvals and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDrivers.length === 0 ? (
                    <div className="text-center py-8">
                      <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchQuery ? 'No drivers found matching your search.' : 'No drivers registered yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{driver.name}</h4>
                          <p className="text-sm text-muted-foreground">{driver.email}</p>
                          <p className="text-sm text-muted-foreground">{driver.phone}</p>
                          <p className="text-sm text-muted-foreground capitalize">Vehicle: {driver.vehicleType}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={driver.status === 'approved' ? 'default' : 'secondary'}>
                            {driver.status}
                          </Badge>
                          {driver.status === 'pending' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleApproveDriver(driver.id, driver.name)}
                              className="flex items-center space-x-2"
                            >
                              <UserCheck className="h-4 w-4" />
                              <span>Approve</span>
                            </Button>
                          )}
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleRemoveDriver(driver.id, driver.name)}
                            className="flex items-center space-x-2"
                          >
                            <UserX className="h-4 w-4" />
                            <span>Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Request Management Tab */}
        {activeTab === 'requests' && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>All Service Requests</CardTitle>
                <CardDescription>View and manage all service requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {searchQuery ? 'No requests found matching your search.' : 'No service requests found.'}
                      </p>
                    </div>
                  ) : (
                    filteredRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg">
                              {request.vehicleType === 'bike' ? '🏍️' : 
                               request.vehicleType === 'auto' ? '🛺' : 
                               request.vehicleType === 'car' ? '🚗' : 
                               request.vehicleType === 'ambulance' ? '🚑' : 
                               request.vehicleType === 'mini-truck' ? '🚚' : '🚐'}
                            </span>
                            <div>
                              <p className="font-medium capitalize">{request.serviceType}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {request.vehicleType.replace('-', ' ')} • {request.pickupLocation}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                            {request.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteRequest(request.id)}
                            className="flex items-center space-x-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>System Reports</CardTitle>
                <CardDescription>View detailed analytics and reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Request Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Requests:</span>
                        <span className="font-medium">{requests?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="font-medium text-green-600">{completedCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending:</span>
                        <span className="font-medium text-amber-600">{pendingCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress:</span>
                        <span className="font-medium text-blue-600">{inProgressCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">User Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Users:</span>
                        <span className="font-medium">{users.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Drivers:</span>
                        <span className="font-medium">{drivers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approved Drivers:</span>
                        <span className="font-medium text-green-600">
                          {drivers.filter(d => d.status === 'approved').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Approvals:</span>
                        <span className="font-medium text-amber-600">
                          {drivers.filter(d => d.status === 'pending').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};