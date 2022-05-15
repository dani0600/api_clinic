const { ObjectId } = require("mongodb");
const db = require('./../../app');
const { checkString } = require('./../../utils');
const { arsenicCollectionName } = require('./../../utils');
const { distanceInKmBetweenEarthCoordinates } = require('./../../services/geolocation/geolocation.service');

async function get(latitude, longitude) {
    const collection = db.getCollection(arsenicCollectionName);
    let id;
    let min_distance;
    let first = true;
    let stations = [];
    try{
        stations = await collection.find().toArray();
    }
    catch(error){
        console.log(error);
        throw error;
    }
    for(let station of stations){
        if(first){
            id = station.ID_ESTACIO;
            min_distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, station.LAT, station.LON);
            first = false;
        }
        else{
            let distance = distanceInKmBetweenEarthCoordinates(latitude, longitude, station.LAT, station.LON);
            if(distance < min_distance){
                id = station.ID_ESTACIO;
                min_distance = distance;
            }
        }
    }
    try{
        const nearestStation = await collection.findOne({
            ID_ESTACIO: { 
                $eq: id 
            }
        });
        return nearestStation;
    }
    catch(error){
        console.log(error)
        throw error;
    }  
}



module.exports = {
    get
}