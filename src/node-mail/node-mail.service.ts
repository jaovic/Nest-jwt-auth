import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  async sendMail(to: string, code: string) {
    const mailSend = await this.transporter.sendMail({
      text: `your code is: ${code}`,
      subject: 'Code',
      from: 'api Auth <constateste996@gmail.com>',
      to,
    });
    console.log(mailSend);
  }
}
