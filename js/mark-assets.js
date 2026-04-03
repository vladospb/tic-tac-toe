(function (global) {
  var NS = "http://www.w3.org/2000/svg";

  function dataUrl(svg) {
    return (
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.trim())
    );
  }

  function wrapViewbox(inner, size, extraDefs) {
    size = size || 64;
    return (
      '<svg xmlns="' +
      NS +
      '" viewBox="0 0 ' +
      size +
      " " +
      size +
      '" width="' +
      size +
      '" height="' +
      size +
      '">' +
      (extraDefs || "") +
      inner +
      "</svg>"
    );
  }

  var MARKS = {
    "x-classic": function () {
      var inner =
        '<line x1="14" y1="14" x2="50" y2="50" stroke="#ff9f43" stroke-width="8" stroke-linecap="round"/>' +
        '<line x1="50" y1="14" x2="14" y2="50" stroke="#ff9f43" stroke-width="8" stroke-linecap="round"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },
    "x-neon": function () {
      var defs =
        "<defs>" +
        '<filter id="g" x="-40%" y="-40%" width="180%" height="180%">' +
        "<feGaussianBlur stdDeviation=\"3\" result=\"b\"/>" +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        "</filter></defs>";
      var inner =
        '<g filter="url(#g)">' +
        '<line x1="15" y1="15" x2="49" y2="49" stroke="#00fff0" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="49" y1="15" x2="15" y2="49" stroke="#00fff0" stroke-width="7" stroke-linecap="round"/>' +
        "</g>";
      return dataUrl(wrapViewbox(defs + inner, 64));
    },
    "x-candy": function () {
      var inner =
        '<line x1="16" y1="16" x2="48" y2="48" stroke="#ff6b9d" stroke-width="10" stroke-linecap="round"/>' +
        '<line x1="48" y1="16" x2="16" y2="48" stroke="#feca57" stroke-width="10" stroke-linecap="round"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },
    "x-ink": function () {
      var inner =
        '<path d="M14 18 L46 46 M46 16 L18 48" stroke="#2d1b4e" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M15 17 L45 45" stroke="#5b4dff" stroke-width="3" stroke-linecap="round" opacity="0.9"/>' +
        '<path d="M45 17 L17 45" stroke="#5b4dff" stroke-width="3" stroke-linecap="round" opacity="0.9"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },
    "x-gold": function () {
      var defs =
        "<defs>" +
        '<linearGradient id="xg" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#fff4c2"/>' +
        '<stop offset="45%" stop-color="#ffd700"/>' +
        '<stop offset="100%" stop-color="#b8860b"/>' +
        "</linearGradient></defs>";
      var inner =
        '<line x1="14" y1="14" x2="50" y2="50" stroke="url(#xg)" stroke-width="9" stroke-linecap="round"/>' +
        '<line x1="50" y1="14" x2="14" y2="50" stroke="url(#xg)" stroke-width="9" stroke-linecap="round"/>';
      return dataUrl(wrapViewbox(defs + inner, 64));
    },
    "x-pixel": function () {
      var c = "#3dff7a";
      var u = 10;
      var o = 11;
      var rects = "";
      var i;
      for (i = 0; i < 5; i++) {
        rects +=
          '<rect x="' +
          (o + i * u) +
          '" y="' +
          (o + i * u) +
          '" width="9" height="9" fill="' +
          c +
          '"/>';
      }
      for (i = 0; i < 5; i++) {
        if (i === 2) continue;
        rects +=
          '<rect x="' +
          (o + (4 - i) * u) +
          '" y="' +
          (o + i * u) +
          '" width="9" height="9" fill="' +
          c +
          '"/>';
      }
      return dataUrl(wrapViewbox(rects, 64));
    },

    "o-classic": function () {
      var inner =
        '<circle cx="32" cy="32" r="19" fill="none" stroke="#54a0ff" stroke-width="7"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },
    "o-neon": function () {
      var defs =
        "<defs>" +
        '<filter id="og" x="-50%" y="-50%" width="200%" height="200%">' +
        "<feGaussianBlur stdDeviation=\"2.5\" result=\"b\"/>" +
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        "</filter></defs>";
      var inner =
        '<circle cx="32" cy="32" r="20" fill="none" stroke="#bf5fff" stroke-width="4" opacity="0.85" filter="url(#og)"/>' +
        '<circle cx="32" cy="32" r="15" fill="none" stroke="#ff6b9d" stroke-width="5" stroke-linecap="round" filter="url(#og)"/>';
      return dataUrl(wrapViewbox(defs + inner, 64));
    },
    "o-soda": function () {
      var inner =
        '<circle cx="32" cy="32" r="20" fill="#4cd964" fill-opacity="0.35" stroke="#2ecc71" stroke-width="6"/>' +
        '<circle cx="24" cy="26" r="4" fill="#fff" fill-opacity="0.5"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },
    "o-gem": function () {
      var inner =
        '<polygon points="32,12 52,26 44,52 20,52 12,26" fill="none" stroke="#00cec9" stroke-width="5" stroke-linejoin="round"/>' +
        '<polygon points="32,20 42,28 38,46 26,46 22,28" fill="rgba(0,206,201,0.15)"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },
    "o-gold": function () {
      var defs =
        "<defs>" +
        '<linearGradient id="ogd" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#ffeaa7"/>' +
        '<stop offset="50%" stop-color="#fdcb6e"/>' +
        '<stop offset="100%" stop-color="#e17055"/>' +
        "</linearGradient></defs>";
      var inner =
        '<circle cx="32" cy="32" r="20" fill="url(#ogd)" fill-opacity="0.25" stroke="url(#ogd)" stroke-width="7"/>';
      return dataUrl(wrapViewbox(defs + inner, 64));
    },
    "o-orbit": function () {
      var inner =
        '<ellipse cx="32" cy="32" rx="22" ry="12" fill="none" stroke="#74b9ff" stroke-width="5" transform="rotate(-25 32 32)"/>' +
        '<circle cx="48" cy="28" r="5" fill="#a29bfe"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },

    "x-drop-meteor": function () {
      var defs =
        "<defs>" +
        '<linearGradient id="xm" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#ffffff"/>' +
        '<stop offset="35%" stop-color="#7ee8fa"/>' +
        '<stop offset="100%" stop-color="#4facfe"/>' +
        "</linearGradient></defs>";
      var inner =
        '<line x1="14" y1="14" x2="50" y2="50" stroke="url(#xm)" stroke-width="7" stroke-linecap="round"/>' +
        '<line x1="50" y1="14" x2="14" y2="50" stroke="url(#xm)" stroke-width="7" stroke-linecap="round"/>' +
        '<circle cx="14" cy="14" r="2.5" fill="#fff"/>' +
        '<circle cx="50" cy="50" r="2" fill="#b8e8ff"/>' +
        '<circle cx="52" cy="14" r="1.8" fill="#e0f7ff"/>';
      return dataUrl(wrapViewbox(defs + inner, 64));
    },
    "x-drop-prism": function () {
      var defs =
        "<defs>" +
        '<linearGradient id="xp" x1="0%" y1="100%" x2="100%" y2="0%">' +
        '<stop offset="0%" stop-color="#f093fb"/>' +
        '<stop offset="50%" stop-color="#f5576c"/>' +
        '<stop offset="100%" stop-color="#4facfe"/>' +
        "</linearGradient></defs>";
      var inner =
        '<line x1="14" y1="14" x2="50" y2="50" stroke="url(#xp)" stroke-width="8" stroke-linecap="round"/>' +
        '<line x1="50" y1="14" x2="14" y2="50" stroke="url(#xp)" stroke-width="8" stroke-linecap="round"/>' +
        '<line x1="16" y1="16" x2="48" y2="48" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.35"/>';
      return dataUrl(wrapViewbox(defs + inner, 64));
    },
    "o-drop-lunar": function () {
      var inner =
        '<circle cx="32" cy="32" r="18" fill="#e8dcc8" stroke="#c4a574" stroke-width="4"/>' +
        '<circle cx="44" cy="26" r="14" fill="#0d2135"/>';
      return dataUrl(wrapViewbox(inner, 64));
    },
    "o-drop-plasma": function () {
      var defs =
        "<defs>" +
        '<linearGradient id="op" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#00ff9d"/>' +
        '<stop offset="100%" stop-color="#9d50bb"/>' +
        "</linearGradient></defs>";
      var inner =
        '<circle cx="32" cy="32" r="20" fill="none" stroke="url(#op)" stroke-width="6"/>' +
        '<circle cx="32" cy="32" r="14" fill="none" stroke="url(#op)" stroke-width="3" opacity="0.85"/>' +
        '<path d="M22 32 L28 26 M38 38 L44 30" stroke="#c8ffc8" stroke-width="2" stroke-linecap="round"/>';
      return dataUrl(wrapViewbox(defs + inner, 64));
    },
  };

  var cache = {};

  function getMarkUrl(markId) {
    if (cache[markId]) return cache[markId];
    var fn = MARKS[markId];
    if (!fn) markId = "x-classic";
    fn = MARKS[markId];
    var url = fn();
    cache[markId] = url;
    return url;
  }

  global.TTTMarkAssets = {
    getMarkUrl: getMarkUrl,
    MARK_IDS: Object.keys(MARKS),
  };
})(typeof window !== "undefined" ? window : this);
