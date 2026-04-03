(function (global) {
  var BET = 10;
  var POT = 20;
  var DAILY_BONUS = 100;
  var DROP_DENOM = 4;

  function applyDailyIfNeeded(state) {
    var today = global.TTTStorage.todayYmd();
    if (state.lastDailyYmd === today) return { granted: false, amount: 0 };
    if (state.lastDailyYmd === "") {
      state.lastDailyYmd = today;
      global.TTTStorage.save(state);
      return { granted: false, amount: 0 };
    }
    state.lastDailyYmd = today;
    state.coins += DAILY_BONUS;
    global.TTTStorage.save(state);
    return { granted: true, amount: DAILY_BONUS };
  }

  function canStartMatch(state) {
    return state.coins >= BET;
  }

  /** Списать ставку в начале матча */
  function chargeBet(state) {
    if (!canStartMatch(state)) return false;
    state.coins -= BET;
    global.TTTStorage.save(state);
    return true;
  }

  /** Победа: +20 монет (банк), шанс дропа скина 1 / 1 000 000 */
  function settleWin(state) {
    state.coins += POT;
    var dropMsg = trySkinDrop(state);
    global.TTTStorage.save(state);
    return { coinsDelta: POT - BET, dropMsg: dropMsg };
  }

  /** Поражение: ставка уже списана */
  function settleLose(state) {
    global.TTTStorage.save(state);
    return { coinsDelta: -BET };
  }

  /** Ничья: вернуть ставку */
  function settleDraw(state) {
    state.coins += BET;
    global.TTTStorage.save(state);
    return { coinsDelta: 0 };
  }

  function randomInt(maxExclusive) {
    if (global.crypto && global.crypto.getRandomValues) {
      var buf = new Uint32Array(1);
      global.crypto.getRandomValues(buf);
      return buf[0] % maxExclusive;
    }
    return Math.floor(Math.random() * maxExclusive);
  }

  function trySkinDrop(state) {
    if (randomInt(DROP_DENOM) !== 0) return null;
    var rewards = [];
    var i;
    var pool = global.TTTSkins.DROP_SKIN_IDS;
    for (i = 0; i < pool.length; i++) {
      var bid = pool[i];
      if (state.ownedSkinIds.indexOf(bid) !== -1) continue;
      var skin = global.TTTSkins.getById(bid);
      if (!skin) continue;
      rewards.push({
        kind: "board",
        label: "Тема доски: «" + skin.name + "»",
        boardId: bid,
      });
    }
    for (i = 0; i < global.TTTPieces.PIECE_X.length; i++) {
      var px = global.TTTPieces.PIECE_X[i];
      if (!px.dropOnly) continue;
      if (state.ownedPieceXIds.indexOf(px.id) !== -1) continue;
      rewards.push({
        kind: "piece",
        label: "Скин X: «" + px.name + "»",
        pieceId: px.id,
      });
    }
    for (i = 0; i < global.TTTPieces.PIECE_O.length; i++) {
      var po = global.TTTPieces.PIECE_O[i];
      if (!po.dropOnly) continue;
      if (state.ownedPieceOIds.indexOf(po.id) !== -1) continue;
      rewards.push({
        kind: "piece",
        label: "Скин ○: «" + po.name + "»",
        pieceId: po.id,
      });
    }
    if (!rewards.length) return null;
    var pick = rewards[randomInt(rewards.length)];
    if (pick.kind === "board") {
      state.ownedSkinIds.push(pick.boardId);
    } else {
      var piece = global.TTTPieces.getPieceById(pick.pieceId);
      var list =
        piece && piece.role === "x"
          ? state.ownedPieceXIds
          : state.ownedPieceOIds;
      if (list.indexOf(pick.pieceId) === -1) list.push(pick.pieceId);
    }
    return pick.label;
  }

  function tryBuy(state, skinId) {
    var skin = global.TTTSkins.getById(skinId);
    if (!skin || skin.dropOnly) return { ok: false, reason: "Нельзя купить" };
    if (state.ownedSkinIds.indexOf(skinId) !== -1) return { ok: false, reason: "Уже есть" };
    if (state.coins < skin.price) return { ok: false, reason: "Не хватает монет" };
    state.coins -= skin.price;
    state.ownedSkinIds.push(skinId);
    global.TTTStorage.save(state);
    return { ok: true };
  }

  function equip(state, skinId) {
    if (state.ownedSkinIds.indexOf(skinId) === -1) return false;
    state.equippedSkinId = skinId;
    global.TTTStorage.save(state);
    return true;
  }

  function tryBuyPiece(state, pieceId) {
    var p = global.TTTPieces.getPieceById(pieceId);
    if (!p) return { ok: false, reason: "Нет такого скина" };
    if (p.dropOnly) return { ok: false, reason: "Только из дропа" };
    var list = p.role === "x" ? state.ownedPieceXIds : state.ownedPieceOIds;
    if (list.indexOf(pieceId) !== -1) return { ok: false, reason: "Уже есть" };
    if (state.coins < p.price) return { ok: false, reason: "Не хватает монет" };
    state.coins -= p.price;
    list.push(pieceId);
    global.TTTStorage.save(state);
    return { ok: true };
  }

  function equipPiece(state, pieceId) {
    var p = global.TTTPieces.getPieceById(pieceId);
    if (!p) return false;
    var list = p.role === "x" ? state.ownedPieceXIds : state.ownedPieceOIds;
    if (list.indexOf(pieceId) === -1) return false;
    if (p.role === "x") state.equippedPieceXId = pieceId;
    else state.equippedPieceOId = pieceId;
    global.TTTStorage.save(state);
    return true;
  }

  global.TTTEconomy = {
    BET: BET,
    POT: POT,
    DAILY_BONUS: DAILY_BONUS,
    DROP_DENOM: DROP_DENOM,
    applyDailyIfNeeded: applyDailyIfNeeded,
    canStartMatch: canStartMatch,
    chargeBet: chargeBet,
    settleWin: settleWin,
    settleLose: settleLose,
    settleDraw: settleDraw,
    tryBuy: tryBuy,
    equip: equip,
    tryBuyPiece: tryBuyPiece,
    equipPiece: equipPiece,
  };
})(typeof window !== "undefined" ? window : this);
