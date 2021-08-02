import React, {useState} from 'react';
import {withRouter, Route, NavLink, RouteComponentProps} from 'react-router-dom';
import PokedexInstructions from './PokedexInstructions';
import PokedexSubnav from './PokedexSubnav';
import PokemonList from './PokemonList';
import PokemonSubnav from './PokemonSubnav';
import Pokemon from './Pokemon';
import ItemCategorySubnav from './ItemCategorySubnav';
import ItemList from './ItemList';
import Item from './Item';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

interface IProps extends RouteComponentProps {
}

const Pokedex: React.FC<IProps> = (props) => {
	const [search, setSearch] = useState("");
	const wrapperClass = ['component--pokedex'];
	const routeArray = props.location.pathname.split('/').map((element: any) => {
		return isNaN(element) ? element : '';
	});
	wrapperClass.push('route-' + routeArray.join('-'));
	if (search) wrapperClass.push('has-search-results');

	return (
		<div className={wrapperClass.join(' ')}>
			<div className="component--pokedex__menu">
				<NavLink to="/pokedex">
					<span className="btn--red"/>
					Pokedex
				</NavLink>
				<NavLink to="/item-category">
					<span className="btn--blue"/>
					Items
				</NavLink>
				<NavLink to="/search">
					<span className="btn--green"/>
					Search
				</NavLink>
			</div>
			<div className="component--pokedex__panel-left">
				<Route exact path="/" component={PokedexInstructions}/>
				<Route path="/pokedex/:id?" component={PokedexSubnav}/>
				<Route path="/pokemon/:id" component={PokemonSubnav}/>
				<Route path="/item/:id?" component={ItemCategorySubnav}/>
				<Route path="/item-category/:id?" component={ItemCategorySubnav}/>
			</div>
			<div className="component--pokedex__panel-right">
				<Route path="/pokedex/:id" component={PokemonList}/>
				<Route path="/pokemon/:id" component={Pokemon}/>
				<Route path="/item-category/:id" component={ItemList}/>
				<Route path="/item/:id" component={Item}/>
				<Route
					path="/search"
					render={props => (
						<SearchResults {...props} searchText={search}/>
					)}
				/>
			</div>
			<div className="component--pokedex__input">
				<Route
					path="/search"
					render={props => (
						<SearchInput
							{...props}
							searchText={search}
							searchSubmit={setSearch}
						/>
					)}
				/>
			</div>
		</div>
	);
};

export default withRouter(Pokedex);
