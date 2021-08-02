import React, {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';

import pokemonData from '../assets/data/api/v2/pokemon/index.json';
import itemsData from '../assets/data/api/v2/item/index.json';
import {normalizeName} from '../Helpers';

interface IProps {
    searchText: string;
}

const SearchResults: React.FC<IProps> = (props) => {
    function filterSearch(element: any) {
        let search = props.searchText.toLowerCase();
        let name = normalizeName(element.name).toLowerCase();

        return name.indexOf(search) !== -1;
    }

    function renderRows() {
        let rows: ReactNode[] = [];

        if (props.searchText && pokemonData.results && itemsData.results) {
            pokemonData.results.forEach((item: any) => {
                if (filterSearch(item)) {
                    let itemID = parseInt(item.url.replace('/api/v2/pokemon/', ''));
                    let image = '/assets/images/sprites/pokemon/' + itemID + '.png';
                    let url = '/pokemon/' + itemID;
                    let name = normalizeName(item.name);
                    rows.push(
                        <div
                            key={item.name}
                            className="component--search-results__table__row"
                        >
                            <div className="component--search-results__table__row__type">
                                Pokemon
                            </div>
                            <div className="component--search-results__table__row__image">
                                <img src={image} alt={name} title={name}/>
                            </div>
                            <div className="component--search-results__table__row__link">
                                <NavLink to={url}>{name}</NavLink>
                            </div>
                        </div>
                    );
                }
            });
            itemsData.results.forEach((item: any) => {
                if (filterSearch(item)) {
                    let itemID = parseInt(item.url.replace('/api/v2/item/', ''));
                    let image = '/assets/images/sprites/items/' + item.name + '.png';
                    let url = '/item/' + itemID;
                    let name = normalizeName(item.name);
                    rows.push(
                        <div
                            key={item.name}
                            className="component--search-results__table__row"
                        >
                            <div className="component--search-results__table__row__type">
                                Item
                            </div>
                            <div className="component--search-results__table__row__image">
                                <img src={image} alt={name} title={name}/>
                            </div>
                            <div className="component--search-results__table__row__link">
                                <NavLink to={url}>{name}</NavLink>
                            </div>
                        </div>
                    );
                }
            });
        }

        return rows;
    }

    return (
        <div className="component--search-results">
            <div className="component--search-results__table">
                {renderRows()}
            </div>
        </div>
    );
};

export default SearchResults;
