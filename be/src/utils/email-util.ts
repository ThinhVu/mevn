import nodemailer from 'nodemailer';

const mailConfig = {
   host: 'smtp.gmail.com',
   port: 587,
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
   },
   secureConnection: false,
   secure: false, // process.env.NODE_ENV === 'production',
   tls: {ciphers: 'SSLv3'},
}

let mailSender;
try {
   console.log('[email] init mail config')
   mailSender = nodemailer.createTransport(mailConfig)
} catch (e) {
   console.error('[email] failed to initialize mail sender', e)
}

export const sendEmail = ({to, subject, html}) => {
   return new Promise((resolve, reject) => {
      if (!mailConfig.auth.user || !mailConfig.auth.pass) {
         console.log('[email] You need to provide EMAIL_USER and EMAIL_PASSWORD environment variables for sending emails.');
         return resolve('An error occurred while sending an email: (Credentials missing).');
      }

      mailSender.sendMail(
         {
            from: mailConfig.auth.user,
            to,
            subject,
            html
         },
         function (err, info) {
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

export const buildEmailPayload = (metadata: { greeting: string, mainContent: string, to: string, subject: string }) => {
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
`
   }
}
