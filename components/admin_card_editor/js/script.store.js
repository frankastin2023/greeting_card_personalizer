var store = new Vuex.Store({
    state : {
        card : {
          width:300,
          height:400,
          activeView : 0,
          views : [],
        },
        
        ui : {
          modals: {
            viewsModal : false,
            layersModal : false,
            layersPSDModal : false
          },
          windows: {
            viewsModal : false,
            modModal : false,
          },
          loading: false
        }
    },
    mutations: {
      addView (state,view) {
        state.card.views.push(view);
      },
      deleteView (state,index) {
        state.card.views.splice(index,1);
      },
      addLayer (state,layer) {
        state.card.activeView.layers.push(layer);
      },
      deleteLayer (state,index) {
        state.card.activeView.layers.splice(index,1);
      }
    },
    actions : {
      addView (context,view) {
        context.commit('addView' , view )
      },
      deleteView (context,index) {
        context.commit('deleteView' , index )
      },
      addLayer (context,layer) {
        context.commit('addLayer' , layer )
      },
      deleteLayer (context,index) {
        context.commit('deleteLayer' , index )
      },
    },
    getters : {
      activeView : state => state.card.activeView,
      activeLayer : state => state.card.activeView.activeLayer
    }
})
