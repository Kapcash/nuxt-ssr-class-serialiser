import { plainToClass } from 'class-transformer'
interface ITodo {
  id: number;
  description: string;
  tags: Array<string>;
  dueDate: string;
}

export class Todo implements ITodo {
  id!: number;
  description!: string;
  tags!: Array<string>;
  dueDate!: string;

  get isExpired (): boolean {
     const dueDate = new Date(this.dueDate)
     const today = new Date()
     return dueDate < today
  }
}

const plainTodo: ITodo = {
  id: 1,
  description: 'Write this blog article before 1980',
  tags: ['blogging', 'nuxtjs', 'ssr'],
  dueDate: '1980-05-20' // Is obviously expired
}

/** Simulate an API call and returns a new class instance */
export const fetchTodo: () => Promise<Todo> = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTodo = plainToClass(Todo, plainTodo)
      resolve(newTodo)
    }, 1000)
  });
}