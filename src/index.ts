#!/usr/bin/env node

import { Command } from 'commander';
import {outputHierarchyJSON} from "./parseImports";

const program = new Command();
program
	.arguments('<inputPath>')
	.version('1.0.0', '-v, --version')
	.option('-sd, --systemDirectory <directory>', 'String `find and replace` to remove the base system directory from the file paths')
	.requiredOption('-o, --output <outputPath>', 'The output file path for the JSON to be written')
	.action(outputHierarchyJSON);
program.parse(process.argv);
