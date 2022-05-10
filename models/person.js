const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const { personsCollectionName } = require('./../utils');
var ageCalculator = require('age-calculator');
let {AgeFromDateString, AgeFromDate} = require('age-calculator');

async function getAll() {
  const collection = db.getCollection(personsCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: 1,
          birthdate: 1,
          age: 1,
          sex: 1,
          jobDetails: 1,
          expositionDetails: 1,
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
          mainDiagnose: {
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
          otherDiagnoses: {
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
          familyDetails: {
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
          localField: "mainDiagnose",
          foreignField: "_id",
          as: "mainDiagnose"
        }
    },
    {
      $lookup: {
        from: "diagnoses",
        localField: "otherDiagnoses",
        foreignField: "_id",
        as: "otherDiagnoses"
      }
  },
    {
        $lookup: {
          from: "relatives",
          localField: "familyDetails",
          foreignField: "_id",
          as: "familyDetails"
        }
    }
  ]);
  return await aggCursor.toArray();
}

async function add(info, tumIds, othDiagIds, relIds, placeIds, workIds, expoIds) {
	//console.log(info);
  try{  
    const collection = db.getCollection(personsCollectionName);
        await collection.insertOne({
            _id: info._id, 
            birthdate: info.demographicDetails.birthdate,
            age: new AgeFromDateString(info.demographicDetails.birthdate).age,
            sex: info.demographicDetails.sex,
            livingPlaces: placeIds,
            mainDiagnose: tumIds,
            otherDiagnoses: othDiagIds,
            expositionDetails: expoIds,
            jobDetails: workIds,
            familyDetails: relIds,
        });
  } catch (error) {
        console.log(error)
        throw error;
  }
}

async function getAgeRanges(){
  const collection = db.getCollection(personsCollectionName);
  const aggCursor = await collection.aggregate([
    {
      '$project': {
        'age': {
          '$subtract': [
            '$age', {
              '$mod': [
                '$age', 1
              ]
            }
          ]
        }, 
        'sex': 1
      }
    }, {
      '$project': {    
        "range": {
           $concat: [
              { $cond: [{$lte: ["$age",0]}, "Unknown", ""]}, 
              { $cond: [{$and:[ {$gt:["$age", 0 ]}, {$lt: ["$age", 18]}, {$eq: ["$sex", "male"]}]}, "1b", ""] },
              { $cond: [{$and:[ {$gt:["$age", 0 ]}, {$lt: ["$age", 18]}, {$eq: ["$sex", "female"]}]}, "1a", ""] },
              { $cond: [{$and:[ {$gte:["$age",18]}, {$lt:["$age", 31]}, {$eq: ["$sex", "female"]}]}, "2a", ""]},
              { $cond: [{$and:[ {$gte:["$age",18]}, {$lt:["$age", 31]}, {$eq: ["$sex", "male"]}]}, "2b", ""]},
              { $cond: [{$and:[ {$gte:["$age",31]}, {$lt:["$age", 51]}, {$eq: ["$sex", "female"]}]}, "3a", ""]},
              { $cond: [{$and:[ {$gte:["$age",31]}, {$lt:["$age", 51]}, {$eq: ["$sex", "male"]}]}, "3b", ""]},
              { $cond: [{$and:[ {$gte:["$age",51]}, {$lt:["$age", 71]}, {$eq: ["$sex", "female"]}]}, "4a", ""]},
              { $cond: [{$and:[ {$gte:["$age",51]}, {$lt:["$age", 71]}, {$eq: ["$sex", "male"]}]}, "4b", ""]},
              { $cond: [{$and:[ {$gte:["$age",71]}, {$eq: ["$sex", "male"]}]}, "5a", ""]},
              { $cond: [{$and:[ {$gte:["$age",71]}, {$eq: ["$sex", "female"]}]}, "5b", ""]}
           ]
        }  
      }
    }, {
      '$group': {
        '_id': {
          'grupo': '$range'
        }, 
        'Total': {
          '$sum': 1
        }
      }
    }, {
      '$sort': { 
        "_id.grupo" : 1 
      }
    }
  ]);
  return await aggCursor.toArray();
}



module.exports = {
  getAll,
  add,
  getAgeRanges
}


