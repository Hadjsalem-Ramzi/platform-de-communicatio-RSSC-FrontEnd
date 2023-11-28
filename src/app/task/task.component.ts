import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../model/Tache.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  public tasks: Task[] = [];
  errorMessage!: string;
  taskFormGroup!: FormGroup;
  editingTask: Task | null = null;
  showForm: boolean = false;
  pageSize: number = 5; //nombre d'éléments par page
  pageIndex: number = 0; // Index de la page actuelle
  displayedTasks: Task[] = [];
  searchText:string='';
  constructor(
    public taskService: TaskService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.handleGetAllTasks();
    this.initTaskForm();
    this.editingTask = null;
  }

  filterTasks() {
    if (this.searchText.length >= 1) {
      const filteredTasks = this.tasks.filter(task => task.name.toLowerCase().startsWith(this.searchText.toLowerCase()));
      if (filteredTasks.length > 5) {
        this.displayedTasks = filteredTasks.slice(0, 5);
      } else {
        this.displayedTasks = filteredTasks;
      }
    } else {
      this.displayedTasks = [];
    }
  }

  initTaskForm() {
    this.taskFormGroup = this.fb.group({
      name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      contenu: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
    });
  }

  handleGetAllTasks() {
    this.taskService.getAllTasks().subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.updateDisplayedTasks(); // Mettre à jour les tâches affichées après la récupération des données
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  updateDisplayedTasks() {
    const startIndex = this.pageSize * this.pageIndex;
    const endIndex = startIndex + this.pageSize;
    this.displayedTasks = this.tasks.slice(startIndex, endIndex);
  }

  handleDeleteTache(t: Task) {
    let conf = confirm('Are you sure?');
    if (conf === false || t.id === undefined) return;

    this.taskService.deleteTask(t.id).subscribe({
      next: () => {
        console.log('Tâche supprimée avec succès');
        this.handleGetAllTasks();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  handleTaskAction() {
    if (this.editingTask) {
      this.updateTask();
    } else {
      this.addTask();
    }
  }

  addTask() {
    if (this.taskFormGroup.valid) {
      const newTask: Task = {
        name: this.taskFormGroup.value.name,
        contenu:this.taskFormGroup.value.contenu,
      };

      this.taskService.createTask(newTask).subscribe({
        next: () => {
          this.handleGetAllTasks();
          this.taskFormGroup.reset();
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  updateTask() {
    if (this.taskFormGroup.valid && this.editingTask) {
      const updatedTask: Task = {
        id: this.editingTask.id,
        name: this.taskFormGroup.value.name,
        contenu:this.taskFormGroup.value.contenu
      };

      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          this.handleGetAllTasks();
          this.taskFormGroup.reset();
          this.editingTask = null;
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.showForm = true;
    this.displayedTasks=[];
    this.taskFormGroup.patchValue({
      name: task.name,
      contenu:task.contenu
    });
  }

  cancelEdit() {
    this.editingTask = null;
    this.showForm = false;
    this.taskFormGroup.reset();
    this.handleGetAllTasks();
  }

  handleNewTask() {
    this.editingTask = null;
    this.showForm = true;
    this.displayedTasks = [];
  }

  getErrorMessage(fieldname: string, error: any) {
    if (error['required']) {
      return fieldname + ' is Required';
    } else if (error['minlength']) {
      return fieldname + ' should have at least ' + error['minlength']['requiredLength'] + ' Characters';
    } else if (error['minlength']) {
      return fieldname + ' should have at least ' + error['minlength']['requiredLength'] + ' Characters';}
    else return '';
  }

  handlePageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedTasks(); // Mettre à jour les tâches affichées lors du changement de page
  }


}
