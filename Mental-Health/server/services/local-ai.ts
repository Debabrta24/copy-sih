import { WhatsAppChatParser, PersonalityTraits, ConversationPattern } from './chat-parser';

export interface LocalAIResponse {
  message: string;
  supportiveActions: string[];
  riskLevel: "low" | "moderate" | "high";
  escalationRequired: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: Date;
}

export class LocalAIService {
  private personality?: PersonalityTraits;
  private parser = new WhatsAppChatParser();

  constructor(chatData?: string) {
    if (chatData) {
      this.learnFromChat(chatData);
    }
  }

  learnFromChat(chatContent: string): void {
    try {
      const messages = this.parser.parseWhatsAppChat(chatContent);
      this.personality = this.parser.analyzePersonality(messages);
      console.log(`Learned personality: ${this.personality.name} with ${this.personality.responsePatterns.length} response patterns`);
    } catch (error) {
      console.error('Failed to learn from chat:', error);
      this.personality = undefined;
    }
  }

  generateResponse(messages: ChatMessage[]): LocalAIResponse {
    if (!this.personality) {
      return this.getDefaultResponse();
    }

    const userMessage = messages[messages.length - 1]?.content || '';
    const conversationHistory = messages.slice(-5); // Last 5 messages for context
    
    // Find matching response pattern
    const matchingPattern = this.findBestMatchingPattern(userMessage);
    
    // Generate response based on personality
    let responseMessage = '';
    
    if (matchingPattern) {
      responseMessage = this.generatePatternBasedResponse(matchingPattern, userMessage);
    } else {
      responseMessage = this.generatePersonalityBasedResponse(userMessage, conversationHistory);
    }

    // Add personality touches (emojis, expressions)
    responseMessage = this.addPersonalityTouches(responseMessage);

    const supportiveActions = this.generateSupportiveActions(userMessage);
    const riskLevel = this.assessRiskLevel(userMessage);

    return {
      message: responseMessage,
      supportiveActions,
      riskLevel,
      escalationRequired: riskLevel === 'high'
    };
  }

  private findBestMatchingPattern(userMessage: string): ConversationPattern | null {
    if (!this.personality?.responsePatterns) return null;

    const messageLower = userMessage.toLowerCase();
    const messageWords = messageLower.split(' ');
    
    let bestMatch: ConversationPattern | null = null;
    let bestScore = 0;

    for (const pattern of this.personality.responsePatterns) {
      let score = 0;
      
      // Check keyword matches
      for (const keyword of pattern.keywords) {
        if (messageLower.includes(keyword.toLowerCase())) {
          score += 2; // Exact keyword match gets higher score
        }
        
        // Check for word boundaries to avoid partial matches
        for (const word of messageWords) {
          if (word === keyword.toLowerCase()) {
            score += 3;
          }
        }
      }
      
      // Consider frequency of pattern
      score += pattern.frequency * 0.5;
      
      if (score > bestScore && score > 2) {
        bestScore = score;
        bestMatch = pattern;
      }
    }

    return bestMatch;
  }

  private generatePatternBasedResponse(pattern: ConversationPattern, userMessage: string): string {
    // Select a random response from the pattern
    const responses = pattern.responses.filter(r => r.trim().length > 0);
    if (responses.length === 0) {
      return this.generatePersonalityBasedResponse(userMessage, []);
    }

    let selectedResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Apply personality modifications based on sentiment
    selectedResponse = this.modifyResponseBySentiment(selectedResponse, pattern.sentiment);
    
    return selectedResponse;
  }

  private generatePersonalityBasedResponse(userMessage: string, conversationHistory: ChatMessage[]): string {
    if (!this.personality) {
      return "I'm here to chat with you! What's on your mind?";
    }

    const messageLower = userMessage.toLowerCase();
    
    // Check for topics the personality is familiar with
    let topicResponse = '';
    for (const [topic, examples] of this.personality.topics.entries()) {
      const topicKeywords = this.getTopicKeywords(topic);
      if (topicKeywords.some(keyword => messageLower.includes(keyword))) {
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        topicResponse = this.createTopicResponse(topic, randomExample, userMessage);
        break;
      }
    }

    if (topicResponse) {
      return topicResponse;
    }

    // Generate response using common phrases
    return this.generateCommonPhraseResponse(userMessage);
  }

  private getTopicKeywords(topic: string): string[] {
    const topicKeywords: Record<string, string[]> = {
      'study': ['study', 'exam', 'test', 'assignment', 'homework', 'class', 'teacher', 'sir', 'college', 'clg'],
      'tech': ['coding', 'development', 'programming', 'website', 'app', 'frontend', 'backend', 'react', 'javascript', 'dsa'],
      'health': ['jor', 'fever', 'sick', 'doctor', 'medicine', 'health', 'hospital', 'feeling', 'tired'],
      'social': ['friend', 'family', 'party', 'meeting', 'call', 'chat', 'talk', 'relationship'],
      'work': ['job', 'work', 'project', 'team', 'hackathon', 'startup', 'career', 'interview'],
      'personal': ['feeling', 'happy', 'sad', 'worried', 'excited', 'tired', 'stressed', 'mood']
    };
    
    return topicKeywords[topic] || [];
  }

  private createTopicResponse(topic: string, example: string, userMessage: string): string {
    const responses: Record<string, string[]> = {
      'study': [
        "Oh, studies! I totally get that stress. How are your classes going?",
        "Studies can be really overwhelming sometimes. What subject is giving you trouble?",
        "College life is tough! I remember feeling the same way about exams.",
        "Don't worry too much about it, you'll do fine! What's your biggest concern?"
      ],
      'tech': [
        "Nice! I love talking about tech stuff. What are you working on?",
        "Programming can be really exciting! Which technology are you learning?",
        "That sounds interesting! I've been into web development too.",
        "Cool project! How's the coding going?"
      ],
      'health': [
        "Take care of yourself! Health is most important. How are you feeling now?",
        "Oh no, that doesn't sound good. Have you seen a doctor?",
        "Rest is really important. Make sure you're taking care of yourself.",
        "Feel better soon! Let me know if you need anything."
      ],
      'social': [
        "That sounds fun! I love hearing about social stuff.",
        "Friends and family are so important. How did it go?",
        "Social time is the best! Tell me more about it.",
        "That sounds really nice. I hope you had a good time!"
      ],
      'work': [
        "Work stuff can be stressful. How's everything going?",
        "Career things are always on my mind too. What's your plan?",
        "That sounds like a great opportunity! Are you excited?",
        "Job hunting is tough. You've got this though!"
      ],
      'personal': [
        "I'm here to listen. How are you really doing?",
        "Feelings can be complicated. Want to talk about it?",
        "That's totally understandable. I get those feelings too.",
        "Thanks for sharing that with me. How can I help?"
      ]
    };

    const topicResponses = responses[topic] || ["That's interesting! Tell me more."];
    return topicResponses[Math.floor(Math.random() * topicResponses.length)];
  }

  private generateCommonPhraseResponse(userMessage: string): string {
    if (!this.personality?.commonPhrases || this.personality.commonPhrases.length === 0) {
      return "I'm here to chat! What's going on?";
    }

    const greetings = ["Hey!", "Hi there!", "Hello!", "What's up?"];
    const transitions = ["So", "Well", "Actually", "By the way", "Oh"];
    const supportive = ["I understand", "That makes sense", "I get it", "Totally"];
    
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    const transition = transitions[Math.floor(Math.random() * transitions.length)];
    const support = supportive[Math.floor(Math.random() * supportive.length)];
    
    // Mix personality phrases with supportive language
    const phrase = this.personality.commonPhrases[Math.floor(Math.random() * this.personality.commonPhrases.length)];
    
    return `${greeting} ${support}. ${transition}, ${phrase} What's on your mind?`;
  }

  private modifyResponseBySentiment(response: string, sentiment: string): string {
    switch (sentiment) {
      case 'humorous':
        return response + ' 😄';
      case 'supportive':
        return response + ' I\'m here for you!';
      case 'positive':
        return response + ' ✨';
      case 'negative':
        if (!response.includes('sorry') && !response.includes('understand')) {
          return 'I understand that might be tough. ' + response;
        }
        return response;
      default:
        return response;
    }
  }

  private addPersonalityTouches(message: string): string {
    if (!this.personality?.communicationStyle) return message;

    let touchedMessage = message;
    
    // Add emojis occasionally
    if (Math.random() < 0.3 && this.personality.communicationStyle.emojis.length > 0) {
      const randomEmoji = this.personality.communicationStyle.emojis[
        Math.floor(Math.random() * this.personality.communicationStyle.emojis.length)
      ];
      touchedMessage += ' ' + randomEmoji;
    }
    
    // Add punctuation style
    if (Math.random() < 0.2 && this.personality.communicationStyle.punctuation.length > 0) {
      const punctuation = this.personality.communicationStyle.punctuation[
        Math.floor(Math.random() * this.personality.communicationStyle.punctuation.length)
      ];
      if (punctuation === '...' && !touchedMessage.endsWith('.')) {
        touchedMessage = touchedMessage.replace(/[.!?]$/, punctuation);
      }
    }

    return touchedMessage;
  }

  private generateSupportiveActions(userMessage: string): string[] {
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('stress') || messageLower.includes('worried') || messageLower.includes('anxious')) {
      return [
        "Take 5 deep breaths slowly",
        "Try a short 10-minute walk",
        "Talk to someone you trust about how you're feeling"
      ];
    }
    
    if (messageLower.includes('study') || messageLower.includes('exam') || messageLower.includes('test')) {
      return [
        "Create a study schedule to break down your work",
        "Take regular breaks every 45 minutes",
        "Find a quiet study space without distractions"
      ];
    }
    
    if (messageLower.includes('tired') || messageLower.includes('sick') || messageLower.includes('jor')) {
      return [
        "Get plenty of rest and sleep",
        "Stay hydrated with water",
        "Consider consulting a doctor if symptoms persist"
      ];
    }
    
    if (messageLower.includes('friend') || messageLower.includes('social') || messageLower.includes('lonely')) {
      return [
        "Reach out to a close friend for a chat",
        "Join a group activity or club that interests you",
        "Practice small social interactions to build confidence"
      ];
    }

    // Default supportive actions
    return [
      "Take a moment to appreciate something positive in your day",
      "Do something small that makes you happy",
      "Remember that it's okay to ask for help when you need it"
    ];
  }

  private assessRiskLevel(userMessage: string): "low" | "moderate" | "high" {
    const messageLower = userMessage.toLowerCase();
    
    // High risk indicators
    const highRiskWords = ['suicide', 'kill myself', 'end it all', 'cant go on', 'no point', 'worthless', 'hopeless'];
    const moderateRiskWords = ['depressed', 'very sad', 'cant handle', 'overwhelmed', 'breaking down', 'giving up'];
    const stressWords = ['stressed', 'worried', 'anxious', 'nervous', 'scared', 'tired'];
    
    if (highRiskWords.some(word => messageLower.includes(word))) {
      return 'high';
    }
    
    if (moderateRiskWords.some(word => messageLower.includes(word))) {
      return 'moderate';
    }
    
    if (stressWords.some(word => messageLower.includes(word))) {
      return 'moderate';
    }
    
    return 'low';
  }

  private getDefaultResponse(): LocalAIResponse {
    const supportiveResponses = [
      "Hi! I'm your personalized AI companion. I'm here to listen and support you. What's on your mind today?",
      "Hello! I'm learning to be your perfect conversation partner. How are you feeling right now?",
      "Hey there! I'm your custom AI assistant, ready to chat about whatever you'd like to share.",
      "Hi! I'm here to provide a safe space for conversation. What would you like to talk about?",
      "Hello! As your personalized AI, I'm here to listen and help however I can. How's your day going?"
    ];
    
    return {
      message: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
      supportiveActions: [
        "Share what's been on your mind lately",
        "Take a few deep breaths to center yourself", 
        "Think of one positive thing from your day",
        "Try a quick mindfulness exercise",
        "Consider talking to someone you trust"
      ],
      riskLevel: "low",
      escalationRequired: false
    };
  }

  getPersonalityInfo(): PersonalityTraits | undefined {
    return this.personality;
  }

  hasLearned(): boolean {
    return !!this.personality;
  }
}