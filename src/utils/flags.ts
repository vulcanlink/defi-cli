import {flags} from '@oclif/command'

export const help = flags.help({
  char: 'h', 
  description: 'help menu',
}
)

export const networkset = flags.string({
  char: 'n', 
  description: 'set the network',
}
)

export const from = flags.string({
  char: 'f', 
  description: 'set account sending from',
}
)

export const to = flags.string({
  description: 'set recipient account for transfers',
}
)

export const network = flags.string({
  char: 'n', 
  description: 'set the network',
}
)

export const gasprice = flags.integer({
  char: 'g',
  description: 'set gas price'
})