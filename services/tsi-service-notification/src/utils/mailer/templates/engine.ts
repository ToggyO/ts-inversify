/**
 * Description: Handlebars template engine service
 */

import { join } from 'path';
import fs from 'fs';

import hbs from 'handlebars';
import type { Attachment } from 'nodemailer/lib/mailer';

import type { CompiledTemplate } from './types';
import type { ITemplateService } from './interfaces';

export class TemplateEngine implements ITemplateService {
  private readonly _templateEngine: typeof Handlebars = hbs.create();
  private readonly _viewsDir: string;
  private _assetsDir: string;
  private readonly _attachments = new Map<string, Array<Attachment>>();

  constructor(viewsDir: string) {
    if (!viewsDir) {
      throw new Error('Please, provide a valid path to directory with views');
    }
    this._viewsDir = viewsDir;
  }

  public compile(
    templateName: string,
    attachmentsName: string,
    data?: Record<string, any>,
    options?: CompileOptions,
  ): CompiledTemplate {
    const source = fs.readFileSync(join(process.cwd(), this._viewsDir, templateName), 'utf8');
    const template = this._templateEngine.compile(source, options)(data);
    const attachments = this._attachments.get(attachmentsName) as Array<Attachment>;
    this._attachments.delete(attachmentsName);
    return {
      template,
      attachments,
    };
  }

  public useAssets(assetsDirPath: string): this {
    this._assetsDir = assetsDirPath;
    this._templateEngine.registerHelper('attach', (attachmentsName: string, asset: string) => {
      const attachment = this._getAttachment(attachmentsName);
      attachment.push({
        filename: asset,
        path: join(process.cwd(), this._assetsDir, asset),
        cid: asset,
      });
      this._attachments.set(attachmentsName, attachment);
      return new this._templateEngine.SafeString(asset);
    });
    return this;
  }

  private _getAttachment(attachmentName: string): Array<Attachment> {
    let attachment = this._attachments.get(attachmentName);
    if (!attachment) {
      this._attachments.set(attachmentName, []);
      attachment = this._attachments.get(attachmentName);
    }
    return attachment!;
  }
}
