import React, {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';

import itemCategoryData from '../assets/data/api/v2/item-category/index.json';
import {normalizeName} from '../Helpers';

const ItemCategorySubnav: React.FC = () => {
	function renderRows() {
		//making the rows to display
		let rows: ReactNode[] = [];
		const data = itemCategoryData.results;
		if (data) {
			rows = data.map((element: any) => {
				let url = element.url;
				url = url.replace('api/v2/', '');

				return (
					<div
						key={element.name}
						className="component--item-category-subnav__item"
					>
						<NavLink to={url}>{normalizeName(element.name)}</NavLink>
					</div>
				);
			});
		}
		return rows;
	}

	return (
		<div className="component--item-category-subnav">{renderRows()}</div>
	);
};

export default ItemCategorySubnav;
