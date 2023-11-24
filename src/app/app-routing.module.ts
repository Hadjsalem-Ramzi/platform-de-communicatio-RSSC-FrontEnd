import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskComponent} from "./task/task.component";
import {ProjectComponent} from "./project/project.component";


const routes: Routes = [
  {path:"task",component:TaskComponent},
  {path:"project",component:ProjectComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
