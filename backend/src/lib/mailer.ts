import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendResetEmail = async (to: string, token: string) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
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
