import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  LogOut, 
  Home, 
  Plus, 
  FileText, 
  Car,
  BarChart3,
  Users,
  HeartHandshake
} from 'lucide-react';

export const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!auth.isAuthenticated) {
    return null;
  }

  const getNavItems = () => {
    switch (auth.user?.role) {
      case 'user':
        return [
          { href: '/', label: 'Home', icon: Home },
          { href: '/book-service', label: 'Book Service', icon: Plus },
          { href: '/my-requests', label: 'My Requests', icon: FileText },
          { href: '/profile', label: 'Profile', icon: User },
        ];
      case 'driver':
        return [
          { href: '/driver-dashboard', label: 'Dashboard', icon: Car },
          { href: '/my-services', label: 'My Services', icon: HeartHandshake },
          { href: '/profile', label: 'Profile', icon: User },
        ];
      case 'admin':
        return [
          { href: '/admin-dashboard', label: 'Dashboard', icon: BarChart3 },
          { href: '/admin-users', label: 'Manage Users', icon: Users },
          { href: '/profile', label: 'Profile', icon: User },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-card shadow-card border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-emergency rounded-lg flex items-center justify-center">
                <HeartHandshake className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-hero bg-clip-text text-transparent">
                A-Z Anything
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} to={href}>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome, {auth.user?.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t px-4 py-3">
        <div className="flex justify-around">
          {navItems.slice(0, 4).map(({ href, label, icon: Icon }) => (
            <Link key={href} to={href}>
              <Button variant="ghost" size="sm" className="flex flex-col items-center space-y-1 h-auto py-2">
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};