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

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);

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
      rejectRequest
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