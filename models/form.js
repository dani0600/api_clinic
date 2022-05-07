const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const tumorModel = require('./../models/tumor');
const relativeModel = require('./../models/relative');
const placeModel = require('./../models/livingplace');
const personModel = require('./../models/person');
const postalCodeModel = require('./../models/postalCode');
var mongoose = require('mongoose');


const personSchema = new mongoose.Schema({
    birthdate: {
      type: Date,
      required: [true, 'Birthdate is needed']
    },
    age: {
      type: Number,
      required: [true, 'Age is needed']
    },
    sex: {
      type: String,
      enum: ['Male', 'Female', "No-binary"],
      required: true,
    },
    postalcode: {
        type: Number,
        required: true
    },
    country: {
        type: String
    },
    livingPlaces: {
        type: Array
    },
    tumors: {
        type: Array
    }
});

function checkProperties(person){
  if (!checkString(person.birthdate)) {
      throw { 
          code: 400,
          message: 'Route: The field birthdate is required and must be a string'
      }
  }
  if (typeof person.age !== 'number') {
      throw { 
          code: 400,
          message: 'Route: The field age is required and must be a number'
      }
  }
  if (!checkString(person.sex)) {
      throw { 
          code: 400,
          message: 'Route: The field sex is required and must be a non-empty string'
      }
  }
  if (!checkString(person.postalcode)) {
      throw { 
          code: 400,
          message: 'Route: The field Postal Code is required and must be a non-empty string'
      }
  }
  if (!checkString(person.country)) {
    throw { 
        code: 400,
        message: 'Route: The field country is required and must be a non-empty string'
    }
  }
  if (!person.livingplaces || !Array.isArray(person.livingplaces) || person.livingplaces.length === 0) {
      throw { 
          code: 400,
          message: 'Route: The field Living Places is required and must be an array of at least an element'
      }
  }
  if (!person.tumors || !Array.isArray(person.tumors) || person.tumors.length === 0) {
    throw { 
        code: 400,
        message: 'Route: The field tumors is required and must be an array of at least an element'
    }
  }
  if (!person.worklife || !Array.isArray(person.worklife) || person.worklife.length === 0) {
    throw { 
        code: 400,
        message: 'Route: The field tumors is required and must be an array of at least an element'
    }
  }
  checkToxics(person.toxics);
}

function checkToxics(toxics){
  if (typeof toxics.smoker !== 'boolean') {
    throw { 
        code: 400,
        message: 'Route: The field smoker is required and must be a boolean'
    }
  }
  if(toxics.smoker && typeof toxics.startAge !== 'number'){
    throw { 
      code: 400,
      message: 'Route: The field Start Age is required and must be a number'
    }
  }
  if(toxics.smoker && typeof toxics.endAge !== 'number'){
    throw { 
      code: 400,
      message: 'Route: The field End Age is required and must be a number'
    }
  }
  if(toxics.smoker && typeof toxics.avgCigarrettes !== 'number'){
    throw { 
      code: 400,
      message: 'Route: The field Average Cigarrettes is required and must be a number'
    }
  }
  if (!toxics.otherProducts || !Array.isArray(toxics.otherProducts)) {
    throw { 
        code: 400,
        message: 'Route: The field Living Places is required and must be an array of at least an element'
    }
  }
  if (typeof toxics.nearbyRoad !== 'boolean') {
    throw { 
        code: 400,
        message: 'Route: The field Nearby Road is required and must be a boolean'
    }
  }
}

function buildTumors(info, id){
    let tumorsIds = [];
    let tumorsObj = [];
    let metastasisIds = [];
    let metastasisObj = [];
    if (info.tumors){
        for(let tumor of info.tumors){
            let tumorId = ObjectId();
            let metastasis = buildMetastasis(tumor.metastasis, id, tumorId);
            metastasisIds = metastasis.metastasisIds;
            metastasisObj = metastasis.metastasisObj;
            let tum = {
                _id: tumorId,
                person: id,
                main: tumor.main,
                diagnoseYear: tumor.diagnoseYear,
                type: tumor.type,
                surgery: tumor.surgery,
                mutations: tumor.mutations,
                metastasis: metastasisIds
            }
            tumorsIds.push(tum._id);
            tumorsObj.push(tum);
        }
    }
    return {tumorsIds, tumorsObj, metastasisObj};
}

function buildMetastasis(info, id, tumorId){
    let metastasisIds = [];
    let metastasisObj = [];
    for(let tumor of info){
        let metastasis = {
            _id: ObjectId(),
            tumor: tumorId,
            person: id,
            main: false,
            diagnoseYear: tumor.diagnoseYear,
            type: tumor.type,
            surgery: tumor.surgery,
            mutations: tumor.mutations,
        }
        metastasisIds.push(metastasis._id);
        metastasisObj.push(metastasis);
    }
    return {metastasisIds, metastasisObj};
}

function buildLivingPlaces(info, id){
    let placesIds = [];
    let placesObj = [];
    for(let place of info.livingplaces){
        if(place.country=="Spain" && postalCode){
            let idPostalCode = postalCodeModel.getIdByPostalCode(postalCode)._id;
            let livingPlace = {
                _id: ObjectId(),
                person: id,
                country: place.country,
                city: undefined,
                postalCode: undefined,
                idPostalCode: idPostalCode,
                yearOfStart: place.yearOfStart,
                yearOfEnd: place.yearOfEnd,
                isPresent: place.isPresent  
            }
        }else{
            let livingPlace = {
                _id: ObjectId(),
                person: id,
                country: place.country,
                city: place.city,
                postalCode: place.postalCode,
                idPostalCode: undefined,
                yearOfStart: place.yearOfStart,
                yearOfEnd: place.yearOfEnd,
                isPresent: place.isPresent  
            }
        }
        placesIds.push(livingPlace._id);
        placesObj.push(livingPlace);
    }
    return {placesIds, placesObj};
}

function buildRelatives(info, id){
    let relativesIds = [];
    let relativesObj = [];
    let relativesTumObj = [];
    let tumors;
    for(let relative of info.relatives){
        let relId = ObjectId();
        tumors = buildTumors(relative, relId);
        let rel = {
            _id: relId,
            person: id,
            relation: relative.relation,
            age: relative.age,
            survived: relative.survived,
            ageOfDeath: relative.ageOfDeath,
            tumors: tumors.tumorsIds   
        }
        relativesIds.push(rel._id);
        relativesObj.push(rel);
    }
    for(let tumor of tumors.tumorsObj){
        relativesTumObj.push(tumor);
    }
    for(let metastasis of tumors.metastasisObj){
        relativesTumObj.push(metastasis);
    }
    return {relativesIds, relativesObj, relativesTumObj};
}

function buildWorklife(info, id){
    let worklifeIds = [];
    let worklifeObj = [];
    for(let worklife of info.worklife){
        let work = {
            _id: ObjectId(),
            person: id,
            city: worklife.city,
            job: worklife.job,
            yearOfStart: worklife.yearOfStart,
            yearOfEnd: worklife.yearOfEnd,
            isProtected: worklife.isProtected 
        }
        worklifeIds.push(work._id);
        worklifeObj.push(work);
    }
    return {worklifeIds, worklifeObj};
}

async function add(info) {
    console.log(info);
    try{  
        checkProperties(info);
    }catch (error) {
        throw(error.message);
    } 
    let id = ObjectId();
    info._id = id;
    let tumIds, tumObj, metObj;
    let tumors = buildTumors(info, id);
    tumIds = tumors.tumorsIds;
    tumObj = tumors.tumorsObj;
    metObj = tumors.metastasisObj;

    let workIds, workObj;
    let worklife = buildWorklife(info, id);
    workIds = worklife.worklifeIds;
    workObj = worklife.worklifeObj;

    let relIds, relObj; 
    relative = buildRelatives(info, id);
    relIds = relative.relativesIds;
    relObj = relative.relativesObj;
    relTumObj = relative.relativesTumObj;

    let placeIds, placeObj;
    places = buildLivingPlaces(info, id);
    placeIds = places.placesIds;
    placeObj = places.placesObj;

    for(let relative of relObj){
        try{
            await addRelative(relative);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    for(let place of placeObj){
        try{
            await addLivingPlace(place);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    for(let tumor of tumObj){
        try{
            await addTumor(tumor);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    for (let metastasis of metObj){
        try{
            await addTumor(metastasis);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    for (let relTumor of relTumObj){
        try{
            await addTumor(relTumor);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    try {
        await addPerson(info, tumIds, relIds, placeIds, workObj);
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function addTumor(tumor){
    try{
        await tumorModel.add(tumor)
    }
    catch(error){
        throw error;
    }
}

async function addLivingPlace(place){
    try{
        await placeModel.add(place)
    }
    catch(error){
        throw error;
    }
}

async function addRelative(relative){
    try{
        await relativeModel.add(relative)
    }
    catch(error){
        throw error;
    }
}

async function addPerson(person, tumIds, relIds, placeIds, workObj){
    try{
        await personModel.add(person, tumIds, relIds, placeIds, workObj)
    }
    catch(error){
        throw error;
    }
}


module.exports = {
  checkProperties,
  add,
  addTumor,
  addLivingPlace,
  addRelative,
  addPerson,
  buildLivingPlaces,
  buildMetastasis,
  buildRelatives,
  buildTumors,
  buildWorklife
}


