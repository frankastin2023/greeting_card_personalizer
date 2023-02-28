var MY_CARD_BOX = MY_CARD_BOX ? MY_CARD_BOX : {};

MY_CARD_BOX.loadSavedData = function(vueInstance) {
    var queryvards = window.location.search.slice(1)
    .split('&')
    .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
      b = b.split('=');
      a[b[0]] = decodeURIComponent(b[1]);
      return a;
    }, {});

  if(queryvards.post && ($('#publish').val() == 'Update')) {
      vueInstance.ui.loading = true;
      $.post(ajaxurl,{
          action : 'get_saved_data',
          post : queryvards.post
      } , function(e) {
          var card = JSON.parse(e);

          vueInstance.$store.state.card.width = card.width;
          vueInstance.$store.state.card.height = card.height;
          vueInstance.ui.loading = false;
          card.views.forEach(function(saved_view) {
              var view = {
                  name : saved_view.name,
                  layers : [],
                  image : null
              }

              var images_loaded = 0;

              var images = [];

              vueInstance.$store.dispatch('addView', view);
              
              
              vueInstance.$set(vueInstance.$store.state.card , 'activeView', vueInstance.$store.state.card.views[vueInstance.$store.state.card.views.length - 1])

              
              saved_view.layers.forEach(function(layer) {
                 
                  if(layer.type == 'text-region') {
                   
                  } else {
                      layer.image = new Image()
                      layer.image.src = layer.imageURL;
                      images.push(layer.image)
                  }

                  vueInstance.$store.dispatch('addLayer', layer);
                          
              })

              vueInstance.$set(vueInstance.$store.state.card.activeView, 'activeLayer', vueInstance.activeView.layers[vueInstance.activeView.layers.length - 1])


              images.forEach(function(image) {
                  image.onload = function() {
                      images_loaded ++;
                      console.log(images_loaded ,images.length)
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
  } else {
      vueInstance.$store.state.card.activeView = vueInstance.$store.state.card.views[0]; 
  }
}

 