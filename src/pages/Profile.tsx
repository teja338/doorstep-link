import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { User, Edit, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Profile = () => {
  const { auth, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: auth.user?.phone || '',
    address: auth.user?.address || ''
  });

  if (!auth.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...auth.user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    };
    
    updateUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: auth.user?.name || '',
      email: auth.user?.email || '',
      phone: auth.user?.phone || '',
      address: auth.user?.address || ''
    });
    setIsEditing(false);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      user: { label: 'Service User', color: 'bg-blue-100 text-blue-800' },
      driver: { label: 'Service Driver', color: 'bg-green-100 text-green-800' },
      admin: { label: 'Administrator', color: 'bg-purple-100 text-purple-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">My Profile</h1>
          <p className="text-muted-foreground text-lg">
            Manage your account information and preferences
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-emergency rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{auth.user.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <span>Account Details</span>
                    <span>•</span>
                    {getRoleBadge(auth.user.role)}
                  </CardDescription>
                </div>
              </div>
              
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button variant="success" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="p-3 bg-muted rounded-md">
                    {getRoleBadge(auth.user.role)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    November 2024
                  </div>
                </div>
              </div>
            </div>

            {/* Role-specific Information */}
            {auth.user.role === 'driver' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Driver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Input value="Motorcycle" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input value="DL1420110012345" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      4.8 ⭐ (127 reviews)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm">
                      ✅ Verified & Active
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics */}
            {auth.user.role !== 'admin' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/5 rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {auth.user.role === 'user' ? '12' : '156'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {auth.user.role === 'user' ? 'Services Used' : 'Services Completed'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-success/5 rounded-lg">
                    <p className="text-2xl font-bold text-success">
                      {auth.user.role === 'user' ? '4.9' : '4.8'}
                    </p>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                  <div className="text-center p-4 bg-secondary/5 rounded-lg">
                    <p className="text-2xl font-bold text-secondary">
                      {auth.user.role === 'user' ? '₹2,340' : '₹18,450'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {auth.user.role === 'user' ? 'Total Spent' : 'Total Earned'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Two-Factor Authentication
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Download My Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};