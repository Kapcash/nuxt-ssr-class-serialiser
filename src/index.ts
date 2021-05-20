import { classToPlain } from 'class-transformer';
import { Module, Context } from '@nuxt/types';
export { SerialiseData } from './serialiser-decorator';

const nuxtModule: Module = function() {
  const { options, nuxt } = this;

  if (!options.build.transpile) {
    options.build.transpile = []
  }

  options.build.transpile.push('@nuxt/ssr-class-serialiser')

  nuxt.hook('vue-renderer:ssr:context', registerSerialisableData)
}

const registerSerialisableData = (context: Context['ssrContext']) => {
  const nuxtData = context!.nuxt.data
  if (Array.isArray(nuxtData)) {
    const [asyncData] = nuxtData;

    if (asyncData && Array.isArray(asyncData.serializerConfig)) {
      asyncData.serializerConfig.forEach((key: string) => {
        asyncData[key] = classToPlain(asyncData[key]);
      });
      
      delete asyncData.serializerConfig;
    }
  }
}

(nuxtModule as any).meta = require('../package.json')

export default nuxtModule;
