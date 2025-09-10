export interface UserAction {
  id: string;
  userId: string;
  action: string;
  page: string;
  timestamp: Date;
  duration?: number;
  data?: any;
}

export interface UsagePattern {
  userId: string;
  mostUsedFeatures: string[];
  averageSessionDuration: number;
  preferredTime: string;
  stressIndicators: number;
  engagementLevel: 'low' | 'medium' | 'high';
  recommendedContent: string[];
  lastAnalyzed: Date;
}

class UsageAnalytics {
  private actions: UserAction[] = [];
  private patterns: Map<string, UsagePattern> = new Map();

  // Track user actions
  trackAction(userId: string, action: string, page: string, data?: any): void {
    const actionRecord: UserAction = {
      id: crypto.randomUUID(),
      userId,
      action,
      page,
      timestamp: new Date(),
      data
    };

    this.actions.push(actionRecord);
    this.analyzeUserPattern(userId);
  }

  // Track page duration
  trackPageDuration(userId: string, page: string, duration: number): void {
    this.trackAction(userId, 'page_duration', page, { duration });
  }

  // Analyze user patterns using AI-like logic
  private analyzeUserPattern(userId: string): void {
    const userActions = this.actions.filter(a => a.userId === userId);
    if (userActions.length < 5) return; // Need minimum data

    const last30Days = userActions.filter(
      a => new Date().getTime() - a.timestamp.getTime() < 30 * 24 * 60 * 60 * 1000
    );

    // Calculate most used features
    const featureCount = new Map<string, number>();
    last30Days.forEach(action => {
      const count = featureCount.get(action.page) || 0;
      featureCount.set(action.page, count + 1);
    });

    const mostUsedFeatures = Array.from(featureCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([feature]) => feature);

    // Calculate average session duration
    const durations = last30Days
      .filter(a => a.action === 'page_duration' && a.data?.duration)
      .map(a => a.data.duration);
    const averageSessionDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;

    // Determine preferred time
    const hours = last30Days.map(a => a.timestamp.getHours());
    const timeSlots = {
      morning: hours.filter(h => h >= 6 && h < 12).length,
      afternoon: hours.filter(h => h >= 12 && h < 18).length,
      evening: hours.filter(h => h >= 18 && h < 24).length,
      night: hours.filter(h => h >= 0 && h < 6).length
    };
    const preferredTime = Object.entries(timeSlots)
      .sort((a, b) => b[1] - a[1])[0][0];

    // Calculate stress indicators
    const stressActions = last30Days.filter(a => 
      a.page === '/chat' || 
      a.page === '/screening' || 
      a.action === 'crisis_help'
    ).length;
    const stressIndicators = Math.min(stressActions / 10, 1); // Normalize to 0-1

    // Determine engagement level
    let engagementLevel: 'low' | 'medium' | 'high' = 'low';
    if (averageSessionDuration > 300 && last30Days.length > 20) {
      engagementLevel = 'high';
    } else if (averageSessionDuration > 120 && last30Days.length > 10) {
      engagementLevel = 'medium';
    }

    // Generate recommendations
    const recommendedContent = this.generateRecommendations(
      mostUsedFeatures,
      stressIndicators,
      engagementLevel
    );

    const pattern: UsagePattern = {
      userId,
      mostUsedFeatures,
      averageSessionDuration,
      preferredTime,
      stressIndicators,
      engagementLevel,
      recommendedContent,
      lastAnalyzed: new Date()
    };

    this.patterns.set(userId, pattern);
  }

  private generateRecommendations(
    mostUsed: string[],
    stress: number,
    engagement: string
  ): string[] {
    const recommendations: string[] = [];

    // High stress recommendations
    if (stress > 0.5) {
      recommendations.push('breathing_exercises', 'meditation_videos', 'crisis_support');
    }

    // Based on most used features
    if (mostUsed.includes('/music')) {
      recommendations.push('new_ambient_tracks', 'music_therapy');
    }
    if (mostUsed.includes('/chat')) {
      recommendations.push('advanced_ai_features', 'peer_support');
    }
    if (mostUsed.includes('/screening')) {
      recommendations.push('progress_tracking', 'personalized_insights');
    }

    // Engagement-based recommendations
    if (engagement === 'low') {
      recommendations.push('quick_activities', 'motivation_boost');
    } else if (engagement === 'high') {
      recommendations.push('advanced_tools', 'community_features');
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  }

  // Get user insights
  getUserInsights(userId: string): UsagePattern | null {
    return this.patterns.get(userId) || null;
  }

  // Get AI-generated suggestions for user
  getAISuggestions(userId: string): string[] {
    const pattern = this.getUserInsights(userId);
    if (!pattern) return ['Start by exploring our AI chat feature'];

    const suggestions: string[] = [];
    const currentHour = new Date().getHours();

    // Time-based suggestions
    if (currentHour >= 6 && currentHour < 12 && pattern.preferredTime === 'morning') {
      suggestions.push('Perfect time for your morning routine! Try our routine generator.');
    } else if (currentHour >= 22 || currentHour < 6) {
      suggestions.push('Having trouble sleeping? Check out our sleep cycle guide.');
    }

    // Pattern-based suggestions
    if (pattern.stressIndicators > 0.6) {
      suggestions.push('I notice you might be feeling stressed. Would you like to try a breathing exercise?');
    }

    if (pattern.engagementLevel === 'high') {
      suggestions.push('You\'re doing great with regular usage! Ready to explore advanced features?');
    }

    // Feature suggestions
    if (!pattern.mostUsedFeatures.includes('/music')) {
      suggestions.push('Try our Mind Fresh Music library for relaxation and focus.');
    }

    return suggestions.slice(0, 3);
  }

  // Export analytics data
  exportAnalytics(): { actions: UserAction[], patterns: UsagePattern[] } {
    return {
      actions: this.actions,
      patterns: Array.from(this.patterns.values())
    };
  }
}

export const usageAnalytics = new UsageAnalytics();

// Hook for easy usage in React components
export const useUsageAnalytics = () => {
  const trackAction = (action: string, page: string, data?: any) => {
    const userId = 'current-user'; // Would be actual user ID in real app
    usageAnalytics.trackAction(userId, action, page, data);
  };

  const trackPageDuration = (page: string, duration: number) => {
    const userId = 'current-user';
    usageAnalytics.trackPageDuration(userId, page, duration);
  };

  const getUserInsights = () => {
    const userId = 'current-user';
    return usageAnalytics.getUserInsights(userId);
  };

  const getAISuggestions = () => {
    const userId = 'current-user';
    return usageAnalytics.getAISuggestions(userId);
  };

  return {
    trackAction,
    trackPageDuration,
    getUserInsights,
    getAISuggestions
  };
};