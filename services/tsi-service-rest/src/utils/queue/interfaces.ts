/**
 * Description: Interfaces for Bull queue constructor.
 */

import { Queue, QueueOptions } from 'bull';
import { Readable } from 'stream';
import { Url } from 'url';

export interface IQueueRegistry {
  getAllQueues(): Map<string, Queue>;
  getQueue<T>(name: string): Queue<T>;
  registerQueue(name: string, options: QueueOptions): Promise<void>;
  closeAllQueues(): void;
}

interface AttachmentLike {
  content?: string | Buffer | Readable;
  path?: string | Url;
}

interface Attachment extends AttachmentLike {
  filename?: string | false;
  cid?: string;
  encoding?: string;
  contentType?: string;
  contentTransferEncoding?: '7bit' | 'base64' | 'quoted-printable' | false;
  contentDisposition?: 'attachment' | 'inline';
  headers?: Headers;
  raw?: string | Buffer | Readable | AttachmentLike;
}

export interface MailOptions {
  from?: string;
  sender?: string;
  to?: string | Array<string>;
  replyTo?: string;
  inReplyTo?: string;
  references?: string | string[];
  subject?: string;
  text?: string | Buffer | Readable;
  html?: string | Buffer | Readable;
  watchHtml?: string | Buffer | Readable;
  amp?: string | Buffer | Readable;
  headers?: Headers;
  attachments?: Attachment[];
  alternatives?: Attachment[];
  messageId?: string;
  date?: Date | string;
  encoding?: string;
  raw?: string | Buffer | Readable | AttachmentLike;
  disableUrlAccess?: boolean;
  disableFileAccess?: boolean;
  normalizeHeaderKey?(key: string): string;
  priority?: 'high' | 'normal' | 'low';
}
