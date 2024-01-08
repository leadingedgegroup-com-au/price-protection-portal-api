import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import Constants from 'src/app.constants';
import { Suppliers } from './suppliers.entity';
import { Brands } from './brands.entity';
import { Users } from './users.entity';
import { Groups } from './groups.entity';

@Entity(Constants.DB_SSP_PROGRAMS)
export class Programs {

    @PrimaryGeneratedColumn() ID: number;

    @Column({ default: '', nullable: false })
    Code: string;

    @Column({ default: '', nullable: false })
    Title: string;

    @Column({ default: '', nullable: false })
    Frequency: string;

    @Column({ default: '', nullable: false })
    Weekday: string;

    @Column({ type: 'datetime', default: '', nullable: false })
    StartDate: Date;

    @Column({ type: 'datetime', default: '', nullable: false })
    EndDate: Date;

    @Column({ type: 'datetime', default: '', nullable: true })
    ClaimDate: Date;

    @Column({ default: true, nullable: false })
    AllowDuplicateEntry: boolean;

    @Column({ default: true, nullable: false })
    AllowPreviousWeekRecord: boolean;

    @Column({ default: true, nullable: false })
    AllowReminderEmail: boolean;

    @ManyToOne(() => Brands, (entity) => entity.Programs, { nullable: false })
    @JoinColumn({ name: 'BrandId' })
    Brands: Brands;

    @ManyToOne(() => Suppliers, (entity) => entity.Programs, { nullable: false })
    @JoinColumn({ name: 'SupplierId' })
    Suppliers: Suppliers;

    @Column({ default: '', nullable: true })
    Attachment: string;

    @Column({ default: 'Draft', nullable: false })
    Status: string;

    @Column({ default: true })
    IsActive: boolean;

    @Column({ default: false })
    IsDelete: boolean;

    @ManyToOne(() => Users, (entity) => entity.MyPrograms, { nullable: true })
    @JoinColumn({ name: 'CreatedBy' })
    CreatedBy: Users;

    @Column({ nullable: true })
    UpdatedBy: number;

    @CreateDateColumn({ nullable: true, })
    CreatedAt: Date;

    @UpdateDateColumn({ nullable: true, })
    UpdatedAt: Date;

    //[ProgramAttributes >> Programs collection]
    @OneToMany(() => ProgramAttributes, (entity) => entity.Programs)
    Attributes: ProgramAttributes[];

    //[ProgramAdmins >> Programs collection]
    @OneToMany(() => ProgramAdmins, (entity) => entity.Programs)
    Admins: ProgramAdmins[];

    //[ProgramGroups >> Programs collection]
    @OneToMany(() => ProgramGroups, (entity) => entity.Programs)
    Groups: ProgramGroups[];

}

@Entity(Constants.DB_SSP_PROGRAM_ATTRIBUTES)
export class ProgramAttributes {

    @PrimaryGeneratedColumn() ID: number;

    @ManyToOne(() => Programs, (entity) => entity.Attributes, { nullable: false })
    @JoinColumn({ name: 'ProgramId' })
    Programs: Programs;

    @Column({ default: '', nullable: false })
    Column: string;

    @Column({ default: '', nullable: false })
    DataType: string;

    @Column({ default: '', nullable: false })
    Reference: string;

    @Column({ default: true })
    IsActive: boolean;

    @Column({ default: false })
    IsDelete: boolean;
}

@Entity(Constants.DB_SSP_PROGRAM_ADMINS)
export class ProgramAdmins {

    @PrimaryGeneratedColumn() ID: number;

    @ManyToOne(() => Programs, (entity) => entity.Admins, { nullable: false })
    @JoinColumn({ name: 'ProgramId' })
    Programs: Programs;

    @ManyToOne(() => Users, (entity) => entity.TaggedPrograms, { nullable: false })
    @JoinColumn({ name: 'UserId' })
    User: Users;

    @Column({ default: true })
    IsActive: boolean;

    @Column({ default: false })
    IsDelete: boolean;
}

@Entity(Constants.DB_SSP_PROGRAM_GROUPS)
export class ProgramGroups {

    @PrimaryGeneratedColumn() ID: number;

    @ManyToOne(() => Programs, (entity) => entity.Groups, { nullable: false })
    @JoinColumn({ name: 'ProgramId' })
    Programs: Programs;

    @ManyToOne(() => Groups, (entity) => entity.TaggedPrograms, { nullable: false })
    @JoinColumn({ name: 'GroupId' })
    Group: Groups;

    @Column({ default: true })
    IsActive: boolean;

    @Column({ default: false })
    IsDelete: boolean;
}

