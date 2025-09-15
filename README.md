# A-Z Anything - Emergency Delivery & Pickup System

A comprehensive emergency booking and delivery platform built with React, TypeScript, and Tailwind CSS. This system connects users who need emergency services with verified drivers who can fulfill these needs efficiently.

## 🚨 Problem Statement

- Lack of reliable delivery and pick-up services in villages/mandals
- Urgent needs (medicines, gas cylinders) cannot be met without personal transport
- Existing delivery apps charge high fees and have limited coverage
- No proper service for safe people transport (emergency rides)

## ✅ Solution

**A-Z Anything** provides instant delivery & pick-up services where users can request essential services, and verified drivers can fulfill these needs efficiently. It ensures affordable, reliable, and safe delivery/pick-up solutions for both goods and people, especially in semi-urban and rural areas.

## 🎯 Key Features

### User Features
- **Emergency Service Booking**: Request medicines, groceries, gas cylinders, transport, and more
- **Real-time Tracking**: Monitor request status from booking to completion
- **Multiple Service Types**: Ambulance, medicine delivery, groceries, document pickup, etc.
- **Instant vs Scheduled**: Book immediate services or schedule for later
- **Request Management**: View, track, and manage all service requests

### Driver Features
- **Dashboard**: View all pending emergency requests in real-time
- **Request Management**: Accept/reject requests based on availability
- **Status Updates**: Update service progress (accepted → in progress → completed)
- **Earnings Tracking**: Monitor completed services and earnings

### Admin Features
- **System Overview**: Complete dashboard with metrics and analytics
- **User Management**: Monitor users, drivers, and service requests
- **Real-time Monitoring**: Track system performance and emergency response times

## 🎨 Design System

### Colors
- **Emergency Red** (#DC2626): Primary emergency actions and alerts
- **Emergency Blue** (#2563EB): Secondary actions and information
- **Success Green** (#16A34A): Completed services and confirmations

### UI Philosophy
- **Mobile-first**: Optimized for emergency use on mobile devices
- **Accessibility**: High contrast, clear CTAs, readable fonts
- **Emergency-focused**: Quick actions, minimal clicks, clear status indicators

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6 with role-based access
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with custom emergency variants
- **State Management**: React Context API + localStorage
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm installed
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:8080` to see the application.

## 👥 Demo Accounts

The app comes with pre-configured demo accounts for testing:

### User Account
- **Email**: user@demo.com
- **Password**: demo123
- **Role**: User (can book services)

### Driver Account  
- **Email**: driver@demo.com
- **Password**: demo123
- **Role**: Driver (can accept and fulfill requests)

### Admin Account
- **Email**: admin@demo.com  
- **Password**: demo123
- **Role**: Admin (system management)

## 📱 App Structure

```
src/
├── components/
│   ├── layout/          # Navbar, Footer
│   └── ui/              # Reusable UI components (shadcn/ui)
├── contexts/            # React Context for state management
│   ├── AuthContext.tsx  # Authentication & user management
│   └── ServiceContext.tsx # Service requests & booking logic
├── pages/
│   ├── auth/            # Login & Registration
│   ├── user/            # User dashboard, booking, requests
│   ├── driver/          # Driver dashboard & service management
│   ├── admin/           # Admin dashboard & system management
│   └── Profile.tsx      # Shared profile page
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

## 🔄 User Flow

### For Users (Service Requesters)
1. **Register/Login** as a User
2. **Browse Services** on the home page
3. **Book Emergency Service** with details (pickup, destination, description)
4. **Track Request** status in real-time
5. **Rate & Review** completed services

### For Drivers (Service Providers)
1. **Register/Login** as a Driver
2. **View Available Requests** on the driver dashboard
3. **Accept Requests** that match availability and location
4. **Update Status** throughout service fulfillment
5. **Complete Service** and earn payment

### For Admins (System Management)
1. **Login** as Admin
2. **Monitor System** metrics and performance
3. **Manage Users** and drivers
4. **View Analytics** and generate reports

## 📊 Core Functionalities

### Authentication & Authorization
- Role-based access control (User/Driver/Admin)
- Protected routes with automatic redirection
- Persistent login with localStorage
- Demo accounts for easy testing

### Booking System
- Multi-step service request form
- Real-time validation and error handling
- Emergency prioritization (ambulance, medicine)
- Estimated cost calculation
- Scheduled vs immediate booking

### Status Management
- Real-time status updates (Pending → Accepted → In Progress → Completed)
- Driver assignment and notification system
- Customer status tracking and updates

### Data Persistence
- LocalStorage for demo data persistence
- Context API for state management across components
- Mock API structure ready for backend integration

## 🎯 Emergency Service Types

1. **🚑 Emergency Transport/Ambulance** - Critical priority
2. **💊 Medicine Delivery** - High priority  
3. **⚡ Gas Cylinder Delivery** - Standard priority
4. **🛒 Groceries & Essentials** - Standard priority
5. **🍕 Food Delivery** - Standard priority
6. **📄 Document Pickup/Delivery** - Standard priority
7. **📦 Other Services** - Standard priority

## 📈 Future Enhancements

### Backend Integration
- **REST APIs** for user management, booking, and tracking
- **Real-time WebSocket** connections for live updates
- **Push Notifications** for status changes
- **Payment Gateway** integration (Razorpay, Stripe)

### Advanced Features
- **Google Maps Integration** for live tracking and navigation
- **SMS/WhatsApp Alerts** for status updates  
- **Driver Rating & Review System**
- **Advanced Analytics Dashboard**
- **Multi-language Support** for rural areas
- **Offline Mode** for limited connectivity areas

### Mobile App
- **React Native** version for better mobile experience
- **GPS Integration** for automatic location detection
- **Camera Integration** for delivery confirmations

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📝 Environment Setup

The app works out of the box with demo data. For production deployment:

1. **Set up backend APIs** for user management and data persistence
2. **Configure environment variables** for API endpoints
3. **Set up database** for users, drivers, and service requests
4. **Integrate payment processing** for service fees
5. **Add real-time communication** (WebSockets/Server-Sent Events)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📞 Support & Contact

For emergency technical support or feature requests:

- **Emergency Hotline**: +91 1800-HELP (4357)
- **Email**: help@azanything.com
- **Documentation**: Available in the `/docs` folder

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for emergency service delivery in rural and semi-urban communities.**