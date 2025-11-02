// Simple localStorage-backed list manager for per-user saved game lists.
// Keyed by `gamebase_saved_<userId>`; falls back to `gamebase_saved_guest`.

const STORAGE_PREFIX = "gamebase_saved_";

function storageKey(userId) {
  return STORAGE_PREFIX + (userId || "guest");
}

function readRaw(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("savedLists: read error", err);
    return [];
  }
}

function writeRaw(userId, list) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(list));
    return true;
  } catch (err) {
    console.error("savedLists: write error", err);
    return false;
  }
}

export function getSavedList(userId) {
  return readRaw(userId);
}

// store a minimal game shape to reduce storage
function minimal(game) {
  if (!game || !game.id) return null;
  return {
    id: game.id,
    name: game.name,
    cover: game.cover?.url ? `https:${game.cover.url}` : null,
    genres: game.genres || [],
    rating: game.rating || null,
    first_release_date: game.first_release_date || null,
  };
}

export function isGameSaved(userId, gameId) {
  const list = readRaw(userId);
  return list.some((g) => String(g.id) === String(gameId));
}

export function addGameToList(userId, game) {
  const item = minimal(game);
  if (!item) return false;
  const list = readRaw(userId);
  if (list.some((g) => String(g.id) === String(item.id))) return true;
  list.unshift(item);
  return writeRaw(userId, list);
}

export function removeGameFromList(userId, gameId) {
  const list = readRaw(userId).filter((g) => String(g.id) !== String(gameId));
  return writeRaw(userId, list);
}

export function clearSavedList(userId) {
  return writeRaw(userId, []);
}

export default {
  getSavedList,
  isGameSaved,
  addGameToList,
  removeGameFromList,
  clearSavedList,
};
