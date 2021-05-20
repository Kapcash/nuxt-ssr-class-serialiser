import { getNuxt, setupTest, get } from '@nuxt/test-utils'

describe('module', () => {
  setupTest({
    testDir: __dirname,
    fixture: '../example',
    server: true,
    config: {
      dev: true,
    }
  })

  it('should register module as transplied at build', () => {
    const nuxt = getNuxt()

    expect(nuxt.options.build.transpile).toContain('@nuxt/ssr-class-serialiser')
  })

  it('should register a renderer ssr content hook', () => {
    const nuxt = getNuxt()

    expect((nuxt as any)._hooks).toHaveProperty('vue-renderer:ssr:context')
  })

  it('should deserialise server side class instance on frontend', async () => {
    const { body } = await get('/')

    expect(body).toContain('Is todo expired? true</p>')
  })
})