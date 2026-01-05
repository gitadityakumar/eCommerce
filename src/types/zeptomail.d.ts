declare module 'zeptomail' {
  export interface EmailAddress {
    address: string;
    name?: string;
  }

  export interface CcBccItem {
    email_address: EmailAddress;
  }

  export interface SendMailOptions {
    from: EmailAddress;
    to: CcBccItem[];
    subject: string;
    htmlbody: string;
    // Add other fields as needed
  }

  export interface TemplateMailOptions {
    template_key: string;
    template_alias?: string;
    from: EmailAddress;
    to: CcBccItem[];
    merge_info?: Record<string, string>;
    // Add other fields as needed
  }

  export class SendMailClient {
    constructor(options: { url: string; token: string });
    sendMail(options: SendMailOptions): Promise<any>;
    sendMailWithTemplate(options: TemplateMailOptions): Promise<any>;
    sendBatchMail(options: any): Promise<any>;
    mailBatchWithTemplate(options: any): Promise<any>;
  }
}
