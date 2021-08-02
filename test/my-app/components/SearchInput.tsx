import React from 'react';

interface IProps {
	searchText: string;
	searchSubmit: any;
}

const SearchInput: React.FC<IProps> = (props) => {

	return (
		<div className="component--search-input">
			<input
				type="text"
				name="search"
				placeholder="Search"
				value={props.searchText}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					props.searchSubmit(e.target.value)
				}}
			/>
		</div>
	);
};

export default SearchInput;
