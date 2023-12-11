import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToDoService} from "../../shared/services/to-do.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TodoType} from "../../../types/todo.type";
import {Subscription, switchMap, tap} from "rxjs";
import {ActiveParamsType} from "../../../types/active-params.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit, OnDestroy {
  constructor(private toDoService: ToDoService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar) {
  }

  todo: TodoType | undefined = {
    name: '',
    id: 0,
    isCompleted: false
  };
  subscription: Subscription | null = null;
  text: string = '';
  activeParams: ActiveParamsType = {types: []}

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.toDoService.getTodoListFromLocalStorage()
          .subscribe({
              next: (data: TodoType[] | null) => {
                if (data && data.length > 0) {
                  const editItem = data.find((item: TodoType) => item.id == (params['id']))
                  if (editItem) {
                    this.todo = editItem
                    this.text = editItem.name
                  }
                } else {
                  console.log('task not found');
                }
              }, error: (error) => {
                console.log(error)
              }
            });
      } else {
        console.log('no id parameter');
      }
    })
  }

  editTask():void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['types'] && params['types'].length > 0) {
        this.activeParams.types = params['types'];
      }
    })
    if (this.todo && this.todo.id && this.text && this.todo.name) {
      const newTodo: TodoType = {
        id: this.todo.id,
        name: this.text,
        isCompleted: this.todo.isCompleted
      }
      this.toDoService.editTodo(newTodo).pipe(
        switchMap(() => this.toDoService.getTodoListFromLocalStorage()),
      ).subscribe(
        () => {},
        (error) => {
          console.error(error);
          this._snackBar.open('Error editing todo')
        }
      );
      this.router.navigate(['/'], {queryParams: this.activeParams});
    }
  }

  change(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
  }

}
