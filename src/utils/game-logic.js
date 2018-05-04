export const getOtherPlayer
	= (currentPlayer) => currentPlayer === 'X' ? 'O' : 'X';
export const getPlayerNameById
	= (playerId) => playerId === 'X' ? 'AI' : 'Human';
const winningCombinations = [
		[0,1,2],
		[0,3,6],
		[0,4,8],
		[3,4,5],
		[6,7,8],
		[1,4,7],
		[2,5,8],
		[2,4,6]
	];
export const didWin  = (squares) => {
	const isWinner
		= comb => {
			const [a, b, c] = comb;
			return (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]); 
		}
	return winningCombinations.some(isWinner);
}
export const didWinByPlayer = (squares, player) => {
	const isWinner
		= combo => {
			const [a, b, c] = combo;
			return (squares[a] === player && squares[b] === player && squares[c] === player)
		}
	return winningCombinations.some(isWinner);
}
export const getEmptySpotsByIndex = (squares) => {
	return squares.reduce((accumulator, tileValue, index) => {
		if (tileValue === null) {
			return [...accumulator, index];
		}
		return accumulator;
	}, []);
}
export const isDraw
	= (squares) => squares.every(square => square !== null);

export const minMax = (squares, player) => {
	const availableSpots = getEmptySpotsByIndex(squares);
	const humanPlayer = 'O';
	const aiPlayer = 'X';
	// Check for terminal states
	if (didWinByPlayer(squares, humanPlayer)) {
		return { score: -10 };
	} else if(didWinByPlayer(squares, aiPlayer)) {
		return { score: 10 };
	} else if (availableSpots.length === 0) {
		return { score: 0 };
	}


	const moves = [];
	// loop through available spots
	availableSpots.forEach((spotId, index) => {
		//create an object for each and store the index of that spot that was stored as a number in the object's index key
		const move = {};
		move.index = spotId;
		// set the empty spot to the current player
		squares[spotId] = player;
		//if collect the score resulted from calling minimax on the opponent of the current player
		if (player === aiPlayer){
			const result = minMax(squares, humanPlayer);
			move.score = result.score;
		  }
		  else{
			const result = minMax(squares, aiPlayer);
			move.score = result.score;
		  }
		//reset the spot to empty
		squares[spotId] = null;
	  
		// push the object to the array
		moves.push(move);

	})
	// if it is the computer's turn loop over the moves and choose the move with the highest score
	let bestMove;
	if (player === aiPlayer) {
		let bestScore = -10000;
		moves.forEach((move, index) => {
			const { score } = move;
			if (score > bestScore) {
				bestScore = score;
				bestMove = index;
			}
		});
	} else {
		// else loop over the moves and choose the move with the lowest score
		let bestScore = 10000;
		moves.forEach((move, index) => {
			const { score } = move;
			if(score < bestScore){
				bestScore = score;
				bestMove = index;
			  }
		});
	}
	
    // return the chosen move (object) from the array to the higher depth
	return moves[bestMove];
}
