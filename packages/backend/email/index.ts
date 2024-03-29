import { ApolloError } from "apollo-server-express";
import { SES } from "aws-sdk";
import { promises as fs } from "fs";
import path from "path";
import ejs, { Data as EjsData } from "ejs";
import dayjs from "dayjs";

import { User, ReportedPost, PostViolationOptions } from "../schemas/user";
import { Fund } from "../schemas/fund";
import { Post } from "../schemas/post";
import { HelpRequest } from "../schemas/help-request";
import {
  HelpRequestTypeMapping,
  PreferredTimeOfDayOptionsMapping,
} from "../graphql/help-requests.graphql";

import "dotenv/config";

const SENDER = process.env.EMAIL_SENDER as string;
const PROMETHEUS_URL = process.env.PROMETHEUS_URL as string;
const MAILER_TEMPLATE_PATH: string = path.join(__dirname, "./templates");
const CS_EMAIL = process.env.CS_EMAIL as string;
const COMPLIANCE_EMAIL = process.env.COMPLIANCE_EMAIL as string;
const EMAIL_ENABLED = JSON.parse(
  (process.env.EMAIL_ENABLED ?? "true").toLowerCase()
) as boolean;

const sesInstance = new SES({
  region: process.env.REGION,
});

if (
  process.env.NODE_ENV !== "test" &&
  (!CS_EMAIL || !SENDER || !MAILER_TEMPLATE_PATH || !PROMETHEUS_URL)
) {
  throw new Error("Invalid sever configuration for email");
}

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
  templateData: EjsData,
  emailSubject?: string
): Promise<EmailResponse | true> {
  if (!EMAIL_ENABLED) return true;

  // Render the HTML email and extract the subject from the title
  const html: string = await renderTemplate(template, templateData);
  const subject: string =
    emailSubject || html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || "";
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
    emailToken: string,
    sender?: User.Mongo
  ): Promise<boolean> {
    try {
      const subject = sender
        ? `${sender.firstName} ${sender.lastName} has invited you to Prometheus!`
        : "You've been invited to Prometheus!";
      await sendEmail(recipient, "send-invite", { token: emailToken }, subject);

      return true;
    } catch (err) {
      console.log("Error", err);
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
      console.log("Error", err);
      throw new ApolloError(
        `Error sending password reset email to ${recipient}`
      );
    }
  },

  /**
   * Sends an email the Prometheus compliance team when a user has acknowledged
   * review of form CRS.
   *
   * @param user  User that acknowledged review of the forms.
   */
  sendFormCRS: async function (user: User.Mongo): Promise<boolean> {
    try {
      const { firstName, lastName, _id, email } = user;
      const date = dayjs().format("h:mm A ZZ on MMM D, YYYY");
      await sendEmail(COMPLIANCE_EMAIL, "form-crs", {
        firstName,
        lastName,
        email,
        id: _id,
        date,
      });

      return true;
    } catch (err) {
      console.log("Error", err);
      throw new ApolloError(
        `Error sending form crs confirmation email to ${COMPLIANCE_EMAIL}`
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

  /**
   * Sends an email to the business team whenever a user requests to be reviewed
   * as a financial advisor;
   *
   * @param user          Auth user.
   */
  sendFARequest: async function (user: User.Mongo): Promise<boolean> {
    const { questionnaire } = user;
    const { advisorRequest } = questionnaire ?? {};
    if (!questionnaire || !advisorRequest) {
      console.log("Invalid financial advisor request data.");
      return false;
    }

    const { firm, crd, email, phone, contactMethod } = advisorRequest;

    try {
      await sendEmail(CS_EMAIL, "advisor-request", {
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user._id,
        firm,
        crd,
        phone,
        email,
        contactMethod,
      });

      return true;
    } catch (err) {
      console.log("err", err);
      throw new ApolloError(`Error sending help request email`);
    }
  },

  /**
   * Sends an email to Prometheus admins when a user reports another post.
   *
   * @param report  Details of the post and reporting.
   * @param user    User that reported the post.
   */
  reportPost: async function (
    report: ReportedPost,
    post: Post.Mongo,
    user: User.Mongo
  ): Promise<boolean> {
    const { comments, postId, violations } = report;
    try {
      await sendEmail(CS_EMAIL, "report-post", {
        postId,
        comments,
        violations: violations
          .map(
            (violation) =>
              Object.values(PostViolationOptions).find(
                (item) => item.value === violation
              )?.label
          )
          .join(","),
        userName: `${user.firstName} ${user.lastName}`,
        userId: user._id,
        postBody: post.body,
      });

      return true;
    } catch (err) {
      console.log("Error", err);
      throw new ApolloError(
        `Error sending report post email for post ${postId} to ${CS_EMAIL}`
      );
    }
  },
};
