// import nodemailer from "nodemailer";

// export async function sendEmail(to: string, subject: string, html: string, text?: string) {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT),
//       secure: process.env.SMTP_PORT === "465", // true for port 465, false for 587
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const info = await transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to,
//       subject,
//       text: text || html.replace(/<[^>]+>/g, ""), // fallback to plain text
//       html,
//     });

//     console.log("✅ Email sent:", info.messageId);
//     return info;
//   } catch (err) {
//     console.error("❌ Error sending email:", err);
//     throw err;
//   }
// }

import nodemailer from "nodemailer";

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    text,
  });
}
