import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import Constants from 'src/app.constants';
import { Groups } from './groups.entity';

@Entity(Constants.DB_SSP_CUSTOMERS)
export class Customers {

    @PrimaryGeneratedColumn() ID: number;

    @Column({ default: '', nullable: false })
    EntityId: string;

    @Column({ default: '', nullable: true })
    Company: string;

    @Column({ default: '', nullable: true })
    CompanyLegalName: string;

    @Column({ default: '', nullable: true })
    CategoryType: string;

    @Column({ default: '', nullable: true })
    CategoryGroup: string;

    @Column({ default: '', nullable: true })
    Suburb: string;

    @Column({ default: '', nullable: true })
    State: string;

    @Column({ default: '', nullable: true })
    Address: string;

    @ManyToOne(() => Groups, (entity) => entity.Customers, { nullable: false })
    @JoinColumn({ name: 'GroupId' })
    Group: Groups;

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
}