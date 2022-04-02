const { MongoClient } = require("mongodb");

const mongoAddress = process.env.MONGO_ADDRESS || "cluster0.izfjc.mongodb.net/api-clinic?retryWrites=true&w=majority";
const mongoUser = encodeURIComponent(process.env.MONGO_USER || "pae2022");
const mongoPass = encodeURIComponent(process.env.MONGO_PASS || "PAE_2022");
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
