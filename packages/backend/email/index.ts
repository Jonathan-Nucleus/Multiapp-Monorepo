import { ApolloError } from "apollo-server";
import { SES } from "aws-sdk";
import { promises as fs } from "fs";
import path from "path";
import ejs, { Data as EjsData } from "ejs";
import { User } from "backend/schemas/user";
import { HelpRequest } from "../schemas/help-request";
import {
  HelpRequestTypeMapping,
  PreferredTimeOfDayOptionsMapping,
} from "../graphql/help-requests.graphql";

import "dotenv/config";
import { Fund } from "../schemas/fund";

const SENDER = process.env.EMAIL_SENDER as string;
const PROMETHEUS_URL = process.env.PROMETHEUS_URL as string;
const MAILER_TEMPLATE_PATH: string = path.join(__dirname, "./templates");
const CS_EMAIL = process.env.CS_EMAIL as string;

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
      throw new ApolloError(`Error sending invite code to ${recipient}`);
    }
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
      const resetLink = `${PROMETHEUS_URL}/reset-password/${emailToken}`;
      await sendEmail(recipient, "reset-password", { resetLink });

      return true;
    } catch (err) {
      throw new ApolloError(
        `Error sending password reset email to ${recipient}`
      );
    }
  },

  /**
   * Sends an email to the business team whenever a user requests to become
   * a professional.
   *
   * @param user        User record associated with the request including the
   *                    request information.
   */
  sendProRequest: async function (user: User.Mongo): Promise<boolean> {
    if (!user.proRequest) {
      throw new ApolloError(`Invalid request information for user ${user._id}`);
    }

    try {
      await sendEmail(CS_EMAIL, "pro-request", {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        ...user.proRequest,
      });

      return true;
    } catch (err) {
      console.log("err", err);
      throw new ApolloError(`Error sending pro request email`);
    }
  },

  /**
   * Sends an email to the business team whenever a user requests to contact
   * a fund specialist.
   *
   * @param user          Auth user.
   * @param helpRequest   Help request.
   */
  sendHelpRequest: async function (
    user: User.Mongo,
    helpRequest: HelpRequest.Mongo,
    fund: Fund.Mongo
  ): Promise<boolean> {
    try {
      const { _id: idIgnored, type, preferredTimeOfDay, ...rest } = helpRequest;

      await sendEmail(CS_EMAIL, "help-request", {
        firstName: user.firstName,
        lastName: user.lastName,
        type: HelpRequestTypeMapping[type],
        fundName: fund.name,
        preferredTimeOfDay: preferredTimeOfDay
          ? PreferredTimeOfDayOptionsMapping[preferredTimeOfDay]
          : undefined,
        ...rest,
      });

      return true;
    } catch (err) {
      console.log("err", err);
      throw new ApolloError(`Error sending help request email`);
    }
  },
};
