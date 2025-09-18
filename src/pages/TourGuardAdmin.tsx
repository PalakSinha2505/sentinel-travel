import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  FileText, 
  MapPin, 
  Clock, 
  Eye,
  CheckCircle,
  XCircle,
  BarChart3,
  Download,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminMap } from '@/components/AdminMap';

interface SOSAlert {
  id: string;
  user_id: string;
  digital_id: string;
  location: any;
  alert_type: string;
  status: string;
  severity: string;
  created_at: string;
  profiles: {
    name: string;
    nationality: string;
    phone: string;
    emergency_contact: string;
  };
}

interface Tourist {
  id: string;
  user_id: string;
  name: string;
  nationality: string;
  phone: string;
  emergency_contact: string;
  created_at: string;
  digital_tourist_ids: Array<{
    digital_id: string;
    status: string;
    expiry_date: string;
  }>;
}

interface EFIRReport {
  id: string;
  fir_number: string;
  incident_details: string;
  police_station: string;
  status: string;
  created_at: string;
  sos_alerts: {
    profiles: {
      name: string;
    };
    location: any;
    severity: string;
  };
}

const TourGuardAdmin = () => {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [tourists, setTourists] = useState<Tourist[]>([]);
  const [efirReports, setEfirReports] = useState<EFIRReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchSOSAlerts(),
        fetchTourists(),
        fetchEFIRReports()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSOSAlerts = async () => {
      const { data, error } = await supabase
        .from('sos_alerts')
        .select(`
          *,
          profiles!inner(name, nationality, phone, emergency_contact)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSosAlerts(data as any || []);
  };

  const fetchTourists = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          digital_tourist_ids!left(digital_id, status, expiry_date)
        `)
        .eq('role', 'tourist')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTourists(data as any || []);
  };

  const fetchEFIRReports = async () => {
      const { data, error } = await supabase
        .from('e_fir_reports')
        .select(`
          *,
          sos_alerts!inner(
            profiles!inner(name),
            location,
            severity
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEfirReports(data as any || []);
  };

  const updateSOSStatus = async (alertId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('sos_alerts')
        .update({ 
          status: newStatus,
          response_time: newStatus === 'in_progress' ? new Date().toISOString() : null,
          resolved_at: newStatus === 'resolved' ? new Date().toISOString() : null
        })
        .eq('id', alertId);

      if (error) throw error;

      await fetchSOSAlerts();
      toast({
        title: "Status Updated",
        description: `SOS alert marked as ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'destructive';
      case 'in_progress':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'medium':
        return 'default';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p>Loading admin dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-hero text-white border-0 shadow-security">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">TourGuard Admin Dashboard</h1>
              <p className="text-white/80 text-lg">Real-time Tourist Safety Monitoring</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tourists</p>
                <p className="text-3xl font-bold">{tourists.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-3xl font-bold text-emergency">
                  {sosAlerts.filter(alert => alert.status === 'pending').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-emergency" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">E-FIR Reports</p>
                <p className="text-3xl font-bold">{efirReports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-3xl font-bold text-success">98%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Live Tourist Safety Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AdminMap />
        </CardContent>
      </Card>
    </div>
  );

  const renderSOSAlerts = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            SOS Alerts Management ({sosAlerts.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {sosAlerts.map((alert) => (
        <Card key={alert.id} className={`border-l-4 ${
          alert.status === 'pending' ? 'border-l-red-500' :
          alert.status === 'in_progress' ? 'border-l-yellow-500' :
          'border-l-green-500'
        }`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{alert.profiles?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Digital ID: {alert.digital_id} • {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
                <Badge variant={getStatusColor(alert.status)}>
                  {alert.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Nationality:</strong> {alert.profiles?.nationality}</p>
                <p><strong>Phone:</strong> {alert.profiles?.phone}</p>
                <p><strong>Emergency Contact:</strong> {alert.profiles?.emergency_contact}</p>
              </div>
              <div>
                <p><strong>Alert Type:</strong> {alert.alert_type}</p>
                <p><strong>Location:</strong> {
                  alert.location ? 
                  `${alert.location.latitude?.toFixed(4)}, ${alert.location.longitude?.toFixed(4)}` :
                  'Location unavailable'
                }</p>
              </div>
            </div>

            {alert.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => updateSOSStatus(alert.id, 'in_progress')}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Respond
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateSOSStatus(alert.id, 'resolved')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Resolved
                </Button>
              </div>
            )}

            {alert.status === 'in_progress' && (
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => updateSOSStatus(alert.id, 'resolved')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Resolved
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => updateSOSStatus(alert.id, 'false_alarm')}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  False Alarm
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTourists = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Registered Tourists ({tourists.length})
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tourists.map((tourist) => (
          <Card key={tourist.id}>
            <CardHeader>
              <CardTitle className="text-lg">{tourist.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {tourist.nationality} • Registered {new Date(tourist.created_at).toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p><strong>Phone:</strong> {tourist.phone || 'Not provided'}</p>
                <p><strong>Emergency Contact:</strong> {tourist.emergency_contact}</p>
              </div>

              {tourist.digital_tourist_ids?.[0] && (
                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                  <p><strong>Digital ID:</strong> {tourist.digital_tourist_ids[0].digital_id}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span>Status:</span>
                    <Badge variant={tourist.digital_tourist_ids[0].status === 'active' ? 'default' : 'secondary'}>
                      {tourist.digital_tourist_ids[0].status}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEFIRReports = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            E-FIR Reports ({efirReports.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {efirReports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{report.fir_number}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {report.sos_alerts?.profiles?.name} • {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
              <Badge variant={report.status === 'filed' ? 'default' : 'secondary'}>
                {report.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Police Station:</strong> {report.police_station}</p>
                <p><strong>Severity:</strong> {report.sos_alerts?.severity?.toUpperCase()}</p>
              </div>
              <div>
                <p><strong>Location:</strong> {
                  report.sos_alerts?.location ? 
                  `${report.sos_alerts.location.latitude?.toFixed(4)}, ${report.sos_alerts.location.longitude?.toFixed(4)}` :
                  'Location unavailable'
                }</p>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Incident Details:</p>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {report.incident_details}
              </p>
            </div>

            <Button size="sm" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="sos-alerts">SOS Alerts</TabsTrigger>
            <TabsTrigger value="tourists">Tourists</TabsTrigger>
            <TabsTrigger value="e-fir">E-FIR Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">{renderDashboard()}</TabsContent>
          <TabsContent value="sos-alerts">{renderSOSAlerts()}</TabsContent>
          <TabsContent value="tourists">{renderTourists()}</TabsContent>
          <TabsContent value="e-fir">{renderEFIRReports()}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TourGuardAdmin;