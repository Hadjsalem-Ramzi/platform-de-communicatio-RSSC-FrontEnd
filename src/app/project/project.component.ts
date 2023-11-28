import {Component, OnInit} from '@angular/core';
import {Task} from "../model/Tache.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskService} from "../services/task.service";
import {PageEvent} from "@angular/material/paginator";
import {ProjectService} from "../services/project.service";
import {Project} from "../model/Project.model";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit{
  public projects: Project[] = [];
  errorMessage!: string;
  projectFormGroup!: FormGroup;
  editingProject: Project | null = null;
  showForm: boolean = false;
  pageSize: number = 5; //nombre d'éléments par page
  pageIndex: number = 0; // Index de la page actuelle
  displayedProjects: Project[] = [];
  searchText:string='';
  constructor(
    public projectService: ProjectService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.handleGetAllProjects();
    this.initProjectForm();
    this.editingProject = null;
  }

  filterProjects() {
    if (this.searchText.length >= 1) {
      const filteredProjects = this.projects.filter(project => project.name.toLowerCase().startsWith(this.searchText.toLowerCase()));
      if (filteredProjects.length > 5) {
        this.displayedProjects = filteredProjects.slice(0, 5);
      } else {
        this.displayedProjects = filteredProjects;
      }
    } else {
      this.displayedProjects = [];
    }
  }

  initProjectForm() {
    this.projectFormGroup = this.fb.group({
      name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      contenu: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
    });
  }

  handleGetAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.updateDisplayedProjects(); // Mettre à jour les tâches affichées après la récupération des données
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  updateDisplayedProjects() {
    const startIndex = this.pageSize * this.pageIndex;
    const endIndex = startIndex + this.pageSize;
    this.displayedProjects = this.projects.slice(startIndex, endIndex);
  }

  handleDeleteProject(t: Project) {
    let conf = confirm('Are you sure?');
    if (conf === false || t.id === undefined) return;

    this.projectService.deleteTask(t.id).subscribe({
      next: () => {
        console.log('Tâche supprimée avec succès');
        this.handleGetAllProjects();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  handleProjectAction() {
    if (this.editingProject) {
      this.updateProject();
    } else {
      this.addProject();
    }
  }

  addProject() {
    if (this.projectFormGroup.valid) {
      const newProject: Project = {
        name: this.projectFormGroup.value.name,
        contenu:this.projectFormGroup.value.contenu,
      };

      this.projectService.createProject(newProject).subscribe({
        next: () => {
          this.handleGetAllProjects();
          this.projectFormGroup.reset();
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  updateProject() {
    if (this.projectFormGroup.valid && this.editingProject) {
      const updatedProject: Project = {
        id: this.editingProject.id,
        name: this.projectFormGroup.value.name,
        contenu:this.projectFormGroup.value.contenu
      };

      this.projectService.updateProject(updatedProject).subscribe({
        next: () => {
          this.handleGetAllProjects();
          this.projectFormGroup.reset();
          this.editingProject = null;
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  editProject(project: Project) {
    this.editingProject = project;
    this.showForm = true;
    this.displayedProjects=[];
    this.projectFormGroup.patchValue({
      name: project.name,
      contenu:project.contenu
    });
  }

  cancelEdit() {
    this.editingProject = null;
    this.showForm = false;
    this.projectFormGroup.reset();
    this.handleGetAllProjects();
  }

  handleNewProject() {
    this.editingProject = null;
    this.showForm = true;
    this.displayedProjects = [];
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
    this.updateDisplayedProjects(); // Mettre à jour les tâches affichées lors du changement de page
  }


}
