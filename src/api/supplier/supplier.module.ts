import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suppliers } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Suppliers])],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule { }
