const validateAmount = (amount) => {
  const parsed = Number(amount);
  if (isNaN(parsed) || parsed <= 0) {
    throw new Error('El monto ingresado debe ser un número mayor a cero.');
  } return parsed};

const validateAccountNumber = (accNumber) => {
  const cleaned = String(accNumber).trim();
  if (cleaned.length < 5) {
    throw new Error('El número debe tener al menos 5 caracteres.');
  }
  return cleaned}

module.exports = { validateAmount, validateAccountNumber };
