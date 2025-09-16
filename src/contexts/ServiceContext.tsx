import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceRequest, ServiceType, RequestStatus, VehicleType } from '@/types';

interface ServiceContextType {
  requests: ServiceRequest[];
  addRequest: (request: Omit<ServiceRequest, 'id' | 'requestedAt' | 'status'>) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus, driverId?: string) => void;
  getUserRequests: (userId: string) => ServiceRequest[];
  getPendingRequests: () => ServiceRequest[];
  getDriverRequests: (driverId: string) => ServiceRequest[];
  cancelRequest: (requestId: string) => void;
  acceptRequest: (requestId: string, driverId: string) => void;
  rejectRequest: (requestId: string) => void;
  // Admin functions
  deleteRequest: (requestId: string) => void;
  getAllUsers: () => any[];
  getAllDrivers: () => any[];
  approveDriver: (driverId: string) => void;
  removeDriver: (driverId: string) => void;
  deleteUser: (userId: string) => void;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

// Mock initial requests for demo
const initialRequests: ServiceRequest[] = [
  {
    id: '1',
    userId: '1',
    serviceType: 'medicine',
    vehicleType: 'bike',
    pickupLocation: 'City Medical Store, Main Bazaar',
    destination: '123 Main St, Village Name',
    description: 'Urgent diabetes medicine needed',
    contactNumber: '+91 9876543210',
    requestedAt: new Date().toISOString(),
    status: 'pending',
    estimatedCost: 150
  },
  {
    id: '2',
    userId: '1',
    serviceType: 'groceries',
    vehicleType: 'auto',
    pickupLocation: 'Super Market, City Center',
    destination: '123 Main St, Village Name',
    description: 'Weekly grocery shopping',
    contactNumber: '+91 9876543210',
    requestedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    driverId: '2',
    estimatedCost: 200,
    actualCost: 180
  }
];

// Mock users and drivers data
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+91 8765432109', status: 'active' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 7654321098', status: 'inactive' }
];

const mockDrivers = [
  { id: '2', name: 'Driver Kumar', email: 'kumar@example.com', phone: '+91 9988776655', vehicleType: 'bike', status: 'approved' },
  { id: '3', name: 'Driver Singh', email: 'singh@example.com', phone: '+91 8877665544', vehicleType: 'auto', status: 'pending' },
  { id: '4', name: 'Driver Patel', email: 'patel@example.com', phone: '+91 7766554433', vehicleType: 'car', status: 'approved' }
];

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [users, setUsers] = useState(mockUsers);
  const [drivers, setDrivers] = useState(mockDrivers);

  // Load requests from localStorage on mount
  useEffect(() => {
    const storedRequests = localStorage.getItem('azAnythingRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }
  }, []);

  // Save to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('azAnythingRequests', JSON.stringify(requests));
  }, [requests]);

  const addRequest = (requestData: Omit<ServiceRequest, 'id' | 'requestedAt' | 'status'>) => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: Date.now().toString(),
      requestedAt: new Date().toISOString(),
      status: 'pending'
    };
    setRequests(prev => [newRequest, ...prev]);
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus, driverId?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status, ...(driverId && { driverId }) }
        : req
    ));
  };

  const getUserRequests = (userId: string) => {
    return requests.filter(req => req.userId === userId);
  };

  const getPendingRequests = () => {
    return requests.filter(req => req.status === 'pending');
  };

  const getDriverRequests = (driverId: string) => {
    return requests.filter(req => req.driverId === driverId);
  };

  const cancelRequest = (requestId: string) => {
    updateRequestStatus(requestId, 'cancelled');
  };

  const acceptRequest = (requestId: string, driverId: string) => {
    updateRequestStatus(requestId, 'accepted', driverId);
  };

  const rejectRequest = (requestId: string) => {
    // For demo purposes, rejecting just removes it from pending
    // In real app, this might reassign or mark differently
    updateRequestStatus(requestId, 'cancelled');
  };

  // Admin functions
  const deleteRequest = (requestId: string) => {
    setRequests(prev => prev.filter(req => req.id !== requestId));
  };

  const getAllUsers = () => users;
  const getAllDrivers = () => drivers;

  const approveDriver = (driverId: string) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId ? { ...driver, status: 'approved' } : driver
    ));
  };

  const removeDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== driverId));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    // Also remove user's requests
    setRequests(prev => prev.filter(req => req.userId !== userId));
  };

  return (
    <ServiceContext.Provider value={{
      requests,
      addRequest,
      updateRequestStatus,
      getUserRequests,
      getPendingRequests,
      getDriverRequests,
      cancelRequest,
      acceptRequest,
      rejectRequest,
      deleteRequest,
      getAllUsers,
      getAllDrivers,
      approveDriver,
      removeDriver,
      deleteUser
    }}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
};