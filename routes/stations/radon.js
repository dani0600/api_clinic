const express = require("express");
const radonModel = require('./../../models/stations/radon');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const radonStation = await radonModel.get(latitude, longitude);
        res.status(200).send(radonStation);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;