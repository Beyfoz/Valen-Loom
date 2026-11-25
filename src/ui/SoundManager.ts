// WebAudio procedural sound synthesizer (muted by default; respects Settings mute/volume)
class SoundManagerClass {
  private isMuted: boolean = true;
  private volume: number = 0.5;
  private audioCtx: AudioContext | null = null;

  constructor() {
    try {
      if (typeof localStorage !== 'undefined') {
        const storedMuted = localStorage.getItem('vaelen_sound_muted');
        this.isMuted = storedMuted === null ? true : storedMuted !== 'false';
        const storedVol = parseFloat(localStorage.getItem('vaelen_sound_volume') || '');
        if (Number.isFinite(storedVol) && storedVol >= 0 && storedVol <= 1) {
          this.volume = storedVol;
        }
      }
    } catch {}
  }

  private getAudioContext(): AudioContext | null {
    if (this.isMuted || this.volume <= 0 || typeof window === 'undefined') return null;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!this.audioCtx || this.audioCtx.state === 'closed') {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }
      return this.audioCtx;
    } catch {
      return null;
    }
  }

  private playToneSequence(
    notes: number[],
    type: OscillatorType,
    stepSec: number,
    durationSec: number,
    peakGain: number
  ): void {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const effectiveGain = Math.max(0.001, peakGain * this.volume);
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + idx * stepSec);
        gain.gain.setValueAtTime(effectiveGain, now + idx * stepSec);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * stepSec + durationSec);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * stepSec);
        osc.stop(now + idx * stepSec + durationSec + 0.05);
      });
    } catch {}
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vaelen_sound_muted', String(muted));
      }
    } catch {}
    if (!muted && this.volume === 0) {
      this.setVolume(0.5);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(vol) ? vol : 0.5));
    this.volume = clamped;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('vaelen_sound_volume', String(clamped));
      }
    } catch {}
  }

  public playClick(): void {
    this.playToneSequence([420], 'sine', 0, 0.06, 0.03);
  }

  public playDamage(): void {
    this.playToneSequence([180, 120], 'sawtooth', 0.06, 0.18, 0.05);
  }

  public playItemChime(): void {
    this.playToneSequence([523.25, 659.25], 'sine', 0.08, 0.22, 0.05);
  }

  public playItemAcquired(): void {
    // Gentle harmonic fantasy chime (D5 -> A5 -> D6)
    this.playToneSequence([587.33, 880, 1174.66], 'sine', 0.1, 0.35, 0.06);
  }

  public playDiceRoll(): void {
    this.playToneSequence([320, 410, 360], 'triangle', 0.05, 0.08, 0.04);
  }

  public playDiceSuccess(): void {
    this.playToneSequence([523.25, 659.25, 783.99], 'triangle', 0.08, 0.28, 0.06);
  }

  public playLevelUp(): void {
    // Elegant parchment discovery chime (F5 -> A5 -> C6)
    this.playToneSequence([698.46, 880.0, 1046.5], 'triangle', 0.09, 0.32, 0.05);
  }

  public startAmbient(_worldId: string): void {}
  public stopAmbient(): void {}
}

export const SoundManager = new SoundManagerClass();
