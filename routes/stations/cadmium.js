const express = require("express");
const cadmiumModel = require('./../../models/stations/cadmium');

const router = express.Router();

router.get('/', async function(req, res, next) {
    try{
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        const cadmiumStation = await cadmiumModel.get(latitude, longitude);
        res.status(200).send(cadmiumStation);
    }
    catch(error){
        next(error);
    }
})



  
module.exports = router;