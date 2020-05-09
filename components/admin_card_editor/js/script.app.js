$(document).ready(function() {
    var is_publish = false;
    $('#publish').on('click', function() {
        is_publish = true;
    })
    $('#post').on('submit', function(e) {
        if(e.originalEvent.submitter.id != 'publish') {
            e.preventDefault()
        }
        
    })
    var App = new Vue({
        el : '#poststuff',
        data : {
            views : [],
            test : 'test',
            json_data : null
        },
        store : store,
       
    })
})

