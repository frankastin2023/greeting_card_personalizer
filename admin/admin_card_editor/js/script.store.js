var store = new Vuex.Store({
    state : {
        card : {
          width:300,
          height:400,
          activeView : 0,
          views : [],
          prices : {
            standard : 10,
            sale : 5,
          }
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
      },
      changeActiveView(state,view) {
        state.card.activeView = view;
      },
      changeActiveLayer(state,layer) {
        state.card.activeView.activeLayer = layer;
      },
      changeActiveLayer(state,layer) {
        state.card.activeView.activeLayer = layer;
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
      changeActiveView(context,view) {
        context.commit('changeActiveView' , view )
      },
      changeActiveLayer(context,layer) {
        context.commit('changeActiveLayer' , layer )
      }
    },
    getters : {
      activeView : state => state.card.activeView,
      activeLayer : state => state.card.activeView.activeLayer
    }
})
