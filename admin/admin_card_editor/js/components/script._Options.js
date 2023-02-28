var template = `
<div>
    <div class="ui-sidebar-options">
        <h1 class="ui-sidebar-header">Card Size</h1>
        <div class="ui-sidebar-options-body clearfix">
            <div class="ui-option col-1">
                <label>Width:</label>
                <input type="number" @change="renderCanvas" @keyup="renderCanvas" v-model="card.width"/>
            </div>

            <div class="ui-option col-1">
                <label>Height:</label>
                <input type="number" @change="renderCanvas" @keyup="renderCanvas" v-model="card.height"/>
            </div>
        </div>
    </div>

    <div class="clearfix ui-sidebar-options" v-if="activeLayer && activeLayer.type == 'text-region'">
        <h1 class="ui-sidebar-header">Text Options</h1>
        <div class="ui-sidebar-options-body">
        <TextOptions/>
        </div>
    </div>

    <div class="clearfix ui-sidebar-options" v-if="activeLayer && activeLayer.type == 'image-region'">
        <h1 class="ui-sidebar-header">Image Region Options</h1>
        <div class="ui-sidebar-options-body">
        <ImageRegionOptions/>
        </div>
    </div>
</div>
`

Vue.component('CardOptions', {
    computed : {
        views() { return this.$store.state.card.views },
        card() { return this.$store.state.card },
        activeLayer() { return this.$store.state.card.activeView ?  this.$store.state.card.activeView.activeLayer : null},
        window : () => window,
    },
    methods : {
        renderCanvas : function() { 
           
            
                this.$root.$emit('renderCanvas');
                console.log('here')
           
           
         }
    },
    template : template
});
