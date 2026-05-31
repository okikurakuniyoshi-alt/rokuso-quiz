// encounter.js — エンカウントシステム
const MONSTER_EMOJIS = {
  'クアッドゴン':         '🦕',
  'ハムスター魔王':       '🐭',
  'インナードラゴン':     '🐉',
  'キョウカクウォーリアー': '⚔️',
  'ショルダービースト':   '🦅',
  'ペルビスデーモン':     '👹',
  'トゥワイバーン':       '🐍',
  'ガレアゴースト':       '👻',
  'コラコイドシャドウ':   '🕷️',
  'サブクラビアンリーパー': '💀',
  'ビセプスドラゴン':     '🐲',
  'メジアスタムゴースト': '🌫️',
  'マンディブルシャーマン': '🧙',
  'アクシラリーシェイド': '🌑',
  'スカプラウォーロード': '🛡️',
  'ペリトニアルロード':   '🔮',
  'サイコアスタムドラゴン': '🦄',
  'ソラコアームドラゴン': '⚡',
  'トゥファイナルボス':   '👑',
};

const AREA_ENCOUNTER_RATE = {
  0: 0.10,  // grass
  3: 0.22,  // deep grass
};

class EncounterManager {
  constructor() {
    this.quizData = null;
    this.usedQuizIds = {};
  }

  async loadQuizData() {
    // file:// で直接開いても動くよう、data/gamedata.js に埋め込んだデータを使用。
    // 万一読み込めていない場合のみ fetch にフォールバック。
    if (window.QUIZ_DATA && window.SHISHO_WORDS) {
      this.quizData = window.QUIZ_DATA;
      this.shishoWords = window.SHISHO_WORDS;
      return;
    }
    const [quizRes, wordRes] = await Promise.all([
      fetch('data/quizzes.json'),
      fetch('data/shisho_words.json'),
    ]);
    this.quizData = await quizRes.json();
    this.shishoWords = await wordRes.json();
  }

  getShishoWord(level) {
    if (!this.shishoWords) return null;
    // Lv.99以上は99の言葉を表示
    const key = String(Math.min(level, 99));
    return this.shishoWords[key] || null;
  }

  checkEncounter(tileType) {
    const rate = AREA_ENCOUNTER_RATE[tileType];
    if (!rate) return false;
    return Math.random() < rate;
  }

  getAreaQuizzes(areaId) {
    if (!this.quizData) return [];
    const area = this.quizData.areas.find(a => a.id === areaId);
    return area ? area.quizzes : [];
  }

  pickQuiz(areaId) {
    const quizzes = this.getAreaQuizzes(areaId);
    if (quizzes.length === 0) return null;
    // 未出題を優先
    const unused = quizzes.filter(q => !this.usedQuizIds[q.id]);
    const pool = unused.length > 0 ? unused : quizzes;
    const q = pool[Math.floor(Math.random() * pool.length)];
    this.usedQuizIds[q.id] = true;
    return q;
  }

  // エリア番号(1-16)を取得
  getAreaIndex(areaId) {
    const m = /(\d+)/.exec(areaId || '');
    return m ? parseInt(m[1], 10) : 1;
  }

  // エリアの難易度ティア：モンスターHP(必要正解数)と不正解ダメージ
  getAreaTier(areaId) {
    const idx = this.getAreaIndex(areaId);
    const monsterHp = Math.min(5, 2 + Math.floor((idx - 1) / 5)); // 1-5:2, 6-10:3, 11-15:4, 16:5
    const wrongDamage = 4 + Math.floor((idx - 1) / 2);            // 序盤4→終盤11
    return { index: idx, monsterHp, wrongDamage };
  }

  // エリアに登場するモンスター一覧
  getAreaMonsters(areaId) {
    const qs = this.getAreaQuizzes(areaId);
    return [...new Set(qs.map(q => q.monster))];
  }

  // エリアからランダムにモンスターを選ぶ
  pickMonster(areaId) {
    const ms = this.getAreaMonsters(areaId);
    if (ms.length === 0) return null;
    return ms[Math.floor(Math.random() * ms.length)];
  }

  // 指定モンスターのクイズを未出題優先で1問選ぶ（足りなければエリア全体から）
  pickQuizForMonster(areaId, monster) {
    let pool = this.getAreaQuizzes(areaId).filter(q => q.monster === monster);
    if (pool.length === 0) pool = this.getAreaQuizzes(areaId);
    if (pool.length === 0) return null;
    const unused = pool.filter(q => !this.usedQuizIds[q.id]);
    const src = unused.length > 0 ? unused : pool;
    const q = src[Math.floor(Math.random() * src.length)];
    this.usedQuizIds[q.id] = true;
    return q;
  }

  getAreaInfo(areaId) {
    if (!this.quizData) return null;
    return this.quizData.areas.find(a => a.id === areaId) || null;
  }

  getMonsterEmoji(monsterName) {
    return MONSTER_EMOJIS[monsterName] || '👾';
  }

  getAllAreas() {
    return this.quizData ? this.quizData.areas : [];
  }
}

const encounter = new EncounterManager();
