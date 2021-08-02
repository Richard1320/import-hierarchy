import fs from "fs";
import path from "path";
import {
	IImportHierarchyListItem,
	IImportHierarchyOutput,
	IImportHierarchyItem,
	IImportHierarchyProgramOptions
} from "../types";
import writeFile from "./writeFile";
import {parse} from '@typescript-eslint/typescript-estree';
import {ImportClause, ProgramStatement, ExportDefaultDeclaration} from "@typescript-eslint/types/dist/ast-spec";

const codeFileExtensions: string[] = [".js", ".jsx", ".ts", ".tsx"];

/**
 * Find the system directory where the project starts and remove the paths prior to that.
 * @param filePath
 * @param systemDirectory
 */
function trimSystemDirectoryPath(filePath: string, systemDirectory?: string): string {
	let newFilePath: string = filePath;
	if (!systemDirectory) {
		try {
			// Attempt to find executing directory
			systemDirectory = process.cwd() + "/";
		} catch {
		}
	}
	if (systemDirectory) {
		newFilePath = newFilePath.replace(systemDirectory, "");
	}
	return newFilePath;
}

/**
 * Function to check whether or not a file is a local React component.
 * @param element
 */
function filterImports(element: IImportHierarchyListItem): boolean {
	if (!element.source) return false;

	// Remove non-local modules that don't start with "."
	return element.source.charAt(0) === ".";

}

/**
 * Function to map relative filepath import to absolute path in filesystem.
 * @param sourcePath Absolute filepath of the module doing the importing
 * @param relativePath Relative filepath to imported module from the sourcePath file
 */
function mapPath(sourcePath: string, relativePath: IImportHierarchyListItem): IImportHierarchyListItem {
	let systemFilePath: string = "";
	const targetFilePath = path.join(path.dirname(sourcePath), relativePath.source);
	if (fs.existsSync(targetFilePath) && fs.lstatSync(targetFilePath).isFile()) {
		// Import is file and includes extension
		systemFilePath = targetFilePath;
	} else {
		// Loop through extensions and attempt to find imported file
		codeFileExtensions.forEach((extension) => {
			// Check if file exists
			if (fs.existsSync(targetFilePath + extension)) {
				systemFilePath = targetFilePath + extension;
			} else if (fs.existsSync(targetFilePath + "/index" + extension)) { // If it's a directory, attempt to find index file
				systemFilePath = targetFilePath + "/index" + extension;
			}
		});
	}
	return {...relativePath, source: systemFilePath}
}

/**
 * Function to generate a list of imports for a single parent component
 * @param inputPath
 */
function parseImports(inputPath: string): IImportHierarchyItem | undefined {
	const fileName = path.basename(inputPath);
	const fileExtension = path.extname(inputPath);

	// Not a code file
	if (!codeFileExtensions.includes(fileExtension)) {
		return;
	}

	const code = fs.readFileSync(inputPath, 'utf8');
	const ast = parse(code, {jsx: true});
	// Get a list of imports and try to figure out which are child components
	let imports: IImportHierarchyListItem[] = [];
	for (const i of ast.body.map(extractModules)) {
		if (!!i) {
			imports = imports.concat(i);
		}
	}
	const filteredImports: IImportHierarchyListItem[] = imports
		.filter(filterImports)
		.map((importItem: IImportHierarchyListItem) => mapPath(inputPath, importItem))
		.filter((importItem: IImportHierarchyListItem) => importItem.source); // Remove empty items

	// Set initial export name to filename
	let exportName = path.parse(fileName).name;

	// Attempt to get name of `default export` variable.
	try {
		const defaultExport: ExportDefaultDeclaration = ast.body.filter((element) => element.type === "ExportDefaultDeclaration")[0] as ExportDefaultDeclaration;
		if ("name" in defaultExport.declaration && defaultExport.declaration.name) {
			exportName = defaultExport.declaration.name;
		}
	} catch {
		console.error("err loading default export", fileName);
	}

	return {
		name: exportName,
		imports: filteredImports,
	}

}

/**
 * If the statement is a ES6 import statement.
 * @param bodyItem
 */
function extractModules(bodyItem: ProgramStatement): IImportHierarchyListItem[] | false {
	if (bodyItem.type === 'ImportDeclaration') {
		const source: string = bodyItem.source.value as string;
		return bodyItem.specifiers.map((specifier: ImportClause) => {
			return {
				name: specifier.local.name as string,
				source: source,
			};
		});
	}
	return false;
}

/**
 * Main function. Takes an initial root file and gets the list of imports. Then does a recursive loop for the list of imports.
 * @param inputPath
 * @param options
 */
export function importHierarchyJSON(inputPath: string, options: IImportHierarchyProgramOptions): IImportHierarchyOutput {
	const data: IImportHierarchyOutput = {};
	const initialFilePath = fs.realpathSync(inputPath, {});

	// Files still to loop through
	let todoFilePaths: string[] = [];

	// Execute initial file
	const initialParse = parseImports(initialFilePath);
	if (initialParse) {
		data[initialFilePath] = {...initialParse};
		todoFilePaths = initialParse.imports.map((element) => element.source);
	}


	// Loop through and rerun main function for all descendant children component imports.
	while (todoFilePaths.length) {
		const nextFilePath: string = todoFilePaths.shift() as string;
		// skip if this file is already done
		if (!data[nextFilePath]) {
			const nextImports = parseImports(nextFilePath);
			if (nextImports) {
				todoFilePaths = todoFilePaths.concat(nextImports.imports.map((element) => element.source));
				data[nextFilePath as string] = {...nextImports};
			}
		}
	}

	// Trim the system file paths
	Object.keys(data).forEach((systemFilePath: string) => {
		const appFilePath = trimSystemDirectoryPath(systemFilePath, options.systemDirectory);

		// "Rename" the object's key
		if (appFilePath !== systemFilePath) {
			data[appFilePath] = data[systemFilePath];
			delete data[systemFilePath];
		}

		// Trim the import paths
		data[appFilePath].imports = data[appFilePath].imports.map((importFile) => {
			return {
				...importFile,
				source: trimSystemDirectoryPath(importFile.source, options.systemDirectory)
			};
		});
	});

	return data;
}

/**
 * Writes the hierarchy JSON to an actual .json file on the disk or output to the console.
 * @param inputPath
 * @param options
 */
export function outputHierarchyJSON(inputPath: string, options: IImportHierarchyProgramOptions): void {
	const data = importHierarchyJSON(inputPath, options);
	if (options.output) {
		writeFile(JSON.stringify(data), options.output);
	} else {
		console.log(data);
	}
}
