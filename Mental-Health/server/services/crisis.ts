import { storage } from "../storage";
import { openaiService } from "./openai";

export interface CrisisTrigger {
  userId: string;
  triggerType: "screening" | "chat" | "manual";
  severity: "high" | "critical";
  context: string;
  metadata?: any;
}

export class CrisisService {
  static async handleCrisisTrigger(trigger: CrisisTrigger): Promise<void> {
    try {
      // Create crisis alert
      const alert = await storage.createCrisisAlert({
        userId: trigger.userId,
        triggerType: trigger.triggerType,
        severity: trigger.severity,
        notes: trigger.context,
      });

      console.log(`Crisis alert created for user ${trigger.userId}:`, alert.id);

      // Notify crisis response team (in real implementation, this would send alerts)
      await this.notifyCrisisTeam(alert.id, trigger);

      // Log for audit trail
      console.log(`Crisis intervention initiated for user ${trigger.userId}`);
    } catch (error) {
      console.error("Error handling crisis trigger:", error);
      // In production, this would alert system administrators
    }
  }

  static async evaluateChatMessage(userId: string, message: string): Promise<boolean> {
    try {
      const crisisAnalysis = await openaiService.analyzeForCrisis(message);
      
      if (crisisAnalysis.isHighRisk) {
        await this.handleCrisisTrigger({
          userId,
          triggerType: "chat",
          severity: crisisAnalysis.severity,
          context: `High-risk language detected in chat: "${message.substring(0, 100)}..."`
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error evaluating chat message for crisis:", error);
      // Err on the side of caution
      return false;
    }
  }

  static async evaluateScreeningResult(
    userId: string, 
    assessmentType: string, 
    totalScore: number, 
    isHighRisk: boolean, 
    isCrisis: boolean
  ): Promise<void> {
    if (isCrisis || (isHighRisk && totalScore >= 15)) {
      const severity = isCrisis || totalScore >= 20 ? "critical" : "high";
      
      await this.handleCrisisTrigger({
        userId,
        triggerType: "screening",
        severity,
        context: `${assessmentType} assessment score: ${totalScore}, High risk: ${isHighRisk}, Crisis indicators: ${isCrisis}`
      });
    }
  }

  private static async notifyCrisisTeam(alertId: string, trigger: CrisisTrigger): Promise<void> {
    // In a real implementation, this would:
    // 1. Send SMS/email alerts to crisis response team
    // 2. Create notifications in counselor dashboard
    // 3. Trigger immediate callback protocols
    // 4. Update emergency contact systems
    
    console.log(`CRISIS ALERT ${alertId}: User ${trigger.userId} requires immediate attention`);
    console.log(`Trigger: ${trigger.triggerType}, Severity: ${trigger.severity}`);
    console.log(`Context: ${trigger.context}`);
    
    // For demo purposes, we'll just log. In production:
    // await emailService.sendCrisisAlert(alertId, trigger);
    // await smsService.sendCrisisAlert(alertId, trigger);
    // await notificationService.alertCounselors(alertId, trigger);
  }

  static async getCrisisResources(): Promise<any> {
    return {
      immediateHelp: [
        {
          name: "Campus Crisis Counselor",
          phone: "+91-9876543210",
          available: "24/7",
          type: "immediate"
        },
        {
          name: "National Suicide Prevention Helpline",
          phone: "1562560000",
          available: "24/7",
          type: "national"
        },
        {
          name: "Emergency Services",
          phone: "112",
          available: "24/7",
          type: "emergency"
        }
      ],
      supportGroups: [
        {
          name: "Student Support Group",
          schedule: "Mondays 6 PM",
          location: "Campus Counseling Center"
        },
        {
          name: "Peer Support Circle",
          schedule: "Wednesdays 7 PM",
          location: "Student Activities Building"
        }
      ],
      onlineResources: [
        {
          name: "7 Cups - Free Online Therapy",
          url: "https://www.7cups.com",
          description: "Free emotional support and counseling"
        },
        {
          name: "NIMHANS Helpline",
          phone: "080-26995000",
          description: "Mental health helpline"
        }
      ]
    };
  }

  static async resolveCrisisAlert(alertId: string, resolvedBy: string, notes?: string): Promise<void> {
    try {
      await storage.resolveCrisisAlert(alertId, resolvedBy, notes);
      console.log(`Crisis alert ${alertId} resolved by ${resolvedBy}`);
    } catch (error) {
      console.error("Error resolving crisis alert:", error);
      throw error;
    }
  }
}
