var template = `
<div>
    <button @click="displayModal('image-region')">Add Image</button>
    <button @click="displayModal('text-region')">Add Text</button>
    <label  @click="triggerUploadPSD" class="upload_psd">Upload PSD</label>
    <button id="clearLayers" @click="clearLayers">Clear Layers</button>
    <input id="upload_psd" ref="upload_psd" style="display:none" type="file"  @change="uploadPSD"/>

    <draggable class="clearfix" @end="renderCanvas" v-model="layers">
        <div @click="changeActiveLayer(index)" v-for="(layer ,index) in layers" :class="activeView.activeLayer == layer ? 'selected' : ''" :key="index" class="ui-layer">
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
        layers : { 
            get: function () {

            return this.$store.state.card.activeView && this.$store.state.card.activeView.layers ? this.$store.state.card.activeView.layers : []
         },
         set : function(newvalue) {
            this.$store.state.card.activeView.layers = newvalue;
         }
        },
        activeLayer() { return this.$store.state.card.activeView ?  this.$store.state.card.activeView.activeLayer : {} },
        activeView() { return this.$store.state.card.activeView }
    },
    methods : {
        clearLayers() {
            this.$store.dispatch('clearLayers');
        },
        triggerUploadPSD() {
            if(!this.activeView) return alert('Please add a View');
            const elem = this.$refs.upload_psd;
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
        uploadPSD(event) {
            MY_CARD_BOX.uploadPSD(event,this);
        },
        renderCanvas() {
            this.$root.$emit('renderCanvas');  
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
                    textModifyer : 'static',
                    lineHeight : 6
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
        
            //Clear field
            this.layerName = '';

        },
        deleteLayer(index) {
            var conf = confirm('Are you sure you would like to delete this Layer');
            if(conf) this.$store.dispatch('deleteLayer', index);
            this.renderCanvas();
        },
        changeActiveLayer(index) {

            this.$store.dispatch('changeActiveLayer', this.$store.state.card.activeView.layers[index]);
            this.renderCanvas();
           
        }
    },
    created : function() {

         
    },
    template : template
});




