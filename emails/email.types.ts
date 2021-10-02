export enum EmailType {
  Html = "Html",
  Text = "Text",
}

export interface IEmailProvider {
  key: string;
  credits: number;
  emailSendingFunction: Function;
}
