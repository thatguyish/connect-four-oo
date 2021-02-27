class Game {
  constructor(height,width){

    this.WIDTH = width;
    this.HEIGHT = height;
    this.player1 = new Player('red');
    this.player2 = new Player('blue');
    this.currPlayer = this.player1;
    this.board = [];
    this.gameIsOver = false;

    this.makeBoard();
    this.makeHtmlBoard();
  }
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

makeBoard() {
  for (let y = 0; y < this.HEIGHT; y++) {
    this.board.push(Array.from({ length: this.WIDTH }));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

makeHtmlBoard() {
  const htmlBoard = document.getElementById('board');

  this.handleGameClick = this.handleClick.bind(this); 
  // make column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', this.handleGameClick);

  for (let x = 0; x < this.WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  htmlBoard.append(top);

  // make main part of board
  for (let y = 0; y < this.HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < this.WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    htmlBoard.append(row);
  }
  //make top 3 secions for player one color 2 and start game
  //newd div with 3 spans 
  const topMenu = document.createElement('div');
  topMenu.id='topMenu';
  const player1ColorIn = document.createElement('input');
  const player2ColorIn = document.createElement('input');
  const startGame = document.createElement('button');
  startGame.innerText = 'Start Game'
  player1ColorIn.type = 'text';
  player1ColorIn.placeholder = 'Player One Color'
  player1ColorIn.id ='player1';
  player2ColorIn.type = 'text';
  player2ColorIn.placeholder = 'Player Two Color'
  player2ColorIn.id='player2';
  this.gameSetup = this.setupNewGame.bind(this);
  startGame.addEventListener('click',this.gameSetup)
  
  document.querySelector('#game').prepend(topMenu);
  topMenu.append(player1ColorIn);
  topMenu.append(player2ColorIn);
  topMenu.append(startGame);
}
/** findSpotForCol: given column x, return top empty y (null if filled) */
setupNewGame(){
  let color1 = document.querySelector('#player1').value;
  let color2 = document.querySelector('#player2').value;
  document.querySelector('#board').innerHTML = '';
  document.querySelector('#topMenu').innerHTML = '';
  let newGame = new Game(6,7);
  newGame.player1.color = color1;
  newGame.player2.color = color2;

}
findSpotForCol(x) {
  for (let y = this.HEIGHT - 1; y >= 0; y--) {
    if (!this.board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.style.backgroundColor = this.currPlayer.color;
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */

endGame(msg) {
  this.gameIsOver=true;
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = this.findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  this.board[y][x] = this.currPlayer;
  if(this.gameIsOver){
    null;
  }else{
    this.placeInTable(y, x);
  }
  
  // check for win
  if (this.checkForWin()) {
    return this.endGame(`Player ${this.currPlayer==player1?'player 2':'player 1'} won!`);
  }
  
  // check for tie
  if (this.board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }
    
  // switch players
  this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

checkForWin() {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer
    );
  }

  for (let y = 0; y < this.HEIGHT; y++) {
    for (let x = 0; x < this.WIDTH; x++) {
      // get "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

}
//construct player object
class Player{
  constructor(colorName){
    this.color = colorName;
  }
}

new Game(6,7);