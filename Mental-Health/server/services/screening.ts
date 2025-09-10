export interface PHQ9Question {
  id: number;
  text: string;
}

export interface GAD7Question {
  id: number;
  text: string;
}

export const PHQ9_QUESTIONS: PHQ9Question[] = [
  { id: 1, text: "Little interest or pleasure in doing things" },
  { id: 2, text: "Feeling down, depressed, or hopeless" },
  { id: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
  { id: 4, text: "Feeling tired or having little energy" },
  { id: 5, text: "Poor appetite or overeating" },
  { id: 6, text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
  { id: 7, text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
  { id: 8, text: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
  { id: 9, text: "Thoughts that you would be better off dead, or of hurting yourself" }
];

export const GAD7_QUESTIONS: GAD7Question[] = [
  { id: 1, text: "Feeling nervous, anxious, or on edge" },
  { id: 2, text: "Not being able to stop or control worrying" },
  { id: 3, text: "Worrying too much about different things" },
  { id: 4, text: "Trouble relaxing" },
  { id: 5, text: "Being so restless that it is hard to sit still" },
  { id: 6, text: "Becoming easily annoyed or irritable" },
  { id: 7, text: "Feeling afraid, as if something awful might happen" }
];

export type RiskLevel = "minimal" | "mild" | "moderate" | "moderately-severe" | "severe";

export interface ScreeningResult {
  totalScore: number;
  riskLevel: RiskLevel;
  isHighRisk: boolean;
  recommendations: string[];
  isCrisis: boolean;
}

export class ScreeningService {
  static calculatePHQ9Score(responses: number[]): ScreeningResult {
    if (responses.length !== 9) {
      throw new Error("PHQ-9 requires exactly 9 responses");
    }

    // Validate responses are 0-3
    if (responses.some(r => r < 0 || r > 3)) {
      throw new Error("PHQ-9 responses must be between 0-3");
    }

    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    
    // Check for crisis (Question 9 - suicidal ideation)
    const isCrisis = responses[8] >= 2; // "More than half the days" or "Nearly every day"

    let riskLevel: RiskLevel;
    let isHighRisk = false;
    let recommendations: string[] = [];

    if (totalScore <= 4) {
      riskLevel = "minimal";
      recommendations = [
        "Your responses suggest minimal depressive symptoms",
        "Continue with regular self-care practices",
        "Consider wellness resources for maintaining good mental health"
      ];
    } else if (totalScore <= 9) {
      riskLevel = "mild";
      recommendations = [
        "You may be experiencing mild depressive symptoms",
        "Try stress management and relaxation techniques",
        "Consider talking to a counselor if symptoms persist"
      ];
    } else if (totalScore <= 14) {
      riskLevel = "moderate";
      isHighRisk = true;
      recommendations = [
        "Your responses suggest moderate depression",
        "We recommend speaking with a mental health professional",
        "Campus counseling services can provide support and guidance"
      ];
    } else if (totalScore <= 19) {
      riskLevel = "moderately-severe";
      isHighRisk = true;
      recommendations = [
        "Your responses indicate moderately severe depression",
        "Professional support is strongly recommended",
        "Please consider booking an appointment with our counselors"
      ];
    } else {
      riskLevel = "severe";
      isHighRisk = true;
      recommendations = [
        "Your responses suggest severe depression",
        "Immediate professional support is recommended",
        "Please reach out to our counselors or crisis helpline"
      ];
    }

    if (isCrisis) {
      recommendations.unshift("We noticed you may be having thoughts of self-harm. Please reach out for immediate support.");
    }

    return {
      totalScore,
      riskLevel,
      isHighRisk: isHighRisk || isCrisis,
      recommendations,
      isCrisis
    };
  }

  static calculateGAD7Score(responses: number[]): ScreeningResult {
    if (responses.length !== 7) {
      throw new Error("GAD-7 requires exactly 7 responses");
    }

    // Validate responses are 0-3
    if (responses.some(r => r < 0 || r > 3)) {
      throw new Error("GAD-7 responses must be between 0-3");
    }

    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    
    let riskLevel: RiskLevel;
    let isHighRisk = false;
    let recommendations: string[] = [];

    if (totalScore <= 4) {
      riskLevel = "minimal";
      recommendations = [
        "Your responses suggest minimal anxiety symptoms",
        "Continue with regular stress management practices",
        "Use relaxation techniques during stressful periods"
      ];
    } else if (totalScore <= 9) {
      riskLevel = "mild";
      recommendations = [
        "You may be experiencing mild anxiety",
        "Try breathing exercises and mindfulness techniques",
        "Consider speaking with a counselor if anxiety interferes with daily activities"
      ];
    } else if (totalScore <= 14) {
      riskLevel = "moderate";
      isHighRisk = true;
      recommendations = [
        "Your responses suggest moderate anxiety",
        "Professional support can help you develop coping strategies",
        "Campus counseling services offer anxiety management resources"
      ];
    } else {
      riskLevel = "severe";
      isHighRisk = true;
      recommendations = [
        "Your responses indicate severe anxiety",
        "We strongly recommend professional support",
        "Please consider immediate consultation with our mental health team"
      ];
    }

    return {
      totalScore,
      riskLevel,
      isHighRisk,
      recommendations,
      isCrisis: false // GAD-7 doesn't have direct crisis indicators like PHQ-9
    };
  }

  static getScreeningQuestions(type: "PHQ9" | "GAD7") {
    return type === "PHQ9" ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  }

  static getResponseOptions(): Array<{ value: number; label: string }> {
    return [
      { value: 0, label: "Not at all" },
      { value: 1, label: "Several days" },
      { value: 2, label: "More than half the days" },
      { value: 3, label: "Nearly every day" }
    ];
  }
}
