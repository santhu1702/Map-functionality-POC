const express = require("express");
const map = require("../map")


const route = express.Router();


route.get('/', (req, res) => {
    res.redirect(`/map`)
});

route.use(`/map`, map)


module.exports = route;