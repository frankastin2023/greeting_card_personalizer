var template = `
<div>
    <button @click="displayModal('image-region')">Add Image</button>
    <button @click="displayModal('text-region')">Add Text</button>
    <label  @click="triggerUploadPSD" class="upload_psd">Upload PSD</label>
    <input id="upload_psd" ref="upload_psd" style="display:none" type="file"  @change="uploadPSD"/>

    <draggable class="clearfix" @end="renderCanvas" v-model="$store.state.card.activeView.layers">
        <div @click="changeActiveLayer(index)" v-for="(layer ,index) in layers" :class="activeLayer == layer ? 'selected' : ''" :key="index" class="ui-layer">
            <div @click="deleteLayer(index)"  class="ui-delete"><span class="fa fa-times"></span></div>
            <div  v-if="layer.type == 'image-region'" :style="{backgroundImage : 'url(' + layer.imageURL + ')'}" class="image-preview"> </div>
            <i v-if="layer.type == 'text-region'" class="fas fa-text">T</i>
            <input class="ui-view-name" v-model="layer.name"  />
        </div>
    </draggable>

    <div v-show="ui.modals.layersModal" class="ui-modal-background">
        <div class="ui-modal" >
            <h2>Add Layer Title <div class="close"  @click="toggleModal"><span class="fa fa-times"></span></div></h2>
            <input type="text" @keyup.enter="addLayer()" v-model="layerName" placeholder="Layer name, eg: main text"/>
            <button @click="addLayer()">Add Layer</button>
        </div>
    </div>
</div>
`

Vue.component('CardLayers', {
    data : function() {
        return {
            layerName : '' 
        }
    },
    computed : {
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        layers() { return this.$store.state.card.activeView.layers ? this.$store.state.card.activeView.layers : [] },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        activeView() { return this.$store.state.card.activeView }
    },
    methods : {
        triggerUploadPSD() {
            if(!this.activeView) return alert('Please add a View');
            const elem = this.$refs.upload_psd
            elem.click()
        },
        displayModal(type) {
            if(!this.activeView) return alert('Please add a View');
            this.currentType = type;
            this.toggleModal(type);
        },
        toggleModal(type) {
            if(type == 'psd') {
                this.$store.state.ui.modals.layersPSDModal = !this.$store.state.ui.modals.layersPSDModal;
            } else {
                this.$store.state.ui.modals.layersModal = !this.$store.state.ui.modals.layersModal;
            }
            
        },
        uploadPSD(e) {
            if(!this.activeView) return alert('Please add a View');
            var that = this;
            var PSD = require('psd');
            var filename = e.target.value.split("\\");
            
            filename = filename[filename.length - 1].replace('.psd','_')
            this.ui.loading = true;
            var psd = PSD.fromDroppedFile (e.target.files[0]).then(function(psd) {
                that.$store.state.card.width = psd.tree().width;
                that.$store.state.card.height = psd.tree().height;
                var layers = psd.tree().descendants();

                console.log(psd.tree().export())

                var images = [];
                layers.forEach(function(layer) {
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
                        
                        var _layer = {
                            name : info.text.value,
                            width : info.width,
                            height : 100,
                            x : info.left,
                            y : info.bottom,
                            type : 'text-region',
                            text : info.text.value,
                            fontSize : Math.round(fontSize),
                            fontWeight : fontWeight,
                            fontFamily : fontFamily,
                            lineHeight : Math.round(fontSize) * 0.40,
                            letterSpacing : '1em',
                            color: 'rgb(' +RGB.join(',') + ')',
                            textAlign : 'center',
                            textModifyer : 'static'
                        }
                        
                    } else {
                      
                       if(info.type == 'group') return;

                       var img = layer.toPng();
                       
                       var base64 = img.src;
                       
                       var base64ImageContent = base64.replace(/^data:image\/(png|jpg);base64,/, "");
                       var blob = base64ToBlob(base64ImageContent, 'image/png'); 

                       var formData = new FormData();
                       formData.append('picture', blob);
                       formData.append('action', 'upload_image');
                       formData.append('filename' , filename + '_' + info.name.toLowerCase().replace(' ' , '_') )

                       images.push(img);

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
                    }

                    that.$store.dispatch('addLayer', _layer);

                    var index = that.$store.state.card.activeView.layers.length - 1;

                    $.ajax({
                        url: ajaxurl, 
                        type: "POST", 
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: formData})
                        .done(function(e){
                            that.$store.state.card.activeView.layers[index].imageURL = e;
                            
                        });
                    
                }) 
                var length = images.length;
                var itts = 0;
                images.forEach(function(img) {
                    img.onload = function() {
                       itts ++;
                       if(itts == length) {
                        that.$root.$emit('renderCanvas'); 
                         setTimeout(function() {
                            that.$root.$emit('renderCanvas'); 
                            setTimeout(function() {
                                that.$root.$emit('renderCanvas');  
                             },200) 
                         },200)
                       }
                    }
                }) 

                that.$set(that.$store.state.card.activeView, 'activeLayer', that.$store.state.card.activeView.layers[that.$store.state.card.activeView.layers.length - 1])
                   
            });

        },
        renderCanvas() {
            that.$root.$emit('renderCanvas');  
        },
        addLayer : function(){
            let layer;

            switch(this.currentType) {
                case 'image-region' : 

                layer = {
                    name : this.layerName,
                    width : 100,
                    height : 100,
                    constrain : true,
                    x : 0,
                    y : 0,
                    image : '',
                    filter : null,
                    imageX : 0,
                    imageY : 0,
                    imageScale : 1,
                    imageRotation : 0,
                    aspectW : 1,
                     aspectH : 1,
                    type: 'image-region'
                }

                break;

                case 'text-region' : 

                layer = {
                    name : this.layerName,
                    width : 100,
                    height : 100,
                    x : 0,
                    y : 40,
                    type : 'text-region',
                    text : '',
                    fontSize : '16',
                    fontWeight : 'normal',
                    fontFamily : 'sans-serif',
                    letterSpacing : '1em',
                    color: '#000',
                    textAlign : 'left',
                    textModifyer : 'static'
                }

                break;

                case 'static-image' : 

                layer = {
                    name : this.layerName,
                    type : 'static-image',
                    width : 100,
                    height : 100,
                    x : 0,
                    y : 0,
                    image : '',
                }

                break;
            }
            

            this.$store.dispatch('addLayer', layer);

            this.toggleModal();
            
            this.$set(this.$store.state.card.activeView, 'activeLayer', this.$store.state.card.activeView.layers[this.$store.state.card.activeView.layers.length - 1])
            
            //Clear field
            this.layerName = '';

        },
        deleteLayer(index) {
            var conf = confirm('Are you sure you would like to delete this View');
            if(conf) this.$store.dispatch('deleteLayer', index);
        },
        changeActiveLayer(index) {
            this.activeView.activeLayer = this.activeView.layers[index];
            
            this.$set(this.$store.state.card.activeView.activeLayer, 'activeLayer', this.activeView.layers[index])
            
        },
        loadSaveData() {
            var that = this;
            var queryvards = window.location.search.slice(1)
                      .split('&')
                      .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                        b = b.split('=');
                        a[b[0]] = decodeURIComponent(b[1]);
                        return a;
                      }, {});

                    if(queryvards.post && ($('#publish').val() == 'Update')) {
                        this.ui.loading = true;
                        $.post(ajaxurl,{
                            action : 'get_saved_data',
                            post : queryvards.post
                        } , function(e) {
                            var card = JSON.parse(e);

                            that.$store.state.card.width = card.width;
                            that.$store.state.card.height = card.height;

                            card.views.forEach(function(saved_view) {
                                var view = {
                                    name : saved_view.name,
                                    layers : [],
                                    image : null
                                }

                                var images_loaded = 0;

                                var images = [];

                                that.$store.dispatch('addView', view);
                                
                                
                                that.$set(that.$store.state.card , 'activeView', that.$store.state.card.views[that.$store.state.card.views.length - 1])

                                
                                saved_view.layers.forEach(function(layer) {
                                   
                                    if(layer.type == 'text-region') {
                                    } else {
                                        layer.image = new Image()
                                        layer.image.src = layer.imageURL;
                                        images.push(layer.image)
                                    }

                                    that.$store.dispatch('addLayer', layer);
                                            
                                })

                                that.$set(that.$store.state.card.activeView, 'activeLayer', that.activeView.layers[that.activeView.layers.length - 1])


                                images.forEach(function(image) {
                                    image.onload = function() {
                                        images_loaded ++;
                                        console.log(images_loaded ,images.length)
                                        if(images_loaded == (images.length)) {
                                           setTimeout(function() {
                                            that.$root.$emit('renderCanvas')
                                            setTimeout(function() {
                                                that.$root.$emit('renderCanvas')
                                               },200)
                                           },200)
                                            
                                           
                                        }
                                    }
                                })
                                
                            })

                        })
                    }
                     

        
        }
    },
    created : function() {
        this.loadSaveData();
    },
    template : template
});




