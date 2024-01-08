import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import Constants from "src/app.constants";
import { EmailQueue, SocketQueue } from "src/dtos";
import * as nodemailer from "nodemailer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notifications } from "src/entities";
import { NotificationTypes } from "src/enums";

@Processor(Constants.QUEUE.CONSUMERS.NOTIFICATION)
export class NotificationsConsumer {

    private logger: Logger = new Logger(NotificationsConsumer.name);

    constructor(@InjectRepository(Notifications) private NotificationsRepository: Repository<Notifications>,) { }

    @Process(Constants.QUEUE.PUBLISHERS.NOTIFY)
    async publish(job: Job<unknown>) {

        let data: any = job?.data;

        console.log('Inside Publisher ===>', job?.id, job?.name);

        switch (data?.Channel) {
            case 'email':
                if (data?.Email?.to) {

                    data['Email']['html'] = (() => {
                        let emailBody = data?.Template;
                        data?.Variables?.forEach((item: any) => {
                            let regex = new RegExp(`{{\\s*${item?.Key}\\s*}}`, 'gi');
                            emailBody = emailBody.replace(regex, item?.Value);
                        });
                        return emailBody;
                    })();

                    // await this.NotificationsRepository.save({
                    //     Channel: data?.Channel?.toUpperCase(),
                    //     UID: data?.UID?.toString(),
                    //     Cause: data.Cause,
                    //     Type: data?.Email?.type,
                    //     Subject: data?.Email?.subject,
                    //     Body: data?.Email?.html,
                    //     Attachments: JSON.stringify(data?.Email?.attachments) || '',
                    // }).then(async (res: any) => {

                    // console.log('NOTIFICATION GENERATED IN THE TABLE', res)
                    await this.UtilitySendEmails({ ...data?.Email });
                    //});

                    console.log(`PUBLISHERS.NOTIFY <<===>> ${data?.Channel, data?.UID} <<===>> Published.`);
                } else {
                    console.log(`PUBLISHERS.NOTIFY <<===>> ${data?.Channel, data?.UID} <<===>> Rejected | Due to unavailability of email.to i.e ${data?.Email?.to}.`);
                }
                break;
            case 'socket':
                if (data?.Socket?.to) {

                    data['Socket']['body'] = (() => {
                        let socketBody = data?.Template;
                        data?.Variables?.forEach((item: any) => {
                            let regex = new RegExp(`{{\\s*${item?.Key}\\s*}}`, 'gi');
                            socketBody = socketBody.replace(regex, item?.Value);
                        });
                        return socketBody;
                    })();

                    await this.NotificationsRepository.save({
                        Channel: data?.Channel?.toUpperCase(),
                        UID: data?.UID?.toString(),
                        Cause: data.Cause,
                        Type: data?.Socket?.type,
                        Subject: data?.Socket?.subject,
                        Body: data?.Email?.body,
                        Attachments: '',
                    }).then(async (res: any) => {
                        await this.UtilitySendInAppNotification({ ...data?.Socket });
                    });

                    console.log(`PUBLISHERS.NOTIFY <<===>> ${data?.Channel, data?.UID} <<===>> Published.`);
                } else {
                    console.log(`PUBLISHERS.NOTIFY <<===>> ${data?.Channel, data?.UID} <<===>> Rejected | Due to unavailability of Socket.to i.e ${data?.Socket?.to}.`);
                }
                console.log(`PUBLISHERS.NOTIFY <<===>> ${data?.Channel, data?.UID} <<===>> Published.`);
                break;
            default:
                console.log(`PUBLISHERS.NOTIFY <<===>> No matches`);
        }
    }

    public async UtilitySendEmails(email: EmailQueue): Promise<{ status: boolean, log: any }> {

        console.log(email.html)

        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            secure: false,
            port: 587,
            tls: {
                ciphers: "SSLv3"
            },
            auth: { user: 'ssp.development@outlook.com', pass: 'rANVAN@77' },
            debug: false,
            logger: false,
        });

        return new Promise(async (resolve, reject) => {

            const metadata = {
                from: `<ssp.development@outlook.com>`,
                to: email.to,
                cc: (email.cc) ? email.cc : '',
                bcc: (email.bcc) ? email.bcc : '',
                subject: email.subject,
                html: email.html,
                attachments: (email.attachments) ? email.attachments : [],
            };

            /** 
             * lets transporter call the sendMail to process the email. 
             * */
            await transporter.sendMail(metadata, function (error: any, response: any) {
                if (response) {
                    console.log('Email Successfully Sent');
                    //console.log('Response: %s', JSON.stringify(response));
                }
                if (error) {
                    console.log(`Couldn't Processed the Email`);
                    console.log('Error: %s', JSON.stringify(error));
                }
                (response) ? resolve({ status: true, log: response }) : resolve({ status: false, log: JSON.stringify(error) });
            });
        });
    }

    public async UtilitySendInAppNotification(email: SocketQueue): Promise<{ status: boolean, log: any }> {

        return new Promise(async (resolve, reject) => {

            (true) ? resolve({ status: true, log: '' }) : resolve({ status: false, log: '' });
        });
    }
}