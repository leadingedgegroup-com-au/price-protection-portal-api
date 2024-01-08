import Constants from 'src/app.constants';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Programs } from './programs.entity';

@Entity(Constants.DB_SSP_SUPPLIERS)
export class Suppliers {

  @PrimaryGeneratedColumn() ID: number;

  @Column({ default: '', nullable: false })
  SupplierCode: string;

  @Column({ default: '', nullable: false })
  SupplierName: string;

  @Column({ default: '', nullable: true })
  Email: string;

  @Column({ default: '', nullable: true })
  Suburb: string;

  @Column({ default: '', nullable: true })
  State: string;

  @Column({ default: '', nullable: true })
  PostCode: string;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ default: false })
  IsDelete: boolean;

  @Column({ nullable: true })
  CreatedBy: number;

  @Column({ nullable: true })
  UpdatedBy: number;

  @CreateDateColumn({ nullable: true, })
  CreatedAt: Date;

  @UpdateDateColumn({ nullable: true, })
  UpdatedAt: Date;

  //[Suppliers >> Programs collection]
  @OneToMany(() => Programs, (entity) => entity.Suppliers)
  Programs: Programs[];
}