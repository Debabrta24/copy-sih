// Local Music File System Integration

export interface LocalTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  file_url: string;
  file_name: string;
  type: 'local';
}

class LocalMusicManager {
  private musicFolder = '/attached_assets/local_music/';
  private cache = new Map<string, LocalTrack[]>();

  // Scan for music files in the local folder
  async scanMusicFiles(): Promise<LocalTrack[]> {
    try {
      // Check if we have cached results
      const cacheKey = 'local_music_files';
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey) || [];
      }

      // In a real implementation, this would scan the actual filesystem
      // For now, we'll simulate with a check for common music file patterns
      const musicFiles = await this.detectMusicFiles();
      
      const localTracks: LocalTrack[] = musicFiles.map((file, index) => ({
        id: `local_${index + 1}`,
        title: this.extractTitle(file.name),
        artist: this.extractArtist(file.name) || 'Unknown Artist',
        duration: file.duration || '0:00',
        file_url: `${this.musicFolder}${file.name}`,
        file_name: file.name,
        type: 'local'
      }));

      // Cache the results
      this.cache.set(cacheKey, localTracks);
      return localTracks;
    } catch (error) {
      console.error('Error scanning music files:', error);
      return [];
    }
  }

  // Detect music files (simulation - in real app would use filesystem APIs)
  private async detectMusicFiles(): Promise<Array<{name: string; duration?: string}>> {
    try {
      // This would typically use Node.js fs module or similar to read the directory
      // For demo purposes, we'll return empty array but structure is ready
      const response = await fetch('/api/local-music/scan');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('Local music folder empty or not accessible');
    }
    
    return [];
  }

  // Extract title from filename
  private extractTitle(filename: string): string {
    // Remove file extension
    const nameWithoutExt = filename.replace(/\.(mp3|wav|m4a|aac|ogg|flac)$/i, '');
    
    // Handle common patterns like "Artist - Title" or "01 - Title"
    if (nameWithoutExt.includes(' - ')) {
      const parts = nameWithoutExt.split(' - ');
      return parts[parts.length - 1].trim();
    }
    
    // Handle patterns like "01. Title" or "Track01_Title"
    const cleaned = nameWithoutExt
      .replace(/^\d+\.?\s*/, '') // Remove leading numbers
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/([A-Z])/g, ' $1') // Add spaces before capitals
      .trim();
    
    return cleaned || nameWithoutExt;
  }

  // Extract artist from filename
  private extractArtist(filename: string): string | null {
    const nameWithoutExt = filename.replace(/\.(mp3|wav|m4a|aac|ogg|flac)$/i, '');
    
    if (nameWithoutExt.includes(' - ')) {
      const parts = nameWithoutExt.split(' - ');
      if (parts.length >= 2) {
        // Skip track numbers
        const artistPart = parts[0].replace(/^\d+\.?\s*/, '').trim();
        return artistPart || null;
      }
    }
    
    return null;
  }

  // Add a new music file programmatically
  async addMusicFile(file: File): Promise<LocalTrack | null> {
    try {
      // This would upload the file to the local music folder
      // For now, we'll simulate the process
      const formData = new FormData();
      formData.append('musicFile', file);
      
      const response = await fetch('/api/local-music/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Clear cache to force rescan
        this.cache.clear();
        
        return {
          id: `local_${Date.now()}`,
          title: this.extractTitle(file.name),
          artist: this.extractArtist(file.name) || 'Unknown Artist',
          duration: '0:00', // Would be detected from file metadata
          file_url: result.file_url,
          file_name: file.name,
          type: 'local'
        };
      }
    } catch (error) {
      console.error('Error adding music file:', error);
    }
    
    return null;
  }

  // Watch for changes in the music folder (would use filesystem watchers)
  startWatching(callback: (tracks: LocalTrack[]) => void) {
    // This would use filesystem watchers to detect new files
    // For now, we'll poll every 30 seconds
    const pollInterval = setInterval(async () => {
      const tracks = await this.scanMusicFiles();
      callback(tracks);
    }, 30000);

    return () => clearInterval(pollInterval);
  }
}

export const localMusicManager = new LocalMusicManager();