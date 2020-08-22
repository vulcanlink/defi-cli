defi
====

CLI to interact and deploy popular Ethereum DeFi DApps

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/defi.svg)](https://npmjs.org/package/defi)
[![Downloads/week](https://img.shields.io/npm/dw/defi.svg)](https://npmjs.org/package/defi)
[![License](https://img.shields.io/npm/l/defi.svg)](https://github.com/leovigna/defi/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g defi
$ defi COMMAND
running command...
$ defi (-v|--version|version)
defi/0.0.1 linux-x64 node-v12.16.3
$ defi --help [COMMAND]
USAGE
  $ defi COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`defi chainlink [FILE]`](#defi-chainlink-file)
* [`defi config ITEM SUBCOMMAND`](#defi-config-item-subcommand)
* [`defi hello [FILE]`](#defi-hello-file)
* [`defi help [COMMAND]`](#defi-help-command)
* [`defi tokens TOKEN SUBCOMMAND`](#defi-tokens-token-subcommand)
* [`defi uniswap [FILE]`](#defi-uniswap-file)

## `defi chainlink [FILE]`

Chainlink CLI

```
USAGE
  $ defi chainlink [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/chainlink.ts](https://github.com/leovigna/defi/blob/v0.0.1/src/commands/chainlink.ts)_

## `defi config ITEM SUBCOMMAND`

Configure DeFi CLI

```
USAGE
  $ defi config ITEM SUBCOMMAND

OPTIONS
  -h, --help  show CLI help
  --default   set default config

EXAMPLES
  $ defi config session set
  $ defi config accounts view
  $ defi config uniswap view
```

_See code: [src/commands/config.ts](https://github.com/leovigna/defi/blob/v0.0.1/src/commands/config.ts)_

## `defi hello [FILE]`

describe the command here

```
USAGE
  $ defi hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ defi hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/leovigna/defi/blob/v0.0.1/src/commands/hello.ts)_

## `defi help [COMMAND]`

display help for defi

```
USAGE
  $ defi help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `defi tokens TOKEN SUBCOMMAND`

Interact with ERC20 Tokens

```
USAGE
  $ defi tokens TOKEN SUBCOMMAND

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/tokens.ts](https://github.com/leovigna/defi/blob/v0.0.1/src/commands/tokens.ts)_

## `defi uniswap [FILE]`

Uniswap CLI

```
USAGE
  $ defi uniswap [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/uniswap.ts](https://github.com/leovigna/defi/blob/v0.0.1/src/commands/uniswap.ts)_
<!-- commandsstop -->
