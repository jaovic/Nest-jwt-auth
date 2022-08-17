import { MessagesHelper } from '../../helpers/message.helper';
import { regexHelper } from '../../helpers/regex.helper';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SingUpAuthDto {
  @IsNotEmpty({ message: MessagesHelper.EMAIL_REQUIRED })
  name: string;
  @IsNotEmpty({ message: MessagesHelper.EMAIL_REQUIRED })
  @IsEmail({}, { message: MessagesHelper.EMAIL_INVALID })
  email: string;
  @IsNotEmpty({ message: MessagesHelper.PASSWORD_REQUIRED })
  @Matches(regexHelper.password, {
    message: MessagesHelper.PASSWORD_VALID,
  })
  password: string;
  @IsNotEmpty({ message: MessagesHelper.CPF_REQUIRED })
  @Matches(regexHelper.cpf, { message: MessagesHelper.CPF_INVALID })
  cpf: string;
  @IsNotEmpty({ message: MessagesHelper.PHONE_REQUIRED })
  phone: string;
}
