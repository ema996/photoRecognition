require('dotenv').config();
const queryBuilder = require ('./queryBuilder.js');
const AWS = require('aws-sdk');
const db = require('./db.js');


exports.handler = async(event,context,callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        var data = await allPhotos(event);
        callback(null,data)
    } catch (err) {
        const error = {
            status: err.status || 500,
            message: err.message || "Internal server error."
        }
        callback(JSON.stringify(error));
    } 
}

async function allPhotos(event) {
    console.log(JSON.stringify(event));
    var queryResult = await db.query(queryBuilder.allPhotos());
    console.log('Rezultatot od query-to e: ',queryResult);
}