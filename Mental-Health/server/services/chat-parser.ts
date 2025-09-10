export interface ChatMessage {
  timestamp: Date;
  sender: string;
  content: string;
  isMedia: boolean;
}

export interface ConversationPattern {
  keywords: string[];
  responses: string[];
  context: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'supportive' | 'humorous';
  frequency: number;
}

export interface PersonalityTraits {
  name: string;
  commonPhrases: string[];
  responsePatterns: ConversationPattern[];
  communicationStyle: {
    emojis: string[];
    punctuation: string[];
    exclamations: string[];
    questions: string[];
  };
  topics: Map<string, string[]>;
}

export class WhatsAppChatParser {
  
  parseWhatsAppChat(content: string): ChatMessage[] {
    const messages: ChatMessage[] = [];
    const lines = content.split('\n');
    
    // WhatsApp message format: DD/MM/YY, HH:MM - Sender: Message
    const messageRegex = /^(\d{2}\/\d{2}\/\d{2}),\s(\d{1,2}:\d{2}\s(?:am|pm))\s-\s([^:]+):\s(.*)$/i;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and system messages
      if (!trimmedLine || trimmedLine.includes('end-to-end encrypted') || 
          trimmedLine.includes('Messages and calls are')) {
        continue;
      }
      
      const match = trimmedLine.match(messageRegex);
      if (match) {
        const [, datePart, timePart, sender, content] = match;
        
        // Parse date and time
        const [day, month, year] = datePart.split('/').map(Number);
        const [time, period] = timePart.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        // Convert to 24-hour format
        if (period && period.toLowerCase() === 'pm' && hours !== 12) {
          hours += 12;
        } else if (period && period.toLowerCase() === 'am' && hours === 12) {
          hours = 0;
        }
        
        const fullYear = year < 50 ? 2000 + year : 1900 + year;
        const timestamp = new Date(fullYear, month - 1, day, hours, minutes);
        
        const isMedia = content.includes('<Media omitted>') || 
                       content.includes('http') || 
                       content.includes('https://');
        
        messages.push({
          timestamp,
          sender: sender.trim(),
          content: content.trim(),
          isMedia
        });
      }
    }
    
    return messages;
  }

  analyzePersonality(messages: ChatMessage[]): PersonalityTraits {
    const senderGroups = this.groupMessagesBySender(messages);
    const allTraits: PersonalityTraits[] = [];
    
    // Analyze each sender's personality
    senderGroups.forEach((senderMessages, senderName) => {
      const traits = this.extractPersonalityTraits(senderName, senderMessages);
      allTraits.push(traits);
    });
    
    // Combine traits to create a composite personality
    return this.mergePersonalityTraits(allTraits);
  }

  private groupMessagesBySender(messages: ChatMessage[]): Map<string, ChatMessage[]> {
    const grouped = new Map<string, ChatMessage[]>();
    
    for (const message of messages) {
      if (!grouped.has(message.sender)) {
        grouped.set(message.sender, []);
      }
      grouped.get(message.sender)!.push(message);
    }
    
    return grouped;
  }

  private extractPersonalityTraits(name: string, messages: ChatMessage[]): PersonalityTraits {
    const commonPhrases: string[] = [];
    const emojis: string[] = [];
    const punctuation: string[] = [];
    const exclamations: string[] = [];
    const questions: string[] = [];
    const responsePatterns: ConversationPattern[] = [];
    const topics = new Map<string, string[]>();
    
    // Extract common phrases, emojis, and patterns
    const wordFreq = new Map<string, number>();
    const phraseFreq = new Map<string, number>();
    
    for (const message of messages) {
      if (message.isMedia) continue;
      
      const content = message.content.toLowerCase();
      
      // Extract common emoji characters (simplified approach)
      const emojiMatches = content.match(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu);
      if (emojiMatches) {
        emojis.push(...emojiMatches);
      }
      
      // Extract punctuation patterns
      if (content.includes('...') || content.includes('....')) {
        punctuation.push('...');
      }
      if (content.includes('!!')) {
        punctuation.push('!!');
      }
      if (content.includes('??')) {
        punctuation.push('??');
      }
      
      // Extract exclamations and questions
      if (content.includes('!')) {
        const exclamationWords = content.match(/\w+!/g);
        if (exclamationWords) exclamations.push(...exclamationWords);
      }
      
      if (content.includes('?')) {
        questions.push(content);
      }
      
      // Extract common words and phrases
      const words = content.split(' ').filter(w => w.length > 2);
      words.forEach(word => {
        const clean = word.replace(/[^\w\s]/g, '');
        if (clean) {
          wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1);
        }
      });
      
      // Extract 2-3 word phrases
      for (let i = 0; i < words.length - 1; i++) {
        const phrase = words.slice(i, i + 2).join(' ');
        phraseFreq.set(phrase, (phraseFreq.get(phrase) || 0) + 1);
      }
      
      // Topic detection (simple keyword-based)
      this.detectTopics(content, topics);
    }
    
    // Get most common phrases
    const sortedPhrases = Array.from(phraseFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .filter(([phrase, freq]) => freq > 1)
      .map(([phrase]) => phrase);
    
    commonPhrases.push(...sortedPhrases);
    
    // Create response patterns
    responsePatterns.push(...this.createResponsePatterns(messages));
    
    return {
      name,
      commonPhrases: commonPhrases.slice(0, 15),
      responsePatterns,
      communicationStyle: {
        emojis: Array.from(new Set(emojis)).slice(0, 10),
        punctuation: Array.from(new Set(punctuation)),
        exclamations: Array.from(new Set(exclamations)).slice(0, 10),
        questions: questions.slice(0, 5)
      },
      topics
    };
  }

  private detectTopics(content: string, topics: Map<string, string[]>): void {
    const topicKeywords = {
      'study': ['study', 'exam', 'test', 'assignment', 'homework', 'class', 'teacher', 'sir', 'college', 'clg'],
      'tech': ['coding', 'development', 'programming', 'website', 'app', 'frontend', 'backend', 'react', 'javascript', 'dsa'],
      'health': ['jor', 'fever', 'sick', 'doctor', 'medicine', 'health', 'hospital'],
      'social': ['friend', 'family', 'party', 'meeting', 'call', 'chat', 'talk'],
      'work': ['job', 'work', 'project', 'team', 'hackathon', 'startup', 'career'],
      'personal': ['feeling', 'happy', 'sad', 'worried', 'excited', 'tired', 'stressed']
    };
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      for (const keyword of keywords) {
        if (content.includes(keyword)) {
          if (!topics.has(topic)) {
            topics.set(topic, []);
          }
          topics.get(topic)!.push(content);
          break;
        }
      }
    }
  }

  private createResponsePatterns(messages: ChatMessage[]): ConversationPattern[] {
    const patterns: ConversationPattern[] = [];
    
    // Analyze message pairs to find response patterns
    for (let i = 0; i < messages.length - 1; i++) {
      const currentMsg = messages[i];
      const nextMsg = messages[i + 1];
      
      if (currentMsg.isMedia || nextMsg.isMedia) continue;
      
      // Simple pattern matching for common conversation flows
      const keywords = this.extractKeywords(currentMsg.content);
      const response = nextMsg.content;
      
      if (keywords.length > 0) {
        const existingPattern = patterns.find(p => 
          p.keywords.some(k => keywords.includes(k))
        );
        
        if (existingPattern) {
          existingPattern.responses.push(response);
          existingPattern.frequency++;
        } else {
          patterns.push({
            keywords,
            responses: [response],
            context: [currentMsg.content],
            sentiment: this.analyzeSentiment(response),
            frequency: 1
          });
        }
      }
    }
    
    return patterns.filter(p => p.frequency > 1);
  }

  private extractKeywords(content: string): string[] {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return content
      .toLowerCase()
      .split(' ')
      .filter(word => 
        word.length > 2 && 
        !stopWords.includes(word) && 
        /^[a-zA-Z]+$/.test(word)
      )
      .slice(0, 5);
  }

  private analyzeSentiment(content: string): 'positive' | 'negative' | 'neutral' | 'supportive' | 'humorous' {
    const positiveWords = ['good', 'great', 'awesome', 'nice', 'excellent', 'thank', 'thanks', 'wow', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'sad', 'worry', 'problem'];
    const supportiveWords = ['help', 'support', 'care', 'understand', 'sorry', 'there'];
    const humorousWords = ['lol', 'haha', 'funny', 'joke', 'laugh'];
    
    const lowerContent = content.toLowerCase();
    
    if (humorousWords.some(word => lowerContent.includes(word)) || lowerContent.includes('😂')) {
      return 'humorous';
    }
    if (supportiveWords.some(word => lowerContent.includes(word))) {
      return 'supportive';
    }
    if (positiveWords.some(word => lowerContent.includes(word))) {
      return 'positive';
    }
    if (negativeWords.some(word => lowerContent.includes(word))) {
      return 'negative';
    }
    
    return 'neutral';
  }

  private mergePersonalityTraits(traits: PersonalityTraits[]): PersonalityTraits {
    if (traits.length === 0) {
      return {
        name: 'Custom AI',
        commonPhrases: [],
        responsePatterns: [],
        communicationStyle: {
          emojis: [],
          punctuation: [],
          exclamations: [],
          questions: []
        },
        topics: new Map()
      };
    }
    
    if (traits.length === 1) {
      return traits[0];
    }
    
    // Merge multiple personalities (taking the most active sender as primary)
    const primary = traits.reduce((prev, current) => 
      current.responsePatterns.length > prev.responsePatterns.length ? current : prev
    );
    
    // Combine common elements from other personalities
    const allPhrases = traits.flatMap(t => t.commonPhrases);
    const allEmojis = traits.flatMap(t => t.communicationStyle.emojis);
    const allPatterns = traits.flatMap(t => t.responsePatterns);
    
    return {
      ...primary,
      name: 'Custom AI (Multi-personality)',
      commonPhrases: Array.from(new Set(allPhrases)).slice(0, 20),
      responsePatterns: allPatterns,
      communicationStyle: {
        ...primary.communicationStyle,
        emojis: Array.from(new Set(allEmojis)).slice(0, 15)
      }
    };
  }
}