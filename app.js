const { MongoClient } = require("mongodb");
require("dotenv").config();

const mongoAddress = process.env.MONGO_ADDRESS;
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPass = encodeURIComponent(process.env.MONGO_PASS);
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoAddress}`;

const mongoClient = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let database;

async function connect() {
    await mongoClient.connect();
    database = mongoClient.db('api-clinic');
}

function getCollection(name) {
    return database.collection(name);
}

module.exports = {
    connect,
    getCollection
}
