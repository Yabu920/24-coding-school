import nodemailer from "nodemailer";

async function sendTest() {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Test Mail" <${process.env.EMAIL_USER}>`,
      to: "yourtestemail@gmail.com",
      subject: "SMTP Test",
      text: "This is a test email from Next.js + Nodemailer!",
    });

    console.log("✅ Message sent:", info.messageId);
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED ✅" : "MISSING ❌");

  } catch (err) {
    console.error("❌ Failed:", err);
  }
}

sendTest();
