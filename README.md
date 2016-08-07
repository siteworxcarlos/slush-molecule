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

You will be prompted for the name of your molecule, the type of wrapper you prefer for the molecule (div or section tag), if you need a javascript file and/or json file created for the molecule. Your answers will dictate which items get scaffolded into Pattern Lab. The files are generated absent your existing folder hiearchy, the idea being you would place the generated files where needed.

Command to see which generators are installed:

```bash
$ slush
```

Uninstall Slush Molecule:
```bash
sudo npm uninstall slush-molecule -g
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

