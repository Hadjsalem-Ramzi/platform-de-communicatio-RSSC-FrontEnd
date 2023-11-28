import {Component, OnInit} from '@angular/core';
import {Project} from "../model/Project.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjectService} from "../services/project.service";
import {PageEvent} from "@angular/material/paginator";
import {File} from "../model/File.model";
import {FileService} from "../services/file.service";

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit{
  public files: File[] = [];
  errorMessage!: string;
  fileFormGroup!: FormGroup;
  editingFile: File | null = null;
  showForm: boolean = false;
  pageSize: number = 5; //nombre d'éléments par page
  pageIndex: number = 0; // Index de la page actuelle
  displayedFiles: File[] = [];
  searchText:string='';
  constructor(
    public fileService: FileService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.handleGetAllFiles();
    this.initFileForm();
    this.editingFile = null;
  }

  filterFiles() {
    if (this.searchText.length >= 1) {
      const filteredFiles = this.files.filter(file => file.name.toLowerCase().startsWith(this.searchText.toLowerCase()));
      if (filteredFiles.length > 5) {
        this.displayedFiles = filteredFiles.slice(0, 5);
      } else {
        this.displayedFiles = filteredFiles;
      }
    } else {
      this.displayedFiles = [];
    }
  }

  initFileForm() {
    this.fileFormGroup = this.fb.group({
      name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      contenu: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
    });
  }

  handleGetAllFiles() {
    this.fileService.getAllFiles().subscribe({
      next: (data: File[]) => {
        this.files = data;
        this.updateDisplayedFiles(); // Mettre à jour les tâches affichées après la récupération des données
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  updateDisplayedFiles() {
    const startIndex = this.pageSize * this.pageIndex;
    const endIndex = startIndex + this.pageSize;
    this.displayedFiles = this.files.slice(startIndex, endIndex);
  }

  handleDeleteFile(f: File) {
    let conf = confirm('Are you sure?');
    if (conf === false || f.id === undefined) return;

    this.fileService.deleteFile(f.id).subscribe({
      next: () => {
        console.log('Tâche supprimée avec succès');
        this.handleGetAllFiles();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  handleFileAction() {
    if (this.editingFile) {
      this.updateFile();
    } else {
      this.addFile();
    }
  }

  addFile() {
    if (this.fileFormGroup.valid) {
      const newFile: File = {
        name: this.fileFormGroup.value.name,
        contenu:this.fileFormGroup.value.contenu,
      };

      this.fileService.createFile(newFile).subscribe({
        next: () => {
          this.handleGetAllFiles();
          this.fileFormGroup.reset();
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  updateFile() {
    if (this.fileFormGroup.valid && this.editingFile) {
      const updatedFile: File = {
        id: this.editingFile.id,
        name: this.fileFormGroup.value.name,
        contenu:this.fileFormGroup.value.contenu
      };

      this.fileService.updateFile(updatedFile).subscribe({
        next: () => {
          this.handleGetAllFiles();
          this.fileFormGroup.reset();
          this.editingFile = null;
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  editFile(file: File) {
    this.editingFile = file;
    this.showForm = true;
    this.displayedFiles=[];
    this.fileFormGroup.patchValue({
      name: file.name,
      contenu:file.contenu
    });
  }

  cancelEdit() {
    this.editingFile = null;
    this.showForm = false;
    this.fileFormGroup.reset();
    this.handleGetAllFiles();
  }

  handleNewFile() {
    this.editingFile = null;
    this.showForm = true;
    this.displayedFiles = [];
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
    this.updateDisplayedFiles(); // Mettre à jour les tâches affichées lors du changement de page
  }


}
