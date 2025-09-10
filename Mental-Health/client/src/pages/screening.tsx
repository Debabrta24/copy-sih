import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PHQ9Form from "@/components/screening/phq9-form";
import GAD7Form from "@/components/screening/gad7-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Brain, Info } from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

export default function Screening() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mental Health Screening</h1>
        <p className="text-muted-foreground">
          Take validated assessments to understand your mental health and get personalized recommendations.
        </p>
      </div>

      <Tabs defaultValue="phq9" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="phq9" data-testid="tab-phq9">
            <Heart className="h-4 w-4 mr-2" />
            PHQ-9 Depression
          </TabsTrigger>
          <TabsTrigger value="gad7" data-testid="tab-gad7">
            <Brain className="h-4 w-4 mr-2" />
            GAD-7 Anxiety
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phq9">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PHQ9Form />
            </div>
            <div>
              <ScreeningInfo type="PHQ-9" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gad7">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <GAD7Form />
            </div>
            <div>
              <ScreeningInfo type="GAD-7" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function ScreeningInfo({ type }: { type: "PHQ-9" | "GAD-7" }) {
  const info = {
    "PHQ-9": {
      title: "About PHQ-9",
      description: "The Patient Health Questionnaire-9 (PHQ-9) is a widely used tool for screening and monitoring depression severity.",
      details: [
        "9 questions about mood over the past 2 weeks",
        "Scores range from 0-27",
        "Higher scores indicate more severe symptoms",
        "Used worldwide by healthcare professionals",
      ],
    },
    "GAD-7": {
      title: "About GAD-7",
      description: "The Generalized Anxiety Disorder-7 (GAD-7) is a validated screening tool for anxiety disorders.",
      details: [
        "7 questions about anxiety over the past 2 weeks",
        "Scores range from 0-21",
        "Higher scores indicate more severe anxiety",
        "Helps identify generalized anxiety disorder",
      ],
    },
  };

  const currentInfo = info[type];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="h-5 w-5 mr-2" />
          {currentInfo.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {currentInfo.description}
        </p>
        
        <div>
          <h4 className="font-medium text-card-foreground mb-2">Key Features:</h4>
          <ul className="space-y-1">
            {currentInfo.details.map((detail, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <h5 className="font-medium text-card-foreground mb-2">Important Notice</h5>
          <p className="text-xs text-muted-foreground leading-relaxed">
            These screening tools help identify symptoms but are not diagnostic instruments. 
            Results are completely confidential and help guide you to appropriate support resources.
            Always consult with a qualified mental health professional for proper diagnosis and treatment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
