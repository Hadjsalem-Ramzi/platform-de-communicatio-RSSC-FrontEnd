import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ChatRoom} from "../model/ChatRoom.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  public host: string = "http://localhost:8082/ChatRoom";
  constructor(public  http:HttpClient) { }
  public getAllChatRooms(): Observable<ChatRoom[]> {
    return this.http.get<ChatRoom[]>(`${this.host}/findAll`);
  }

  public getChatRoomById(id: number): Observable<ChatRoom> {
    return  this.http.get<ChatRoom>(`${this.host}/findById/${id}`);
  }

  public getChatRoomByName(name: string): Observable<ChatRoom> {
    return this.http.get<ChatRoom>(`${this.host}/findByName/${name}`);
  }

  public createChatRoom(chatRoom: ChatRoom): Observable<ChatRoom> {
    return this.http.post<ChatRoom>(`${this.host}/save`, chatRoom);
  }

  public updateChatRoom(chatroom: ChatRoom): Observable<ChatRoom> {
    return this.http.put<ChatRoom>(`${this.host}/update/${chatroom.id}`, chatroom);
  }

  public deleteChatRoom(id: number): Observable<void> {
    const url = `${this.host}/delete/${id}`;
    return this.http.delete<void>(url);
  }

}

