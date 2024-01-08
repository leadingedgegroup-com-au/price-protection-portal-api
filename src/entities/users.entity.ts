import Constants from 'src/app.constants';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany, } from 'typeorm';
import { ProgramAdmins, Programs } from './programs.entity';

@Entity(Constants.DB_SSP_USERS)
export class Users {

    @PrimaryGeneratedColumn() ID: number;

    @Column({ default: '', nullable: false })
    FirstName: string;

    @Column({ default: '', nullable: true })
    LastName?: string;

    @Column({ default: '', nullable: false })
    Email: string;

    @Column({ default: '', nullable: true })
    ContactNo?: string;

    @Column({ default: 'Australia', nullable: true })
    Suburb: string;

    @Column({ default: '', nullable: true })
    State?: string;

    @Column({ default: '', nullable: true })
    PostCode?: string;

    @Column({ default: '', nullable: false })
    Role: string;

    @Column({ default: '', nullable: true })
    NetSuiteEntityId?: string;

    @Column({ default: '', nullable: true })
    NetSuiteRole?: string;

    @Column({ select: false, default: '', nullable: true })
    Password: string;

    @Column({ default: false, nullable: false })
    DisableSso: boolean;

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

    //[ProgramAdmins >> Users collection]
    @OneToMany(() => ProgramAdmins, (entity) => entity.User)
    TaggedPrograms: ProgramAdmins[];

    //[Programs >> Users collection]
    @OneToMany(() => Programs, (entity) => entity.CreatedBy)
    MyPrograms: Programs[];
}


