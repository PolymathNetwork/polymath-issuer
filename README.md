<a href="https://t.me/polymathnetwork"><img src="https://img.shields.io/badge/50k+-telegram-blue.svg" target="_blank"></a>

![Polymath](Polymath.png)

# Polymath Issuer Application

Allows you to issue your security token and launch its offering.


## Development
After cloning, to install all dependencies run:
```
yarn
```

We only use [Yarn](https://yarnpkg.com/en/) as our official Node package manager, so we will only commit yarn.lock files and ignore package-lock.json files.


On development we recommend to run the app with contracts locally. To do
this follow [this steps](#working-with-contracts-locally) before starting the 
app.

**Important: When working with contracts locally, you must wait for the
`contracts` command to finish before starting the application. Otherwise
you will receive a runtime error.**

To start development run:
```
yarn start
```

To build the application run:
```
yarn build
```

## Working with contracts locally

Start the [Ganache CLI](https://github.com/trufflesuite/ganache-cli) to run the local blockchain:

**Important: The `contracts` command will fail if `ganache-cli` is not running**
```
yarn ganache-cli
```

In a separate terminal, generate the contract artifacts:
```
yarn contracts
```

Turn off [MetaMask](https://metamask.io/) or any other [Web3](https://github.com/ethereum/web3.js/) provider and start/build application.

To open [Truffle Console](http://truffleframework.com/docs/getting_started/console) and play with contracts directly:
```
yarn tconsole
```