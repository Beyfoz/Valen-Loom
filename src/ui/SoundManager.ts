// WebAudio procedural sound synthesizer - MUTED completely by user request
class SoundManagerClass {
  private isMuted: boolean = true;
  private volume: number = 0;

  constructor() {
    this.isMuted = true;
    this.volume = 0;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vaelen_sound_muted', 'true');
        localStorage.setItem('vaelen_sound_volume', '0');
      }
    } catch {}
  }

  public getMuted(): boolean {
    return true;
  }

  public setMuted(_muted: boolean): void {
    this.isMuted = true;
  }

  public getVolume(): number {
    return 0;
  }

  public setVolume(_vol: number): void {
    this.volume = 0;
  }

  public playClick(): void {}
  public playDamage(): void {}
  public playItemChime(): void {}
  public playItemAcquired(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      // Gentle harmonic fantasy chime (D5 -> A5 -> D6)
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.06, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch {}
  }
  public playDiceRoll(): void {}
  public playDiceSuccess(): void {}
  public playLevelUp(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      // Elegant parchment discovery chime (F5 -> A5 -> C6)
      [698.46, 880.0, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.05, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.35);
      });
    } catch {}
  }
  public startAmbient(_worldId: string): void {}
  public stopAmbient(): void {}
}

export const SoundManager = new SoundManagerClass();
