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

const arsenicCollectionName = 'arsenic';
const benzopyreneCollectionName = 'benzopyrene';
const cadmiumCollectionName = 'cadmium';
const leadCollectionName = 'lead';
const nickelCollectionName = 'nickel';
const pm10CollectionName = 'pm10';
const pm2_5CollectionName = 'pm2_5';
const radonCollectionName = 'radon';

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
    suggestionsCollectionName,
    arsenicCollectionName,
    cadmiumCollectionName,
    benzopyreneCollectionName,
    leadCollectionName,
    nickelCollectionName,
    pm10CollectionName,
    pm2_5CollectionName,
    radonCollectionName
}
