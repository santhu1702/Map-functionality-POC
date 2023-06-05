const { response } = require('express');
const dataConnector = require('../common/model');

// async function getZipAndACV() {
//     try {
//         const [zipResult, acvResult] = await Promise.all([
//             getZip(),
//             getACV_Est_Yearly()
//         ]);
//         // Process the results here
//         console.log('Zip Result:', zipResult);
//         console.log('ACV Result:', acvResult);
//         // Return the combined results or do further processing
//         return { zipResult, acvResult };
//     } catch (error) {
//         return handleErrors(error, '/map/getZipAndACV');
//     }
// }



/////DB calls 

async function getZip(state) {
    try {
        let query = `
            SELECT distinct(Zip) AS [Zip]
            FROM 
            [dbo].[mock_stores] 
            WHERE [State] = '${state}'
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

async function getState() {
    try {
        // let query = `
        //     SELECT distinct(State) AS [State]
        //     FROM
        //         [dbo].[mock_stores]
        // `; 
         let query = `
        SELECT distinct(State) AS [State]
        FROM
            [dbo].[book1]
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

async function getMapDetailAndCoordinates(zip, state) {
    try {
        const [map, polygon] = await Promise.all([
             getMapDetails(zip),
             stateGeoCoordinates(state)
        ]); 
        return { map, polygon };
    } catch (error) {
        return handleErrors(error, '/map/getMapDetailAndCoordinates');
    }
}

async function getMapDetails(zip) {
    try {
        // let query = `
        //     SELECT Latitude,Longitude,drt_store,c.zip,c.[State],pop_density
        //         FROM 
        //         mock_stores s INNER JOIN 
        //         hispanic c on c.zip = s.Zip
        //         WHERE s.zip IN (SELECT value FROM STRING_SPLIT('${zip}', ','))
        // `;
        let query = `
                 select * from Book1
                 where State in ('${zip}')
             `;
        return await dataConnector.getData(query).then((result) => {
            if (result.message === "fail") return result;
            return result.response;
        });
    }
    catch (error) {
        return handleErrors(error, '/map/getMapDetails');
    }
}

async function stateGeoCoordinates(state) {
    try {
        let query = `
                 select * from stateCoordinates
                 WHERE StateCode in ('${state}')
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

async function getAllMockData() {
    try {
        // let query = `       
        //         SELECT Latitude, Longitude, drt_store, ACV_Est_Yearly
        //         from [dbo].[mock_storesOriginal] 
        //     `; 
        let query = `
        SELECT * from book1
        `
        return await dataConnector.getData(query).then((result) => {
            if (result.message === "fail") return result;
            return result.response;
        });
    }
    catch (error) {
        return handleErrors(error, '/map/getACV_Est_Yearly');
    }
}

async function getStateAndMock() {
    try {
        const [state, mock_store] = await Promise.all([
             getState(),
             getAllMockData()
        ]); 
        return { state, mock_store };
    } catch (error) {
        return handleErrors(error, '/map/getMapDetailAndCoordinates');
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

module.exports = { getState, getMapDetails, getZip, getMapDetailAndCoordinates, getAllMockData, getStateAndMock }