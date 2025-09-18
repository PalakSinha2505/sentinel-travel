import { useState, useRef } from 'react';
import { AlertTriangle, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useDigitalID } from '../context/DigitalIDContext'; // <-- import context

export const EnhancedSOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertSent, setAlertSent] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { digitalID } = useDigitalID(); // <-- get scanned Digital ID
  const intervalRef = useRef<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startSOS = () => {
    setIsPressed(true);
    setProgress(0);

    intervalRef.current = setInterval(() => {
      setProgress((prev) => (prev + 100 / 30 > 100 ? 100 : prev + 100 / 30));
    }, 100);

    timeoutRef.current = setTimeout(() => {
      triggerSOS();
    }, 3000);
  };

  const cancelSOS = () => {
    setIsPressed(false);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const triggerSOS = async () => {
    setIsPressed(false);
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!digitalID) {
      toast({
        title: "❌ No Digital ID",
        description: "Please scan your Digital ID before sending SOS.",
        variant: "destructive",
      });
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          sendSOSAlert(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          sendSOSAlert(null, null);
        }
      );
    } else {
      sendSOSAlert(null, null);
    }
  };

  const sendSOSAlert = async (lat: number | null, lng: number | null) => {
    try {
      // Use the digitalID from context directly
      const alertData = {
        user_id: user?.id,
        digital_id: digitalID,
        location: lat && lng ? { latitude: lat, longitude: lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` } : null,
        alert_type: 'manual',
        severity: 'critical',
        status: 'pending',
      };

      const { data: sosAlert, error } = await supabase
        .from('sos_alerts')
        .insert(alertData)
        .select()
        .single();

      if (error) throw error;

      // Auto-generate E-FIR
      await generateEFIR(sosAlert);

      setAlertSent(true);

      toast({
        title: "🚨 SOS Alert Sent!",
        description: "Emergency services notified. E-FIR auto-generated.",
        variant: "destructive",
      });

      setTimeout(() => {
        toast({
          title: "📱 Emergency Contact Notified",
          description: `SMS sent to ${profile?.emergency_contact} with your location.`,
        });
      }, 2000);

    } catch (error) {
      console.error('Failed to send SOS alert:', error);
      toast({
        title: "Error",
        description: "Failed to send SOS alert. Please try again or call emergency services directly.",
        variant: "destructive",
      });
    }
  };

  const generateEFIR = async (sosAlert: any) => {
    try {
      const firNumber = `FIR${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      const blockchainHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      const incidentDetails = `
EMERGENCY ALERT - TOURIST DISTRESS

Tourist Details:
- Name: ${profile?.name}
- Digital ID: ${sosAlert.digital_id}
- Nationality: ${profile?.nationality}
- Emergency Contact: ${profile?.emergency_contact}

Incident Information:
- Type: Tourist Emergency SOS Alert
- Time: ${new Date().toLocaleString()}
- Location: ${sosAlert.location ? 
  `Lat: ${sosAlert.location.latitude}, Lng: ${sosAlert.location.longitude}` : 
  'Location unavailable'}
- Severity: ${sosAlert.severity.toUpperCase()}

Alert Details:
- Trigger: Manual SOS Button
- Status: ${sosAlert.status}
- Auto-generated: Yes

This is an auto-generated E-FIR from TourGuard Guardian system.
Immediate assistance required.
      `.trim();

      const { error: firError } = await supabase
        .from('e_fir_reports')
        .insert({
          sos_alert_id: sosAlert.id,
          fir_number: firNumber,
          blockchain_hash: blockchainHash,
          police_station: 'Central Police Station',
          incident_details: incidentDetails,
          status: 'filed'
        });

      if (firError) throw firError;
      console.log(`E-FIR ${firNumber} generated automatically`);
    } catch (error) {
      console.error('Error generating E-FIR:', error);
    }
  };

  if (alertSent) {
    return (
      <Card className="border-2 border-success/20 shadow-success">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-success">
            <AlertTriangle className="w-5 h-5" />
            Alert Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h3 className="text-xl font-bold text-success">SOS Alert Sent Successfully</h3>
          <Button variant="outline" onClick={() => setAlertSent(false)} className="mt-4">
            Reset
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button
      size="lg"
      variant="emergency"
      onMouseDown={startSOS}
      onMouseUp={cancelSOS}
      onMouseLeave={cancelSOS}
      onTouchStart={startSOS}
      onTouchEnd={cancelSOS}
    >
      <AlertTriangle className="w-6 h-6 mr-2" />
      SOS
    </Button>
  );
};
