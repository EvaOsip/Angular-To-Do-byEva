import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToDoService} from "../../shared/services/to-do.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TodoType} from "../../../types/todo.type";
import {Subscription, switchMap} from "rxjs";
import {ActiveParamsType} from "../../../types/active-params.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  constructor(private toDoService: ToDoService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  todoList: TodoType[] = [];
  text: string = '';
  subscription: Subscription | null = null;
  activeParams: ActiveParamsType = {types: []};
  hashtags: string[] = [];

  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.activeParams.types = params['types'];
      let arr: string[] = Array.isArray(this.activeParams.types) ? this.activeParams.types : [this.activeParams.types];
      if (this.activeParams.types && this.activeParams.types.length > 0) {
        this.toDoService.getTodoListFromLocalStorage()
          .subscribe({
            next: (data: TodoType[] | null) => {
              if (data && data.length > 0) {
                this.todoList = data.filter(item => {
                  return arr.some(value => item.name.includes(value));
                });
              }
            },
            error: (error) => {
              console.log(error)
            }
          });
      } else {
        this.toDoService.getTodoListFromLocalStorage()
          .subscribe({
            next: (data: TodoType[] | null) => {
              if (data && data.length > 0) {
                this.todoList = data;
              }
            },
            error: (error) => {
              console.log(error)
            }
          });
      }
    })

  }


  change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
    let matches = target.value.match(/#(\w+)/g);
    if (matches) {
      this.hashtags = matches;
    } else {
      this.hashtags = [];
    }
  }

  addTodo(): void {
    if (this.text.length > 0) {
      const newTodo: TodoType = {
        id: Math.random(),
        name: this.text,
        isCompleted: false
      }
      this.toDoService.addTodo(newTodo)
        .subscribe({
          next: (data: TodoType[]) => {
            if (data) {
              this.todoList = data;
              this.text = '';
              this.activeParams.types = [];
              this.router.navigate(['/'], {queryParams: this.activeParams});
              this.hashtags = [];
            }
          }, error: (error) => {
            console.error(error);
          }
        });
    }
  }

  deleteTask(id: number) {
    this.toDoService.delete(id).pipe(
      switchMap(() => this.toDoService.getTodoListFromLocalStorage()),
    ).subscribe({
      next: (data: TodoType[] | null) => {
        if(data && data.length > 0) {
          this.todoList = data;
        } else if (data && data.length < 1) {
          this.todoList = [];
        }
        this.activeParams.types = [];
        this.router.navigate(['/'], {queryParams: this.activeParams});
      }, error: (error) => {
        console.error(error);
      }
    })
  }


  navigateToEditPage(todoId: number): void {
    this.router.navigate(['/edit', todoId], {queryParams: this.activeParams});
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
