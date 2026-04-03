(function (global) {
  /**
   * Скины фишек: крестик и нолик независимы. markId совпадает с ключами TTTMarkAssets.
   */
  var PIECE_X = [
    { id: "x-classic", name: "Классика ✕", price: 0, role: "x" },
    { id: "x-neon", name: "Неон ✕", price: 45, role: "x" },
    { id: "x-pixel", name: "Пиксель ✕", price: 55, role: "x" },
    { id: "x-candy", name: "Конфета ✕", price: 110, role: "x" },
    { id: "x-ink", name: "Чернила ✕", price: 220, role: "x" },
    { id: "x-gold", name: "Золото ✕", price: 700, role: "x" },
    {
      id: "x-drop-meteor",
      name: "Звездопад ✕",
      price: 0,
      role: "x",
      dropOnly: true,
      dropLabel: "только дроп",
    },
    {
      id: "x-drop-prism",
      name: "Призма ✕",
      price: 0,
      role: "x",
      dropOnly: true,
      dropLabel: "только дроп",
    },
  ];

  var PIECE_O = [
    { id: "o-classic", name: "Классика ○", price: 0, role: "o" },
    { id: "o-neon", name: "Неон ○", price: 45, role: "o" },
    { id: "o-orbit", name: "Орбита ○", price: 60, role: "o" },
    { id: "o-soda", name: "Сода ○", price: 110, role: "o" },
    { id: "o-gem", name: "Кристалл ○", price: 220, role: "o" },
    { id: "o-gold", name: "Золото ○", price: 700, role: "o" },
    {
      id: "o-drop-lunar",
      name: "Лунное ○",
      price: 0,
      role: "o",
      dropOnly: true,
      dropLabel: "только дроп",
    },
    {
      id: "o-drop-plasma",
      name: "Плазма ○",
      price: 0,
      role: "o",
      dropOnly: true,
      dropLabel: "только дроп",
    },
  ];

  function getPieceById(id) {
    for (var i = 0; i < PIECE_X.length; i++) {
      if (PIECE_X[i].id === id) return PIECE_X[i];
    }
    for (var j = 0; j < PIECE_O.length; j++) {
      if (PIECE_O[j].id === id) return PIECE_O[j];
    }
    return null;
  }

  function roleOf(id) {
    var p = getPieceById(id);
    return p ? p.role : null;
  }

  global.TTTPieces = {
    PIECE_X: PIECE_X,
    PIECE_O: PIECE_O,
    getPieceById: getPieceById,
    roleOf: roleOf,
  };
})(typeof window !== "undefined" ? window : this);
