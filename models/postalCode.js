const { ObjectId } = require("mongodb");
const db = require('./../app');
const { postalCodeCollectionName } = require('./../utils');


async function getAll() {
    const collection = db.getCollection(postalCodeCollectionName);
    const aggCursor = await collection.aggregate([
        {
          $project: {
              _id: 0,
              provincia: 1,
              poblacion: 1,
              codigopostalid: 1,
              lat: 1,
              lon: 1            
            }
        }
    
      ]);
      return await aggCursor.toArray();
}

module.exports = {
    getAll
  }