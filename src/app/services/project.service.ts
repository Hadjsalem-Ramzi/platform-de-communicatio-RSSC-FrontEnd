import {Injectable, OnInit} from '@angular/core';
import {Project} from "../model/Project.model";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  public host: string = "http://localhost:8082/Project";

  constructor(public http: HttpClient) {}

  public getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.host}/findAll`);
  }

  public getProjectById(id: number): Observable<Project> {
    return  this.http.get<Project>(`${this.host}/findById/${id}`);
  }

  public getProjectByName(name: string): Observable<Project> {
    return this.http.get<Project>(`${this.host}/findByName/${name}`);
  }

  public createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.host}/save`, project);
  }

  public updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.host}/update/${project.id}`, project);
  }

  public deleteTask(id: number): Observable<void> {
    const url = `${this.host}/delete/${id}`;
    return this.http.delete<void>(url);
  }

}
