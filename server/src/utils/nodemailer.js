import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@rolling-commerce.com",
      to,
      subject,
      text,
      html:
        html ||
        `
        <h1>Tu pedido ha sido confirmado</h1>
        <p>Gracias por tu compra. Tu pedido ha sido procesado exitosamente.</p>
      `,
    });

    console.log("Message sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error al enviar el correo");
  }
};