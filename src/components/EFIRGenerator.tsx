import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Send, Clock, MapPin, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface EFIRReport {
  id: string;
  fir_number: string;
  incident_details: string;
  police_station: string;
  officer_assigned: string | null;
  status: string;
  created_at: string;
  blockchain_hash: string;
  sos_alert: {
    location: any;
    severity: string;
    created_at: string;
  };
}

export const EFIRGenerator = () => {
  const [reports, setReports] = useState<EFIRReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchEFIRReports();
    }
  }, [user]);

  const fetchEFIRReports = async () => {
    try {
      const { data, error } = await supabase
        .from('e_fir_reports')
        .select(`
          *,
          sos_alert:sos_alerts(location, severity, created_at)
        `)
        .eq('sos_alert.user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching E-FIR reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (report: EFIRReport) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 30;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ELECTRONIC FIRST INFORMATION REPORT (E-FIR)', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(14);
    pdf.text('TourGuard Guardian - Tourist Safety System', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // FIR Details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('FIR Details:', margin, yPosition);
    yPosition += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`FIR Number: ${report.fir_number}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Date & Time: ${new Date(report.created_at).toLocaleString()}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Police Station: ${report.police_station}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Status: ${report.status.toUpperCase()}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Blockchain Hash: ${report.blockchain_hash}`, margin, yPosition);
    yPosition += 15;

    // Tourist Details
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tourist Information:', margin, yPosition);
    yPosition += 10;

    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${profile?.name || 'N/A'}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Nationality: ${profile?.nationality || 'N/A'}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`KYC Document: ${profile?.kyc_document_number || 'N/A'}`, margin, yPosition);
    yPosition += 7;
    pdf.text(`Emergency Contact: ${profile?.emergency_contact || 'N/A'}`, margin, yPosition);
    yPosition += 15;

    // Incident Details
    pdf.setFont('helvetica', 'bold');
    pdf.text('Incident Details:', margin, yPosition);
    yPosition += 10;

    // Split incident details into multiple lines
    const splitText = pdf.splitTextToSize(report.incident_details, pageWidth - 2 * margin);
    pdf.setFont('helvetica', 'normal');
    pdf.text(splitText, margin, yPosition);
    yPosition += splitText.length * 7 + 15;

    // Location Information
    if (report.sos_alert?.location) {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Location Information:', margin, yPosition);
      yPosition += 10;

      pdf.setFont('helvetica', 'normal');
      pdf.text(`Coordinates: ${report.sos_alert.location.latitude}, ${report.sos_alert.location.longitude}`, margin, yPosition);
      yPosition += 7;
      if (report.sos_alert.location.address) {
        pdf.text(`Address: ${report.sos_alert.location.address}`, margin, yPosition);
        yPosition += 7;
      }
      yPosition += 10;
    }

    // Footer
    yPosition = pdf.internal.pageSize.getHeight() - 30;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('This is an auto-generated E-FIR from TourGuard Guardian system.', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 7;
    pdf.text('Document is secured with blockchain technology for authenticity.', pageWidth / 2, yPosition, { align: 'center' });

    // Save PDF
    pdf.save(`E-FIR_${report.fir_number}.pdf`);

    toast({
      title: "E-FIR Downloaded",
      description: `E-FIR ${report.fir_number} has been downloaded as PDF.`,
    });
  };

  const sendToPolice = async (reportId: string) => {
    try {
      // Simulate sending to police
      toast({
        title: "E-FIR Sent to Police",
        description: "E-FIR has been transmitted to the local police station.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send E-FIR to police.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading E-FIR reports...</div>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            E-FIR Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">📄</div>
            <p className="text-muted-foreground">
              No E-FIR reports found. E-FIRs are automatically generated when you trigger an SOS alert.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            E-FIR Reports ({reports.length})
          </CardTitle>
        </CardHeader>
      </Card>

      {reports.map((report) => (
        <Card key={report.id} className="border-l-4 border-l-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{report.fir_number}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generated: {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
              <Badge 
                variant={
                  report.status === 'filed' ? 'default' :
                  report.status === 'under_investigation' ? 'secondary' :
                  'outline'
                }
              >
                {report.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Alert: {new Date(report.sos_alert?.created_at).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  {report.sos_alert?.location ? 
                    `${report.sos_alert.location.latitude?.toFixed(4)}, ${report.sos_alert.location.longitude?.toFixed(4)}` :
                    'Location unavailable'
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Police Station: {report.police_station}</span>
              </div>
            </div>

            {/* Incident Preview */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <p className="text-sm font-medium mb-1">Incident Summary:</p>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {report.incident_details.substring(0, 200)}...
              </p>
            </div>

            {/* Blockchain Info */}
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Blockchain Hash:</span> 
              <span className="font-mono ml-2">{report.blockchain_hash.substring(0, 20)}...</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                onClick={() => generatePDF(report)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => sendToPolice(report.id)}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send to Police
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};