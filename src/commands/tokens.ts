import { Command, flags } from '@oclif/command'
import Web3 from 'web3'
import chalk from 'chalk'
import inquirer from 'inquirer'

import credentials from '../utils/credentials'
import {from} from '../utils/flags'
import {help} from '../utils/flags'
import {network} from '../utils/flags'
import {to} from '../utils/flags'
import {gasprice} from '../utils/flags'
import {token} from '../utils/flags'
import { defaultCipherList } from 'constants'

export default class Tokens extends Command {
  static description = 'Interact with ERC20 Tokens'

  static flags: any = {
    from: from,
    help: help,
    network: network,
    to: to,
    gasprice: gasprice,
    token: token
  }

  static args = [
    { name: 'subcommand', required: true, options: ["balance", "send"] } ]

  async run() {
    const { args, flags } : any = this.parse(Tokens)
    try {
      const config = await credentials(this)
      const { session } = config

      //Set the network
      let setNetwork : any = config.networks[session.networkId]
      if(flags.network) {
        setNetwork = Object.values(config.networks).find((network: any) =>  network.networkId == flags.network) || Object.values(config.networks).find((network: any) =>  network.name == flags.network)
      }
      const network = setNetwork

      if (!network) throw new Error(`Network is not configured. Use ${chalk.bold(
        'defi config networks',
      )} to configure.`)

      //Set the account
      let setAccount : any = session.account
      if(args.subcommand == "balance") {
        let answers = await inquirer
          .prompt ([
            {
                type: 'input',
                name: 'account', 
                message: 'Select an account: '
            }
          ])
        setAccount = answers.account
      }
      const account = setAccount

      //Get token
      const tokens = config.tokens[network.networkId]
      let inputToken = flags.token;
      if (flags.token == null) {
        let answers = await inquirer
        .prompt([
          {
            type: 'list',
            name: 'token',
            message: 'Select a token',
            choices: Object.values(tokens)
          }
        ])
        inputToken = answers.token
      }
      const token = Object.values(tokens).find((token: any) => token.name === flags.token || token.name === inputToken) || { address: flags.token } 
      
      const web3 = new Web3(network.rpc)
      const ERC20Detailed = require('../contracts/ERC20Detailed.json')

      //@ts-ignore
      const TokenContract = new web3.eth.Contract(ERC20Detailed.abi, token.address)
      
      //Get Contract Details
      const [balanceRaw, symbol, decimals] = await Promise.all([
        TokenContract.methods.balanceOf(account).call(),
        TokenContract.methods.symbol().call(),
        TokenContract.methods.decimals().call()
      ])

      //balanceOf
      if (args.subcommand == 'balance') {
        let balance;
        try {
          balance = parseInt(balanceRaw) / Math.pow(10, parseInt(decimals))
        } catch (error) {
          balance = web3.utils.toBN(balanceRaw).div(web3.utils.toBN('10').pow(web3.utils.toBN(decimals)))
        }

        this.log(`balance: ${balance} ${symbol}`)
      }

      //transfer
      else if (args.subcommand == 'send') {
        let answers = await inquirer
          .prompt ([
            {
              type: 'number',
              name: 'amount',
              message: 'Enter amount to send:'
            }
          ])
        
        let setFrom = flags.from
        if(flags.from == null){
          let answers = await inquirer
            .prompt ([
              {
                type: 'input', 
                name: 'fromAddress', 
                message: 'Enter address you are sending from:',
                default: session.account
              }
            ])
          setFrom = answers.fromAddress
        }

        let setTo = flags.to
        if(flags.to == null){
          let answers = await inquirer
            .prompt ([
              {
                type: 'input', 
                name: 'toAddress', 
                message: 'Enter address you are sending to:'
              }
            ])
          setTo = answers.toAddress
        }
        
        const sender = setFrom
        const recipeint = setTo

        TokenContract.methods.transfer(
          recipeint, 
          answers.amount
          ).send({from: sender})
          //@ts-ignore
          .once('transactionHash', (hash) => { console.log(hash) })
          //@ts-ignore
          .once('receipt', (receipt) => { console.log(receipt) })

        console.log("Transfer registered.")
      }

    } catch (error) {
      this.error(error || 'A DeFi CLI error has occurred.', {
        exit: 1,
      })
    }
  }
}

