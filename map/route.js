const express = require('express');
const mapController = require('./controller');

var route = express.Router();


// route.get("/", (req, res) => {
//     mapController.getZipAndACV().then((response) => {
//         console.log(response)
//         res.render("map", {
//             zip: response.zipResult,
//             acv: response.acvResult
//         });
//     });
// });
route.get("/", (req, res) => {
    mapController.getState(req.query.state).then((response) => {
        console.log(response)
        res.render("map", {
            state: response

        });
    });
});

route.get("/getState", (req, res) => {
    mapController.getStateByZip().then(result => {
        res.send(result);
    })
})
route.get("/getZip", (req, res) => {
    mapController.getZip(req.query.state).then(result => {
        res.send(result);
    })
})
route.get("/getMapDetails", (req, res) => {
    mapController.getMapDetails(req.query.ACV_Est_Yearly, req.query.zip).then(result => {
        res.send(result);
    })
})


module.exports = route;
