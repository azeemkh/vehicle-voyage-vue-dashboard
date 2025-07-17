
export interface VehicleLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  status: 'online' | 'offline' | 'alert';
  type: 'Truck' | 'Van' | 'Car' | 'Motorcycle';
  location: VehicleLocation;
  lastUpdated: string;
  address: string;
  speed: number;
  history: VehicleLocation[];
}

// Dubai coordinates for realistic vehicle tracking
export const mockVehicles: Vehicle[] = [
  {
    id: 'v-001',
    name: 'Delivery Truck Alpha',
    plate: 'DXB-001',
    status: 'online',
    type: 'Truck',
    location: { lat: 25.276987, lng: 55.296249, timestamp: '2025-07-17T10:30:00Z' },
    lastUpdated: '2025-07-17T10:30:00Z',
    address: 'Downtown Dubai, UAE',
    speed: 45,
    history: [
      { lat: 25.2769, lng: 55.2961, timestamp: '2025-07-17T09:30:00Z' },
      { lat: 25.2780, lng: 55.2970, timestamp: '2025-07-17T09:45:00Z' },
      { lat: 25.2790, lng: 55.2980, timestamp: '2025-07-17T10:00:00Z' },
      { lat: 25.2800, lng: 55.2990, timestamp: '2025-07-17T10:15:00Z' },
      { lat: 25.276987, lng: 55.296249, timestamp: '2025-07-17T10:30:00Z' }
    ]
  },
  {
    id: 'v-002',
    name: 'Service Van Beta',
    plate: 'DXB-002',
    status: 'alert',
    type: 'Van',
    location: { lat: 25.197197, lng: 55.274376, timestamp: '2025-07-17T10:28:00Z' },
    lastUpdated: '2025-07-17T10:28:00Z',
    address: 'Dubai Marina, UAE',
    speed: 0,
    history: [
      { lat: 25.1972, lng: 55.2744, timestamp: '2025-07-17T09:28:00Z' },
      { lat: 25.1980, lng: 55.2750, timestamp: '2025-07-17T09:43:00Z' },
      { lat: 25.1990, lng: 55.2760, timestamp: '2025-07-17T09:58:00Z' },
      { lat: 25.197197, lng: 55.274376, timestamp: '2025-07-17T10:28:00Z' }
    ]
  },
  {
    id: 'v-003',
    name: 'Executive Car Gamma',
    plate: 'DXB-003',
    status: 'online',
    type: 'Car',
    location: { lat: 25.118361, lng: 55.200273, timestamp: '2025-07-17T10:32:00Z' },
    lastUpdated: '2025-07-17T10:32:00Z',
    address: 'Jumeirah Beach Road, UAE',
    speed: 60,
    history: [
      { lat: 25.1184, lng: 55.2003, timestamp: '2025-07-17T09:32:00Z' },
      { lat: 25.1190, lng: 55.2010, timestamp: '2025-07-17T09:47:00Z' },
      { lat: 25.1200, lng: 55.2020, timestamp: '2025-07-17T10:02:00Z' },
      { lat: 25.1210, lng: 55.2030, timestamp: '2025-07-17T10:17:00Z' },
      { lat: 25.118361, lng: 55.200273, timestamp: '2025-07-17T10:32:00Z' }
    ]
  },
  {
    id: 'v-004',
    name: 'Courier Bike Delta',
    plate: 'DXB-004',
    status: 'offline',
    type: 'Motorcycle',
    location: { lat: 25.2048, lng: 55.2708, timestamp: '2025-07-17T09:45:00Z' },
    lastUpdated: '2025-07-17T09:45:00Z',
    address: 'Business Bay, UAE',
    speed: 0,
    history: [
      { lat: 25.2048, lng: 55.2708, timestamp: '2025-07-17T09:00:00Z' },
      { lat: 25.2055, lng: 55.2715, timestamp: '2025-07-17T09:15:00Z' },
      { lat: 25.2060, lng: 55.2720, timestamp: '2025-07-17T09:30:00Z' },
      { lat: 25.2048, lng: 55.2708, timestamp: '2025-07-17T09:45:00Z' }
    ]
  },
  {
    id: 'v-005',
    name: 'Logistics Truck Epsilon',
    plate: 'DXB-005',
    status: 'online',
    type: 'Truck',
    location: { lat: 25.0657, lng: 55.1713, timestamp: '2025-07-17T10:35:00Z' },
    lastUpdated: '2025-07-17T10:35:00Z',
    address: 'Al Barsha, UAE',
    speed: 35,
    history: [
      { lat: 25.0657, lng: 55.1713, timestamp: '2025-07-17T09:35:00Z' },
      { lat: 25.0670, lng: 55.1725, timestamp: '2025-07-17T09:50:00Z' },
      { lat: 25.0680, lng: 55.1735, timestamp: '2025-07-17T10:05:00Z' },
      { lat: 25.0690, lng: 55.1745, timestamp: '2025-07-17T10:20:00Z' },
      { lat: 25.0657, lng: 55.1713, timestamp: '2025-07-17T10:35:00Z' }
    ]
  },
  {
    id: 'v-006',
    name: 'Emergency Van Zeta',
    plate: 'DXB-006',
    status: 'alert',
    type: 'Van',
    location: { lat: 25.2285, lng: 55.3273, timestamp: '2025-07-17T10:33:00Z' },
    lastUpdated: '2025-07-17T10:33:00Z',
    address: 'Festival City, UAE',
    speed: 0,
    history: [
      { lat: 25.2285, lng: 55.3273, timestamp: '2025-07-17T09:33:00Z' },
      { lat: 25.2290, lng: 55.3280, timestamp: '2025-07-17T09:48:00Z' },
      { lat: 25.2295, lng: 55.3285, timestamp: '2025-07-17T10:03:00Z' },
      { lat: 25.2285, lng: 55.3273, timestamp: '2025-07-17T10:33:00Z' }
    ]
  }
];

// Function to simulate real-time updates
export const getUpdatedVehicleData = (): Vehicle[] => {
  return mockVehicles.map(vehicle => {
    // Only update online vehicles
    if (vehicle.status === 'online') {
      const lastLocation = vehicle.location;
      const variation = 0.001; // Small random movement
      
      return {
        ...vehicle,
        location: {
          lat: lastLocation.lat + (Math.random() - 0.5) * variation,
          lng: lastLocation.lng + (Math.random() - 0.5) * variation,
          timestamp: new Date().toISOString()
        },
        lastUpdated: new Date().toISOString(),
        speed: Math.max(0, vehicle.speed + (Math.random() - 0.5) * 20)
      };
    }
    return vehicle;
  });
};

export const getVehicleIcon = (status: Vehicle['status']) => {
  switch (status) {
    case 'online':
      return '🟢';
    case 'offline':
      return '⚪';
    case 'alert':
      return '🔴';
    default:
      return '⚪';
  }
};

export const getStatusColor = (status: Vehicle['status']) => {
  switch (status) {
    case 'online':
      return 'text-green-600';
    case 'offline':
      return 'text-gray-500';
    case 'alert':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};

export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const calculateDistance = (coords: VehicleLocation[]): number => {
  if (coords.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1];
    const curr = coords[i];
    
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (curr.lat - prev.lat) * Math.PI / 180;
    const dLng = (curr.lng - prev.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(prev.lat * Math.PI / 180) * Math.cos(curr.lat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    totalDistance += R * c;
  }
  
  return Math.round(totalDistance * 100) / 100; // Round to 2 decimal places
};

export const calculateAverageSpeed = (coords: VehicleLocation[]): number => {
  if (coords.length < 2) return 0;
  
  const totalDistance = calculateDistance(coords);
  const startTime = new Date(coords[0].timestamp);
  const endTime = new Date(coords[coords.length - 1].timestamp);
  const timeDiffHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  
  if (timeDiffHours === 0) return 0;
  return Math.round((totalDistance / timeDiffHours) * 100) / 100;
};
