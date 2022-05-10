const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { expositionsCollectionName } = require('./../utils');

async function getAll() {}

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


module.exports = {
    getAll,
    add
}