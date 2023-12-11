import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./shared/layout/layout.component";
import {MainComponent} from "./views/main/main.component";
import {EditTaskComponent} from "./views/edit-task/edit-task.component";

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {path: '', component: MainComponent},
      {path: 'edit/:id', component: EditTaskComponent}]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
