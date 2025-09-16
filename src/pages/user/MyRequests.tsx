import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Phone, Truck, User, Package, Calendar, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'accepted': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'completed': return 'bg-green-100 text-green-800 border-green-300';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

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

export const MyRequests = () => {
  const { auth } = useAuth();
  const { requests, cancelRequest } = useService();
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'>('all');

  const userRequests = requests.filter(request => request.userId === auth.user?.id);
  const filteredRequests = filter === 'all' 
    ? userRequests 
    : userRequests.filter(req => req.status === filter);

  const handleCancelRequest = (requestId: string) => {
    cancelRequest(requestId);
    toast({
      title: "Request cancelled",
      description: "Your service request has been cancelled successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">My Service Requests</h1>
          <p className="text-muted-foreground text-lg">
            Track and manage all your emergency service requests
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status === 'all' ? 'All Requests' : status.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No requests found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === 'all' 
                  ? "You haven't made any service requests yet."
                  : `No ${filter} requests found.`
                }
              </p>
              <Button variant="emergency" onClick={() => window.location.href = '/book-service'}>
                Book Your First Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center space-x-2 text-xl font-bold">
                      <span className="text-2xl">{getVehicleIcon(request.vehicleType)}</span>
                      <span className="capitalize">{request.serviceType}</span>
                      <span className="text-sm font-normal text-muted-foreground">
                        • {request.vehicleType.replace('-', ' ')}
                      </span>
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <Badge className={`rounded-full px-3 py-1 border ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(request.requestedAt), 'MMM d, yyyy • h:mm a')}
                      </span>
                    </div>
                  </div>
                      </div>
                      <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
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

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{request.contactNumber}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {new Date(request.requestedAt).toLocaleString()}
                          </span>
                        </div>

                        {request.estimatedCost && (
                          <div className="flex items-center space-x-2">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              ₹{request.actualCost || request.estimatedCost}
                              {request.actualCost !== request.estimatedCost && (
                                <span className="text-muted-foreground"> (est. ₹{request.estimatedCost})</span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.description && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-1">Description</p>
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {request.status === 'pending' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelRequest(request.id)}
                        >
                          Cancel Request
                        </Button>
                      )}
                      
                      {request.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Rate Service
                        </Button>
                      )}
                      
                      {(request.status === 'accepted' || request.status === 'in_progress') && (
                        <Button variant="secondary" size="sm">
                          Track Driver
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        View Details
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
  );
};