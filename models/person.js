const db = require('./../app');
const { personsCollectionName } = require('./../utils');
let {AgeFromDateString} = require('age-calculator');
const { ObjectId } = require('mongoose');


async function getAll() {
  const collection = db.getCollection(personsCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: 1,
          birthdate: 1,
          age: 1,
          sex: 1,
          jobDetails: {
            $map: {
                input: "$jobDetails",
                as: 'worklife',
                in: {
                    $convert: {
                        input: '$$worklife',
                        to: 'objectId'
                    }
                }
            }
          },
          expositionDetails: {
            $map: {
                input: "$expositionDetails",
                as: 'exposition',
                in: {
                    $convert: {
                        input: '$$exposition',
                        to: 'objectId'
                    }
                }
            }
          },
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
          mainDiagnose: {
              $map: {
                  input: "$mainDiagnose",
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
                  input: "$otherDiagnoses",
                  as: 'metastasis',
                  in: {
                      $convert: {
                          input: '$$metastasis',
                          to: 'objectId'
                      }
                  }
              }
          },
          familyDetails: {
              $map: {
                  input: "$familyDetails",
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
          localField: "livingPlaces",
          foreignField: "_id",
          as: "livingPlaces"
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
            from: "metastasis",
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
    },
    {
        $lookup: {
          from: "worklifes",
          localField: "jobDetails",
          foreignField: "_id",
          as: "jobDetails"
        }
    },
    {
        $lookup: {
          from: "expositions",
          localField: "expositionDetails",
          foreignField: "_id",
          as: "expositionDetails"
        }
    }
  ]);
  return await aggCursor.toArray();
}

async function deleteForm(idPerson){
  var myquery = { _id: new ObjectId(idPerson)};
  db.getCollection(personsCollectionName).deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log(obj);
  });
}
async function getLocations() {
  const collection = db.getCollection(personsCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: 1,
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
          }
        }
    },
    {
        $lookup: {
          from: "livingplaces",
          localField: "livingPlaces",
          foreignField: "_id",
          as: "livingPlaces"
        },
    }
  ]);
  return await aggCursor.toArray();
}

async function exportPersonsToExcel(){

 return await this.getAll()
   
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
              { $cond: [{$and:[ {$gt:["$age", 0 ]}, {$lt: ["$age", 18]}, {$eq: ["$sex", "Hombre"]}]}, "1b", ""] },
              { $cond: [{$and:[ {$gt:["$age", 0 ]}, {$lt: ["$age", 18]}, {$eq: ["$sex", "Mujer"]}]}, "1a", ""] },
              { $cond: [{$and:[ {$gte:["$age",18]}, {$lt:["$age", 31]}, {$eq: ["$sex", "Mujer"]}]}, "2a", ""]},
              { $cond: [{$and:[ {$gte:["$age",18]}, {$lt:["$age", 31]}, {$eq: ["$sex", "Hombre"]}]}, "2b", ""]},
              { $cond: [{$and:[ {$gte:["$age",31]}, {$lt:["$age", 51]}, {$eq: ["$sex", "Mujer"]}]}, "3a", ""]},
              { $cond: [{$and:[ {$gte:["$age",31]}, {$lt:["$age", 51]}, {$eq: ["$sex", "Hombre"]}]}, "3b", ""]},
              { $cond: [{$and:[ {$gte:["$age",51]}, {$lt:["$age", 71]}, {$eq: ["$sex", "Mujer"]}]}, "4a", ""]},
              { $cond: [{$and:[ {$gte:["$age",51]}, {$lt:["$age", 71]}, {$eq: ["$sex", "Hombre"]}]}, "4b", ""]},
              { $cond: [{$and:[ {$gte:["$age",71]}, {$eq: ["$sex", "Hombre"]}]}, "5a", ""]},
              { $cond: [{$and:[ {$gte:["$age",71]}, {$eq: ["$sex", "Mujer"]}]}, "5b", ""]}
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



async function countTotalPersons() {
  const collection = db.getCollection(personsCollectionName);
  let sum = 0;
  try{
      sum = await collection.estimatedDocumentCount();
  }
  catch(error){
      console.log(error);
      throw error;
  }
  return sum;    
}


module.exports = {
  getAll,
  add,
  getAgeRanges,
  getLocations,
  exportPersonsToExcel,
  countTotalPersons,
  deleteForm,  
}
