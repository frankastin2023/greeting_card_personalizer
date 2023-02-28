var template = `
<div class="clearfix">
    <div class="ui-options">
        <card-options/>
    </div>
    <canvas :width="card.width" :height="card.height" :style="{width:+ cardStyleWidth + 'px',height: cardStyleHeight + 'px'}" class="card-canvas"></canvas>
    <div v-if="ui.loading" class="loading-spinner"><div></div></div>
</div>
</div> 
`

Vue.component('CardStage', {
    computed : {
        views() { return this.$store.state.card.views },
        activeView() { return this.$store.state.card.activeView },
        activeLayer() { return this.$store.state.card.activeView ?  this.$store.state.card.activeView.activeLayer : {} },
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        window : () => window,
        cardStyleWidth :  { 
            get(){
                return ( ($('#card_stage').width() - 330) > this.$store.state.card.width) ? this.$store.state.card.width : ($('#card_stage').width() - 330)
              },
              set(newValue){
                return newValue
              } 
             
         },
        cardStyleHeight :  { 
            get(){
                return ( ($('#card_stage').width() - 330) > this.$store.state.card.width) ? this.$store.state.card.height : (($('#card_stage').width() - 330) * (this.$store.state.card.height / this.$store.state.card.width))
              },
              set(newValue){
                return newValue
              } 
             
         }, 
   
    },
    methods : {
        renderCanvas : function() {
           
            this.ctx.clearRect(0,0,this.card.width,this.card.height)
            this.ctx.beginPath();

            var layers = this.activeView.layers.slice().reverse();

            layers.forEach((layer) => {

                layer.x = + layer.x;
                layer.y = + layer.y;
                layer.width = + layer.width;
                layer.height = + layer.height;

                switch (layer.type) {
                    case 'text-region' :
                            this.ctx.fillStyle = layer.color;
                            this.ctx.textBaseline = '';
                            this.ctx.font =  layer.fontWeight + ' ' + layer.fontSize + 'px ' + layer.fontFamily;

                            var textHeight = getTextHeight(layer.fontFamily , layer.fontSize + 'px ' ).height;
                            
                            layer.lineHeight = layer.lineHeight ? layer.lineHeight : (layer.fontSize * 0.4);

                            switch (layer.textAlign) {

                                case 'left' : 
                                this.ctx.textAlign = 'left';
                                renderMultiLine(this.ctx,layer.text, + layer.x  ,layer.y, layer.width, textHeight +  ( + layer.lineHeight), layer.fontSize)
                                break;

                                case 'center' : 
                                this.ctx.textAlign = 'center';
                                
                                renderMultiLine(this.ctx,layer.text, + layer.x + (layer.width / 2) ,layer.y, layer.width, textHeight + ( + layer.lineHeight), layer.fontSize)
                                break;

                                case 'right' : 
                                this.ctx.textAlign = 'right';
                                renderMultiLine(this.ctx,layer.text, + layer.x + layer.width ,layer.y, layer.width, textHeight + ( + layer.lineHeight), layer.fontSize)
                                break;

                            }
                            if(this.activeLayer == layer) {
                                this.ctx.rect(layer.x  ,layer.y, layer.width, textHeight +  ( + layer.lineHeight));
                                this.ctx.stroke();
                            }
                           
                        break;
                    case 'image-region' :
                    if(layer.image && layer.image.src.indexOf('undefined')< 0)  {
                        this.ctx.drawImage(layer.image,layer.x ,layer.y ,layer.width,layer.height);
                       }  
                    break; 


                        
                    }

                   
                });
                
             
            
             this.ui.loading = false;
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
            },100);
         })
    },
    template : template
});

