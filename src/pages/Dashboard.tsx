import { TrendingUp, Globe, Package, Star, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const tiles = [
  {
    title: "Trade Overview",
    description: "Comprehensive trade performance metrics",
    icon: TrendingUp,
    color: "primary",
    url: "/trade-overview",
  },
  {
    title: "Country Insights",
    description: "Bilateral trade analysis by country",
    icon: Globe,
    color: "accent",
    url: "/country",
  },
  {
    title: "Commodity Analysis",
    description: "Sector and HS category deep dive",
    icon: Package,
    color: "success",
    url: "/commodity",
  },
  {
    title: "SEPA Tracker",
    description: "Strategic Economic Partnership Agreements",
    icon: Star,
    color: "warning",
    url: "/sepa",
  },
  {
    title: "Reports",
    description: "Generate and schedule trade reports",
    icon: FileText,
    color: "secondary",
    url: "/reports",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <div className="inline-block px-4 py-2 bg-gradient-ai rounded-full mb-4">
          <p className="text-sm font-medium text-white">AI-Powered Trade Intelligence</p>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome to Trade Intelligence Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore comprehensive UAE trade data with AI-powered insights
        </p>
      </div>

      {/* Main Navigation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map((tile, index) => (
          <Card
            key={tile.title}
            onClick={() => navigate(tile.url)}
            className="p-8 cursor-pointer shadow-card hover:shadow-card-hover transition-smooth group hover:-translate-y-1"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="space-y-4">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  tile.color === "primary"
                    ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    : tile.color === "accent"
                    ? "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground"
                    : tile.color === "success"
                    ? "bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground"
                    : tile.color === "warning"
                    ? "bg-warning/10 text-warning group-hover:bg-warning group-hover:text-warning-foreground"
                    : "bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground"
                } transition-smooth`}
              >
                <tile.icon className="w-7 h-7" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-smooth">
                  {tile.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {tile.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-8">
        {[
          { label: "Indicators", value: "200+" },
          { label: "SEPA Countries", value: "11" },
          { label: "Trading Partners", value: "100+" },
          { label: "Data Points", value: "1M+" },
        ].map((stat, index) => (
          <Card
            key={stat.label}
            className="p-6 text-center shadow-card hover:shadow-card-hover transition-smooth"
            style={{
              animationDelay: `${(tiles.length + index) * 0.1}s`,
            }}
          >
            <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
