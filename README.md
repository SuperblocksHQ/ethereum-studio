# Superblocks Studio

[Superblocks](https://superblocks.com) Studio is an IDE to learn, build and deploy DApps for Ethereum. It's a full browser experience which requires no installations to run.  

Studio has a built in Solidity compiler and Ethereum Virtual Machine, it also works with local and public networks.  

To try it out go to [studio.superblocks.com](https://studio.superblocks.com).

## Features
`TODO`  

Below is described how to get the Studio PreactJS project setup and running locally.  

## License
Superblocks Studio is free software and GPLv3 licensed. See the COPYING file for details.  

## Install node modules
Use `yarn` [Yarn](yarnpkg.com/).
```sh
yarn install
```

## Run in dev mode
```sh
make
```

Browse to `http://localhost:8181`. Note that if you use any other hostname/IP than `localhost`, then instead run `ORIGIN_DEV=http://127.0.0.1 make`, this is important so that the iframes can communicate with the main window.

## Make a production build
```sh
make dist
```

The dist files will be inside `./dist`.

## Bumping version
Set the new version both in app.js and in manifest.json.  

Run this script to fix that for you:  

```sh
./bump_version "1.1.0"
```

## Contributing
Contributions are welcome, a `TODO` list will be presented.

## Blockchain agnostic
Studio is only for Ethereum DApp development as for now. However the goal is for Studio to support many different blockchain technologies and smart contract languages.
