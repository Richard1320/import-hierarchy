import React from 'react';
import {NavLink} from 'react-router-dom';

import withData from '../HOC/withData';
import {normalizeName} from '../Helpers';

interface IProps {
    data: any;
}

const Item: React.FC<IProps> = (props) => {
    // renderAttributes() {
    //   let render = props.data.attributes.map(attribute => {
    //     return (
    //       <div key={attribute.name} className="component--item__attributes__item">
    //         {normalizeName(attribute.name)}
    //       </div>
    //     );
    //   });
    //   return render;
    // }
    if (!props.data.name) return null;
    let name = props.data.name;
    let image = '/assets/images/sprites/items/' + name + '.png';
    let category = props.data.category;
    let categoryID = parseInt(
        category.url.replace('/api/v2/item-category/', '')
    );
    let categoryURL = '/item-category/' + categoryID;

    return (
        <div className="component--item">
            <h1 className="component--item__title">{normalizeName(name)}</h1>
            <div className="component--item__category">
                <NavLink to={categoryURL}>{normalizeName(category.name)}</NavLink>
            </div>
            <div className="component--item__image">
                <img src={image} alt={name} title={name}/>
            </div>
            <div className="component--item__effect">
                {props.data.effect_entries[0].effect}
            </div>
            {/* <div className="component--item__attributes">
          {this.renderAttributes()}
        </div> */}
        </div>
    );

};

const path = '/assets/data/api/v2/item/:id/index.json';
const WrappedComponent = withData(Item, path);

export default WrappedComponent;
