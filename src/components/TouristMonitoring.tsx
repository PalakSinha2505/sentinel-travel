import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  MapPin, 
  Clock, 
  Phone, 
  Shield,
  Search,
  Eye,
  AlertTriangle
} from 'lucide-react';

const mockTourists = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0123',
    emergencyContact: '+1-555-0456',
    gender: 'Female',
    preferredLanguage: 'English',
    registrationDate: '2024-01-10',
    lastLocation: {
      address: 'Rue de Rivoli, Paris',
      timestamp: '2024-01-15 14:25:00',
      lat: 48.8566,
      lng: 2.3522
    },
    status: 'active',
    riskLevel: 'medium',
    incidentCount: 1
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1-555-0789',
    emergencyContact: '+86-138-0000-0000',
    gender: 'Male',
    preferredLanguage: 'English',
    registrationDate: '2024-01-12',
    lastLocation: {
      address: 'Montmartre District, Paris',
      timestamp: '2024-01-15 13:40:00',
      lat: 48.8848,
      lng: 2.3437
    },
    status: 'active',
    riskLevel: 'high',
    incidentCount: 2
  },
  {
    id: 3,
    name: 'Emma Wilson',
    email: 'emma.w@email.com',
    phone: '+44-20-0000-0000',
    emergencyContact: '+44-20-0000-0001',
    gender: 'Female',
    preferredLanguage: 'English',
    registrationDate: '2024-01-14',
    lastLocation: {
      address: 'Latin Quarter, Paris',
      timestamp: '2024-01-15 12:10:00',
      lat: 48.8534,
      lng: 2.3488
    },
    status: 'safe',
    riskLevel: 'low',
    incidentCount: 0
  },
  {
    id: 4,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-9876',
    emergencyContact: '+1-555-9877',
    gender: 'Male',
    preferredLanguage: 'English',
    registrationDate: '2024-01-13',
    lastLocation: {
      address: 'Champs-Élysées, Paris',
      timestamp: '2024-01-15 11:55:00',
      lat: 48.8606,
      lng: 2.3376
    },
    status: 'safe',
    riskLevel: 'low',
    incidentCount: 0
  },
  {
    id: 5,
    name: 'Lisa Brown',
    email: 'lisa.brown@email.com',
    phone: '+1-555-5432',
    emergencyContact: '+1-555-5433',
    gender: 'Female',
    preferredLanguage: 'English',
    registrationDate: '2024-01-11',
    lastLocation: {
      address: 'Trocadéro, Paris',
      timestamp: '2024-01-15 10:30:00',
      lat: 48.8738,
      lng: 2.2950
    },
    status: 'safe',
    riskLevel: 'low',
    incidentCount: 0
  }
];

export const TouristMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selectedTourist, setSelectedTourist] = useState<number | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Active Alert</Badge>;
      case 'safe':
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Safe</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="outline" className="bg-emergency/10 text-emergency border-emergency">High Risk</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted">Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredTourists = mockTourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tourist.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tourist.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || tourist.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const selectedTouristData = mockTourists.find(t => t.id === selectedTourist);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tourist Monitoring</h2>
        <div className="text-sm text-muted-foreground">
          Total Registered: {mockTourists.length}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tourists by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="active">Active Alert</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourists List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Registered Tourists ({filteredTourists.length})
          </h3>
          
          {filteredTourists.map((tourist) => (
            <Card 
              key={tourist.id}
              className={`cursor-pointer transition-all ${
                selectedTourist === tourist.id ? 'ring-2 ring-primary' : 'hover:shadow-soft'
              }`}
              onClick={() => setSelectedTourist(tourist.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{tourist.name}</h4>
                    <p className="text-sm text-muted-foreground">{tourist.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(tourist.status)}
                      {getRiskBadge(tourist.riskLevel)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {tourist.id}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{tourist.lastLocation.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Last seen: {new Date(tourist.lastLocation.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Incidents: {tourist.incidentCount}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3 mr-1" />
                    Track
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tourist Details */}
        <div>
          {selectedTouristData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{selectedTouristData.name}</span>
                  {getStatusBadge(selectedTouristData.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="font-medium mb-3">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="font-medium">Email</label>
                      <p className="text-muted-foreground">{selectedTouristData.email}</p>
                    </div>
                    <div>
                      <label className="font-medium">Phone</label>
                      <p className="text-muted-foreground">{selectedTouristData.phone}</p>
                    </div>
                    <div>
                      <label className="font-medium">Emergency Contact</label>
                      <p className="text-muted-foreground">{selectedTouristData.emergencyContact}</p>
                    </div>
                    <div>
                      <label className="font-medium">Gender</label>
                      <p className="text-muted-foreground">{selectedTouristData.gender}</p>
                    </div>
                    <div>
                      <label className="font-medium">Language</label>
                      <p className="text-muted-foreground">{selectedTouristData.preferredLanguage}</p>
                    </div>
                    <div>
                      <label className="font-medium">Registered</label>
                      <p className="text-muted-foreground">{selectedTouristData.registrationDate}</p>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                <div>
                  <h4 className="font-medium mb-3">Risk Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Risk Level</span>
                      {getRiskBadge(selectedTouristData.riskLevel)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Total Incidents</span>
                      <Badge variant="outline">{selectedTouristData.incidentCount}</Badge>
                    </div>
                  </div>
                </div>

                {/* Last Known Location */}
                <div>
                  <h4 className="font-medium mb-3">Last Known Location</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedTouristData.lastLocation.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{new Date(selectedTouristData.lastLocation.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button>
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Tourist
                  </Button>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Send Safety Alert
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Tourist</h3>
                <p className="text-muted-foreground">
                  Choose a tourist from the list to view their profile and monitoring data.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};