# Superblocks Studio

[![CircleCI](https://circleci.com/gh/SuperblocksHQ/studio.svg?style=shield&circle-token=c798fc7a66f88cff97b4d77e4082752568b33195)](https://circleci.com/gh/SuperblocksHQ/studio)

[Superblocks](https://superblocks.com) **Studio** is an integrated development environment (IDE) to learn, build and deploy decentralized apps (DApps) for _Ethereum_. It's a full browser experience which requires no installations to run.

**Studio** has a built in _Solidity_ compiler and _Ethereum Virtual Machine_. It also works with local and public networks.

To try it out, go to [studio.superblocks.com](https://studio.superblocks.com).

## Features
* In-browser Blockchain
* Code Autocompletion
* Bootstrap your App
* Live code your WebApp
* Deploy to Networks
* Run with custom node
* Built-in wallets
* Export your full DApp
* Metamask Integration
* Powered by Monaco Editor

## Quick start
Below is described how to get the **Studio** PreactJS project setup and running locally.

### Install node modules
Use `yarn` [Yarn](https://yarnpkg.com/).
```sh
yarn install
```

### Run in development mode
```sh
make
```

Browse to `http://localhost:8181`. Note that if you use any other hostname/IP than `localhost`, then instead run `ORIGIN_DEV=http://127.0.0.1 make`, this is important so that the iframes can communicate with the main window.

### Make a production build
```sh
make dist
```

The dist files will be inside `./dist`.

### Bumping version
Set the new version both in app.js and in manifest.json.

Run this script to fix that for you:

```sh
./bump_version "1.1.0"
```

Consider double-checking and updating the `CHANGELOG` to reflect the changes. Tag the new version.

## Issues
Bug reports and suggestions can be filed at the project [Issues](https://github.com/SuperblocksHQ/studio/issues) page.  
For more information about the process involved, please refer to the Wiki: [Submitting Bugs and Suggestions](https://github.com/SuperblocksHQ/studio/wiki/Submitting-Bugs-and-Suggestions).

## Contributing
Contributions are welcome. Please, visit the Wiki for a guide on [How to Contribute](https://github.com/SuperblocksHQ/studio/wiki/How-to-Contribute).

## License
**Superblocks Studio** is free software and GPLv3 licensed. See the COPYING file for details.
