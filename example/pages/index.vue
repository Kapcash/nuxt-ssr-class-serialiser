<template>
  <div class="container">
    <article class="card">
      <h3>{{ todo.description }}</h3>
      <span>Due: {{ todo.dueDate }}</span>
      <p>Expired? {{ !!todo.isExpired }}</p>
    </article>

    <aside>Same todo object but without the decorator.</aside>

    <article class="card">
      <h3>{{ todoPlain.description }}</h3>
      <span>Due: {{ todoPlain.dueDate }}</span>
      <p>Expired? {{ !!todoPlain.isExpired }}</p>
    </article>

    <aside>
      Note how it shows "true" when you refresh the page and updates to "false" after a few ms.
      That's because the static HTML generated on server side actually computed `isExpired` as "true",
      but on client side when it's hydrated, this method no longer exists because it's not a class instance,
      so it updates to "false".
    </aside>
  </div>
</template>

<script lang="ts">
import { plainToClass } from 'class-transformer'
import { Vue, Component } from 'nuxt-property-decorator'
import { SerialiseData } from '../../src/serialiser-decorator'
import { Todo, fetchTodo } from '../models/todo'

@Component
export default class Page extends Vue {
  @SerialiseData(Todo)
  todo!: Todo

  todoPlain!: Todo

  async asyncData() {
    const todo = await fetchTodo()

    return {
      todo,
      todoPlain: plainToClass(Todo, {
        id: 2,
        description: "I'm a plain todo",
        tags: ['nuxtjs', 'ssr'],
        dueDate: '1995-05-20', // Is obviously expired
      }),
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 300px;
  margin: auto;
}

.card {
  border-radius: 10px;
  padding: 5px 20px;
  font-family: Arial;
  background-color: #f7f7f7;
  box-shadow: 0px 2px 5px 0px #b9b9b9;
}

aside {
  display: inline-block;
  line-height: 2;
  padding: 0 10px;
  margin: 15px -50px;
  border-radius: 0 5px 5px 0;
  border-left: 2px solid gray;
  background-color: #f7f7f7;
  box-shadow: inset 1px 2px 4px 0px #d6d6d6;
}
</style>