import {expect} from "chai";
import comparisonJSON from "./comparison.json";
import {IImportHierarchyOutput, IImportHierarchyProgramOptions} from "../types";
import {importHierarchyJSON} from "../dist/parseImports";

describe('Import Hierarchy', () => {
	const initialFilePath = __dirname + "/my-app/App.tsx";
	const options: IImportHierarchyProgramOptions= {
		systemDirectory: __dirname + "/my-app/",
	}

	// Pass in the initial file for import analysis.
	const importStructure:IImportHierarchyOutput = importHierarchyJSON(initialFilePath, options);

	// Properties with undefined values are actually still set. Need to stringify and re-parse the data.
	const importJSON:IImportHierarchyOutput = JSON.parse(JSON.stringify(importStructure));

	it('should match the comparison JSON file', (done) => {
		expect(importJSON).to.eql(comparisonJSON);
		done();
	});

});