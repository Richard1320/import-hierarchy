import React, {useState} from 'react';

import withData from '../HOC/withData';
import {normalizeName} from '../Helpers';

interface IProps {
    pokemon: any;
    pokemonSpecies: any;
    data: any;
}

interface IEncounterDetail {
    chance: number;
    condition_values: string[];
    max_level: number;
    method: { name: string; url: string; };
    min_level: number;
}

interface IEncounter {
    encounter_details: IEncounterDetail[];
    name: string;
}

const PokemonEncounters: React.FC<IProps> = (props) => {
    const [chosen, setChosen] = useState("red");
    const versions = [
        // /api/v2/version/
        'red',
        'blue',
        'yellow',
        'gold',
        'silver',
        'crystal',
        'ruby',
        'sapphire',
        'emerald',
        'firered',
        'leafgreen',
        'diamond',
        'pearl',
        'platinum',
        'heartgold',
        'soulsilver',
        'black',
        'white',
        'colosseum',
        'xd',
        'black-2',
        'white-2',
        'x',
        'y',
        'omega-ruby',
        'alpha-sapphire',
        'sun',
        'moon',
    ];

    function getVersions() {
        let options = versions.map(version => {
            let encounters = getEncounters(version);
            let reactKey = 'encounter-option-' + version;

            return (
                <option key={reactKey} value={version}>
                    {normalizeName(version)}:{' '}
                    {encounters.length ? encounters.length + ' locations' : 'N/A'}
                </option>
            );
        });

        return (
            <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setChosen(e.target.value)
                }}
                value={chosen}
            >
                {options}
            </select>
        );
    }

    function getEncounters(chosenVer: string) {
        // Reorganize data as an array
        let encounters: IEncounter[] = [];
        if (props.data) {
            let dataKeys = Object.keys(props.data);
            // Loop through all available moves
            dataKeys.forEach(dataKey => {
                let item = props.data[dataKey];

                // Get game versions that this pokemon can be encountered in
                let versions = item.version_details;
                // Loop through game versions for move
                for (let itemVersion of versions) {
                    // Check if chosen version can encounter pokemon at this location
                    if (itemVersion.version.name === chosenVer) {
                        encounters.push({
                            encounter_details: itemVersion.encounter_details,
                            name: item.location_area.name,
                        });
                        break;
                    }
                }
            });
        }
        // Sort moves by level up or alphabetical
        // moves.sort(this.sortMoves);

        return encounters;
    }

    function renderConditions(conditionValues: any[]) {
        return conditionValues.map((condition: any) => {
            let reactKey = condition.name;
            return (
                <div
                    key={reactKey}
                    className="component--pokemon-encounters__list__item__details__item__conditions__item"
                >
                    Condition: {normalizeName(condition.name)}
                </div>
            );
        });
    }

    function removeDuplicateEncounterDetails(encounterDetails: IEncounterDetail[]) {
        return encounterDetails.filter(
            (obj, index, self) =>
                index ===
                self.findIndex(
                    t =>
                        t.min_level === obj.min_level &&
                        t.max_level === obj.max_level &&
                        t.method.name === obj.method.name
                )
        );
    }

    function renderEncounterDetails(encounterDetails: IEncounterDetail[]) {
        encounterDetails = removeDuplicateEncounterDetails(encounterDetails);
        return encounterDetails.map(detail => {
            let reactKey =
                `encounter-detail-${detail.max_level}${detail.method.name}`;
            return (
                <div
                    key={reactKey}
                    className="component--pokemon-encounters__list__item__details__item"
                >
                    <div className="component--pokemon-encounters__list__item__details__item__method">
                        Method: {normalizeName(detail.method.name)}
                    </div>
                    <div className="component--pokemon-encounters__list__item__details__item__max-level">
                        Max Level: {detail.max_level}
                    </div>
                    <div className="component--pokemon-encounters__list__item__details__item__chance">
                        Chance: {detail.chance}
                    </div>
                    <div className="component--pokemon-encounters__list__item__details__item__conditions">
                        {renderConditions(detail.condition_values)}
                    </div>
                </div>
            );
        });
    }

    function renderEncounters() {
        let encounters = getEncounters(chosen);
        // Check if any encounters are available
        if (!encounters.length) {
            return (
                <div className="component--pokemon-encounters__na">
                    No data is available for encountering{' '}
                    {normalizeName(props.pokemon.name)} in the wild in{' '}
                    {chosen} version
                </div>
            );
        }
        return encounters.map(encounter => {
            let reactKey = 'encounter-' + encounter.name;
            return (
                <div
                    key={reactKey}
                    className="component--pokemon-encounters__list__item"
                >
                    <div className="component--pokemon-encounters__list__item__location">
                        {normalizeName(encounter.name)}
                    </div>
                    <div className="component--pokemon-encounters__list__item__details">
                        {renderEncounterDetails(encounter.encounter_details)}
                    </div>
                </div>
            );
        });
    }

    return (
        <div className="component--pokemon-encounters">
            <div className="component--pokemon-encounters__versions">
                <div className="component--pokemon-encounters__versions__select select-wrapper">
                    {getVersions()}
                </div>
                <h2>{normalizeName(chosen)} Version</h2>
            </div>
            <div className="component--pokemon-encounters__list">
                {renderEncounters()}
            </div>
        </div>
    );

};
const path = '/assets/data/api/v2/pokemon/:id/encounters/index.json';
let WrappedComponent = withData(PokemonEncounters, path);

export default WrappedComponent;
