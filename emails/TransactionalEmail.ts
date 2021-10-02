import { readFileSync } from "fs";
import moment from "moment-timezone";

import { Log } from "../src/entities/ModuleSystem/LogModel";
import { IUser, User } from "../src/entities/ModuleSystem/UserModel";
import { EncryptionHelper } from "../src/providers/auth/EncryptionHelper";
import { appEnv } from "../src/providers/config/env";
import { TextHelper } from "../src/providers/text/TextHelper";
import { EmailType } from "./email.types";
import { emailProviders } from "./emailProviders";

export class TransactionalEmail {
  /**
   *
   * @param to email's destination
   * @param from email's sender
   * @param subject what's the e-mail about?
   * @param template folder name from emails/templates
   * @param customVars object containing any custom vars to replace in your template.
   */
  public static async send(
    to: string | undefined,
    subject: string,
    template: string,
    customVars?: object,
    from: string | undefined = appEnv.general.ADMIN_EMAIL
  ): Promise<boolean> {
    // if (appEnv.general.ENV === EnvType.Development) {
    //   console.log("Skipping e-mail submission, since you cannot submit e-mails on Development");
    //   return false;
    // }

    const html = this.loadEmailTemplate(EmailType.Html, template, customVars);
    const text = this.loadEmailTemplate(EmailType.Text, template, customVars);

    const today = moment.tz(new Date(), appEnv.general.TIMEZONE!).format("YYYY-MM-DD[T00:00:00.000Z]");

    // loop through email providers and check which one has an unmet free tier threshold.
    for (const emailProvider of emailProviders) {
      try {
        const providerEmailsToday = await Log.find({
          action: `${emailProvider.key}_EMAIL_SUBMISSION`,
          createdAt: { $gte: new Date(today) },
        });

        if (providerEmailsToday.length < emailProvider.credits) {
          console.log("Smart sending email...");

          console.log(`Using ${emailProvider.key} to submit email...`);

          console.log(`Credits balance today: ${providerEmailsToday.length}/${emailProvider.credits}`);

          // Unsubscribed users: check if we should skip this user submission or not

          const user = (await User.findOne({ email: to })) as IUser;

          if (!user) {
            console.log("This user is not in our database! Skipping sending e-mail");
            return false;
          }

          if (user?.unsubscribed === true) {
            console.log("Skipping email submission to unsubscribed user");
            return true;
          }

          // insert unsubscribe link into [Unsubscribe Link] tag

          if (!to) {
            console.log('You should provide a valid "to" email');
            return false;
          }

          // here we encrypt the to email for security purposes
          const encryptionHelper = new EncryptionHelper();
          const encryptedEmail = encryptionHelper.encrypt(to);

          const htmlWithUnsubscribeLink = html.replace(
            "[Unsubscribe Link]",
            `<a href="${appEnv.general.API_URL!}/users/unsubscribe?hashEmail=${encryptedEmail}&lang=${appEnv.general
              .LANGUAGE!}">Do you want to stop receiving these e-mails? Click here!</p>`
          );

          const submissionStatus = await emailProvider.emailSendingFunction(
            to,
            from,
            subject,
            htmlWithUnsubscribeLink,
            text
          );

          if (submissionStatus) {
            // register submission in our logs, so we can keep track of whats being sent
            const newEmailProviderLog = new Log({
              action: `${emailProvider.key}_EMAIL_SUBMISSION`,
              emitter: from,
              target: to,
            });
            await newEmailProviderLog.save();

            console.log(`E-mail submitted to ${to} successfully!`);

            return true;
          } else {
            return false;
          }
        }
      } catch (error) {
        console.log(`Failed to submit email through ${emailProvider.key}`);
        console.error(error);
        return false;
      }
    }

    // if we reach this point, it means that there's no providers with credits left!
    return false;
  }

  public static loadEmailTemplate(type: EmailType, template: string, customVars?: object): string {
    let extension;

    if (type === EmailType.Html) {
      extension = ".html";
    } else if (type === EmailType.Text) {
      extension = ".txt";
    }

    const content = readFileSync(
      `${appEnv.transactionalEmail.templatesFolder}/${template}/content${extension}`,
      "utf-8"
    ).toString();

    if (customVars) {
      return this._replaceTemplateCustomVars(content, customVars);
    }

    return content;
  }

  private static _replaceTemplateCustomVars(html: string, customVars: object): string {
    const keys = Object.keys(customVars);

    const globalTemplateVars = {
      "Product Name": appEnv.transactionalEmail.general.GLOBAL_VAR_PRODUCT_NAME,
      "Sender Name": appEnv.transactionalEmail.general.GLOBAL_VAR_SENDER_NAME,
      "Company Name, LLC": appEnv.transactionalEmail.general.GLOBAL_VAR_COMPANY_NAME_LLC,
      "Company Address": appEnv.transactionalEmail.general.GLOBAL_VAR_COMPANY_ADDRESS,
    };

    const globalKeys = Object.keys(globalTemplateVars);

    if (keys) {
      for (const key of keys) {
        html = TextHelper.replaceAll(html, `{{${key}}}`, customVars[key]);
      }
    }

    if (globalKeys) {
      for (const globalKey of globalKeys) {
        html = TextHelper.replaceAll(html, `[${globalKey}]`, globalTemplateVars[globalKey]);
      }
    }

    return html;
  }
}
