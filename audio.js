// audio.js — Web Audio API BGM/効果音
class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.bgmInterval = null;
    this.bgmTimeout = null;
    this.enabled = true;
    this.currentBGM = null;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.25;
      this.masterGain.connect(this.ctx.destination);
    } catch(e) {
      this.enabled = false;
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  _note(freq, start, dur, type = 'square', vol = 0.3) {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.connect(g); g.connect(this.masterGain);
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.01);
  }

  stopBGM() {
    if (this.bgmInterval) { clearInterval(this.bgmInterval); this.bgmInterval = null; }
    if (this.bgmTimeout) { clearTimeout(this.bgmTimeout); this.bgmTimeout = null; }
    this.currentBGM = null;
  }

  // エリアIDに応じたフィールドBGMを再生
  playAreaBGM(areaId) {
    if (!this.enabled) return;
    const bgmMap = {
      area_01: () => this.playFieldBGM(),
      area_02: () => this._playCaveBGM(),
      area_03: () => this._playMountainBGM(),
      area_04: () => this._playIceBGM(),
      area_05: () => this._playDesertBGM(),
      area_06: () => this._playCoastBGM(),
      area_07: () => this._playForestBGM(),
      area_08: () => this._playCorridorBGM(),
      area_09: () => this._playMazeBGM(),
      area_10: () => this._playValleyBGM(),
      area_11: () => this._playMistBGM(),
      area_12: () => this._playRockBGM(),
      area_13: () => this._playAbyssBGM(),
      area_14: () => this._playHallBGM(),
      area_15: () => this._playBridgeBGM(),
      area_16: () => this._playTempleBGM(),
    };
    const fn = bgmMap[areaId];
    if (fn) fn(); else this.playFieldBGM();
  }

  // ===== area_01: 大腿の草原（明るいメロディ） =====
  playFieldBGM() {
    if (!this.enabled) return;
    this.stopBGM();
    this.currentBGM = 'field';
    const melody = [
      392,0, 440,0, 494,0, 523,0, 494,0, 440,0,
      392,0, 330,0, 349,0, 392,0, 440,0, 494,0,
      523,0, 587,0, 523,0, 494,0
    ];
    const bass = [196,0,220,0,247,0,262,0,247,0,220,0,196,0,165,0,175,0,196,0,220,0,247,0,262,0,294,0,262,0,247,0];
    const tempo = 0.18;
    const playLoop = () => {
      if (this.currentBGM !== 'field') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.85, 'square', 0.15);
      });
      bass.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 1.8, 'triangle', 0.1);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_02: 内転筋の洞窟（暗く重厚） =====
  _playCaveBGM() {
    this.stopBGM();
    this.currentBGM = 'cave';
    const melody = [
      220,0, 0,0, 207,0, 0,0, 196,0, 0,0, 185,0,
      196,0, 0,0, 220,0, 0,0, 207,0, 0,0, 196,0, 0,0,
    ];
    const bass = [55,0,0,0,0,0,0,0, 52,0,0,0,0,0,0,0, 49,0,0,0,0,0,0,0, 46,0,0,0,0,0,0,0];
    const tempo = 0.22;
    const playLoop = () => {
      if (this.currentBGM !== 'cave') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 1.2, 'sawtooth', 0.12);
      });
      bass.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 3.5, 'triangle', 0.15);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_03: 胸郭の山岳（力強い） =====
  _playMountainBGM() {
    this.stopBGM();
    this.currentBGM = 'mountain';
    const melody = [
      330,0, 392,0, 330,0, 294,0,
      330,0, 440,0, 392,0, 0,0,
      349,0, 415,0, 349,0, 311,0,
      349,0, 466,0, 415,0, 0,0,
    ];
    const tempo = 0.16;
    const playLoop = () => {
      if (this.currentBGM !== 'mountain') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.75, 'square', 0.14);
      });
      // ドラムっぽいパーカッション
      for (let i = 0; i < 4; i++) {
        this._note(80, now + i * tempo * 4, 0.05, 'sawtooth', 0.18);
        this._note(60, now + i * tempo * 4 + tempo * 2, 0.04, 'sawtooth', 0.12);
      }
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_04: 肩の氷原（静謐・高音） =====
  _playIceBGM() {
    this.stopBGM();
    this.currentBGM = 'ice';
    const melody = [
      1047,0,0,0, 988,0,0,0, 1047,0,0,0, 880,0,0,0,
      784,0,0,0,  880,0,0,0, 988,0,0,0,  784,0,0,0,
    ];
    const pad = [262,0,0,0, 247,0,0,0, 262,0,0,0, 220,0,0,0, 196,0,0,0, 220,0,0,0, 247,0,0,0, 196,0,0,0];
    const tempo = 0.20;
    const playLoop = () => {
      if (this.currentBGM !== 'ice') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 2.5, 'sine', 0.08);
      });
      pad.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 3.5, 'triangle', 0.10);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_05: 骨盤の砂漠（揺れるリズム） =====
  _playDesertBGM() {
    this.stopBGM();
    this.currentBGM = 'desert';
    const melody = [
      392,0, 415,0, 392,0, 370,0, 392,0, 0,0, 440,0,
      392,0, 370,0, 349,0, 330,0, 349,0, 0,0, 392,0,
    ];
    const tempo = 0.19;
    const playLoop = () => {
      if (this.currentBGM !== 'desert') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.9, 'sine', 0.13);
      });
      // 低音ベース
      [130,0,0,130,0,0,138,0,0,130,0,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 1.5, 'triangle', 0.12);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_06: 足趾の海岸（波のような揺れ） =====
  _playCoastBGM() {
    this.stopBGM();
    this.currentBGM = 'coast';
    const melody = [
      523,0, 587,0, 659,0, 587,0, 523,0, 494,0,
      523,0, 0,0,   587,0, 659,0, 698,0, 659,0,
      587,0, 523,0, 494,0, 523,0,
    ];
    const tempo = 0.21;
    const playLoop = () => {
      if (this.currentBGM !== 'coast') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 1.1, 'sine', 0.11);
      });
      [131,0,0,0,0,0, 147,0,0,0,0,0, 131,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 4, 'triangle', 0.13);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_07: 帽状腱膜の霧の森（神秘的） =====
  _playForestBGM() {
    this.stopBGM();
    this.currentBGM = 'forest';
    const melody = [
      466,0,0, 440,0,0, 415,0,0, 466,0,0,
      494,0,0, 466,0,0, 440,0,0, 494,0,0,
    ];
    const harm = [
      233,0,0, 220,0,0, 207,0,0, 233,0,0,
      247,0,0, 233,0,0, 220,0,0, 247,0,0,
    ];
    const tempo = 0.23;
    const playLoop = () => {
      if (this.currentBGM !== 'forest') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 2.2, 'sine', 0.10);
      });
      harm.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 2.2, 'triangle', 0.08);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_08: 烏口突起の回廊（緊張感・低音） =====
  _playCorridorBGM() {
    this.stopBGM();
    this.currentBGM = 'corridor';
    const melody = [
      220,0, 0,0, 233,0, 0,0, 220,0, 0,0, 207,0,
      196,0, 0,0, 185,0, 0,0, 196,0, 0,0, 220,0, 0,0,
    ];
    const tempo = 0.20;
    const playLoop = () => {
      if (this.currentBGM !== 'corridor') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 1.5, 'sawtooth', 0.11);
      });
      [55,0,0,0,0,0,0,0, 52,0,0,0,0,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 4, 'triangle', 0.14);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_09: 縦隔の迷宮（不思議・深い） =====
  _playMazeBGM() {
    this.stopBGM();
    this.currentBGM = 'maze';
    const melody = [
      311,0,0, 277,0,0, 294,0,0, 311,0,0,
      330,0,0, 311,0,0, 277,0,0, 294,0,0,
    ];
    const tempo = 0.25;
    const playLoop = () => {
      if (this.currentBGM !== 'maze') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 2.8, 'sine', 0.09);
      });
      [78,0,0,0,0,0, 74,0,0,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 5, 'triangle', 0.13);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_10: 下顎の渓谷（渓谷・反響） =====
  _playValleyBGM() {
    this.stopBGM();
    this.currentBGM = 'valley';
    const melody = [
      349,0, 330,0, 311,0, 294,0,
      311,0, 330,0, 349,0, 0,0,
      294,0, 277,0, 262,0, 247,0,
      262,0, 277,0, 294,0, 0,0,
    ];
    const tempo = 0.18;
    const playLoop = () => {
      if (this.currentBGM !== 'valley') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.9, 'square', 0.12);
      });
      [87,0,0,0,0,0,0,0, 82,0,0,0,0,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 3, 'triangle', 0.11);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_11: 腋窩の霧（霧・幻想的） =====
  _playMistBGM() {
    this.stopBGM();
    this.currentBGM = 'mist';
    const melody = [
      523,0,0,0, 494,0,0,0, 466,0,0,0, 523,0,0,0,
      587,0,0,0, 523,0,0,0, 494,0,0,0, 587,0,0,0,
    ];
    const tempo = 0.22;
    const playLoop = () => {
      if (this.currentBGM !== 'mist') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 3.5, 'sine', 0.07);
      });
      [131,0,0,0,0,0,0,0, 147,0,0,0,0,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 6, 'sine', 0.09);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_12: 肩甲胸郭の岩壁（重厚・岩場） =====
  _playRockBGM() {
    this.stopBGM();
    this.currentBGM = 'rock';
    const melody = [
      196,0, 220,0, 196,0, 185,0,
      196,0, 233,0, 220,0, 0,0,
      175,0, 196,0, 175,0, 165,0,
      175,0, 207,0, 196,0, 0,0,
    ];
    const tempo = 0.17;
    const playLoop = () => {
      if (this.currentBGM !== 'rock') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.8, 'sawtooth', 0.13);
      });
      for (let i = 0; i < 4; i++) {
        this._note(65, now + i * tempo * 4, 0.06, 'sawtooth', 0.20);
        this._note(49, now + i * tempo * 4 + tempo * 2, 0.05, 'sawtooth', 0.14);
      }
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_13: 腹膜の深淵（暗黒・不穏） =====
  _playAbyssBGM() {
    this.stopBGM();
    this.currentBGM = 'abyss';
    const melody = [
      185,0, 0,0, 175,0, 0,0, 165,0, 0,0, 156,0,
      165,0, 0,0, 185,0, 0,0, 175,0, 0,0, 165,0, 0,0,
    ];
    const tempo = 0.24;
    const playLoop = () => {
      if (this.currentBGM !== 'abyss') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 1.8, 'sawtooth', 0.10);
      });
      [46,0,0,0,0,0,0,0, 44,0,0,0,0,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 6, 'triangle', 0.16);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_14: 大腰筋の回廊（行進・リズミカル） =====
  _playHallBGM() {
    this.stopBGM();
    this.currentBGM = 'hall';
    const melody = [
      392,0, 440,0, 392,0, 349,0,
      392,0, 466,0, 440,0, 392,0,
      349,0, 392,0, 349,0, 330,0,
      349,0, 415,0, 392,0, 349,0,
    ];
    const tempo = 0.16;
    const playLoop = () => {
      if (this.currentBGM !== 'hall') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.75, 'square', 0.13);
      });
      [98,0,98,0, 87,0,87,0, 98,0,98,0, 87,0,87,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.4, 'sawtooth', 0.18);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_15: 上肢胸郭の橋（壮大・開放的） =====
  _playBridgeBGM() {
    this.stopBGM();
    this.currentBGM = 'bridge';
    const melody = [
      659,0, 784,0, 880,0, 784,0,
      659,0, 587,0, 659,0, 0,0,
      698,0, 784,0, 880,0, 988,0,
      880,0, 784,0, 698,0, 0,0,
    ];
    const tempo = 0.20;
    const playLoop = () => {
      if (this.currentBGM !== 'bridge') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 1.0, 'sine', 0.12);
      });
      [165,0,0,0,0,0,0,0, 175,0,0,0,0,0,0,0].forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 4, 'triangle', 0.12);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // ===== area_16: 足趾の神殿（荘厳・ラストエリア） =====
  _playTempleBGM() {
    this.stopBGM();
    this.currentBGM = 'temple';
    const melody = [
      523,0, 587,0, 659,0, 523,0,
      587,0, 659,0, 784,0, 0,0,
      659,0, 784,0, 880,0, 784,0,
      659,0, 587,0, 523,0, 0,0,
    ];
    const bass = [
      131,0,0,0,0,0,0,0, 147,0,0,0,0,0,0,0,
      165,0,0,0,0,0,0,0, 147,0,0,0,0,0,0,0,
    ];
    const tempo = 0.19;
    const playLoop = () => {
      if (this.currentBGM !== 'temple') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.9, 'square', 0.14);
      });
      bass.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 5, 'triangle', 0.13);
      });
      // 荘厳な和音
      [523, 659].forEach(f => {
        this._note(f, now, tempo * 8, 'sine', 0.06);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // バトルBGM（緊迫したメロディ）
  playBattleBGM() {
    if (!this.enabled) return;
    this.stopBGM();
    this.currentBGM = 'battle';
    const melody = [
      523,0,587,0,659,0,523,0,
      466,0,523,0,587,0,466,0,
      415,0,466,0,523,0,415,0,
      392,0,440,0,494,0,392,0
    ];
    const tempo = 0.14;
    const playLoop = () => {
      if (this.currentBGM !== 'battle') return;
      const now = this.ctx.currentTime;
      melody.forEach((freq, i) => {
        if (freq > 0) this._note(freq, now + i * tempo, tempo * 0.8, 'sawtooth', 0.12);
      });
      this.bgmTimeout = setTimeout(playLoop, melody.length * tempo * 1000);
    };
    playLoop();
  }

  // エンカウント音
  seEncounter() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [100,150,200,300,400,600].forEach((f, i) => {
      this._note(f, now + i * 0.06, 0.08, 'sawtooth', 0.3);
    });
  }

  // 正解音（ファンファーレ強化）
  seCorrect() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [523, 659, 784, 1047].forEach((f, i) => {
      this._note(f, now + i * 0.1, 0.15, 'square', 0.22);
    });
    // 和音
    [659, 784].forEach((f) => {
      this._note(f, now + 0.45, 0.25, 'triangle', 0.12);
    });
  }

  // 不正解音
  seWrong() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [300, 250, 200, 150].forEach((f, i) => {
      this._note(f, now + i * 0.08, 0.1, 'sawtooth', 0.2);
    });
  }

  // レベルアップ音（より豪華に）
  seLevelUp() {
    if (!this.enabled || !this.ctx) return;
    const notes = [392,440,494,523,587,659,784,1047];
    const now = this.ctx.currentTime;
    notes.forEach((f, i) => {
      this._note(f, now + i * 0.08, 0.18, 'square', 0.22);
    });
    // 最後に和音
    [523, 659, 784].forEach((f) => {
      this._note(f, now + notes.length * 0.08, 0.4, 'triangle', 0.15);
    });
  }

  // 歩行音
  seStep() {
    if (!this.enabled || !this.ctx) return;
    this._note(180, this.ctx.currentTime, 0.03, 'triangle', 0.08);
  }

  // エリア遷移SE
  seWarp() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    [300, 400, 500, 600, 700, 800, 1000, 1200].forEach((f, i) => {
      this._note(f, now + i * 0.07, 0.1, 'sine', 0.18);
    });
  }

  // ゲームオーバー音
  seGameOver() {
    if (!this.enabled || !this.ctx) return;
    this.stopBGM();
    const notes = [440,415,392,370,349,330,311,294,277,262];
    const now = this.ctx.currentTime;
    notes.forEach((f, i) => {
      this._note(f, now + i * 0.15, 0.2, 'sawtooth', 0.15);
    });
  }
}

const audio = new AudioManager();
