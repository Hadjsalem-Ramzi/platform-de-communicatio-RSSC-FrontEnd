import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TaskComponent} from "./task/task.component";
import {EmployeeComponent} from "./employee/employee.component";
import {MessageComponent} from "./message/message.component";
import {ForumComponent} from "./forum/forum.component";
import {FileComponent} from "./file/file.component";
import {ChatRoomComponent} from "./chat-room/chat-room.component";
import {ProjectComponent} from "./project/project.component";


const routes: Routes = [

  {path:"task",component:TaskComponent},
  {path:"employee",component:EmployeeComponent},
  {path:"message",component:MessageComponent},
  {path:"forum",component:ForumComponent},
  {path:"file",component:FileComponent},
  {path:"chatroom",component:ChatRoomComponent},
  {path:"project",component:ProjectComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
