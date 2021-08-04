# Import Hierarchy

Import Hierarchy is a CLI tool that analyzes list of ES6 imports to determine hierarchy and output that a JSON file. The
most common use is to generate a hierarchy tree for component based frameworks like React for documentation purposes.
See [examples](#example-json-output)

## Installation

From NPM for use as a command line app:

```
npm install import-hierarchy -g
```

From NPM for local project use:

```
npm install import-hierarchy --save
```

## Usage

It provides a CLI command that takes an initial starting file to analyze and write the results to a JSON file on the
server.

```
import-hierarchy <startingFilePath> [options] -o <JSONOutputPath>
```

## CLI Options

```
-h, --help                                  Display help for commands.

-v, --version                               Output the version number.

-o, --output <filePath>                     The output file path for the JSON to be written. (Required)

-sd, --systemDirectory <pathToRemove>       String `find and replace` to remove the base system directory from the file 
                                            paths. Defaults to the currently executing directory.
```

## Example JSON Output

```json
{
  "index.tsx": {
    "name": "index",
    "imports": [
      {
        "name": "App",
        "source": "App.tsx"
      },
      {
        "name": "reportWebVitals",
        "source": "reportWebVitals.ts"
      }
    ]
  },
  "App.tsx": {
    "name": "App",
    "imports": [
      {
        "name": "logo",
        "source": "logo.svg"
      }
    ]
  },
  "reportWebVitals.ts": {
    "name": "reportWebVitals",
    "imports": []
  }
}
```
