import {expect, test} from '@oclif/test'

describe('uniswap', () => {
  test
  .stdout()
  .command(['uniswap'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['uniswap', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
