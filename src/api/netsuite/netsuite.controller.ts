import { Controller, Get, HttpCode, HttpStatus, Res, Query } from '@nestjs/common';
import { NetsuiteService } from './netsuite.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QPContacts, QPCustomers } from 'src/dtos';

@ApiBearerAuth()
@ApiTags('Netsuite APIs')
@Controller({ path: 'netsuite', version: '1.0' })
export class NetsuiteController {

  constructor(private readonly NetsuiteService: NetsuiteService) { }

  @Get('/verify-customer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify netsuite customer.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async VerifyCustomer(@Res() response: Response, @Query() query: QPCustomers) {
    let result: any = await this.NetsuiteService.VerifyCustomer(query);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Get('/verify-contact')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify netsuite customer contact.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async VerifyContact(@Res() response: Response, @Query() query: QPContacts) {
    let result: any = await this.NetsuiteService.VerifyContact(query);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }
}
