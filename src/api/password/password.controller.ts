import { Body, Controller, Get, HttpCode, HttpStatus, Put, Query, Req, Res } from '@nestjs/common';
import { PasswordService } from './password.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/helpers/public.decorator';
import { ChangePassword, ForgotPassword, ResetPassword } from 'src/dtos';
import { Request, Response } from 'express';
import { Users } from 'src/entities';

@ApiTags('Password APIs')
@Controller({ path: 'password', version: '1.0' })
export class PasswordController {
  constructor(private readonly PasswordService: PasswordService) { }

  @Public()
  @Get('/forgot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email address of the user.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return a link to update the password via email.', })
  async forgot(@Req() request: Request, @Res() response: Response, @Query() query: ForgotPassword) {
    let result: any = await this.PasswordService.forgot(request, query);
    return response.status(HttpStatus.OK).json({ message: 'Success', data: result });
  }

  @Public()
  @Get('/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset your password.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return a link to update the password via email.', })
  async reset(@Res() response: Response, @Query() query: ResetPassword) {
    console.log(query)
    let result: any = await this.PasswordService.reset(query);
    return response.status(HttpStatus.OK).json({ message: 'Success', data: result });
  }

  @Put('/change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Password changed successfully.' })
  async ChangePassword(@Res() response: Response, @Body() dto: ChangePassword) {
    let result: any = await this.PasswordService.ChangePassword(dto);
    return response.status(HttpStatus.OK).json({ message: 'Success', data: result });
  }
}
