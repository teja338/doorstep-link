import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { RequestStatus } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Phone, 
  MapPin,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const statusConfig = {
  pending: { icon: Clock, color: 'bg-yellow-500', label: 'Pending', description: 'Waiting for driver' },
  accepted: { icon: CheckCircle, color: 'bg-blue-500', label: 'Accepted', description: 'Driver assigned' },
  in_progress: { icon: Truck, color: 'bg-orange-500', label: 'In Progress', description: 'On the way' },
  completed: { icon: CheckCircle, color: 'bg-green-500', label: 'Completed', description: 'Service completed' },
  cancelled: { icon: XCircle, color: 'bg-red-500', label: 'Cancelled', description: 'Request cancelled' }
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

export const MyRequests = () => {
  const { auth } = useAuth();
  const { getUserRequests, cancelRequest } = useService();
  const [filter, setFilter] = useState<RequestStatus | 'all'>('all');

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Please log in to view your requests.</p>
      </div>
    );
  }

  const userRequests = getUserRequests(auth.user.id);
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
              {status === 'all' ? 'All Requests' : statusConfig[status].label}
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
              const statusInfo = statusConfig[request.status];
              const StatusIcon = statusInfo.icon;

              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${statusInfo.color} rounded-full flex items-center justify-center`}>
                          <StatusIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {serviceTypeLabels[request.serviceType]}
                          </CardTitle>
                          <CardDescription>
                            Request ID: {request.id} • {statusInfo.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                        {statusInfo.label}
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