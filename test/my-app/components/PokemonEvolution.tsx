import React, {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import axios, {AxiosResponse} from 'axios';

import {normalizeName} from '../Helpers';

interface IProps {
	pokemon: any;
	pokemonSpecies: any;
	data?: any;
}

const PokemonEvolution: React.FC<IProps> = (props) => {
	const [data, setData] = useState({chain: false});

	useEffect(() => {
		try {
			const evolutionURL = props.pokemonSpecies.evolution_chain.url;
			const path = '/assets/data' + evolutionURL + 'index.json';
			axios.get(path).then((response: AxiosResponse) => {
				setData(response.data);
			});
		} catch {
		}
	}, [props.pokemonSpecies.evolution_chain]);

	function evolutionLoop(chain: any, content: any[]) {
		let name = chain.species.name;
		let key = 'evolution-' + name;
		let details = [];
		let evolutionID = parseInt(
			chain.species.url.replace('/api/v2/pokemon-species/', '')
		);
		let url = '/pokemon/' + evolutionID;
		let image = '/assets/images/sprites/pokemon/' + evolutionID + '.png';

		if (chain.evolution_details[0]) {
			let method = chain.evolution_details[0].trigger.name;
			let keyMethod = 'method-' + name + method;
			let evolutionDetailKeys = Object.keys(chain.evolution_details[0]);
			details.push(
				<div key={keyMethod}>Evolves by {normalizeName(method)}</div>
			);

			evolutionDetailKeys.forEach(evolutionDetailKey => {
				let evolutionDetail = chain.evolution_details[0][evolutionDetailKey];

				// Skip the trigger description in loop. Already rendered above.
				if (evolutionDetailKey === 'trigger') return;

				// Check if evolution requirement exists
				// Check if evolution requirement data is an object
				if (evolutionDetail && typeof evolutionDetail === 'object') {
					// Check if evolution requirement has the name property
					if (evolutionDetail.hasOwnProperty('name')) {
						evolutionDetail = evolutionDetail.name;
					} else {
						return;
					}
				}

				if (evolutionDetail) {
					let keyDetails = keyMethod + evolutionDetailKey;
					details.push(
						<div key={keyDetails}>
							{normalizeName(evolutionDetailKey)}:{' '}
							{normalizeName(evolutionDetail)}
						</div>
					);
				}
			});
		}

		content.push(
			<div key={key} className="component--pokemon-evolution__item">
				<div className="component--pokemon-evolution__item__sprite">
					<NavLink to={url}>
						<img src={image} alt={name} title={normalizeName(name)}/>
					</NavLink>
				</div>
				<div className="component--pokemon-evolution__item__name">
					<NavLink to={url}>{normalizeName(name)}</NavLink>
				</div>
				<div className="component--pokemon-evolution__item__details">
					{details}
				</div>
			</div>
		);
		if (chain.evolves_to) {
			chain.evolves_to.forEach((nextChain: any) => {
				content = evolutionLoop(nextChain, content);
			});
		}
		return content;
	}

	function renderEvolutionContent() {
		let chainContent: any[] = [];
		if (data.chain) {
			chainContent = evolutionLoop(data.chain, chainContent);
		}
		return chainContent;
	}

	return (
		<div className="component--pokemon-evolution">
			<h2>Pokemon Evolution</h2>
			{renderEvolutionContent()}
		</div>
	);
};

export default PokemonEvolution;
