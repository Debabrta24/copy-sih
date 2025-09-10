import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  MessageSquare, 
  Sprout,
  Cloud,
  Bug,
  Calculator,
  Lightbulb
} from 'lucide-react';
import { useLanguage } from './language-provider';
import { FarmingChatbot } from './farming-chatbot';

export function ChatbotSection() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t } = useLanguage();

  const farmingTopics = [
    {
      icon: Sprout,
      title: "Crop Planning",
      description: "Best planting times, varieties, and spacing",
      questions: ["When to plant tomatoes?", "Best wheat varieties", "Crop rotation tips"]
    },
    {
      icon: Bug,
      title: "Pest Control",
      description: "Identify and manage pests organically",
      questions: ["Identify pest from photo", "Organic pesticides", "Prevention methods"]
    },
    {
      icon: Cloud,
      title: "Weather Planning",
      description: "Weather-based farming decisions",
      questions: ["Rain forecast impact", "Drought preparation", "Storm protection"]
    },
    {
      icon: Calculator,
      title: "Farm Economics",
      description: "Cost analysis and profit optimization",
      questions: ["Calculate fertilizer costs", "Market price trends", "ROI analysis"]
    }
  ];

  const quickQuestions = [
    "What's the best time to plant wheat?",
    "How to identify pest attacks?",
    "Weather forecast for farming",
    "Organic fertilizer recipes"
  ];

  return (
    <>
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Bot className="w-8 h-8 text-primary" />
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                AI Farming Assistant
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get instant expert advice on all your farming questions. From crop planning to pest control, 
              our AI assistant is here to help you succeed.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Chatbot Preview */}
            <div className="order-2 lg:order-1">
              <Card className="shadow-xl border-2 border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary to-green-600 text-primary-foreground">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Farm AI Assistant</CardTitle>
                      <p className="text-sm text-primary-foreground/80">
                        Ask me anything about farming
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      24/7 Available
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Sample conversation */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                        <div className="text-sm">
                          <p className="font-medium mb-1">AI Assistant</p>
                          <p className="text-muted-foreground">
                            Hello! I'm here to help with all your farming questions. 
                            I can assist with crop planning, pest identification, weather advice, and more!
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick questions */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Quick Questions:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {quickQuestions.slice(0, 3).map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="justify-start text-left h-auto py-2 px-3"
                            onClick={() => setIsChatOpen(true)}
                          >
                            <MessageSquare className="w-3 h-3 mr-2 flex-shrink-0" />
                            <span className="text-xs">{question}</span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Chat input demo */}
                    <div className="flex space-x-2 pt-2 border-t">
                      <Input
                        placeholder="Ask about farming..."
                        className="flex-1 text-sm"
                        onClick={() => setIsChatOpen(true)}
                        readOnly
                      />
                      <Button 
                        size="icon"
                        onClick={() => setIsChatOpen(true)}
                        className="h-10 w-10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA Button */}
              <div className="text-center mt-6">
                <Button
                  size="lg"
                  onClick={() => setIsChatOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Start Chatting with AI Assistant
                </Button>
              </div>
            </div>

            {/* Farming Topics */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  What can I help you with?
                </h3>
                <div className="grid gap-4">
                  {farmingTopics.map((topic, index) => {
                    const Icon = topic.icon;
                    return (
                      <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setIsChatOpen(true)}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground mb-1">{topic.title}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {topic.questions.slice(0, 2).map((question, qIndex) => (
                                  <Badge key={qIndex} variant="secondary" className="text-xs">
                                    {question}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Features */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-foreground mb-3 flex items-center">
                    <Lightbulb className="w-5 h-5 text-primary mr-2" />
                    Smart Features
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Emergency farming situation detection
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Weather-based recommendations
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Multilingual support (Hindi, Bengali, Tamil)
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      Real-time notifications & alerts
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbot Modal */}
      <FarmingChatbot 
        open={isChatOpen} 
        onOpenChange={setIsChatOpen}
      />
    </>
  );
}