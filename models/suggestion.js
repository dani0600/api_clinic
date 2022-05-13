const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { suggestionsCollectionName } = require('./../utils');

async function checkEmail(info){
    const collection = db.getCollection(suggestionsCollectionName);
    var found = collection.findOne({email: info.email})
    if(found){
        throw { 
            code: 400,
            message: 'Suggestions: This user has already sent a suggestion'
        }
    }
}

function checkProperties(info){
    if (!checkString(info.description)) {
        throw { 
            code: 400,
            message: 'Suggestion: The field Description is required and must be a non-empty string'
        }
    }
    if (!checkString(info.name)) {
        throw { 
            code: 400,
            message: 'Suggestion: The field Name is required and must be a non-empty string'
        }
    }
    if (!info.mark || typeof info.mark != 'number' || info.mark < 1 || info.mark > 5) {
        throw { 
            code: 400,
            message: 'Suggestion: The field Mark is required and has to be an integer between 1 and 5'
        }
    }
}

async function getAll() {
  const collection = db.getCollection(suggestionsCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: 1,
          email: 1,
          name: 1,
          mark: 1,
          description: 1
      }
    }
  ]);
  return await aggCursor.toArray();
}

async function add(info) {
    // checkProperties(info);
    // try{
    //     await checkEmail(info);
    // }
    // catch(error){
    //     throw error;
    // }
    const collection = db.getCollection(suggestionsCollectionName);
    try{
        await collection.insertOne({
            _id: ObjectId(),
            name: info.name,
            email: info.email,
            mark: info.mark,
            description: info.description,
        })
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

async function countTotalSuggestions() {
    const collection = db.getCollection(suggestionsCollectionName);
    let sum = 0;
    try{
        sum = await collection.estimatedDocumentCount();
    }
    catch(error){
        throw error;
    }
    return sum;    
}

async function getAvgMark(){
    const collection = db.getCollection(suggestionsCollectionName);
    const aggCursor = await collection.aggregate([
        {
            $group: { 
                _id: null, 
                avg_mark:{
                    $avg: '$mark'
                },            
                "5_star_ratings": {
                    $sum: {
                        $cond: [ { $eq: [ "$mark", 5 ] }, 1, 0 ]
                    }
                },
                "4_star_ratings": {
                    $sum: {
                        $cond: [ { $eq: [ "$mark", 4 ] }, 1, 0 ]
                    }
                },
                "3_star_ratings": {
                    $sum: {
                        "$cond": [ { "$eq": [ "$mark", 3 ] }, 1, 0 ]
                    }
                },
                "2_star_ratings": {
                    $sum: {
                        $cond: [ { $eq: [ "$mark", 2 ] }, 1, 0 ]
                    }
                },
                "1_star_ratings": {
                    $sum: {
                        $cond: [ { $eq: [ "$mark", 1 ] }, 1, 0 ]
                    }
                }           
            }  
        }
    ])
    return await aggCursor.toArray();
}

module.exports = {
    checkEmail,
    getAll,
    getAvgMark,
    countTotalSuggestions,
    add
}


