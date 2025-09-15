import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-success/5 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-8">
          <HeartHandshake className="h-12 w-12 text-white" />
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The emergency service you're looking for doesn't exist. 
          Let's get you back to safety.
        </p>
        
        <div className="space-y-4">
          <Link to="/login">
            <Button variant="emergency" size="lg" className="w-full">
              Return to Emergency Hub
            </Button>
          </Link>
          
          <Link to="/book-service">
            <Button variant="outline" size="lg" className="w-full">
              Book Emergency Service
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Need immediate help? Call our emergency line:</p>
          <p className="font-semibold text-primary">+91 1800-HELP (4357)</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
