import type { Event } from '@prisma/client';
import nodemailer from "nodemailer";
import type { createParticipant } from '~/models/participant.server';
import type { getSignupById } from '~/models/signup.server';

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

Bitte bestätige deine Email, indem du auf den folgenden Link klickst:
${process.env.BASE_URL}/participant/email-bestaetigung/${participant.emailValidationToken}

`,
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


export function sendEventSignupConfirmationEmail(
  signup: NonNullable<Awaited<ReturnType<typeof getSignupById>>>,
  isOnWaitlist: boolean
) {
  const transporter = getTransporter();
  const signupDataString = signup.signupEventInputValues.filter(sEIV => !sEIV.eventInputField.inputField.adminOnly).map((signupEventInputValue) => {
    return `${signupEventInputValue.eventInputField.inputField.name}: ${signupEventInputValue.value}`;
  }).join('\n');

  console.log(isOnWaitlist)
  const mailOptions = {
    from: `"Mathebau Events" <${process.env.EMAIL_USER}>`,
    to: signup.participant.email,
    subject: `Anmeldung für ${signup.event.name} bestätigt`,
    text: `
Hallo ${signup.participant.name},

Deine ${isOnWaitlist ? 'Email' : `Anmeldung für das Event "${signup.event.name}"`} wurde bestätigt.

${isOnWaitlist ? `Du stehst aktuell auf der Warteliste, da das Teilnehmerlimit erreicht ist. Falls du von deinen Event-Administratoren nicht demnächst etwas weiteres hörst, frag bitte bei ihnen nach, ob du doch noch teilnehmen kannst!

Du stehst auf der Warteliste für folgendes Event:` : `Du bist für folgendes Event angemeldet:`}
-----------------------------------------
Event: ${signup.event.name}
Datum: ${signup.event.startDate.toLocaleDateString('de-DE')} bis ${signup.event.endDate.toLocaleDateString('de-DE')}
Ort: ${signup.event.location} ${signup.event.cost && `
Kosten: ${signup.event.cost}`}

${signup.event.description}

Event-Administratoren:
  ${signup.event.eventAdmins.map((eventAdmin) => `${eventAdmin.admin.name}: ${eventAdmin.admin.email}` ).join(',\n  ')}
-----------------------------------------

Deine Anmeldedaten:
-----------------------------------------
Name: ${signup.participant.name}
E-Mail: ${signup.participant.email}
${signupDataString}
-----------------------------------------

${!isOnWaitlist ? `Wenn etwas so wichtiges dazwischen kommt, dass du leider nicht am Event teilnehmen kannst, melde dich bitte bei deinen Event-Administratoren.
`:''}
Viele Grüße von
${signup.event.eventAdmins.map((eventAdmin) => eventAdmin.admin.name).join(', ')}
und dem Mathebau

PS: Bei Bugs oder Anregungen zum Eventtool wende dich an tomk@mathebau.de oder öffne ein Issue (oder Pull-Request :) auf GitHub: https://github.com/paul-goblin/mathebau-events
`,
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