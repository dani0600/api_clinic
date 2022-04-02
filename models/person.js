const { ObjectId } = require("mongodb");
const db = require('./../app');
const { personsCollectionName } = require('./../utils');

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
  getAll
}


