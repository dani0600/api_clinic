const personsCollectionName = 'persons';
const tumorsCollectionName = 'tumors';
const metastasisCollectionName = 'metastasis';
const surgeriesCollectionName = 'surgeries';
const livingPlacesCollectionName ='livingplaces';



function checkString(string) {
    return typeof string === 'string' && string.trim().length > 0
}

module.exports = {
    checkString,
    personsCollectionName,
    tumorsCollectionName,
    metastasisCollectionName,
    surgeriesCollectionName,
    livingPlacesCollectionName
}
