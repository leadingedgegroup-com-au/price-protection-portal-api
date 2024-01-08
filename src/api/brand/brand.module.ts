import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brands } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Brands])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule { }
