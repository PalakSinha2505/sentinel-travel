import { useState } from 'react';
import { MapPin, MessageCircle, Camera, AlertTriangle, User, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SOSButton } from '@/components/SOSButton';
import { TravelFeed } from '@/components/TravelFeed';
import { LocalGuideQA } from '@/components/LocalGuideQA';
import { RecommendationsSection } from '@/components/RecommendationsSection';

interface TouristAppProps {
  user: any;
  onLogout: () => void;
}

const TouristApp = ({ user, onLogout }: TouristAppProps) => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <TravelFeed />;
      case 'qa':
        return <LocalGuideQA />;
      case 'profile':
        return (
          <div className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-muted-foreground">{user.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Emergency Contact</label>
                  <p className="text-muted-foreground">{user.emergencyContact}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Current Location</label>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="p-6 space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-hero rounded-lg p-6 text-white shadow-security">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className="text-white hover:bg-white/20"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
              <p className="opacity-90">Stay safe and explore with confidence</p>
              <div className="flex items-center gap-2 mt-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm opacity-90">Paris, France</span>
              </div>
            </div>

            {/* SOS Section */}
            <Card className="border-2 border-emergency/20 shadow-emergency">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emergency">
                  <Shield className="w-5 h-5" />
                  Emergency Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <SOSButton />
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Press and hold for 3 seconds to send emergency alert
                </p>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => setActiveTab('feed')}
              >
                <Camera className="w-6 h-6" />
                <span>Share Journey</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col gap-2"
                onClick={() => setActiveTab('qa')}
              >
                <MessageCircle className="w-6 h-6" />
                <span>Ask Locals</span>
              </Button>
            </div>

            {/* Safety Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Safety Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span>Current Zone Safety</span>
                  <Badge variant="outline" className="bg-success/10 text-success border-success">
                    Safe Zone
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  You are in a monitored safe area. Enjoy your visit!
                </p>
              </CardContent>
            </Card>

            <RecommendationsSection />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around py-2">
          {[
            { id: 'home', icon: Shield, label: 'Home' },
            { id: 'feed', icon: Camera, label: 'Feed' },
            { id: 'qa', icon: MessageCircle, label: 'Q&A' },
            { id: 'profile', icon: User, label: 'Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TouristApp;