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
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        window : () => window,
        cardStyleWidth :  { 
            get(){
                return ( ($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.width : ($('#card_stage').width() - 320)
              },
              set(newValue){
                return newValue
              } 
             
         },
        cardStyleHeight :  { 
            get(){
                return ( ($('#card_stage').width() - 320) > this.$store.state.card.width) ? this.$store.state.card.height : (($('#card_stage').width() - 320) * (this.$store.state.card.height / this.$store.state.card.width))
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

                            switch (layer.textAlign) {

                                case 'left' : 
                                this.ctx.textAlign = 'left';
                                wrapText(this.ctx,layer.text, + layer.x  ,layer.y, layer.width, textHeight +  ( + layer.lineHeight), layer.fontSize)
                                break;

                                case 'center' : 
                                this.ctx.textAlign = 'center';
                                wrapText(this.ctx,layer.text, + layer.x + (layer.width / 2) ,layer.y, layer.width, textHeight + ( + layer.lineHeight), layer.fontSize)
                                break;

                                case 'right' : 
                                this.ctx.textAlign = 'right';
                                wrapText(this.ctx,layer.text, + layer.x + layer.width ,layer.y, layer.width, textHeight + ( + layer.lineHeight), layer.fontSize)
                                break;

                            }
                        break;
                    case 'image-region' :
                            if(this.activeView.activeLayer == layer) {
                                this.ctx.rect(layer.x,layer.y,layer.width,layer.height);
                                this.ctx.stroke();
                            }
                            
                            this.ctx.drawImage(layer.image,layer.x,layer.y,layer.width,layer.height);
                            
                    break; 
                        
                    }
                });

             this.activeView.image = this.canvas.toDataURL();
             this.$root.$emit('forceUpdate') ;
             this.ui.loading = false;
        },
        updateCanvasSize() {
            this.$forceUpdate();
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

