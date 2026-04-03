(function () {
  var state = TTTStorage.load();
  var match = null;
  var saluteTimer = null;

  var el = {
    balance: document.getElementById("balance"),
    dailyHint: document.getElementById("daily-hint"),
    screenMenu: document.getElementById("screen-menu"),
    screenGame: document.getElementById("screen-game"),
    screenShop: document.getElementById("screen-shop"),
    menuError: document.getElementById("menu-error"),
    btnPlay: document.getElementById("btn-play"),
    btnShop: document.getElementById("btn-shop"),
    btnShopBack: document.getElementById("btn-shop-back"),
    btnAbandon: document.getElementById("btn-abandon"),
    board: document.getElementById("board"),
    gameStatus: document.getElementById("game-status"),
    shopList: document.getElementById("shop-list"),
    modalResult: document.getElementById("modal-result"),
    modalTitle: document.getElementById("modal-title"),
    modalText: document.getElementById("modal-text"),
    modalDrop: document.getElementById("modal-drop"),
    modalClose: document.getElementById("modal-close"),
    modalDaily: document.getElementById("modal-daily"),
    modalDailyText: document.getElementById("modal-daily-text"),
    modalDailyOk: document.getElementById("modal-daily-ok"),
  };

  function showScreen(name) {
    el.screenMenu.classList.toggle("active", name === "menu");
    el.screenGame.classList.toggle("active", name === "game");
    el.screenShop.classList.toggle("active", name === "shop");
  }

  function applySkinToBody() {
    document.body.setAttribute("data-skin", state.equippedSkinId || "classic");
  }

  function refreshBalance() {
    el.balance.textContent = String(state.coins);
  }

  function getDifficulty() {
    var radios = document.querySelectorAll('input[name="difficulty"]');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) return radios[i].value;
    }
    return "medium";
  }

  function buildBoard() {
    el.board.innerHTML = "";
    for (var i = 0; i < 9; i++) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cell";
      btn.dataset.index = String(i);
      btn.addEventListener("click", onCellClick);
      el.board.appendChild(btn);
    }
  }

  function isHumanTurn() {
    if (!match || match.gameOver) return false;
    return TTTGame.sideToMove(match.board) === match.humanSymbol;
  }

  function statusYourTurn() {
    if (!match) return "";
    return match.humanSymbol === "X" ? "Твой ход — крестик." : "Твой ход — нолик.";
  }

  function renderBoard() {
    var cells = el.board.querySelectorAll(".cell");
    var line = match && match.winLine ? match.winLine : null;
    var xUrl = TTTMarkAssets.getMarkUrl(state.equippedPieceXId || "x-classic");
    var oUrl = TTTMarkAssets.getMarkUrl(state.equippedPieceOId || "o-classic");
    var humanTurn = isHumanTurn();
    for (var i = 0; i < 9; i++) {
      var btn = cells[i];
      var v = match ? match.board[i] : "";
      btn.innerHTML = "";
      if (v === "X") {
        var ix = document.createElement("img");
        ix.className = "mark-img mark-x";
        ix.src = xUrl;
        ix.alt = "✕";
        btn.appendChild(ix);
      } else if (v === "O") {
        var io = document.createElement("img");
        io.className = "mark-img mark-o";
        io.src = oUrl;
        io.alt = "○";
        btn.appendChild(io);
      }
      btn.disabled =
        !match || match.gameOver || !!v || !humanTurn;
      btn.classList.toggle("win-line", line && line.indexOf(i) !== -1);
    }
  }

  function setStatus(text) {
    el.gameStatus.textContent = text;
  }

  function clearDropSalute() {
    if (saluteTimer) {
      clearTimeout(saluteTimer);
      saluteTimer = null;
    }
    var host = document.getElementById("drop-salute");
    if (host) host.innerHTML = "";
  }

  /** Конфетти при редком дропе */
  function playDropSalute() {
    clearDropSalute();
    var host = document.getElementById("drop-salute");
    if (!host) return;
    var colors = [
      "#ff6b6b",
      "#feca57",
      "#48dbfb",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#1dd1a1",
      "#ff9f43",
      "#ee5a24",
      "#00d2d3",
      "#fff200",
      "#c44569",
    ];
    var n = 96;
    for (var i = 0; i < n; i++) {
      var c = document.createElement("div");
      c.setAttribute("aria-hidden", "true");
      c.className = "drop-confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      var round = Math.random() < 0.35;
      if (round) {
        var d = 6 + Math.random() * 6;
        c.style.width = d + "px";
        c.style.height = d + "px";
        c.style.borderRadius = "50%";
      } else {
        c.style.width = 5 + Math.random() * 8 + "px";
        c.style.height = 7 + Math.random() * 14 + "px";
        c.style.borderRadius = Math.random() < 0.5 ? "2px" : "1px";
      }
      c.style.animationDelay = Math.random() * 2.2 + "s";
      c.style.animationDuration = 2.2 + Math.random() * 2.8 + "s";
      c.style.setProperty("--drift", Math.random() * 120 - 60 + "px");
      c.style.setProperty("--spin-end", Math.random() * 1440 - 720 + "deg");
      host.appendChild(c);
    }
    saluteTimer = setTimeout(clearDropSalute, 6500);
  }

  function finishMatch(result) {
    var dropName = null;
    if (result === "win") {
      var r = TTTEconomy.settleWin(state);
      dropName = r.dropMsg;
      el.modalTitle.textContent = "Победа!";
      el.modalText.textContent =
        "Ты забираешь банк: +" +
        TTTEconomy.POT +
        " монет (чистыми +" +
        (TTTEconomy.POT - TTTEconomy.BET) +
        " к ставке).";
    } else if (result === "lose") {
      TTTEconomy.settleLose(state);
      el.modalTitle.textContent = "Поражение";
      el.modalText.textContent =
        "Ставка " + TTTEconomy.BET + " монет не возвращается.";
    } else {
      TTTEconomy.settleDraw(state);
      el.modalTitle.textContent = "Ничья";
      el.modalText.textContent = "Ставки возвращены.";
    }
    if (dropName) {
      el.modalDrop.hidden = false;
      el.modalDrop.textContent =
        "Редкий дроп (1 / 1 000 000): " + dropName + "!";
      playDropSalute();
    } else {
      el.modalDrop.hidden = true;
      clearDropSalute();
    }
    el.modalResult.hidden = false;
    refreshBalance();
    match = null;
    setStatus("—");
    renderBoard();
  }

  function onCellClick(ev) {
    if (!match || match.gameOver) return;
    var idx = parseInt(ev.currentTarget.dataset.index, 10);
    var res = TTTGame.humanMove(match, idx);
    if (!res.ok) return;
    renderBoard();
    if (res.end) {
      if (res.result === "win") setStatus("Ты выиграл!");
      else setStatus("Ничья");
      finishMatch(res.result);
      return;
    }
    setStatus("Ход соперника…");
    disableAllCells(true);
    window.setTimeout(function () {
      var air = TTTGame.aiMove(match);
      disableAllCells(false);
      renderBoard();
      if (air.end) {
        if (air.result === "lose") setStatus("Ты проиграл");
        else setStatus("Ничья");
        finishMatch(air.result);
      } else setStatus(statusYourTurn());
    }, 380);
  }

  function disableAllCells(dis) {
    var cells = el.board.querySelectorAll(".cell");
    var humanTurn = isHumanTurn();
    for (var i = 0; i < cells.length; i++) {
      var filled = match && !!match.board[i];
      cells[i].disabled =
        dis ||
        (match && (match.gameOver || filled || !humanTurn));
    }
  }

  function startMatch() {
    el.menuError.hidden = true;
    if (!TTTEconomy.canStartMatch(state)) {
      el.menuError.textContent = "Нужно минимум " + TTTEconomy.BET + " монет.";
      el.menuError.hidden = false;
      return;
    }
    if (!TTTEconomy.chargeBet(state)) return;
    refreshBalance();
    match = TTTGame.createMatch(getDifficulty());
    showScreen("game");
    buildBoard();
    renderBoard();
    if (match.humanSymbol === "X") {
      setStatus(
        "Ты играешь крестиками (сторона выбрана случайно). " + statusYourTurn()
      );
    } else {
      setStatus(
        "Ты играешь ноликами (сторона выбрана случайно). Соперник ходит первым…"
      );
      disableAllCells(true);
      window.setTimeout(function () {
        var air = TTTGame.aiMove(match);
        disableAllCells(false);
        renderBoard();
        if (air.end) {
          if (air.result === "lose") setStatus("Ты проиграл");
          else if (air.result === "win") setStatus("Ты выиграл!");
          else setStatus("Ничья");
          finishMatch(air.result);
        } else {
          setStatus(statusYourTurn());
        }
      }, 380);
    }
  }

  function abandonMatch() {
    if (!match || match.gameOver) return;
    match.gameOver = true;
    TTTEconomy.settleLose(state);
    refreshBalance();
    el.modalTitle.textContent = "Сдача";
    el.modalText.textContent =
      "Ты сдался. Ставка " + TTTEconomy.BET + " монет проиграна.";
    el.modalDrop.hidden = true;
    clearDropSalute();
    el.modalResult.hidden = false;
    match = null;
    showScreen("menu");
    renderBoard();
  }

  function closeResultModal() {
    clearDropSalute();
    el.modalResult.hidden = true;
    showScreen("menu");
  }

  function appendShopSectionTitle(col, text) {
    var h = document.createElement("h3");
    h.className = "shop-section-title";
    h.textContent = text;
    col.appendChild(h);
  }

  function defaultBoardPreview() {
    var cl = TTTSkins.getById("classic");
    return cl && cl.preview ? cl.preview : { bg: "#0f1419", surface: "#1a2332", cell: "#243044" };
  }

  function renderShop() {
    el.shopList.innerHTML = "";

    var shopGrid = document.createElement("div");
    shopGrid.className = "shop-columns";
    var colBoard = document.createElement("div");
    colBoard.className = "shop-col";
    var colX = document.createElement("div");
    colX.className = "shop-col";
    var colO = document.createElement("div");
    colO.className = "shop-col";

    appendShopSectionTitle(colBoard, "Тема доски");
    for (var bi = 0; bi < TTTSkins.SKINS.length; bi++) {
      (function (s) {
        var owned = state.ownedSkinIds.indexOf(s.id) !== -1;
        var pv = s.preview || defaultBoardPreview();
        var card = document.createElement("div");
        card.className = "skin-card";
        if (owned) card.classList.add("owned");
        if (state.equippedSkinId === s.id) card.classList.add("equipped");

        var row = document.createElement("div");
        row.className = "skin-card-row";
        var previewWrap = document.createElement("div");
        previewWrap.className = "skin-card-preview";
        var strip = document.createElement("div");
        strip.className = "theme-preview-strip";
        ["bg", "surface", "cell"].forEach(function (key) {
          var sp = document.createElement("span");
          sp.style.background = pv[key] || "#333";
          strip.appendChild(sp);
        });
        previewWrap.appendChild(strip);

        var main = document.createElement("div");
        main.className = "skin-card-main";
        var info = document.createElement("div");
        info.className = "skin-info";
        var h = document.createElement("h4");
        h.textContent = s.name;
        info.appendChild(h);
        var price = document.createElement("div");
        price.className = "price";
        if (s.dropOnly) price.textContent = "Только дроп 1 / 1 000 000";
        else if (s.price) price.textContent = "Цена: " + s.price + " монет";
        else price.textContent = "Бесплатно";
        info.appendChild(price);
        if (s.dropLabel) {
          var tag = document.createElement("span");
          tag.className = "tag";
          tag.textContent = s.dropLabel;
          info.appendChild(tag);
        }

        var actions = document.createElement("div");
        actions.className = "skin-actions";
        if (!owned && !s.dropOnly) {
          var buy = document.createElement("button");
          buy.type = "button";
          buy.className = "btn primary sm";
          buy.textContent = "Купить";
          buy.addEventListener("click", function () {
            var out = TTTEconomy.tryBuy(state, s.id);
            if (!out.ok) alert(out.reason);
            refreshBalance();
            renderShop();
            applySkinToBody();
          });
          actions.appendChild(buy);
        }
        if (owned) {
          var eq = document.createElement("button");
          eq.type = "button";
          eq.className = "btn ghost sm";
          var eqOn = state.equippedSkinId === s.id;
          eq.textContent = eqOn ? "Надето" : "Надеть";
          eq.disabled = eqOn;
          eq.addEventListener("click", function () {
            TTTEconomy.equip(state, s.id);
            applySkinToBody();
            renderShop();
          });
          actions.appendChild(eq);
        }

        main.appendChild(info);
        main.appendChild(actions);
        row.appendChild(previewWrap);
        row.appendChild(main);
        card.appendChild(row);
        colBoard.appendChild(card);
      })(TTTSkins.SKINS[bi]);
    }

    appendShopSectionTitle(colX, "Скин фишки X (крестик)");
    for (var xi = 0; xi < TTTPieces.PIECE_X.length; xi++) {
      (function (p) {
        var owned = state.ownedPieceXIds.indexOf(p.id) !== -1;
        var card = document.createElement("div");
        card.className = "skin-card";
        if (owned) card.classList.add("owned");
        if (state.equippedPieceXId === p.id) card.classList.add("equipped");

        var row = document.createElement("div");
        row.className = "skin-card-row";
        var previewWrap = document.createElement("div");
        previewWrap.className = "skin-card-preview";
        var box = document.createElement("div");
        box.className = "piece-preview-box";
        var img = document.createElement("img");
        img.src = TTTMarkAssets.getMarkUrl(p.id);
        img.alt = "";
        box.appendChild(img);
        previewWrap.appendChild(box);

        var main = document.createElement("div");
        main.className = "skin-card-main";
        var info = document.createElement("div");
        info.className = "skin-info";
        var h = document.createElement("h4");
        h.textContent = p.name;
        info.appendChild(h);
        var priceEl = document.createElement("div");
        priceEl.className = "price";
        if (p.dropOnly) priceEl.textContent = "Только дроп 1 / 1 000 000";
        else priceEl.textContent = p.price ? "Цена: " + p.price + " монет" : "Бесплатно";
        info.appendChild(priceEl);
        if (p.dropLabel) {
          var tagx = document.createElement("span");
          tagx.className = "tag";
          tagx.textContent = p.dropLabel;
          info.appendChild(tagx);
        }

        var actions = document.createElement("div");
        actions.className = "skin-actions";
        if (!owned && !p.dropOnly && p.price > 0) {
          var buy = document.createElement("button");
          buy.type = "button";
          buy.className = "btn primary sm";
          buy.textContent = "Купить";
          buy.addEventListener("click", function () {
            var out = TTTEconomy.tryBuyPiece(state, p.id);
            if (!out.ok) alert(out.reason);
            refreshBalance();
            renderShop();
          });
          actions.appendChild(buy);
        }
        if (owned) {
          var eq = document.createElement("button");
          eq.type = "button";
          eq.className = "btn ghost sm";
          var eqOn = state.equippedPieceXId === p.id;
          eq.textContent = eqOn ? "Надето" : "Надеть";
          eq.disabled = eqOn;
          eq.addEventListener("click", function () {
            TTTEconomy.equipPiece(state, p.id);
            renderShop();
            if (match) renderBoard();
          });
          actions.appendChild(eq);
        }

        main.appendChild(info);
        main.appendChild(actions);
        row.appendChild(previewWrap);
        row.appendChild(main);
        card.appendChild(row);
        colX.appendChild(card);
      })(TTTPieces.PIECE_X[xi]);
    }

    appendShopSectionTitle(colO, "Скин фишки ○ (нолик)");
    for (var oi = 0; oi < TTTPieces.PIECE_O.length; oi++) {
      (function (p) {
        var owned = state.ownedPieceOIds.indexOf(p.id) !== -1;
        var card = document.createElement("div");
        card.className = "skin-card";
        if (owned) card.classList.add("owned");
        if (state.equippedPieceOId === p.id) card.classList.add("equipped");

        var row = document.createElement("div");
        row.className = "skin-card-row";
        var previewWrap = document.createElement("div");
        previewWrap.className = "skin-card-preview";
        var box = document.createElement("div");
        box.className = "piece-preview-box";
        var img = document.createElement("img");
        img.src = TTTMarkAssets.getMarkUrl(p.id);
        img.alt = "";
        box.appendChild(img);
        previewWrap.appendChild(box);

        var main = document.createElement("div");
        main.className = "skin-card-main";
        var info = document.createElement("div");
        info.className = "skin-info";
        var h = document.createElement("h4");
        h.textContent = p.name;
        info.appendChild(h);
        var priceEl = document.createElement("div");
        priceEl.className = "price";
        if (p.dropOnly) priceEl.textContent = "Только дроп 1 / 1 000 000";
        else priceEl.textContent = p.price ? "Цена: " + p.price + " монет" : "Бесплатно";
        info.appendChild(priceEl);
        if (p.dropLabel) {
          var tago = document.createElement("span");
          tago.className = "tag";
          tago.textContent = p.dropLabel;
          info.appendChild(tago);
        }

        var actions = document.createElement("div");
        actions.className = "skin-actions";
        if (!owned && !p.dropOnly && p.price > 0) {
          var buy = document.createElement("button");
          buy.type = "button";
          buy.className = "btn primary sm";
          buy.textContent = "Купить";
          buy.addEventListener("click", function () {
            var out = TTTEconomy.tryBuyPiece(state, p.id);
            if (!out.ok) alert(out.reason);
            refreshBalance();
            renderShop();
          });
          actions.appendChild(buy);
        }
        if (owned) {
          var eq = document.createElement("button");
          eq.type = "button";
          eq.className = "btn ghost sm";
          var eqOn = state.equippedPieceOId === p.id;
          eq.textContent = eqOn ? "Надето" : "Надеть";
          eq.disabled = eqOn;
          eq.addEventListener("click", function () {
            TTTEconomy.equipPiece(state, p.id);
            renderShop();
            if (match) renderBoard();
          });
          actions.appendChild(eq);
        }

        main.appendChild(info);
        main.appendChild(actions);
        row.appendChild(previewWrap);
        row.appendChild(main);
        card.appendChild(row);
        colO.appendChild(card);
      })(TTTPieces.PIECE_O[oi]);
    }

    shopGrid.appendChild(colBoard);
    shopGrid.appendChild(colX);
    shopGrid.appendChild(colO);
    el.shopList.appendChild(shopGrid);
  }

  function openShop() {
    renderShop();
    showScreen("shop");
  }

  function initDaily() {
    var d = TTTEconomy.applyDailyIfNeeded(state);
    refreshBalance();
    if (d.granted) {
      el.modalDailyText.textContent =
        "+" + d.amount + " монет за сегодняшний день!";
      el.modalDaily.hidden = false;
    }
    el.dailyHint.textContent = "Сегодня: " + TTTStorage.todayYmd();
  }

  el.btnPlay.addEventListener("click", startMatch);
  el.btnShop.addEventListener("click", openShop);
  el.btnShopBack.addEventListener("click", function () {
    showScreen("menu");
  });
  el.btnAbandon.addEventListener("click", abandonMatch);
  el.modalClose.addEventListener("click", closeResultModal);
  el.modalDailyOk.addEventListener("click", function () {
    el.modalDaily.hidden = true;
  });

  applySkinToBody();
  initDaily();
  refreshBalance();
  buildBoard();
  renderBoard();
})();
