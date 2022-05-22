const express = require("express");
const benzopyreneModel = require('./../../models/stations/benzopyrene');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const benzopyreneStation = await benzopyreneModel.get(latitude, longitude);
        res.status(200).send(benzopyreneStation);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;