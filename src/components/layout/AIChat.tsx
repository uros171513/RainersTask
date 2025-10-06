import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "What would you like to explore today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "I'm analyzing that for you..." }
      ]);
    }, 500);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-ai shadow-ai ai-pulse"
        size="icon"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-card-hover flex flex-col border-accent/20">
      <div className="p-4 border-b border-border bg-gradient-ai flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-white" />
          <div>
            <h3 className="font-semibold text-white">AI Assistant</h3>
            <p className="text-xs text-white/80">Powered by Trade Intelligence</p>
          </div>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about trade data..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-gradient-ai">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
