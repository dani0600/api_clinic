const { ObjectId } = require("mongodb");
const db = require('./../../app');
const { checkString } = require('./../../utils');
const { radonCollectionName } = require('./../../utils');
const { distanceInKmBetweenEarthCoordinates } = require('./../../services/geolocation/geolocation.service');


async function get(latitude, longitude) {
    const collection = db.getCollection(radonCollectionName);
    let id_estacio;
    let min_distance;
    let first = true;
    let stations;
    try{
        stations = await collection.find().toArray();
    }
    catch(error){
        console.log(error);
        throw error;
    }
    for(let station of stations){
        if(first){
            id_estacio = station.ID_JSON;
            min_distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, station.LAT, station.LON);
            first = false;
        }
        else{
            let distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, station.LAT, station.LON);
            if(distance < min_distance){
                id_estacio = station.ID_JSON;
                min_distance = distance;
            }
        }
    }   
    const nearestStation = await collection.findOne({
        ID_JSON: { 
            $eq: id_estacio 
        }
    });
    return nearestStation;
}

async function getAll(){
    const collection = db.getCollection(radonCollectionName);
    const aggCursor = await collection.aggregate([
        {
          '$project': {
            'LAT':1,
            'LON': 1,
            'Nivell': 1
            }
        }
        
      ]);
      return await aggCursor.toArray();
}



module.exports = {
    get,
    getAll
}