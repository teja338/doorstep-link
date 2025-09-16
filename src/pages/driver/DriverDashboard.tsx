import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, AlertCircle, CheckCircle, Truck, Car, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const getVehicleIcon = (vehicleType: string) => {
  switch (vehicleType) {
    case 'bike': return '🏍️';
    case 'auto': return '🛺';
    case 'car': return '🚗';
    case 'ambulance': return '🚑';
    case 'mini-truck': return '🚚';
    default: return '🚐';
  }
};

const getServiceTypeColor = (serviceType: string) => {
  switch (serviceType) {
    case 'ambulance': return 'bg-red-100 text-red-800 border-red-300';
    case 'medicine': return 'bg-blue-100 text-blue-800 border-blue-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const DriverDashboard = () => {
  const { auth } = useAuth();
  const { requests, acceptRequest, rejectRequest } = useService();

  const pendingRequests = requests.filter(request => request.status === 'pending');

  const handleAccept = (requestId: string) => {
    if (auth.user) {
      acceptRequest(requestId, auth.user.id);
      toast({
        title: "Request accepted!",
        description: "The request has been assigned to you. Check 'My Services' for details.",
      });
    }
  };

  const handleReject = (requestId: string) => {
    rejectRequest(requestId);
    toast({
      title: "Request declined",
      description: "The request has been declined and will be available for other drivers.",
      variant: "destructive",
    });
  };

  const getUrgencyLevel = (serviceType: string, description: string) => {
    if (serviceType === 'ambulance') return 'critical';
    if (serviceType === 'medicine' || description.toLowerCase().includes('urgent')) return 'high';
    return 'normal';
  };

  const urgencyColors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    normal: 'bg-green-500'
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Driver Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Available emergency service requests in your area
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
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
                <p className="text-2xl font-bold">3</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mr-4">
                <IndianRupee className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Earnings</p>
                <p className="text-2xl font-bold">₹540</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Requests */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Available Service Requests</h2>
          
          {pendingRequests.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                <p className="text-muted-foreground">
                  All caught up! New emergency requests will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {pendingRequests.map((request) => {
                const urgency = getUrgencyLevel(request.serviceType, request.description);
                
                return (
                  <Card key={request.id} className={`hover:shadow-lg transition-all duration-300 ${
                    urgency === 'critical' ? 'border-red-200 bg-red-50/50' : 
                    urgency === 'high' ? 'border-orange-200 bg-orange-50/50' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 ${urgencyColors[urgency]} rounded-full`}></div>
                          <div>
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                      <span className="text-2xl">{getVehicleIcon(request.vehicleType)}</span>
                      <span className="capitalize">{request.serviceType}</span>
                      <Badge className={`rounded-full px-3 py-1 border text-xs ${getServiceTypeColor(request.serviceType)}`}>
                        {request.serviceType === 'ambulance' || request.serviceType === 'medicine' ? 'URGENT' : 'STANDARD'}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4 text-accent-blue" />
                      <span className="text-sm font-medium text-accent-blue capitalize">
                        {request.vehicleType.replace('-', ' ')} Required
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Requested {format(new Date(request.requestedAt), 'MMM d, h:mm a')}</span>
                    </div>
                          </div>
                        </div>
                        
                        {request.estimatedCost && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Estimated Earnings</p>
                            <p className="text-lg font-semibold text-success">₹{request.estimatedCost}</p>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium">Pickup Location</p>
                              <p className="text-sm text-muted-foreground break-words">{request.pickupLocation}</p>
                            </div>
                          </div>
                          
                          {request.destination && (
                            <div className="flex items-start space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium">Destination</p>
                                <p className="text-sm text-muted-foreground break-words">{request.destination}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Customer Contact</p>
                              <p className="text-sm text-muted-foreground">{request.contactNumber}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Requested Time</p>
                              <p className="text-sm text-muted-foreground">
                                {request.scheduledTime 
                                  ? new Date(request.scheduledTime).toLocaleString()
                                  : 'Immediate'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {request.description && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-1">Customer Notes</p>
                          <p className="text-sm text-muted-foreground">{request.description}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      className="text-red-600 border-red-300 hover:bg-red-50 rounded-lg"
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleAccept(request.id)}
                      className="rounded-lg font-semibold"
                    >
                      Accept Request
                    </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};