require('dotenv').config();
const AWS = require('aws-sdk');
const db = require('./db.js');
const queryBuilder = require ('./queryBuilder.js');

exports.handler = async(event,context,callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        var data = await rejectedPhoto(event);
        callback(null,data)
    } catch (err) {
        const error = {
            status: err.status || 500,
            message: err.message || "Internal server error."
        }
        callback(JSON.stringify(error));
    } 
}

async function rejectedPhoto(event){
    console.log(event);
}