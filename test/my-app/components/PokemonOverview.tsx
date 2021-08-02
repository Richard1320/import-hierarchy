import React, {ReactNode} from 'react';
import {NavLink} from 'react-router-dom';

import {normalizeName} from '../Helpers';


interface IProps {
  pokemon: any;
  pokemonSpecies: any;
  data?: any;
}

const PokemonOverview: React.FC<IProps> = (props) => {

  function renderAbilities() {
    let abilities = [];
    if (props.pokemon.abilities) {
      abilities = props.pokemon.abilities.map((element: any) => {
        let abilityName = normalizeName(element.ability.name);
        return (
            <div key={element.slot}>
              {abilityName}
              {element.is_hidden ? ' (Hidden Ability)' : null}
            </div>
        );
      });
    }
    return abilities;
  }

  function renderTypes() {
    let types = [];
    if (props.pokemon.types) {
      types = props.pokemon.types.map((element: any) => {
        let typeName = normalizeName(element.type.name);
        return <div key={element.slot}>{typeName}</div>;
      });
    }
    return types;
  }

  function renderDescription() {
    let entries = props.pokemonSpecies.flavor_text_entries;
    if (entries) {
      // Get the English entry
      let entry = entries.filter((entry: any) => entry.language.name === 'en');
      return entry[0].flavor_text;
    }
  }

  function renderSprites() {
    let sprites: ReactNode[] = [];
    if (props.pokemon.sprites) {
      let spriteTypes = {
        Regular: [
          'front_default',
          'front_female',
          'back_default',
          'back_female',
        ],
        Shiny: [
          'front_shiny',
          'front-shiny_female',
          'back_shiny',
          'back_shiny_female',
        ],
      };
      let spriteTypesKeys = Object.keys(spriteTypes);
      spriteTypesKeys.forEach(spriteType => {
        // @ts-ignore
        let spriteKeys: string[] = spriteTypes[spriteType];
        sprites.push(
            <div
                key={spriteType}
                className="component--pokemon-overview__sprites__item-title"
            >
              {spriteType}
            </div>
        );
        spriteKeys.forEach(spriteKey => {
          if (props.pokemon.sprites[spriteKey]) {
            let image = props.pokemon.sprites[spriteKey];
            let title = normalizeName(
                props.pokemon.name + ' ' + spriteKey
            );
            image = image.replace(
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/',
                '/assets/images/'
            );

            sprites.push(
                <div
                    key={spriteKey}
                    className="component--pokemon-overview__sprites__item"
                >
                  <img src={image} alt={props.pokemon.name} title={title}/>
                </div>
            );
          }
        });
      });
    }
    return sprites;
  }

  function renderVariations() {
    let render = [];
    if (
        props.pokemonSpecies.varieties &&
        props.pokemonSpecies.varieties.length > 1
    ) {
      render = props.pokemonSpecies.varieties.map((item: any) => {
        let itemID = parseInt(item.pokemon.url.replace('/api/v2/pokemon/', ''));
        let url = '/pokemon/' + itemID;
        let name = normalizeName(item.pokemon.name);
        return (
            <div
                key={item.pokemon.name}
                className="component--pokemon-overview__variations__item"
            >
              <NavLink to={url}>{name}</NavLink>
              {item.is_default ? ' (Default)' : null}
            </div>
        );
      });
    }
    return render;
  }

  let variationsTitle =
      (props.pokemonSpecies.varieties &&
          props.pokemonSpecies.varieties.length > 1) ? (
          <h3>Variations</h3>
      ) : null;
  return (
      <div className="component--pokemon-overview">
        <h2>{normalizeName(props.pokemon.name)}</h2>
        <div className="component--pokemon-overview__sprites">
          {renderSprites()}
        </div>
        <div className="component--pokemon-overview__description">
          {renderDescription()}
        </div>
        <div className="component--pokemon-overview__abilities">
          <h3>Abilities</h3>
          {renderAbilities()}
        </div>
        <div className="component--pokemon-overview__types">
          <h3>Types</h3>
          {renderTypes()}
        </div>
        <div className="component--pokemon-overview__variations">
          {variationsTitle}
          {renderVariations()}
        </div>
      </div>
  );
};

export default PokemonOverview;
