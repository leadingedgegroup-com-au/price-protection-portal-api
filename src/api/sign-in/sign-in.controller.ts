import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { SignInService } from './sign-in.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/helpers/public.decorator';
import { SignInDto } from 'src/dtos';
import { Request, Response } from 'express';

@ApiTags('Authentication APIs')
@Controller({ path: 'auth', version: '1.0' })
export class SignInController {

  constructor(private readonly SignInService: SignInService) { }

  @Post('/sign-in')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign-In.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return Tokens', })
  async signin(@Req() request: Request, @Res() response: Response, @Body() Dto: SignInDto) {
    let result: any = await this.SignInService.signin(Dto, request);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

}
