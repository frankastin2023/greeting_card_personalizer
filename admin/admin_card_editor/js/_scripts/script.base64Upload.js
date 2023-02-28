
var MY_CARD_BOX = MY_CARD_BOX ? MY_CARD_BOX : {};
MY_CARD_BOX.base64Upload = function(base64,filename, layer) {
    
    var base64ImageContent = base64.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = base64ToBlob(base64ImageContent, 'image/png'); 
    
    var formData = new FormData();
    formData.append('picture', blob);
    formData.append('action', 'upload_image');
    formData.append('filename' , filename.toLowerCase().replace(' ' , '_') );

    $.ajax({
        url: ajaxurl, 
        type: "POST", 
        cache: false,
        contentType: false,
        processData: false,
        data: formData})

        .done(function(e){
            layer.imageURL = e;
        });
}

