$(document).ready(function() {
    if(window.location.href.indexOf('wp-admin') < 0)  return;
    var App = new Vue({

        el : '#poststuff',

        data : {
            views : [],
            test : 'test',
            json_data : null
        },

        store : store,

        computed : {
            ui() { return this.$store.state.ui },
            card() { return this.$store.state.card },
            layers() { return this.$store.state.card.activeView.layers ? this.$store.state.card.activeView.layers : [] },
            activeLayer() { return this.$store.state.card.activeView.activeLayer },
            activeView() { return this.$store.state.card.activeView }
        },

        created : function() {
            var that = this;

        this.$root.$on('forceUpdate', function() {
            setTimeout(function() {
                that.$forceUpdate(); 
            },1000)
        })


        /* Disable form submit unless publish button */

        $('#post').on('submit', function(e) {
            if(e.originalEvent.submitter.id != 'publish') {
                
                e.preventDefault()

            }
            
        })

         /* Load Saved Data */

         MY_CARD_BOX.loadSavedData(this);

        /* Render data json */

        this.$store.watch((state) => state.card ,function() {
          
           var json_data = $.extend(true, {}, that.$store.state.card) ;

           json_data.activeView = null;

          if(json_data.views) {
            json_data.views.forEach(function(view) {
            view.activeLayer = null;
           })
          }
          
            that.json_data = JSON.stringify(json_data);
           

        },{deep:true})
        }
       
    })
})

