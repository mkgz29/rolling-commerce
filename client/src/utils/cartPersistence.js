const PAYMENT_SUCCESS_CART_CLEAR_KEY = 'rolling-commerce-payment-success-cart-clear-pending';

const LEGACY_CART_STORAGE_KEYS = [
  'rolling-commerce-cart',
  'rolling-commerce-cart-items',
  'cart',
  'cartItems',
  'shoppingCart',
];

export const markPaymentSuccessCartClearPending = () => {
  localStorage.setItem(PAYMENT_SUCCESS_CART_CLEAR_KEY, 'true');
};

export const clearPaymentSuccessCartClearPending = () => {
  localStorage.removeItem(PAYMENT_SUCCESS_CART_CLEAR_KEY);
};

export const hasPaymentSuccessCartClearPending = () =>
  localStorage.getItem(PAYMENT_SUCCESS_CART_CLEAR_KEY) === 'true';

export const clearPersistedCartStorage = () => {
  LEGACY_CART_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
};
