import { get as getEmoji } from 'node-emoji'
import chalk from 'chalk'
import { join } from 'path'
//@ts-ignore
import { pathExists, outputJSON, readJSON } from 'fs-extra'
import defaultConfig, { Config } from './defaultConfig'

export default async function credentials(ctx: any) {
  const config = join(ctx.config.configDir, 'config.json')
  if (!await pathExists(config)) {
    await outputJSON(config, defaultConfig)
  }

  const configData: Config = await readJSON(config)

  if (!configData) {
    ctx.warn(
      `Credentials not found. Run the command ${chalk.bold(
        'defi config',
      )} to generate a new DeFi configuration file.`,
      getEmoji('warning'),
    )
    ctx.exit(0)
  }

  // Fill empty network fields
  Object.keys(configData.networks).forEach((networkId) => {
    if (!configData.tokens[networkId]) configData.tokens[networkId] = {}
    if (!configData.accounts[networkId]) configData.accounts[networkId] = {}
    if (!configData.chainlink[networkId]) configData.chainlink[networkId] = {}
    if (!configData.uniswap[networkId]) configData.uniswap[networkId] = {}
  })

  return { ...configData }
}

export async function setCredentials(ctx: any, credentials: any) {
  const config = join(ctx.config.configDir, 'config.json')
  await outputJSON(config, credentials)
}

