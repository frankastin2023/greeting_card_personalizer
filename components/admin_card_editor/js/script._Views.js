var template = `
<div>
    <ul v-if="views">
        <li  v-for="(view ,index) in views" :key="index" @click="changeActiveView(index)" class="ui-view" :class="view.selected ? 'selected' : ''">
            <div @click="deleteView(index)" class="ui-delete"><span class="fa fa-times"></span></div>
            <div :style="'background-image:url(' + view.image + ')'" class="ui-view-image"></div>
            <input class="ui-view-name" v-model="view.name"  />
        </li>
        <li @click="toggleModal">
            <div class="plus">+</div>
            <p>Add View</p>
        </li>
    </ul>

    <div v-show="$store.state.ui.modals.viewsModal" class="ui-modal-background">
        <div class="ui-modal" >
            <h2>Add View name <div class="close"  @click="toggleModal"><span class="fa fa-times"></span></div></h2>
            <input type="text" @keyup.enter.prevent="addView" v-model="viewName" placeholder="View name, eg: Front of card"/>
            <button @click.prevent="addView()">Add View</button>
        </div>
    </div>
    <input name="json_data" :value="json_data" type="text" style="display:none;" />

</div>
`

Vue.component('CardViews', {
    data : function() {
        return {
            viewName : '' ,
            json_data : null
        }
    },
    computed : {
        views() { return this.$store.state.card.views },
        ui() { return this.$store.state.ui },
        card() { return this.$store.state.card },
        
    },
    methods : {
        toggleModal() {
            this.$store.state.ui.modals.viewsModal = !this.$store.state.ui.modals.viewsModal;
        },
        addView : function() {
            var view = {
                name : this.viewName,
                layers : [],
                image : null
            }
            this.$store.dispatch('addView', view);
            this.toggleModal();
            this.viewName = '';
            this.card.activeView =  this.card.views[this.card.views.length - 1];
        },
        deleteLayer : function(index) {
            var conf = confirm('Are you sure you would like to delete this View');
            if(conf) this.$store.dispatch('deleteView', index);
        },
        changeActiveView : function(index) {
            this.card.activeView = this.card.views[index];
        }
    },
    created : function() {
        var that = this;
        this.$root.$on('forceUpdate', function() {
            setTimeout(function() {
                that.$forceUpdate(); 
            },1000)
            
            console.log('here')
        })
        this.$store.watch((state) => state.card ,function() {
          
           var json_data = Object.assign({} ,that.$store.state.card) ;

            

           json_data.activeView = null;

          if(json_data.views) {
            json_data.views.forEach(function(view) {
                if(view.layers) {
                view.layers.forEach(function(layers) {
                    layers.activeLayer = null
                })
            }
           })
          }
          
            that.json_data = JSON.stringify(json_data);
           

        },{deep:true})
    },
    template : template
});




