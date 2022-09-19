import type { Event } from '@prisma/client';
import nodemailer from "nodemailer";
import type { createParticipant } from '~/models/participant.server';
import type { getSignupById, signupParticipant } from '~/models/signup.server';

export function getTransporter() {
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "antonina.bashirian35@ethereal.email",
      pass: "axm8YbgHtbjnnRwtt5",
    },
  });
}

export function sendNewParticipantSignupEmail(
  participant: NonNullable<Awaited<ReturnType<typeof createParticipant>>>,
  event: Event
) {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"Mathebau Events" <antonina.bashirian35@ethereal.email>`,
    to: participant.email,
    subject: `Anmeldung für ${event.name}`,
    text: `Hallo ${participant.name}, vielen Dank für deine Anmeldung zum Event "${event.name}". Bitte bestätige deine Anmeldung, indem du auf den folgenden Link klickst: ${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}`,
    html: `Hallo ${participant.name}, vielen Dank für deine Anmeldung zum Event "${event.name}". Bitte bestätige deine Anmeldung, indem du auf den folgenden Link klickst: <a href="${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}">${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}</a>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
