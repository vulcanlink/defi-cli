import { Command, flags } from '@oclif/command'
//@ts-ignore
import inquirer from 'inquirer'
import { join } from 'path'
import Web3 from 'web3'

import credentials, { setCredentials } from '../utils/credentials'
import defaultConfig from '../utils/defaultConfig'

function promptObject(item: any) {
  return Object.keys(item).map((k) => {
    return {
      type: 'input',
      name: k,
      message: `Enter ${k}:`,
      default: item[k]
    }
  })
}

export default class Config extends Command {
  static description = 'Configure DeFi CLI'

  static examples = [
    '$ defi config session set',
    '$ defi config accounts view',
    '$ defi config uniswap view',
  ]

  static flags: any = {
    help: flags.help({ char: 'h' }),
    default: flags.boolean({ description: 'set default config' }),
    all: flags.boolean({ description: 'view full config' })
  }

  static args = [{
    name: 'item',
    required: true,
    options: ['session', 'networks', 'accounts', 'chainlink', 'uniswap', 'tokens', 'all', 'path'],
  },
  { name: 'subcommand', required: true, options: ["view", "set"] }
  ]

  async run() {
    const { args, flags }: any = this.parse(Config)
    const config = await credentials(this)

    try {
      if (args.item === 'path') {
        const configPath = join(this.config.configDir, 'config.json')
        this.log(configPath)
      } else if (args.item === 'session') {
        if (args.subcommand === 'view') {
          this.log(config.session)
        } else if (args.subcommand === 'set') {
          const answers = await inquirer
            .prompt([{
              type: 'list',
              name: 'networkId',
              message: 'Select networkId:',
              choices: Object.keys(config.networks),
              default: config.session.networkId
            },
            {
              type: 'list',
              name: 'account',
              message: 'Select account:',
              choices: (answers: any) => {
                return Object.keys(config.accounts[answers.networkId])
              },
              default: config.session.networkId
            }])

          config.session = answers
          await setCredentials(this, config)
          this.log('Session configured.')

        }

      } else if (args.item === 'networks') {
        const networks = config.networks
        const networkNames = Object.values(networks).map((n: any) => n.name)
        if (args.subcommand === 'view') {
          this.log(config.networks)

        } else if (args.subcommand === 'set') {
          const answers = await inquirer
            .prompt([
              {
                type: 'list',
                name: 'networkSelect',
                message: 'Configure networks:',
                choices: [
                  ...networkNames,
                  new inquirer.Separator(),
                  'Add network',
                ],
              },
              {
                type: 'input',
                name: 'name',
                message: 'Enter network name:',
                when: (answers: any) => {
                  return answers.networkSelect === 'Add network';
                }
              },
              {
                type: 'input',
                name: 'networkId',
                message: 'Enter network id:',
                default: (answers: any) => {
                  const defaultNetwork: any = Object.values(networks).find((n: any) => n.name === answers.networkSelect)
                  if (!defaultNetwork) return null;

                  return defaultNetwork.networkId
                }
              },
              {
                type: 'input',
                name: 'rpc',
                message: 'Enter RPC:',
                default: (answers: any) => {
                  const defaultNetwork: any = Object.values(networks).find((n: any) => n.name === answers.networkSelect)
                  if (!defaultNetwork) return null;

                  return defaultNetwork.rpc
                }
              }
            ])

          if (answers.networkSelect === 'Add network') {
            config.networks[answers.networkId] = { networkId: answers.networkId, rpc: answers.rpc, name: answers.name }
          } else {
            config.networks[answers.networkId] = { networkId: answers.networkId, rpc: answers.rpc, name: answers.networkSelect }
          }

          if (!config.accounts[answers.networkId]) config.accounts[answers.networkId] = {}
          if (!config.tokens[answers.networkId]) config.tokens[answers.networkId] = {}
          if (!config.chainlink[answers.networkId]) config.chainlink[answers.networkId] = {}
          if (!config.uniswap[answers.networkId]) config.uniswap[answers.networkId] = {}

          await setCredentials(this, config)
          this.log('Networks configured.')
        }
      } else if (args.item === 'accounts') {
        const accounts = config.accounts
        if (args.subcommand === 'view') {
          if (flags.all) {
            this.log(accounts)
          } else {
            const addressesByNetwork: any = {}
            Object.entries(accounts).forEach(([networkId, networkAccounts]: [any, any]) => {
              addressesByNetwork[networkId] = Object.keys(networkAccounts)
            })
            this.log(addressesByNetwork)
          }

        } else if (args.subcommand === 'set') {

          const networks = Object.values(config.networks).map((network: any) => {
            return {
              name: `${network.networkId} (${network.name})`,
              value: network.networkId
            }
          })

          const accountTypes = [
            { name: 'Signing (generate)', value: 'generatePrivateKey' },
            { name: 'Watch only (public key)', value: 'watchOnly' },
            { name: 'Signing (private key)', value: 'inputPrivateKey' },
            { name: 'HD Wallet (BIP-39', value: 'HDWallet' }
          ]

          const answers = await inquirer
            .prompt([
              {
                type: 'list',
                name: 'accountType',
                message: 'Select account type:',
                choices: accountTypes,
                default: accountTypes[0]
              },
              {
                type: 'list',
                name: 'networkId',
                message: 'Select network id:',
                choices: networks,
                default: config.session.networkId
              },
              {
                type: 'input',
                name: 'address',
                message: 'Enter Address:',
                when: (answers: any) => {
                  return answers.accountType === 'watchOnly'
                }
              },
              {
                type: 'number',
                name: 'generateCount',
                message: 'How many accounts do you wish to create?',
                default: 1,
                when: (answers: any) => {
                  return answers.accountType === 'generatePrivateKey'
                }
              },
              {
                type: 'password',
                name: 'password',
                message: 'Enter Password:',
                when: (answers: any) => {
                  return answers.accountType === 'generatePrivateKey'
                }
              },
              {
                type: 'password',
                name: 'passwordConfirm',
                message: 'Confirm Password:',
                when: (answers: any) => {
                  return answers.accountType === 'generatePrivateKey'
                }
              }])

          if (!config.accounts[answers.networkId]) config.accounts[answers.networkId] = {}

          if (answers.accountType === 'watchOnly') {
            if (config.accounts[answers.networkId][answers.address]) throw new Error(`Account ${answers.address} exists already!`)
            config.accounts[answers.networkId][answers.address] = { address: answers.address }
          } else if (answers.accountType === 'generatePrivateKey') {
            if (answers.password != answers.passwordConfirm) {
              throw new Error('Passwords don\'t match!')
            }

            const web3 = new Web3()
            web3.eth.accounts.wallet.create(answers.generateCount)
            const accountsEncrypted: any = web3.eth.accounts.wallet.encrypt(answers.password)
            web3.eth.accounts.wallet.clear();
            accountsEncrypted.forEach((account: any) => {
              config.accounts[answers.networkId]['0x' + account.address] = account
            })
            this.log('Account encrypted with password.\nStore accounts in JSON file recovery:')
            this.log(accountsEncrypted)
          }

          await setCredentials(this, config)
          this.log('Accounts configured.')
        }


      } else if (args.item === 'chainlink') {

      } else if (args.item === 'uniswap') {

      } else if (args.item === 'tokens') {

      } else if (args.item === 'all') {
        if (args.subcommand === 'view') {
          this.log(config)
        } else if (args.subcommand === 'set') {

          if (flags.default) {
            await setCredentials(this, defaultConfig)
            this.log('Default config set.')
          } else {
            throw new Error('configure all Unimplemented!')
          }

        }
      }

    } catch (error) {
      this.error(error || 'A DeFi CLI error has occurred.', {
        exit: 1,
      })
    }
  }
}
