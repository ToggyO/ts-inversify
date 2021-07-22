/**
 * Description: Class described the mail service
 */

import { createTransport, Transporter } from 'nodemailer';
import { injectable } from 'inversify';

import { ILogger } from 'utils/logger';

import { IMailer } from './interfaces';
import { ExtendedSendMailOptions, MailerConfiguration } from './types';
import { MailTypes } from './enums';
import { ASSETS_DIR } from './constants';
import { MailTemplate } from './templates/types';
import { ITemplateService, ITemplator } from './templates/interfaces';

@injectable()
export class Mailer implements IMailer {
  private _transporter: Transporter | null = null;
  private _options: MailerConfiguration | null = null;

  constructor(
    private readonly _logger: ILogger,
    private readonly _templator: ITemplator,
    private readonly _templateService: ITemplateService,
  ) {
    _templateService.useAssets(ASSETS_DIR);
  }

  public init(options: MailerConfiguration): void {
    if (!options) {
      throw new Error('No options are provided for the mail service');
    }
    const { connectionOptions } = options;
    this._transporter = createTransport(connectionOptions);
    this._options = options;
  }

  public async sendMail(mailOptions: ExtendedSendMailOptions): Promise<void> {
    if (this._transporter !== null) {
      if (!this._options) {
        throw new Error('No options are provided for the mail service');
      }
      const { mailType, options, data = {} } = mailOptions;
      const { template, attachments, subject } = this.getTemplate(mailType, data);
      try {
        const { messageOptions } = this._options;
        await this._transporter.sendMail({
          ...options,
          from: messageOptions.from,
          to: mailType === MailTypes.SupportTicket ? this._options?.supportMail : options.to,
          html: template,
          attachments,
          subject,
        });
        this._logger.debug(
          `Email message to ${
            mailType === MailTypes.SupportTicket ? this._options?.supportMail : options.to
          } is sent at ${new Date().toISOString()}`,
        );
      } catch (error) {
        throw new Error(error);
      }
    }
  }

  get Transporter(): Transporter | null {
    return this._transporter;
  }

  private getTemplate(mailType: MailTypes, data?: Record<string, any>): MailTemplate {
    const { viewName, attachmentName, subject } = this._templator.getTemplate(mailType, data);
    const dataWithAppDomain = {
      ...data,
      appDomain: this._options?.appDomain,
    };
    return {
      ...this._templateService.compile(viewName, attachmentName, dataWithAppDomain),
      subject,
    };
  }
}
