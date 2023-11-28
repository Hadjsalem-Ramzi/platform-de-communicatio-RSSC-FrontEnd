import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Message} from "../model/Message.model";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public host: string = "http://localhost:8082/Message";
  constructor(public  http:HttpClient) { }
  public getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.host}/findAll`);
  }

  public getMessageById(id: number): Observable<Message> {
    return  this.http.get<Message>(`${this.host}/findById/${id}`);
  }

  public getMessageByName(name: string): Observable<Message> {
    return this.http.get<Message>(`${this.host}/findByName/${name}`);
  }

  public createMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.host}/save`, message);
  }

  public updateMessage(message: Message): Observable<Message> {
    return this.http.put<Message>(`${this.host}/update/${message.id}`, message);
  }

  public deleteMessage(id: number): Observable<void> {
    const url = `${this.host}/delete/${id}`;
    return this.http.delete<void>(url);
  }

}

