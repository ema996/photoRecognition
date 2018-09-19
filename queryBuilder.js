function uploadPhoto(){ 
    return `INSERT INTO photos (photoName, description,photourl)
    VALUES ($1, $2, $3) returning *` };


module.exports = {
    uploadPhoto
}
