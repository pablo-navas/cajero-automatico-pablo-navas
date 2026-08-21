const { connectDB, client } = require('./db');
const AccountRepository = require('./repositories/AccountRepository');
const AccountFactory = require('./patterns/AccountFactory');
const { validateAmount, validateAccountNumber } = require('./validations');
const { createPrompt, printMenu } = require('./menu');

const handleTransfer = async (prompt, repo) => {
  try {
    const rawFrom = await prompt.ask('Cuenta Origen: ');
    const fromAcc = validateAccountNumber(rawFrom);

    const rawTo = await prompt.ask('Cuenta Destino: ');
    const toAcc = validateAccountNumber(rawTo);

    const rawAmount = await prompt.ask('Monto a transferir: ');
    const amount = validateAmount(rawAmount);

    const doc = await repo.findByNumber(fromAcc);
    if (!doc) {
      console.log('Error: La cuenta origen no fue encontrada.');
      return;
    }

    const accountInstance = AccountFactory.createAccount(doc);

    if (!accountInstance.canWithdraw(amount)) {
      console.log('Operación Invalidad: Fondos/Límites insuficientes según reglas del tipo de cuenta.');
      return;
    }

    const fee = accountInstance.calculateFee(amount);
    console.log(`ℹTarifa de transacción aplicada: $${fee}`);

    await repo.executeTransfer(fromAcc, toAcc, amount, fee);
    console.log(' Transferencia realizada exitosamente bajo sesión atómica.');
  } catch (error) {
    console.log(` Error durante la transacción: ${error.message}`);
  }
};

const handleMetrics = async (prompt, repo) => {
  try {
    const rawAcc = await prompt.ask('Ingrese el número de cuenta: ');
    const accNumber = validateAccountNumber(rawAcc);
    
    const report = await repo.getAdvancedMetrics(accNumber);
    console.log('\n--- REPORTES Y MÉTRICAS AVANZADAS ---');
    console.log(JSON.stringify(report, null, 2));
  } catch (error) {
    console.log(` Error al obtener datos: ${error.message}`);
  }
};

// Bucle Recursivo para garantizar CERO uso de 'let'
const mainLoop = async (prompt, repo) => {
  printMenu();
  const option = await prompt.ask('Seleccione una opción: ');

  if (option === '1') {
    try {
      const rawAcc = await prompt.ask('Número de cuenta: ');
      const accNumber = validateAccountNumber(rawAcc);
      const doc = await repo.findByNumber(accNumber);
      
      if (doc) {
        const account = AccountFactory.createAccount(doc);
        console.log(`\nCuenta: ${account.accountNumber} | Titular: ${account.owner} | Saldo: $${account.balance}`);
      } else {
        console.log(' Cuenta no encontrada.');
      }
    } catch (err) {
      console.log(` Error: ${err.message}`);
    }
    return mainLoop(prompt, repo);
  }

  if (option === '2') {
    await handleTransfer(prompt, repo);
    return mainLoop(prompt, repo);
  }

  if (option === '3') {
    await handleMetrics(prompt, repo);
    return mainLoop(prompt, repo);
  }

  if (option === '4') {
    console.log('Cerrando el sistema del cajero...');
    prompt.close();
    await client.close();
    return;
  }

  console.log('Opción no válida.');
  return mainLoop(prompt, repo);
};

const startApp = async () => {
  try {
    const db = await connectDB();
    const repo = new AccountRepository(db, client);
    const prompt = createPrompt();
    await mainLoop(prompt, repo);
  } catch (error) {
    console.error('Error crítico al iniciar la app:', error);
  }
};

startApp();