
var MY_CARD_BOX = MY_CARD_BOX ? MY_CARD_BOX : {};

MY_CARD_BOX.uploadPSDImage = function(layer,info,vueInstance,filename,promises) {
    
    var img = layer.toPng();

    var layer_filename = filename + '_' + info.name.toLowerCase().replace(' ' , '_');
    
    var _layer;
    _layer = {
        name : info.name,
        width : info.width,
        height : info.height,
        constrain : true,
        x : info.left,
        y : info.top,
        image : img,
        imageURL : '',
        filter : null,
        imageX : 0,
        imageY : 0,
        imageScale : 1,
        imageRotation : 0,
        aspectW : 1,
        aspectH : 1,
        type: 'image-region'
    }

    var index = vueInstance.$store.state.card.activeView.layers.length - 1;
                       
    var base64 = img.src;

    var modLeft = 0;
    var crop = false;

    if(info.left < 0) {
        var modLeft = Math.abs(info.left);
        _layer.x  = 0;
        _layer.width = layer.width - modLeft;
        crop = true;
    }

    var modTop = 0;

    if(info.top < 0) {
    var modLeft = Math.abs(info.top);
    _layer.y  = 0;
    _layer.height = layer.height - modTop;
    crop = true;
    }

    vueInstance.$store.dispatch('addLayer', _layer);

    var index = vueInstance.$store.state.card.activeView.layers.length - 1;
                        
    if(crop) {
        
        _layer.image.onload = function() {
            var canvas = document.createElement("canvas");
            ctx = canvas.getContext('2d')

            canvas.width = _layer.width;
            canvas.height = _layer.height;

            ctx.drawImage( this , info.left, info.top, info.width, info.height);
            
            vueInstance.$store.state.card.activeView.layers[index].image = new Image();
            vueInstance.$store.state.card.activeView.layers[index].image.src = canvas.toDataURL();

            MY_CARD_BOX.base64Upload(_layer.image.src,layer_filename, vueInstance.$store.state.card.activeView.layers[index]);
            
            promises.push(new Promise(function(resolve) {
                vueInstance.$store.state.card.activeView.layers[index].image.onload = function() {
                    resolve();
                }
            }));
        }

    } else {
        MY_CARD_BOX.base64Upload(img.src,layer_filename, vueInstance.$store.state.card.activeView.layers[index]);
        
        promises.push(new Promise(function(resolve) {
            img.onload = function() {
                resolve();
            }
        }));
    }

}

