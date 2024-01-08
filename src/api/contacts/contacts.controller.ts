import { Controller, Get, Post, HttpCode, HttpStatus, Res, Body, Param, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { } from 'src/dtos';
import { } from 'src/entities';

@Controller('contacts')
export class ContactsController {

  constructor(private readonly ContactsService: ContactsService) { }
}
