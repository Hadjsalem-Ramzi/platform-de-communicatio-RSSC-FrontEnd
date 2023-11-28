import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Forum} from "../model/Forum.model";
import {ForumService} from "../services/forum.service";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit{
  public forums: Forum[] = [];
  errorMessage!: string;
  forumFormGroup!: FormGroup;
  editingForum: Forum | null = null;
  showForm: boolean = false;
  pageSize: number = 5; //nombre d'éléments par page
  pageIndex: number = 0; // Index de la page actuelle
  displayedForums: Forum[] = [];
  searchText:string='';
  constructor(
    public forumService: ForumService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.handleGetAllForums();
    this.initForumForm();
    this.editingForum = null;
  }

  filterForums() {
    if (this.searchText.length >= 1) {
      const filteredForums = this.forums.filter(forum => forum.name.toLowerCase().startsWith(this.searchText.toLowerCase()));
      if (filteredForums.length > 5) {
        this.displayedForums = filteredForums.slice(0, 5);
      } else {
        this.displayedForums = filteredForums;
      }
    } else {
      this.displayedForums = [];
    }
  }

  initForumForm() {
    this.forumFormGroup = this.fb.group({
      name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
    });
  }

  handleGetAllForums() {
    this.forumService.getAllForums().subscribe({
      next: (data: Forum[]) => {
        this.forums = data;
        this.updateDisplayedForums(); // Mettre à jour les tâches affichées après la récupération des données
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  updateDisplayedForums() {
    const startIndex = this.pageSize * this.pageIndex;
    const endIndex = startIndex + this.pageSize;
    this.displayedForums = this.forums.slice(startIndex, endIndex);
  }

  handleDeleteForum(t: Forum) {
    let conf = confirm('Are you sure?');
    if (conf === false || t.id === undefined) return;

    this.forumService.deleteForum(t.id).subscribe({
      next: () => {
        this.handleGetAllForums();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  handleForumAction() {
    if (this.editingForum) {
      this.updateForum();
    } else {
      this.addForum();
    }
  }

  addForum() {
    if (this.forumFormGroup.valid) {
      const newForum: Forum = {
        name: this.forumFormGroup.value.name,
      };

      this.forumService.createForum(newForum).subscribe({
        next: () => {
          this.handleGetAllForums();
          this.forumFormGroup.reset();
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  updateForum() {
    if (this.forumFormGroup.valid && this.editingForum) {
      const updatedForum: Forum = {
        id: this.editingForum.id,
        name: this.forumFormGroup.value.name,
      };

      this.forumService.updateForum(updatedForum).subscribe({
        next: () => {
          this.handleGetAllForums();
          this.forumFormGroup.reset();
          this.editingForum = null;
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  editForum(forum: Forum) {
    this.editingForum = forum;
    this.showForm = true;
    this.displayedForums=[];
    this.forumFormGroup.patchValue({
      name: forum.name,
    });
  }

  cancelEdit() {
    this.editingForum = null;
    this.showForm = false;
    this.forumFormGroup.reset();
    this.handleGetAllForums();
  }

  handleNewForum() {
    this.editingForum = null;
    this.showForm = true;
    this.displayedForums = [];
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
    this.updateDisplayedForums(); // Mettre à jour les tâches affichées lors du changement de page
  }

}
