import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Task } from "../model/Tache.model";

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public host: string = "http://localhost:8082/Tache";

  constructor(public http: HttpClient) {}

  public getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.host}/findAll`);
  }

  public getTaskById(id: number): Observable<Task> {
    return  this.http.get<Task>(`${this.host}/findById/${id}`);
  }

  public getTaskByName(name: string): Observable<Task> {
    return this.http.get<Task>(`${this.host}/findByName/${name}`);
  }

  public createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.host}/save`, task);
  }

  public updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.host}/update/${task.id}`, task);
  }

  public deleteTask(id: number): Observable<void> {
    const url = `${this.host}/delete/${id}`;
    return this.http.delete<void>(url);
  }

}
