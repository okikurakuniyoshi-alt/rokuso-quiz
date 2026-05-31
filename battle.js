// battle.js — バトル（クイズ）ロジック ／ モンスターHP制
class BattleManager {
  constructor() {
    this.currentQuiz = null;
    this.answered = false;
    this.onBattleEnd = null;
    this._typeGen = 0;
    this._typeTimer = null;
    this.isBoss = false;
    this.player = null;
    this.areaId = null;
    this.monster = null;
    this.monsterHpMax = 1;
    this.monsterHp = 1;
    this.wrongDamage = 5;
    this.areaIndex = 1;
  }

  _shuffleQuiz(quiz) {
    const correctText = quiz.choices[quiz.answer];
    const indexed = quiz.choices.map((text, i) => ({ text, i }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    const shuffledChoices = indexed.map(x => x.text);
    const newAnswer = shuffledChoices.indexOf(correctText);
    return { ...quiz, choices: shuffledChoices, answer: newAnswer };
  }

  // main から呼ばれる：そのエリアのモンスターと戦闘開始
  start(player, areaId, monster, onEnd, isBoss) {
    this.player = player;
    this.areaId = areaId;
    this.monster = monster;
    this.onBattleEnd = onEnd;
    this.isBoss = !!isBoss;

    const tier = encounter.getAreaTier(areaId);
    this.areaIndex = tier.index;
    this.monsterHpMax = this.isBoss ? tier.monsterHp + 3 : tier.monsterHp;
    this.monsterHp = this.monsterHpMax;
    this.wrongDamage = this.isBoss ? tier.wrongDamage + 4 : tier.wrongDamage;

    const mEl = document.getElementById('monster-emoji');
    if (window.monsterSVG) mEl.innerHTML = window.monsterSVG(monster);
    else mEl.textContent = encounter.getMonsterEmoji(monster);
    mEl.classList.toggle('boss-monster', this.isBoss);
    document.getElementById('monster-name').textContent = (this.isBoss ? '\u2620\ufe0f ' : '') + monster + this._hpHearts();
    document.getElementById('monster-hp-bar').style.width = '100%';
    document.getElementById('monster-hp-bar').style.backgroundColor = 'var(--hp-red)';

    this._updatePlayerBar(player);
    if (this.isBoss && audio.playBossBGM) audio.playBossBGM();
    else audio.playBattleBGM();
    this._nextQuestion();
  }

  _hpHearts() {
    let s = '\n';
    for (let i = 0; i < this.monsterHpMax; i++) s += (i < this.monsterHp ? '🟥' : '⬛');
    return s;
  }

  _nextQuestion() {
    const quiz = encounter.pickQuizForMonster(this.areaId, this.monster);
    if (!quiz) { this._victory(); return; }
    this.currentQuiz = this._shuffleQuiz(quiz);
    this.answered = false;
    const qt = document.getElementById('question-text');
    // 選択肢を一旦隠す
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`choice-${i}`);
      btn.textContent = '';
      btn.className = 'choice-btn';
      btn.disabled = true;
    }
    this._typeWriter(qt, this.currentQuiz.question, () => this._showChoices(this.currentQuiz));
  }

  _typeWriter(el, text, cb) {
    const gen = ++this._typeGen;
    if (this._typeTimer) { clearTimeout(this._typeTimer); this._typeTimer = null; }
    el.textContent = '';
    let i = 0;
    const step = () => {
      if (gen !== this._typeGen) return; // 新しい問題が来たら中断
      if (i < text.length) {
        el.textContent += text[i++];
        this._typeTimer = setTimeout(step, 30);
      } else if (cb) cb();
    };
    step();
  }

  _showChoices(quiz) {
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`choice-${i}`);
      btn.textContent = `${['Ａ','Ｂ','Ｃ','Ｄ'][i]}：${quiz.choices[i]}`;
      btn.className = 'choice-btn';
      btn.disabled = false;
      btn.onclick = () => this._onAnswer(i);
    }
  }

  _onAnswer(idx) {
    if (this.answered) return;
    this.answered = true;
    const quiz = this.currentQuiz;
    const isCorrect = (idx === quiz.answer);

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`choice-${i}`);
      btn.disabled = true;
      if (i === quiz.answer) btn.classList.add('correct');
      else if (i === idx && !isCorrect) btn.classList.add('wrong');
    }

    if (isCorrect) {
      this.player.correctCount++;
      this.monsterHp = Math.max(0, this.monsterHp - 1);
      audio.seCorrect();
      this._showCritical();
      const me = document.getElementById('monster-emoji');
      me.classList.add('monster-hit');
      const pct = (this.monsterHp / this.monsterHpMax) * 100;
      document.getElementById('monster-name').textContent = this.monster + this._hpHearts();
      setTimeout(() => {
        me.classList.remove('monster-hit');
        document.getElementById('monster-hp-bar').style.width = pct + '%';
      }, 400);
      setTimeout(() => {
        if (this.monsterHp <= 0) this._victory();
        else this._interstitial(true, quiz);
      }, 1100);
    } else {
      this.player.wrongCount++;
      const dead = this.player.takeDamage(this.wrongDamage);
      audio.seWrong();
      const bb = document.getElementById('battle-bottom');
      bb.classList.add('player-hit');
      setTimeout(() => bb.classList.remove('player-hit'), 600);
      this._updatePlayerBar(this.player);
      setTimeout(() => {
        if (dead) this._defeat();
        else this._interstitial(false, quiz);
      }, 1100);
    }
  }

  _showCritical() {
    const el = document.createElement('div');
    el.className = 'critical-text';
    el.textContent = '⚡ 会心の一撃！';
    document.getElementById('screen-battle').appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  // 撃破前の途中経過（正解/不正解の後、次の問題へ）
  _interstitial(isCorrect, quiz) {
    let text;
    if (isCorrect) {
      text = `✅ せいかい！\n${this.monster}に　ダメージ！\nのこり　${this.monsterHp}／${this.monsterHpMax}\n\nさらに　こうげきだ！`;
    } else {
      text = `❌ ちがう……\n${this.wrongDamage}の　ダメージをうけた！\n\n📖 ${quiz.explanation}`;
    }
    document.getElementById('battle-result-text').textContent = text;
    document.getElementById('battle-result').classList.remove('hidden');
    const okBtn = document.getElementById('btn-result-ok');
    okBtn.onclick = () => {
      okBtn.onclick = null;
      document.getElementById('battle-result').classList.add('hidden');
      this._nextQuestion();
    };
  }

  _victory() {
    const expGain = 25 + this.areaIndex * 8 + this.monsterHpMax * 6 + (this.isBoss ? 60 : 0) + Math.floor(Math.random() * 10);
    const text = `🎉 ${this.monster}を　たおした！\n\n経験値　${expGain}　かくとく！`;
    document.getElementById('battle-result-text').textContent = text;
    document.getElementById('battle-result').classList.remove('hidden');
    const okBtn = document.getElementById('btn-result-ok');
    okBtn.onclick = () => {
      okBtn.onclick = null;
      document.getElementById('battle-result').classList.add('hidden');
      this.onBattleEnd({ result: 'win', expGain, monster: this.monster });
    };
  }

  _defeat() {
    document.getElementById('battle-result').classList.add('hidden');
    this.onBattleEnd({ result: 'lose', expGain: 0, monster: this.monster });
  }

  _updatePlayerBar(player) {
    document.getElementById('battle-player-name').textContent = player.name;
    const pct = player.hpPercent() * 100;
    const bar = document.getElementById('battle-hp-bar');
    bar.style.width = pct + '%';
    bar.style.backgroundColor = pct > 50 ? 'var(--hp-green)' : pct > 25 ? 'var(--hp-yellow)' : 'var(--hp-red)';
    document.getElementById('battle-hp-text').textContent = `${player.hp}/${player.hpMax}`;
  }
}

const battle = new BattleManager();
