export const VALIDATION_LIMITS = {
  name: 40,
  firstName: 40,
  lastName: 40,
  fullName: 80,
  email: 60,
  password: 72,
  phone: 20,
  address: 100,
  city: 50,
  province: 50,
  country: 50,
  productName: 60,
  productTitle: 60,
  productDescription: 500,
  comments: 300,
  notes: 300,
  zip: 20,
  search: 60,
};

export const NUMBER_LIMITS = {
  quantity: { min: 0, max: 99 },
  price: { min: 0, max: 999999999 },
  stock: { min: 0, max: 99999 },
};
