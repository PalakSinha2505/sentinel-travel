import { useState } from 'react';
import { QrReader } from 'react-qr-scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDigitalID } from '../context/DigitalIDContext'; // <-- import context

export const DigitalIDScanner = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { digitalID, setDigitalID } = useDigitalID(); // <-- use context

  const handleScan = async (data: string | null) => {
    if (data) {
      setLoading(true);

      try {
        // Fetch user digital ID from Supabase using scanned QR code
        const { data: userRecord, error } = await supabase
          .from('digital_tourist_ids')
          .select('*')
          .eq('digital_id', data)
          .single();

        if (error || !userRecord) {
          toast({
            title: "❌ Invalid QR",
            description: "No digital ID found for this QR code.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "✅ QR Scanned Successfully",
            description: `Digital ID: ${userRecord.digital_id}`,
          });
          setDigitalID(userRecord.digital_id); // <-- save to context
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to fetch digital ID from server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err: any) => {
    console.error('QR Scan Error:', err);
    toast({
      title: "Error",
      description: "Failed to scan QR code. Make sure camera permissions are allowed.",
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Digital ID QR</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!digitalID ? (
          <div className="w-full h-80 relative">
            <QrReader
              constraints={{ facingMode: 'environment' }}
              onResult={(result, error) => {
                if (!!result) handleScan(result.getText());
                if (!!error) handleError(error);
              }}
              containerStyle={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className="text-center space-y-2">
            <p className="text-sm">Scanned Digital ID:</p>
            <p className="font-mono text-lg">{digitalID}</p>
            <Button onClick={() => setDigitalID(null)}>Scan Again</Button>
          </div>
        )}

        {loading && <p className="text-sm text-muted-foreground">Fetching digital ID...</p>}
      </CardContent>
    </Card>
  );
};
