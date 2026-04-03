(function (global) {
  function sideToMove(board) {
    var nx = 0;
    var no = 0;
    for (var i = 0; i < 9; i++) {
      if (board[i] === "X") nx++;
      else if (board[i] === "O") no++;
    }
    return nx === no ? "X" : "O";
  }

  function createMatch(difficulty) {
    var humanSymbol = Math.random() < 0.5 ? "X" : "O";
    return {
      board: ["", "", "", "", "", "", "", "", ""],
      difficulty: difficulty,
      gameOver: false,
      result: null,
      winLine: null,
      humanSymbol: humanSymbol,
      aiSymbol: humanSymbol === "X" ? "O" : "X",
    };
  }

  function humanMove(match, index) {
    if (match.gameOver) return { ok: false };
    if (global.TTTGame.sideToMove(match.board) !== match.humanSymbol) return { ok: false };
    if (match.board[index]) return { ok: false };
    match.board[index] = match.humanSymbol;
    var w = global.TTTAI.winner(match.board);
    if (w) {
      match.gameOver = true;
      match.winLine = w.line;
      match.result = w.player === match.humanSymbol ? "win" : "lose";
      return { ok: true, end: true, result: match.result };
    }
    if (global.TTTAI.isFull(match.board)) {
      match.gameOver = true;
      match.result = "draw";
      return { ok: true, end: true, result: "draw" };
    }
    return { ok: true, end: false };
  }

  function aiMove(match) {
    if (match.gameOver) return { end: true };
    if (global.TTTGame.sideToMove(match.board) !== match.aiSymbol) return { end: false };
    var idx = global.TTTAI.chooseMove(
      match.board,
      match.difficulty,
      match.aiSymbol,
      match.humanSymbol
    );
    match.board[idx] = match.aiSymbol;
    var w = global.TTTAI.winner(match.board);
    if (w) {
      match.gameOver = true;
      match.winLine = w.line;
      match.result = w.player === match.humanSymbol ? "win" : "lose";
      return { end: true, result: match.result };
    }
    if (global.TTTAI.isFull(match.board)) {
      match.gameOver = true;
      match.result = "draw";
      return { end: true, result: "draw" };
    }
    return { end: false };
  }

  global.TTTGame = {
    createMatch: createMatch,
    humanMove: humanMove,
    aiMove: aiMove,
    sideToMove: sideToMove,
  };
})(typeof window !== "undefined" ? window : this);
