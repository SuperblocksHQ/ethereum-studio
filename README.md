# [Ethereum Studio](https://superblocks.com/ethereum-studio)

[![Join the community](https://img.shields.io/badge/chat-on%20discord-7289da.svg?logo=discord)](https://discord.gg/6Cgg2Dw) [![Superblocks](https://superblocks.com/d/superblocks/projects/ethereum-studio.svg?branch=master)](https://superblocks.com/d/superblocks/projects/ethereum-studio) [![Follow in Twitter](https://img.shields.io/twitter/follow/getSuperblocks.svg?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=GetSuperblocks)


[Ethereum Studio](https://superblocks.com/ethereum-studio) is an integrated development environment (IDE) to learn, build and deploy decentralized apps (DApps) for _Ethereum_. It's a full browser experience which requires no installations to run.

<p align="center">
  <img alt="Ethereum Studio in action" src="https://user-images.githubusercontent.com/7814134/78335917-d0f8e600-758e-11ea-91e1-2433eaaef6f4.png">
</p>


**Ethereum Studio** has a built in _Solidity_ compiler and _Ethereum Virtual Machine_. It also works with local and public networks.

To try it out, go to [studio.ethereum.org](https://studio.ethereum.org).

## Features
* In-browser EVM
* Code Autocompletion
* Bootstrap your App
* Live code your WebApp
* Built-in wallets
* Powered by Monaco Editor


## Quick start
Below is described how to get the **Ethereum Studio** project setup and running locally.

### Install node modules
```sh
npx lerna bootstrap --hoist
```

### Run in development mode
```sh
npm start
```

Browse to `http://localhost:3000`. Note that if you use any other hostname/IP than `localhost`, then instead run update 'ORIGIN' value in 'env.development', this is important so that the iframes can communicate with the main window.

### Make a production build
```sh
npm run build
```

The dist files will be inside `./dist`. Note that the this command uses production version of ".env" file, so in order to test it locally please create a ".env.local" with proper ORIGIN variable value prior to build.

### Bumping version
Set the new version both in `app.js` and in `manifest.json`.

Run this script to fix that for you:

```sh
./bump_version "1.1.0"
```

Consider double-checking and updating the `CHANGELOG` to reflect the changes. Tag the new version.

### Modifying templates
Templates are now located inside `./packages/editor/templates` folder. After you modify those files and want to see changes you need to run `generate-templates.js` script inside `./packages/editor/scripts`.

## Issues
Bug reports and suggestions can be filed at the project [Issues](https://github.com/SuperblocksHQ/ethereum-studio/issues) page.
For more information about the process involved, please refer to the Wiki: [Submitting Bugs and Suggestions](https://github.com/SuperblocksHQ/ethereum-studio/wiki/Submitting-Bugs-and-Suggestions).

## Contributing
Contributions are welcome. Please, visit the Wiki for a guide on [How to Contribute](https://github.com/SuperblocksHQ/ethereum-studio/wiki/How-to-Contribute).

## License
**Ethereum Studio** is free software and GPLv3 licensed. See the COPYING file for details.

