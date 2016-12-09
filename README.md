# Slush Molecule [![Build Status](https://secure.travis-ci.org/siteworxcarlos/slush-molecule.png?branch=master)](https://travis-ci.org/siteworxcarlos/slush-molecule) [![NPM version](https://badge-me.herokuapp.com/api/npm/slush-molecule.png)](http://badges.enytc.com/for/npm/slush-molecule)

> Slush scaffolding to create molecule in Pattern Lab


## Getting Started

Install `slush-molecule` globally: (May require SUDO or admin rights)

```bash
$ npm install -g slush-molecule
```

### Usage

You must run the slush command from the root folder of your Pattern Lab (PL2)

```bash
$ slush molecule
```
You will be prompted for serveral things including the name of your molecule, if you need a javascript file, and if json file created for the molecule. Your answers will dictate which items get scaffolded into Pattern Lab.

Command to see which generators are installed:

```bash
$ slush
```

Uninstall Slush Molecule:
```bash
sudo npm uninstall slush-molecule -g
```

#### Configuring your Slush Molecule

You can configure filepaths and templates used by adding a `slush-molecule-config.json` file in the same place that you run the `slush molecule` command from.
The default configuration is included in this project.  Your local configuration will override and merge with that file.  See below for an explaination of each value:
```json
{
	"mustacheOutputPath": "the path of the folder with the mustache file in it gets placed",
	"mustacheDataFile": {
		"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
		"template": "the path to the template to be used for the mustache file when data file is requested"
	},
	"mustacheFile": {
		"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
		"template": "the path to the template to be used for the mustache file when data file is NOT requested"
	},
	"scssFileOutputPath": "the path of the folder with the scss files in it gets placed",
	"scssNamespaceConnector": "The character(s) to connect the name of the scss file with the name of the breakpoint (e.g. \"-\" for scssFileName-bpName.scss)",
	"scssFiles": [
		{
			"name": "name of the breakpoint",
			"includedFromFile": "the file that this breakpoint file is imported from",
			"scssImportPath": "the path from the importing file to the newly generated file",
			"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
			"template": "the path to the template to be used for the scss file for this breakpoint",
			"importReplace": "false if the import code should simply be appended, otherwise provide a placeholder that the import code should prepend"
		},{
			"name": "name of the breakpoint",
			"includedFromFile": "the file that this breakpoint file is imported from",
			"scssImportPath": "the path from the importing file to the newly generated file",
			"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
			"template": "the path to the template to be used for the scss file for this breakpoint",
			"importReplace": "false if the import code should simply be appended, otherwise provide a placeholder that the import code should prepend"
		}
	],
	"jsFile": {
		"outputPath": "the path where the JS file gets placed",
		"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
		"template": "the path to the template to be used for the JS file"
	},
	"jsInitScript": {
		"initializedFromFile": "the file that the JS file is intialized from",
		"initializeReplace": "false if the initialize code should simply be appended, otherwise provide a placeholder that the initialize code should prepend",
		"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
		"template": "the path to the template to be used for the initialization script",
		"tempFilename": "the name of a file to be used temporarily when generating the initialization script (should only need to provide this if you're seeing conflicts with the default value)"
	},
	"dataFile": {
		"outputPath": "the path of the JSON (data) file gets placed",
		"slushTemplate": "true if the template to be used is in the slush project, false if you are providing your own in your local project",
		"template": "the path to the template to be used for the JSON (data) file"
	}
}
```


## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/slushjs/slush).

## Contributing

See the [CONTRIBUTING Guidelines](https://github.com/siteworxcarlos/slush-molecule/blob/master/CONTRIBUTING.md)

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/siteworxcarlos/slush-molecule/issues).

## License 

Unlicensed

Copyright (c) 2016, Carlos Picart

