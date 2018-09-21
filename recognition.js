require('dotenv').config();
//const pg = require('pg');
//const queryBuilder = require ('./queryBuilder.js');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

//const createError = require('http-errors');
//const db = require('./db.js');
//var s3 = new AWS.S3({region: "us-east-2"});
var rekognition = new AWS.Rekognition();
const validTags = ["Car","Bike","Bus","Truck","Motorcycle"];
const allTags = [];
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
          
          for (var t=0; t<result.Labels.length;t++){
              allTags.push(result.Labels[t].Name);
            
          }
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
              var params = {
                Message: JSON.stringify({Labels: allTags, KeyName:event.Records[0].s3.object.key }), /* required */
                TopicArn: 'arn:aws:sns:us-east-2:637361919775:approvedPhotoSNS'
              };

              var publishTextPromise = new AWS.SNS().publish(params).promise();

            
            return publishTextPromise.then(
            function(data) {
                console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
            console.log("MessageID is " + data.MessageId);
            }).catch(
            function(err) {
            console.error(err, err.stack);
  });
  }
          
          else {
              console.log('This photo is not approved');
              var params = {
                Message: JSON.stringify({Labels: allTags, KeyName:event.Records[0].s3.object.key }), /* required */
                TopicArn: 'arn:aws:sns:us-east-2:637361919775:rejectedPhotoSNS'
              };

              var publishTextPromise = new AWS.SNS().publish(params).promise();

            
            return publishTextPromise.then(
            function(data) {
                console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
                console.log("MessageID is " + data.MessageId);
            }).catch(
            function(err) {
            console.error(err, err.stack);
  });
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
        