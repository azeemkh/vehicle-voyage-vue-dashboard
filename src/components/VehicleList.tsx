
import React, { useState } from 'react';
import { Vehicle, formatTimeAgo, getStatusColor } from '@/data/mockVehicles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, Activity, Clock, Filter } from 'lucide-react';

interface VehicleListProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
  selectedVehicle?: Vehicle;
}

const VehicleList: React.FC<VehicleListProps> = ({ 
  vehicles, 
  onVehicleClick, 
  selectedVehicle 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Vehicle['status']) => {
    switch (status) {
      case 'online': return 'default';
      case 'offline': return 'secondary';
      case 'alert': return 'destructive';
      default: return 'secondary';
    }
  };

  const getVehicleTypeIcon = (type: Vehicle['type']) => {
    switch (type) {
      case 'Truck': return '🚛';
      case 'Van': return '🚐';
      case 'Car': return '🚗';
      case 'Motorcycle': return '🏍️';
      default: return '🚗';
    }
  };

  const statusCounts = {
    online: vehicles.filter(v => v.status === 'online').length,
    offline: vehicles.filter(v => v.status === 'offline').length,
    alert: vehicles.filter(v => v.status === 'alert').length
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Vehicle Fleet
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="default" className="bg-green-600">
              Online: {statusCounts.online}
            </Badge>
            <Badge variant="secondary">
              Offline: {statusCounts.offline}
            </Badge>
            <Badge variant="destructive">
              Alert: {statusCounts.alert}
            </Badge>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or plate number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow 
                  key={vehicle.id}
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedVehicle?.id === vehicle.id ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => onVehicleClick(vehicle)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.name}</div>
                      <div className="text-sm text-muted-foreground">{vehicle.plate}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getVehicleTypeIcon(vehicle.type)}</span>
                      <span className="text-sm">{vehicle.type}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(vehicle.status)} className="capitalize">
                      {vehicle.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="max-w-40">
                      <div className="text-sm truncate" title={vehicle.address}>
                        {vehicle.address}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {vehicle.location.lat.toFixed(4)}, {vehicle.location.lng.toFixed(4)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {vehicle.speed} km/h
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {formatTimeAgo(vehicle.lastUpdated)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onVehicleClick(vehicle);
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredVehicles.length === 0 && (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No vehicles found matching your criteria</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleList;
