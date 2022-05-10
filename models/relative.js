const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { relativesCollectionName } = require('./../utils');

function checkProperties(relative){
  if (!checkString(relative.relation)) {
      throw { 
          code: 400,
          message: 'Relative: The field birthdate is required and must be a date'
      }
  }
  if (typeof relative.age !== 'number') {
      throw { 
          code: 400,
          message: 'Relative: The field age is required and must be a number'
      }
  }
  if (typeof relative.alive !== 'boolean') {
      throw { 
          code: 400,
          message: 'Relative: The field sex is required and must be a non-empty string'
      }
  }
  if (!relative.alive && typeof relative.ageOfDeath !== 'number') {
      throw { 
          code: 400,
          message: 'Relative: The field Age of Death is required and must be a number'
      }
  }
  if (!relative.tumor) {
    throw { 
        code: 400,
        message: 'Relative: The field tumor is required and must be an object of type Tumor'
    }
  }
}

async function getAll() {
  const collection = db.getCollection(relativesCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: 1,
          relation: 1,
          age: 1,
          survived: 1,
          ageOfDeath: 1,
          isDeathRelatedToCancer: 1,
          tumors: {
            $map: {
                input: "$tumors",
                as: 'tumors',
                in: {
                    $convert: {
                        input: '$$tumors',
                        to: 'objectId'
                    }
                }
            }
        }
        }
    },
    {
        $lookup: {
          from: "metastasis",
          localField: "tumors",
          foreignField: "_id",
          as: "tumors"
        }
    }

  ]);
  return await aggCursor.toArray();
}

async function add(relative) {
	const collection = db.getCollection(relativesCollectionName);
    try{
        await collection.insertOne({
            _id: relative._id,
            person: relative.person,
            relation: relative.relation,
            age: relative.age,
            ageOfDeath: relative.ageOfDeath,
            survived: relative.survived,
            isDeathRelatedToCancer: relative.isDeathRelatedToCancer, 
            tumors: relative.diagnose
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


