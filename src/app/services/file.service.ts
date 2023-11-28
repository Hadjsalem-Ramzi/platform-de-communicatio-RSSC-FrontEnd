import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {File} from "../model/File.model";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  public host: string = "http://localhost:8082/Fichier";

  constructor(public http: HttpClient) {}

  public getAllFiles(): Observable<File[]> {
    return this.http.get<File[]>(`${this.host}/findAll`);
  }

  public getFileById(id: number): Observable<File> {
    return  this.http.get<File>(`${this.host}/findById/${id}`);
  }

  public getFileByName(name: string): Observable<File> {
    return this.http.get<File>(`${this.host}/findByName/${name}`);
  }

  public createFile(file: File): Observable<File> {
    return this.http.post<File>(`${this.host}/save`, file);
  }

  public updateFile(file: File): Observable<File> {
    return this.http.put<File>(`${this.host}/update/${file.id}`, file);
  }

  public deleteFile(id: number): Observable<void> {
    const url = `${this.host}/delete/${id}`;
    return this.http.delete<void>(url);
  }

}
