import React, {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';

import pokedexData from '../assets/data/api/v2/pokedex/index.json';
import {normalizeName} from '../Helpers';

const PokedexSubnav: React.FC = () => {
	function renderRows(): ReactNode[] {
		//making the rows to display
		const rows: ReactNode[] = [];
		const data = pokedexData.results;
		if (data) {
			data.forEach((element, index) => {
				let url = element.url;
				url = url.replace('api/v2/', '');

				rows.push(
					<div key={index} className="component--pokedex-subnav__item">
						<NavLink to={url}>{normalizeName(element.name)}</NavLink>
					</div>
				);
			});
		}
		return rows;
	}

	return <div className="component--pokedex-subnav">{renderRows()}</div>;

};
export default PokedexSubnav;
