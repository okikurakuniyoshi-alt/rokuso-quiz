// player.js — プレイヤーデータ管理
const LEVEL_TABLE = [
  { lv:1,  exp:0,    expNext:100,  hpMax:20,  title:'見習い施術士' },
  { lv:2,  exp:100,  expNext:250,  hpMax:25,  title:'初級施術士' },
  { lv:3,  exp:250,  expNext:450,  hpMax:30,  title:'中級施術士' },
  { lv:4,  exp:450,  expNext:700,  hpMax:35,  title:'熟練施術士' },
  { lv:5,  exp:700,  expNext:1000, hpMax:40,  title:'上級施術士' },
  { lv:6,  exp:1000, expNext:1400, hpMax:45,  title:'六層探求者' },
  { lv:7,  exp:1400, expNext:1900, hpMax:50,  title:'六層使い' },
  { lv:8,  exp:1900, expNext:2500, hpMax:55,  title:'六層の達人' },
  { lv:9,  exp:2500, expNext:3200, hpMax:60,  title:'六層の師' },
  { lv:10, exp:3200, expNext:9999, hpMax:70,  title:'六層マスター' },
];

class Player {
  constructor() {
    this.reset();
  }

  reset() {
    this.name = 'ひかり';
    this.level = 1;
    this.exp = 0;
    this.hp = 20;
    this.hpMax = 20;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.areaId = 'area_01';
    this.x = 5;
    this.y = 5;
    this.defeatedMonsters = {};
  }

  getLevelData() {
    return LEVEL_TABLE.find(l => l.lv === this.level) || LEVEL_TABLE[LEVEL_TABLE.length - 1];
  }

  getTitle() {
    return this.getLevelData().title;
  }

  addExp(amount) {
    this.exp += amount;
    const nextLvData = LEVEL_TABLE.find(l => l.lv === this.level + 1);
    if (nextLvData && this.exp >= nextLvData.exp) {
      return this.levelUp();
    }
    return null;
  }

  levelUp() {
    const oldLv = this.level;
    const newLvData = LEVEL_TABLE.find(l => l.lv === this.level + 1);
    if (!newLvData) return null;
    this.level = newLvData.lv;
    const hpGain = newLvData.hpMax - this.hpMax;
    this.hpMax = newLvData.hpMax;
    this.hp = Math.min(this.hp + hpGain, this.hpMax);
    return { oldLv, newLv: this.level, hpGain, title: newLvData.title };
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    return this.hp === 0;
  }

  heal(amount) {
    this.hp = Math.min(this.hpMax, this.hp + amount);
  }

  isAlive() { return this.hp > 0; }

  hpPercent() { return this.hp / this.hpMax; }

  recordDefeat(monsterId) {
    this.defeatedMonsters[monsterId] = (this.defeatedMonsters[monsterId] || 0) + 1;
  }

  toSaveData() {
    return {
      name: this.name, level: this.level, exp: this.exp,
      hp: this.hp, hpMax: this.hpMax,
      correctCount: this.correctCount, wrongCount: this.wrongCount,
      areaId: this.areaId, x: this.x, y: this.y,
      defeatedMonsters: this.defeatedMonsters
    };
  }

  fromSaveData(d) {
    Object.assign(this, d);
  }

  expPercent() {
    const cur = this.getLevelData();
    const nextLvData = LEVEL_TABLE.find(l => l.lv === this.level + 1);
    if (!nextLvData) return 1;
    const earned = this.exp - cur.exp;
    const needed = nextLvData.exp - cur.exp;
    return Math.min(1, earned / needed);
  }
}
