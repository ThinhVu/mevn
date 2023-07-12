import nodemailer from 'nodemailer';
import _ from 'lodash';

let mailSender, mailConfig: any;
try {
   mailConfig = {
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT || 587,
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASSWORD,
      },
      secureConnection: false,
      secure: false, // process.env.NODE_ENV === 'production',
      tls: {ciphers: 'SSLv3'},
   }
   console.log('[email] init mail config')
   mailSender = nodemailer.createTransport(mailConfig)
} catch (e) {
   console.error('[email] failed to initialize mail sender', e)
}

export const sendEmail = ({to, subject, html = undefined, text = undefined}) => {
   return new Promise((resolve, reject) => {
      if (!mailConfig.auth.user || !mailConfig.auth.pass) {
         console.log('[email] You need to provide EMAIL_USER and EMAIL_PASSWORD environment variables for sending emails.');
         return resolve('An error occurred while sending an email: (Credentials missing).');
      }

      const mailData = _.omitBy({
         from: mailConfig.auth.user,
         to,
         subject,
         html,
         text
      }, _.isNil)
      mailSender.sendMail(mailData, function (err, info) {
            if (err) {
               console.log('[email] An error occurred while sending an email: ', err);
               return reject(err);
            } else {
               return resolve(info);
            }
         }
      );
   });
};

export const buildEmailPayload = (metadata: { content: string, to: string, subject: string }) => {
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
     <pre style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px;">${metadata.content}</pre>
    </body>
</html>
`
   }
}
