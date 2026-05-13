import { MercadoPagoConfig } from "mercadopago";

const getEnvValue = (name) => process.env[name]?.trim();

export const getMercadoPagoAccessTokenInfo = () => {
  const accessToken = getEnvValue("MERCADOPAGO_ACCESS_TOKEN") || getEnvValue("MERCADO_PAGO_ACCESS_TOKEN") || "";

  return {
    exists: Boolean(accessToken),
    prefix: accessToken.startsWith("TEST-")
      ? "TEST-"
      : accessToken.startsWith("APP_USR-")
        ? "APP_USR-"
        : accessToken
          ? "unknown"
          : "missing",
    source: getEnvValue("MERCADOPAGO_ACCESS_TOKEN")
      ? "MERCADOPAGO_ACCESS_TOKEN"
      : getEnvValue("MERCADO_PAGO_ACCESS_TOKEN")
        ? "MERCADO_PAGO_ACCESS_TOKEN"
        : "missing",
  };
};

export const getMercadoPagoAccessToken = () => {
  const accessToken = getEnvValue("MERCADOPAGO_ACCESS_TOKEN") || getEnvValue("MERCADO_PAGO_ACCESS_TOKEN");

  if (!accessToken) {
    throw new Error("Missing MERCADOPAGO_ACCESS_TOKEN");
  }

  return accessToken;
};

export const hasMercadoPagoAccessToken = () => Boolean(getEnvValue("MERCADOPAGO_ACCESS_TOKEN") || getEnvValue("MERCADO_PAGO_ACCESS_TOKEN"));

export const createMercadoPagoClient = () =>
  new MercadoPagoConfig({
    accessToken: getMercadoPagoAccessToken(),
    options: { timeout: 5000 },
  });
