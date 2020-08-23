import { Command, flags } from '@oclif/command'
import Web3 from 'web3'
//@ts-ignore
import inquirer from 'inquirer'
//@ts-ignore
import Spinnies from 'spinnies'

import credentials, { setCredentials } from '../utils/credentials'

export default class Eth extends Command {
  static description = 'Send and View Eth balance'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'subcommand', required: true, options: ["balance", "send"] }]

  async run() {
    const { args, flags } = this.parse(Eth)
    const config = await credentials(this)

    if (!config.session.networkId) throw new Error('Configure session network!')
    const sessionNetwork = config.networks[config.session.networkId]
    const web3 = new Web3(sessionNetwork.rpc)
    const spinnies = new Spinnies();

    if (args.subcommand === "balance") {

      spinnies.add('spinner-1', { text: `Fetching balance for ${config.session.account}\n` });

      const balance = web3.utils.fromWei(await web3.eth.getBalance(config.session.account), 'ether')

      spinnies.succeed('spinner-1', { text: `balance: ${balance} Ξ` });

    } else if (args.subcommand === "send") {
      const answers = await inquirer
        .prompt([
          {
            type: 'number',
            name: 'amount',
            message: 'Amount (Ether):',
          },
          {
            type: 'input',
            name: 'to',
            message: 'Send Address:',
          },
          {
            type: 'password',
            name: 'password',
            message: 'Password:',
          },
          /*
          {
            type: 'list',
            name: 'gasPrice',
            message: 'Gas Price:',
          }*/])

      const sessionAccount = config.accounts[config.session.networkId][config.session.account]
      web3.eth.accounts.wallet.decrypt([sessionAccount], answers.password);

      spinnies.add('spinner-1', { text: `Sending ${answers.amount} Ξ => ${answers.to}` });

      const receipt: any = await web3.eth.sendTransaction({
        from: sessionAccount.address,
        to: answers.to,
        value: web3.utils.toWei(`${answers.amount}`, 'ether'),
        gas: '21000'
      }).on("transactionHash", (hash) => {
        spinnies.update('spinner-1', { text: `Sending ${answers.amount} Ξ => ${answers.to} Transaction ${hash}` });
      })

      spinnies.succeed('spinner-1', { text: `Sent ${answers.amount} Ξ => ${answers.to} Transaction ${receipt.transactionHash} Included in block ${receipt.blockNumber}` });

    }
  }
}
