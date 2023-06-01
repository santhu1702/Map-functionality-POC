var sql = require('mssql');
var config = require('../utils/config');

function getData(dbQuery) {

    try {

        sql.on('error', err => {
            console.log("Error occured while connecting to database: \n" + err);
            throw "Error occured while connecting to database: " + err;
        });

        return sql.connect(config).then(pool => {
            return pool.request()
                .query(dbQuery)
        }).then(result => {
            return ({ message: 'success', response: result.recordset });
        }).catch(err => {
            throw ("Error occured while executing the query: " + err);
        });
    }
    catch (err) {
        return ({ message: 'fail', response: result.recordset });
    } 
}


module.exports = { getData }