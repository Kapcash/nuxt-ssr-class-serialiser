# @nuxt/ssr-class-serialiser

[![License][license-src]][license-href]

## Features

This module help you to deal with - _Typescript_ - class instances transfer from Server side to Client side.

### The problem it solves 

Whenever you use class instances for your component's data on server side,
you'll be likely facing this warning ⚠️:

![Warning: can't stringify non-POJO](assets/img/serialise_error_pojo.png)

This is because Nuxt serialises the server side data to JSON, then stringify it, in order to transfer it in an HTTP request to the client side.

But `JSON.stringify()` doesn't work with class instances! 💥

**That's what this module is fixing.**

### Requirements

- Use the library [vue-class-property](https://class-component.vuejs.org) (or any wrapping library such as [vue-class-property](https://github.com/vuejs/vue-class-component) and [nuxt-class-property](https://github.com/nuxt-community/nuxt-property-decorator))
- Using Nuxt **Universal** mode (`target: 'server'`)

> I wish I could provide this solution for vanilla components instead of class based one. Sadly, I don't know how to provide the equivalent of Typescript decorators for vanilla code...

## Setup

1. Add `@nuxt/ssr-class-serialiser` dependency to your project

```bash
yarn add @nuxt/ssr-class-serialiser # or npm install @nuxt/ssr-class-serialiser
```

2. Add `@nuxt/ssr-class-serialiser` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@nuxt/ssr-class-serialiser',
  ],
}
```

## Usage

The module provides a custom decorator `SerialiseClass` to decorate the data you need to serialise.

```typescript
import { Vue, Component } from 'nuxt-property-decorator'
import { SerialiseClass } from '../../src/serialiser-class-decorator'
import { Todo, fetchTodo } from '../models/todo'

export class Todo implements ITodo {
  id!: number;
  description!: string;
  dueDate!: string;

  get isExpired (): boolean {
     const dueDate = new Date(this.dueDate)
     const today = new Date()
     return dueDate < today
  }
}

@Component
export default class Page extends Vue {
  // Identify the data as a serialisable class instance
  // You have to pass in the class constructor as parameter
  @SerialiseClass(Todo)
  todo!: Todo

  async asyncData() {
    // Return a todo *instance* (new Todo()), not a plain object
    const todo: Todo = await fetchTodo()

    return {
      todo,
    }
  }
}
```

> In class components, asyncData returned properties are not properly types.
> If you try to run `this.todo`, it won't exist for Typescript.
> 
> A solution for this is to declare it as a class property as above.  
> That's where we can use the decorator.  

| Decorator | Parameters | Description |
|-----------|------------|-------------|
| SerialiseClass | (classConstructor) | Mark the decorated property as serialisable. Provide the constructor to use as parameter. |

## Development

1. Clone this repository
2. Install dependencies using `yarn add` or `npm install`
3. Start the example nuxt app using `yarn dev` or `npm run dev`

## License

[MIT License](./LICENSE)