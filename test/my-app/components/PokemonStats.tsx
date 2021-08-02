import React from 'react';
import {Radar} from 'react-chartjs-2';

interface IProps {
	pokemon: any;
	pokemonSpecies: any;
	data?: any;
}

const PokemonStats: React.FC<IProps> = (props) => {
	const labels: string[] = [];
	const stats: string[] = [];
	if (props.pokemon.stats) {
		props.pokemon.stats.forEach((stat: any) => {
			labels.push(stat.stat.name);
			stats.push(stat.base_stat);
		});
	}
	const chartData = {
		labels: labels,
		datasets: [
			{
				label: 'Stat',
				data: stats,
			},
		],
	};
	const options = {
		legend: {
			display: false,
		},
		scale: {
			ticks: {
				beginAtZero: true,
			},
		},
		layout: {
			padding: 20,
		},
	};

	return (
		<div className="component--pokemon-stats">
			<Radar data={chartData} options={options} height={250}/>
		</div>
	);

};

export default PokemonStats;
