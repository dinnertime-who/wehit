import nodemailer from "nodemailer";
import { serverEnv } from "@/config/env";

export const transporter = nodemailer.createTransport({
  host: serverEnv.SMTP_HOST,
  port: serverEnv.SMTP_PORT,
  auth: {
    user: serverEnv.SMTP_USER,
    pass: serverEnv.SMTP_PASSWORD,
  },
});
