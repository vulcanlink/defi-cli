import { Command, flags } from '@oclif/command'

export default class Chainlink extends Command {
  static description = 'Chainlink CLI'

  static flags: any = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags }: any = this.parse(Chainlink)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /home/leo/Documents/projects/ethereum/defi-cli/defi/src/commands/chainlink.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
