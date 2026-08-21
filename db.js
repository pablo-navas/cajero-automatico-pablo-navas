const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

const connectDB = async () => {
  await client.connect();
  console.log(' Conexión exitosa a MongoDB.');
  return client.db('cajero_autonomo');
};

module.exports = { connectDB, client };