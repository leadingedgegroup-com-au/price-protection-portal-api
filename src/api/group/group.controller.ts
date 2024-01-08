import { Controller, Get, Post, HttpCode, HttpStatus, Res, Body, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddGroupDto, FilterGroups, UpdateGroupDto } from 'src/dtos';
import { Groups } from 'src/entities';

@ApiBearerAuth()
@ApiTags('Group APIs')
@Controller({ path: 'group', version: '1.0' })
export class GroupController {

  constructor(private readonly GroupService: GroupService) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all groups.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async LIST(@Res() response: Response, @Query() filter: FilterGroups) {
    let result: Groups[] = await this.GroupService.LIST(filter);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Get('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a particular group.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async GET(@Param('ID', new ParseIntPipe()) ID: number, @Res() response: Response) {
    let result: Groups = await this.GroupService.GET(ID);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Capture a new group.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async CREATE(@Res() response: Response, @Body() DTO: AddGroupDto) {
    let result: Groups = await this.GroupService.INSERT(DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Put('/:ID')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update an existing group.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async UPDATE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @Body() DTO: UpdateGroupDto) {
    let result: Groups = await this.GroupService.UPDATE(ID, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Delete('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive an existing group.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async DELETE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number) {
    let result: any = await this.GroupService.DELETE(ID);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

}
