import { useState, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const SOSButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startSOS = () => {
    setIsPressed(true);
    setProgress(0);

    // Progress animation over 3 seconds
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / 30); // 30 steps over 3 seconds (100ms each)
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
      // Mock SOS alert - in real app, this would send to backend
      const alertData = {
        userId: 'user-123',
        timestamp: new Date().toISOString(),
        location: lat && lng ? { latitude: lat, longitude: lng } : null,
        type: 'manual_sos',
        status: 'pending'
      };

      console.log('SOS Alert Triggered:', alertData);

      toast({
        title: "🚨 SOS Alert Sent!",
        description: "Emergency services have been notified. Help is on the way.",
        variant: "destructive",
      });

      // Simulate emergency contact notification
      setTimeout(() => {
        toast({
          title: "📱 Emergency Contact Notified",
          description: "Your emergency contact has been sent an SMS with your location.",
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

  return (
    <div className="relative">
      <Button
        size="lg"
        variant="emergency"
        className={`
          w-32 h-32 rounded-full text-white font-bold text-lg shadow-emergency
          transition-all duration-200 relative overflow-hidden
          ${isPressed ? 'scale-95 shadow-lg' : 'hover:scale-105'}
        `}
        onMouseDown={startSOS}
        onMouseUp={cancelSOS}
        onMouseLeave={cancelSOS}
        onTouchStart={startSOS}
        onTouchEnd={cancelSOS}
      >
        <div className="flex flex-col items-center gap-2 relative z-10">
          <AlertTriangle className="w-8 h-8" />
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
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-emergency font-medium whitespace-nowrap">
            Hold to send SOS...
          </p>
        </div>
      )}
    </div>
  );
};