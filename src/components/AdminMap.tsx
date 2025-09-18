import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, AlertTriangle, Users } from 'lucide-react';

// Mock data for demonstration
const mockAlerts = [
  {
    id: 1,
    touristName: 'Sarah Johnson',
    latitude: 48.8566,
    longitude: 2.3522,
    status: 'pending',
    time: '2 minutes ago',
    type: 'manual_sos'
  },
  {
    id: 2,
    touristName: 'Mike Chen',
    latitude: 48.8848,
    longitude: 2.3437,
    status: 'in-progress',
    time: '15 minutes ago',
    type: 'iot_trigger'
  }
];

const mockTourists = [
  { id: 1, name: 'Emma Wilson', latitude: 48.8534, longitude: 2.3488, status: 'safe' },
  { id: 2, name: 'John Smith', latitude: 48.8606, longitude: 2.3376, status: 'safe' },
  { id: 3, name: 'Lisa Brown', latitude: 48.8738, longitude: 2.2950, status: 'safe' }
];

export const AdminMap = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);

  const initializeMap = async () => {
    if (!mapboxToken.trim()) {
      return;
    }

    try {
      // Dynamically import mapbox-gl to avoid SSR issues
      const mapboxgl = (await import('mapbox-gl')).default;
      await import('mapbox-gl/dist/mapbox-gl.css');

      if (!mapContainer.current) return;

      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [2.3522, 48.8566], // Paris center
        zoom: 12,
      });

      map.current.on('load', () => {
        // Add alert markers
        mockAlerts.forEach((alert) => {
          const marker = new mapboxgl.Marker({
            color: alert.status === 'pending' ? '#dc2626' : '#f59e0b'
          })
            .setLngLat([alert.longitude, alert.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-semibold">${alert.touristName}</h3>
                    <p class="text-sm">Status: ${alert.status}</p>
                    <p class="text-sm">Time: ${alert.time}</p>
                    <p class="text-sm">Type: ${alert.type}</p>
                  </div>
                `)
            )
            .addTo(map.current);
        });

        // Add tourist location markers
        mockTourists.forEach((tourist) => {
          const marker = new mapboxgl.Marker({
            color: '#22c55e'
          })
            .setLngLat([tourist.longitude, tourist.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div class="p-2">
                    <h3 class="font-semibold">${tourist.name}</h3>
                    <p class="text-sm">Status: ${tourist.status}</p>
                  </div>
                `)
            )
            .addTo(map.current);
        });
      });

      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <MapPin className="w-12 h-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">Mapbox Token Required</h3>
          <p className="text-muted-foreground">
            Enter your Mapbox public token to display the live incident map.
          </p>
          <div className="max-w-md mx-auto space-y-3">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={initializeMap} className="w-full">
              Initialize Map
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your token at{' '}
            <a
              href="https://mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emergency rounded-full"></div>
          <span>Pending Alerts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-warning rounded-full"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span>Safe Tourists</span>
        </div>
      </div>

      {/* Map Container */}
      <div
        ref={mapContainer}
        className="w-full h-96 rounded-lg border shadow-soft"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <AlertTriangle className="w-6 h-6 mx-auto text-emergency mb-2" />
            <p className="text-2xl font-bold text-emergency">{mockAlerts.length}</p>
            <p className="text-sm text-muted-foreground">Active Alerts</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto text-success mb-2" />
            <p className="text-2xl font-bold text-success">{mockTourists.length}</p>
            <p className="text-sm text-muted-foreground">Safe Tourists</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <MapPin className="w-6 h-6 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold text-primary">5</p>
            <p className="text-sm text-muted-foreground">Danger Zones</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <div className="w-6 h-6 mx-auto bg-warning rounded mb-2" />
            <p className="text-2xl font-bold text-warning">1</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </Card>
      </div>
    </div>
  );
};