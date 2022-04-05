const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { personsCollectionName } = require('./../utils');
var mongoose = require('mongoose');


const personSchema = new mongoose.Schema({
    birthdate: {
      type: Date,
      required: [true, 'Birthdate is needed']
    },
    age: {
      type: Number,
      required: [true, 'Age is needed']
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', "No-binary"],
      required: true,
    },
    postalcode: {
        type: Number,
        required: true
    },
    country: {
        type: String
    },
    livingPlaces: {
        type: Array
    },
    tumors: {
        type: Array
    }
});


function checkProperties(person){
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
          _id: 1,
          birthdate: 1,
          age: 1,
          sex: 1,
          postalcode: 1,
          country: 1,
          livingPlaces: {
              $map: {
                  input: "$livingPlaces",
                  as: 'livingPlaces',
                  in: {
                      $convert: {
                          input: '$$livingPlaces',
                          to: 'objectId'
                      }
                  }
              }
          },
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
          from: "livingPlaces",
          localField: "livingPlaces",
          foreignField: "_id",
          as: "livingPlaces"
        },
        $lookup: {
          from: "tumors",
          localField: "tumors",
          foreignField: "_id",
          as: "tumors"
        }
    }

  ]);
  return await aggCursor.toArray();
}

async function add(info) {
	console.log(info);
  try{  
    checkProperties(info);
  }catch (error) {
     throw(error.message);
  } 
  const collection = db.getCollection(personsCollectionName);
  try {
    await collection.insertOne({
      _id: ObjectId(), 
      birthdate: info.birthdate,
      age: info.age,
      sex: info.sex,
      postalcode: info.postalcode,
      country: info.country,
      livingPlaces: info.livingPlaces,
      tumors: info.tumors      
    });
  } catch (error) {
      console.log(error)
      throw error;
  }
}


module.exports = {
  checkProperties,
  getAll,
  add
}


