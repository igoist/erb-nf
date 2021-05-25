import * as React from 'react';
import { useImmer } from 'use-immer';

const { useState, useMemo } = React;

export const useMethods = (initialValue: any, methods: Object) => {
  const [value, setValue] = useState(initialValue);
  const boundMethods = useMemo(
    () =>
      Object.entries(methods).reduce((methods: any, [name, fn]) => {
        const method = (...args: any) => {
          setValue((value: any) => fn(value, ...args));
        };

        methods[name] = method;
        return methods;
      }, {}),
    [methods],
  );
  return [value, boundMethods];
};

interface ArrayMethods<T> {
  push(state: Array<T>, item: T): Array<T>;
  // unshift?(item: T): void;
  // pop(state: Array<T>, item: T): Array<T>;
  pop(state: Array<T>, item: T): Array<T>;
  slice(state: Array<T>, start: number, end: number): Array<T>;
  empty(): Array<T>;
  set(state: Array<T>, newValue: Array<T>): Array<T>;
  remove(state: Array<T>, item: T): Array<T>;
}

const arrayMethods: ArrayMethods<any> = {
  push(state, item) {
    return state.concat(item);
  },
  pop(state) {
    return state.slice(0, -1);
  },
  slice(state, start, end) {
    return state.slice(start, end);
  },
  empty() {
    return [];
  },
  set(state, newValue) {
    return newValue;
  },
  remove(state, item) {
    const index = state.indexOf(item);
    if (index < 0) {
      return state;
    }
    return [...state.slice(0, index), ...state.slice(index + 1)];
  },
};

const useArray = (initialValue: any = []) => {
  // invariant(Array.isArray(initialValue), 'initialValue must be an array');
  return useMethods(initialValue, arrayMethods);
};

type Todo = {
  id: number;
  text: string;
};

const initialTodos: Array<Todo> = [];

const useTodo = (initialTodos: Array<Todo>) => {
  const [todos, todoMethods] = useArray(initialTodos);

  return [
    todos,
    {
      addTodo: todoMethods.push,
      resetTodo: todoMethods.empty,
      deleteTodo: todoMethods.remove,
    },
  ];
};

const AppUseArray = () => {
  const [todos, { addTodo, resetTodo, deleteTodo }] = useTodo(initialTodos);

  const Todos = () => {
    if (todos && todos.length) {
      return (
        <>
          {todos.map((todo: Todo) => {
            return (
              <div
                className={`${'et'}-todo-${todo.id}`}
                onClick={() => {
                  console.log(`${todo.id} is clicked`);
                  deleteTodo(todo);
                }}
              >
                {todo.id} -- {todo.text}
              </div>
            );
          })}
        </>
      );
    } else {
      return null;
    }
  };

  console.log(todos, deleteTodo);

  const lastTodo = todos[todos.length - 1];

  return (
    <div>
      <Todos />

      <button
        onClick={() => {
          addTodo({ id: ((lastTodo && lastTodo.id) || 0) + 1, text: 'TTTTTTTTT' });
        }}
      >
        AddTodo
      </button>
      <button
        onClick={() => {
          resetTodo();
        }}
      >
        ResetTodo
      </button>
    </div>
  );
};

export default AppUseArray;
