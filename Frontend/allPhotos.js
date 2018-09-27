$(document).ready(function(){

    $.ajax({
        type: "GET",
        url: "https://54ffxf4w63.execute-api.us-east-2.amazonaws.com/testing/all-photos",
        cache: false,
              headers: {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*",
              },
        success: function(data){
           console.log(data);
           console.log('Uspeshno!');
           showPhotos(data);
        },
        
        error: function (xhr, status) {
            console.log('Neuspeshno!');
        }
      });



function showPhotos(array) {
    var html ="";
    for(var i=0;i<array.length;i++){
        var photoUrl="http://www.hartsspace.com/wp-content/uploads/2013/02/not_allowed.png";
        var badgeState = "danger";
        if(array[i].photostatus==1) {
            photoUrl=array[i].photourl;
            badgeState= "success"
        }
        html+=`<div class="col-md-3 col-sm-6 col-xs-12 div-style" >
        <img src="` + photoUrl + `" class="img-responsive"/>
    <h1 class="h1-class">`+array[i].photoname+`</h1>
    <p class="description-class">`+array[i].description+`</p>`;

        for(var k=0;k<array[i].labels.length;k++) {
            html +=`<span class="badge badge-`+badgeState+`">`+array[i].labels[k]+`</span>`
        }
      
    html+=`<br> <br>
    </div>`;
    }
    $("#row").html(html);

}


}) //document ready