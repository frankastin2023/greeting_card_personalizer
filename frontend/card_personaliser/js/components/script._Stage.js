var template = `
<div id="card_stage">
    <canvas :width="card.width" :height="card.height" :style="{width:+ cardStyleWidth + 'px',height: cardStyleHeight + 'px'}" class="card-canvas"></canvas>
    <div v-for="(layer,index) in card.editableLayers" :class="activeView.activeEditableLayer == layer ? 'selected' : ''"  @click="changeActiveLayer(layer)" :style="{width:layer.width + 'px',height:layer.height + 'px',top:layer.y + 'px',left:layer.x + 'px'}" class="editableLayer" :key="index">
        <i v-if="layer.type == 'image'" class="fas fa-camera"></i>
        <i v-if="layer.type == 'text'" class="fa fa-text">T</i>
    </div>
</div> 
`;
Vue.component('CardStage', {
    computed : {
        views() { return this.$store.state.card.views },
        activeView() { return this.$store.state.card.activeView },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        window : () => window,
        cardStyleWidth :  { 
            get(){
                setTimeout(function() {
                    return $('#card_stage').width();
                },100)
               
              },
              set(newValue){
                return newValue
              } 
             
         },
        cardStyleHeight :  { 
            get(){
                return  ($('#card_stage').width() * (this.$store.state.card.height / this.$store.state.card.width))
              },
              set(newValue){
                return newValue
              } 
             
         }, 
   
    },
    methods : {

        changeActiveLayer (layer) {

            this.$set(this.$store.state.card.activeView, 'activeEditableLayer', layer);

            var _layer = this.$store.state.card.activeView.layers[layer.index];

            this.$set(this.$store.state.card.activeView, 'activeLayer', _layer);
        },

        renderCanvas : function(isReload) {

            var percent = $('#card_stage').width() * (100 / this.card.width) /100  ;
         
            this.ctx.clearRect(0,0,this.card.width,this.card.height)
            this.ctx.beginPath();

            var layers = this.activeView.layers.slice().reverse();

            var that = this;

            layers.forEach((layer,index) => {

                layer.x = + layer.x;
                layer.y = + layer.y;
                layer.width = + layer.width;
                layer.height = + layer.height;

                switch (layer.type) {
                    case 'text-region' :

                            this.ctx.fillStyle = layer.color;
                            this.ctx.textBaseline = '';
                            this.ctx.font =  layer.fontWeight + ' ' + layer.fontSize + 'px ' + layer.fontFamily;
                            
                            layer.fontSize = isReload ? layer.fontSize : layer.fullFontSize;

                            var textHeight = getTextHeight(layer.fontFamily , layer.fontSize + 'px ' ).height;
                            
                            layer.lineHeight = layer.lineHeight ? layer.lineHeight : (layer.fontSize * 0.4);

                            switch (layer.textAlign) {

                                case 'left' : 
                                this.ctx.textAlign = 'left';
                                layer.boxHeight = wrapText(this.ctx,layer, + layer.x  ,layer.y, layer.width, textHeight , layer.lineHeight )
                                break;

                                case 'center' : 
                                this.ctx.textAlign = 'center';
                                layer.boxHeight = wrapText(this.ctx,layer, + layer.x + (layer.width / 2) ,layer.y, layer.width, textHeight , layer.lineHeight )
                                break;

                                case 'right' : 
                                this.ctx.textAlign = 'right';
                                layer.boxHeight = wrapText(this.ctx,layer, + layer.x + layer.width ,layer.y, layer.width, textHeight , layer.lineHeight )
                                break;

                            }
                           
                        break;
                    case 'image-region' :
                            
                       this.ctx.drawImage(layer.image,layer.x ,layer.y ,layer.width,layer.height);
                            
                    break; 


                        
                    }

                   
                });
                
             
            
             this.ui.loading = false;
        },

        renderEditableLayers() {

            var percent = $('#card_stage').width() * (100 / this.card.width) /100  ;
          
            
            var layers = this.activeView.layers.slice().reverse();
          

            var that = this;

            layers.forEach((layer,index) => {

                layer.x = + layer.x;
                layer.y = + layer.y;
                layer.width = + layer.width;
                layer.height = + layer.height;

            if(layer.type == 'text-region') {
                if(layer.textModifyer == 'editable') {
                    
                    var editableLayer = {
                        type : 'text',
                        width : Math.abs(layer.width * percent) + (layer.fontSize * 0.1),
                        height : Math.abs(layer.boxHeight * percent),
                        x : Math.abs(layer.x * percent) - (layer.fontSize * 0.05),
                        y : Math.abs( ( (layer.y - layer.boxHeight ) + (layer.fontSize * 0.2) ) * percent),
                        index : (layers.length -1) -  index,
                    }
                
                    that.card.editableLayers.push(editableLayer);
                }
            } else {
                if(layer.customCanUpload) {
                    
                    var editableLayer = {
                        type : 'image',
                        width : Math.abs(layer.width * percent),
                        height : layer.height * percent,
                        x : Math.abs(layer.x * percent) ,
                        y : Math.abs( layer.y  * percent),
                        index : (layers.length -1) -  index,
                    }
                
                    that.card.editableLayers.push(editableLayer);

                }
            }

        })

        },
        updateCanvasSize() {
            this.cardStyleWidth = (($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.width : ($('#card_stage').width() - 320) ;
            this.cardStyleHeight = (($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.height : (($('#card_stage').width() - 320) * (this.$store.state.card.height / this.$store.state.card.width)) ;
            this.$forceUpdate();
        }

    },
    created : function() {
        var that = this;

        setTimeout(() => {
            this.canvas = document.querySelector('.card-canvas');
            this.ctx = this.canvas.getContext('2d');
            
        },100);

        window.addEventListener("resize", this.updateCanvasSize);

         this.$root.$on('renderCanvas', function() {
             setTimeout(() => {
                 
                
             that.renderCanvas();
             setTimeout(() => {
             if(!that.hasAddedEditables) {
                that.renderEditableLayers();
                that.hasAddedEditables = true;
             }
            },100);
            },100);
         })
    },
    template : template
});
