import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Ambulance, 
  Pill, 
  Zap, 
  ShoppingCart, 
  FileText, 
  Truck,
  Clock,
  Shield,
  MapPin,
  Star
} from 'lucide-react';

const services = [
  {
    icon: Ambulance,
    title: 'Emergency Transport',
    description: 'Urgent medical transport and safe rides',
    color: 'text-red-500'
  },
  {
    icon: Pill,
    title: 'Medicine Delivery',
    description: 'Fast delivery of medicines and medical supplies',
    color: 'text-blue-500'
  },
  {
    icon: Zap,
    title: 'Gas Cylinder',
    description: 'Emergency gas cylinder delivery service',
    color: 'text-orange-500'
  },
  {
    icon: ShoppingCart,
    title: 'Groceries & Essentials',
    description: 'Daily essentials delivered to your doorstep',
    color: 'text-green-500'
  },
  {
    icon: FileText,
    title: 'Document Pickup',
    description: 'Important document collection and delivery',
    color: 'text-purple-500'
  },
  {
    icon: Truck,
    title: 'General Delivery',
    description: 'Any item pickup and delivery service',
    color: 'text-gray-500'
  }
];

const features = [
  {
    icon: Clock,
    title: '24/7 Available',
    description: 'Emergency services available round the clock'
  },
  {
    icon: Shield,
    title: 'Verified Drivers',
    description: 'All drivers are background verified and trained'
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    description: 'Track your delivery in real-time'
  },
  {
    icon: Star,
    title: 'Rated Service',
    description: 'Highly rated by our community members'
  }
];

export const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-background py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-primary">
              Help at your doorstep
            </span>
            <br />
            <span className="text-foreground">— instantly.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Emergency delivery and pickup services for villages and cities. 
            From medicines to groceries, we deliver what you need, when you need it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-service">
              <Button variant="default" size="xl" className="rounded-xl font-bold shadow-lg hover:shadow-xl">
                Book Emergency Now
              </Button>
            </Link>
            <Link to="/my-requests">
              <Button variant="outline" size="xl" className="rounded-xl border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
                Track My Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Emergency Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide reliable delivery and pickup services for all your urgent needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300 group rounded-xl border border-gray-200">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <service.icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose A-Z Anything?</h2>
            <p className="text-muted-foreground text-lg">
              Trusted by thousands for reliable emergency services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-emergency">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Join thousands of satisfied customers who trust us for their emergency needs.
          </p>
          <Link to="/book-service">
            <Button variant="secondary" size="xl" className="rounded-xl font-bold">
              Book Your First Service
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};