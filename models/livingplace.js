const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { livingPlacesCollectionName } = require('./../utils');


async function getAll() {
  const collection = db.getCollection(livingPlacesCollectionName);
  const aggCursor = await collection.aggregate([
  {
      $project: {
          _id: 1,
          city: 1,
          postalCode: 1,
          yearOfStart: 1,
          yearOfEnd: 1,
          isPresent: 1,            
      }
  }
  
  ]);
  return await aggCursor.toArray();
}

async function add(place){
  const collection = db.getCollection(livingPlacesCollectionName);
    try{
        await collection.insertOne({
            _id: place._id,
            person: place.person,
            country: place.country,
            city: place.city,
            postalCode: place.postalCode,
            yearOfStart: place.yearOfStart,
            yearOfEnd: place.yearOfEnd,
            isPresent: place.isPresent 
        })
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

async function getNumberPeopleByCity(){
  const collection = db.getCollection(livingPlacesCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $unwind: '$city'
    },
    { 
      $match : { 
          isPresent : true 
      }
    },
    {
      $group: {
          _id: '$city', 
          sum: {
              $sum: 1
          }
      }
    }
  ]);
  return await aggCursor.toArray();
}


module.exports = {
    getAll,
    getNumberPeopleByCity,
    add
  }