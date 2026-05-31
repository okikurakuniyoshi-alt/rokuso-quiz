// monsters.js — オリジナルのモンスター絵（SVG）。著作権フリーの自作デザイン。
(function () {
  const wrap = (inner) =>
    '<svg viewBox="0 0 100 100" width="120" height="120" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision">' +
    '<ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.35)"/>' + inner + '</svg>';
  const eye = (x, y, r) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x}" cy="${y+r*0.2}" r="${r*0.5}" fill="#111"/>`;

  const T = {
    // ドラゴン
    dragon: (c, d) => wrap(`
      <path d="M30 70 Q20 50 32 38 Q28 26 40 28 Q44 16 54 26 Q70 22 70 40 Q82 48 72 64 Q78 78 60 76 L40 78 Q30 80 30 70Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      <path d="M40 28 L34 14 L46 24Z" fill="${d}"/><path d="M58 26 L66 12 L66 26Z" fill="${d}"/>
      <path d="M70 56 L90 52 L74 66Z" fill="${c}" stroke="${d}" stroke-width="2"/>
      ${eye(46,42,6)}${eye(62,42,6)}
      <path d="M42 60 Q50 66 60 60" stroke="${d}" stroke-width="3" fill="none"/>
      <path d="M44 64 l3 5 3-5Z" fill="#fff"/><path d="M54 64 l3 5 3-5Z" fill="#fff"/>`),
    // ゴースト
    ghost: (c, d) => wrap(`
      <path d="M28 54 Q28 26 50 26 Q72 26 72 54 L72 78 Q66 70 60 78 Q54 70 48 78 Q42 70 36 78 Q30 70 28 78Z" fill="${c}" stroke="${d}" stroke-width="3" opacity="0.92"/>
      ${eye(42,48,7)}${eye(60,48,7)}
      <ellipse cx="51" cy="62" rx="6" ry="8" fill="#111"/>`),
    // デーモン
    demon: (c, d) => wrap(`
      <path d="M26 40 Q24 18 50 20 Q76 18 74 40 Q80 64 60 74 L40 74 Q20 64 26 40Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      <path d="M26 38 Q10 18 14 8 Q30 18 34 34Z" fill="${d}"/><path d="M74 38 Q90 18 86 8 Q70 18 66 34Z" fill="${d}"/>
      <path d="M36 46 l12 6 -12 4Z" fill="#fff"/><path d="M64 46 l-12 6 12 4Z" fill="#fff"/>
      <circle cx="42" cy="50" r="3" fill="#111"/><circle cx="58" cy="50" r="3" fill="#111"/>
      <path d="M38 62 Q50 56 62 62 L58 68 54 62 50 68 46 62 42 68Z" fill="#fff" stroke="${d}"/>`),
    // 獣
    beast: (c, d) => wrap(`
      <path d="M30 34 L22 20 L40 30Z" fill="${d}"/><path d="M70 34 L78 20 L60 30Z" fill="${d}"/>
      <circle cx="50" cy="56" r="26" fill="${c}" stroke="${d}" stroke-width="3"/>
      ${eye(40,50,6)}${eye(60,50,6)}
      <circle cx="50" cy="62" r="4" fill="#111"/>
      <path d="M40 70 Q50 78 60 70" stroke="${d}" stroke-width="3" fill="none"/>
      <path d="M44 68 l3 6 3-6Z" fill="#fff"/><path d="M53 68 l3 6 3-6Z" fill="#fff"/>`),
    // 死神（ドクロ）
    reaper: (c, d) => wrap(`
      <path d="M24 50 Q24 18 50 18 Q76 18 76 50 Q76 64 64 70 L64 82 36 82 36 70 Q24 64 24 50Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      <circle cx="40" cy="48" r="9" fill="#111"/><circle cx="60" cy="48" r="9" fill="#111"/>
      <circle cx="40" cy="48" r="3" fill="${c}"/><circle cx="60" cy="48" r="3" fill="${c}"/>
      <path d="M46 60 l4 8 4-8Z" fill="#111"/>
      <path d="M40 76 v6 M50 76 v6 M60 76 v6" stroke="${d}" stroke-width="3"/>`),
    // 鳥（猛禽）
    bird: (c, d) => wrap(`
      <path d="M30 40 Q50 16 70 40 Q80 60 50 78 Q20 60 30 40Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      <path d="M30 44 Q12 40 8 30 Q26 30 34 40Z" fill="${d}"/><path d="M70 44 Q88 40 92 30 Q74 30 66 40Z" fill="${d}"/>
      ${eye(42,44,6)}${eye(58,44,6)}
      <path d="M44 54 L50 70 L56 54Z" fill="#f5a623" stroke="${d}"/>`),
    // 蜘蛛
    spider: (c, d) => wrap(`
      <g stroke="${d}" stroke-width="3" fill="none">
      <path d="M40 52 L16 40 M40 60 L14 60 M40 68 L18 80 M60 52 L84 40 M60 60 L86 60 M60 68 L82 80"/></g>
      <ellipse cx="50" cy="60" rx="20" ry="16" fill="${c}" stroke="${d}" stroke-width="3"/>
      <circle cx="50" cy="42" r="11" fill="${c}" stroke="${d}" stroke-width="3"/>
      ${eye(45,40,4)}${eye(55,40,4)}`),
    // シャーマン（ローブ）
    shaman: (c, d) => wrap(`
      <path d="M30 80 Q30 36 50 30 Q70 36 70 80Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      <path d="M50 30 Q34 34 34 50 L66 50 Q66 34 50 30Z" fill="#111"/>
      ${eye(44,44,4)}${eye(56,44,4)}
      <rect x="74" y="22" width="4" height="58" fill="${d}"/><circle cx="76" cy="20" r="7" fill="#f5d24b" stroke="${d}"/>`),
    // 影（うごめく塊）
    shadow: (c, d) => wrap(`
      <path d="M24 72 Q18 44 38 36 Q42 22 54 32 Q74 30 72 50 Q86 58 74 72 Q60 82 46 76 Q32 82 24 72Z" fill="${c}" stroke="${d}" stroke-width="3" opacity="0.9"/>
      ${eye(44,52,6)}${eye(60,52,6)}`),
    // ボス（王冠）
    boss: (c, d) => wrap(`
      <path d="M22 44 L22 30 L34 40 L42 26 L50 40 L58 26 L66 40 L78 30 L78 44Z" fill="#f5d24b" stroke="#a5781a" stroke-width="2"/>
      <path d="M24 46 Q22 78 50 84 Q78 78 76 46Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      ${eye(40,58,7)}${eye(60,58,7)}
      <path d="M38 72 Q50 80 62 72" stroke="${d}" stroke-width="3" fill="none"/>
      <path d="M42 70 l3 6 3-6Z" fill="#fff"/><path d="M52 70 l3 6 3-6Z" fill="#fff"/>`),
    overlord: (c, d) => wrap(`
      <path d="M20 34 Q6 10 12 4 Q30 14 32 30Z" fill="${d}"/><path d="M80 34 Q94 10 88 4 Q70 14 68 30Z" fill="${d}"/>
      <path d="M22 46 Q18 18 50 18 Q82 18 78 46 Q86 70 60 80 L40 80 Q14 70 22 46Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      <path d="M14 56 Q2 60 6 74 Q16 66 24 62Z" fill="${d}" opacity="0.8"/><path d="M86 56 Q98 60 94 74 Q84 66 76 62Z" fill="${d}" opacity="0.8"/>
      <path d="M32 44 l16 8 -16 6Z" fill="#ffd24b"/><path d="M68 44 l-16 8 16 6Z" fill="#ffd24b"/>
      <circle cx="42" cy="50" r="4" fill="#fff"/><circle cx="58" cy="50" r="4" fill="#fff"/>
      <path d="M34 64 Q50 56 66 64 L62 72 58 64 54 72 50 64 46 72 42 64 38 72Z" fill="#fff" stroke="${d}"/>`),
    titan: (c, d) => wrap(`
      <rect x="16" y="40" width="16" height="34" rx="6" fill="${d}"/><rect x="68" y="40" width="16" height="34" rx="6" fill="${d}"/>
      <path d="M28 40 Q26 20 50 20 Q74 20 72 40 Q78 70 56 78 L44 78 Q22 70 28 40Z" fill="${c}" stroke="${d}" stroke-width="3"/>
      <path d="M30 30 L24 18 L40 28Z" fill="${d}"/><path d="M70 30 L76 18 L60 28Z" fill="${d}"/>
      <rect x="34" y="44" width="12" height="6" rx="2" fill="#fff"/><rect x="54" y="44" width="12" height="6" rx="2" fill="#fff"/>
      <circle cx="40" cy="47" r="2.5" fill="#c0102a"/><circle cx="60" cy="47" r="2.5" fill="#c0102a"/>
      <path d="M38 62 h24 M40 62 v8 M48 62 v8 M56 62 v8" stroke="${d}" stroke-width="3"/>`),
    wraith: (c, d) => wrap(`
      <path d="M50 14 Q24 18 26 48 Q24 70 16 84 Q30 76 34 84 Q42 74 50 84 Q58 74 66 84 Q70 76 84 84 Q76 70 74 48 Q76 18 50 14Z" fill="${c}" stroke="${d}" stroke-width="3" opacity="0.95"/>
      <path d="M50 18 Q34 22 34 44 L66 44 Q66 22 50 18Z" fill="#0a0a14"/>
      <circle cx="43" cy="38" r="5" fill="#ff3b3b"/><circle cx="57" cy="38" r="5" fill="#ff3b3b"/>
      <path d="M16 60 Q6 64 8 76 M84 60 Q94 64 92 76" stroke="${d}" stroke-width="3" fill="none"/>`),
  };

  const DESIGN = {
    'クアッドゴン':         ['dragon', '#5fa85f', '#2f5f2f'],
    'ハムスター魔王':       ['beast',  '#c8923f', '#8a5e22'],
    'インナードラゴン':     ['dragon', '#d65a5a', '#8f2f2f'],
    'キョウカクウォーリアー': ['beast',  '#7a8bd0', '#3f4f9a'],
    'ショルダービースト':   ['bird',   '#9aa7b5', '#5f6b7a'],
    'ペルビスデーモン':     ['demon',  '#b65ac0', '#6f2f78'],
    'トゥワイバーン':       ['dragon', '#4fb0a0', '#2f6f64'],
    'ガレアゴースト':       ['ghost',  '#c8d0e0', '#7a85a0'],
    'コラコイドシャドウ':   ['spider', '#6a6f7a', '#33363d'],
    'サブクラビアンリーパー': ['reaper', '#d8d8c8', '#8a8a72'],
    'ビセプスドラゴン':     ['dragon', '#d07a3a', '#8a4a1a'],
    'メジアスタムゴースト': ['ghost',  '#a0c0d0', '#5a7a8a'],
    'マンディブルシャーマン': ['shaman', '#7a5fb0', '#43307a'],
    'アクシラリーシェイド': ['shadow', '#4a4f6a', '#23283d'],
    'スカプラウォーロード': ['demon',  '#3f7fb0', '#1f4f7a'],
    'ペリトニアルロード':   ['shaman', '#b04f7a', '#702f4a'],
    'サイコアスタムドラゴン': ['dragon', '#c060a0', '#7a2f64'],
    'ソラコアームドラゴン': ['dragon', '#e0b840', '#a07f1a'],
    'トゥファイナルボス':   ['boss',   '#c03a3a', '#7a1f1f'],
    '六層の魔王':       ['overlord', '#7a1f2f', '#3a0a14'],
    'デスタイタン':     ['titan',    '#4a4f5a', '#1f2229'],
    'ヴォイドレイス':   ['wraith',   '#2a2f4a', '#0a0c1a'],
  };

  window.monsterSVG = function (name) {
    const d = DESIGN[name];
    if (d && T[d[0]]) return T[d[0]](d[1], d[2]);
    return T.shadow('#888', '#555');
  };
  window.BOSS_LIST = ['六層の魔王', 'デスタイタン', 'ヴォイドレイス'];
})();
