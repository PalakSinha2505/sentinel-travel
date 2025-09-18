import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, MapPin, AlertTriangle, Camera, MessageCircle, FileText, CheckCircle } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="w-16 h-16" />
              <h1 className="text-5xl font-bold">TourGuard Guardian</h1>
            </div>
            <p className="text-xl opacity-90 mb-8">
              Smart Tourist Safety Monitoring & Incident Response System
            </p>
            <p className="text-lg opacity-75 mb-12 max-w-2xl mx-auto">
              A comprehensive safety platform designed for the Smart India Hackathon, 
              featuring real-time emergency response, tourist monitoring, and incident management 
              for tourism authorities and travelers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Users className="w-5 h-5 mr-2" />
                Try Tourist App
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Shield className="w-5 h-5 mr-2" />
                Admin Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete Safety Ecosystem</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Designed for the Smart India Hackathon with real-world applicability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Tourist Features */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Tourist Mobile App
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emergency" />
                  <span className="text-sm">Women SOS / Panic Button</span>
                </div>
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-accent" />
                  <span className="text-sm">Social Travel Feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Local Guides Q&A</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-warning" />
                  <span className="text-sm">Geo-fencing Safety Alerts</span>
                </div>
              </CardContent>
            </Card>

            {/* Admin Features */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Admin Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">Live Map Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-emergency" />
                  <span className="text-sm">Incident Management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm">Tourist Monitoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-success" />
                  <span className="text-sm">E-FIR Generation</span>
                </div>
              </CardContent>
            </Card>

            {/* IoT Features */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-security" />
                  IoT Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm">Smart Band Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <span className="text-sm">Automated SOS Triggers</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm">Real-time Location Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emergency" />
                  <span className="text-sm">Emergency Response Workflow</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-20 bg-muted/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Experience the Demo</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8 shadow-security">
              <div className="text-center space-y-4">
                <Users className="w-16 h-16 mx-auto text-primary" />
                <h3 className="text-xl font-bold">Tourist Experience</h3>
                <p className="text-muted-foreground">
                  Experience the complete tourist safety app with SOS functionality, 
                  social features, and safety alerts.
                </p>
                <Button className="w-full">
                  Launch Tourist Demo
                </Button>
              </div>
            </Card>

            <Card className="p-8 shadow-security">
              <div className="text-center space-y-4">
                <Shield className="w-16 h-16 mx-auto text-emergency" />
                <h3 className="text-xl font-bold">Admin Control Center</h3>
                <p className="text-muted-foreground">
                  Monitor tourists, manage incidents, and generate reports 
                  from the comprehensive admin dashboard.
                </p>
                <Button variant="emergency" className="w-full">
                  Access Admin Demo
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h3 className="text-xl font-bold">TourGuard Guardian</h3>
          </div>
          <p className="opacity-90 mb-4">
            Smart Tourist Safety Monitoring & Incident Response System
          </p>
          <div className="flex justify-center gap-8 text-sm opacity-75">
            <span>Built for Smart India Hackathon</span>
            <span>•</span>
            <span>Real-world Ready</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
