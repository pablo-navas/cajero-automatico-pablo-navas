const readline = require('readline');

const createPrompt = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const ask = (question) => new Promise((resolve) => rl.question(question, resolve));
  const close = () => rl.close();

  return { ask, close };
};

const printMenu = () => {
  console.log('++++CAJERO AUTOMÁTICO+++++');
  console.log('1. Consultar Detalle de Cuenta');
  console.log('2. Realizar Transferencia');
  console.log('3. Ver Métricas e Historial');
  console.log('4. Salir :b');
};

module.exports = { createPrompt, printMenu };