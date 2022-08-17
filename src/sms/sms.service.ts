import * as client from 'twilio';

export class SmsService {
  private readonly client = client(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN,
  );
  async sendSms(to: string, code: string) {
    return await this.client.messages.create({
      body: `your code is: ${code}`,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
  }
}
