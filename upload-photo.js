require('dotenv').config();
const pg = require('pg');
const queryBuilder = require ('./queryBuilder.js');
const AWS = require('aws-sdk');
const createError = require('http-errors');
const db = require('./db.js');
var s3 = new AWS.S3({region: "us-east-2"});
//const multipart = require('parse-multipart');


exports.handler = async(event,context,callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        var data = await uploadPhoto(event);
        callback(null,data)
    } catch (err) {
        const error = {
            status: err.status || 500,
            message: err.message || "Internal server error."
        }
        callback(JSON.stringify(error));
    } 
}

async function uploadPhoto(event) {
    console.log(event);
    var photoName = event.body.photoName;
    console.log('Imeto na slikata e: ',photoName)
    var description = event.body.description;
    console.log('Opis: ',description);
    var extension = event.body.extension;
    console.log('Ova e ekstenzijata: ',extension);

    if(!photoName) {
        var err=createError(400,'Please enter a photo name');
        throw err;
    }

    if(!description) {
        var err=createError(400,'Please enter description');
        throw err;
    }

    function formatDate(date) {
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
      
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var min = date.getMinutes();
        var sec=date.getSeconds();
        var hours = date.getHours();
      
        return day + '_' + monthNames[monthIndex] + '_' + year+'_'+hours+'_'+min+'_'+sec;
      }
      
      var dateNow = formatDate(new Date()); 

      const signedUrlExpireSeconds = 60 * 100;
      console.log('Ova e ekstenzijata: ',extension);
    var keyName = 'image_'+dateNow+extension;
    var filePath = 'https://s3.us-east-2.amazonaws.com/final-project-image-recognition/'+ keyName;
    
    var params = {Bucket: "final-project-image-recognition", Key: keyName};
    var url = await getSignedUrlAsync(params);
    console.log('Ova e url-to: ',url);
    var queryResult = await db.query(queryBuilder.uploadPhoto(),[photoName,description,filePath]);
    console.log('Rezultatot od query-to e: ',queryResult);
    return {"queryResult: ":queryResult.rows[0],
            "url": url
    };
}

async function getSignedUrlAsync(params){
    return new Promise(function(resolve,reject){
        s3.getSignedUrl('putObject',params, function(err,data) {
            if(err){
                console.log('Error uploading data', err);
                reject(err);
            } else{
                resolve(data);
            }
        });
    });

}



// ------

// const pool = new pg.Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASS,
//     port: process.env.DB_PORT,
// })

// var s3 = new AWS.S3({region: process.env.REGION});

// async function putObjectAsync(params){
//     return new Promise(function(resolve,reject){
//         s3.putObject(params, function(err,data) {
//             if(err){
//                 console.log('Error uploading data', err);
//                 reject(err);
//             } else{
//                 console.log('Successfully uploaded data', data);
//                 resolve(data);
//             }
//         });
//     });
// }

// app.post('/uploadPhoto', async (req,res) => {
//     const client = await pool.connect();
//     var sampleFile = req.files.image;
//     var photoName = req.body.photoName;
//     var description = req.body.description;

//     if(!photoName) {
//         return res.status(400).json({message: "Please enter a photo name."});
//     }

   
//     if(!description){
//         res.status(400).json({message: "Please enter a desription."});
//     }

//     if(!req.files) {
//         return res.status(400).send('No file uploaded.');
//     }

//     try {
//         var myBucket = 'image-recognition-final-project';
//         var arraySplitImageName = sampleFile.name.split(".");
//         var keyName = arraySplitImageName[0]+'_'+Date.now()+'.'+arraySplitImageName[1];
//         var params = {
//             Bucket: myBucket,
//             Key: keyName,
//             Body: sampleFile.data
//         };

//         console.log(sampleFile.data);
//         var result = await putObjectAsync(params);
//         var imageUrl = 'https://s3.eu-central-1.amazonaws.com/image-recognition-final-project/'+keyName;
//         var queryResult = await client.query(queryBuilder.uploadPhoto(),[photoName,description]);
//         console.log('Ova e rez od query-to',queryResult.rows);
//         res.status(200).json({photoInfo: queryResult.rows});
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json('There is an error');
//     } finally {
//         client.release();
//     }
// })


// app.listen(80, () => {
//     console.log("Listening on port 80");
//  });
  

    


   
   
