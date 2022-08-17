const password =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
const cpf = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
export const regexHelper = {
  password,
  cpf,
};
