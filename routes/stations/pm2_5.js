const express = require("express");
const pm2_5Model = require('./../../models/stations/pm2_5');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const pm2_5Station = await pm2_5Model.get(latitude, longitude);
        res.status(200).send(pm2_5Station);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;