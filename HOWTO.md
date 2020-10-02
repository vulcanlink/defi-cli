# How To Guide on Using oclif
## Pack
This packs the NodeJS project for distribution by a package manager (eg. npm). The command will also run the `prepack` and `postpack` command from the `package.json` file. With oclif, this compiles the Typescript and also overwrites the [README.md](./README.md) file with documentation generated from the command descriptions and parameters in each file. You can also run `npm run prepack` if you just want to see the updated README and `/lib` compiled output.

```
npm pack
```

## Configuring Defi CLI
The defi cli requires some configuration to set up the Ethereum client connections and accounts. This can be done through the various `defi config` commands or mannually by editing the `config.json` file located in `~/.config` directory. To view the path to the config file, run `./bin/run config path view`. The default config file (written at initialization) can be found in the [`defaultConfig.ts`](./src/utilsdefaultConfig.ts).

Currently the defaultConfig is populates with an Infura RPC and a dummy test account `0x77ad4ea843c34c9db2fd933d995023bf2a4b3a18` (DO NOT by any means store any realworld ether as the private key is not secure nor encrypted by any password.

### Adding Accounts
Currently only Signing (generated) and Watch only (public key) accounts are supported.
```
./bin/run config accounts set
```

### Adding Networks
```
./bin/run config networks set
```

### Adding Tokens
Unimplemented. This can be set manually. Implementation would be welcome.
```
./bin/run config tokens set
```