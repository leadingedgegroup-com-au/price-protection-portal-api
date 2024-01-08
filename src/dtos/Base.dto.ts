import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { NotificationTypes } from "src/enums/NotificationTypes.enum";

export class BaseFilteration {
    @ApiPropertyOptional({ default: 'CreatedAt', nullable: true })
    SortColumn?: string;

    @ApiPropertyOptional({ default: 'DESC', enum: ['ASC', 'DESC'], nullable: true })
    SortOrder?: 'ASC' | 'DESC';
}

export class attachmentReferences {
    filename: string;
    path: string;
}

export class EmailQueue {
    type?: string;
    to: string;
    cc?: string | string[];
    bcc?: string;
    replyTo?: string;
    subject: string;
    html?: string;
    text?: string;
    attachments?: Array<attachmentReferences>;
}

export class Variables {
    Key: string;
    Value: string;
}

export class SocketQueue {
    type?: NotificationTypes;
    subject?: string;
    body?: string;
}

export class QueuePayload {

    @ApiProperty({ default: 'email', enum: ['email', 'socket'], nullable: false })
    Channel: 'email' | 'socket';

    @ApiProperty({ default: 0, nullable: false })
    UID: string;

    @ApiProperty({ default: '', enum: ['ACCOUNT_CREATION', 'FORGOT_PASSWORD', 'RESET_PASSWORD'], nullable: false })
    Cause: 'ACCOUNT_CREATION' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD';

    @ApiProperty({ default: '', nullable: false })
    Template: string;

    @ApiProperty({ default: [], nullable: true })
    Variables: Variables[];

    @ApiPropertyOptional({ default: {}, nullable: true })
    Email?: EmailQueue

    @ApiPropertyOptional({ default: {}, nullable: true })
    Socket?: SocketQueue
}



