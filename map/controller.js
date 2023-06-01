const { response } = require('express');
const dataConnector = require('../common/model');

async function getZipAndACV() {
    try {
        const [zipResult, acvResult] = await Promise.all([
            getZip(),
            getACV_Est_Yearly()
        ]);
        // Process the results here
        console.log('Zip Result:', zipResult);
        console.log('ACV Result:', acvResult);
        // Return the combined results or do further processing
        return { zipResult, acvResult };
    } catch (error) {
        return handleErrors(error, '/map/getZipAndACV');
    }
}



/////DB calls 

async function getZip() {
    try {
        let query = `
            SELECT distinct(Zip) AS [Zip]
            FROM 
            [dbo].[mock_stores] 
        `;
        return await dataConnector.getData(query).then((result) => {
            if (result.message === "fail") return result;
            return result.response;
        });
    }
    catch (error) {
        return handleErrors(error, '/map/getZip');
    }
}
async function getACV_Est_Yearly() {
    try {
        let query = `
            SELECT MAX(ACV_Est_Yearly) as maxACV_Est_Yearly , MIN(ACV_Est_Yearly) as minACV_Est_Yearly
            FROM mock_stores
        `;
        return await dataConnector.getData(query).then((result) => {
            if (result.message === "fail") return result;
            return result.response;
        });
    }
    catch (error) {
        return handleErrors(error, '/map/getACV_Est_Yearly');
    }
}

async function getStateByZip(zip) {
    try {
        let query = `
            SELECT distinct(State) AS [State]
            FROM
                [dbo].[mock_stores]
            WHERE Zip = ${zip} 
        `;
        return await dataConnector.getData(query).then((result) => {
            if (result.message === "fail") return result;
            return result.response;
        });
    }
    catch (error) {
        return handleErrors(error, '/map/getACV_Est_Yearly');
    }
}

async function getMapDetails(ACV_Est_Yearly) {
    try {
        let query = `
            SELECT TOP 1 MockID, ACV_Est_Yearly, Latitude, Longitude, drt_store, Zip, State, ZipRank
            FROM (
            -- Select the exact match if it exists
                    SELECT *
                    FROM mock_stores
                    WHERE ACV_Est_Yearly = ${ACV_Est_Yearly}
            
                UNION ALL
            
                    -- If an exact match is not found, retrieve the nearest value
                    SELECT TOP 1
                        *
                    FROM mock_stores
                    ORDER BY ABS(ACV_Est_Yearly - ${ACV_Est_Yearly})
            ) AS s
        `;
        return await dataConnector.getData(query).then((result) => {
            if (result.message === "fail") return result;
            return result.response;
        });
    }
    catch (error) {
        return handleErrors(error, '/map/getACV_Est_Yearly');
    }
}

function handleErrors(errMessage, errLocation) {
    return {
        message: "fail",
        response: "Error occured while processing the request. Please try again.",
        errorDetail: errMessage,
        errOccurredAt: errLocation,
    };
};

module.exports = { getZipAndACV, getStateByZip ,getMapDetails }