import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeSearchDto } from './employeeSearch.dto';
import { employeeUpdateDto } from './employeeUpdate.dto';
import { EmployeeCreateDto } from './employeeCreate.dto';
import { Employee } from './employee.model';
import { EmployeeTierValidationPipe } from '../employee-tier-validation.pipe';

@Controller('employees')
export class EmployeesController {
  constructor(private employeeService: EmployeesService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getAllEmployees(@Query() param: EmployeeSearchDto) {
    if (Object.keys(param).length) {
      // console.log('filer');
      // console.log(param);
      return this.employeeService.employeeSearch(param);
    } else {
      console.log('no filter');
      return this.employeeService.getAllEmployees();
    }
    //todo: implement
    return this.employeeService.getAllEmployees();
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UsePipes(new EmployeeTierValidationPipe())
  createEmployee(@Body() employeeCreateDto: EmployeeCreateDto): Employee {
    return this.employeeService.createEmployee(employeeCreateDto);
  }

  @Get('/:id')
  getEmployeeById(@Param('id') id: string) {
    return this.employeeService.getEmployeeById(id);
  }

  @Put('/:id/city')
  updateEmployee(
    @Param('id') id: string,
    @Body() employeeUpdateDTO: employeeUpdateDto,
  ) {
    employeeUpdateDTO.id = id;
    return this.employeeService.updateEmployee(employeeUpdateDTO);
  }

  @Delete('/:id')
  @HttpCode(204)
  deleteEmployee(@Param('id') id: string) {
    if (!this.employeeService.deleteEmployee(id)) {
      throw new NotFoundException('Employee does not exist');
    }
  }
}
