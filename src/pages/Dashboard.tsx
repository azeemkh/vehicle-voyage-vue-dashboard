
import React, { useState, useEffect } from 'react';
import { mockVehicles, getUpdatedVehicleData, Vehicle } from '@/data/mockVehicles';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SimpleVehicleMap from '@/components/SimpleVehicleMap';
import VehicleList from '@/components/VehicleList';
import DashboardStats from '@/components/DashboardStats';
import { Map, List, BarChart3, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  // Real-time simulation
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      const updatedVehicles = getUpdatedVehicleData();
      setVehicles(updatedVehicles);
      setLastUpdate(new Date());
      
      // Update selected vehicle if it exists
      if (selectedVehicle) {
        const updatedSelected = updatedVehicles.find(v => v.id === selectedVehicle.id);
        if (updatedSelected) {
          setSelectedVehicle(updatedSelected);
        }
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isRealTimeEnabled, selectedVehicle]);

  const handleVehicleSelect = (vehicle: Vehicle | undefined) => {
    setSelectedVehicle(vehicle);
    if (vehicle) {
      toast({
        title: 'Vehicle Selected',
        description: `Now viewing ${vehicle.name} (${vehicle.plate})`,
      });
    }
  };

  const handleRefresh = () => {
    const updatedVehicles = getUpdatedVehicleData();
    setVehicles(updatedVehicles);
    setLastUpdate(new Date());
    toast({
      title: 'Data Refreshed',
      description: 'Vehicle data has been updated',
    });
  };

  const toggleRealTime = () => {
    setIsRealTimeEnabled(!isRealTimeEnabled);
    toast({
      title: isRealTimeEnabled ? 'Real-time Disabled' : 'Real-time Enabled',
      description: isRealTimeEnabled 
        ? 'Vehicle updates are now paused' 
        : 'Vehicle data will update automatically',
    });
  };

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Tracking Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of your vehicle fleet
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRealTime}
            className={isRealTimeEnabled ? 'text-green-600' : 'text-gray-500'}
          >
            {isRealTimeEnabled ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            {isRealTimeEnabled ? 'Live' : 'Paused'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats vehicles={vehicles} />

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <Tabs defaultValue="map" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Vehicle List
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-4">
            <TabsContent value="map" className="h-full m-0">
              <Card className="h-full">
                <SimpleVehicleMap
                  vehicles={vehicles}
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={handleVehicleSelect}
                />
              </Card>
            </TabsContent>

            <TabsContent value="list" className="h-full m-0">
              <VehicleList
                vehicles={vehicles}
                onVehicleClick={handleVehicleSelect}
                selectedVehicle={selectedVehicle}
              />
            </TabsContent>

            <TabsContent value="analytics" className="h-full m-0">
              <Card className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
                    <p className="text-muted-foreground">
                      Advanced analytics and reporting features coming soon
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
