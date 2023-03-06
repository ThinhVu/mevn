import nodemailer from 'nodemailer';
import config from "../config";

let mailSender;
try {
   console.log('init mail config')
   mailSender = nodemailer.createTransport(config.mailConfig)
} catch (e) {
   console.error('failed to initialize mail sender', e)
}

export const sendEmail = ({ to, subject, html }) => {
   return new Promise((resolve, reject) => {
      if (!config.mailConfig.auth.user || !config.mailConfig.auth.pass) {
         console.log('You need to provide EMAIL_USER and EMAIL_PASSWORD environment variables for sending emails.');
         return resolve('An error occurred while sending an email: (Credentials missing).');
      }

      mailSender.sendMail(
         {
            from: config.mailConfig.auth.user,
            to,
            subject,
            html
         },
         function (err, info) {
            if (err) {
               console.log('An error occurred while sending an email: ', err);
               return reject(err);
            } else {
               return resolve(info);
            }
         }
      );
   });
};

export const buildEmailPayload = (metadata: { greeting: string, mainContent: string, to: string, subject: string}) => {
   return {
      to: metadata.to,
      subject: metadata.subject,
      html: `
<!doctype html>
<html>
   <head>
     <meta name="viewport" content="width=device-width">
     <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
     <title>${metadata.subject}</title>
   </head>
   <body>
     <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px; Margin-top: 20px;">${metadata.greeting},</p>
     <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">${metadata.mainContent}</p>
    </body>
</html>
`}
}
