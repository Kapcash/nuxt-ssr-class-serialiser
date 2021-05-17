import Vue, { ComponentOptions } from 'vue';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { createDecorator } from 'vue-class-component';

/** Deserialize an SSR data on client side with the given constructor
 * @param classType The class constructor to use for this property
 */
export const SerializeData = <T> (classType: ClassConstructor<T>) => createDecorator((options, key) => {
  if (process.server) {
    wrapAsyncData(options, key);
  } else {
    wrapBeforeCreate(options, key, classType);
  }
});

/** Enrich the asyncData hook with a registering function.
 * Ensure we still call the original hook if it exists.
 */
function wrapAsyncData(options: ComponentOptions<Vue>, key: string) {
  const originalAsyncDataHook = options.asyncData;
  options.asyncData = async function wrapperAsyncData(...args) {
    const originalAsyncData: Record<string, any> = (await originalAsyncDataHook?.apply(this, args)) || {};

    registerSerializableProp(originalAsyncData, key);

    return originalAsyncData;
  };
}

/** Add a config property to store the data that must be serialised */
function registerSerializableProp(asyncData: any, key: string) {
  asyncData.serializerConfig = asyncData.serializerConfig || [];
  asyncData.serializerConfig.push(key);
}

/** Enrich the beforeCreate hook with a deserialiser function.
 * Ensure we still call the original hook if it exists.
 */
function wrapBeforeCreate <T>(options: ComponentOptions<Vue>, key: string, classType: ClassConstructor<T>) {
  const originalBeforeCreateHook = options.beforeCreate;
  options.beforeCreate = function deserializerWrapper(...args) {
    deserializer.call(this, key, classType);
    originalBeforeCreateHook?.apply(this, args);
  };
}

/** Deserialise a POJO data to a class instance
 * @param key the property name
 * @param classType The class constructor used to create the instance
 */
function deserializer <T>(this: Vue, key: string, classType: ClassConstructor<T>) {
  const ctx = this.$nuxt.context.nuxtState;

  const [data] = ctx.data;
  if (data && data[key]) {
    data[key] = plainToClass(classType, data[key]);
  }
}
