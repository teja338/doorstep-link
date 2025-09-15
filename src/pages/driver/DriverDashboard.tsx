import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { 
  Car, 
  MapPin, 
  Phone, 
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const serviceTypeLabels = {
  ambulance: 'Emergency Transport',
  medicine: 'Medicine Delivery',
  gas: 'Gas Cylinder',
  groceries: 'Groceries',
  food: 'Food Delivery',
  documents: 'Document Service',
  others: 'Other Service'
};

export const DriverDashboard = () => {
  const { auth } = useAuth();
  const { getPendingRequests, updateRequestStatus } = useService();
  const [acceptingRequests, setAcceptingRequests] = useState<string[]>([]);

  const pendingRequests = getPendingRequests();

  const handleAcceptRequest = async (requestId: string) => {
    if (!auth.user) return;
    
    setAcceptingRequests(prev => [...prev, requestId]);
    
    try {
      updateRequestStatus(requestId, 'accepted', auth.user.id);
      toast({
        title: "Request accepted!",
        description: "The customer has been notified. You can now start the service.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAcceptingRequests(prev => prev.filter(id => id !== requestId));
    }
  };

  const handleRejectRequest = (requestId: string) => {
    // In a real app, this might remove the request from this driver's view
    // For demo purposes, we'll just show a toast
    toast({
      title: "Request declined",
      description: "The request has been removed from your dashboard.",
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
                const isAccepting = acceptingRequests.includes(request.id);
                
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
                            <CardTitle className="text-xl flex items-center space-x-2">
                              <span>{serviceTypeLabels[request.serviceType]}</span>
                              {urgency === 'critical' && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  CRITICAL
                                </Badge>
                              )}
                              {urgency === 'high' && (
                                <Badge className="text-xs bg-orange-500">
                                  HIGH PRIORITY
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="text-base">
                              Request ID: {request.id} • Requested {new Date(request.requestedAt).toLocaleTimeString()}
                            </CardDescription>
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
                          variant="emergency"
                          className="flex-1"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={isAccepting}
                        >
                          {isAccepting ? 'Accepting...' : 'Accept Request'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleRejectRequest(request.id)}
                          disabled={isAccepting}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                        
                        <Button variant="secondary">
                          <MapPin className="w-4 h-4 mr-2" />
                          View on Map
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