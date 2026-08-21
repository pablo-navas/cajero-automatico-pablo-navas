const { SavingsAccount, CheckingAccount } = require('../models/Account');

class AccountFactory {
  static createAccount(doc) {
    if (doc.type === 'SAVINGS') {
      return new SavingsAccount(doc.accountNumber, doc.owner, doc.balance, doc.interestRate);
    }
    if (doc.type === 'CHECKING') {
      return new CheckingAccount(doc.accountNumber, doc.owner, doc.balance, doc.overdraftLimit);
    }
    throw new Error(`Tipo de cuenta '${doc.type}' no reconocido.`);
  }
}

module.exports = AccountFactory;