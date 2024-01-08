import { Controller, Get, Post, HttpCode, HttpStatus, Res, Body, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddSupplierDto, FilterSuppliers, UpdateSupplierDto } from 'src/dtos';
import { Suppliers } from 'src/entities';

@ApiBearerAuth()
@ApiTags('Supplier APIs')
@Controller({ path: 'supplier', version: '1.0' })
export class SupplierController {

  constructor(private readonly SupplierService: SupplierService) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all suppliers.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async LIST(@Res() response: Response, @Query() filter: FilterSuppliers) {
    let result: Suppliers[] = await this.SupplierService.LIST(filter);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Get('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a particular supplier.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async GET(@Param('ID', new ParseIntPipe()) ID: number, @Res() response: Response) {
    let result: Suppliers = await this.SupplierService.GET(ID);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Capture a new supplier.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async CREATE(@Res() response: Response, @Body() DTO: AddSupplierDto) {
    let result: Suppliers = await this.SupplierService.INSERT(DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Put('/:ID')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update an existing supplier.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async UPDATE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @Body() DTO: UpdateSupplierDto) {
    let result: Suppliers = await this.SupplierService.UPDATE(ID, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Delete('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive an existing supplier.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async DELETE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number) {
    let result: any = await this.SupplierService.DELETE(ID);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

}
