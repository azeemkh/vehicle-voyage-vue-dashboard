
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { LatLngBounds } from 'leaflet';
import { Vehicle } from '@/data/mockVehicles';
import VehicleMarker from './VehicleMarker';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, MapPin, Clock, Route, Gauge } from 'lucide-react';
import { calculateDistance, calculateAverageSpeed, formatTimeAgo } from '@/data/mockVehicles';
import 'leaflet/dist/leaflet.css';

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
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);

  useEffect(() => {
    if (vehicles.length > 0) {
      const bounds = new LatLngBounds(
        vehicles.map(vehicle => [vehicle.location.lat, vehicle.location.lng])
      );
      setMapBounds(bounds);
    }
  }, [vehicles]);

  const handleViewHistory = (vehicle: Vehicle) => {
    onVehicleSelect(vehicle);
  };

  const getRouteColor = () => '#3b82f6';

  const routePositions = selectedVehicle?.history.map(point => [point.lat, point.lng]) as [number, number][];

  return (
    <div className="relative h-full w-full">
      {mapBounds ? (
        <MapContainer
          bounds={mapBounds}
          className="h-full w-full rounded-lg"
          zoomControl={true}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Vehicle markers */}
          {vehicles.map(vehicle => (
            <VehicleMarker
              key={vehicle.id}
              vehicle={vehicle}
              onViewHistory={handleViewHistory}
            />
          ))}

          {/* Route history polyline */}
          {selectedVehicle && routePositions.length > 1 && (
            <Polyline
              positions={routePositions}
              color={getRouteColor()}
              weight={4}
              opacity={0.8}
            />
          )}
        </MapContainer>
      ) : (
        <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center map-skeleton">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Route History Overlay */}
      {selectedVehicle && (
        <Card className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto z-[1000] shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Route History</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVehicleSelect(undefined)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-base mb-2">{selectedVehicle.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{selectedVehicle.plate}</Badge>
                  <Badge 
                    variant={selectedVehicle.status === 'online' ? 'default' : 
                            selectedVehicle.status === 'alert' ? 'destructive' : 'secondary'}
                  >
                    {selectedVehicle.status}
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
                    {calculateDistance(selectedVehicle.history)} km
                  </p>
                </div>

                <div className="bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Avg Speed</span>
                  </div>
                  <p className="text-lg font-semibold">
                    {calculateAverageSpeed(selectedVehicle.history)} km/h
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Route Timeline
                </h5>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedVehicle.history.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
                    >
                      <div>
                        <span className="font-medium">
                          {index === 0 ? 'Start' : 
                           index === selectedVehicle.history.length - 1 ? 'Current' : 
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
