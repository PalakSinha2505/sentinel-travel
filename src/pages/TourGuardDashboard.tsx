import { useState } from 'react';
import { Shield, CreditCard, AlertTriangle, FileText, MapPin, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { DigitalID } from '@/components/DigitalID';
import { EnhancedSOSButton } from '@/components/EnhancedSOSButton';
import { EFIRGenerator } from '@/components/EFIRGenerator';
import { TravelFeed } from '@/components/TravelFeed';
import { LocalGuideQA } from '@/components/LocalGuideQA';
import { RecommendationsSection } from '@/components/RecommendationsSection';

const TourGuardDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'digital-id':
        return <DigitalID />;
      case 'sos':
        return (
          <div className="max-w-2xl mx-auto">
            <EnhancedSOSButton />
          </div>
        );
      case 'e-fir':
        return <EFIRGenerator />;
      case 'travel':
        return <TravelFeed />;
      case 'qa':
        return <LocalGuideQA />;
      case 'profile':
        return (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-muted-foreground">{profile?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Nationality</label>
                  <p className="text-muted-foreground">{profile?.nationality || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-muted-foreground">{profile?.phone || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Emergency Contact</label>
                  <p className="text-muted-foreground">{profile?.emergency_contact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">KYC Document</label>
                  <p className="text-muted-foreground">{profile?.kyc_document_number || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-muted-foreground capitalize">{profile?.role}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Hero Section */}
            <Card className="bg-gradient-hero text-white border-0 shadow-security">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold">Welcome, {profile?.name}</h1>
                    <p className="text-white/80 text-lg">TourGuard Guardian - Your Digital Safety Companion</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="text-white hover:bg-white/20"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <Shield className="w-8 h-8 mb-2" />
                    <h3 className="font-bold">Blockchain Secured</h3>
                    <p className="text-sm text-white/80">Your digital identity is tamper-proof</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <AlertTriangle className="w-8 h-8 mb-2" />
                    <h3 className="font-bold">Emergency Ready</h3>
                    <p className="text-sm text-white/80">One-touch SOS with auto E-FIR</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <MapPin className="w-8 h-8 mb-2" />
                    <h3 className="font-bold">Location Aware</h3>
                    <p className="text-sm text-white/80">Real-time safety monitoring</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 border-2 border-primary/20 hover:border-primary"
                onClick={() => setActiveTab('digital-id')}
              >
                <CreditCard className="w-8 h-8 text-primary" />
                <span className="font-medium">Digital ID</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 border-2 border-emergency/20 hover:border-emergency"
                onClick={() => setActiveTab('sos')}
              >
                <AlertTriangle className="w-8 h-8 text-emergency" />
                <span className="font-medium">SOS Alert</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 border-2 border-blue-500/20 hover:border-blue-500"
                onClick={() => setActiveTab('e-fir')}
              >
                <FileText className="w-8 h-8 text-blue-500" />
                <span className="font-medium">E-FIR Reports</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 border-2 border-green-500/20 hover:border-green-500"
                onClick={() => setActiveTab('travel')}
              >
                <MapPin className="w-8 h-8 text-green-500" />
                <span className="font-medium">Travel Feed</span>
              </Button>
            </div>

            {/* Safety Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-success" />
                  Current Safety Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Zone Safety Level</span>
                      <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm font-medium">
                        Safe Zone
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Digital ID Status</span>
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Emergency Contact</span>
                      <span className="text-muted-foreground">{profile?.emergency_contact}</span>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">AI Safety Insights</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• You are in a monitored safe area</li>
                      <li>• No unusual activity detected</li>
                      <li>• Weather conditions are favorable</li>
                      <li>• Tourist services are fully operational</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <RecommendationsSection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="digital-id">Digital ID</TabsTrigger>
            <TabsTrigger value="sos">SOS</TabsTrigger>
            <TabsTrigger value="e-fir">E-FIR</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {renderTabContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TourGuardDashboard;