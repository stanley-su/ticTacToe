"use strict";

// appearance ideas
// mosaic theme (easter island blocks etc.)
// html canvas, x sprouts out from dot, circle grows out from dot
// 9 cubes, winning row merges into single cube which flips out winner

const GAME  	 = {}, // model
	  BOARD 	 = {}, // view
	  CONTROLLER = {}, // controller
	  APP 		 = {}; // everything!

// CONTROLLER => GAME => BOARD

CONTROLLER.init = function() {
	document.getElementById('canvas').addEventListener('click', function(e) {
		console.log(e.offsetX, e.offsetY);
	});
}

GAME.init = function() {
	this.board = new Array(9).fill(NaN);
	this.currTurn = 'X';
	this.totalTurns = 0;
}

GAME.getPlayer = function() {
	return this.currTurn;
};

// adds the current player's move into their desired position
GAME.addMove = function(pos) {
	// if desired position on board is vacant
	if (!this.board[pos]) {
		++this.totalTurns;
		this.board[pos] = this.currTurn;
		this.currTurn = this.currTurn === 'X' ? 'O' : 'X';
		BOARD.update(this.board);

		let winner = this.getWinner(this.board);
		// check if game has ended
		if (winner || this.totalTurns === 9) {
			BOARD.endGame(this.board, winner);
			this.init();
			BOARD.init();
		}
	}
}

// returns an array containing winning coordinates and winner, else null
GAME.getWinner = function(b) {
	// check rows, columns and diagonals connected to centre square
	if (b[3] === b[4] && b[4] === b[5]) {
		return {coords: [3, 4, 5], winner: b[4]};
	} else if (b[1] === b[4] && b[4] === b[7]) {
		return {coords: [1, 4, 7], winner: b[4]};
	} else if (b[0] === b[4] && b[4] === b[8]) {
		return {coords: [0, 4, 8], winner: b[4]};
	} else if (b[2] === b[4] && b[4] === b[6]) {
		return {coords: [2, 4, 6], winner: b[4]};
	}
	// check rows, columns and diagonals connected to top-left square
	if (b[0] === b[1] && b[1] === b[2]) {
		return {coords: [0, 1, 2], winner: b[1]};
	} else if (b[0] === b[3] && b[3] === b[6]) {
		return {coords: [0, 3, 6], winner: b[3]};
	}
	// check rows, columns and diagonals connected to bottom-right square
	if (b[2] === b[5] && b[5] === b[8]) {
		return {coords: [2, 5, 8], winner: b[5]};
	} else if (b[6] === b[7] && b[7] === b[8]) {
		return {coords: [6, 7, 8], winner: b[7]};
	}
	return null;
}

BOARD.init = function() {
	this.canvas = document.getElementById('canvas');
	this.canvas.width = 300;
	this.canvas.height = 300;
	this.c = this.canvas.getContext('2d');
	// initialise positions of centre of each box into array
	this.array = [];
	let topLeftCentre = {x: this.canvas.width / 6, y: this.canvas.height / 6};
	for (let i = 0; i < 9; ++i) {
		// store the current box's row and column
		let row = Math.floor(i / 3);
		let col = i % 3;
		this.array.push({x: topLeftCentre.x + (row * this.canvas.width / 3),
						 y: topLeftCentre.y + (col * this.canvas.height / 3)});
	}
	this.particles = [];
}

BOARD.drawBoard = function() {
	this.c.beginPath();

	this.c.moveTo(this.canvas.width / 3, 10);
	this.c.lineTo(this.canvas.width / 3, this.canvas.height - 10);

	this.c.moveTo(this.canvas.width / 3 * 2, 10);
	this.c.lineTo(this.canvas.width / 3 * 2, this.canvas.height - 10);

	this.c.moveTo(10, this.canvas.height / 3);
	this.c.lineTo(this.canvas.width - 10, this.canvas.height / 3);

	this.c.moveTo(10, this.canvas.height / 3 * 2);
	this.c.lineTo(this.canvas.width - 10, this.canvas.height / 3 * 2);

	this.c.lineCap = "round";
	this.c.lineWidth = 4;
	this.c.strokeStyle = '#aaa';
	this.c.stroke();
}

// displays board to user
BOARD.update = function() {
	this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.drawBoard();
	for (let i = 0; i < this.array.length; ++i) {
		this.c.beginPath();
		this.c.arc(this.array[i].x, this.array[i].y, 1, Math.PI * 2, 0);
		this.c.stroke();
		this.c.closePath();
	}
}

// displays the end game message
BOARD.endGame = function(b, winner) {
	
}

APP.init = function() {
	CONTROLLER.init();
	GAME.init();
	BOARD.init();
}

APP.update = function() {
	BOARD.update();
}

APP.init();
APP.update();