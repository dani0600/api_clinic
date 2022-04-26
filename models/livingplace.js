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
            postalCode: 1,
            yearOfStart: 1,
            yearOfEnd: 1,
            isPresent: 1,            
          }
      }
  
    ]);
    return await aggCursor.toArray();
  }


module.exports = {
    getAll
  }