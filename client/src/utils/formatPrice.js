export const formatPrice = (value, currency = 'USD') => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export default formatPrice;
