import React from 'react';
import {NavLink, RouteComponentProps} from 'react-router-dom';

interface RouteParams {
    id?: string | undefined;
}

interface IProps extends RouteComponentProps<RouteParams> {
    pokemon: any;
    pokemonSpecies: any;
    data?: any;
}

const PokemonSubnav: React.FC<IProps> = (props) => {
    const overviewURL = '/pokemon/' + props.match.params.id;
    // const imagesURL = '/pokemon/' + props.match.params.id + '/images';
    const statsURL = '/pokemon/' + props.match.params.id + '/stats';
    const movesURL = '/pokemon/' + props.match.params.id + '/moves';
    const evolutionURL = '/pokemon/' + props.match.params.id + '/evolution';
    const encountersURL = '/pokemon/' + props.match.params.id + '/encounters';
    return (
        <div className="component--pokemon-subnav">
            <div className="component--pokemon-subnav__item">
                <NavLink exact to={overviewURL}>
                    Overview
                </NavLink>
            </div>
            {/* <div className="component--pokemon-subnav__item">
          <NavLink to={imagesURL}>Images</NavLink>
        </div> */}
            <div className="component--pokemon-subnav__item">
                <NavLink to={statsURL}>Stats</NavLink>
            </div>
            <div className="component--pokemon-subnav__item">
                <NavLink to={movesURL}>Moves</NavLink>
            </div>
            <div className="component--pokemon-subnav__item">
                <NavLink to={evolutionURL}>Evolution</NavLink>
            </div>
            <div className="component--pokemon-subnav__item">
                <NavLink to={encountersURL}>Encounters</NavLink>
            </div>
        </div>
    );
};

export default PokemonSubnav;
