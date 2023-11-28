import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Employee} from "../model/Employee.model";
import {EmployeeService} from "../services/employee.service";

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit{
  public employees: Employee[] = [];
  errorMessage!: string;
  employeeFormGroup!: FormGroup;
  editingEmployee: Employee | null = null;
  showForm: boolean = false;
  pageSize: number = 5; //nombre d'éléments par page
  pageIndex: number = 0; // Index de la page actuelle
  displayedEmployees: Employee[] = [];
  searchText:string='';
  constructor(
    public employeeService: EmployeeService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.handleGetAllEmployees();
    this.initEmployeeForm();
    this.editingEmployee = null;
  }

  filterEmployee() {
    if (this.searchText.length >= 1) {
      const filteredEmployees = this.employees.filter(employee => employee.name.toLowerCase().startsWith(this.searchText.toLowerCase()));
      if (filteredEmployees.length > 5) {
        this.displayedEmployees = filteredEmployees.slice(0, 5);
      } else {
        this.displayedEmployees = filteredEmployees;
      }
    } else {
      this.displayedEmployees = [];
    }
  }

  initEmployeeForm() {
    this.employeeFormGroup = this.fb.group({
      name: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      adresse: this.fb.control(null, [Validators.required, Validators.minLength(4)]),
      telephone: this.fb.control(null, [Validators.required, Validators.minLength(4)]),

    });
  }

  handleGetAllEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.updateDisplayedEmployees(); // Mettre à jour les tâches affichées après la récupération des données
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  updateDisplayedEmployees() {
    const startIndex = this.pageSize * this.pageIndex;
    const endIndex = startIndex + this.pageSize;
    this.displayedEmployees = this.employees.slice(startIndex, endIndex);
  }

  handleDeleteEmployee(e: Employee) {
    let conf = confirm('Are you sure?');
    if (conf === false || e.id === undefined) return;

    this.employeeService.deleteEmployee(e.id).subscribe({
      next: () => {
        this.handleGetAllEmployees();
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

  handleEmployeeAction() {
    if (this.editingEmployee) {
      this.updateEmployee();
    } else {
      this.addEmployee();
    }
  }

  addEmployee() {
    if (this.employeeFormGroup.valid) {
      const newEmployee: Employee = {
        name: this.employeeFormGroup.value.name,
        adresse:this.employeeFormGroup.value.adresse,
        telephone:this.employeeFormGroup.value.telephone,
      };

      this.employeeService.createEmployee(newEmployee).subscribe({
        next: () => {
          this.handleGetAllEmployees();
          this.employeeFormGroup.reset();
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  updateEmployee() {
    if (this.employeeFormGroup.valid && this.editingEmployee) {
      const updatedEmployee: Employee = {
        id: this.editingEmployee.id,
        name: this.employeeFormGroup.value.name,
        adresse:this.employeeFormGroup.value.adresse,
        telephone:this.employeeFormGroup.value.telephone
      };

      this.employeeService.updateEmployee(updatedEmployee).subscribe({
        next: () => {
          this.handleGetAllEmployees();
          this.employeeFormGroup.reset();
          this.editingEmployee = null;
          this.showForm = false;
        },
        error: (err) => {
          this.errorMessage = err;
        }
      });
    }
  }

  editEmployee(employee: Employee) {
    this.editingEmployee = employee;
    this.showForm = true;
    this.displayedEmployees=[];
    this.employeeFormGroup.patchValue({
      name: employee.name,
      adresse:employee.adresse,
      telephone:employee.telephone
    });
  }

  cancelEdit() {
    this.editingEmployee = null;
    this.showForm = false;
    this.employeeFormGroup.reset();
    this.handleGetAllEmployees();
  }

  handleNewEmployee() {
    this.editingEmployee = null;
    this.showForm = true;
    this.displayedEmployees = [];
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
    this.updateDisplayedEmployees(); // Mettre à jour les tâches affichées lors du changement de page
  }


}
