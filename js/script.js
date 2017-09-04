"use strict";

(function() {
	// game functions
	function getWinner(b) {
		// check rows, columns and diagonals connected to centre square
		if (b[3] === b[4] && b[4] === b[5] ||
			b[1] === b[4] && b[4] === b[7] ||
			b[0] === b[4] && b[4] === b[8] ||
			b[2] === b[4] && b[4] === b[6]) {
			return b[4];
		}

		// check rows, columns and diagonals connected to top-left square
		if (b[0] === b[1] && b[1] === b[2] ||
			b[0] === b[3] && b[3] === b[6]) {
			return b[0];
		}

		// check rows, columns and diagonals connected to bottom-right square
		if (b[2] === b[5] && b[5] === b[8] ||
			b[6] === b[7] && b[7] === b[8]) {
			return b[8];
		}
		
		return false;
	}
}());