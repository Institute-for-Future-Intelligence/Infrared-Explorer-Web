export const kelvinToCelsius = (temp: number) => {
  return temp - 273.15;
};

export const fahrenheitToCelsius = (temp: number) => {
  return ((temp - 32) * 5) / 9;
};

export const celsiusToFahrenheit = (temp: number) => {
  return temp * (9 / 5) + 32;
};
