<a href="https://t.me/polymathnetwork"><img src="https://img.shields.io/badge/50k+-telegram-blue.svg" target="_blank"></a>

![Polymath](Polymath.png)

# Polymath Issuer Application

Allows you to issue your security token and launch its offering.


## Development
After cloning, to install all dependencies run:
```
yarn
```
We only use Yarn as our official Node package manager, and so we will only commit yarn.lock files, and ignore package-lock.json files.

To start development run:
```
npm start
```

To build application run:
```
npm run build
```

By default application works with Ropsten testnet.

## Working with contracts locally
### Getting started
To deploy contracts run Ganache CLI >= v6.1.0-beta.0 (lower versions does not support WebSockets) and in a separate terminal:
```
npm run contracts
```

Turn off MetaMask or any other Web3 provider and start/build application.

To open Truffle Console and play with contracts directly:
```
npm run tconsole
```

[Read more about Truffle Console](http://truffleframework.com/docs/getting_started/console)