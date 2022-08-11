import { AuthService } from './../auth/auth.service';
import client from 'twilio';

export class SmsService {
  private readonly client = client(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  constructor(private readonly authService: AuthService) {}
  async sendSms(to: string, code: string) {
    return await this.client.messages.create({
      body: `your code is: ${code}`,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  }
}
