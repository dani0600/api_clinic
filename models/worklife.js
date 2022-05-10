const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { worklifesCollectionName } = require('./../utils');

async function getAll() {}

async function add(info){
  const collection = db.getCollection(worklifesCollectionName);
  try{
      await collection.insertOne({
        _id: info._id,
        person: info.person,
        job: info.job,
        initialYear: info.initialYear,
        endYear: info.endYear,
        isProtected: info.isProtected,
        currentJob: info.currentJob
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