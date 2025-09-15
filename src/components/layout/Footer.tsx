import { HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-emergency rounded-lg flex items-center justify-center">
                <HeartHandshake className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-hero bg-clip-text text-transparent">
                A-Z Anything
              </span>
            </div>
            <p className="text-muted-foreground text-sm text-center md:text-left">
              Emergency delivery & pickup services at your doorstep. 
              Serving villages and cities with reliable, affordable solutions.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4">Emergency Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 1800-HELP (4357)</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Mail className="h-4 w-4" />
                <span>help@azanything.com</span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h3 className="font-semibold mb-4">Service Areas</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Rural & Semi-urban Areas</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <MapPin className="h-4 w-4" />
                <span>24/7 Emergency Services</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 A-Z Anything. All rights reserved. Built with care for emergency needs.</p>
        </div>
      </div>
    </footer>
  );
};