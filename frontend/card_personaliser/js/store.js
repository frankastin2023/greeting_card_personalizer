var store = new Vuex.Store({
    state : {
        card : null,
    },
    mutations: {
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
      }
    },
})
