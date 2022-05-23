const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { tumorsCollectionName } = require('./../utils');

async function getAll() {
  const collection = db.getCollection(tumorsCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: 1,
          person: 1,
          main: 1,
          diagnoseYear: 1,
          type: 1,
          nonMicrocyticSubtype: 1,
          mutation: 1,
          mutationType: 1,
          operatedCancer: 1,
          operationYear: 1,
          extraTreatment: 1,
          hasReceivedComplementaryRadiotherapy: 1,
          radiotherapyTarget: 1,
          isClinicalTrial: 1,
          metastasis: 1,
          metastasisYear: 1,
          notListedMetastasisTreatment: 1,
          metastasisTreatment: 1,
          notListedNoSurgeryTreatment: 1,
          noSurgeryTreatment: 1,
          previousDiseases: 1
      }
    }
  ]);
  return await aggCursor.toArray();
}


async function getMutationTypes() {
  const collection = db.getCollection(tumorsCollectionName);
  const aggCursor = await collection.aggregate([
    {
      '$project': {
        'mutationType': 1
      }
    },
    {
      '$group': {
        '_id': {
          'mutation': '$mutationType'
        }, 
        'Total': {
          '$sum': 1
        }
      }
    }
  ]);
  return await aggCursor.toArray();
   
}

async function add(tumor) {
  const collection = db.getCollection(tumorsCollectionName);
    try{
        await collection.insertOne({
            _id: tumor._id,
            person: tumor.person,
            main: tumor.main,
            diagnoseYear: tumor.diagnoseYear,
            type: tumor.type,
            nonMicrocyticSubtype: tumor.nonmicrocyticSubtype,
            mutation: tumor.mutation,
            mutationType: tumor.mutationType,
            operatedCancer: tumor.operatedCancer,
            operationYear: tumor.operationYear,
            extraTreatment: tumor.extraTreatment,
            hasReceivedComplementaryRadiotherapy: tumor.hasReceivedComplementaryRadiotherapy,
            radiotherapyTarget: tumor.complementaryRadiotherapyTarget,
            isClinicalTrial: tumor.isClinicalTrial,
            metastasis: tumor.metastasis,
            metastasisYear: tumor.metastasisYear,
            notListedMetastasisTreatment: tumor.notListedMetastasisTreatment,
            metastasisTreatment: tumor.metastasisTreatment,
            notListedNoSurgeryTreatment: tumor.notListedNoSurgeryTreatment,
            noSurgeryTreatment: tumor.noSurgeryTreatment,
            previousDiseases: tumor.previousDiseases
        })
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
  getAll,
  add,
  getMutationTypes
}


