import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Sparkles, TrendingUp, FileSearch, Globe2, Package } from "lucide-react";

const Agents = () => {
  const agents = [
    {
      title: "Trade Analyst",
      description: "Analyzes trade patterns and provides insights on import/export trends",
      icon: TrendingUp,
      color: "bg-blue-500",
      status: "Active"
    },
    {
      title: "Market Intelligence",
      description: "Monitors global market conditions and identifies opportunities",
      icon: Globe2,
      color: "bg-purple-500",
      status: "Active"
    },
    {
      title: "Commodity Tracker",
      description: "Tracks commodity prices and trade volumes across sectors",
      icon: Package,
      color: "bg-green-500",
      status: "Active"
    },
    {
      title: "Report Generator",
      description: "Automatically generates comprehensive trade reports and summaries",
      icon: FileSearch,
      color: "bg-orange-500",
      status: "Coming Soon"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary" />
          AI Agents
        </h1>
        <p className="text-muted-foreground mt-2">
          Intelligent assistants that help you analyze trade data and generate insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.title} className="hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${agent.color} flex items-center justify-center`}>
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{agent.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${agent.status === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
                      <span className="text-xs text-muted-foreground">{agent.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {agent.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-2 border-dashed">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>Want more AI agents?</CardTitle>
              <CardDescription>
                Custom AI agents can be created to match your specific trade analysis needs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Agents;
