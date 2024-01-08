import Constants from 'src/app.constants';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany, } from 'typeorm';
import { Programs } from './programs.entity';

@Entity(Constants.DB_SSP_BRANDS)
export class Brands {

    @PrimaryGeneratedColumn() ID: number;

    @Column({ default: '', nullable: false })
    Brand: string;

    @Column({ default: '', nullable: true })
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

    //[Brands >> Programs collection]
    @OneToMany(() => Programs, (entity) => entity.Brands)
    Programs: Programs[];
}