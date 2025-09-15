import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/contexts/ServiceContext';
import { ServiceType, VehicleType } from '@/types';
import { Calendar, MapPin, Phone, Send, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const serviceOptions = [
  { value: 'ambulance', label: 'Emergency Transport / Ambulance', urgent: true },
  { value: 'medicine', label: 'Medicine Delivery', urgent: true },
  { value: 'gas', label: 'Gas Cylinder Delivery', urgent: false },
  { value: 'groceries', label: 'Groceries & Essentials', urgent: false },
  { value: 'food', label: 'Food Delivery', urgent: false },
  { value: 'documents', label: 'Document Pickup/Delivery', urgent: false },
  { value: 'others', label: 'Other Services', urgent: false }
];

const vehicleOptions = [
  { value: 'bike', label: 'Bike/Motorcycle', description: 'Small items, documents, medicines' },
  { value: 'auto', label: 'Auto Rickshaw', description: 'Moderate items, short distance travel' },
  { value: 'car', label: 'Car', description: 'People transport, comfortable rides' },
  { value: 'ambulance', label: 'Ambulance', description: 'Medical emergencies only' },
  { value: 'mini-truck', label: 'Mini Truck', description: 'Heavy items, furniture, gas cylinders' }
];

export const BookService = () => {
  const { auth } = useAuth();
  const { addRequest } = useService();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    serviceType: '' as ServiceType,
    vehicleType: '' as VehicleType,
    pickupLocation: '',
    destination: '',
    description: '',
    contactNumber: auth.user?.phone || '',
    scheduledTime: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book a service.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      addRequest({
        userId: auth.user.id,
        serviceType: formData.serviceType,
        vehicleType: formData.vehicleType,
        pickupLocation: formData.pickupLocation,
        destination: formData.destination || undefined,
        description: formData.description,
        contactNumber: formData.contactNumber,
        scheduledTime: formData.scheduledTime || undefined,
        estimatedCost: Math.floor(Math.random() * 200) + 50 // Random cost for demo
      });

      toast({
        title: "Service booked successfully!",
        description: "Your request has been submitted. A driver will be assigned shortly.",
      });

      navigate('/my-requests');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "An error occurred while booking the service.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedService = serviceOptions.find(s => s.value === formData.serviceType);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Book Emergency Service</h1>
          <p className="text-muted-foreground text-lg">
            Fill out the form below to request immediate assistance
          </p>
        </div>

        <Card className="shadow-md rounded-xl border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl font-bold">
              <Send className="h-5 w-5 text-primary" />
              <span>Service Request Form</span>
            </CardTitle>
            <CardDescription>
              Please provide accurate information for faster service
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type */}
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select 
                  value={formData.serviceType} 
                  onValueChange={(value: ServiceType) => handleInputChange('serviceType', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select the service you need" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    {serviceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span>{option.label}</span>
                          {option.urgent && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                              URGENT
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedService?.urgent && (
                  <p className="text-sm text-primary font-medium">
                    ⚡ This is an urgent service - priority response activated
                  </p>
                )}
              </div>

              {/* Vehicle Type */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type *</Label>
                <Select 
                  value={formData.vehicleType} 
                  onValueChange={(value: VehicleType) => handleInputChange('vehicleType', value)}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select vehicle type needed" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                    {vehicleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4 text-accent-blue" />
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{option.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pickup Location */}
              <div className="space-y-2">
                <Label htmlFor="pickupLocation">Pickup Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pickupLocation"
                    placeholder="Enter pickup address (e.g., City Medical Store, Main Bazaar)"
                    className="pl-10"
                    value={formData.pickupLocation}
                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">
                  Destination {formData.serviceType === 'ambulance' ? '*' : '(Optional)'}
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="destination"
                    placeholder="Enter delivery/drop-off address"
                    className="pl-10"
                    value={formData.destination}
                    onChange={(e) => handleInputChange('destination', e.target.value)}
                    required={formData.serviceType === 'ambulance'}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description & Special Instructions *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your request, urgency level, and any special instructions"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="+91 9876543210"
                    className="pl-10"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Scheduled Time */}
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Preferred Time (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="scheduledTime"
                    type="datetime-local"
                    className="pl-10"
                    value={formData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave empty for immediate service request
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                  <Button
                  type="submit"
                  variant="emergency"
                  className="flex-1 rounded-xl font-bold"
                  disabled={isLoading || !formData.serviceType || !formData.vehicleType || !formData.pickupLocation || !formData.description}
                >
                  {isLoading ? 'Submitting...' : selectedService?.urgent ? 'Request Emergency Service' : 'Book Service'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white"
                  onClick={() => navigate('/my-requests')}
                >
                  View My Requests
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-sm space-y-2">
              <p className="font-medium text-primary">💡 Quick Tips:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Be specific about your location for faster pickup</li>
                <li>• For medicines, mention the pharmacy name if known</li>
                <li>• Emergency services get priority response within minutes</li>
                <li>• You'll receive SMS updates about your request status</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};