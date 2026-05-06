import nodemailer from "nodemailer";

let transporter = null;

const initializeTransporter = () => {
  if (transporter) {
    return transporter;
  }

  // Configuración por defecto - Usar variables de entorno en producción
  const emailConfig = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true" || false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  // Validar que tenemos credenciales
  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn(
      "[emailService] Email credentials not configured. Email features will not work."
    );
  }

  transporter = nodemailer.createTransport(emailConfig);

  return transporter;
};

const getTransporter = () => {
  if (!transporter) {
    initializeTransporter();
  }
  return transporter;
};

const validateEmailData = (data) => {
  const { to, subject, htmlContent } = data;

  if (!to || !to.trim()) {
    throw new Error("Recipient email is required");
  }

  if (!subject || !subject.trim()) {
    throw new Error("Email subject is required");
  }

  if (!htmlContent) {
    throw new Error("Email content (htmlContent) is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to.trim())) {
    throw new Error("Invalid recipient email format");
  }

  return {
    to: to.trim(),
    subject: subject.trim(),
    htmlContent,
  };
};

const sendEmail = async (emailData) => {
  const { to, subject, htmlContent } = validateEmailData(emailData);

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  try {
    const transporter = getTransporter();

    if (!transporter) {
      throw new Error("Email transporter not initialized");
    }

    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      message: "Email sent successfully",
    };
  } catch (error) {
    console.error("[sendEmail] Error sending email to", to, error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const getWelcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .content { margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Bienvenido a Rolling Commerce</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>¡Gracias por registrarte en Rolling Commerce! Tu cuenta ha sido creada exitosamente.</p>
            <p>Ahora puedes comenzar a explorar nuestros productos y realizar tus compras.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Rolling Commerce. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getOrderConfirmationTemplate = (orderData) => {
  const { orderNumber, userName, total, items, orderDate } = orderData;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .order-number { font-size: 24px; font-weight: bold; margin: 10px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #f0f0f0; font-weight: bold; }
          .total { font-size: 18px; font-weight: bold; text-align: right; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pedido Confirmado</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>¡Tu pedido ha sido confirmado!</p>
            <div class="order-number">Pedido #${orderNumber}</div>
            <p><strong>Fecha:</strong> ${orderDate}</p>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th style="text-align: center;">Cantidad</th>
                  <th style="text-align: right;">Precio Unitario</th>
                  <th style="text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            <div class="total">Total: $${total.toFixed(2)}</div>
            <p>Tu pedido está siendo procesado. Recibirás un email cuando sea enviado.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Rolling Commerce. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getPasswordResetTemplate = (resetLink, userName) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ffc107; color: #333; padding: 20px; text-align: center; border-radius: 5px; }
          .content { margin: 20px 0; }
          .button { display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .warning { background-color: #f0f0f0; padding: 10px; border-left: 4px solid #dc3545; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Recuperar Contraseña</h1>
          </div>
          <div class="content">
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña.</p>
            <a href="${resetLink}" class="button">Restablecer Contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
            <div class="warning">
              <p><strong>Nota de seguridad:</strong> Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá sin cambios.</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 Rolling Commerce. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export {
  initializeTransporter,
  getTransporter,
  sendEmail,
  getWelcomeEmailTemplate,
  getOrderConfirmationTemplate,
  getPasswordResetTemplate,
  validateEmailData,
};
