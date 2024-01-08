import Constants from 'src/app.constants';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany, } from 'typeorm';
import { Customers } from './customers.entity';
import { ProgramGroups, Programs } from './programs.entity';

@Entity(Constants.DB_SSP_GROUPS)
export class Groups {

  @PrimaryGeneratedColumn() ID: number;

  @Column({ default: '', nullable: false })
  Group: string;

  @Column({ default: '', nullable: false })
  SortCode: string;

  @Column({ default: '', nullable: true })
  Description: string;

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

  //[Group >> Customers collection]
  @OneToMany(() => Customers, (entity) => entity.Group)
  Customers: Customers[];

  //[ProgramGroups >> Users collection]
  @OneToMany(() => ProgramGroups, (entity) => entity.Group)
  TaggedPrograms: ProgramGroups[];
}