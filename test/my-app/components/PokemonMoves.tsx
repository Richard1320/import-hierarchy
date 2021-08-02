import React, {ReactNode, useState} from 'react';

import {normalizeName} from '../Helpers';

interface IProps {
	pokemon: any;
	pokemonSpecies: any;
	data?: any;
}

interface IMoveVersionGroupDetail {
	level_learned_at: number;
	move_learn_method: { name: string; url: string };
	version_group: { name: string; url: string };
}

interface IMove {
	move: { name: string; url: string }
	version_group_details: IMoveVersionGroupDetail[];
}

interface IMoveConcise {
	method: string;
	level_learned_at: number;
	name: string;
}

const PokemonMoves: React.FC<IProps> = (props) => {
	const [chosenGen, setChosenGen] = useState("gen7");
	const genOptions = {
		// /api/v2/generation/
		gen1: ['red-blue', 'yellow'],
		gen2: ['gold-silver', 'crystal'],
		gen3: [
			'ruby-sapphire',
			'emerald',
			'firered-leafgreen',
			'colosseum',
			'xd',
		],
		gen4: ['diamond-pearl', 'platinum', 'heartgold-soulsilver'],
		gen5: ['black-white', 'black-2-white-2'],
		gen6: ['x-y', 'omega-ruby-alpha-sapphire'],
		gen7: ['sun-moon'],
	};
	const moveLearnMethods = [
		// /api/v2/move-learn-method/
		'level-up',
		'egg',
		'tutor',
		'machine',
		'stadium-surfing-pikachu',
		'light-ball-egg',
		'colosseum-purification',
		'xd-shadow',
		'xd-purification',
		'form-change',
	];

	function getGenerations() {
		let keys = Object.keys(genOptions);
		let options = keys
			.map(key => {
				const moves = getMoves(key);

				// Check if any moves are available
				if (!moves.length) return '';

				// @ts-ignore
				const optionText: string = genOptions[key].join(', ');
				return (
					<option key={key} value={key}>
						{key}: {optionText}
					</option>
				);
			});

		return (
			<select
				onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
					setChosenGen(e.target.value)
				}}
				value={chosenGen}
			>
				{options}
			</select>
		);
	}

	function sortMoves(a: IMoveConcise, b: IMoveConcise) {
		let sortA: string | number = a.name;
		let sortB: string | number = b.name;

		// Sort by level up if available
		if (a.level_learned_at && b.level_learned_at) {
			sortA = a.level_learned_at;
			sortB = b.level_learned_at;
		}

		// Return sort order
		if (sortA < sortB) return -1;
		if (sortA > sortB) return 1;
		return 0;
	}

	function getMoves(filterVersion: string, method?: string) {
		// @ts-ignore
		let chosenGenVersion: string = genOptions[filterVersion];
		// Reorganize data as an array
		let moves: IMoveConcise[] = [];
		if (props.pokemon.moves) {
			props.pokemon.moves.forEach((item: IMove) => {
				// Get game generations that this move can be learned in
				let genOptions = item.version_group_details;
				let keys = Object.keys(genOptions);

				// Loop through game generations for move
				for (let key in keys) {
					let itemVersion = genOptions[key].version_group.name;
					let itemMethod = genOptions[key].move_learn_method.name;

					// Check if chosen generation can learn this move
					// Check if method matches, or
					// Check if method is not supplied (Return moves from all methods)
					if (
						chosenGenVersion.indexOf(itemVersion) !== -1 &&
						(itemMethod === method || !method)
					) {
						moves.push({
							method: itemMethod,
							level_learned_at: genOptions[key].level_learned_at,
							name: item.move.name,
						});

						break;
					}
				}
				return;
			});
		}

		// Sort moves by level up or alphabetical
		moves.sort(sortMoves);

		return moves;
	}

	function renderMoves() {
		let render: ReactNode[] = [];
		moveLearnMethods.forEach(method => {
			let moves = getMoves(chosenGen, method);
			let movesHTML: ReactNode[] = [];

			// Check if any moves are available
			if (!moves.length) return;

			moves.forEach(move => {
				const reactKey = `${method}-${move.name}`;
				movesHTML.push(
					<div key={reactKey} className="component--pokemon-moves__item">
						<div>{normalizeName(move.name)}</div>
						{method === 'level-up' ? (
							<div>Level: {move.level_learned_at}</div>
						) : null}
					</div>
				);
			});
			render.push(
				<div key={method} className="component--pokemon-moves__method">
					<h3>{normalizeName(method)}</h3>
					{movesHTML}
				</div>
			);
		});
		return render;
	}

	// @ts-ignore
	let chosenGenText: any = genOptions[chosenGen].join(', ');
	return (
		<div className="component--pokemon-moves">
			<div className="component--pokemon-moves__generations">
				<div className="component--pokemon-moves__generations__select select-wrapper">
					{getGenerations()}
				</div>
				<h3>{normalizeName(chosenGenText)}</h3>
			</div>
			<div className="component--pokemon-moves__list">
				{renderMoves()}
			</div>
		</div>
	);
};
export default PokemonMoves;