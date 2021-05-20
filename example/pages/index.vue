<template>
  <div class="container">
    <h3>{{ todo.description }}</h3>
    <p>Is todo expired? {{ !!todo.isExpired }}</p>

    <hr>

    <blockquote>Same todo without the decorator</blockquote>

    <h3>{{ todoPlain.description }}</h3>
    <p>Is todo expired? {{ !!todoPlain.isExpired }}</p>

    <blockquote>
      Note how it shows "true" when you refresh the page and updates to "false" after a few ms.
      That's because the static HTML generated on server side actually computed `isExpired` as "true",
      but on client side when it's hydrated, this method no longer exists because it's not a class instance,
      so it updates to "false".
    </blockquote>
  </div>
</template>

<script lang="ts">
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
      todoPlain: todo,
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 50%;
  margin: auto;
  border-radius: 15px;
  background-color: #f7f7f7;
  padding: 20px;
  box-shadow: 0px 2px 5px 0px #b9b9b9;
  font-family: Arial;
}

h3 {
  color: #003982;
}

blockquote {
  display: inline-block;
  line-height: 2;
  padding: 0 10px;
  border-left: 2px solid gray;
  background-color: #e2e2e2;
  border-radius: 0 5px 5px 0;
  margin: 15px 0;
}
</style>