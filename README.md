# [Superblocks](https://superblocks.com)

[![Join the community](https://img.shields.io/badge/chat-on%20discord-7289da.svg?logo=discord)](https://discord.gg/6Cgg2Dw) [![CircleCI](https://circleci.com/gh/SuperblocksHQ/superblocks-lab.svg?style=shield)](https://circleci.com/gh/SuperblocksHQ/superblocks-lab) [![Follow in Twitter](https://img.shields.io/twitter/follow/getSuperblocks.svg?style=social&logo=twitter)](https://twitter.com/intent/follow?screen_name=GetSuperblocks)


[Superblocks](https://superblocks.com) is a full DevOps platform for blockchain development. Superblocks let's you build, test, release and monitor your contracts. 

To try it out, go to [superblocks.com](https://superblocks.com).

## Quick start
Below is described how to get the **Superblocks Client** project setup and running locally.

### Install node modules
Use `yarn` [Yarn](https://yarnpkg.com/).
```sh
yarn install
```

### Run in development mode
```sh
yarn start
```

Browse to `http://localhost:3000`. Note that if you use any other hostname/IP than `localhost`, then instead run update 'ORIGIN' value in 'env.development', this is important so that the iframes can communicate with the main window.

### Make a production build
```sh
yarn build
```

The dist files will be inside `./www`. Note that the this command uses production version of ".env" file, so in order to test it locally please create a ".env.local" with proper ORIGIN variable value prior to build.

## Code distribution
At the moment we have 2 different packages available.

#### CodeEditor (on-hold)
This is the old implementation of 'Superblocks Lab'. It is in a none workable state atm and will remain like that until further notice.

#### Superblocks DevOps Dashboard
This package contains the client code for the Superblocks DevOps platform. Go to the `packages/dashboard` folder to read up more about this specific package. 

## Issues
Bug reports and suggestions can be filed at the project [Issues](https://github.com/SuperblocksHQ/superblocks-lab/issues) page.  
For more information about the process involved, please refer to the Wiki: [Submitting Bugs and Suggestions](https://github.com/SuperblocksHQ/superblocks-lab/wiki/Submitting-Bugs-and-Suggestions).

## Contributing
Contributions are welcome. Please, visit the Wiki for a guide on [How to Contribute](https://github.com/SuperblocksHQ/superblocks-lab/wiki/How-to-Contribute).

## License
**Superblocks** is free software and GPLv3 licensed. See the COPYING file for details.
