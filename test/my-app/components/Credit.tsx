import React from 'react';

const Credit: React.FC = () => {
	return (
		<div className="component--credit">
			<div className="component--credit__programming">
				App programmed by{' '}
				<a
					href="https://www.magicmediamuse.com"
					target="_blank"
					rel="noreferrer noopener"
				>
					Richard Hung
				</a>
			</div>
			<div className="component--credit__data">
				Data provided by{' '}
				<a
					href="https://pokeapi.co/"
					target="_blank"
					rel="noreferrer noopener"
				>
					PokeAPI
				</a>
			</div>
			<div className="component--credit__nintendo">
				Pok&eacute;mon And All Respective Names are Trademark &amp; &copy; of
				Nintendo
			</div>
		</div>
	);
};

export default Credit;
