const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { tumorsCollectionName } = require('./../utils');

function checkProperties(tumor){
  if (!checkString(tumor.person)) {
      throw { 
          code: 400,
          message: 'Route: The field birthdate is required and must be a date'
      }
  }
  if (typeof tumor.main !== 'boolean') {
      throw { 
          code: 400,
          message: 'Route: The field age is required and must be a number'
      }
  }
  if (typeof tumor.diagnoseYear !== 'date') {
      throw { 
          code: 400,
          message: 'Route: The field Postal Code is required and must be a non-empty string'
      }
  }
  if (!checkString(tumor.type)) {
    throw { 
        code: 400,
        message: 'Route: The field country is required and must be a non-empty string'
    }
  }
  if (!checkString(tumor.surgery)) {
    throw { 
        code: 400,
        message: 'Route: The field country is required and must be a non-empty string'
    }
  }
  if (!checkString(tumor.metastasis)) {
    throw { 
        code: 400,
        message: 'Route: The field country is required and must be a non-empty string'
    }
  }
  if (!tumor.mutations || !Array.isArray(tumor.mutations) || tumor.mutations.length === 0) {
      throw { 
          code: 400,
          message: 'Route: The field Living Places is required and must be an array of at least an element'
      }
  }
  if (!tumor.treatments || !Array.isArray(tumor.treatments) || tumor.treatments.length === 0) {
    throw { 
        code: 400,
        message: 'Route: The field Living Places is required and must be an array of at least an element'
    }
  }
}

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
          surgery: 1,
          mutations: 1,
          metastasis: {
            $map: {
                input: "$metastasis",
                as: 'metastasis',
                in: {
                    $convert: {
                        input: '$$metastasis',
                        to: 'objectId'
                    }
                }
            }
        }
        }
    },
    {
        $lookup: {
          from: "tumors",
          localField: "metastasis",
          foreignField: "_id",
          as: "metastasis"
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
            surgery: tumor.surgery,
            mutations: tumor.mutations,
            metastasis: tumor.metastasis
        })
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

module.exports = {
  checkProperties,
  getAll,
  add
}


