export default {
  target: "server",
  buildModules: [
    '@nuxt/typescript-build',
  ],
  modules: [
    '@nuxt/ssr-class-serialiser'
  ],
}
