import { Controller, Get, Post, HttpCode, HttpStatus, Res, Body, Param, ParseIntPipe, Put, Delete, Query, UseInterceptors, UploadedFiles, ParseFilePipe, MaxFileSizeValidator, UploadedFile } from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddProgramAttributesDto, AddProgramsDto, FilterPrograms } from 'src/dtos';
import { Programs } from 'src/entities';
import { CurrentUser, ICurrentUser } from 'src/helpers/current-user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/helpers/public.decorator';

@ApiBearerAuth()
@ApiTags('Programs APIs')
@Controller({ path: 'programs', version: '1.0' })
export class ProgramsController {

  constructor(private readonly ProgramsService: ProgramsService) { }

  /*==================================== Program Basic Details APIs =================================*/

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all programs.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async LIST(@Res() response: Response, @Query() filter: FilterPrograms) {
    let result: Programs[] = await this.ProgramsService.LIST(filter);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Get('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single program.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async GET(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number,) {
    let result: Programs = await this.ProgramsService.GET(ID);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Capture a new program.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async CREATE(@CurrentUser() CurrentUser: ICurrentUser, @Res() response: Response, @Body() DTO: AddProgramsDto) {
    let result: Programs = await this.ProgramsService.INSERT(CurrentUser, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Put('/:ID')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update an existing program.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async UPDATE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @Body() DTO: AddProgramsDto) {
    let result: Programs = await this.ProgramsService.UPDATE(ID, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Delete('/:ID')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive an existing program.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async DELETE(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number) {
    let result: any = await this.ProgramsService.DELETE(ID);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  /*==================================== Attributes APIs =================================*/

  @Get('/:ID/attributes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single program attributes.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async GET_ATTRIBUTES(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number,) {
    let result: any[] = await this.ProgramsService.GET_ATTRIBUTES(ID);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

  @Put('/:ID/attributes')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update an existing program attributes.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async UPDATE_ATTRIBUTES(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @Body() DTO: AddProgramAttributesDto) {
    let result: Programs = await this.ProgramsService.UPDATE_ATTRIBUTES(ID, DTO);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  /*==================================== Program Enable/Disable APIs =================================*/
  //Enable/Disable
  @Put('/:ID/status')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Update an existing program status.' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'successful operation', })
  async UPDATE_STATUS(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number) {
    let result: any = await this.ProgramsService.UPDATE_STATUS(ID);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  /*==================================== Program SKU Upload APIs =================================*/

  @Put('/:ID/upload-sku')
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Store file inside the aws s3 storage.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return file locations and details.', })
  async UPLOAD_SKU(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
      ],
    }),
  ) file: Express.Multer.File) {
    console.log('asili mun')
    let result = await this.ProgramsService.UPLOAD_SKU(ID, file);
    return response.status(HttpStatus.CREATED).json({ message: 'Success', data: result });
  }

  @Public()
  @Get('/:ID/extract-raw-sku')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single program raw SKUs.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'successful operation', })
  async GET_RAW_SKU(@Res() response: Response, @Param('ID', new ParseIntPipe()) ID: number,) {
    let result: any = await this.ProgramsService.GET_RAW_SKU(ID);
    return response.status(HttpStatus.OK).json({ message: 'Success.', data: result });
  }

}
