import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  Calendar, 
  Search,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Shield
} from 'lucide-react';

const mockReports = [
  {
    id: 1,
    title: 'Monthly Safety Report - January 2024',
    type: 'monthly',
    dateRange: '2024-01-01 to 2024-01-31',
    generatedBy: 'Admin System',
    generatedDate: '2024-01-31 23:59:00',
    status: 'completed',
    incidents: 45,
    resolved: 42,
    pending: 3,
    fileSize: '2.3 MB'
  },
  {
    id: 2,
    title: 'Weekly Incident Summary - Week 3',
    type: 'weekly',
    dateRange: '2024-01-15 to 2024-01-21',
    generatedBy: 'Officer Martin',
    generatedDate: '2024-01-21 18:00:00',
    status: 'completed',
    incidents: 12,
    resolved: 11,
    pending: 1,
    fileSize: '856 KB'
  },
  {
    id: 3,
    title: 'Tourist Safety Analysis - Q1 2024',
    type: 'quarterly',
    dateRange: '2024-01-01 to 2024-03-31',
    generatedBy: 'Admin System',
    generatedDate: '2024-01-15 14:30:00',
    status: 'in-progress',
    incidents: 15,
    resolved: 13,
    pending: 2,
    fileSize: '1.2 MB'
  },
  {
    id: 4,
    title: 'Emergency Response Time Analysis',
    type: 'custom',
    dateRange: '2024-01-01 to 2024-01-15',
    generatedBy: 'Officer Dubois',
    generatedDate: '2024-01-15 10:15:00',
    status: 'completed',
    incidents: 8,
    resolved: 8,
    pending: 0,
    fileSize: '645 KB'
  }
];

const reportStats = {
  totalReports: 4,
  totalIncidents: 80,
  resolvedIncidents: 74,
  averageResponseTime: '8.5 minutes',
  highRiskAreas: 3
};

export const ReportsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">In Progress</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-emergency/10 text-emergency border-emergency">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'monthly':
        return <Badge variant="outline">Monthly</Badge>;
      case 'weekly':
        return <Badge variant="outline">Weekly</Badge>;
      case 'quarterly':
        return <Badge variant="outline">Quarterly</Badge>;
      case 'custom':
        return <Badge variant="outline">Custom</Badge>;
      default:
        return <Badge variant="outline">Report</Badge>;
    }
  };

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleGenerateReport = () => {
    console.log('Generating new report...');
  };

  const handleDownloadReport = (reportId: number) => {
    console.log(`Downloading report ${reportId}...`);
    // Mock PDF download
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <Button onClick={handleGenerateReport}>
          <FileText className="w-4 h-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{reportStats.totalReports}</p>
              </div>
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Incidents</p>
                <p className="text-2xl font-bold">{reportStats.totalIncidents}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-success">{reportStats.resolvedIncidents}</p>
              </div>
              <Shield className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">{reportStats.averageResponseTime}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk Areas</p>
                <p className="text-2xl font-bold text-emergency">{reportStats.highRiskAreas}</p>
              </div>
              <BarChart3 className="w-6 h-6 text-emergency" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Generated Reports ({filteredReports.length})
        </h3>
        
        {filteredReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-lg">{report.title}</h4>
                    {getTypeBadge(report.type)}
                    {getStatusBadge(report.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Date Range:</span>
                      <p>{report.dateRange}</p>
                    </div>
                    <div>
                      <span className="font-medium">Generated By:</span>
                      <p>{report.generatedBy}</p>
                    </div>
                    <div>
                      <span className="font-medium">Generated:</span>
                      <p>{new Date(report.generatedDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">File Size:</span>
                      <p>{report.fileSize}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span>{report.incidents} incidents</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-success" />
                      <span>{report.resolved} resolved</span>
                    </div>
                    {report.pending > 0 && (
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-warning" />
                        <span>{report.pending} pending</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {report.status === 'completed' && (
                    <Button 
                      variant="outline"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="w-6 h-6" />
              <span>Daily Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>Weekly Summary</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <TrendingUp className="w-6 h-6" />
              <span>Custom Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};