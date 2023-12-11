import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ToDoService} from "../../services/to-do.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TodoType} from "../../../../types/todo.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  constructor(private toDoService: ToDoService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private _snackBar: MatSnackBar) {
  }

  subscription: Subscription | null = null;
  todoList: TodoType[] = [];
  text: string = '';
  filterOptions: string[] = [];
  sortingOpen = false;
  sortingOptions: string[] = [];
  activeParams: ActiveParamsType = {types: []};

  @HostListener('document:click', ['$event'])
  click(event: MouseEvent) {
    if (this.sortingOpen && event.target instanceof HTMLElement && event.target.className.indexOf('filter') === -1) {
      this.sortingOpen = false;
    }
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params['types']) {
        this.activeParams.types = Array.isArray(params['types']) ? params['types'] : [params['types']];
      }
    })
  }

  filter() {
    this.toDoService.getFilterItems()
      .subscribe({
        next: (items: string[] | null) => {
          if (items && items.length > 0) {
            this.sortingOptions = items;
          } else {
            this.sortingOptions = [];
            this._snackBar.open('Для сортировки задач добавляйте в них хештеги')
          }
        },
        error: (error) => {
          console.log(error)
        }
      });
  }


  updateFilterParam(url: string, checked: boolean) {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
        this.activeParams.types = [...this.activeParams.types, url]
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }
    this.router.navigate(['/'], {
      queryParams: this.activeParams
    });
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  removeFilters() {
    this.sortingOpen = false;
    this.activeParams.types = [];
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}

