import { Address } from 'nodemailer/lib/mailer';

export interface SendEmailDto {
  from?: Address;
  recipient: string;
  subject: string;

  text?: string;
  placeholderReplacements?: Record<string, string>;
  link: string;
}
