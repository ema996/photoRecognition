require('dotenv').config();
const AWS = require('aws-sdk');
const db = require('./db.js');
const queryBuilder = require ('./queryBuilder.js');

exports.handler = async(event,context,callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        var data = await approvedPhoto(event);
        callback(null,data)
    } catch (err) {
        const error = {
            status: err.status || 500,
            message: err.message || "Internal server error."
        }
        callback(JSON.stringify(error));
    } 
}

async function approvedPhoto(event){
    console.log(JSON.stringify(event));
    var queryResult = await db.query(queryBuilder.insertLabelsAndPhotoStatus(),[1,JSON.parse(event.Records[0].Sns.Message).Labels,'%'+JSON.parse(event.Records[0].Sns.Message).KeyName+'%']);
    console.log('Rezultatot od query-to e: ',queryResult);
}


