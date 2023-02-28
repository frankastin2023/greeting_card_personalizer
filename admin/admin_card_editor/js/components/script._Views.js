var template = `
<div>
    <button @click="displayModal('image-region')">Add View</button>

    <draggable class="clearfix" @end="renderCanvas" v-model="$store.state.card.views">
        <div @click="changeActiveLayer(index)" v-for="(view ,index) in views" :class="activeView == view ? 'selected' : ''" :key="index" class="ui-view">
            <div @click="deleteLayer(index)"  class="ui-delete"><span class="fa fa-times"></span></div>
            <input class="ui-view-name" v-model="view.name"  />
        </div>
    </draggable>

    <div v-show="ui.modals.viewsModal" class="ui-modal-background">
        <div class="ui-modal" >
            <h2>Add View Title <div class="close"  @click="toggleModal"><span class="fa fa-times"></span></div></h2>
            <input type="text" @keyup.enter="addLayer()" v-model="viewName" placeholder="View name, eg: card front"/>
            <button @click="addView()">Add View</button>
        </div>
    </div>
</div>
`

Vue.component('CardViews', {
    data : function() {
        return {
            viewName : '' 
        }
    },
    computed : {
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        views() { return this.$store.state.card.views },

        layers() { return this.$store.state.card.activeView && this.$store.state.card.activeView.layers ? this.$store.state.card.activeView.layers : [] },
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
        activeView() { return this.$store.state.card.activeView }
    },
    methods : {
        clearLayers() {
            this.$store.dispatch('clearLayers');
        },
        
        displayModal(type) {
            this.currentType = type;
            this.toggleModal(type);
        },
        toggleModal(type) {
          
            this.$store.state.ui.modals.viewsModal = !this.$store.state.ui.modals.viewsModal;
            
            
        },
        uploadPSD(event) {
            MY_CARD_BOX.uploadPSD(event,this);
        },
        renderCanvas() {
            this.$root.$emit('renderCanvas');  
        },
        addView : function(){
            var view = {
                name : this.viewName,
                layers : [],
                activeLayer : {}
            }

            this.$store.dispatch('addView', view);

            this.$store.dispatch('changeActiveView', this.$store.state.card.views[this.$store.state.card.views.length-1]);

            this.toggleModal();
        
            //Clear field
            this.viewName = '';

        },
        deleteLayer(index) {
            var conf = confirm('Are you sure you would like to delete this Layer');
            if(conf) this.$store.dispatch('deleteLayer', index);
            this.renderCanvas();
        },
        changeActiveLayer(index) {

            this.$store.dispatch('changeActiveView', this.$store.state.card.views[index]);
            this.renderCanvas();
           
        }
    },
    created : function() {

         
    },
    template : template
});




