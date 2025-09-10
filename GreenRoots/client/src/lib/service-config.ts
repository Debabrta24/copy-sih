export interface ServiceConfig {
  selectedService: 'gemini' | 'chatgpt' | 'google-search';
  serviceMode: 'api' | 'realtime';
  timestamp: number;
}

const SERVICE_CONFIG_KEY = 'agreeGrowServiceConfig';

export class ServiceConfigManager {
  static getConfig(): ServiceConfig | null {
    try {
      const stored = localStorage.getItem(SERVICE_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      // Failed to parse service config
    }
    return null;
  }

  static setConfig(config: ServiceConfig): void {
    try {
      localStorage.setItem(SERVICE_CONFIG_KEY, JSON.stringify(config));
    } catch (error) {
      // Failed to save service config
    }
  }

  static getDefaultConfig(): ServiceConfig {
    return {
      selectedService: 'gemini',
      serviceMode: 'realtime',
      timestamp: Date.now()
    };
  }

  static getCurrentConfig(): ServiceConfig {
    return this.getConfig() || this.getDefaultConfig();
  }

  static async saveConfigToBackend(config: ServiceConfig): Promise<boolean> {
    try {
      const response = await fetch('/api/service-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        this.setConfig(config);
        return true;
      } else {
        // Failed to save config to backend
        return false;
      }
    } catch (error) {
      // Error saving config to backend
      return false;
    }
  }

  static async loadConfigFromBackend(): Promise<ServiceConfig> {
    try {
      const response = await fetch('/api/service-config');
      if (response.ok) {
        const config = await response.json();
        this.setConfig(config);
        return config;
      }
    } catch (error) {
      // Failed to load config from backend
    }
    
    return this.getCurrentConfig();
  }

  static getServiceDisplayName(service: string): string {
    switch (service) {
      case 'gemini':
        return 'Google Gemini';
      case 'chatgpt':
        return 'ChatGPT (OpenAI)';
      case 'google-search':
        return 'Google Real-time Search';
      default:
        return 'Unknown Service';
    }
  }

  static getModeDisplayName(mode: string): string {
    switch (mode) {
      case 'api':
        return 'API Mode';
      case 'realtime':
        return 'Real-time Mode';
      default:
        return 'Unknown Mode';
    }
  }

  static isAPIKeyRequired(service: string, mode: string): boolean {
    return mode === 'api' && (service === 'gemini' || service === 'chatgpt');
  }

  static getServiceIcon(service: string): string {
    switch (service) {
      case 'gemini':
        return '🧠';
      case 'chatgpt':
        return '💬';
      case 'google-search':
        return '🌐';
      default:
        return '🤖';
    }
  }

  static getModeIcon(mode: string): string {
    switch (mode) {
      case 'api':
        return '🔑';
      case 'realtime':
        return '⚡';
      default:
        return '⚙️';
    }
  }
}