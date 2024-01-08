import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Instance Health Status APIs')
@Controller({ path: '', version: '1.0' })
export class AppController {

  constructor() { }

  @Get('/health-check')
  async health(): Promise<any> {
    return "OK";
  }
}
