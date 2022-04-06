import { SES } from "aws-sdk";
import { promises as fs } from "fs";
import { promisify } from "util";
import path from "path";
import ejs, { Data as EjsData } from "ejs";

import "dotenv/config";

const SENDER = process.env.EMAIL_SENDER as string;
const PROMETHEUS_URL = process.env.PROMETHEUS_URL as string;
const MAILER_TEMPLATE_PATH: string = path.join(__dirname, "./templates");

const sesInstance = new SES({
  region: process.env.REGION,
});

/**
 * Renders an html template using the given template data.
 *
 * @param template  The name of the template from the templates directory.
 * @param data      Any data that should be used when rendering the template.
 *
 * @returns   A string containing the rendered HTML.
 */
async function renderTemplate(
  template: string,
  data: EjsData
): Promise<string> {
  const templateContent = await fs.readFile(
    `${MAILER_TEMPLATE_PATH}/${template}.ejs`,
    { encoding: "utf8" }
  );
  return ejs.render(templateContent, data, {
    async: true,
  });
}

// Type alias for return value then sending an email
type EmailResponse = ReturnType<
  ReturnType<typeof sesInstance.sendEmail>["promise"]
>;

/**
 * Sends an email using a specific email template.
 *
 * @param sendTo        The email address of the recipient.
 * @param template      The name of the HTML template to use.
 * @param templateData  Any data that should be incorporated into the email.
 *
 * @returns   The response from the email request.
 */
async function sendEmail(
  sendTo: string | string[],
  template: string,
  templateData: EjsData
): Promise<EmailResponse> {
  // Render the HTML email and extract the subject from the title
  const html: string = await renderTemplate(template, templateData);
  const subject: string = html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || "";
  return sesInstance
    .sendEmail({
      Source: SENDER,
      Destination: {
        ToAddresses: typeof sendTo === "string" ? [sendTo] : sendTo,
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
    })
    .promise();
}

/**
 * Prometheus email service layer to provide centralized architecture to
 * dispatch emails.
 */
export const PrometheusMailer = {
  /**
   * Sends an invitation code to a new user.
   *
   * @param recipient   Email recipient
   * @param emailToken  Unique token used to grant access to registration
   */
  sendInviteCode: async function (
    recipient: string,
    emailToken: string
  ): Promise<boolean> {
    try {
      await sendEmail(recipient, "send-invite", { token: emailToken });

      return true;
    } catch (err) {
      console.log(`Error sending invite code to ${recipient}`, err);
    }
    return false;
  },

  /**
   * Sends a forgot password email to the specified recipient with a reset
   * link that the user may use to reauthenticate.
   *
   * @param recipient   Email recipient
   * @param emailToken  Unique token used to authorize password reset
   */
  sendForgotPassword: async function (
    recipient: string,
    emailToken: string
  ): Promise<boolean> {
    try {
      const resetLink = `${PROMETHEUS_URL}/reset-password?token=${emailToken}`;
      await sendEmail(recipient, "reset-password", { resetLink });

      return true;
    } catch (err) {
      console.log(`Error sending password reset email to ${recipient}`, err);
    }
    return false;
  },
};
