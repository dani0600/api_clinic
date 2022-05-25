const { ObjectId } = require("mongodb");
const db = require('./../app');
const { checkString } = require('./../utils');
const tumorModel = require('./../models/tumor');
const relativeModel = require('./../models/relative');
const placeModel = require('./../models/livingplace');
const personModel = require('./../models/person');
const metastasisModel = require('./../models/metastasis');
const expositionModel = require('./../models/exposition');
const worklifeModel = require('./../models/worklife');

function checkProperties(person){
    console.log("entro checkPropierties")
    if(!person.demographicDetails){
        throw { 
            code: 400,
            message: 'Route: The field Demographic Details is required'
        }
    }
    else{
        if (!checkString(person.demographicDetails.birthdate)) {
            throw { 
                code: 400,
                message: 'Route: The field birthdate is required and must be a string'
            }
        }
        if (!checkString(person.demographicDetails.sex)) {
            throw { 
                code: 400,
                message: 'Route: The field sex is required and must be a non-empty string'
            }
        }
        if (!person.demographicDetails.livingPlace) {
            throw { 
                code: 400,
                message: 'Route: The field Living Place is required'
            }
        }
        if (!person.demographicDetails.bornPlace) {
            throw { 
                code: 400,
                message: 'Route: The field Born Place is required'
            }
        }
    }
  
    if(!person.clinicDetails){
        throw { 
            code: 400,
            message: 'Route: The field Clinic Details is required'
        }
    }
    else{
        if(!person.clinicDetails.mainDiagnose){
            throw { 
                code: 400,
                message: 'Route: The field Main Diagnose is required'
            }
        }
        if (!person.clinicDetails.otherDiagnose || !Array.isArray(person.clinicDetails.otherDiagnose)) {
            throw { 
                code: 400,
                message: 'Route: The field Other Diagnose is required and must be an array'
            }
        }
    }
    console.log("entro checkProp3")
    if (!person.jobDetails || !Array.isArray(person.jobDetails) ) {
        throw { 
            code: 400,
            message: 'Route: The field Job Details is required and must be an array of at least an element'
        }
    }
    if (!person.familyDetails || !Array.isArray(person.familyDetails)) {
        throw { 
            code: 400,
            message: 'Route: The field Family Details is required and must be an array'
        }
    }
    checkToxics(person.expositionDetails);
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
  if(toxics.smoker && typeof toxics.avgCigarrettes !== 'number'){
    throw { 
      code: 400,
      message: 'Route: The field Average Cigarrettes is required and must be a number'
    }
  }
  if (!toxics.otherProducts || !Array.isArray(toxics.otherProducts)) {
    throw { 
        code: 400,
        message: 'Route: The field Living Places is required and must be an array'
    }
  }
  if (typeof toxics.nearbyRoad !== 'boolean') {
    throw { 
        code: 400,
        message: 'Route: The field Nearby Road is required and must be a boolean'
    }
  }
  if (!toxics.expositions || !Array.isArray(toxics.expositions)) {
    throw { 
        code: 400,
        message: 'Route: The field Expositions is required and must be an array'
    }
  }
}

function buildTumors(info, id){
    let tumorsIds = [];
    let tumorsObj = [];
    let diagnosesIds = [];
    let diagnosesObj = [];
    let tumor = info.clinicDetails.mainDiagnose;
    let tumorId = ObjectId();
    let diagnoses = buildOtherDiagnoses(info.clinicDetails.otherDiagnose, id);
    diagnosesIds = diagnoses.diagnosesIds;
    diagnosesObj = diagnoses.diagnosesObj;
    let tum = {
        _id: tumorId,
        person: id,
        main: true,
        diagnoseYear: tumor.diagnoseYear,
        type: tumor.cancerType,
        nonmicrocyticSubtype: tumor.nonmicrocyticSubtype,
        mutation: tumor.mutation,
        mutationType: tumor.mutationType,
        operatedCancer: tumor.operatedCancer,
        operationYear: tumor.operationYear,
        extraTreatment: tumor.extraTreatment,
        hasReceivedComplementaryRadiotherapy: tumor.hasReceivedComplementaryRadiotherapy,
        complementaryRadiotherapyTarget: tumor.complementaryRadiotherapyTarget,
        isClinicalTrial: tumor.isClinicalTrial,
        metastasis: tumor.metastasis,
        metastasisYear: tumor.metastasisYear,
        notListedMetastasisTreatment: tumor.notListedTreatment,
        metastasisTreatment: tumor.metastasisTreatment,
        notListedNoSurgeryTreatment: tumor.notListedNoSurgeryTreatment,
        noSurgeryTreatment: tumor.noSurgeryTreatment,
        previousDiseases: tumor.previousDiseases
    }
    console.log(tum);
    tumorsIds.push(tum._id);
    tumorsObj.push(tum);
    return {tumorsIds, tumorsObj, diagnosesObj, diagnosesIds};
}

function buildOtherDiagnoses(info, id){
    let diagnosesIds = [];
    let diagnosesObj = [];
    for (let diagnose of info){
        let cancerId = ObjectId(); 
        let cancer = {
            _id: cancerId,
            person: id,
            main: diagnose.main ? diagnose.main : false,
            type: diagnose.cancerType,
            diagnoseYear: diagnose.diagnoseYear,
            metastasis: diagnose.metastasis,
            metastasisYear: diagnose.metastasisYear,
            extraTreatment: diagnose.extraTreatment
        }
        diagnosesIds.push(cancer._id);
        diagnosesObj.push(cancer);
    }
    return {diagnosesIds, diagnosesObj};
}

function buildLivingPlaces(info, id){
    let placesIds = [];
    let placesObj = [];
    let place = info.livingPlace;
    
    let livingPlace = {
        _id: ObjectId(),
        person: id,
        country: place.country.name,
        city: place.city,
        state: place.state,
        postalCode: place.postalCode,
        yearOfStart: place.initialYear,
        yearOfEnd: place.endYear,
        isPresent: true
    }
    placesIds.push(livingPlace._id);
    placesObj.push(livingPlace);

    let born = info.bornPlace;

    let bornPlace = {
        _id: ObjectId(),
        person: id,
        country: born.country.name,
        city: born.city,
        state: born.state,
        postalCode: born.postalCode,
        yearOfStart: born.initialYear,
        yearOfEnd: born.endYear,
        isPresent: born.endYear === 0 ? true : false 
    }
    placesIds.push(bornPlace._id);
    placesObj.push(bornPlace);
    return {placesIds, placesObj}; 
}

function buildRelatives(info, id){
    let relativesIds = [];
    let relativesObj = [];
    let relativesTumObj = [];
    let diagnoses;
    for(let relative of info.familyDetails){
        let relId = ObjectId();
        relative.diagnose.main = true;
        let diagnoseArray = [];
        diagnoseArray.push(relative.diagnose);
        diagnoses = buildOtherDiagnoses(diagnoseArray, relId);
        let rel = {
            _id: relId,
            person: id,
            relation: relative.relation,
            age: relative.age,
            ageOfDeath: relative.ageOfDeath,
            survived: relative.survived,
            isDeathRelatedToCancer: relative.cancerCause,
            diagnose: diagnoses.diagnosesIds   
        }
        relativesIds.push(rel._id);
        relativesObj.push(rel);
    }
    if(diagnoses){
        for(let diagnose of diagnoses.diagnosesObj){
            relativesTumObj.push(diagnose);
        }
    }
    return {relativesIds, relativesObj, relativesTumObj};
}

function buildWorklife(info, id){
    let worklifeIds = [];
    let worklifeObj = [];
    for(let worklife of info.jobDetails){
        let work = {
            _id: ObjectId(),
            person: id,
            job: worklife.job,
            initialYear: worklife.initialYear,
            endYear: worklife.endYear,
            isProtected: worklife.isProtected,
            currentJob: worklife.currentJob 
        }
        worklifeIds.push(work._id);
        worklifeObj.push(work);
    }
    return {worklifeIds, worklifeObj};
}

function buildExposition(info, id){
    let expositionIds = [];
    let expositionObj = [];
    let exposition = info.expositionDetails;
    let expo = {
        _id: ObjectId(),
        person: id,
        smoker: exposition.smoker,
        startAge: exposition.startAge ? exposition.startAge : null,
        endAge:  exposition.endAge ? exposition.endAge : null,
        avgCigarrettes: exposition.smoker ? exposition.avgCigarrettes : null,
        otherProducts: exposition.otherProducts,
        nearbyRoad: exposition.nearbyRoad,
        expositions: exposition.expositions
    }
    expositionIds.push(expo._id);
    expositionObj.push(expo);
    return {expositionIds, expositionObj};
}

async function add(info) {
    console.log(info)
    console.log("ESTAMOS EN EL ADD DEL FORM")
    let id = ObjectId();
    info._id = id;
    let tumIds, tumObj, othDiagObj, othDiagIds;
    let tumors = buildTumors(info, id);
    tumIds = tumors.tumorsIds;
    tumObj = tumors.tumorsObj;
    othDiagObj = tumors.diagnosesObj;
    othDiagIds = tumors.diagnosesIds;

    let workIds, workObj;
    let worklife = buildWorklife(info, id);
    workIds = worklife.worklifeIds;
    workObj = worklife.worklifeObj;

    let expoIds, expoObj;
    let expositions = buildExposition(info, id);
    expoIds = expositions.expositionIds;
    expoObj = expositions.expositionObj;

    let relIds, relObj; 
    relative = buildRelatives(info, id);
    relIds = relative.relativesIds;
    relObj = relative.relativesObj;
    relTumObj = relative.relativesTumObj;

    let placeIds, placeObj;
    places = buildLivingPlaces(info.demographicDetails, id);
    placeIds = places.placesIds;
    placeObj = places.placesObj;

    console.log("he llegado aqui")
    for(let relative of relObj){
        console.log(relative)
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
    for (let diagnose of othDiagObj){
        try{
            await addOtherDiagnoses(diagnose);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    for (let relTumor of relTumObj){
        try{
            await addOtherDiagnoses(relTumor);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    for (let work of workObj){
        try{
            await addWorklife(work);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    for (let exposition of expoObj){
        try{
            await addExposition(exposition);
        }
        catch(error){
            console.log(error);
            throw error;
        }
    }
    try {
        await addPerson(info, tumIds, othDiagIds, relIds, placeIds, workIds, expoIds);
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

async function addOtherDiagnoses(diagnose){
    try{
        await metastasisModel.add(diagnose)
    }
    catch(error){
        throw error;
    }
}

async function addWorklife(work){
    try{
        await worklifeModel.add(work)
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

async function addExposition(exposition){
    try{
        await expositionModel.add(exposition)
    }
    catch(error){
        throw error;
    }
}

async function addPerson(person, tumIds, othDiagIds, relIds, placeIds, workIds, expoIds){
    try{
        await personModel.add(person, tumIds, othDiagIds, relIds, placeIds, workIds, expoIds)
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
  addWorklife,
  addPerson,
  addExposition,
  addOtherDiagnoses,
  buildLivingPlaces,
  buildOtherDiagnoses,
  buildRelatives,
  buildTumors,
  buildWorklife,
  buildExposition
}


