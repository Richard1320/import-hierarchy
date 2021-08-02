import React from 'react';

import HDImagesData from '../assets/images/HQImageList.json';
import {normalizeName} from '../Helpers';

interface IProps {
  pokemon: any;
  pokemonSpecies: any;
  data: any;
}

interface IFile {
  file: string;
  folder: string;
}

const PokemonImages: React.FC<IProps> = (props) => {

  function renderHDImage() {
    const images = [];
    const imageTypes = Object.keys(HDImagesData);
    imageTypes.forEach((imageType, i) => {
      // @ts-ignore
      const fileArray: IFile[] = HDImagesData[imageType];
      let folder = '';

      switch (imageType) {
        case 'regular':
          folder = 'FurretTurret_REGULAR_HD_SPRITES';
          break;
        case 'shiny':
        default:
          folder = 'FurretTurret_SHINY_HD_SPRITES';
          break;
      }
      fileArray.forEach((element: IFile, x: number) => {
        const name = props.pokemonSpecies.name || '';
        const key = name + '_' + x + '_' + i;
        const file = element.file;
        const nameLower = name.toLowerCase();
        const fileLower = file.toLowerCase();

        // Check if names match
        if (nameLower && fileLower.indexOf(nameLower) !== -1) {
          const image = '/assets/images/' + folder + '/' + file;
          let description = file
              .split('.')
              .slice(0, -1)
              .join('.'); // Remove extension from filename
          description = normalizeName(description) + ' ' + imageType;

          images.push(
              <div key={key} className="component--pokemon-images__item">
                <h2>{description}</h2>
                <div>
                  <img src={image} alt={description} title={description}/>
                </div>
              </div>
          );
        }
      });
    });

    if (!images.length) {
      images.push(
          <div className="component--pokemon-images__na">
            No images found for {props.pokemon.name}.
          </div>
      );
    }

    return images;
  }

  return (
      <div className="component--pokemon-images">{renderHDImage()}</div>
  );
};

export default PokemonImages;
