require('dotenv').config();
const pg = require('pg');
const queryBuilder = require ('./queryBuilder.js');
const AWS = require('aws-sdk');
const createError = require('http-errors');
const db = require('./db.js');
var s3 = new AWS.S3({region: "us-east-2"});
var rekognition = new AWS.Rekognition();
const validTags = ["Car","Bike","Bus","Truck","Motorcycle"];
var photoIsApproved = false;


exports.handler = async(event,context,callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        var data = await RekognitionFunc(event);
        callback(null,data)
    } catch (err) {
        const error = {
            status: err.status || 500,
            message: err.message || "Internal server error."
        }
        callback(JSON.stringify(error));
    } 
}

  async function RekognitionFunc (event){
         var params = {
            Image: {
             S3Object: {
              Bucket: event.Records[0].s3.bucket.name, 
              Name: event.Records[0].s3.object.key
             }
            }, 
            MinConfidence: 70
           };
          var result = await detectLabelsAsync(params);
          console.log('Ova e rezultatot',result);
          //console.log('Ova e samo name-ot od prviot label od rezultatot',result.Labels[0].Name);
          
          for(var i=0;i<result.Labels.length;i++){
              for(var k=0;k<validTags.length;k++){
                  if(result.Labels[i].Name == validTags[k]) {
                      photoIsApproved = true;
                      break;
                  }
              }
          }
          if(photoIsApproved == true){
              console.log('This photo is approved');
          }
          else {
              console.log('This photo is not approved');
          }
          
  }
  
async function detectLabelsAsync(params){
    return new Promise(function(resolve,reject){
           rekognition.detectLabels(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); 
                reject (err);}

            else {
                console.log(data);
                resolve(data); 
            }
          })
})}
        