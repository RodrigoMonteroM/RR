import nodemailer from "nodemailer";
import { logger } from "./logger";
import {env} from '@/lib/env';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export const sendResetEmail = async (to: string, token: string) => {
    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
        await transporter.sendMail({
            from: env.SMTP_FROM,
            to,
            subject: "Recupero password",
            html: `<p>Clicca <a href="${resetUrl}">qui</a> per reimpostare la password. Il link scade tra 1 ora.</p>`,
        });
        logger.info(`Reset email sent to ${to}`);
    } catch (error: unknown) {
        logger.error("sendResetEmail failed", error);
        throw error;
    }
};
