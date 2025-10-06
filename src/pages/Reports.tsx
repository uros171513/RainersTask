import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Filter, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useTradeData } from "@/hooks/useTradeData";
import { formatCurrency } from "@/lib/tradeDataProcessor";

const scheduledReports = [
  { id: 1, name: "Weekly Trade Summary", frequency: "Weekly", nextRun: "2025-01-10", status: "active" },
  { id: 2, name: "Monthly Country Analysis", frequency: "Monthly", nextRun: "2025-02-01", status: "active" },
  { id: 3, name: "Quarterly SEPA Review", frequency: "Quarterly", nextRun: "2025-03-31", status: "paused" },
];

const recentReports = [
  { id: 1, name: "H1 2025 Trade Overview", date: "2025-01-05", size: "2.4 MB", type: "PDF" },
  { id: 2, name: "Top 20 Partners Analysis", date: "2025-01-04", size: "1.8 MB", type: "Excel" },
  { id: 3, name: "Commodity Sector Report", date: "2025-01-03", size: "3.1 MB", type: "PDF" },
  { id: 4, name: "SEPA Countries Dashboard", date: "2025-01-02", size: "1.2 MB", type: "PowerPoint" },
];

const reportTemplates = [
  { id: 1, name: "Executive Summary", desc: "High-level KPIs and trends", icon: "📊" },
  { id: 2, name: "Country Deep Dive", desc: "Bilateral trade analysis", icon: "🌍" },
  { id: 3, name: "Commodity Analysis", desc: "Sector and HS breakdown", icon: "📦" },
  { id: 4, name: "Custom Builder", desc: "Build your own report", icon: "🔧" },
];

const Reports = () => {
  const { loading, topCountries, topSectors, monthlyData, totalStats } = useTradeData();

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading data...</div>;
  }

  const totalReportsGenerated = topCountries.length + topSectors.length + 12; // countries + sectors + monthly reports
  const activeAutomations = 3; // Weekly, Monthly, Quarterly
  const totalDownloads = Math.floor(totalStats.totalTrade / 1000000); // Approximation based on trade volume
  const lastGenerated = "2 hours ago";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-warning to-accent bg-clip-text text-transparent">
            Reports & Automation
          </h1>
          <p className="text-muted-foreground">Configure and generate trade reports</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <FileText className="w-4 h-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </div>
          <p className="text-3xl font-bold text-primary">{totalReportsGenerated}</p>
          <p className="text-xs text-muted-foreground mt-1">Available reports</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-accent" />
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </div>
          <p className="text-3xl font-bold text-accent">{activeAutomations}</p>
          <p className="text-xs text-muted-foreground mt-1">Active automations</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-5 h-5 text-success" />
            <p className="text-sm text-muted-foreground">Downloads</p>
          </div>
          <p className="text-3xl font-bold text-success">{totalDownloads}</p>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </Card>
        <Card className="p-4 shadow-card bg-gradient-card">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-warning" />
            <p className="text-sm text-muted-foreground">Last Generated</p>
          </div>
          <p className="text-xl font-bold text-warning">{lastGenerated}</p>
          <p className="text-xs text-muted-foreground mt-1">Weekly summary</p>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="p-6 shadow-card">
        <h3 className="text-lg font-semibold mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportTemplates.map((template) => (
            <Card
              key={template.id}
              className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary"
            >
              <div className="text-4xl mb-3">{template.icon}</div>
              <h4 className="font-semibold mb-1">{template.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{template.desc}</p>
              <Button variant="outline" size="sm" className="w-full">
                Use Template
              </Button>
            </Card>
          ))}
        </div>
      </Card>

      {/* Scheduled Reports */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Scheduled Reports</h3>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Manage Schedule
          </Button>
        </div>
        <div className="space-y-3">
          {scheduledReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.frequency} • Next: {report.nextRun}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {report.status === "active" ? (
                  <Badge className="bg-success/20 text-success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-warning/20 text-warning">
                    <XCircle className="w-3 h-3 mr-1" />
                    Paused
                  </Badge>
                )}
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Reports */}
      <Card className="p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Reports</h3>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="space-y-3">
          {recentReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-semibold">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.date} • {report.size} • {report.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
