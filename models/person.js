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

function checkDocumentProperties(person){
  if (!checkString(person.birthdate)) {
      throw { 
          code: 400,
          message: 'Route: The field birthdate is required and must be a string'
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
  if (!person.worklife || !Array.isArray(person.worklife) || person.worklife.length === 0) {
    throw { 
        code: 400,
        message: 'Route: The field tumors is required and must be an array of at least an element'
    }
  }
  checkToxics(person.toxics);
}

function checkToxics(toxics){
  if (typeof toxics.smoker !== 'boolean') {
    throw { 
        code: 400,
        message: 'Route: The field smoker is required and must be a boolean'
    }
  }
  if(toxics.smoker && typeof toxics.startAge !== 'number'){
    throw { 
      code: 400,
      message: 'Route: The field Start Age is required and must be a number'
    }
  }
  if(toxics.smoker && typeof toxics.endAge !== 'number'){
    throw { 
      code: 400,
      message: 'Route: The field End Age is required and must be a number'
    }
  }
  if(toxics.smoker && typeof toxics.avgCigarrettes !== 'number'){
    throw { 
      code: 400,
      message: 'Route: The field Average Cigarrettes is required and must be a number'
    }
  }
  if (!toxics.otherProducts || !Array.isArray(toxics.otherProducts)) {
    throw { 
        code: 400,
        message: 'Route: The field Living Places is required and must be an array of at least an element'
    }
  }
  if (typeof toxics.nearbyRoad !== 'boolean') {
    throw { 
        code: 400,
        message: 'Route: The field Nearby Road is required and must be a boolean'
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
          carcinomes: 1,
          worklife: 1,
          toxics: 1,
          lungDiseases: 1,
          livingplaces: {
              $map: {
                  input: "$livingplaces",
                  as: 'livingplaces',
                  in: {
                      $convert: {
                          input: '$$livingplaces',
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
          },
          relatives: {
              $map: {
                  input: "$relatives",
                  as: 'relatives',
                  in: {
                      $convert: {
                          input: '$$relatives',
                          to: 'objectId'
                      }
                  }
              }
          }
      }
    },
    {
        $lookup: {
          from: "livingplaces",
          localField: "livingplaces",
          foreignField: "_id",
          as: "livingplaces"
        },
    },
    {
        $lookup: {
          from: "tumors",
          localField: "tumors",
          foreignField: "_id",
          as: "tumors"
        }
    },
    {
        $lookup: {
          from: "relatives",
          localField: "relatives",
          foreignField: "_id",
          as: "relatives"
        }
    }
  ]);
  return await aggCursor.toArray();
}

async function add(info, tumIds, relIds, placeIds, workObj) {
	console.log(info);
  try{  
    const collection = db.getCollection(personsCollectionName);
        await collection.insertOne({
            _id: info._id, 
            birthdate: info.birthdate,
            age: info.age,
            sex: info.sex,
            postalcode: info.postalcode,
            country: info.country,
            livingplaces: placeIds,
            tumors: tumIds,
            lungDiseases: info.lungDiseases,
            toxics: {
                smoker: info.toxics.smoker,
                startAge: info.toxics.smoker ? info.toxics.startAge : null,
                endAge:  info.toxics.smoker ? info.toxics.endAge : null,
                avgCigarrettes: info.toxics.smoker ? info.toxics.avgCigarrettes : null,
                otherProducts: info.toxics.otherProducts,
                nearbyRoad: info.toxics.nearbyRoad
            },
            worklife: workObj,
            carcinomas: info.carcinomas,
            relatives: relIds,
        });
  } catch (error) {
        console.log(error)
        throw error;
  }
}

async function addDocument(info) {
	console.log(info);
  try{  
    checkDocumentProperties(info);
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
      livingplaces: info.livingplaces,
      tumors: info.tumors,
      lungDiseases: info.lungDiseases,
      toxics: {
        smoker: info.toxics.smoker,
        startAge: info.toxics.smoker ? info.toxics.startAge : null,
        endAge:  info.toxics.smoker ? info.toxics.endAge : null,
        avgCigarrettes: info.toxics.smoker ? info.toxics.avgCigarrettes : null,
        otherProducts: info.toxics.otherProducts,
        nearbyRoad: info.toxics.nearbyRoad
      },
      worklife: info.worklife,
      carcinomas: info.carcinomas,
      relatives: info.relatives,
    });
  } catch (error) {
      console.log(error)
      throw error;
  }
}


module.exports = {
  checkProperties,
  getAll,
  add,
  addDocument
}


