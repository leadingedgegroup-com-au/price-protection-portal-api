import { Controller, Get, Post, HttpCode, HttpStatus, Res, Body, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddBrandDto, UpdateBrandDto, FilterBrands } from 'src/dtos';
import { Brands } from 'src/entities';

@ApiBearerAuth()
@ApiTags('Brand APIs')
@Controller({ path: 'brand', version: '1.0' })
export class BrandController {

  constructor(private readonly BrandService: BrandService) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all brands.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async LIST(@Res() response: Response, @Query() filter: FilterBrands) {
    let result: Brands[] = await this.BrandService.LIST(filter);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Get('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a particular brand.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async GET(@Param('ID', new ParseIntPipe()) ID: number, @Res() response: Response) {
    let result: Brands = await this.BrandService.GET(ID);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Capture a new brand.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async CREATE(@Res() response: Response, @Body() DTO: AddBrandDto) {
    let result: Brands = await this.BrandService.INSERT(DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Put('/:ID')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update an existing brand.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async UPDATE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @Body() DTO: UpdateBrandDto) {
    let result: Brands = await this.BrandService.UPDATE(ID, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Delete('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive an existing brand.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async DELETE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number) {
    let result: any = await this.BrandService.DELETE(ID);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

}
