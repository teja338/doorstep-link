export type UserRole = 'user' | 'driver' | 'admin';

export type ServiceType = 
  | 'ambulance'
  | 'medicine'
  | 'gas'
  | 'groceries'
  | 'food'
  | 'documents'
  | 'others';

export type VehicleType =
  | 'bike'
  | 'auto'
  | 'car'
  | 'ambulance'
  | 'mini-truck';

export type RequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  address?: string;
}

export interface Driver extends User {
  vehicleType: string;
  licenseNumber: string;
  isAvailable: boolean;
  rating: number;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  driverId?: string;
  serviceType: ServiceType;
  vehicleType: VehicleType;
  pickupLocation: string;
  destination?: string;
  description: string;
  contactNumber: string;
  requestedAt: string;
  scheduledTime?: string;
  status: RequestStatus;
  estimatedCost?: number;
  actualCost?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}