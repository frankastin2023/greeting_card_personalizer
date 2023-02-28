var template = `
<div>
    <div class="ui-option col-2">
            <label>Upload Image:</label>
            <label @click="uploadImage"for="uploadImage"><span class="fa fa-upload"></span></label>
        
    </div>
    <div class="ui-option col-2">
    <label>Customer Can Upload:</label>
    <input type="checkbox" v-model="activeLayer.customCanUpload"/>
    </div>
    <div class="ui-option col-1">
        <label>X:</label>
        <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.x"/>
    </div>
    <div class="ui-option col-1">
        <label>Y:</label>
        <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.y"/>
    </div>
        <div class="ui-option col-1">
        <label>Width:</label>
        <input type="number" @keyup="renderCanvas('width')" @change="renderCanvas('width')" v-model="activeLayer.width"/>
    </div>

    <div class="ui-option col-1">
        <label>Height:</label>
        <input type="number" @keyup="renderCanvas('height')" @change="renderCanvas('height')" v-model="activeLayer.height"/>
    </div>
    <div class="ui-option">
        <label class="constrain" :class="activeLayer.constrain ? 'constrained' : '' " @click="toggleConstrain">Constrain Dimensions</label>
    </div>
</div>
`

Vue.component('ImageRegionOptions', {
    computed : {
        views() { return this.$store.state.card.views },
        card() { return this.$store.state.card },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        window : () => window,
        uploadWindow() { return window.wp.media({

            // Accepts [ 'select', 'post', 'image', 'audio', 'video' ]
            // Determines what kind of library should be rendered.
            frame: 'select',
        
            // Modal title.
            title: "'Select Images'",
        
            // Enable/disable multiple select
            multiple: false,
        
            // Library wordpress query arguments.
            library: {
                order: 'DESC',
        
                // [ 'name', 'author', 'date', 'title', 'modified', 'uploadedTo', 'id', 'post__in', 'menuOrder' ]
                orderby: 'date',
        
                // mime type. e.g. 'image', 'image/jpeg'
                type: 'image',
        
                // Searches the attachment title.
                search: null,
        
                // Includes media only uploaded to the specified post (ID)
                uploadedTo: null // wp.media.view.settings.post.id (for current post ID)
            },
        
            button: {
                text: 'Done'
            }
        
        });}
    },
    methods : {
        renderCanvas : function() { this.$root.$emit('renderCanvas'); },
        toggleConstrain() {
            this.activeLayer.constrain = !this.activeLayer.constrain ;
        },
        uploadImage(e) {
            this.uploadWindow.open();
        },
        renderCanvas : function(type) { 
            if(type == 'width') {
                if(this.activeLayer.constrain) {
                 this.activeLayer.height = Math.round(+  this.activeLayer.aspectW * this.activeLayer.width);
               
                }
            }
             if(type == 'height') {
                if(this.activeLayer.constrain) {
                    this.activeLayer.width = + Math.round(+ this.activeLayer.height * this.activeLayer.aspectH);
                }
            }
            this.$root.$emit('renderCanvas'); 
            },
        loadPreviewImage(url) {
            
            var activeLayer = this.$store.state.card.activeView.activeLayer;

            this.activeLayer.image = new Image();
            this.activeLayer.image.src = url;
            this.activeLayer.imageURL = url;

            var that = this;

            this.activeLayer.image.onload = function() {
                activeLayer.width = activeLayer.image.width;
                activeLayer.height = activeLayer.image.height;
                activeLayer.aspectW = activeLayer.height / activeLayer.width;
                activeLayer.aspectH = activeLayer.width / activeLayer.height;
                that.$root.$emit('renderCanvas');
            }

            this.$forceUpdate();
        },
    },
    created : function() {
        var that = this;
        this.uploadWindow.on( 'select', function() {

            // write your handling code here.
            var selectedImages = that.uploadWindow.state().get( 'selection' ).first();
            that.loadPreviewImage(selectedImages.attributes.url);
            // Probably send the image IDs to the backend using ajax?
        });
    },
    template : template
});