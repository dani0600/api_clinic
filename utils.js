const personsCollectionName = 'persons';
const tumorsCollectionName = 'tumors';
const metastasisCollectionName = 'metastasis';
const surgeriesCollectionName = 'surgeries';
const livingPlacesCollectionName ='livingplaces';
const relativesCollectionName = 'relatives';
const worklifesCollectionName = 'worklifes';
const expositionsCollectionName = 'expositions';
const postalCodeCollectionName = 'postalCodes';
const suggestionsCollectionName = 'suggestions';



function checkString(string) {
    return typeof string === 'string' && string.trim().length > 0
}

module.exports = {
    checkString,
    personsCollectionName,
    tumorsCollectionName,
    metastasisCollectionName,
    surgeriesCollectionName,
    livingPlacesCollectionName,
    relativesCollectionName,
    postalCodeCollectionName,
    worklifesCollectionName,
    expositionsCollectionName,
    suggestionsCollectionName
}
