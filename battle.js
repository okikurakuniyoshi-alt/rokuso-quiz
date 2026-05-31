// battle.js — バトル（クイズ）ロジック
class BattleManager {
  constructor() {
    this.currentQuiz = null;
    this.answered = false;
    this.onBattleEnd = null;
  }

  // 選択肢をシャッフルして正解インデックスを更新した新しいクイズオブジェクトを返す
  _shuffleQuiz(quiz) {
    const correctText = quiz.choices[quiz.answer];
    // インデックス付き配列を作ってシャッフル
    const indexed = quiz.choices.map((text, i) => ({ text, i }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    const shuffledChoices = indexed.map(x => x.text);
    const newAnswer = shuffledChoices.indexOf(correctText);
    return { ...quiz, choices: shuffledChoices, answer: newAnswer };
  }

  start(quiz, player, onEnd) {
    // 表示用にシャッフルしたコピーを使う（元データは変更しない）
    this.currentQuiz = this._shuffleQuiz(quiz);
    this.answered = false;
    this.onBattleEnd = onEnd;

    const area = encounter.getAreaInfo(player.areaId);
    const emoji = encounter.getMonsterEmoji(quiz.monster);

    // モンスター表示
    document.getElementById('monster-emoji').textContent = emoji;
    document.getElementById('monster-name').textContent = quiz.monster;
    document.getElementById('monster-hp-bar').style.width = '100%';

    // 問題表示（タイプライター）
    this._typeWriter(document.getElementById('question-text'), this.currentQuiz.question, () => {
      this._showChoices(this.currentQuiz);  // シャッフル済みを使う
    });

    // プレイヤーHPバー
    this._updatePlayerBar(player);

    // バトルBGM
    audio.playBattleBGM();
  }

  _typeWriter(el, text, cb, i = 0) {
    if (i === 0) el.textContent = '';
    if (i < text.length) {
      el.textContent += text[i];
      setTimeout(() => this._typeWriter(el, text, cb, i + 1), 35);
    } else {
      if (cb) cb();
    }
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

    // ボタン演出
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`choice-${i}`);
      btn.disabled = true;
      if (i === quiz.answer) btn.classList.add('correct');
      else if (i === idx && !isCorrect) btn.classList.add('wrong');
    }

    if (isCorrect) {
      audio.seCorrect();
      this._showCritical();
      document.getElementById('monster-emoji').classList.add('monster-hit');
      setTimeout(() => {
        document.getElementById('monster-emoji').classList.remove('monster-hit');
        document.getElementById('monster-hp-bar').style.width = '0%';
      }, 500);
      setTimeout(() => this._showResult(true, quiz), 1200);
    } else {
      audio.seWrong();
      document.getElementById('battle-bottom').classList.add('player-hit');
      setTimeout(() => {
        document.getElementById('battle-bottom').classList.remove('player-hit');
      }, 600);
      setTimeout(() => this._showResult(false, quiz), 1200);
    }
  }

  _showCritical() {
    const el = document.createElement('div');
    el.className = 'critical-text';
    el.textContent = '⚡ 会心の一撃！';
    document.getElementById('screen-battle').appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  _showResult(isCorrect, quiz) {
    const expGain = isCorrect ? 30 + Math.floor(Math.random() * 20) : 0;
    const dmg = isCorrect ? 0 : 5;

    let text = '';
    if (isCorrect) {
      text = `✅ せいかい！\n${quiz.monster}を　たおした！\n\n経験値　${expGain}　かくとく！`;
    } else {
      text = `❌ ちがう……\n${dmg}の　ダメージをうけた！\n\n📖 解説：${quiz.explanation}`;
    }

    document.getElementById('battle-result-text').textContent = text;
    document.getElementById('battle-result').classList.remove('hidden');

    document.getElementById('btn-result-ok').onclick = () => {
      document.getElementById('battle-result').classList.add('hidden');
      this.onBattleEnd({ isCorrect, expGain, damage: dmg, quiz });
    };
  }

  _updatePlayerBar(player) {
    document.getElementById('battle-player-name').textContent = player.name;
    const pct = player.hpPercent() * 100;
    document.getElementById('battle-hp-bar').style.width = pct + '%';
    document.getElementById('battle-hp-bar').style.backgroundColor =
      pct > 50 ? 'var(--hp-green)' : pct > 25 ? 'var(--hp-yellow)' : 'var(--hp-red)';
    document.getElementById('battle-hp-text').textContent = `${player.hp}/${player.hpMax}`;
  }
}

const battle = new BattleManager();
