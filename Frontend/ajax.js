
    $(document).ready(function(){
        var uploadUrl;
        setInterval(function(){ 
          if(!uploadUrl) {
            console.log('Nema url');
          } else {
              var url = uploadUrl;
              uploadUrl = null;
              var theFormFile = $('#file_photo').get()[0].files[0];
              
              $.ajax({
              url: url,
              type: "PUT",
              data: theFormFile,
              contentType: 'binary/octet-stream',
              headers: {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*",
              },
              processData: false,
              success: function (response) {
                $('#spinner').hide();
                $('#formContent').prop('disabled', false);
                $('#alert_ajax_success').modal('toggle');
                
              console.log(response);
            } ,
            error: function (xhr, status) {
              $('#spinner').hide();
              $('#formContent').prop('disabled', false);
              $('#alert_ajax_failure').modal('toggle');                       
        }
      })
    }
        }, 3000);
  
        $("#submitId").click(function(){
          if (!$("#formId").valid()) {
            return;
          }
          $('#spinner').show();
          $('#formContent').prop('disabled', true);
          var theFormFile = $('#file_photo').get()[0].files[0];
          console.log(theFormFile);
          var extension = theFormFile.name.split('.').pop();
          console.log(extension);
          $.ajax({
            url: "https://54ffxf4w63.execute-api.us-east-2.amazonaws.com/testing/upload-photo",
            type: "POST",
            crossDomain: true,
            data: JSON.stringify({
                                    photoName: $("#photoNameId").val(),
                                    description: $("#descriptionId").val(),
                                    extension: '.'+extension
                                }),
            headers: {
              "accept": "application/json",
              "Access-Control-Allow-Origin":"*",
              "Content-Type": "application/json"
          },
  
            success: function (response) {
                uploadUrl = response.url;
                console.log(uploadUrl);
             },
  
            error: function (xhr, status) {
              alert("error");
            }
        })
    
      })
  
      $("#formId").validate({ 
        errorClass: 'errors',
        rules: {
         photoName: "required",
         description: "required"
        },
  
        messages: {
          photoName: "Please enter photo name.",
          description: "Please enter description" 
          }
      })

      $("#closeBtnSuccessId").click(function(){
        $("#formId")[0].reset();
      })

      $("#closeBtnFailureId").click(function(){
        $("#formId")[0].reset();
      })
      
    })
    
