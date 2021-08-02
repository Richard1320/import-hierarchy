import React, {ReactNode, useEffect, useState} from 'react';
import {NavLink, RouteComponentProps} from 'react-router-dom';

import withData from '../HOC/withData';
import Pagination from './Pagination';
import {normalizeName} from '../Helpers';

interface RouteParams {
    id?: string | undefined;
}

interface IProps extends RouteComponentProps<RouteParams> {
    pokemon: any;
    pokemonSpecies: any;
    data: any;
}

const PokemonList: React.FC<IProps> = (props) => {
    const [pager, setPager] = useState({page: 1, itemsPerPage: 20});

    useEffect(() => {
        // Reset pager to 1
        setPager({...pager, page: 1});

        // eslint-disable-next-line
    }, [props.match.params.id]);

    function renderRows() {
        //making the rows to display
        let rows: ReactNode[] = [];
        let data = props.data.pokemon_entries;
        if (data) {
            let count = data.length;
            let start = (pager.page - 1) * pager.itemsPerPage;
            let end = start + pager.itemsPerPage;
            if (end > count) {
                end = count;
            }

            data.slice(start, end).forEach((item: any) => {
                let itemID = parseInt(
                    item.pokemon_species.url.replace('/api/v2/pokemon-species/', '')
                );
                let image = '/assets/images/sprites/pokemon/' + itemID + '.png';
                let url = '/pokemon/' + itemID;
                let name = normalizeName(item.pokemon_species.name);
                rows.push(
                    <div
                        key={item.entry_number}
                        className="component--pokemon-list__table__row"
                    >
                        <div className="component--pokemon-list__table__row__number">
                            #{item.entry_number}
                        </div>
                        <div className="component--pokemon-list__table__row__image">
                            <img src={image} alt={name} title={name}/>
                        </div>
                        <div className="component--pokemon-list__table__row__link">
                            <NavLink to={url}>{name}</NavLink>
                        </div>
                    </div>
                );
            });
        }

        return rows;
    }

    return (
        <div className="component--pokemon-list">
            <div className="component--pokemon-list__table">
                {renderRows()}
            </div>
            <Pagination
                count={props.data.hasOwnProperty('pokemon_entries') ? props.data.pokemon_entries.length : 0}
                pager={pager}
                pagerSubmit={setPager}
            />
        </div>
    );

};

const path = '/assets/data/api/v2/pokedex/:id/index.json';
const WrappedComponent = withData(PokemonList, path);

export default WrappedComponent;
