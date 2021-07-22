/**
 * Description: Template engine module interfaces
 */

import { MailTypes } from '../../mailer';

import { CompiledTemplate, TemplateMeta } from './types';

export interface ITemplator {
  getTemplate(mailType: MailTypes, data?: Record<string, any>): TemplateMeta;
}

export interface ITemplateService {
  compile(
    templateName: string,
    attachmentsName: string,
    data?: Record<string, any>,
    options?: CompileOptions,
  ): CompiledTemplate;
  useAssets(assetsDirPath: string): ITemplateService;
}
