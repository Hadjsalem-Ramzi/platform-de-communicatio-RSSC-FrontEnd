import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {PageEvent} from "@angular/material/paginator";
import {Message} from "../model/Message.model";
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit{
  public messages: Message[] = [];
  errorMessage!: string;
  messageFormGroup!: FormGroup;
  editingMessage: Message | null = null;
  showForm: boolean = false;
  pageSize: number = 5; //nombre d'éléments par page
  pageIndex: number = 0; // Index de la page actuelle
  displayedMessages: Message[] = [];
  searchText:string='';
  constructor(
    public messageService: MessageService,
    private fb: FormBuilder,
  ) {}
  ngOnInit(): void {
    this.handleGetAllMessages();
    this.initMessageForm();
    this.editingMessage = null;
  }

  filterMessages() {
    if (this.searchText.length >= 1) {
      const filteredMessages = this.messages.filter(message => message.contenu.toLowerCase().startsWith(this.searchText.toLowerCase()));
      if (filteredMessages.length > 5) {
        this.displayedMessages = filteredMessages.slice(0, 5);
      } else {
        this.displayedMessages = filteredMessages;
      }
    } else {
      this.displayedMessages = [];
    }
  }

  initMessageForm() {
    this.messageFormGroup = this.fb.group({
      contenu: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
    });
  }

  handleGetAllMessages() {
    this.messageService.getAllMessages().subscribe({
      next: (data: Message[]) => {
        this.messages = data;
        this.updateDisplayedMessages(); // Mettre à jour les tâches affichées après la récupération des données
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  updateDisplayedMessages() {
    const startIndex = this.pageSize * this.pageIndex;
    const endIndex = startIndex + this.pageSize;
    this.displayedMessages = this.messages.slice(startIndex, endIndex);
  }

  handleDeleteMessage(m: Message) {
    let conf = confirm('Are you sure?');
    if (conf === false || m.id === undefined) return;

    this.messageService.deleteMessage(m.id).subscribe({
      next: () => {
        this.handleGetAllMessages();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  handleMessageAction() {
    if (this.editingMessage) {
      this.updateMessage();
    } else {
      this.addMessage();
    }
  }

  addMessage() {
    if (this.messageFormGroup.valid) {
      const newMessage: Message = {
        contenu:this.messageFormGroup.value.contenu,
      };

      this.messageService.createMessage(newMessage).subscribe({
        next: () => {
          this.handleGetAllMessages();
          this.messageFormGroup.reset();
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  updateMessage() {
    if (this.messageFormGroup.valid && this.editingMessage) {
      const updatedMessage: Message = {
        id: this.editingMessage.id,
        contenu:this.messageFormGroup.value.contenu
      };

      this.messageService.updateMessage(updatedMessage).subscribe({
        next: () => {
          this.handleGetAllMessages();
          this.messageFormGroup.reset();
          this.editingMessage = null;
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  editMessage(message: Message) {
    this.editingMessage = message;
    this.showForm = true;
    this.displayedMessages=[];
    this.messageFormGroup.patchValue({
      contenu:message.contenu
    });
  }

  cancelEdit() {
    this.editingMessage = null;
    this.showForm = false;
    this.messageFormGroup.reset();
    this.handleGetAllMessages();
  }

  handleNewMessage() {
    this.editingMessage = null;
    this.showForm = true;
    this.displayedMessages = [];
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
    this.updateDisplayedMessages(); // Mettre à jour les tâches affichées lors du changement de page
  }


}
