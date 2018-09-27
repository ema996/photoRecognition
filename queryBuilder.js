function uploadPhoto(){ 
    return `INSERT INTO photos (photoName, description,photourl)
    VALUES ($1, $2, $3) returning *` 
};


function insertLabelsAndPhotoStatus(){
    return `
    UPDATE photos
    SET photostatus = $1,labels = $2::TEXT[]
    WHERE photourl LIKE $3
     returning *`; 
}


function allPhotos() {
    return `
    SELECT *
    FROM photos
    `; 
}

module.exports = {
    uploadPhoto,
    insertLabelsAndPhotoStatus,
    allPhotos
}
