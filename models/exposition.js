const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { expositionsCollectionName } = require('./../utils');

async function getAll() {
    const collection = db.getCollection(expositionsCollectionName);
    const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: 1,
          person: 1,
          smoker: 1,
          startAge: 1,
          endAge: 1,
          avgCigarrettes: 1,
          otherProducts: 1,
          nearbyRoad: 1,
          expositions: 1
      }
    }
  ]);
  return await aggCursor.toArray();
}

async function add(info){
  const collection = db.getCollection(expositionsCollectionName);
  try{
      await collection.insertOne({
        _id: info._id,
        person: info.person,
        smoker: info.smoker,
        startAge: info.startAge,
        endAge: info.endAge,
        avgCigarrettes: info.avgCigarrettes,
        otherProducts: info.otherProducts,
        nearbyRoad: info.nearbyRoad,
        expositions: info.expositions
      })
  }
  catch(error){
      console.log(error);
      throw error;
  }
}

async function getClassifiedExpositions(){
  const collection = db.getCollection(expositionsCollectionName);
    const aggCursor = await collection.aggregate([
        {
          '$project': {
            'expositions': 1
          }
        }, {
          '$unwind': {
            'path': '$expositions'
          }
        }, {
          '$group': {
            '_id': {
              'expositions': '$expositions'
            }, 
            'Total': {
              '$sum': 1
            }
          }
        }
      ]);
      return await aggCursor.toArray();

}


module.exports = {
    getAll,
    add,
    getClassifiedExpositions
}