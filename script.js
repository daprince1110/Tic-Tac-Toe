document.addEventListener("DOMContentLoaded", function() {

    // ScreenManager: toggles between the start screen and game screen.
    const ScreenManager = (function(){
      let gameContainer = document.querySelector('.game-container');
      let startContainer = document.querySelector('.start-container');
  
      if (!gameContainer || !startContainer) {
        console.error("Game or Start container not found!");
        return {
          swapScreen: function(callback) { console.error("ScreenManager not initialized"); }
        };
      }
  
      const swapScreen = function(callback){
        let gameDisplay = window.getComputedStyle(gameContainer).display;
        
        if (gameDisplay === "none") {
          gameContainer.style.display = "block"; // Or "flex" if needed
          startContainer.style.display = "none";
        } else {
          gameContainer.style.display = "none";
          startContainer.style.display = "block";
        }
        if (callback) callback();
      };
  
      return { swapScreen };
    })();
  
  
    // Player Module: handles creating player objects.
    const Player = (function(){
      let players = [];
  
      const createPlayer = function(name, cpu, mark){
        let object = { name, cpu, marker: mark };
        players.push(object);
        return object;
      };
  
      const getPlayers = () => players;
      const getPlayer = (name) => players.find(x => x.name === name);
      const clearPlayers = () => { players = []; };
  
      return { createPlayer, getPlayers, getPlayer, clearPlayers };
    })();
  
  
    // GameBoard Module: manages the game board, moves, win detection, and restart.
    const GameBoard = (function(){
      let restart = document.querySelector('#restart');
      let mainmenu = document.querySelector('#main-menu');
      let gameboard = document.querySelector('#game-board');
  
      if (!restart || !mainmenu || !gameboard) {
        console.error("One or more game elements not found! Check #restart, #main-menu, or #game-board");
        return {
          init: function() { console.error("GameBoard not initialized"); }
        };
      }
  
      // The board array: each cell will be null (empty) or 'X'/'O'
      let board = new Array(9).fill(null);
      let turn;
      let start = false;
      let Player1, Player2;
  
      // All possible winning combinations (by board index)
      const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];
  
      // Check if there's a winner or if it's a tie.
      const checkWinner = function(){
        for (let combo of winningCombinations){
          let [a, b, c] = combo;
          if (board[a] && board[a] === board[b] && board[a] === board[c]){
            return board[a]; // Returns 'X' or 'O'
          }
        }
        return board.includes(null) ? null : 'tie';
      };
  
      // Let the CPU play (random available move).
      const cpuPlay = function(){
        if (!start) return;
        let available = [];
        board.forEach((cell, index) => {
          if (cell === null) available.push(index);
        });
        if (available.length === 0) return;
        let rand = available[Math.floor(Math.random() * available.length)];
        board[rand] = Player2.marker;
        updateBoard();
  
        if (isFinished()) return;
        turn = Player1;
      };
  
      // Handles a player's move.
      const play = function(target, index){
        index = Number(index); // Ensure index is numeric.
        if (!start || board[index] !== null) return;
  
        // Only allow Player1 to make a move (human player).
        if (turn === Player1){
          board[index] = Player1.marker;
          updateBoard();
  
          // Check for a winner AFTER the board has updated.
          if (isFinished()) return;
  
          turn = Player2;
          // If playing against the computer, let the CPU play.
          if (Player2.cpu) {
            setTimeout(cpuPlay, 500);
          }
        }
      };
  
      // Update the visual board (assumes each cell element has a data-index attribute).
      const updateBoard = function(){
        Array.from(gameboard.children).forEach(cell => {
          let idx = cell.dataset.index;
          cell.textContent = board[idx] ? board[idx] : "";
        });
      };
  
      // Check if the game is finished and alert the result.
      // A short delay (setTimeout) ensures the board update is rendered before the alert.
      const isFinished = function(){
        let result = checkWinner();
        if (result) {
          start = false; // Stop further moves.
          setTimeout(() => {
            if (result === 'tie') {
              alert("It's a tie!");
            } else {
              let winner = (result === Player1.marker) ? Player1.name : Player2.name;
              alert(`${winner} wins!`);
            }
          }, 10);
          return true;
        }
        return false;
      };
  
      // Initialize the game board and players.
      const init = function(name, cpu){
        board = new Array(9).fill(null);
        start = true;
        Player.clearPlayers();
        Player1 = Player.createPlayer(name, false, 'X');
        Player2 = Player.createPlayer("CPU", cpu, 'O');
        turn = Player1;
        updateBoard();
      };
  
      // Event listeners
      gameboard.addEventListener('click', function(event){
        let target = event.target;
        if (target.classList.contains('cell')) {
          play(target, target.dataset.index);
        }
      });
  
      mainmenu.addEventListener('click', function(){
        ScreenManager.swapScreen();
      });
  
      restart.addEventListener('click', function(){
        // Restart the game with the same settings.
        init(Player1.name, Player2.cpu);
      });
  
      return { init };
    })();
  
  
    // MainMenu Module: handles the start button and game mode selection.
    const MainMenu = (function(){
      let start_btn = document.querySelector('.start-button');
      let mode_buttons = document.querySelectorAll('.mode-button');
      let computer_btn = mode_buttons[0];
      let player_btn = mode_buttons[1];
      let input = document.querySelector('#player-name');
      let mode = true; // default: playing against the computer
  
      if (!start_btn || !computer_btn || !player_btn || !input) {
        console.error("Main menu elements not found! Check .start-button, .mode-button, #player-name");
        return {
          init: function() { console.error("MainMenu not initialized"); }
        };
      }
  
      // Switch between computer mode and two-player mode.
      player_btn.addEventListener('click', function(){
        mode = false;
        computer_btn.classList.remove("active");
        player_btn.classList.add("active");
      });
  
      computer_btn.addEventListener('click', function(){
        mode = true;
        player_btn.classList.remove("active");
        computer_btn.classList.add("active");
      });
  
      start_btn.addEventListener('click', function(){
        // Swap the screen and initialize the game.
        ScreenManager.swapScreen(function(){
          GameBoard.init(input.value || "Player", mode);
        });
      });
  
      return {};
    })();
  
  });
  