import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';

const mockIncidents = [
  {
    id: 1,
    touristName: 'Sarah Johnson',
    touristPhone: '+1-555-0123',
    emergencyContact: '+1-555-0456',
    location: { address: 'Rue de Rivoli, Paris', lat: 48.8566, lng: 2.3522 },
    timestamp: '2024-01-15 14:30:00',
    status: 'pending',
    priority: 'high',
    type: 'manual_sos',
    description: 'Tourist activated panic button - no additional details',
    assignedOfficer: null,
    notes: []
  },
  {
    id: 2,
    touristName: 'Mike Chen',
    touristPhone: '+1-555-0789',
    emergencyContact: '+86-138-0000-0000',
    location: { address: 'Montmartre District', lat: 48.8848, lng: 2.3437 },
    timestamp: '2024-01-15 13:45:00',
    status: 'in-progress',
    priority: 'medium',
    type: 'iot_trigger',
    description: 'IoT device triggered - possible fall or distress',
    assignedOfficer: 'Officer Martin',
    notes: [
      { time: '13:50', officer: 'Officer Martin', note: 'Contacted tourist - confirmed assistance needed' },
      { time: '14:00', officer: 'Officer Martin', note: 'En route to location' }
    ]
  },
  {
    id: 3,
    touristName: 'Emma Wilson',
    touristPhone: '+44-20-0000-0000',
    emergencyContact: '+44-20-0000-0001',
    location: { address: 'Latin Quarter', lat: 48.8534, lng: 2.3488 },
    timestamp: '2024-01-15 12:15:00',
    status: 'resolved',
    priority: 'low',
    type: 'manual_sos',
    description: 'False alarm - accidentally triggered',
    assignedOfficer: 'Officer Dubois',
    notes: [
      { time: '12:20', officer: 'Officer Dubois', note: 'Contacted tourist - false alarm confirmed' },
      { time: '12:25', officer: 'Officer Dubois', note: 'Case closed - no action required' }
    ]
  }
];

export const IncidentManagement = () => {
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [newNote, setNewNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="bg-emergency/10 text-emergency border-emergency">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const filteredIncidents = mockIncidents.filter(incident => 
    statusFilter === 'all' || incident.status === statusFilter
  );

  const selectedIncidentData = mockIncidents.find(inc => inc.id === selectedIncident);

  const handleStatusUpdate = (incidentId: number, newStatus: string) => {
    console.log(`Updating incident ${incidentId} status to ${newStatus}`);
    // Mock status update
  };

  const handleAddNote = () => {
    if (newNote.trim() && selectedIncident) {
      console.log(`Adding note to incident ${selectedIncident}: ${newNote}`);
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Incident Management</h2>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incidents List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Incidents</h3>
          {filteredIncidents.map((incident) => (
            <Card 
              key={incident.id}
              className={`cursor-pointer transition-all ${
                selectedIncident === incident.id ? 'ring-2 ring-primary' : 'hover:shadow-soft'
              }`}
              onClick={() => setSelectedIncident(incident.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{incident.touristName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(incident.status)}
                      {getPriorityBadge(incident.priority)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ID: {incident.id}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{incident.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(incident.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{incident.type.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>

                {incident.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(incident.id, 'in-progress');
                      }}
                    >
                      Assign & Respond
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Incident Details */}
        <div>
          {selectedIncidentData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Incident #{selectedIncidentData.id}</span>
                  {getStatusBadge(selectedIncidentData.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tourist Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tourist Name</label>
                    <p className="text-muted-foreground">{selectedIncidentData.touristName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-muted-foreground">{selectedIncidentData.touristPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Emergency Contact</label>
                    <p className="text-muted-foreground">{selectedIncidentData.emergencyContact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <div className="mt-1">{getPriorityBadge(selectedIncidentData.priority)}</div>
                  </div>
                </div>

                {/* Incident Details */}
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-muted-foreground">{selectedIncidentData.description}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-muted-foreground">{selectedIncidentData.location.address}</p>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                  {selectedIncidentData.status === 'pending' && (
                    <Button onClick={() => handleStatusUpdate(selectedIncidentData.id, 'in-progress')}>
                      Start Investigation
                    </Button>
                  )}
                  {selectedIncidentData.status === 'in-progress' && (
                    <Button 
                      variant="success"
                      onClick={() => handleStatusUpdate(selectedIncidentData.id, 'resolved')}
                    >
                      Mark Resolved
                    </Button>
                  )}
                  <Button variant="outline">
                    Generate Report
                  </Button>
                </div>

                {/* Notes Section */}
                <div>
                  <h4 className="font-medium mb-3">Investigation Notes</h4>
                  <div className="space-y-2 mb-4">
                    {selectedIncidentData.notes.map((note, index) => (
                      <div key={index} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span>{note.time}</span>
                          <span>•</span>
                          <span>{note.officer}</span>
                        </div>
                        <p className="text-sm">{note.note}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Add investigation note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an Incident</h3>
                <p className="text-muted-foreground">
                  Choose an incident from the list to view details and manage the case.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};