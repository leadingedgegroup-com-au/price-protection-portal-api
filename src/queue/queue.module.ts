import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import Constants from 'src/app.constants';
import { NotificationsConsumer } from './pubsub';
import { Notifications } from 'src/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notifications]),
        BullModule.registerQueue({ name: Constants.QUEUE.CONSUMERS.NOTIFICATION })
    ],
    controllers: [],
    providers: [NotificationsConsumer],
})
export class QueueModule { }
