var store = new Vuex.Store({
    state : {
        card : {
          width : 0,
          height: 0,
          views: [],
          activeView : {},
          editableLayers : []
        },
        ui : {
          loading: false
        },
    },
   
    mutations: {
      addView (state,view) {
        state.card.views.push(view);
      },
      addLayer (state,layer) {
        state.card.activeView.layers.push(layer);
      },
      changeActiveLayer(state,layer) {
        state.card.activeView.activeLayer = layer;
      }
    },
    actions : {
      addLayer (context,layer) {
        context.commit('addLayer' , layer )
      },
      changeActiveLayer(context,layer) {
        context.commit('changeActiveLayer' , layer )
      },
      addView (context,view) {
        context.commit('addView' , view )
      },
    },
})