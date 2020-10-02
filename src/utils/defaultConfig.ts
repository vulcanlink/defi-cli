interface Session {
  networkId: string,
  account?: string
}

interface Network {
  name: string,
  rpc: string,
  networkId: string
}

interface Token {
  address: string,
  name: string
}

export interface Config {
  session: Session,
  networks: {
    [networkId: string]: Network
  }
  tokens: {
    [networkId: string]: {
      [tokenAddress: string]: Token
    }
  },
  chainlink: any,
  uniswap: any,
  accounts: any
}

const defaultConfig: Config = {
  "session": {
    "networkId": "5777",
    "account": "0x77ad4ea843c34c9db2fd933d995023bf2a4b3a18"
  },
  "networks": {
    "1": {
      "name": "mainnet",
      "rpc": "https://mainnet.infura.io/v3/44711775475648ad959d36b45e5452bf",
      "networkId": "1",
    },
    "3": {
      "name": "ropsten",
      "rpc": "https://ropsten.infura.io/v3/44711775475648ad959d36b45e5452bf>",
      "networkId": "3",
    },
    "5777": {
      "name": "ganache",
      "rpc": "http://localhost:7545",
      "networkId": "5777"
    }
  },
  "tokens": {
    "1": {
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
        "name": "usdc",
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      "0x514910771af9ca656af840dff83e8264ecf986ca": {
        "name": "link",
        "address": "0x514910771af9ca656af840dff83e8264ecf986ca"
      }
    }
  },
  "chainlink": {
  },
  "uniswap": {
  },
  "accounts": {
    "5777": {
      "0x77ad4ea843c34c9db2fd933d995023bf2a4b3a18": {
        "version": 3,
        "id": "5cc56c40-e40c-44de-a649-af515978040e",
        "address": "77ad4ea843c34c9db2fd933d995023bf2a4b3a18",
        "crypto": {
          "ciphertext": "e10aec230b75e53073726a9a369de726db09614198f1235210911a7901d9b5f3",
          "cipherparams": { "iv": "09f71db2402383313b72e4c9eee69afb" },
          "cipher": "aes-128-ctr",
          "kdf": "scrypt",
          "kdfparams": { "dklen": 32, "salt": "656fdeaf5805904dd3d0e391d1cc567fcf893051d19818d22ec14b66f9b00843", "n": 8192, "r": 8, "p": 1 },
          "mac": "05bf58397a40d372db9606d91d3de283ce345178314a3c47a40ae458228818c0"
        }
      }
    }
  }
}

export default defaultConfig;