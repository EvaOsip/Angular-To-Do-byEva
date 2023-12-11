import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {TodoType} from "../../../types/todo.type";


@Injectable({
  providedIn: 'root'
})
export class ToDoService {
  getTodoListFromLocalStorage(): Observable<TodoType[] | null> {
    const arr = localStorage.getItem('toDoList');
    if (arr && arr.length > 0) {
      return of(JSON.parse(arr));
    } else {
      return of(null);
    }
  }

  addTodo(value: TodoType): Observable<TodoType[]> {
    return this.getTodoListFromLocalStorage()
      .pipe(
      map((data: TodoType[] | null) => {
        let todoList: TodoType[] = data ? data : [];
        todoList.unshift(value);
        localStorage.setItem('toDoList', JSON.stringify(todoList));
        return todoList;
      })
    );
  }

  editTodo(value: TodoType): Observable<TodoType[]> {
    return this.getTodoListFromLocalStorage()
      .pipe(
      map((data: TodoType[] | null) => {
        let todoList: TodoType[] = data ? data : [];
        todoList = todoList.map(item => item.id === value.id ? value : item);
        localStorage.setItem('toDoList', JSON.stringify(todoList));
        return todoList;
      })
    );
  }

  getFilterItems(): Observable<string[] | null> {
    return this.getTodoListFromLocalStorage().pipe(
      map((data) => {
        if (data) {
          const items: string[] = [];
          let filteredItems: string[] = [];
          data.forEach(todo => {
            const arr = todo.name.match(/#[a-zA-Zа-яА-Я0-9]+/g)
            if (arr && arr.length > 0) {
              arr.forEach((value: string) => {
                items.push(value);
              })
            }
            const uniqueNames = new Set(items);
            filteredItems = Array.from(uniqueNames);
          });
          return filteredItems;
        } else {
          return null;
        }
      })
    )
  }

  delete(id: number): Observable<TodoType[]> {
    return this.getTodoListFromLocalStorage().pipe(
      map((data) => {
        let todoList: TodoType[] = data ? data : [];
        todoList = todoList.filter(item => item.id !== id);
        localStorage.setItem('toDoList', JSON.stringify(todoList));
        return todoList;
      })
    );
  }
}
