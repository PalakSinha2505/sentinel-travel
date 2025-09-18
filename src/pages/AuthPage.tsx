import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, User, Phone, Globe, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthPageProps {
  onLogin: (userType: 'tourist' | 'admin', userData: any) => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [activeTab, setActiveTab] = useState('tourist');
  const { toast } = useToast();
  
  // Tourist Registration/Login Form
  const [touristForm, setTouristForm] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    gender: '',
    preferredLanguage: 'English',
    password: ''
  });

  // Admin Login Form
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: ''
  });

  const handleTouristAuth = (isRegistration: boolean) => {
    if (isRegistration) {
      // Registration
      if (!touristForm.name || !touristForm.email || !touristForm.phone || !touristForm.emergencyContact) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Registration Successful!",
        description: "Welcome to TourGuard Guardian. Stay safe!",
      });

      onLogin('tourist', {
        name: touristForm.name,
        email: touristForm.email,
        phone: touristForm.phone,
        emergencyContact: touristForm.emergencyContact,
        gender: touristForm.gender,
        preferredLanguage: touristForm.preferredLanguage
      });
    } else {
      // Login
      if (!touristForm.email || !touristForm.password) {
        toast({
          title: "Missing Information",
          description: "Please enter your email and password.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login Successful!",
        description: "Welcome back to TourGuard Guardian.",
      });

      onLogin('tourist', {
        name: 'Sarah Johnson', // Mock user data
        email: touristForm.email,
        phone: '+1-555-0123',
        emergencyContact: '+1-555-0456',
        gender: 'Female',
        preferredLanguage: 'English'
      });
    }
  };

  const handleAdminLogin = () => {
    if (!adminForm.email || !adminForm.password) {
      toast({
        title: "Missing Information",
        description: "Please enter your credentials.",
        variant: "destructive",
      });
      return;
    }

    // Mock admin validation
    if (adminForm.email === 'admin@tourguard.com' && adminForm.password === 'admin123') {
      toast({
        title: "Admin Login Successful!",
        description: "Access granted to TourGuard Control Center.",
      });

      onLogin('admin', {
        name: 'Admin User',
        email: adminForm.email,
        role: 'administrator'
      });
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your email and password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-white" />
            <h1 className="text-3xl font-bold text-white">TourGuard</h1>
          </div>
          <p className="text-white/90">Smart Tourist Safety Monitoring</p>
          <p className="text-white/75 text-sm">& Incident Response System</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tourist" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Tourist
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Tourist Authentication */}
          <TabsContent value="tourist">
            <Card className="shadow-security">
              <CardHeader>
                <CardTitle>Tourist Access</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login" className="space-y-4">
                    <div>
                      <Label htmlFor="tourist-email">Email</Label>
                      <Input
                        id="tourist-email"
                        type="email"
                        placeholder="your@email.com"
                        value={touristForm.email}
                        onChange={(e) => setTouristForm({ ...touristForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tourist-password">Password</Label>
                      <Input
                        id="tourist-password"
                        type="password"
                        placeholder="••••••••"
                        value={touristForm.password}
                        onChange={(e) => setTouristForm({ ...touristForm, password: e.target.value })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleTouristAuth(false)} 
                      className="w-full"
                    >
                      Sign In as Tourist
                    </Button>
                  </TabsContent>

                  <TabsContent value="register" className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={touristForm.name}
                        onChange={(e) => setTouristForm({ ...touristForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@email.com"
                        value={touristForm.email}
                        onChange={(e) => setTouristForm({ ...touristForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1-555-0123"
                        value={touristForm.phone}
                        onChange={(e) => setTouristForm({ ...touristForm, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency">Emergency Contact *</Label>
                      <Input
                        id="emergency"
                        type="tel"
                        placeholder="+1-555-0456"
                        value={touristForm.emergencyContact}
                        onChange={(e) => setTouristForm({ ...touristForm, emergencyContact: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={touristForm.gender}
                        onValueChange={(value) => setTouristForm({ ...touristForm, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select
                        value={touristForm.preferredLanguage}
                        onValueChange={(value) => setTouristForm({ ...touristForm, preferredLanguage: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={() => handleTouristAuth(true)} 
                      className="w-full"
                    >
                      Register as Tourist
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Authentication */}
          <TabsContent value="admin">
            <Card className="shadow-security">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Admin Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm text-warning-foreground">
                    <strong>Demo Credentials:</strong><br />
                    Email: admin@tourguard.com<br />
                    Password: admin123
                  </p>
                </div>
                <div>
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@tourguard.com"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handleAdminLogin} 
                  className="w-full"
                  variant="emergency"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Access Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};