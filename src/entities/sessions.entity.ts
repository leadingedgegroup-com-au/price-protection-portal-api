import Constants from 'src/app.constants';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, } from 'typeorm';

@Entity(Constants.DB_SSP_SESSIONS)
export class Sessions {

    @PrimaryGeneratedColumn() ID: number;

    @Column({ default: '', nullable: false })
    UID: number;

    @Column({ type: 'text', default: '', nullable: true })
    Useragent?: string;

    @Column({ type: 'text', default: '', nullable: true })
    Token?: string;

    @Column({ default: '', nullable: true })
    IP?: string;

    @Column({ default: '', nullable: true })
    Session?: string;

    @Column({ type: 'text', default: '', nullable: true })
    Sso?: string;

    @Column({ default: true })
    IsActive: boolean;

    @CreateDateColumn({ nullable: true, })
    CreatedAt: Date;
}