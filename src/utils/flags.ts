import {flags} from '@oclif/command'

export const help = flags.help({
  char: 'h', 
  description: 'help menu',
}
)

export const network = flags.string({
  char: 'n', 
  description: 'set the network',
}
)

export const from = flags.string({ 
  description: 'set account sending from',
}
)

export const to = flags.string({
  description: 'set recipient account for transfers',
}
)

export const gasprice = flags.integer({
  description: 'set gas price'
})

export const token = flags.string({
  description: 'select a token'
})