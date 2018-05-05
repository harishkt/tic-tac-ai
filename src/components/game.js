import React,  { Component } from 'react';
import Board from './board';
import { getOtherPlayer,
		didWin,
		didWinByPlayer,
		isDraw,
		minMax,
		getPlayerNameById,
		humanPlayer,
		aiPlayer
	} from '../utils/game-logic';

const initState = {
	history: [
		[ 'Game Start']
	],
	data: Array(9).fill(null),
	currentPlayer: null
};

export default class Game extends Component {
	constructor(props) {
		super(props);
		this.state = initState;
		this.handleClick = this.handleClick.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.selectFirstPlayer = this.selectFirstPlayer.bind(this);
	}

	componentWillMount(){
		document.body.style.backgroundColor = "#545454";
	}
	
	componentWillUnmount() {
		document.body.style.backgroundColor = null;
	}

	handleClick(tile) {
		const [ ...data ] = this.state.data;
		const { history, currentPlayer } = this.state;
		const nextPlayer = getOtherPlayer(currentPlayer);
		const Msg = `You selected Tile - ${tile}`;
		if (didWin(data) || isDraw(data)) {
			return;
		}
		if (data[tile] !== null) {
			return;
		}
		data[tile] = humanPlayer;
		
		
		// Ai player plays
		const { index: aiSelectedTile } = minMax(data, aiPlayer);
		data[aiSelectedTile] = aiPlayer;
		const aiMsg = `AI selected ${aiSelectedTile}`;
		const newHistory = [...history, Msg, aiMsg];


		this.setState({
			data,
			history: newHistory,
			currentPlayer
		});
	}
	handleReset() {
		this.setState(initState);
	}
	showResetBtn() {
		return(
			<button
				className="btn"
				onClick={this.handleReset}
			>Reset
			</button>
		);
	}
	getGameStatus() {
		const { data } = this.state;
		const winner = didWinByPlayer(data, aiPlayer)
			? aiPlayer : didWinByPlayer(data, humanPlayer) ? humanPlayer : null;
		return winner
			? { status: 'Win', winner }
			: isDraw(data)
				? { status: 'Draw' } : { status: null }
	}
	showHistory() {
		const { history } = this.state;
		return history.map((step, index) => <li key={index}>{step}</li>);
	}
	selectFirstPlayer(playerId) {
		const { data, history } = this.state
		let newHistory = [...history];
		const newData = [...data];
		if(playerId === aiPlayer) {
			//Select a tile first
			const { index: aiSelectedTile } = minMax(data, aiPlayer);
			newData[aiSelectedTile] = aiPlayer;
			const aiMsg = `AI selected ${aiSelectedTile}`;
			newHistory = [...history, aiMsg];
		}
		this.setState({
			currentPlayer: playerId,
			data: newData,
			history: newHistory
		});
	}
	render() {
		// <ol>{this.showHistory()}</ol>
		// <div className="game-status">Status:{this.getGameStatus()}</div>
		const { currentPlayer } = this.state;
		const { status,  winner } = this.getGameStatus();
		const gameBoard = (
			<Board 
							onClick={this.handleClick}
							data={this.state.data}
							boardSize={3}
			/>
		);
		let gameScreen;
		if (status === 'Win') {
			gameScreen = (<div><p className='status-msg'>{winner} won. Play Again!!!!</p></div>);
		} else if(status === 'Draw') {
			gameScreen = (<div><p className='status-msg'>Game Draw. Play Again!!!</p></div>);
		} else {
			gameScreen = gameBoard;
		}
		
		const gameSetup = (
			<div>
				<p>Who starts the game? AI or You?</p>
				<button onClick={() => this.selectFirstPlayer(aiPlayer)}>AI</button>
				<button onClick={() => this.selectFirstPlayer(humanPlayer)}>Me</button>
			</div>
		);
		const playGame = (
			<div>
				<div className="game-reset">{this.showResetBtn()}</div>
				{gameScreen}	
			</div>
		);
		return(
			<div>
				<h1 className="game-heading">Tic Tac Toe</h1>
				{currentPlayer === null ? gameSetup : playGame }
			</div>
		);
	}
}
