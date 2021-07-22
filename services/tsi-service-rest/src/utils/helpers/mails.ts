/**
 * Description: Class described methods of mail payload creation
 */

import { MailTypes } from 'constants/mail-types.enum';
import { TicketsDTO } from 'modules/v1/product';
import { User } from 'modules/v1/user';
import {
  SendChangeEmailDTO,
  SendReplyDTO,
  SendTemporaryPasswordDTO,
  SendTicketDTO,
} from 'modules/v1/support';
import { MailQueueDTO } from 'utils/queue';
import { Admin } from 'modules/v1/admin/auth/auth.admin.types';

export class Mails {
  public static sendOtp(otp: string, user: User): MailQueueDTO {
    return {
      mailType: MailTypes.OtpCode,
      options: {
        to: user.email,
      },
      data: {
        otpCode: otp,
        user: user.firstName,
      },
    };
  }

  public static sendRestorePassword(link: string, user: Partial<User>): MailQueueDTO {
    return {
      mailType: MailTypes.RestorePassword,
      options: {
        to: user.email,
      },
      data: {
        link,
        user: user.firstName,
      },
    };
  }

  public static sendAdminRestorePassword(link: string, user: Partial<Admin>): MailQueueDTO {
    return {
      mailType: MailTypes.RestorePassword,
      options: {
        to: user.email,
      },
      data: {
        link,
        user: user.name,
      },
    };
  }

  public static sendTickets(tickets: TicketsDTO, user: Partial<User>): MailQueueDTO {
    return {
      mailType: MailTypes.Tickets,
      options: {
        to: user.email,
      },
      data: {
        tickets,
        user: user.firstName,
      },
    };
  }

  public static sendSupportTicket(data: SendTicketDTO): MailQueueDTO {
    return {
      mailType: MailTypes.SupportTicket,
      options: {
        subject: data.subject,
      },
      data: {
        user: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        subject: data.subject,
        message: data.message,
      },
    };
  }

  public static sendSupportReply(data: SendReplyDTO): MailQueueDTO {
    return {
      mailType: MailTypes.SupportReply,
      options: {
        to: data.email,
      },
      data: {
        user: data.name,
        subject: data.subject,
        message: data.message,
      },
    };
  }

  public static sendTemporaryPassword(data: SendTemporaryPasswordDTO): MailQueueDTO {
    return {
      mailType: MailTypes.TemporaryPassword,
      options: {
        to: data.email,
      },
      data: {
        user: data.name,
        temporaryPassword: data.temporaryPassword,
      },
    };
  }

  public static sendChangeEmailNotification(data: SendChangeEmailDTO): MailQueueDTO {
    return {
      mailType: MailTypes.ChangeEmailNotification,
      options: {
        to: data.email,
      },
      data: {
        user: data.firstName,
      },
    };
  }

  public static sendChangeEmailAlert(data: SendChangeEmailDTO): MailQueueDTO {
    return {
      mailType: MailTypes.ChangeEmailAlert,
      options: {
        to: data.email,
      },
      data: {
        link: data.link,
        user: data.firstName,
      },
    };
  }
}
