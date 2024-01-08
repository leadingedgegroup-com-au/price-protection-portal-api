import { Controller, Get, Post, HttpCode, HttpStatus, Res, Body, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddUserDto, FilterUsers, UpdateProfileDto } from 'src/dtos';
import { Users } from 'src/entities';

@ApiBearerAuth()
@ApiTags('Users APIs')
@Controller({ path: 'user', version: '1.0' })
export class UsersController {

  constructor(private readonly UsersService: UsersService) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async LIST(@Res() response: Response, @Query() filter: FilterUsers) {
    let result: Users[] = await this.UsersService.LIST(filter);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Get('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a particular user.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async GET(@Param('ID', new ParseIntPipe()) ID: number, @Res() response: Response) {
    let result: Users = await this.UsersService.GET(ID);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Capture a new user.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async CREATE(@Res() response: Response, @Body() DTO: AddUserDto) {
    let result: Users = await this.UsersService.INSERT(DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Put('/:ID')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update an existing user.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async UPDATE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @Body() DTO: AddUserDto) {
    let result: Users = await this.UsersService.UPDATE(ID, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Put('/:ID/profile')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update profile of an existing user.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async PROFILE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @Body() DTO: UpdateProfileDto) {
    let result: Users = await this.UsersService.PROFILE(ID, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Delete('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive an existing user.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async DELETE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number) {
    let result: any = await this.UsersService.DELETE(ID);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

}
