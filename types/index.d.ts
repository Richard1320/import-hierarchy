export interface IImportHierarchyProgramOptions {
	/** Filepath to write JSON file to */
	output?: string;
	/** String replace function to remove the base system directory from the file paths */
	systemDirectory?: string;
}

export interface IImportHierarchyListItem {
	/** Name of imported component */
	name: string;
	/** Filepath to imported component */
	source: string;
}

export interface IImportHierarchyItem {
	/** Name of this component (default export) */
	name: string;
	/** List of imports for this specific component */
	imports: IImportHierarchyListItem[];
}

export interface IImportHierarchyOutput {
	[path: string]: IImportHierarchyItem;
}
