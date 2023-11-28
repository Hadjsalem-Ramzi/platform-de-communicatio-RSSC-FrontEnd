import {Component, OnInit} from '@angular/core';
import {Forum} from "../model/Forum.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ForumService} from "../services/forum.service";
import {PageEvent} from "@angular/material/paginator";
import {ChatRoom} from "../model/ChatRoom.model";
import {ChatRoomService} from "../services/chat-room.service";

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit{
  public chatRooms: ChatRoom[] = [];
  errorMessage!: string;
  chatRoomFormGroup!: FormGroup;
  editingChatRoom: ChatRoom | null = null;
  showForm: boolean = false;
  pageSize: number = 5; //nombre d'éléments par page
  pageIndex: number = 0; // Index de la page actuelle
  displayedChatRooms: ChatRoom[] = [];
  searchText:string='';
  constructor(
    public chatRoomService: ChatRoomService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.handleGetAllChatRooms();
    this.initChatRoomForm();
    this.editingChatRoom = null;
  }

  filterChatRooms() {
    if (this.searchText.length >= 1) {
      const filteredChatRooms = this.chatRooms.filter(forum => forum.name.toLowerCase().startsWith(this.searchText.toLowerCase()));
      if (filteredChatRooms.length > 5) {
        this.displayedChatRooms = filteredChatRooms.slice(0, 5);
      } else {
        this.displayedChatRooms = filteredChatRooms;
      }
    } else {
      this.displayedChatRooms = [];
    }
  }

  initChatRoomForm() {
    this.chatRoomFormGroup = this.fb.group({
      name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
    });
  }

  handleGetAllChatRooms() {
    this.chatRoomService.getAllChatRooms().subscribe({
      next: (data: ChatRoom[]) => {
        this.chatRooms = data;
        this.updateDisplayedChatRooms(); // Mettre à jour les tâches affichées après la récupération des données
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  updateDisplayedChatRooms() {
    const startIndex = this.pageSize * this.pageIndex;
    const endIndex = startIndex + this.pageSize;
    this.displayedChatRooms= this.chatRooms.slice(startIndex, endIndex);
  }

  handleDeleteChatRoom(t: Forum) {
    let conf = confirm('Are you sure?');
    if (conf === false || t.id === undefined) return;

    this.chatRoomService.deleteChatRoom(t.id).subscribe({
      next: () => {
        this.handleGetAllChatRooms();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  handleChatRoomAction() {
    if (this.editingChatRoom) {
      this.updateChatRoom();
    } else {
      this.addChatRoom();
    }
  }

  addChatRoom() {
    if (this.chatRoomFormGroup.valid) {
      const newChatRoom: ChatRoom = {
        name: this.chatRoomFormGroup.value.name,
      };

      this.chatRoomService.createChatRoom(newChatRoom).subscribe({
        next: () => {
          this.handleGetAllChatRooms();
          this.chatRoomFormGroup.reset();
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  updateChatRoom() {
    if (this.chatRoomFormGroup.valid && this.editingChatRoom) {
      const updatedChatRoom: ChatRoom = {
        id: this.editingChatRoom.id,
        name: this.chatRoomFormGroup.value.name,
      };

      this.chatRoomService.updateChatRoom(updatedChatRoom).subscribe({
        next: () => {
          this.handleGetAllChatRooms();
          this.chatRoomFormGroup.reset();
          this.editingChatRoom = null;
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  editChatRoom(chatroom: ChatRoom) {
    this.editingChatRoom = chatroom;
    this.showForm = true;
    this.displayedChatRooms=[];
    this.chatRoomFormGroup.patchValue({
      name: chatroom.name,
    });
  }

  cancelEdit() {
    this.editingChatRoom = null;
    this.showForm = false;
    this.chatRoomFormGroup.reset();
    this.handleGetAllChatRooms();
  }

  handleNewChatRoom() {
    this.editingChatRoom = null;
    this.showForm = true;
    this.displayedChatRooms = [];
  }

  getErrorMessage(fieldname: string, error: any) {
    if (error['required']) {
      return fieldname + ' is Required';
    } else if (error['minlength']) {
      return fieldname + ' should have at least ' + error['minlength']['requiredLength'] + ' Characters';
    }
    else return '';
  }

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedChatRooms(); // Mettre à jour les tâches affichées lors du changement de page
  }

}
