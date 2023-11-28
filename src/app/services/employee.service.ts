import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Employee} from "../model/Employee.model";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  public host: string = "http://localhost:8082/Employee";

  constructor(public http: HttpClient) {}

  public getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.host}/findAll`);
  }

  public getEmployeeById(id: number): Observable<Employee> {
    return  this.http.get<Employee>(`${this.host}/findById/${id}`);
  }

  public getEmployeeByName(name: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.host}/findByName/${name}`);
  }

  public createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.host}/save`,employee );
  }

  public updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.host}/update/${employee.id}`, employee);
  }

  public deleteEmployee(id: number): Observable<void> {
    const url = `${this.host}/delete/${id}`;
    return this.http.delete<void>(url);
  }

}
