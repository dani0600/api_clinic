const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const arsenicModel = require('./../models/stations/arsenic');
const benzopyreneModel = require('./../models/stations/benzopyrene');
const cadmiumModel = require('./../models/stations/cadmium');
const leadModel = require('./../models/stations/lead');
const nickelModel = require('./../models/stations/nickel');
const pm10Model = require('./../models/stations/pm10');
const pm2_5Model = require('./../models/stations/pm2_5');
const radonModel = require('./../models/stations/radon');


async function getStations(latitude, longitude, country) {  
    if(country === 'Spain'){
        let arsenicStation, benzopyreneStation, radonStation, pm10Station, pm2_5Station, cadmiumStation, leadStation, nickelStation
        try{
            arsenicStation = await arsenicModel.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
        try{
            benzopyreneStation = await benzopyreneModel.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
        try{
            cadmiumStation = await cadmiumModel.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
        try{
            leadStation = await leadModel.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
        try{
            nickelStation = await nickelModel.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
        try{
            pm10Station = await pm10Model.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
        try{
            pm2_5Station = await pm2_5Model.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
        try{
            radonStation = await radonModel.get(latitude, longitude);
        }
        catch(error){
            console.log(error);
            throw error;
        }
          
        let json = {
            arsenic: arsenicStation,
            benzopyrene: benzopyreneStation,
            cadmium: cadmiumStation,
            lead: leadStation,
            nickel: nickelStation,
            radon: radonStation,
            pm2_5: pm2_5Station,
            pm10: pm10Station
        }
        return json;
    }
    else{
        throw { 
            code: 400,
            message: 'Location: Your current city has to be in Spain'
        }
    }
}

module.exports = {
    getStations
  }