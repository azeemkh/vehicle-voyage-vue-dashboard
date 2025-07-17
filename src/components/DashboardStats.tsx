
import React from 'react';
import { Vehicle } from '@/data/mockVehicles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, Navigation, Users } from 'lucide-react';

interface DashboardStatsProps {
  vehicles: Vehicle[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ vehicles }) => {
  const onlineCount = vehicles.filter(v => v.status === 'online').length;
  const offlineCount = vehicles.filter(v => v.status === 'offline').length;
  const alertCount = vehicles.filter(v => v.status === 'alert').length;
  const totalCount = vehicles.length;
  
  const averageSpeed = vehicles
    .filter(v => v.status === 'online')
    .reduce((acc, v) => acc + v.speed, 0) / Math.max(onlineCount, 1);

  const stats = [
    {
      title: 'Total Vehicles',
      value: totalCount,
      icon: Users,
      description: 'Fleet size',
      trend: null
    },
    {
      title: 'Online Vehicles',
      value: onlineCount,
      icon: Activity,
      description: `${Math.round((onlineCount / totalCount) * 100)}% of fleet`,
      trend: 'up',
      color: 'text-green-600'
    },
    {
      title: 'Alerts',
      value: alertCount,
      icon: AlertTriangle,
      description: 'Requiring attention',
      trend: alertCount > 0 ? 'down' : null,
      color: alertCount > 0 ? 'text-red-600' : 'text-green-600'
    },
    {
      title: 'Avg Speed',
      value: `${Math.round(averageSpeed)} km/h`,
      icon: Navigation,
      description: 'Active vehicles',
      trend: null,
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-4 h-4 ${stat.color || 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
