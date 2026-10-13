// ── Den Den Mushi Web Audio Synthesizer (Zero dependencies, 100% reliable) ──

class CallAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.ringInterval = null;
    this.isPlaying = false;
  }

  getAudioContext() {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play authentic Den Den Mushi "puru-puru-puru" ringing pattern
  startIncomingRingtone() {
    this.stopAll();
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.isPlaying = true;

    const playPuruCycle = () => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;

      // 3 warbling bursts ("puru... puru... puru...")
      const bursts = [0, 0.32, 0.64];
      bursts.forEach((offset) => {
        const start = now + offset;
        const duration = 0.24;

        // Carrier oscillator
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(560, start);

        // Vibrato / frequency modulation for the warble
        const mod = ctx.createOscillator();
        mod.type = 'sine';
        mod.frequency.setValueAtTime(22, start);

        const modGain = ctx.createGain();
        modGain.gain.setValueAtTime(45, start);

        mod.connect(osc.frequency);

        // Master gain for envelope
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, start);
        gain.gain.exponentialRampToValueAtTime(0.35, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.25, start + duration - 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        mod.start(start);
        osc.start(start);
        mod.stop(start + duration);
        osc.stop(start + duration);
      });
    };

    // Play immediately and repeat every 2.4 seconds
    playPuruCycle();
    this.ringInterval = setInterval(() => {
      if (this.isPlaying) playPuruCycle();
    }, 2400);
  }

  // Play outgoing ringing tone for the caller (standard nautical chime)
  startOutgoingRing() {
    this.stopAll();
    const ctx = this.getAudioContext();
    if (!ctx) return;
    this.isPlaying = true;

    const playOutgoingChime = () => {
      if (!this.isPlaying) return;
      const now = ctx.currentTime;
      const duration = 1.1;

      [440, 480].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.12, now + duration - 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    };

    playOutgoingChime();
    this.ringInterval = setInterval(() => {
      if (this.isPlaying) playOutgoingChime();
    }, 2800);
  }

  // Play classic Den Den Mushi "Gacha!" receiver click sound
  playGachaSound() {
    const ctx = this.getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Shell snap click
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  stopAll() {
    this.isPlaying = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }
}

export const callAudio = new CallAudioEngine();
