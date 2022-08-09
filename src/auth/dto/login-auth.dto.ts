import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { MessagesHelper } from 'src/helpers/message.helper';
import { regexHelper } from 'src/helpers/regex.helper';

export class LoginAuthDto {
  @IsNotEmpty({ message: MessagesHelper.EMAIL_REQUIRED })
  @IsEmail({ message: MessagesHelper.EMAIL_INVALID })
  email: string;
  @IsNotEmpty({ message: MessagesHelper.PASSWORD_REQUIRED })
  @Matches(regexHelper.password, {
    message: MessagesHelper.PASSWORD_VALID,
  })
  password: string;
}
