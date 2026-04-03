(function (global) {
  /**
   * Скины: чисто CSS-темы (data-skin на body).
   * dropOnly — только из сверхредкого дропа 1/1 000 000.
   */
  /**
   * Темы доски (фон + клетки). preview — для мини-превью в магазине.
   */
  var SKINS = [
    {
      id: "classic",
      name: "Классика",
      price: 0,
      dropOnly: false,
      preview: { bg: "#0f1419", surface: "#1a2332", cell: "#243044" },
    },
    {
      id: "forest",
      name: "Лес",
      price: 50,
      dropOnly: false,
      preview: { bg: "#0d1f14", surface: "#153024", cell: "#1e402e" },
    },
    {
      id: "sunset",
      name: "Закат",
      price: 120,
      dropOnly: false,
      preview: { bg: "#1a0e1e", surface: "#2d1528", cell: "#402040" },
    },
    {
      id: "mono",
      name: "Монохром",
      price: 300,
      dropOnly: false,
      preview: { bg: "#111111", surface: "#1c1c1c", cell: "#2a2a2a" },
    },
    {
      id: "neon",
      name: "Неон",
      price: 800,
      dropOnly: false,
      preview: { bg: "#050510", surface: "#0a0a18", cell: "#12122a" },
    },
    {
      id: "gold",
      name: "Золото",
      price: 2500,
      dropOnly: false,
      preview: { bg: "#1a1508", surface: "#2d2410", cell: "#3d3218" },
    },
    {
      id: "void",
      name: "Пустота",
      price: 0,
      dropOnly: true,
      dropLabel: "легендарный дроп",
      preview: { bg: "#020208", surface: "#0a0620", cell: "#12082e" },
    },
    {
      id: "aurora",
      name: "Сияние",
      price: 0,
      dropOnly: true,
      dropLabel: "только дроп",
      preview: { bg: "#071018", surface: "#0d2135", cell: "#153d52" },
    },
    {
      id: "inferno",
      name: "Пекло",
      price: 0,
      dropOnly: true,
      dropLabel: "только дроп",
      preview: { bg: "#140605", surface: "#241008", cell: "#3d180c" },
    },
  ];

  var DROP_SKIN_IDS = SKINS.filter(function (s) {
    return s.dropOnly;
  }).map(function (s) {
    return s.id;
  });

  var SHOP_SKINS = SKINS.filter(function (s) {
    return !s.dropOnly && s.price > 0;
  });

  function getById(id) {
    for (var i = 0; i < SKINS.length; i++) {
      if (SKINS[i].id === id) return SKINS[i];
    }
    return null;
  }

  global.TTTSkins = {
    SKINS: SKINS,
    SHOP_SKINS: SHOP_SKINS,
    DROP_SKIN_IDS: DROP_SKIN_IDS,
    getById: getById,
  };
})(typeof window !== "undefined" ? window : this);
