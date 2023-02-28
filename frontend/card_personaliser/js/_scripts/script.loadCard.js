var MY_CARD_BOX = MY_CARD_BOX ? MY_CARD_BOX : {};

MY_CARD_BOX.loadSavedData = function(vueInstance) {
      vueInstance.ui.loading = true;
      
      $.post(ajax_object.ajax_url , {
          action : 'get_card_data',
          post : 12
      } , function(e) {
          var card = JSON.parse(e);
          vueInstance.$store.state.card.width = card.width;
          vueInstance.$store.state.card.height = card.height;
          vueInstance.$forceUpdate();
          vueInstance.ui.loading = false;
          
          card.views.forEach(function(saved_view) {
              
              var view = {
                  name : saved_view.name,
                  layers : [],
                  activeLayer : {},
                  image : null
              }

              var images_loaded = 0;

              var images = [];

              vueInstance.$store.dispatch('addView', view);
              
              vueInstance.$set(vueInstance.$store.state.card , 'activeView', vueInstance.$store.state.card.views[vueInstance.$store.state.card.views.length - 1])

              saved_view.layers.forEach(function(layer) {
                 
                  if(layer.type == 'image-region') {
                      layer.image = new Image()
                      layer.image.src = layer.imageURL;
                      layer.imageRaw = new Image()
                      layer.imageRaw.src = layer.imageURL;
                      layer.filter = 'none';
                      images.push(layer.image)
                  } else {
                    layer.fullFontSize = layer.fontSize;
                   
                  }

                  vueInstance.$store.dispatch('addLayer', layer);

              })

              
              images.forEach(function(image) {
                  image.onload = function() {
                      images_loaded ++;
                      if(images_loaded == (images.length)) {
                         setTimeout(function() {
                          vueInstance.$root.$emit('renderCanvas')
                          setTimeout(function() {
                              vueInstance.$root.$emit('renderCanvas')
                             },200)
                         },200)
                      }
                  }
              })
              
          })

      })
}
