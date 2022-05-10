const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { metastasisCollectionName } = require('./../utils');

async function getAll() {
  const collection = db.getCollection(metastasisCollectionName);
  const aggCursor = await collection.aggregate([
  {
    $project: {
        _id: 1,
        person: 1,
        main: 1,
        type: 1,
        diagnoseYear: 1,
        metastasis: 1,
        metastasisYear: 1,
        extraTreatment: 1
    }
  }
]);
return await aggCursor.toArray();
}

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