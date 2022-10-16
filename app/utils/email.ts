import type { Event } from '@prisma/client';
import nodemailer from "nodemailer";
import type { createParticipant } from '~/models/participant.server';

export function getTransporter() {
  const transporterOptions = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_HOST || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD || "",
    },
  }
  console.log('transporterOptions',transporterOptions);
  return nodemailer.createTransport(transporterOptions);
}

export function sendNewParticipantSignupEmail(
  participant: NonNullable<Awaited<ReturnType<typeof createParticipant>>>,
  event: Event
) {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"Mathebau Events" <${process.env.EMAIL_USER}>`,
    to: participant.email,
    subject: `Anmeldung für ${event.name}`,
    text: `Hallo ${participant.name}, vielen Dank für deine Anmeldung zum Event "${event.name}". Bitte bestätige deine Anmeldung, indem du auf den folgenden Link klickst: ${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}`,
    html: `Hallo ${participant.name}, vielen Dank für deine Anmeldung zum Event "${event.name}". Bitte bestätige deine Anmeldung, indem du auf den folgenden Link klickst: <a href="${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}">${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}</a>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email send failed, error:', error);
      console.log('mailOptions:', mailOptions);
      console.log('transporter:', transporter);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
