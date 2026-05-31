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
      fetch('quizzes.json'),
      fetch('shisho_words.json'),
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
