// main.js — ゲーム統括・状態管理
const SCREENS = ['title','name','field','battle','levelup','gameover','book'];

class Game {
  constructor() {
    this.player = new Player();
    this.mapManager = new MapManager();
    this.currentScreen = 'title';
    this.bossPending = false;
  }

  showScreen(name) {
    SCREENS.forEach(s => {
      const el = document.getElementById(`screen-${s}`);
      if (el) el.classList.toggle('active', s === name);
    });
    this.currentScreen = name;
  }

  async init() {
    audio.init();
    await encounter.loadQuizData();
    this._setupTitle();
    this._setupName();
    this._setupField();
    this._setupLevelUp();
    this._setupGameOver();
    this._setupBook();
    this._updateContinueBtn();
    this.showScreen('title');
    audio.playFieldBGM();
  }

  _updateContinueBtn() {
    const btn = document.getElementById('btn-continue');
    btn.style.opacity = Storage.hasSave() ? '1' : '0.4';
    btn.disabled = !Storage.hasSave();
  }

  // ===== タイトル =====
  _setupTitle() {
    document.getElementById('btn-new-game').addEventListener('click', () => {
      audio.resume();
      this.player.reset();
      this.showScreen('name');
    });
    document.getElementById('btn-continue').addEventListener('click', () => {
      audio.resume();
      const save = Storage.load();
      if (save) {
        this.player.fromSaveData(save);
        this._startField();
      }
    });
  }

  // ===== 名前入力 =====
  _setupName() {
    const input = document.getElementById('player-name-input');
    document.getElementById('btn-name-ok').addEventListener('click', () => {
      const name = input.value.trim();
      this.player.name = name || 'ひかり';
      Storage.save(this.player.toSaveData());
      this._startField();
    });
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('btn-name-ok').click();
    });
  }

  // ===== フィールド =====
  _setupField() {
    this.mapManager.onEncounter = () => this._startEncounter();
    this.mapManager.onWarp = () => this._doWarp();
    this.mapManager.onTreasure = () => this._openTreasure();
    document.getElementById('btn-book').addEventListener('click', () => this._openBook());
    document.getElementById('btn-menu').addEventListener('click', () => this._saveGame());
  }

  _startField() {
    this.showScreen('field');
    audio.playAreaBGM(this.player.areaId);
    this._updateStatusBar();
    this.mapManager.init(this.player);
  }

  _updateStatusBar() {
    const p = this.player;
    document.getElementById('stat-name').textContent = p.name;
    document.getElementById('stat-level').textContent = `Lv.${p.level}`;
    document.getElementById('stat-hp').textContent = `${p.hp}/${p.hpMax}`;
    const pct = p.hpPercent() * 100;
    const bar = document.getElementById('hp-bar');
    bar.style.width = pct + '%';
    bar.style.backgroundColor = pct > 50 ? 'var(--hp-green)' : pct > 25 ? 'var(--hp-yellow)' : 'var(--hp-red)';
  }

  _startEncounter() {
    let monster, isBoss = false;
    if (this.bossPending && window.BOSS_LIST && window.BOSS_LIST.length) {
      monster = window.BOSS_LIST[Math.floor(Math.random() * window.BOSS_LIST.length)];
      isBoss = true;
      this.bossPending = false;
    } else {
      monster = encounter.pickMonster(this.player.areaId);
    }
    if (!monster) return;
    this._flashEncounter(() => {
      audio.seEncounter();
      this.mapManager.stop();
      this.showScreen('battle');
      battle.start(this.player, this.player.areaId, monster, (result) => this._onBattleEnd(result), isBoss);
    });
  }

  _flashEncounter(cb) {
    const flash = document.getElementById('encounter-flash');
    flash.classList.remove('hidden');
    flash.style.opacity = '1';
    let count = 0;
    const interval = setInterval(() => {
      flash.style.opacity = count % 2 === 0 ? '0' : '1';
      count++;
      if (count >= 6) {
        clearInterval(interval);
        flash.classList.add('hidden');
        flash.style.opacity = '1';
        cb();
      }
    }, 100);
  }

  _onBattleEnd(result) {
    Storage.save(this.player.toSaveData());
    if (result.result === 'lose') { this._showGameOver(); return; }
    this.player.recordDefeat(result.monster);
    const lvResult = this.player.addExp(result.expGain);
    Storage.save(this.player.toSaveData());
    if (lvResult) this._showLevelUp(lvResult);
    else this._returnToField();
  }

  _returnToField() {
    this._updateStatusBar();
    this._startField();
  }

  // ===== ワープ =====
  _doWarp() {
    const areas = encounter.getAllAreas();
    const curIdx = areas.findIndex(a => a.id === this.player.areaId);
    const nextArea = areas[(curIdx + 1) % areas.length];
    this.player.areaId = nextArea.id;
    this.player.x = 5; this.player.y = 5;
    this.player.areaEnterCount = (this.player.areaEnterCount || 1) + 1;
    this.bossPending = (this.player.areaEnterCount % 3 === 0);
    Storage.save(this.player.toSaveData());
    audio.seWarp();
    if (this.bossPending) {
      this._showFieldMsg(`${nextArea.name}に　はいった！\n\n☠️ つよい　きはいを　かんじる……`, 3200);
    } else {
      this._showFieldMsg(`${nextArea.name}に　はいった！`);
    }
  }

  _openTreasure() {
    const heal = Math.max(8, Math.ceil(this.player.hpMax * 0.35));
    this.player.heal(heal);
    Storage.save(this.player.toSaveData());
    this._updateStatusBar();
    this._showFieldMsg(`\u2728 たからばこを　あけた！\nHPが　${heal}　かいふくした！`, 2200);
  }

  _showFieldMsg(text, duration = 2500) {
    const box = document.getElementById('field-message');
    document.getElementById('field-message-text').textContent = text;
    box.classList.remove('hidden');
    setTimeout(() => box.classList.add('hidden'), duration);
  }

  // ===== レベルアップ =====
  _setupLevelUp() {
    document.getElementById('btn-levelup-ok').addEventListener('click', () => {
      this._returnToField();
    });
  }

  _showLevelUp(lvResult) {
    audio.playLevelUpBGM();
    document.getElementById('levelup-info').innerHTML =
      `Lv <span style="color:var(--win-border)">${lvResult.oldLv}</span> → Lv <span style="color:var(--accent)">${lvResult.newLv}</span><br><br>` +
      `称号：<span style="color:var(--correct)">${lvResult.title}</span><br><br>` +
      `HP　+${lvResult.hpGain}`;

    // 師匠の言葉を表示
    const word = encounter.getShishoWord(lvResult.newLv);
    const box = document.getElementById('shisho-word-box');
    const txt = document.getElementById('shisho-word-text');
    if (word) {
      box.classList.remove('hidden');
      txt.textContent = '';
      // タイプライター効果
      let i = 0;
      const type = () => {
        if (i < word.length) {
          txt.textContent += word[i++];
          setTimeout(type, 40);
        }
      };
      setTimeout(type, 600);
    } else {
      box.classList.add('hidden');
    }

    this.showScreen('levelup');
  }

  // ===== ゲームオーバー =====
  _setupGameOver() {
    document.getElementById('btn-retry').addEventListener('click', () => {
      this.player.hp = Math.floor(this.player.hpMax * 0.5);
      this.player.x = 5; this.player.y = 5;
      Storage.save(this.player.toSaveData());
      this._returnToField();
    });
  }

  _showGameOver() {
    audio.seGameOver();
    this.showScreen('gameover');
  }

  // ===== 図鑑 =====
  _setupBook() {
    document.getElementById('btn-book-close').addEventListener('click', () => {
      this.showScreen('field');
      this.mapManager._startLoop();
    });
    window.switchBookTab = (tab) => this._switchBookTab(tab);
  }

  _switchBookTab(tab) {
    ['monster', 'progress'].forEach(t => {
      document.getElementById(`book-panel-${t}`).classList.toggle('hidden', t !== tab);
      document.getElementById(`tab-${t}`).classList.toggle('active', t === tab);
    });
    if (tab === 'progress') this._renderProgress();
  }

  _openBook() {
    this.mapManager.stop();
    this._renderMonsterBook();
    this._switchBookTab('monster');
    this.showScreen('book');
  }

  _renderMonsterBook() {
    const list = document.getElementById('book-list');
    list.innerHTML = '';
    const areas = encounter.getAllAreas();
    areas.forEach(area => {
      const monsters = [...new Set(area.quizzes.map(q => q.monster))];
      monsters.forEach(m => {
        const count = this.player.defeatedMonsters[m] || 0;
        const emoji = encounter.getMonsterEmoji(m);
        const item = document.createElement('div');
        item.className = 'book-item' + (count === 0 ? ' locked' : '');
        item.innerHTML = `
          <div class="book-item-emoji">${count > 0 ? emoji : '？'}</div>
          <div class="book-item-info">
            <div class="book-item-name">${count > 0 ? m : '???'}</div>
            <div class="book-item-count">${count > 0 ? `撃破 ${count}回 ／ ${area.name}` : '未発見'}</div>
          </div>`;
        list.appendChild(item);
      });
    });
  }

  _renderProgress() {
    const p = this.player;
    const total = p.correctCount + p.wrongCount;
    const rate = total > 0 ? Math.round(p.correctCount / total * 100) : 0;
    const rateColor = rate >= 70 ? 'var(--correct)' : rate >= 40 ? 'var(--hp-yellow)' : 'var(--wrong)';
    const areas = encounter.getAllAreas();

    document.getElementById('progress-stats').innerHTML = `
      <div class="prog-summary">
        <div class="prog-row"><span class="prog-label">レベル</span><span class="prog-val">${p.level}</span></div>
        <div class="prog-row"><span class="prog-label">総正解率</span><span class="prog-val" style="color:${rateColor}">${rate}%</span></div>
        <div class="prog-row"><span class="prog-label">正解 / 不正解</span><span class="prog-val">${p.correctCount} / ${p.wrongCount}</span></div>
        <div class="prog-bar-wrap"><div class="prog-bar-fill" style="width:${rate}%;background:${rateColor}"></div></div>
      </div>`;

    const areasHtml = areas.map(area => {
      const monsters = [...new Set(area.quizzes.map(q => q.monster))];
      const defeated = monsters.filter(m => (p.defeatedMonsters[m] || 0) > 0).length;
      const areaRate = monsters.length > 0 ? Math.round(defeated / monsters.length * 100) : 0;
      return `
        <div class="prog-area">
          <div class="prog-area-name">${area.name}</div>
          <div class="prog-area-bar-wrap">
            <div class="prog-area-bar" style="width:${areaRate}%"></div>
          </div>
          <div class="prog-area-pct">${defeated}/${monsters.length} (${areaRate}%)</div>
        </div>`;
    }).join('');
    document.getElementById('progress-areas').innerHTML = areasHtml;
  }

  // ===== セーブ =====
  _saveGame() {
    Storage.save(this.player.toSaveData());
    this._showFieldMsg('セーブしました！', 1500);
  }
}

// ===== 起動 =====
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
});
