const express = require('express');
const mapController = require('./controller');

var route = express.Router();


route.get("/", (req, res) => {
    mapController.getZipAndACV().then((response) => {
        console.log(response)
        res.render("map", {
            zip: response.zipResult,
            acv: response.acvResult
        });
    });
});

route.get("/getState", (req, res) => {
    mapController.getStateByZip(req.query.zip).then(result => {
        res.send(result);
    })
})

route.get("/getMapDetails", (req, res) => {
    mapController.getMapDetails(req.query.ACV_Est_Yearly).then(result => {
        res.send(result);
    })
})


module.exports = route;
