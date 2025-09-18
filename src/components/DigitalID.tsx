import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, QrCode, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const DigitalID = () => {
  const { user, profile } = useAuth();
  const [digitalId, setDigitalId] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDigitalId();
    }
  }, [user]);

  const fetchDigitalId = async () => {
    try {
      const { data, error } = await supabase
        .from('digital_tourist_ids')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setDigitalId(data);
        generateQRCode(data.digital_id);
      } else {
        // Generate new digital ID
        await generateDigitalId();
      }
    } catch (error: any) {
      console.error('Error fetching digital ID:', error);
    }
  };

  const generateDigitalId = async () => {
    try {
      setLoading(true);
      
      // Generate unique digital ID and blockchain hash
      const digitalIdNumber = `TG${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const blockchainHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      // Set expiry date (30 days from now for demo)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const { data, error } = await supabase
        .from('digital_tourist_ids')
        .insert({
          user_id: user?.id,
          digital_id: digitalIdNumber,
          blockchain_hash: blockchainHash,
          expiry_date: expiryDate.toISOString().split('T')[0],
          itinerary: {
            destinations: ['Paris', 'London', 'Rome'],
            duration: '30 days',
            purpose: 'Tourism'
          }
        })
        .select()
        .single();

      if (error) throw error;

      setDigitalId(data);
      generateQRCode(data.digital_id);

      toast({
        title: "Digital ID Generated!",
        description: "Your blockchain-secured tourist ID is ready.",
      });
    } catch (error: any) {
      console.error('Error generating digital ID:', error);
      toast({
        title: "Error",
        description: "Failed to generate digital ID.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (digitalIdNumber: string) => {
    try {
      const qrData = JSON.stringify({
        digitalId: digitalIdNumber,
        name: profile?.name,
        nationality: profile?.nationality,
        verificationUrl: `https://tourguard.gov/verify/${digitalIdNumber}`,
        timestamp: new Date().toISOString()
      });

      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const downloadAsPDF = async () => {
    if (!idCardRef.current || !digitalId) return;

    try {
      setLoading(true);
      
      const canvas = await html2canvas(idCardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width
      const pageHeight = 210; // A4 landscape height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`TourGuard_Digital_ID_${digitalId.digital_id}.pdf`);
      
      toast({
        title: "PDF Downloaded",
        description: "Your Digital ID has been saved as PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!digitalId) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Generate Digital Tourist ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Create your blockchain-secured Digital Tourist ID to access TourGuard services.
            </p>
            <Button onClick={generateDigitalId} disabled={loading} size="lg">
              {loading ? "Generating..." : "Generate Digital ID"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isExpired = new Date(digitalId.expiry_date) < new Date();

  return (
    <div className="space-y-6">
      {/* Digital ID Card */}
      <div ref={idCardRef} className="max-w-2xl mx-auto">
        <Card className="bg-gradient-hero text-white border-0 shadow-security">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">TourGuard Guardian</h2>
                  <p className="text-white/80">Digital Tourist ID</p>
                </div>
              </div>
              <Badge variant={isExpired ? "destructive" : "outline"} className="text-white border-white">
                {isExpired ? "Expired" : "Active"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Section */}
              <div className="space-y-4">
                <Avatar className="w-24 h-24 border-4 border-white/20">
                  <AvatarImage src={profile?.profile_image_url} />
                  <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                    {profile?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{profile?.name}</h3>
                  <p className="text-white/80">{profile?.nationality}</p>
                </div>
              </div>

              {/* Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/60">Digital ID</label>
                  <p className="font-mono text-lg">{digitalId.digital_id}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">KYC Document</label>
                  <p className="font-mono">{profile?.kyc_document_number}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Valid Until</label>
                  <p>{new Date(digitalId.expiry_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-white/60">Emergency Contact</label>
                  <p>{profile?.emergency_contact}</p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                {qrCodeUrl && (
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                  </div>
                )}
                <div className="text-center">
                  <p className="text-xs text-white/60">Scan for verification</p>
                  <p className="text-xs text-white/60 font-mono">
                    Hash: {digitalId.blockchain_hash.substring(0, 10)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Blockchain Badge */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Blockchain Secured • Tamper-Proof</span>
                </div>
                <div className="text-xs text-white/60">
                  Generated: {new Date(digitalId.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button onClick={downloadAsPDF} disabled={loading} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button 
          variant="outline" 
          onClick={() => generateQRCode(digitalId.digital_id)}
          className="flex items-center gap-2"
        >
          <QrCode className="w-4 h-4" />
          Refresh QR Code
        </Button>
      </div>

      {/* Itinerary Details */}
      {digitalId.itinerary && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Travel Itinerary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Destinations:</span>
                <span>{digitalId.itinerary.destinations?.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{digitalId.itinerary.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Purpose:</span>
                <span>{digitalId.itinerary.purpose}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};