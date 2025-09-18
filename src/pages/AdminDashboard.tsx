import { useState } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Users, 
  FileText, 
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminMap } from '@/components/AdminMap';
import { IncidentManagement } from '@/components/IncidentManagement';
import { TouristMonitoring } from '@/components/TouristMonitoring';
import { ReportsSection } from '@/components/ReportsSection';

interface AdminDashboardProps {
  user: any;
  onLogout: () => void;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats] = useState({
    activeAlerts: 3,
    totalTourists: 1247,
    resolvedToday: 12,
    dangerZones: 5
  });

  const [recentAlerts] = useState([
    {
      id: 1,
      touristName: 'Sarah Johnson',
      location: 'Rue de Rivoli, Paris',
      time: '2 minutes ago',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 2,
      touristName: 'Mike Chen',
      location: 'Montmartre District',
      time: '15 minutes ago',
      status: 'in-progress',
      priority: 'medium'
    },
    {
      id: 3,
      touristName: 'Emma Wilson',
      location: 'Latin Quarter',
      time: '1 hour ago',
      status: 'resolved',
      priority: 'low'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-emergency/10 text-emergency border-emergency">Pending</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'incidents':
        return <IncidentManagement />;
      case 'tourists':
        return <TouristMonitoring />;
      case 'reports':
        return <ReportsSection />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                      <p className="text-3xl font-bold text-emergency">{stats.activeAlerts}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-emergency" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tourists</p>
                      <p className="text-3xl font-bold text-primary">{stats.totalTourists}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                      <p className="text-3xl font-bold text-success">{stats.resolvedToday}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Danger Zones</p>
                      <p className="text-3xl font-bold text-warning">{stats.dangerZones}</p>
                    </div>
                    <Shield className="w-8 h-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Live Incident Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdminMap />
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.touristName}</h4>
                          {getStatusBadge(alert.status)}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {alert.status === 'pending' && (
                          <Button size="sm" variant="emergency">
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-security text-white p-6 shadow-security">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">TourGuard Guardian</h1>
            <p className="opacity-90">Admin Control Center</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onLogout}
            className="text-white hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b bg-white">
        <div className="flex overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Shield },
            { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
            { id: 'tourists', label: 'Tourists', icon: Users },
            { id: 'reports', label: 'Reports', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;