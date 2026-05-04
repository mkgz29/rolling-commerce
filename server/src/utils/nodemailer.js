import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_EMAIL),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: "noreply@rolling-commerce.com",
      to,
      subject,
      text,
      html:
        "<h1>Tu pedido ha sido confirmado</h1><p>Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
