export const BASE_URL = 'https://www.demoblaze.com/';

export const loginData = {
  valid: {
    username: 'testuser123asdsds',
    password: 'Test@1234',
  },
  invalid: {
    username: 'nonexistent9x7k2m',
    password: 'wrongpassword',
  },
  empty: {
    username: '',
    password: '',
  },
  usernameOnly: {
    username: 'someuser',
    password: '',
  },
};

export const checkoutData = {
  name: 'John Doe',
  country: 'Indonesia',
  city: 'Jakarta',
  card: '4111111111111111',
  month: '12',
  year: '2028',
};

export const productCategories = ['Phones', 'Laptops', 'Monitors'];

export const specificProduct = 'Samsung galaxy s6';
