(function (global) {
  var STORAGE_KEY = "ttt_save_v1";
  var DEFAULT_STATE = {
    version: 2,
    coins: 100,
    lastDailyYmd: "",
    ownedSkinIds: ["classic"],
    equippedSkinId: "classic",
    ownedPieceXIds: ["x-classic"],
    ownedPieceOIds: ["o-classic"],
    equippedPieceXId: "x-classic",
    equippedPieceOId: "o-classic",
  };

  function todayYmd() {
    var d = new Date();
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      var data = JSON.parse(raw);
      if (typeof data.coins !== "number") data.coins = DEFAULT_STATE.coins;
      if (!Array.isArray(data.ownedSkinIds)) data.ownedSkinIds = DEFAULT_STATE.ownedSkinIds.slice();
      if (typeof data.equippedSkinId !== "string") data.equippedSkinId = DEFAULT_STATE.equippedSkinId;
      if (typeof data.lastDailyYmd !== "string") data.lastDailyYmd = "";
      if (data.ownedSkinIds.indexOf("classic") === -1) data.ownedSkinIds.unshift("classic");
      if (!data.version || data.version < 2) {
        data.version = 2;
        if (!Array.isArray(data.ownedPieceXIds)) data.ownedPieceXIds = ["x-classic"];
        if (!Array.isArray(data.ownedPieceOIds)) data.ownedPieceOIds = ["o-classic"];
        if (typeof data.equippedPieceXId !== "string") data.equippedPieceXId = "x-classic";
        if (typeof data.equippedPieceOId !== "string") data.equippedPieceOId = "o-classic";
      }
      return data;
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  global.TTTStorage = {
    load: load,
    save: save,
    todayYmd: todayYmd,
    DEFAULT_STATE: DEFAULT_STATE,
  };
})(typeof window !== "undefined" ? window : this);
