(function (global) {
  var WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function winner(board) {
    for (var i = 0; i < WIN_LINES.length; i++) {
      var a = WIN_LINES[i][0],
        b = WIN_LINES[i][1],
        c = WIN_LINES[i][2];
      if (board[a] && board[a] === board[b] && board[b] === board[c]) {
        return { player: board[a], line: WIN_LINES[i] };
      }
    }
    return null;
  }

  function isFull(board) {
    for (var i = 0; i < 9; i++) {
      if (!board[i]) return false;
    }
    return true;
  }

  function emptyIndices(board) {
    var r = [];
    for (var i = 0; i < 9; i++) {
      if (!board[i]) r.push(i);
    }
    return r;
  }

  function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function winOrBlock(board, player) {
    for (var i = 0; i < 9; i++) {
      if (board[i]) continue;
      board[i] = player;
      var w = winner(board);
      board[i] = "";
      if (w && w.player === player) return i;
    }
    return null;
  }

  function minimax(board, maximizing, aiMark, oppMark) {
    var w = winner(board);
    if (w) {
      return w.player === aiMark ? 10 : -10;
    }
    if (isFull(board)) return 0;

    var empties = emptyIndices(board);
    if (maximizing) {
      var best = -Infinity;
      for (var i = 0; i < empties.length; i++) {
        var idx = empties[i];
        board[idx] = aiMark;
        var sc = minimax(board, false, aiMark, oppMark);
        board[idx] = "";
        if (sc > best) best = sc;
      }
      return best;
    }
    var worst = Infinity;
    for (var j = 0; j < empties.length; j++) {
      var jdx = empties[j];
      board[jdx] = oppMark;
      var sc2 = minimax(board, true, aiMark, oppMark);
      board[jdx] = "";
      if (sc2 < worst) worst = sc2;
    }
    return worst;
  }

  function bestMoveHard(board, aiMark, oppMark) {
    var empties = emptyIndices(board);
    var bestScore = -Infinity;
    var bestIdx = empties[0];
    for (var i = 0; i < empties.length; i++) {
      var idx = empties[i];
      board[idx] = aiMark;
      var sc = minimax(board, false, aiMark, oppMark);
      board[idx] = "";
      if (sc > bestScore) {
        bestScore = sc;
        bestIdx = idx;
      }
    }
    return bestIdx;
  }

  function moveEasy(board, aiMark, oppMark) {
    if (Math.random() < 0.45) {
      return randomPick(emptyIndices(board));
    }
    var fin = winOrBlock(board, aiMark);
    if (fin !== null) return fin;
    var blk = winOrBlock(board, oppMark);
    if (blk !== null) return blk;
    return randomPick(emptyIndices(board));
  }

  function moveMedium(board, aiMark, oppMark) {
    var fin = winOrBlock(board, aiMark);
    if (fin !== null) return fin;
    var blk = winOrBlock(board, oppMark);
    if (blk !== null) return blk;
    if (!board[4]) return 4;
    var corners = [0, 2, 6, 8].filter(function (i) {
      return !board[i];
    });
    if (corners.length && Math.random() < 0.65) return randomPick(corners);
    return randomPick(emptyIndices(board));
  }

  /** aiMark — фишка ИИ, oppMark — фишка игрока */
  function chooseMove(board, difficulty, aiMark, oppMark) {
    var d = difficulty || "medium";
    var copy = board.slice();
    if (d === "hard") return bestMoveHard(copy, aiMark, oppMark);
    if (d === "easy") return moveEasy(copy, aiMark, oppMark);
    return moveMedium(copy, aiMark, oppMark);
  }

  global.TTTAI = {
    WIN_LINES: WIN_LINES,
    winner: winner,
    isFull: isFull,
    emptyIndices: emptyIndices,
    chooseMove: chooseMove,
  };
})(typeof window !== "undefined" ? window : this);
