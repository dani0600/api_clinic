const mongoose = require('mongoose');
require('dotenv').config();

let count = 0;

const mongoAddress = process.env.MONGO_USER_ADDRESS;
const mongoUser = encodeURIComponent(process.env.MONGO_USER);
const mongoPass = encodeURIComponent(process.env.MONGO_PASS);
const mongoUri = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoAddress}`;

const options = {
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    // all other approaches are now deprecated by MongoDB:
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
    
};

// const connectWithRetry = () => {
//     console.log('Mongoose User DB connection with retry')
//     mongoose.connect(mongoUri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         serverSelectionTimeoutMS: 5000
//     }).catch(err => console.log(err.reason));
// };

async function start() {
    try{
        mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        }).catch(err => console.log(err.reason));
    }
    catch (error) {
        console.error(error);
    }
}

exports.mongoose = mongoose;

module.exports = {
    start
}