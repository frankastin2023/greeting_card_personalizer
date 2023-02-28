var MY_CARD_BOX = MY_CARD_BOX ? MY_CARD_BOX : {};

MY_CARD_BOX.uploadPSD = function(event,vueInstance) {
    
            var PSD = require('psd');

            var filename = event.target.value.split("\\");
            filename = filename[filename.length - 1].replace('.psd','_')
            

            vueInstance.ui.loading = true;

            var psd = PSD.fromDroppedFile (event.target.files[0]).then(function(psd) {
                vueInstance.$store.state.card.width = psd.tree().width;
                vueInstance.$store.state.card.height = psd.tree().height;
                var layers = psd.tree().descendants();

                var promises = [];

                var itterations = 0;

                layers.forEach(function(layer, index) {

                    var info = layer.export();

                    if(info.text) {

                        var fontFamilySplit = info.text.font.name.split('-')

                        var fontFamily = fontFamilySplit[0].match(/($[a-z])|[A-Z][^A-Z]+/g).join(" ");
                        
                        var fontWeight = fontFamilySplit[1] ? fontFamilySplit[1].toLowerCase() : 'normal';
                        fontWeight = fontWeight.indexOf('bold') > -1 ? 'bold' : fontWeight;
                        fontWeight = fontWeight.indexOf('regular') > -1 ? 'normal' : fontWeight;
                        
                        var transY = info.text.transform.yy;
                        
                        var fontSize = info.text.font.sizes[0];

                        fontSize = Math.round((fontSize * transY) * 100) * 0.01;
                       
                        var CMYK = [];
                        CMYK[0] = info.text.font.colors[0][0] * 100 / 255;
                        CMYK[1] = info.text.font.colors[0][1] * 100 / 255;
                        CMYK[2] = info.text.font.colors[0][2] * 100 / 255;
                        CMYK[3] = info.text.font.colors[0][3] * 100 / 255;

                        var RGB = calc(CMYK[0],CMYK[1],CMYK[2],CMYK[3]);

                        var lineHeight = Math.round(fontSize) * 0.40;

                        var text = addNewLines(info.text.value, info.width,fontSize,fontFamily, fontWeight);
                        
                        var _layer = {
                            name : info.text.value,
                            width : info.width,
                            height : info.height,
                            x : info.left,
                            y : info.bottom,
                            type : 'text-region',
                            text : text,
                            fontSize : Math.round(fontSize),
                            fontWeight : fontWeight,
                            fontFamily : fontFamily,
                            lineHeight : lineHeight,
                            letterSpacing : '1em',
                            color: 'rgb(' +RGB.join(',') + ')',
                            textAlign : 'center',
                            textModifyer : 'static'
                        }

                        vueInstance.$store.dispatch('addLayer', _layer);

                        itterations ++;

                        promises.push(new Promise(function(resolve) {
                                resolve();
                        }));
                    } else {
                       
                       if(info.type == 'group') return;
                       MY_CARD_BOX.uploadPSDImage(layer,info,vueInstance,filename,promises);
                    
                    }

                   
                            }) 
                
                          //  vueInstance.$set(vueInstance.$store.state.card.activeView, 'activeLayer', vueInstance.$store.state.card.activeView.layers[vueInstance.$store.state.card.activeView.layers.length - 1])
                            
                Promise.all(promises).then((values) => {
                    
                    vueInstance.ui.loading = false;
                        vueInstance.$root.$emit('renderCanvas'); 
                         setTimeout(function() {
                            vueInstance.$root.$emit('renderCanvas'); 
                            setTimeout(function() {
                                vueInstance.$root.$emit('renderCanvas');  
                               
                             },200) 
                         },200)
                       
                });
                       
                
                
            });
}

