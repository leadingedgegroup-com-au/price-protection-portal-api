import Constants from 'src/app.constants';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, } from 'typeorm';

@Entity(Constants.DB_SSP_NOTIFICATIONS)
export class Notifications {

    @PrimaryGeneratedColumn() ID: number;

    @Column({ default: '', nullable: true })
    Channel: string;

    @Column({ default: '', nullable: true })
    UID: string;

    @Column({ default: '', nullable: true })
    Cause: string;

    @Column({ default: '', nullable: true })
    Type: string;

    @Column({ default: '', nullable: true })
    Subject: string;

    @Column({ default: '', nullable: true })
    Body: string;

    @Column({ default: '', nullable: true })
    Attachments: string;

    @Column({ default: false })
    Delivered: boolean;

    @Column({ default: false })
    Seen: boolean;

    @Column({ default: true })
    IsActive: boolean;

    @CreateDateColumn({ nullable: true, })
    CreatedAt: Date;

    @UpdateDateColumn({ nullable: true, })
    UpdatedAt: Date;
}


