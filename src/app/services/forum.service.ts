import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Forum} from "../model/Forum.model";

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  public host: string = "http://localhost:8082/Forum";
  constructor(public  http:HttpClient) { }
  public getAllForums(): Observable<Forum[]> {
    return this.http.get<Forum[]>(`${this.host}/findAll`);
  }

  public getForumById(id: number): Observable<Forum> {
    return  this.http.get<Forum>(`${this.host}/findById/${id}`);
  }

  public getForumByName(name: string): Observable<Forum> {
    return this.http.get<Forum>(`${this.host}/findByName/${name}`);
  }

  public createForum(forum: Forum): Observable<Forum> {
    return this.http.post<Forum>(`${this.host}/save`, forum);
  }

  public updateForum(forum: Forum): Observable<Forum> {
    return this.http.put<Forum>(`${this.host}/update/${forum.id}`, forum);
  }

  public deleteForum(id: number): Observable<void> {
    const url = `${this.host}/delete/${id}`;
    return this.http.delete<void>(url);
  }

}

