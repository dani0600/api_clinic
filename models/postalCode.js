const { ObjectId } = require("mongodb");
const db = require('./../app');
const { postalCodeCollectionName } = require('./../utils');


async function getAll() {
    const collection = db.getCollection(postalCodeCollectionName);
    const aggCursor = await collection.aggregate([
        {
          $project: {
              _id: 0,
              provincia: 1,
              poblacion: 1,
              codigopostalid: 1,
              lat: 1,
              lon: 1            
            }
        }
    
      ]);
      return await aggCursor.toArray();
}

async function getCityByPostalCode(postalCode){
  const collection = db.getCollection(postalCodeCollectionName);
  const aggCursor = await collection.aggregate([
    { $match: { codigopostalid: postalCode } }
  ]);
  return await aggCursor.toArray();
}

async function getCityByName(cityName){
  const collection = db.getCollection(postalCodeCollectionName);
  const aggCursor = await collection.aggregate([
    { $match: { poblacion: cityName } }
  ]);
  return await aggCursor.toArray();
}

async function getIdByPostalCode(postalCode){
  const collection = db.getCollection(postalCodeCollectionName);
  const aggCursor = await collection.aggregate([
    {
      $project: {
          _id: '$_id',
          codigopostalid: '$codigopostalid',
       },
    },{
      $match: {
         codigopostalid: Number(postalCode)
      } 
    }
  
  ]);
  return await aggCursor.toArray();
}

async function getCitiesByProvince(province){
  const collection = db.getCollection(postalCodeCollectionName);
  const aggCursor = await collection.aggregate([
    { $match: { provincia: province } },
    {
      $project: {
          _id: 0,
          provincia: 1,
          poblacion: 1,
          codigopostalid: 1,
          lon: 1,
          lat: 1            
        }
    }

  ]);
  return await aggCursor.toArray();
}

async function getProvinces(){
  const collection = db.getCollection(postalCodeCollectionName);
  const distinctCursor = await collection.distinct("provincia")
  return  distinctCursor;
}


module.exports = {
    getAll,
    getProvinces,
    getCitiesByProvince,
    getCityByName,
    getIdByPostalCode
  }