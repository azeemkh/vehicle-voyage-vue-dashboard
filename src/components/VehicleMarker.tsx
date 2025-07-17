
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import { Vehicle, formatTimeAgo } from '@/data/mockVehicles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Activity, Eye } from 'lucide-react';

interface VehicleMarkerProps {
  vehicle: Vehicle;
  onViewHistory: (vehicle: Vehicle) => void;
}

const VehicleMarker: React.FC<VehicleMarkerProps> = ({ vehicle, onViewHistory }) => {
  const getMarkerIcon = () => {
    const getColor = () => {
      switch (vehicle.status) {
        case 'online': return '#22c55e';
        case 'offline': return '#9ca3af';
        case 'alert': return '#ef4444';
        default: return '#9ca3af';
      }
    };

    const color = getColor();
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        position: relative;
      ">
        🚛
        ${vehicle.status === 'online' ? `
          <div style="
            position: absolute;
            top: -50%;
            left: -50%;
            right: -50%;
            bottom: -50%;
            border-radius: 50%;
            background-color: ${color};
            opacity: 0.3;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          "></div>
        ` : ''}
      </div>
    `;

    return divIcon({
      html: iconHtml,
      className: 'vehicle-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const getStatusBadgeVariant = () => {
    switch (vehicle.status) {
      case 'online': return 'default';
      case 'offline': return 'secondary';
      case 'alert': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Marker 
      position={[vehicle.location.lat, vehicle.location.lng]} 
      icon={getMarkerIcon()}
    >
      <Popup className="vehicle-popup" minWidth={280}>
        <div className="p-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">{vehicle.name}</h3>
            <Badge variant={getStatusBadgeVariant()} className="capitalize">
              {vehicle.status}
            </Badge>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{vehicle.plate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span>{vehicle.type}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>Updated {formatTimeAgo(vehicle.lastUpdated)}</span>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-md mb-3">
            <p className="text-sm text-muted-foreground mb-1">Current Location</p>
            <p className="text-sm font-medium">{vehicle.address}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Speed: {vehicle.speed} km/h</span>
              <span>Lat: {vehicle.location.lat.toFixed(6)}</span>
              <span>Lng: {vehicle.location.lng.toFixed(6)}</span>
            </div>
          </div>

          <Button 
            onClick={() => onViewHistory(vehicle)}
            className="w-full"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Route History
          </Button>
        </div>
      </Popup>
    </Marker>
  );
};

export default VehicleMarker;
