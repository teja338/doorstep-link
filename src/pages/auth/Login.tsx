import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { HeartHandshake, LogIn } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = login(email, password, role);
      if (success) {
        toast({
          title: "Login successful!",
          description: `Welcome to A-Z Anything ${role} portal.`,
        });
        
        // Navigate based on role
        switch (role) {
          case 'user':
            navigate('/');
            break;
          case 'driver':
            navigate('/driver-dashboard');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Try email with password 'demo123'.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-emergency rounded-xl flex items-center justify-center">
              <HeartHandshake className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-hero bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to access emergency delivery services
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@demo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="demo123"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Login as</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              type="submit" 
              variant="emergency"
              className="w-full"
              disabled={isLoading}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>User: user@demo.com / demo123</p>
              <p>Driver: driver@demo.com / demo123</p>
              <p>Admin: admin@demo.com / demo123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};