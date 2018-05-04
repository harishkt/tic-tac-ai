import React from 'react';
import { range } from '../utils/utils';
import Tile from './tile';

const Board = ({ data, onClick, boardSize}) => {
	const renderTile = (tileNum) => {
		return(
			<Tile
				key={tileNum.toString()}
				userId={data[tileNum]}
				onClick={() => onClick(tileNum)}>
			</Tile>
		);
	};
	const renderRow = (start, end) => {
		return(
			<div className="board-row" key={start.toString()}>
				{range(start, end).map(id => renderTile(id))}
			</div>
		);
	}
	const renderBlock = (width) => {
		const block = []
		for(let start=0, end=width;
			start<=(width*(width-1));
			start += width, end += width) {
				block.push(renderRow(start, end));
		}
		return block;
	}
	return(
		<div className="game-board">
			{renderBlock(boardSize)}
		</div>
	);
}
export default Board;