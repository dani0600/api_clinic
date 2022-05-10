const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { metastasisCollectionName } = require('./../utils');

async function getAll() {}

async function add(diagnose){
  const collection = db.getCollection(metastasisCollectionName);
  try{
      await collection.insertOne({
        _id: diagnose._id,
        person: diagnose.person,
        main: diagnose.main,
        type: diagnose.type,
        diagnoseYear: diagnose.diagnoseYear,
        metastasis: diagnose.metastasis,
        metastasisYear: diagnose.metastasisYear,
        extraTreatment: diagnose.extraTreatment
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