import React from 'react';

const tile = ({ onClick, userId }) => {
	return (
		<button className="square" onClick={onClick}>
			{userId}
		</button>
	)
}
export default tile;