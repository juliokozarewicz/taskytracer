import * as nodemailer from 'nodemailer'

export class EmailService {

    private transporter: nodemailer.Transporter

    constructor() {

        const emailPort = process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 0

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: emailPort,
            secure: false,
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            },
        })
    }

    async sendTextEmail(to: string, subject: string, text: string): Promise<void> {
        try {

            await this.transporter.sendMail({
                to,
                subject,
                text,
            })

        } catch (error) {
            throw new Error(
                `[./f_utils/EmailSend.ts] ` +
                `[EmailService.sendTextEmail()] ` +
                `${error}`
            )
        }
    }
}