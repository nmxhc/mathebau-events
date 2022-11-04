import type { Event } from '@prisma/client';
import nodemailer from "nodemailer";
import type { createParticipant } from '~/models/participant.server';

export function getTransporter() {
  const transporterOptions = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD || "",
    },
  }
  return nodemailer.createTransport(transporterOptions);
}

export function sendNewParticipantSignupEmail(
  participant: NonNullable<Awaited<ReturnType<typeof createParticipant>>>,
  event: Event & {signups: {id: string}[]}
) {
  const transporter = getTransporter();
  const mailOptions = {
    from: `"Mathebau Events" <${process.env.EMAIL_USER}>`,
    to: participant.email,
    subject: `Anmeldung für ${event.name}`,
    text: `
Hallo ${participant.name},

vielen Dank für deine Anmeldung zum Event "${event.name}".${(event.participantsLimit && event.participantsLimit <= event.signups.length) ? ' Aktuell stehst du auf der Warteliste, da das Teilnehmerlimit erreicht ist. Falls du von deinen Event-Administratoren nichts weiteres hörst, frag bitte bei ihnen nach!': ''}

Bitte bestätige deine Anmeldung, indem du auf den folgenden Link klickst:
${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}

`,
  };
  console.log(mailOptions.text)
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
