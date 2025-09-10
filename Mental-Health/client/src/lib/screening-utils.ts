export interface ScreeningScore {
  score: number;
  maxScore: number;
  riskLevel: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  percentage: number;
  recommendations: string[];
  isHighRisk: boolean;
  isCrisis?: boolean;
}

export class ScreeningUtils {
  /**
   * Calculate PHQ-9 depression screening score
   */
  static calculatePHQ9(responses: number[]): ScreeningScore {
    if (responses.length !== 9) {
      throw new Error('PHQ-9 requires exactly 9 responses');
    }

    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    const maxScore = 27;
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    // Check for crisis (question 9 about self-harm)
    const isCrisis = responses[8] >= 2; // More than half the days or nearly every day

    let riskLevel: ScreeningScore['riskLevel'];
    let isHighRisk = false;
    let recommendations: string[] = [];

    if (totalScore <= 4) {
      riskLevel = 'minimal';
      recommendations = [
        'Your responses suggest minimal depressive symptoms',
        'Continue with regular self-care practices',
        'Consider wellness resources for maintaining good mental health',
        'Keep up healthy habits like regular exercise and sleep'
      ];
    } else if (totalScore <= 9) {
      riskLevel = 'mild';
      recommendations = [
        'You may be experiencing mild depressive symptoms',
        'Try stress management and relaxation techniques',
        'Consider talking to a counselor if symptoms persist',
        'Focus on maintaining social connections and regular activities'
      ];
    } else if (totalScore <= 14) {
      riskLevel = 'moderate';
      isHighRisk = true;
      recommendations = [
        'Your responses suggest moderate depression',
        'We recommend speaking with a mental health professional',
        'Campus counseling services can provide support and guidance',
        'Consider therapy and lifestyle modifications'
      ];
    } else if (totalScore <= 19) {
      riskLevel = 'moderately-severe';
      isHighRisk = true;
      recommendations = [
        'Your responses indicate moderately severe depression',
        'Professional support is strongly recommended',
        'Please consider booking an appointment with our counselors',
        'Treatment may include therapy and/or medication'
      ];
    } else {
      riskLevel = 'severe';
      isHighRisk = true;
      recommendations = [
        'Your responses suggest severe depression',
        'Immediate professional support is recommended',
        'Please reach out to our counselors or crisis helpline',
        'Comprehensive treatment is likely needed'
      ];
    }

    if (isCrisis) {
      recommendations.unshift(
        'IMPORTANT: You indicated thoughts of self-harm. Please reach out for immediate support.',
        'Contact the crisis helpline or emergency services if you are in immediate danger.'
      );
    }

    return {
      score: totalScore,
      maxScore,
      riskLevel,
      percentage,
      recommendations,
      isHighRisk: isHighRisk || isCrisis,
      isCrisis
    };
  }

  /**
   * Calculate GAD-7 anxiety screening score
   */
  static calculateGAD7(responses: number[]): ScreeningScore {
    if (responses.length !== 7) {
      throw new Error('GAD-7 requires exactly 7 responses');
    }

    const totalScore = responses.reduce((sum, score) => sum + score, 0);
    const maxScore = 21;
    const percentage = Math.round((totalScore / maxScore) * 100);

    let riskLevel: ScreeningScore['riskLevel'];
    let isHighRisk = false;
    let recommendations: string[] = [];

    if (totalScore <= 4) {
      riskLevel = 'minimal';
      recommendations = [
        'Your responses suggest minimal anxiety symptoms',
        'Continue with regular stress management practices',
        'Use relaxation techniques during stressful periods',
        'Maintain healthy lifestyle habits'
      ];
    } else if (totalScore <= 9) {
      riskLevel = 'mild';
      recommendations = [
        'You may be experiencing mild anxiety',
        'Try breathing exercises and mindfulness techniques',
        'Consider speaking with a counselor if anxiety interferes with daily activities',
        'Practice regular physical exercise and good sleep hygiene'
      ];
    } else if (totalScore <= 14) {
      riskLevel = 'moderate';
      isHighRisk = true;
      recommendations = [
        'Your responses suggest moderate anxiety',
        'Professional support can help you develop coping strategies',
        'Campus counseling services offer anxiety management resources',
        'Consider cognitive-behavioral therapy techniques'
      ];
    } else {
      riskLevel = 'severe';
      isHighRisk = true;
      recommendations = [
        'Your responses indicate severe anxiety',
        'We strongly recommend professional support',
        'Please consider immediate consultation with our mental health team',
        'Treatment may include therapy, relaxation training, or medication'
      ];
    }

    return {
      score: totalScore,
      maxScore,
      riskLevel,
      percentage,
      recommendations,
      isHighRisk,
      isCrisis: false
    };
  }

  /**
   * Get risk level color for UI display
   */
  static getRiskLevelColor(riskLevel: ScreeningScore['riskLevel']): string {
    const colors = {
      'minimal': 'bg-green-100 text-green-800 border-green-200',
      'mild': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'moderate': 'bg-orange-100 text-orange-800 border-orange-200',
      'moderately-severe': 'bg-red-100 text-red-800 border-red-200',
      'severe': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[riskLevel] || colors.minimal;
  }

  /**
   * Get next steps based on screening results
   */
  static getNextSteps(score: ScreeningScore): string[] {
    const steps: string[] = [];

    if (score.isHighRisk) {
      steps.push('Schedule an appointment with a counselor');
      steps.push('Share these results with a mental health professional');
    }

    if (score.isCrisis) {
      steps.unshift('Contact crisis support immediately');
      steps.unshift('Reach out to a trusted friend or family member');
    }

    if (!score.isHighRisk) {
      steps.push('Continue monitoring your mental health');
      steps.push('Use available self-help resources');
      steps.push('Practice stress management techniques');
    }

    steps.push('Retake this assessment in 2 weeks to track changes');
    steps.push('Maintain healthy lifestyle habits');

    return steps;
  }

  /**
   * Format score for display
   */
  static formatScore(score: ScreeningScore): string {
    return `${score.score}/${score.maxScore}`;
  }

  /**
   * Get severity description
   */
  static getSeverityDescription(riskLevel: ScreeningScore['riskLevel']): string {
    const descriptions = {
      'minimal': 'Minimal symptoms - you\'re doing well',
      'mild': 'Mild symptoms - some support may be helpful',
      'moderate': 'Moderate symptoms - professional support recommended',
      'moderately-severe': 'Moderately severe symptoms - professional help strongly recommended',
      'severe': 'Severe symptoms - immediate professional support needed'
    };
    return descriptions[riskLevel] || descriptions.minimal;
  }
}
