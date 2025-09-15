import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { RequestStatus } from '@/types';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle,
  Clock,
  Navigation,
  MessageCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const statusConfig = {
  accepted: { icon: Clock, color: 'bg-blue-500', label: 'Accepted', nextStatus: 'in_progress' },
  in_progress: { icon: Truck, color: 'bg-orange-500', label: 'In Progress', nextStatus: 'completed' },
  completed: { icon: CheckCircle, color: 'bg-green-500', label: 'Completed', nextStatus: null }
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

export const MyServices = () => {
  const { auth } = useAuth();
  const { getDriverRequests, updateRequestStatus } = useService();

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Please log in to view your services.</p>
      </div>
    );
  }

  const driverRequests = getDriverRequests(auth.user.id);
  const activeRequests = driverRequests.filter(req => 
    ['accepted', 'in_progress'].includes(req.status)
  );
  const completedRequests = driverRequests.filter(req => req.status === 'completed');

  const handleUpdateStatus = (requestId: string, newStatus: RequestStatus) => {
    updateRequestStatus(requestId, newStatus);
    
    const statusMessages = {
      in_progress: 'Service status updated to "In Progress". Customer has been notified.',
      completed: 'Service marked as completed! Great job.'
    };
    
    toast({
      title: "Status updated",
      description: statusMessages[newStatus as keyof typeof statusMessages],
    });
  };

  const getNextActionText = (currentStatus: string) => {
    switch (currentStatus) {
      case 'accepted':
        return 'Start Service';
      case 'in_progress':
        return 'Mark Completed';
      default:
        return 'Update Status';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">My Active Services</h1>
          <p className="text-muted-foreground text-lg">
            Manage your accepted service requests and update status
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mr-4">
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold">{activeRequests.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                <p className="text-2xl font-bold">{completedRequests.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                <Navigation className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">4.8 ⭐</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Requests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Active Requests</h2>
          
          {activeRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No active services</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any active service requests at the moment.
                </p>
                <Button variant="emergency" onClick={() => window.location.href = '/driver-dashboard'}>
                  Find New Requests
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeRequests.map((request) => {
                const statusInfo = statusConfig[request.status as keyof typeof statusConfig];
                const StatusIcon = statusInfo?.icon || Clock;
                const nextStatus = statusInfo?.nextStatus;

                return (
                  <Card key={request.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${statusInfo?.color || 'bg-gray-500'} rounded-full flex items-center justify-center`}>
                            <StatusIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">
                              {serviceTypeLabels[request.serviceType]}
                            </CardTitle>
                            <CardDescription>
                              Request ID: {request.id} • {statusInfo?.label}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {statusInfo?.label}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                            <div>
                              <p className="text-sm font-medium">Pickup</p>
                              <p className="text-sm text-muted-foreground">{request.pickupLocation}</p>
                            </div>
                          </div>
                          
                          {request.destination && (
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                              <div>
                                <p className="text-sm font-medium">Destination</p>
                                <p className="text-sm text-muted-foreground">{request.destination}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Customer</p>
                              <p className="text-sm text-muted-foreground">{request.contactNumber}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Started At</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.requestedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {request.description && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Service Details</p>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        {nextStatus && (
                          <Button
                            variant="success"
                            className="flex-1"
                            onClick={() => handleUpdateStatus(request.id, nextStatus as RequestStatus)}
                          >
                            {getNextActionText(request.status)}
                          </Button>
                        )}
                        
                        <Button variant="secondary">
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate
                        </Button>
                        
                        <Button variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Customer
                        </Button>
                        
                        <Button variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Requests */}
        {completedRequests.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Recently Completed</h2>
            <div className="space-y-4">
              {completedRequests.slice(0, 3).map((request) => (
                <Card key={request.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{serviceTypeLabels[request.serviceType]}</p>
                          <p className="text-sm text-muted-foreground">
                            Completed • ₹{request.actualCost || request.estimatedCost}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};