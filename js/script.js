"use strict";

const APP = function() {
	const canvas = document.getElementById('canvas');
	const c = canvas.getContext('2d');

	canvas.width = 300;
	canvas.height = 300;

	const CONTROLLER = function() {
		canvas.addEventListener('click', function(e) {
			// calculate row
			let col = Math.floor(e.offsetX / (canvas.width / 3));
			let row = Math.floor(e.offsetY / (canvas.height / 3));
			let pos = row * 3 + col;
			GAME.addMove(pos);
		});
	}();

	const GAME = function() {
		let currPlayer = 'cross';
		let totalTurns = 0;
		const winCombos = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6]
		];
		let board = new Array(9).fill(NaN);

		const getPlayer = function() {
			return currPlayer;
		}

		const getWinner = function() {
			// check the board for all winning combinations
			for (let i = 0; i < winCombos.length; ++i) {
				let w = winCombos[i];
				// if all of the winning combo's positions on the board are equal
				if (w.every((val, i, arr) => board[val] === board[arr[0]])) {
					return w;
				}
			}
			return null;
		}

		const restart = function() {
			board = board.map(val => NaN);
			currPlayer = 'cross';
			totalTurns = 0;
		}

		const addMove = function(pos) {
			// if desired position on board is vacant
			if (!board[pos]) {
				// update game board
				board[pos] = currPlayer;
				// desired position on board's symbol map
				let box = BOARD.symbols[pos];
				// add current player to board's symbol map
				box.symbol = new BOARD[currPlayer](box.x, box.y, canvas.width / 10, 3);
				currPlayer = (currPlayer === 'cross' ? 'nought' : 'cross');
				totalTurns += 1;

				let winner = getWinner();
				// check if game has ended
				if (winner || totalTurns === 9) {
					BOARD.endGame(winner);
					restart();
				}
			}
		}

		return { board, getPlayer, getWinner, addMove };
	}();

	const BOARD = function() {
		const symbols = [];
		let topLeftCentre = {x: canvas.width / 6, y: canvas.height / 6};
		for (let i = 0; i < 9; ++i) {
			// store the current box's row and column
			let row = Math.floor(i / 3);
			let col = i % 3;
			symbols.push({x: topLeftCentre.x + (col * canvas.width / 3),
							 y: topLeftCentre.y + (row * canvas.height / 3)});
		}

		const restart = function() {
			// delete all of the symbols
			for (let i = 0; i < symbols.length; ++i) {
				if (symbols[i].symbol) {
					setTimeout(function() {
						delete symbols[i].symbol;
					}, 100);
				}
			}
		}

		const nought = function(x, y, d, r) {
			this.originX = x;
			this.originY = y;
			this.x = x;
			this.y = y;
			this.d = d;
			this.r = r;
			this.a = 0;
			this.update = function() {
				this.a += 0.05;
				this.x = this.originX + this.d * Math.cos(this.a);
				this.y = this.originY + this.d * Math.sin(this.a);
				this.draw();
			}
			this.draw = function() {
				c.beginPath();
				c.arc(this.x, this.y, this.r, 0, Math.PI * 2);
				c.fillStyle = 'white';
				c.fill();
			}
		}

		const cross = function(x, y, d, r) {
			this.tl = { x: x - d, y: y - d };
			this.tr = { x: x + d, y: y - d};
			this.bl = { x: x - d, y: y + d};
			this.br = { x: x + d, y: y + d};
			// first orb
			this.x1 = this.tl.x;
			this.y1 = this.tl.y;
			// second orb
			this.x2 = this.bl.x;
			this.y2 = this.bl.y;
			// velocity
			this.v = 1;
			this.r = r;
			this.s1 = 1;
			this.s2 = 1;
			this.update = function() {
				// variables that decide velocity's positivity
				if (this.x1 > this.br.x || this.x1 < this.tl.x) {
					this.s1 *= -1;
				}
				if (this.x2 > this.tr.x || this.x2 < this.bl.x) {
					this.s2 *= -1;
				}
				this.x1 += this.v * this.s1;
				this.y1 += this.v * this.s1;
				this.x2 += this.v * this.s2;
				this.y2 -= this.v * this.s2;
				this.draw();
			}
			this.draw = function() {
				c.beginPath();
				c.arc(this.x1, this.y1, this.r, 0, Math.PI * 2);
				c.arc(this.x2, this.y2, this.r, 0, Math.PI * 2);
				c.fillStyle = 'white';
				c.fill();
			}
		}

		const drawBoard = function() {
			c.beginPath();
			c.moveTo(canvas.width / 3, 10);
			c.lineTo(canvas.width / 3, canvas.height - 10);
			c.moveTo(canvas.width / 3 * 2, 10);
			c.lineTo(canvas.width / 3 * 2, canvas.height - 10);
			c.moveTo(10, canvas.height / 3);
			c.lineTo(canvas.width - 10, canvas.height / 3);
			c.moveTo(10, canvas.height / 3 * 2);
			c.lineTo(canvas.width - 10, canvas.height / 3 * 2);
			c.lineCap = "round";
			c.lineWidth = 1;
			c.strokeStyle = '#aaa';
			c.stroke();
		}

		const endGame = function(w) {
			if (w) {
				for (let i = 0; i < symbols.length; ++i) {
					if (w.indexOf(i) === -1) {
						delete symbols[i].symbol;
					}
				}
				setTimeout(restart, 1000);
			} else {
				restart();
			}
		}

		const update = function() {
			requestAnimationFrame(update);
			c.fillStyle = 'rgba(0,0,0,0.1)';
			c.fillRect(0, 0, canvas.width, canvas.height);
			drawBoard();
			for (let i = 0; i < symbols.length; ++i) {
				if (symbols[i].symbol) {
					for (let n = 0; n < 3; ++n) {
						symbols[i].symbol.update();
					}
				}
			}
			
		}		

		return { symbols, nought, cross, update, endGame };
	}();

	const update = function() {
		BOARD.update();
	};

	return { update };
}();

APP.update();