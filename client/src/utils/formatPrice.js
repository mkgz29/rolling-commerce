const formatPrice = (value) => {
  if (typeof value !== "number") return "$0";

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(value);
};

export default formatPrice;