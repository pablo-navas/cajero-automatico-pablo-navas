// Clase Base
class Account {
  constructor(accountNumber, owner, balance) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.balance = balance;
  }

  // Método polimórfico base
  calculateFee(amount) {
    return 0;
  }

  canWithdraw(amount) {
    return this.balance >= amount;
  }
}

// Cuenta de Ahorro (Hereda de Account)
class SavingsAccount extends Account {
  constructor(accountNumber, owner, balance, interestRate = 0.02) {
    super(accountNumber, owner, balance);
    this.interestRate = interestRate;
  }

  // Polimorfia: Exige un saldo mínimo en cuenta
  canWithdraw(amount) {
    const minBalance = 50;
    return (this.balance - amount) >= minBalance;
  }

  calculateFee(amount) {
    return amount > 500 ? 2.5 : 0;
  }
}

// Cuenta Monetaria (Hereda de Account)
class CheckingAccount extends Account {
  constructor(accountNumber, owner, balance, overdraftLimit = 200) {
    super(accountNumber, owner, balance);
    this.overdraftLimit = overdraftLimit;
  }

  // Polimorfismo: Permite sobregiro hasta cierto límite
  canWithdraw(amount) {
    return (this.balance + this.overdraftLimit) >= amount;
  }

  calculateFee(amount) {
    return 1.5; 
  }
}

module.exports = { Account, SavingsAccount, CheckingAccount };