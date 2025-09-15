import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ServiceProvider } from "@/contexts/ServiceContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Auth pages
import { Login } from "@/pages/auth/Login";
import { Register } from "@/pages/auth/Register";

// User pages
import { Home } from "@/pages/user/Home";
import { BookService } from "@/pages/user/BookService";
import { MyRequests } from "@/pages/user/MyRequests";

// Driver pages
import { DriverDashboard } from "@/pages/driver/DriverDashboard";
import { MyServices } from "@/pages/driver/MyServices";

// Admin pages
import { AdminDashboard } from "@/pages/admin/AdminDashboard";

// Shared pages
import { Profile } from "@/pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { auth } = useAuth();
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(auth.user?.role || '')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { auth } = useAuth();
  
  if (auth.isAuthenticated) {
    switch (auth.user?.role) {
      case 'driver':
        return <Navigate to="/driver-dashboard" replace />;
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return <>{children}</>;
};

// Layout Component
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* User Routes */}
      <Route path="/" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/book-service" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout>
            <BookService />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-requests" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout>
            <MyRequests />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Driver Routes */}
      <Route path="/driver-dashboard" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <Layout>
            <DriverDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-services" element={
        <ProtectedRoute allowedRoles={['driver']}>
          <Layout>
            <MyServices />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Shared Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ServiceProvider>
            <AppRoutes />
          </ServiceProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
