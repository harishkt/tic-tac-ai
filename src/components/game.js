import React,  { Component } from 'react';
import Board from './board';
import { getOtherPlayer, didWin, isDraw, minMax, getPlayerNameById } from '../utils/game-logic';

const initState = {
	history: [
		[ 'Game Start']
	],
	data: Array(9).fill(null),
	currentPlayer: 'O',
	humanPlayer: 'O',
	aiPlayer: 'X'
};
export default class Game extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
		this.handleClick = this.handleClick.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	handleClick(tile) {
		const [ ...data ] = this.state.data;
		const { currentPlayer, history } = this.state;
		const Msg = `You selected Tile - ${tile}`;
		if (didWin(data) || isDraw(data)) {
			return;
		}
		if (data[tile] !== null) {
			return;
		}
		const nextPlayer = getOtherPlayer(currentPlayer);
		data[tile] = currentPlayer;
		const { index: aiSelectedTile } = minMax(data, nextPlayer);
		data[aiSelectedTile] = nextPlayer;
		const aiMsg = `AI selected ${aiSelectedTile}`;
		const newHistory = [...history, Msg, aiMsg];
		this.setState({
			data,
			currentPlayer,
			history: newHistory
		});
	}

	isDraw() {
		const { squares } = this.state;
		return squares.every(tile => tile !== null);
	}
	handleReset() {
		this.setState(initState);
	}
	showResetBtn() {
		return(
			<button 
				onClick={this.handleReset}
			>Restart Game
			</button>
		);
	}
	getGameStatus() {
		const { data, currentPlayer } = this.state;
		const otherPlayer = getOtherPlayer(currentPlayer);
		return didWin(data)
			? `Winner is ${getPlayerNameById(otherPlayer)}`
			: isDraw(data)
				? `Game Draw. Play Again`
				: `Next Player - ${currentPlayer}`
	}
	showHistory() {
		const { history } = this.state;
		return history.map((step, index) => <li key={index}>{step}</li>);
	}
	render() {
		return(
			<div>
				<h1 className="game-heading">Tic Tac Toe</h1>
				<div className="game-reset">{this.showResetBtn()}</div>
				<div className="game-status">Status:{this.getGameStatus()}</div>
				<Board 
						onClick={this.handleClick}
						data={this.state.data}
						boardSize={3}
				/>
				<ol>{this.showHistory()}</ol>
			</div>
		);
	}
}
