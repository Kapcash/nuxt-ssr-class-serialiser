import { classToPlain } from "class-transformer";
export { SerialiseData } from './serialiser-decorator'

export default function() {
  const { nuxt } = this;

  if (!nuxt.options.build.transpile) {
    nuxt.options.build.transpile = []
  }
  nuxt.options.build.transpile.push('@nuxt/ssr-class-serialiser')

  nuxt.hook('vue-renderer:ssr:context', registerSerialisableData)
}

const registerSerialisableData = (context) => {
  if (Array.isArray(context.nuxt.data)) {
    const [asyncData] = context.nuxt.data;

    if (asyncData && Array.isArray(asyncData.serializerConfig)) {
      asyncData.serializerConfig.forEach((key) => {
        asyncData[key] = classToPlain(asyncData[key]);
      });
      
      delete asyncData.serializerConfig;
    }
  }
}
