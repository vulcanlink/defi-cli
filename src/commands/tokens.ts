import { Command, flags } from '@oclif/command'
import Web3 from 'web3'
import chalk from 'chalk'
import inquirer from 'inquirer'

import IERC20 from '../contracts/ERC20Detailed.json'
import credentials from '../utils/credentials'
import { defaultCipherList } from 'constants'

export default class Tokens extends Command {
  static description = 'Interact with ERC20 Tokens'

  static flags: any = {
    help: flags.help({ char: 'h' })
  }

  static args = [
    { name: 'subcommand', required: true, options: ["balance", "send"] },
    { name: 'token'}]

  async run() {
    const { args, flags } = this.parse(Tokens)
    try {
      const config = await credentials(this)
      const { session } = config
      const network = config.networks[session.networkId]

      if (!network) throw new Error(`Network ${chalk.bold(`${session.networkId}`)} not configured. Use ${chalk.bold(
        'defi config networks',
      )} to configure.`)

      const tokens = config.tokens[session.networkId]
      let inputToken;
      console.log(config.tokens)
      if (args.token == null) {
        inputToken = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'tokenSelect',
            message: 'Select a token',
            choices: Object.keys(config.tokens)
          }
        ])
      }

      else {
        inputToken = tokens[args.token] || Object.values(tokens).find((token: any) => token.name === args.token) || { address: args.token } 
      }

      const token = inputToken;

      const web3 = new Web3(network.rpc)

      //@ts-ignore
      const TokenContract = new web3.eth.Contract(IERC20.abi, token.address)
      const [balanceRaw, symbol, decimals] = await Promise.all([
        TokenContract.methods.balanceOf(session.account).call(),
        TokenContract.methods.symbol().call(),
        TokenContract.methods.decimals().call()
      ])

      let balance;
      try {
        balance = parseInt(balanceRaw) / Math.pow(10, parseInt(decimals))
      } catch (error) {
        balance = web3.utils.toBN(balanceRaw).div(web3.utils.toBN('10').pow(web3.utils.toBN(decimals)))
      }

      this.log(`balance: ${balance} ${symbol}`)
    } catch (error) {
      this.error(error || 'A DeFi CLI error has occurred.', {
        exit: 1,
      })
    }
  }
}
