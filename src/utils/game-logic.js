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
export const humanPlayer = 'O';
export const aiPlayer = 'X';
export const minMax = (squares, player) => {
	const availableSpots = getEmptySpotsByIndex(squares);
	// Check for terminal states
	if (didWinByPlayer(squares, humanPlayer)) {
		return { score: -10 };
	} else if(didWinByPlayer(squares, aiPlayer)) {
		return { score: 10 };
	} else if (availableSpots.length === 0) {
		return { score: 0 };
	}

	const moves
		= availableSpots.map((emptySpotId) => {
			const newBoard
				= squares.map((spot, index) => (index === emptySpotId) ? player : spot);
			const otherPlayer = getOtherPlayer(player);
			return {
				index: emptySpotId,
				score: minMax(newBoard, otherPlayer).score
			}
	});
	const bMove = moves.reduce((previous, current) => {
		// if player is aiPlayer return moves with best scores
		if (player === aiPlayer) {
			return current.score > previous.score ? current : previous;
		}
		// if player is human player return moves with less scores
		if (player === humanPlayer) {
			return current.score < previous.score ? current : previous
		}
	});
	return bMove;
}
