import {expect, test} from '@oclif/test'

describe('chainlink', () => {
  test
  .stdout()
  .command(['chainlink'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['chainlink', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
