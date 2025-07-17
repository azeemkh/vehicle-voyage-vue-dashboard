import React from 'react';
import { Vehicle } from '@/data/mockVehicles';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Route, Gauge, Eye } from 'lucide-react';
import { calculateDistance, calculateAverageSpeed, formatTimeAgo } from '@/data/mockVehicles';

interface SimpleVehicleMapProps {
  vehicles: Vehicle[];
  selectedVehicle?: Vehicle;
  onVehicleSelect: (vehicle: Vehicle | undefined) => void;
}

const SimpleVehicleMap: React.FC<SimpleVehicleMapProps> = ({ 
  vehicles, 
  selectedVehicle, 
  onVehicleSelect 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'alert': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="relative h-full w-full bg-muted/20 rounded-lg overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="h-full w-full relative">
          {/* Grid pattern to simulate map */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
          
          {/* Vehicle markers */}
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${20 + (index % 5) * 15}%`,
                top: `${20 + Math.floor(index / 5) * 20}%`,
              }}
              onClick={() => onVehicleSelect(vehicle)}
            >
              {/* Vehicle marker */}
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${getStatusColor(vehicle.status)} group-hover:scale-125 transition-transform`}>
                {vehicle.status === 'online' && (
                  <div className={`absolute inset-0 rounded-full ${getStatusColor(vehicle.status)} animate-ping opacity-30`} />
                )}
              </div>
              
              {/* Vehicle info on hover */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-background border rounded-lg shadow-lg p-2 min-w-32 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="text-xs font-medium">{vehicle.name}</div>
                <div className="text-xs text-muted-foreground">{vehicle.plate}</div>
                <Badge variant={vehicle.status === 'online' ? 'default' : 'secondary'} className="text-xs">
                  {vehicle.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {/* Route line for selected vehicle */}
          {selectedVehicle && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 20% 20% Q 40% 60% 60% 40% T 80% 80%"
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          )}
        </div>
        
        {/* Map watermark */}
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
          Simplified Map View
        </div>
      </div>

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
                ×
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

export default SimpleVehicleMap;