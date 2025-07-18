import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Vehicle } from '@/data/mockVehicles';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Route, Gauge, Clock } from 'lucide-react';
import { calculateDistance, calculateAverageSpeed, formatTimeAgo } from '@/data/mockVehicles';
import VehicleMarker from './VehicleMarker';

interface VehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle;
  onVehicleSelect: (vehicle: Vehicle | undefined) => void;
}

const VehicleMap: React.FC<VehicleMapProps> = ({ 
  vehicles, 
  selectedVehicle, 
  onVehicleSelect 
}) => {
  const [selectedForHistory, setSelectedForHistory] = useState<Vehicle | undefined>(undefined);

  const handleViewHistory = (vehicle: Vehicle) => {
    setSelectedForHistory(vehicle);
  };

  const handleCloseHistory = () => {
    setSelectedForHistory(undefined);
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[25.2048, 55.2708]} // Dubai coordinates
        zoom={10}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {vehicles.map((vehicle) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            onViewHistory={handleViewHistory}
          />
        ))}
      </MapContainer>

      {/* Route History Overlay */}
      {selectedForHistory && (
        <Card className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto z-[1000] shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Route History</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseHistory}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-base mb-2">{selectedForHistory.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{selectedForHistory.plate}</Badge>
                  <Badge 
                    variant={selectedForHistory.status === 'online' ? 'default' : 
                            selectedForHistory.status === 'alert' ? 'destructive' : 'secondary'}
                  >
                    {selectedForHistory.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Route className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Distance</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {calculateDistance(selectedForHistory.history)} km
                  </p>
                </div>

                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Avg Speed</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {calculateAverageSpeed(selectedForHistory.history)} km/h
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Route Timeline
                </h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedForHistory.history.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
                    >
                      <div>
                        <span className="font-medium">
                          {index === 0 ? 'Start' : 
                           index === selectedForHistory.history.length - 1 ? 'Current' : 
                           `Stop ${index}`}
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimeAgo(point.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VehicleMap;