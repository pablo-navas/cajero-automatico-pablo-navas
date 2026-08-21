class AccountRepository {
  constructor(db, client) {
    this.accountsCollection = db.collection('accounts');
    this.transactionsCollection = db.collection('transactions');
    this.client = client;
  }
  async findByNumber(accountNumber) {
    const doc = await this.accountsCollection.findOne({ accountNumber });
    return doc;
  }
  // Persistencia con Transacciones ACID
  async executeTransfer(fromAccNumber, toAccNumber, amount, fee) {
    const session = this.client.startSession();
    try {
      session.startTransaction();

      const totalDeduct = amount + fee;

      const updateFrom = await this.accountsCollection.updateOne(
        { accountNumber: fromAccNumber, balance: { $gte: totalDeduct } },
        { $inc: { balance: -totalDeduct } },
        { session }
      );

      if (updateFrom.modifiedCount === 0) {
        throw new Error('Fondos insuficientes para cubrir el monto y la comisión.');
      }

      const updateTo = await this.accountsCollection.updateOne(
        { accountNumber: toAccNumber },
        { $inc: { balance: amount } },
        { session }
      );

      if (updateTo.modifiedCount === 0) {
        throw new Error('La cuenta destino no existe.');
      }

      await this.transactionsCollection.insertOne(
        {
          fromAccNumber,
          toAccNumber,
          amount,
          fee,
          timestamp: new Date(),
          type: 'TRANSFER'
        },
        { session }
      );

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  // Consulta Avanzada utilizando Aggregation Pipeline
  async getAdvancedMetrics(accountNumber) {
    const pipeline = [
      {
        $match: {
          $or: [{ fromAccNumber: accountNumber }, { toAccNumber: accountNumber }]}
      },

      {
        $facet: {
          metrics: [
            {
              $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalAmountTransferred: { $sum: '$amount' },
                averageAmount: { $avg: '$amount' },
                maxAmount: { $max: '$amount' }
              }
            }
          ],
          
          recentHistory: [
            { $sort: { timestamp: -1 } },
            { $limit: 3 }
          ]
        }
      }
    ];

    const result = await this.transactionsCollection.aggregate(pipeline).toArray();
    return result[0];
  }}

module.exports = AccountRepository;