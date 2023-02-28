var template = `
<div ref="container">
    <canvas ref="canvas" class="preview-canvas" id="image_preview"></canvas>
    <button @click="reset"><i class="fas fa-history"></i></button>

    <div class="ui-tab-headers">
        <div class="ui-tab">Upload Image</div>
        <div class="ui-tab">Position Image </div>
        <div class="ui-tab">Effects</div>
    </div>

    <div class="photo-upload ui-tab">
        <label for="photo_upload" class="photo-upload">
        <i class="fas fa-upload"></i>
        </label>
        <input id="photo_upload" @change="upload_photo" type="file"/>
    </div>

    <div class="photo-position ui-tab">
        <div class="zoom-container">
            <button @mousedown="zoomOut('start')" @mouseup="zoomOut('stop')"  @mouseleave="zoomOut('stop')"><i class="fas fa-search-minus"></i></button>
            <button @mousedown="zoomIn('start')" @mouseup="zoomIn('stop')"  @mouseleave="zoomIn('stop')"><i class="fas fa-search-plus"></i></button>
        </div>

        <div class="position-container">
            <button @mousedown="moveLeft('start')" @mouseup="moveLeft('stop')"  @mouseleave="moveLeft('stop')" ><i class="fas fa-arrow-left"></i></button>
            <button @mousedown="moveUp('start')" @mouseup="moveUp('stop')"  @mouseleave="moveUp('stop')"  ><i class="fas fa-arrow-up"></i></button>
            <button @mousedown="moveRight('start')" @mouseup="moveRight('stop')"  @mouseleave="moveRight('stop')"  ><i class="fas fa-arrow-right"></i></button>
            <button @mousedown="moveDown('start')" @mouseup="moveDown('stop')"  @mouseleave="moveDown('stop')"  ><i class="fas fa-arrow-down"></i></button>
        </div>

        <div class="rotation-container">
            <ImageOptionsRotation/>
        </div>
    </div>
    
    <div class="photo-position ui-tab">
           <button :class="activeLayer.filter == 'none' ? 'checked' : ''" @click="setEffect('none')">No Effect</button>
           <button :class="activeLayer.filter == 'greyscale' ? 'checked' : ''" @click="setEffect('greyscale')">Black & White</button>
           <button :class="activeLayer.filter == 'sepia' ? 'checked' : ''" @click="setEffect('sepia')">Sepia</button>
           
    </div>

</div>
`;

Vue.component('ImageOptions', {
    computed : {
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
    },
    methods : {
        reset() {
            this.activeLayer.filter = 'none';
            this.activeLayer.imageRotation = 0;
            this.activeLayer.scale = 1;
            this.activeLayer.modX = 0;
            this.activeLayer.modY = 0;
            this.renderPreviewCanvas();
            this.$root.$emit('renderRotationKnob');
            
        },
        setEffect(type) {
             this.activeLayer.filter = type;
             this.renderPreviewCanvas();

        },
        renderCanvas() {
            this.$root.$emit('renderCanvas');
        },
        upload_photo(e) {
            var that = this;
            var reader = new FileReader();
            
            reader.readAsDataURL(e.target.files[0]);
            
            reader.onload = function () {
                that.activeLayer.imageRaw = new Image();
                that.activeLayer.imageRaw.src = reader.result;
                that.activeLayer.imageRaw.onload = function() {
                
                    that.renderPreviewCanvas();
                }
            };

            reader.onerror = function (error) {
              console.log('Error: ', error);
            };

        },
        zoomOut(type) {
            
            var that = this;
            if(type == 'start') {
                this.zoomInInterval = setInterval(function() {
                    that.activeLayer.scale -= 0.1;
                    that.renderPreviewCanvas();
                },100);

            } else {
                clearInterval(this.zoomInInterval);
            }
        },
        zoomIn(type) {
            var that = this;
            if(type == 'start') {
                this.zoomOutInterval = setInterval(function() {
                    that.activeLayer.scale += 0.1;
                    that.renderPreviewCanvas();
                },100);

            } else {
                clearInterval(this.zoomOutInterval);
            }
        },
        moveUp(type) {
            var that = this;
            if(type == 'start') {
                this.moveUpInterval = setInterval(function() {
                    that.activeLayer.modY -= 10;
                    that.renderPreviewCanvas();
                },100);

            } else {
                clearInterval(this.moveUpInterval);
            }
        },
        moveDown(type) {
            var that = this;
            if(type == 'start') {
                this.moveUpInterval = setInterval(function() {
                    that.activeLayer.modY += 10;
                    that.renderPreviewCanvas();
                },100);

            } else {
                clearInterval(this.moveUpInterval);
            }
        },
        moveLeft(type) {
            var that = this;
            if(type == 'start') {
                this.moveUpInterval = setInterval(function() {
                    that.activeLayer.modX -= 10;
                    that.renderPreviewCanvas();
                },100);

            } else {
                clearInterval(this.moveUpInterval);
            }
        },
        moveRight(type) {
            var that = this;
            if(type == 'start') {
                this.moveUpInterval = setInterval(function() {
                    that.activeLayer.modX += 10;
                    that.renderPreviewCanvas();
                },100);

            } else {
                clearInterval(this.moveUpInterval);
            }
        },
        renderPreviewCanvas() {

            /* Setup canvas */

            this.activeLayer.image = new Image

            this.ctx = this.$refs['canvas'].getContext('2d');
            var canvas = this.$refs['canvas'];

            /* Setup scale and positioning varaibles. */

            this.activeLayer.scale = this.activeLayer.scale ? this.activeLayer.scale : 1;

            this.activeLayer.modX = this.activeLayer.modX ? this.activeLayer.modX : 0;
            this.activeLayer.modY = this.activeLayer.modY ? this.activeLayer.modY : 0;
 
            /* Clear the rect */

            this.ctx.clearRect(-canvas.width,-canvas.height,canvas.width*2,canvas.height*2);

            var pRatio = canvas.width / canvas.height;
                    
            var ratio = this.activeLayer.imageRaw.width / this.activeLayer.imageRaw.height;
            
            if(ratio<pRatio) {
                var imageWidth = canvas.height * ratio;
                var imageHeight = canvas.height
            } else {
                var imageWidth = canvas.width;
                var imageHeight = canvas.height
            }
            

            var imageX = ((canvas.width / 2) - (imageWidth / 2)) ;
            var imageY = ((canvas.height / 2) - (imageHeight / 2)) + this.activeLayer.modY;
 
            
            var rotation = this.activeLayer.imageRotation ? this.activeLayer.imageRotation : 0;

            this.ctx.setTransform(this.activeLayer.scale, 0, 0, this.activeLayer.scale, (imageWidth / 2) + this.activeLayer.modX, (imageHeight / 2) + this.activeLayer.modY );
           
            this.ctx.rotate(rotation);

            /* Draw image */

            if(!this.activeLayer.previewImage) {
                this.ctx.drawImage(this.activeLayer.imageRaw,- (imageWidth / 2), -(imageHeight / 2),imageWidth,imageHeight );
               // return;
            }
           
            /* Process Filters */

            if(this.activeLayer.filter == 'sepia') {
                processSepia(canvas,this.ctx);
            }

            if(this.activeLayer.filter == 'greyscale') {
                processGreyScale(canvas,this.ctx);
            }
            
            this.activeLayer.image = new Image();
            this.activeLayer.image.src = canvas.toDataURL()
            var that = this;
            
            this.activeLayer.image.onload = function() {
                that.renderCanvas();
               
            }


        },

    },

    created : function() {
        var that = this;
        setTimeout(function() {
            
            that.containerWidth = that.$refs['container'].offsetWidth * 0.8;

            that.$refs['canvas'].width = that.activeLayer.width;
            that.$refs['canvas'].height =  that.activeLayer.height;
            
            that.$refs['canvas'].style.width = that.containerWidth + 'px';
            that.$refs['canvas'].style.height =  (that.containerWidth * (that.activeLayer.height / that.activeLayer.width)) + 'px';
            that.renderPreviewCanvas();

        },10);


        this.$root.$on('renderPreviewCanvas', function() {
            setTimeout(() => {
                
            that.renderPreviewCanvas();
           
           },100);
        })
     
    },
   
    template : template
})
