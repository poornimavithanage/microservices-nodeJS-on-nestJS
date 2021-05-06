import {
  Body,
  Get,
  Injectable,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Employee, EmployeeStatus, EmployeeTier } from './employee.model';
import { v1 as uuid } from 'uuid';
import { EmployeeSearchDto } from './employeeSearch.dto';
import { employeeUpdateDto } from './employeeUpdate.dto';
import { EmployeeCreateDto } from './employeeCreate.dto';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
@Injectable()
export class EmployeesService {
  private employees: Employee[] = [];

  getAllEmployees() {
    return this.employees;
  }

  employeeSearch(employeeSearchDTO: EmployeeSearchDto) {
    console.log(employeeSearchDTO);
    const { status, name } = employeeSearchDTO;
    let employees = this.getAllEmployees();
    if (status) {
      employees = employees.filter((employee) => employee.status === status);
      console.log(employees);
    }
    if (name) {
      employees = employees.filter(
        (employee) =>
          employee.firstName.includes(name) || employee.lastName.includes(name),
      );
      // console.log(employees);
    }
    return employees;
  }

  getEmployeeById(id: string): Employee {
    const employees = this.getAllEmployees();
    const employee = employees.find((employee) => employee.id === id);
    if (!employee) {
      throw new NotFoundException(`${id} is not exist`);
    }
    return employee;
  }

  updateEmployee(employeeUpdateDto: employeeUpdateDto): Employee {
    const { id, city } = employeeUpdateDto;
    const employee = this.getEmployeeById(id);
    employee.nearestCity = city;
    return employee;
  }

  deleteEmployee(id: string): boolean {
    const employees = this.getAllEmployees();
    this.employees = employees.filter((employee) => employee.id != id);
    return employees.length != this.employees.length;
  }

  createEmployee(employeeCreateDto: EmployeeCreateDto): Employee {
    const {
      firstName,
      lastName,
      designation,
      nearestCity,
      tier,
    } = employeeCreateDto;
    const employee = {
      id: uuid(),
      firstName,
      lastName,
      designation,
      nearestCity,
      tier,
      status: EmployeeStatus.ACTIVE,
    };
    this.employees.push(employee);
    return employee;
  }
}
