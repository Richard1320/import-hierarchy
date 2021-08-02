import React, {ReactNode} from 'react';

interface IProps {
	pager: {
		page: number;
		itemsPerPage: number;
	};
	pagerSubmit: any;
	count: number;
}

const Pagination: React.FC<IProps> = (props) => {
	const offsetDisplay = 2;

	function goToPage(targetPage: number): void {
		const pager = {...props.pager, page: targetPage};
		props.pagerSubmit(pager); // Send query back to parent
	}

	function displayLinks(): ReactNode[] {
		const links = [];
		const count = props.count;
		const page = props.pager.page;
		const itemsPerPage = props.pager.itemsPerPage;
		const offset = offsetDisplay;
		const totalPages = Math.ceil(count / itemsPerPage);
		// const prevPage = page - 1;
		// const nextPage = page + 1;

		if (page > 1) {
			links.push(
				<div key="page-first" className="component--pagination__first">
					<button onClick={() => {
						goToPage(1)
					}}>
						<span className="fal fa-angle-double-left"/>
					</button>
				</div>
			);
			// links.push(
			//   <div key="page-prev" className="component--pagination__prev">
			//     <button onClick={() => {goToPage(prevPage)}}>
			//       Prev
			//     </button>
			//   </div>
			// );
		}

		// loop to show links to range of pages around current page
		for (let x = page - offset; x < page + offset + 1; x++) {
			// if it's a valid page number...
			if (x > 0 && x <= totalPages) {
				// if we're on current page...
				if (x === page) {
					// 'highlight' it but don't make a link
					links.push(
						<div key={x} className="component--pagination__page is-active">
							<span>{x}</span>
						</div>
					);
					// if not current page...
				} else {
					// make it a link
					links.push(
						<div key={x} className="component--pagination__page">
							<button onClick={() => {
								goToPage(x)
							}}>
								{x}
							</button>
						</div>
					);
				} // end else
			} // end if
		} // end for

		// if not on last page, show forward and last page links
		if (page !== totalPages) {
			// links.push(
			//   <div key="page-next" className="component--pagination__next">
			//     <button onClick={() => {goToPage(nextPage)}}>
			//       Next
			//     </button>
			//   </div>
			// );
			links.push(
				<div key="page-last" className="component--pagination__last">
					<button onClick={() => {
						goToPage(totalPages)
					}}>
						<span className="fal fa-angle-double-right"/>
					</button>
				</div>
			);
		} // end if
		/****** end build pagination links ******/

		return links;
	}

	return <div className="component--pagination">{displayLinks()}</div>;

};

export default Pagination;