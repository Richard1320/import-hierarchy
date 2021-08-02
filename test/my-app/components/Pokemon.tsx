import React, {useEffect, useState} from 'react';
import {Route, RouteComponentProps} from 'react-router-dom';
import axios, {AxiosResponse} from 'axios';

// import PokemonImages from './PokemonImages';
import PokemonOverview from './PokemonOverview';
import PokemonStats from './PokemonStats';
import PokemonMoves from './PokemonMoves';
import PokemonEvolution from './PokemonEvolution';
import PokemonEncounters from './PokemonEncounters';

interface RouteParams {
	id?: string | undefined;
}

interface IProps extends RouteComponentProps<RouteParams> {
}

const Pokemon: React.FC<IProps> = (props) => {
	const [pokemon, setPokemon] = useState({});
	const [pokemonSpecies, setPokemonSpecies] = useState({});

	useEffect(() => {
		const nextPokemonID = props.match.params.id;
		const path = '/assets/data/api/v2/pokemon/' + nextPokemonID + '/index.json';
		axios.get(path).then(pokemonDataCallback);
	}, [props.match.params.id]);

	function pokemonDataCallback(response: AxiosResponse) {
		setPokemon(response.data);
		let pokemonSpeciesID = parseInt(
			response.data.species.url.replace('/api/v2/pokemon-species/', '')
		);
		let path =
			`/assets/data/api/v2/pokemon-species/${pokemonSpeciesID}/index.json`;
		axios.get(path).then((speciesResponse: AxiosResponse) => {
			setPokemonSpecies(speciesResponse.data);
		});
	}

	return (
		<div className="component--pokemon">
			<Route
				exact
				path="/pokemon/:id"
				render={() => (
					<PokemonOverview
						{...props}
						pokemon={pokemon}
						pokemonSpecies={pokemonSpecies}
					/>
				)}
			/>
			<Route
				path="/pokemon/:id/stats"
				render={() => (
					<PokemonStats
						{...props}
						pokemon={pokemon}
						pokemonSpecies={pokemonSpecies}
					/>
				)}
			/>
			<Route
				path="/pokemon/:id/moves"
				render={() => (
					<PokemonMoves
						{...props}
						pokemon={pokemon}
						pokemonSpecies={pokemonSpecies}
					/>
				)}
			/>
			<Route
				path="/pokemon/:id/evolution"
				render={() => (
					<PokemonEvolution
						{...props}
						pokemon={pokemon}
						pokemonSpecies={pokemonSpecies}
					/>
				)}
			/>
			<Route
				path="/pokemon/:id/encounters"
				render={() => (
					<PokemonEncounters
						{...props}
						pokemon={pokemon}
						pokemonSpecies={pokemonSpecies}
					/>
				)}
			/>
		</div>
	);
};

export default Pokemon;
