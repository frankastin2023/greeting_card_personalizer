
$(document).ready(function() {
    var App = new Vue({

        el : '#card_personaliser',

        data : {
            views : [],
            json_data : null
        },

        store : store,

        computed : {
            card() { return this.$store.state.card },
            layers() { return this.$store.state.card.activeView.layers ? this.$store.state.card.activeView.layers : [] },
            activeLayer() { return this.$store.state.card.activeView.activeLayer },
            activeView() { return this.$store.state.card.activeView },
            ui() { return this.$store.state.ui }
        },

        created : function() {

        var that = this;

        /* Load Card Data */

        MY_CARD_BOX.loadSavedData(this);
       
        }
    })
})

