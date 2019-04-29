###Dependencies

[Truffle framework](https://truffleframework.com/)

[Ganache local blockchain](https://github.com/trufflesuite/ganache-cli)

###Installation
- `cd PROJECT_DIR`
- `npm install knex -g`
- `npm install`
- `cd client`
- `npm install`

### Commands

#### DB deploy
##### To create DB
- `knex migrate:latest`
- `knex migrate:latest --env rinkeby`
- `knex migrate:latest --env live`

##### To remove DB
- `knex migrate:rollback`
- `knex migrate:rollback --env rinkeby`
- `knex migrate:rollback --env live`

#### Blockchain deploy
- `truffle migrate --network development`
- `truffle migrate --network rinkeby`
- `truffle migrate --network live`

#### Start server
- `node server.js`
- `node server.js rinkeby`
- `node server.js live`

### How to deploy to live:
- create a new account in MetaMask
- import mnemonics from MetaMask
- Add mnemonics to `.env` key `MNEMONIC_MAINNET`
- Set first mnemonic address to `FROM_ADDRESS_MAINNET` in `.env`
- Transfer some ether to first mnemonic account
- execute `truffle migrate --network live`
- deploy the code to a production server
- create a new database and configure db MAINNET section in `.env`
- execute `knex migrate:latest --env live` from `PROJECT_DIR/client/backend`
- start server `node server.js live`
