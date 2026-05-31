// storage.js — LocalStorage セーブ/ロード
const SAVE_KEY = 'rokusou_save_v1';

const Storage = {
  save(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      return true;
    } catch(e) { return false; }
  },
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  },
  clear() {
    localStorage.removeItem(SAVE_KEY);
  },
  hasSave() {
    return !!localStorage.getItem(SAVE_KEY);
  }
};
