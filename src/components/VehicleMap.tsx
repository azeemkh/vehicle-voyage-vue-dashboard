import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Vehicle } from '@/data/mockVehicles';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MapPin, Clock, Route, Gauge, Settings } from 'lucide-react';
import { calculateDistance, calculateAverageSpeed, formatTimeAgo } from '@/data/mockVehicles';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isTokenSet, setIsTokenSet] = useState(false);

  // Initialize map when token is set
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set Mapbox access token
    mapboxgl.accessToken = mapboxToken;
    
    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [55.2708, 25.2048], // Dubai coordinates
        zoom: 10,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      setIsTokenSet(true);

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
    }
  }, [mapboxToken]);

  // Update markers when vehicles change
  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    vehicles.forEach(vehicle => {
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.style.cssText = `
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        background-color: ${
          vehicle.status === 'online' ? '#10b981' : 
          vehicle.status === 'alert' ? '#ef4444' : '#6b7280'
        };
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([vehicle.location.lng, vehicle.location.lat])
        .addTo(map.current!);

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${vehicle.name}</h3>
            <p class="text-sm text-gray-600">${vehicle.plate}</p>
            <p class="text-sm">Status: ${vehicle.status}</p>
            <p class="text-sm">Speed: ${vehicle.speed} km/h</p>
          </div>
        `);

      marker.setPopup(popup);

      // Handle marker click
      el.addEventListener('click', () => {
        onVehicleSelect(vehicle);
      });

      markers.current.push(marker);
    });
  }, [vehicles, isTokenSet, onVehicleSelect]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const token = formData.get('token') as string;
    setMapboxToken(token);
  };

  if (!isTokenSet) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-muted/20 rounded-lg">
        <Card className="w-96 p-6">
          <div className="text-center mb-4">
            <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Configure Mapbox</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to display the interactive map.
              Get your token from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <Input
              name="token"
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGJ..."
              required
            />
            <Button type="submit" className="w-full">
              Initialize Map
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />

      {/* Route History Overlay */}
      {selectedVehicle && (
        <Card className="absolute top-4 right-4 w-80 max-h-96 overflow-y-auto z-[1000] shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Vehicle Details</h3>
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