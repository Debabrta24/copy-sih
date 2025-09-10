// Free Music API integration using Deezer API (no authentication required)

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: string;
  preview_url?: string;
  cover_art?: string;
  type: 'api' | 'ambient';
}

class MusicAPI {
  private baseUrl = 'https://api.deezer.com';

  async searchTracks(query: string): Promise<Track[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}&limit=20`);
      const data = await response.json();
      
      if (data.error) {
        console.error('Deezer API Error:', data.error);
        return [];
      }

      return data.data?.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: this.formatDuration(track.duration),
        preview_url: track.preview,
        cover_art: track.album.cover_medium,
        type: 'api' as const
      })) || [];
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return [];
    }
  }

  async getPopularTracks(genre?: string): Promise<Track[]> {
    try {
      // Get chart tracks (popular music)
      const response = await fetch(`${this.baseUrl}/chart/0/tracks?limit=20`);
      const data = await response.json();

      return data.data?.map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: this.formatDuration(track.duration),
        preview_url: track.preview,
        cover_art: track.album.cover_medium,
        type: 'api' as const
      })) || [];
    } catch (error) {
      console.error('Error fetching popular tracks:', error);
      return [];
    }
  }

  async getTracksByMood(mood: 'relaxing' | 'energetic' | 'focused' | 'happy'): Promise<Track[]> {
    const moodQueries = {
      relaxing: 'relaxing meditation calm peaceful',
      energetic: 'upbeat energetic motivational',
      focused: 'instrumental focus concentration study',
      happy: 'happy positive uplifting cheerful'
    };

    return this.searchTracks(moodQueries[mood]);
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // CORS workaround using JSONP (if needed)
  async searchTracksWithCORS(query: string): Promise<Track[]> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      const callbackName = `deezer_callback_${Date.now()}`;
      
      (window as any)[callbackName] = (data: any) => {
        const tracks = data.data?.map((track: any) => ({
          id: track.id.toString(),
          title: track.title,
          artist: track.artist.name,
          album: track.album.title,
          duration: this.formatDuration(track.duration),
          preview_url: track.preview,
          cover_art: track.album.cover_medium,
          type: 'api' as const
        })) || [];
        
        resolve(tracks);
        document.head.removeChild(script);
        delete (window as any)[callbackName];
      };

      script.src = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp&callback=${callbackName}`;
      document.head.appendChild(script);
    });
  }
}

export const musicAPI = new MusicAPI();