// Ambient music generator using Web Audio API
export class AmbientMusicGenerator {
  private audioContext: AudioContext | null = null;
  private isPlaying = false;
  private currentNodes: AudioNode[] = [];
  private currentTrack: string | null = null;
  
  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  private createOscillator(frequency: number, type: OscillatorType = 'sine', volume: number = 0.1) {
    if (!this.audioContext) return null;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gainNode.gain.value = volume;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    this.currentNodes.push(oscillator, gainNode);
    return { oscillator, gainNode };
  }

  private createNoiseSource(volume: number = 0.05) {
    if (!this.audioContext) return null;
    
    const bufferSize = this.audioContext.sampleRate * 2;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const filterNode = this.audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    gainNode.gain.value = volume;
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 800;
    
    noiseSource.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    this.currentNodes.push(noiseSource, gainNode, filterNode);
    return { noiseSource, gainNode, filterNode };
  }

  async playOceanWaves() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    this.stop();
    this.currentTrack = 'ocean';
    this.isPlaying = true;

    // Ocean wave sounds using filtered noise
    const wave1 = this.createNoiseSource(0.03);
    const wave2 = this.createNoiseSource(0.02);
    
    if (wave1) {
      wave1.filterNode.frequency.value = 400;
      wave1.noiseSource.start();
      
      // Modulate volume for wave effect
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.frequency.value = 0.1;
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(wave1.gainNode.gain);
      lfo.start();
      this.currentNodes.push(lfo, lfoGain);
    }
    
    if (wave2) {
      wave2.filterNode.frequency.value = 200;
      wave2.noiseSource.start();
    }
  }

  async playRainfall() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    this.stop();
    this.currentTrack = 'rain';
    this.isPlaying = true;

    // Rain sounds using multiple noise sources
    for (let i = 0; i < 3; i++) {
      const rain = this.createNoiseSource(0.02 + i * 0.01);
      if (rain) {
        rain.filterNode.frequency.value = 1000 + i * 500;
        rain.noiseSource.start();
      }
    }
  }

  async playForest() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    this.stop();
    this.currentTrack = 'forest';
    this.isPlaying = true;

    // Forest ambient with bird sounds
    const wind = this.createNoiseSource(0.01);
    if (wind) {
      wind.filterNode.frequency.value = 600;
      wind.noiseSource.start();
    }

    // Occasional bird chirps
    const chirpInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(chirpInterval);
        return;
      }
      
      if (Math.random() < 0.3) {
        const chirp = this.createOscillator(800 + Math.random() * 1200, 'sine', 0.05);
        if (chirp) {
          chirp.oscillator.start();
          chirp.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.5);
          chirp.oscillator.stop(this.audioContext!.currentTime + 0.5);
        }
      }
    }, 3000);
  }

  async playMeditation() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    this.stop();
    this.currentTrack = 'meditation';
    this.isPlaying = true;

    // Meditation drone with harmonics
    const fundamental = this.createOscillator(110, 'sine', 0.08);
    const third = this.createOscillator(138.6, 'sine', 0.06);
    const fifth = this.createOscillator(164.8, 'sine', 0.04);
    
    if (fundamental) fundamental.oscillator.start();
    if (third) third.oscillator.start();
    if (fifth) fifth.oscillator.start();
  }

  async playFocus() {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    this.stop();
    this.currentTrack = 'focus';
    this.isPlaying = true;

    // Brown noise for focus
    const focus = this.createNoiseSource(0.03);
    if (focus) {
      focus.filterNode.type = 'lowpass';
      focus.filterNode.frequency.value = 300;
      focus.noiseSource.start();
    }

    // Subtle binaural beats
    const left = this.createOscillator(200, 'sine', 0.02);
    const right = this.createOscillator(240, 'sine', 0.02);
    
    if (left && right) {
      left.oscillator.start();
      right.oscillator.start();
    }
  }

  stop() {
    this.isPlaying = false;
    this.currentTrack = null;
    
    this.currentNodes.forEach(node => {
      try {
        if ('stop' in node) {
          (node as AudioScheduledSourceNode).stop();
        } else if ('disconnect' in node) {
          node.disconnect();
        }
      } catch (e) {
        // Node might already be stopped/disconnected
      }
    });
    
    this.currentNodes = [];
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getCurrentTrack() {
    return this.currentTrack;
  }

  setVolume(volume: number) {
    // Volume is controlled per track creation
    // This would require more complex implementation to adjust existing tracks
  }
}

export const ambientMusic = new AmbientMusicGenerator();