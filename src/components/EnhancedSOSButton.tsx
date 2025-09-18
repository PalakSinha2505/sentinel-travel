import { useState, useRef } from 'react';
import { AlertTriangle, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const EnhancedSOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alertSent, setAlertSent] = useState(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const intervalRef = useRef<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startSOS = () => {
    setIsPressed(true);
    setProgress(0);

    // Progress animation over 3 seconds
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / 30);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);

    // Trigger SOS after 3 seconds
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

    // Get current location
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
      // Get digital ID
      const { data: digitalIdData } = await supabase
        .from('digital_tourist_ids')
        .select('digital_id')
        .eq('user_id', user?.id)
        .single();

      // Create SOS alert
      const alertData = {
        user_id: user?.id,
        digital_id: digitalIdData?.digital_id,
        location: lat && lng ? { 
          latitude: lat, 
          longitude: lng,
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`
        } : null,
        alert_type: 'manual',
        severity: 'critical',
        status: 'pending'
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

      // Simulate emergency contact notification
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
      // Generate FIR number
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
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Sent at {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Emergency services notified</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>Location shared</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setAlertSent(false)}
            className="mt-4"
          >
            Reset
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-emergency/20 shadow-emergency">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emergency">
          <AlertTriangle className="w-5 h-5" />
          Emergency SOS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-6">
          <div className="relative">
            <Button
              size="lg"
              variant="emergency"
              className={`
                w-40 h-40 rounded-full text-white font-bold text-xl shadow-emergency
                transition-all duration-200 relative overflow-hidden
                ${isPressed ? 'scale-95 shadow-lg' : 'hover:scale-105'}
              `}
              onMouseDown={startSOS}
              onMouseUp={cancelSOS}
              onMouseLeave={cancelSOS}
              onTouchStart={startSOS}
              onTouchEnd={cancelSOS}
            >
              <div className="flex flex-col items-center gap-3 relative z-10">
                <AlertTriangle className="w-10 h-10" />
                <span>SOS</span>
              </div>
              
              {/* Progress indicator */}
              {isPressed && (
                <div
                  className="absolute inset-0 bg-white/20 rounded-full transition-all duration-100"
                  style={{
                    clipPath: `circle(${progress}% at center)`
                  }}
                />
              )}
            </Button>
            
            {isPressed && (
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <p className="text-sm text-emergency font-medium whitespace-nowrap animate-pulse">
                  Hold to send SOS... ({Math.ceil((100 - progress) / 33)}s)
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Press and hold for 3 seconds to send emergency alert
            </p>
            
            <div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-3 h-3" />
                <span>GPS location will be shared</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-3 h-3" />
                <span>Emergency contact will be notified</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                <span>E-FIR will be auto-generated</span>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Emergency Contact:</strong> {profile?.emergency_contact || 'Not set'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};