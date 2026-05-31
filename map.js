// map.js — Canvas マップ描画・移動
const TILE = {
  GRASS: 0,
  PATH:  1,
  WALL:  2,
  DEEP:  3,
  WARP:  4,
  WATER: 5,
  TREASURE: 6,
};

const TILE_COLORS = {
  [TILE.GRASS]: { base:'#3a7d44', accent:'#2d6036', border:'#4a9d54' },
  [TILE.PATH]:  { base:'#8b6f47', accent:'#7a5f3a', border:'#9b7f57' },
  [TILE.WALL]:  { base:'#2d2d2d', accent:'#1a1a1a', border:'#3d3d3d' },
  [TILE.DEEP]:  { base:'#1e5c28', accent:'#154520', border:'#267833' },
  [TILE.WARP]:  { base:'#ffd700', accent:'#ccaa00', border:'#ffee44' },
  [TILE.WATER]: { base:'#1565c0', accent:'#0d47a1', border:'#1976d2' },
  [TILE.TREASURE]: { base:'#8b6f47', accent:'#7a5f3a', border:'#ffd700' },
};

// エリアマップデータ (20x15 tiles)
const MAPS = {
  area_01: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,1,1,1,1,1,2,0,0,0,0,0,0,0,2,0,0,0,0,2],
    [2,1,0,0,0,1,2,0,3,3,3,0,0,0,2,0,3,3,0,2],
    [2,1,0,3,0,1,2,0,3,3,3,0,0,0,2,0,3,3,0,2],
    [2,4,0,3,0,1,1,1,1,1,1,1,0,0,2,0,0,0,0,2],
    [2,1,0,0,0,0,0,0,0,0,0,1,0,0,1,1,1,1,4,2],
    [2,1,1,1,0,0,0,0,0,0,0,1,0,0,1,2,2,2,2,2],
    [2,2,2,1,0,0,3,3,3,0,0,1,0,0,1,0,0,0,0,2],
    [2,0,0,1,0,0,3,3,3,0,0,1,0,0,1,0,3,3,0,2],
    [2,0,3,1,1,1,1,1,1,1,1,1,1,0,1,0,3,3,0,2],
    [2,0,3,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,2],
    [2,0,0,0,0,3,3,0,0,0,0,0,1,0,1,2,2,2,2,2],
    [2,0,0,0,0,3,3,0,0,0,0,0,1,1,1,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],
  area_02: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,2],
    [2,0,3,3,0,0,2,2,0,3,3,3,0,0,2,2,0,3,0,2],
    [2,0,3,3,0,0,1,1,1,1,1,1,0,0,1,1,1,3,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,2],
    [2,4,1,1,1,1,1,1,1,0,0,1,0,0,0,0,3,3,0,2],
    [2,2,2,2,2,2,2,2,1,0,0,1,1,1,1,1,1,1,4,2],
    [2,0,3,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,2,2],
    [2,0,3,0,0,3,3,0,1,0,0,3,3,0,0,3,0,0,2,2],
    [2,0,0,0,0,3,3,0,1,1,1,1,1,1,0,3,0,0,2,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,2],
    [2,2,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,2,2],
    [2,2,0,0,3,3,0,0,0,0,0,0,0,1,1,1,1,4,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_03: 胸郭の山岳 — 険しい岩場・縦長の通路
  area_03: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,2,2,2,0,0,0,0,0,2,2,2,0,0,0,0,2],
    [2,2,2,1,2,0,0,0,2,2,0,0,2,0,0,0,2,2,0,2],
    [2,2,2,1,1,1,2,0,2,2,0,0,1,0,2,0,0,2,0,2],
    [2,0,0,0,0,1,2,0,0,0,0,0,1,0,2,0,0,0,0,2],
    [2,0,2,2,0,1,1,1,1,2,2,0,1,0,1,1,1,2,0,2],
    [2,0,2,2,0,0,0,0,1,2,2,0,1,0,1,0,0,2,0,2],
    [2,0,0,0,0,0,2,0,1,0,0,0,1,0,0,0,0,0,0,2],
    [2,2,2,0,2,2,2,0,1,0,2,0,1,2,2,0,2,2,0,2],
    [2,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,2],
    [2,0,2,2,0,2,2,0,0,0,0,0,0,0,2,2,0,2,0,2],
    [2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,2],
    [2,0,0,2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_04: 肩の氷原 — 広い雪原・水（氷河）が広がる
  area_04: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,2,2,2,1,0,5,5,5,0,0,0,5,5,5,0,0,0,0,2],
    [2,0,0,0,1,0,5,5,5,0,0,0,5,5,5,0,0,0,0,2],
    [2,0,0,0,1,0,5,5,5,0,0,0,5,5,5,0,0,1,4,2],
    [2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2],
    [2,0,5,0,1,1,1,1,0,0,0,0,1,1,1,1,1,1,2,2],
    [2,0,5,0,0,0,0,1,0,5,5,5,1,0,0,0,0,0,2,2],
    [2,0,0,0,0,0,0,1,0,5,5,5,1,0,5,5,0,0,2,2],
    [2,0,0,0,0,0,0,1,0,0,0,0,1,0,5,5,0,0,2,2],
    [2,0,5,5,0,0,0,1,1,1,1,1,1,0,0,0,0,0,2,2],
    [2,0,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
    [2,0,0,0,0,0,0,0,0,5,5,0,0,0,0,0,0,4,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_05: 骨盤の砂漠 — 広い砂漠・オアシス（deep）が点在
  area_05: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,3,3,0,0,0,3,3,3,0,0,0,3,3,0,0,0,2],
    [2,0,0,3,3,0,0,0,3,3,3,0,0,0,3,3,0,0,0,2],
    [2,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,2],
    [2,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,2],
    [2,0,3,0,0,0,1,0,3,3,3,3,0,0,1,0,3,0,0,2],
    [2,0,3,0,0,0,1,0,3,3,3,3,0,0,1,0,3,0,0,2],
    [2,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,2],
    [2,0,0,0,0,0,1,1,0,0,0,0,1,1,1,0,0,0,0,2],
    [2,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,3,0,0,2],
    [2,0,0,3,0,0,0,0,0,3,3,0,0,0,0,0,3,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_06: 足趾の海岸 — 海（水）が広がる入り組んだ海岸線
  area_06: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,2],
    [2,2,1,0,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,2],
    [2,2,1,0,0,0,0,0,0,0,5,5,5,5,5,5,5,5,5,2],
    [2,2,1,1,1,0,0,0,0,0,5,5,5,5,5,5,5,5,5,2],
    [2,2,2,2,1,0,0,0,0,0,0,0,0,5,5,5,5,5,5,2],
    [2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,5,5,5,5,2],
    [2,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,5,5,5,2],
    [2,0,0,0,0,0,1,0,0,3,3,0,0,0,0,0,0,5,5,2],
    [2,0,3,3,0,0,1,0,0,3,3,0,0,0,0,0,0,0,4,2],
    [2,0,3,3,0,0,1,1,1,1,1,1,1,0,0,0,0,0,2,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,2,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_07: 帽状腱膜の霧の森 — 深い草・木（DEEP）が密集する迷宮
  area_07: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,0,3,3,3,0,3,3,0,3,3,3,0,0,3,3,0,0,2],
    [2,0,0,3,3,3,0,3,3,0,3,3,3,0,0,3,3,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,3,3,0,3,3,3,0,3,3,3,0,3,3,0,3,3,3,3,2],
    [2,3,3,0,3,3,3,0,3,3,3,0,3,3,0,3,3,3,3,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,3,3,3,0,3,3,0,1,1,1,0,3,3,0,3,3,0,2],
    [2,0,3,3,3,0,3,3,0,1,0,1,0,3,3,0,3,3,0,2],
    [2,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,2],
    [2,3,0,3,3,0,3,0,0,1,0,1,0,3,0,3,3,0,3,2],
    [2,3,0,3,3,0,3,0,0,0,0,0,0,3,0,3,3,0,3,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_08: 烏口突起の回廊 — 狭い通路・入り組んだ迷宮
  area_08: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,2,2,0,0,0,0,0,0,0,2,2,0,0,0,0,2],
    [2,2,2,1,2,0,0,2,0,0,0,2,0,0,2,0,2,0,0,2],
    [2,0,0,1,1,1,0,2,0,2,0,2,0,2,0,0,2,0,0,2],
    [2,0,0,0,0,1,0,0,0,2,0,0,0,2,0,0,0,0,0,2],
    [2,0,2,0,0,1,1,1,1,1,1,0,0,0,0,2,0,0,0,2],
    [2,0,2,0,0,0,0,0,0,1,1,1,1,1,0,2,0,0,0,2],
    [2,0,0,0,2,0,0,0,0,0,0,0,0,1,0,0,0,2,0,2],
    [2,0,0,2,2,0,2,0,0,0,0,0,0,1,0,2,0,2,0,2],
    [2,0,0,0,0,0,2,0,2,2,0,2,0,1,1,1,1,1,4,2],
    [2,2,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,2,2],
    [2,2,0,2,0,0,0,0,0,0,0,0,0,0,0,2,0,0,2,2],
    [2,2,0,2,0,0,2,0,0,0,0,0,0,2,0,2,0,0,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_09: 縦隔の迷宮 — 暗い入り組んだ通路
  area_09: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,1,2,2,0,0,0,2,2,0,0,0,0,0,0,0,2],
    [2,2,2,2,1,2,0,0,2,0,2,2,0,2,2,0,0,0,0,2],
    [2,0,0,0,1,0,0,2,2,0,0,0,0,2,2,0,2,0,0,2],
    [2,0,2,0,1,1,1,1,0,0,0,0,0,0,0,0,2,0,0,2],
    [2,0,2,0,0,0,0,1,0,2,2,0,2,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,1,1,1,0,0,2,0,2,0,0,0,0,2],
    [2,2,0,0,2,0,0,0,0,1,0,0,0,0,2,0,0,2,0,2],
    [2,2,0,2,2,0,0,0,0,1,1,1,1,0,0,0,0,2,0,2],
    [2,0,0,0,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0,2],
    [2,0,0,0,0,2,2,0,0,0,0,0,1,1,1,0,0,0,0,2],
    [2,0,2,0,0,0,0,0,0,0,2,0,0,0,1,1,1,0,0,2],
    [2,0,2,0,0,0,0,0,0,2,2,0,0,0,0,0,1,1,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_10: 下顎の渓谷 — 渓谷状の地形
  area_10: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,2,2,2,0,0,2,2,2,0,0,2,2,2,0,0,0,2],
    [2,0,0,2,3,2,0,0,2,3,2,0,0,2,3,2,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,5,5,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,0,2],
    [2,5,5,0,2,2,0,0,2,2,0,0,2,2,0,0,5,5,0,2],
    [2,0,0,0,2,2,0,0,2,2,0,0,2,2,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,2,3,2,0,0,2,3,2,0,0,2,3,2,0,0,0,2],
    [2,0,0,2,2,2,0,0,2,2,2,0,0,2,2,2,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_11: 腋窩の霧 — 霧深い草原
  area_11: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,0,0,3,3,0,0,3,3,0,0,3,3,0,0,3,3,0,2],
    [2,0,0,0,3,3,0,0,3,3,0,0,3,3,0,0,3,3,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,3,0,0,3,3,0,0,3,3,0,0,3,3,0,0,3,0,2],
    [2,0,3,0,0,3,3,0,0,3,3,0,0,3,3,0,0,3,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,3,3,0,0,3,3,0,0,3,3,0,0,3,3,0,0,0,2],
    [2,0,3,3,0,0,3,3,0,0,3,3,0,0,3,3,0,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,3,3,0,0,3,3,0,0,3,3,0,0,3,3,0,0,2],
    [2,0,0,3,3,0,0,3,3,0,0,3,3,0,0,3,3,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_12: 肩甲胸郭の岩壁 — 岩場の壁が多い地形
  area_12: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,2,2,2,2,0,0,0,2,2,2,2,0,0,0,0,2],
    [2,2,2,1,2,0,0,2,0,0,0,2,0,0,2,0,0,0,0,2],
    [2,0,0,1,0,0,0,2,2,0,2,2,0,0,2,0,0,0,0,2],
    [2,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,2,0,2],
    [2,0,2,0,0,1,0,0,0,2,2,0,0,0,0,2,0,2,0,2],
    [2,0,2,0,0,1,1,1,0,2,2,0,0,1,1,1,1,0,0,2],
    [2,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,2],
    [2,2,0,0,2,0,0,1,1,1,0,0,0,1,0,2,0,0,0,2],
    [2,2,0,0,2,0,0,0,0,1,1,1,1,1,0,2,0,0,0,2],
    [2,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,0,2,0,0,2,0,0,0,2,0,0,0,0,0,2,0,0,2],
    [2,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,2,0,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_13: 腹膜の深淵 — 暗い洞窟・深部
  area_13: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,1,1,2,2,3,3,2,2,3,3,2,2,0,0,0,2],
    [2,2,2,2,2,1,2,0,3,3,2,0,3,3,2,0,0,0,0,2],
    [2,3,3,0,0,1,0,0,0,0,0,0,0,0,0,0,0,3,3,2],
    [2,3,3,0,0,1,1,1,0,0,0,0,0,1,1,1,0,3,3,2],
    [2,0,0,0,0,0,0,1,0,3,3,3,0,1,0,0,0,0,0,2],
    [2,0,0,3,0,0,0,1,0,3,3,3,0,1,0,0,0,3,0,2],
    [2,0,0,3,0,0,0,1,0,0,0,0,0,1,0,0,0,3,0,2],
    [2,0,0,0,0,0,0,1,1,1,0,1,1,1,0,0,0,0,0,2],
    [2,3,3,0,0,0,0,0,0,1,0,1,0,0,0,0,0,3,3,2],
    [2,3,3,0,0,0,0,0,0,1,0,1,0,0,0,0,0,3,3,2],
    [2,0,0,0,0,3,3,0,0,0,0,0,0,0,3,3,0,0,0,2],
    [2,0,0,0,0,3,3,0,0,0,0,0,0,0,3,3,0,0,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_14: 大腰筋の回廊 — 細長い回廊型
  area_14: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,2],
    [2,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,1,0,2],
    [2,0,0,3,0,0,0,3,0,0,0,3,0,0,0,3,0,1,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,2],
    [2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2],
    [2,0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,0,1,0,0,3,0,0,0,3,0,0,0,3,0,0,0,0,0,2],
    [2,0,1,0,0,3,0,0,0,3,0,0,0,3,0,0,0,0,0,2],
    [2,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
    [2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2],
    [2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_15: 上肢胸郭の橋 — 橋状の地形（水の上を渡る）
  area_15: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,2],
    [2,2,2,1,0,5,5,5,5,5,5,5,5,5,5,5,5,5,5,2],
    [2,0,0,1,0,0,0,5,5,5,5,5,5,5,5,5,5,5,5,2],
    [2,0,0,1,1,1,0,0,0,5,5,5,5,5,5,5,5,5,5,2],
    [2,0,0,0,0,1,1,1,0,0,0,5,5,5,5,5,5,5,5,2],
    [2,0,0,0,0,0,0,1,1,1,0,0,0,5,5,5,5,5,5,2],
    [2,5,5,0,0,0,0,0,0,1,1,1,0,0,0,5,5,5,5,2],
    [2,5,5,5,0,0,0,0,0,0,0,1,1,1,0,0,0,5,5,2],
    [2,5,5,5,5,0,0,0,0,0,0,0,0,1,1,1,0,0,5,2],
    [2,5,5,5,5,5,0,0,0,0,0,0,0,0,0,1,1,1,4,2],
    [2,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,0,2,2],
    [2,5,5,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],

  // area_16: 足趾の神殿 — ラストエリア、神殿風
  area_16: [
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0,2],
    [2,0,1,1,1,2,0,0,0,0,0,0,2,0,1,1,1,1,0,2],
    [2,0,1,3,1,2,0,2,0,0,0,2,2,0,1,3,0,0,0,2],
    [2,0,1,3,1,0,0,2,0,3,0,2,0,0,1,3,0,0,0,2],
    [2,0,1,1,1,0,0,0,0,3,0,0,0,0,1,1,1,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2],
    [2,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,0,0,2],
    [2,0,0,2,0,0,1,3,0,0,0,3,1,0,0,2,1,0,0,2],
    [2,0,0,2,0,0,1,3,0,0,0,3,1,0,0,2,1,0,0,2],
    [2,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,0,0,2],
    [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,4,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
    [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  ],
};

// エリア別タイルカラーオーバーライド
const AREA_TILE_COLORS = {
  area_01: null, // デフォルト（草原）
  area_02: {
    [TILE.GRASS]: { base:'#1a1030', accent:'#120c24', border:'#2a1a40' },
    [TILE.DEEP]:  { base:'#110820', accent:'#0c0618', border:'#1a1030' },
    [TILE.PATH]:  { base:'#4a3060', accent:'#3a204e', border:'#5a4070' },
    [TILE.WALL]:  { base:'#3d1a1a', accent:'#2a1010', border:'#5a2a2a' },
  },
  area_03: {
    [TILE.GRASS]: { base:'#5c4030', accent:'#4a3020', border:'#6e5040' },
    [TILE.DEEP]:  { base:'#3a2818', accent:'#2a1a0c', border:'#4a3220' },
    [TILE.PATH]:  { base:'#7a6050', accent:'#6a5040', border:'#8a7060' },
    [TILE.WALL]:  { base:'#5a4030', accent:'#402a1a', border:'#7a5040' },
  },
  area_04: {
    [TILE.GRASS]: { base:'#c8dce8', accent:'#a8c0d4', border:'#d8ecf8' },
    [TILE.DEEP]:  { base:'#a0b8d0', accent:'#88a0c0', border:'#b8cce0' },
    [TILE.PATH]:  { base:'#e8f0f8', accent:'#d0dce8', border:'#f0f8ff' },
    [TILE.WALL]:  { base:'#8090a8', accent:'#607090', border:'#a0b0c8' },
    [TILE.WATER]: { base:'#5090d0', accent:'#3070b8', border:'#70b0e8' },
  },
  area_05: {
    [TILE.GRASS]: { base:'#c8a060', accent:'#b08040', border:'#d8b070' },
    [TILE.DEEP]:  { base:'#a07840', accent:'#886030', border:'#b89050' },
    [TILE.PATH]:  { base:'#d8c090', accent:'#c0a870', border:'#e8d0a0' },
    [TILE.WALL]:  { base:'#8a6030', accent:'#704820', border:'#a07840' },
  },
  area_06: {
    [TILE.GRASS]: { base:'#306848', accent:'#205838', border:'#407858' },
    [TILE.DEEP]:  { base:'#205038', accent:'#183828', border:'#306048' },
    [TILE.PATH]:  { base:'#d0c090', accent:'#b8a870', border:'#e0d0a0' },
    [TILE.WALL]:  { base:'#385830', accent:'#284820', border:'#487840' },
    [TILE.WATER]: { base:'#1060a0', accent:'#0a4880', border:'#2080c0' },
  },
  area_07: {
    [TILE.GRASS]: { base:'#284838', accent:'#1c3828', border:'#385848' },
    [TILE.DEEP]:  { base:'#183428', accent:'#102818', border:'#284038' },
    [TILE.PATH]:  { base:'#506848', accent:'#405838', border:'#607858' },
    [TILE.WALL]:  { base:'#203828', accent:'#182818', border:'#304838' },
  },
  area_08: {
    [TILE.GRASS]: { base:'#0d0820', accent:'#080514', border:'#1a1030' },
    [TILE.DEEP]:  { base:'#08051a', accent:'#050310', border:'#100820' },
    [TILE.PATH]:  { base:'#2a1848', accent:'#1e1038', border:'#3a2858' },
    [TILE.WALL]:  { base:'#1a0a30', accent:'#100620', border:'#2a1040' },
  },
  area_09: {
    [TILE.GRASS]: { base:'#0d1b2a', accent:'#081422', border:'#122234' },
    [TILE.DEEP]:  { base:'#081018', accent:'#040c12', border:'#0c1820' },
    [TILE.PATH]:  { base:'#1a3050', accent:'#122440', border:'#224060' },
    [TILE.WALL]:  { base:'#0a1828', accent:'#060e1a', border:'#102030' },
  },
  area_10: {
    [TILE.GRASS]: { base:'#1c1000', accent:'#140c00', border:'#261600' },
    [TILE.DEEP]:  { base:'#140c00', accent:'#0c0800', border:'#1c1000' },
    [TILE.PATH]:  { base:'#3a2810', accent:'#2a1c08', border:'#4a3820' },
    [TILE.WALL]:  { base:'#2a1800', accent:'#1c1000', border:'#3a2400' },
    [TILE.WATER]: { base:'#1a3060', accent:'#102448', border:'#2a4080' },
  },
  area_11: {
    [TILE.GRASS]: { base:'#0a1a0a', accent:'#061206', border:'#102210' },
    [TILE.DEEP]:  { base:'#061006', accent:'#040804', border:'#0a180a' },
    [TILE.PATH]:  { base:'#203820', accent:'#182c18', border:'#2a4828' },
    [TILE.WALL]:  { base:'#0c1a0c', accent:'#081008', border:'#122212' },
  },
  area_12: {
    [TILE.GRASS]: { base:'#0d2b3e', accent:'#082030', border:'#123448' },
    [TILE.DEEP]:  { base:'#082030', accent:'#041824', border:'#0e2a3c' },
    [TILE.PATH]:  { base:'#1a4060', accent:'#103050', border:'#205070' },
    [TILE.WALL]:  { base:'#0a2030', accent:'#061520', border:'#102838' },
  },
  area_13: {
    [TILE.GRASS]: { base:'#1a0d00', accent:'#100800', border:'#221200' },
    [TILE.DEEP]:  { base:'#100800', accent:'#080500', border:'#180c00' },
    [TILE.PATH]:  { base:'#3a2010', accent:'#2c1808', border:'#4a2c18' },
    [TILE.WALL]:  { base:'#281000', accent:'#1a0a00', border:'#381800' },
  },
  area_14: {
    [TILE.GRASS]: { base:'#1a1000', accent:'#100c00', border:'#221600' },
    [TILE.DEEP]:  { base:'#100c00', accent:'#080800', border:'#181200' },
    [TILE.PATH]:  { base:'#504030', accent:'#403020', border:'#605040' },
    [TILE.WALL]:  { base:'#2a1e00', accent:'#1c1400', border:'#3a2800' },
  },
  area_15: {
    [TILE.GRASS]: { base:'#002233', accent:'#001a28', border:'#002c40' },
    [TILE.DEEP]:  { base:'#001a28', accent:'#00121e', border:'#002232' },
    [TILE.PATH]:  { base:'#204060', accent:'#183250', border:'#285070' },
    [TILE.WALL]:  { base:'#001c2c', accent:'#001220', border:'#002438' },
    [TILE.WATER]: { base:'#0a4080', accent:'#083060', border:'#1050a0' },
  },
  area_16: {
    [TILE.GRASS]: { base:'#001a33', accent:'#001226', border:'#002240' },
    [TILE.DEEP]:  { base:'#001226', accent:'#000d1a', border:'#001a30' },
    [TILE.PATH]:  { base:'#c8a020', accent:'#b08010', border:'#d8b030' },
    [TILE.WALL]:  { base:'#402000', accent:'#2c1600', border:'#502c00' },
  },
};

const TILE_SIZE = 48;
const PLAYER_EMOJI = '🧑‍⚕️';
const SPRITE_SIZE = 40;

class MapManager {
  constructor() {
    this.canvas = document.getElementById('map-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.player = null;
    this.animFrame = null;
    this.moving = false;
    this.frameCount = 0;
    this.walkFrame = 0;
    this.onEncounter = null;
    this.onWarp = null;
    this.onTreasure = null;
    this.renderX = null;
    this.renderY = null;
    this._moveAnim = null;
    this.treasures = null;
    this._resizeBound = false;
    this._setupTouchKeys();
  }

  init(player) {
    this.player = player;
    this.renderX = player.x;
    this.renderY = player.y;
    this._moveAnim = null;
    this.moving = false;
    this._genTreasures();
    this.resize();
    if (!this._resizeBound) { window.addEventListener('resize', () => this.resize()); this._resizeBound = true; }
    this._startLoop();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  _startLoop() {
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    const loop = () => {
      this._updateMove();
      this._draw();
      this.frameCount++;
      this.animFrame = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
  }

  _draw() {
    const c = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    c.clearRect(0, 0, W, H);

    const map = MAPS[this.player.areaId] || MAPS['area_01'];
    const rows = map.length, cols = map[0].length;
    const px = (this.renderX != null ? this.renderX : this.player.x), py = (this.renderY != null ? this.renderY : this.player.y);

    // カメラ中央
    const camX = px * TILE_SIZE - W / 2 + TILE_SIZE / 2;
    const camY = py * TILE_SIZE - H / 2 + TILE_SIZE / 2;

    // エリア背景色
    const areaInfo = encounter.getAreaInfo ? encounter.getAreaInfo(this.player.areaId) : null;
    if (areaInfo && areaInfo.bgColor) {
      c.fillStyle = areaInfo.bgColor;
      c.fillRect(0, 0, W, H);
    }

    // タイル描画
    const areaId = this.player.areaId;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const t = map[row][col];
        const sx = col * TILE_SIZE - camX;
        const sy = row * TILE_SIZE - camY;
        if (sx + TILE_SIZE < 0 || sx > W || sy + TILE_SIZE < 0 || sy > H) continue;
        this._drawTile(c, t, sx, sy, areaId);
      }
    }

    // 宝箱描画
    this._drawTreasures(c, camX, camY, W, H);

    // プレイヤー描画（中央固定）
    const walkOffset = Math.sin(this.frameCount * 0.3) * 2;
    c.font = `${SPRITE_SIZE}px serif`;
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText(PLAYER_EMOJI, W / 2, H / 2 + walkOffset);

    // プレイヤー足元の影
    c.fillStyle = 'rgba(0,0,0,0.3)';
    c.beginPath();
    c.ellipse(W / 2, H / 2 + SPRITE_SIZE / 2 - 4, 12, 5, 0, 0, Math.PI * 2);
    c.fill();
  }

  _drawTile(c, type, x, y, areaId) {
    const areaOverride = areaId && AREA_TILE_COLORS[areaId];
    const col = (areaOverride && areaOverride[type]) || TILE_COLORS[type] || TILE_COLORS[TILE.GRASS];
    // ベース
    c.fillStyle = col.base;
    c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    // テクスチャ
    c.fillStyle = col.accent;
    if (type === TILE.GRASS || type === TILE.DEEP) {
      for (let i = 0; i < 4; i++) {
        const gx = x + (i * 11 + 3) % TILE_SIZE;
        const gy = y + (i * 13 + 5) % TILE_SIZE;
        c.fillRect(gx, gy, 2, 3);
      }
    }
    if (type === TILE.DEEP) {
      c.fillStyle = 'rgba(50,33,16,0.9)';
      c.fillRect(x + TILE_SIZE / 2 - 3, y + TILE_SIZE / 2 + 4, 6, 12);
      c.fillStyle = col.border;
      c.beginPath();
      c.moveTo(x + TILE_SIZE / 2, y + 6);
      c.lineTo(x + TILE_SIZE / 2 - 13, y + TILE_SIZE / 2 + 6);
      c.lineTo(x + TILE_SIZE / 2 + 13, y + TILE_SIZE / 2 + 6);
      c.closePath();
      c.fill();
    }
    if (type === TILE.WATER) {
      c.fillStyle = 'rgba(255,255,255,0.1)';
      const wave = Math.sin(this.frameCount * 0.05 + x * 0.1) * 3;
      c.fillRect(x + 4, y + 10 + wave, TILE_SIZE - 8, 3);
      c.fillRect(x + 8, y + 22 + wave * -1, TILE_SIZE - 16, 3);
    }
    if (type === TILE.WARP) {
      const pulse = 0.5 + 0.5 * Math.sin(this.frameCount * 0.1);
      c.fillStyle = `rgba(255,215,0,${pulse * 0.6})`;
      c.fillRect(x, y, TILE_SIZE, TILE_SIZE);
      c.font = '24px serif';
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillText('🚪', x + TILE_SIZE / 2, y + TILE_SIZE / 2);
    }
    if (type === TILE.WALL) {
      c.fillStyle = col.border;
      c.fillRect(x, y, TILE_SIZE, 4);
      c.fillRect(x, y, 4, TILE_SIZE);
    }
    // グリッド（薄く）
    c.strokeStyle = 'rgba(0,0,0,0.15)';
    c.lineWidth = 0.5;
    c.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
  }

  canMove(nx, ny) {
    const map = MAPS[this.player.areaId] || MAPS['area_01'];
    if (ny < 0 || ny >= map.length || nx < 0 || nx >= map[0].length) return false;
    return map[ny][nx] !== TILE.WALL && map[ny][nx] !== TILE.WATER;
  }

  getTile(x, y) {
    const map = MAPS[this.player.areaId] || MAPS['area_01'];
    if (y < 0 || y >= map.length || x < 0 || x >= map[0].length) return TILE.WALL;
    return map[y][x];
  }

  move(dx, dy) {
    if (this.moving) return;
    const nx = this.player.x + dx;
    const ny = this.player.y + dy;
    if (!this.canMove(nx, ny)) return;
    audio.seStep();
    this.moving = true;
    this._moveAnim = { x0: this.player.x, y0: this.player.y, x1: nx, y1: ny, t0: performance.now(), dur: 135 };
    this.player.x = nx;
    this.player.y = ny;
  }

  _updateMove() {
    if (!this._moveAnim) {
      if (this.renderX == null && this.player) { this.renderX = this.player.x; this.renderY = this.player.y; }
      return;
    }
    const a = this._moveAnim;
    let p = (performance.now() - a.t0) / a.dur;
    if (p > 1) p = 1;
    const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    this.renderX = a.x0 + (a.x1 - a.x0) * e;
    this.renderY = a.y0 + (a.y1 - a.y0) * e;
    if (p >= 1) {
      this.renderX = a.x1; this.renderY = a.y1;
      this._moveAnim = null;
      this.moving = false;
      this._arrive(a.x1, a.y1);
    }
  }

  _arrive(x, y) {
    const key = x + ',' + y;
    if (this.treasures && this.treasures.has(key)) {
      this.treasures.delete(key);
      audio.seLevelUp();
      if (this.onTreasure) this.onTreasure();
      return;
    }
    const tile = this.getTile(x, y);
    if (tile === TILE.WARP) { if (this.onWarp) this.onWarp(); return; }
    if (this.onEncounter && encounter.checkEncounter(tile)) {
      setTimeout(() => this.onEncounter(), 150);
    }
  }

  _genTreasures() {
    this.treasures = new Set();
    if (!this.player) return;
    const map = MAPS[this.player.areaId] || MAPS['area_01'];
    const open = [];
    for (let r = 0; r < map.length; r++) {
      for (let col = 0; col < map[0].length; col++) {
        if ((map[r][col] === TILE.GRASS || map[r][col] === TILE.PATH) &&
            !(col === this.player.x && r === this.player.y)) {
          open.push([col, r]);
        }
      }
    }
    const n = Math.min(4, open.length);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * open.length);
      const cell = open.splice(idx, 1)[0];
      this.treasures.add(cell[0] + ',' + cell[1]);
    }
  }

  _drawTreasures(c, camX, camY, W, H) {
    if (!this.treasures) return;
    c.font = '26px serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    const bob = Math.sin(this.frameCount * 0.12) * 2;
    this.treasures.forEach(key => {
      const parts = key.split(',');
      const tx = Number(parts[0]), ty = Number(parts[1]);
      const sx = tx * TILE_SIZE - camX + TILE_SIZE / 2;
      const sy = ty * TILE_SIZE - camY + TILE_SIZE / 2 + bob;
      if (sx < -TILE_SIZE || sx > W + TILE_SIZE || sy < -TILE_SIZE || sy > H + TILE_SIZE) return;
      const pulse = 0.4 + 0.4 * Math.sin(this.frameCount * 0.1);
      c.fillStyle = 'rgba(255,215,0,' + (pulse * 0.5) + ')';
      c.beginPath(); c.arc(sx, sy, 15, 0, Math.PI * 2); c.fill();
      c.fillText('💎', sx, sy);
    });
  }

  _setupTouchKeys() {
    const addBtn = (id, dx, dy) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('touchstart', e => { e.preventDefault(); this.move(dx, dy); }, { passive: false });
      btn.addEventListener('mousedown', e => { e.preventDefault(); this.move(dx, dy); });
    };
    addBtn('btn-up', 0, -1);
    addBtn('btn-down', 0, 1);
    addBtn('btn-left', -1, 0);
    addBtn('btn-right', 1, 0);
  }
}
