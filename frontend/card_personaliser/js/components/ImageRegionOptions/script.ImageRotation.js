var template = `<div>
  <div class="ui-option">
        <label>Rotate Image:</label>
        <canvas @mousedown="startRotateImage" @mousemove="dragRotateImage" @mouseup="stopRotateImage" @mouseleave="stopRotateImage" id="rotate-canvas"></canvas>
   </div>
</div>`;

Vue.component('ImageOptionsRotation', {

    computed : {
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
    },

    template: template,
    
    methods : {
    
    renderRotationCanvas() {
        this.canvas = document.querySelector('#rotate-canvas')
        this.ctx = this.canvas.getContext('2d');

        this.canvas.height = 80;
        this.canvas.width = 80;

        this.ctx.clearRect(0,0,80,80);
        
        /* Circle Background */

        this.ctx.beginPath();
        this.ctx.strokeStyle = '#ccc'
        this.ctx.lineWidth = 3;
        this.ctx.arc(40, 40, 38, 0, 2 * Math.PI );
        this.ctx.stroke();
        this.ctx.closePath();

        /* Circle Indicator */
        
        this.ctx.beginPath();
        this.ctx.arc(40, 40, 38, 1.5*Math.PI, this.activeLayer.imageRotation );
        this.ctx.strokeStyle = '#ee447d';
        this.ctx.stroke();
        this.ctx.closePath();

        /* Knob */

        this.ctx.save()
        this.ctx.setTransform(1, 0, 0, 1, 40, 40);
        this.ctx.rotate(this.activeLayer.imageRotation);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(5,-5);
        this.ctx.lineTo(40,0);
        this.ctx.lineTo(5,5);
        this.ctx.lineTo(0, 0);
        this.ctx.fillStyle = '#ee447d';
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.restore();

    },

    startRotateImage : function(e) {
        this.is_dragging = true;
        var x2 = e.offsetX; 
        var y2 = e.offsetY;
        var deltaX = x2 - 40;
        var deltaY = y2 - 40;
        var rad = Math.atan2(deltaY, deltaX); 
        
        this.activeLayer.imageRotation = rad;
        this.$emit('image-rotated');
        this.renderRotationCanvas();
        this.$root.$emit('renderPreviewCanvas');
    },

    dragRotateImage : function(e) {
        if(!this.is_dragging) return;
        var x2 = e.offsetX; 
        var y2 = e.offsetY;
        var deltaX = x2 - 40;
        var deltaY = y2 - 40;
        var rad = Math.atan2(deltaY, deltaX); 

        this.activeLayer.imageRotation = rad;

       
        
        this.$root.$emit('renderPreviewCanvas');

        this.$emit('image-rotated');
        this.renderRotationCanvas();
    },
    stopRotateImage : function() {
        this.is_dragging = false;
        this.$root.$emit('renderPreviewCanvas');
    }
},
created : function() {
    var that = this;
    setTimeout(function() {
        that.renderRotationCanvas();
    },100)
    this.$root.$on('renderRotationKnob',function() {
        that.renderRotationCanvas();
    });
}
});

