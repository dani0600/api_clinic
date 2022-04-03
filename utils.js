const personsCollectionName = 'persons';
const tumorsCollectionName = 'tumors';


function checkString(string) {
    return typeof string === 'string' && string.trim().length > 0
}

module.exports = {
    checkString,
    personsCollectionName,
    tumorsCollectionName
}
