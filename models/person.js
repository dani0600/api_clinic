const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { personsCollectionName } = require('./../utils');

async function checkProperties(person){
  if (typeof person.birthdate !== 'date') {
      throw { 
          code: 400,
          message: 'Route: The field birthdate is required and must be a date'
      }
  }
  if (typeof person.age !== 'number') {
      throw { 
          code: 400,
          message: 'Route: The field age is required and must be a number'
      }
  }
  if (!checkString(person.sex)) {
      throw { 
          code: 400,
          message: 'Route: The field sex is required and must be a non-empty string'
      }
  }
  if (!checkString(person.postalcode)) {
      throw { 
          code: 400,
          message: 'Route: The field Postal Code is required and must be a non-empty string'
      }
  }
  if (!checkString(person.country)) {
    throw { 
        code: 400,
        message: 'Route: The field country is required and must be a non-empty string'
    }
  }
  if (!person.livingPlaces || !Array.isArray(person.livingPlaces) || person.livingPlaces.length === 0) {
      throw { 
          code: 400,
          message: 'Route: The field Living Places is required and must be an array of at least an element'
      }
  }
  if (!person.tumors || !Array.isArray(person.tumors) || person.tumors.length === 0) {
    throw { 
        code: 400,
        message: 'Route: The field tumors is required and must be an array of at least an element'
    }
  }
}

async function getAll() {
    const collection = db.getCollection(personsCollectionName);
    const aggCursor = await collection.aggregate([
        {
            $project: {
                name: '$name'             
            }
        },
        {
            $sort: {
                name: 1
            }
        }
    ]);
    return await aggCursor.toArray();
}


module.exports = {
  checkProperties,
  getAll
}


