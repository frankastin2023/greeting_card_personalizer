<?php

add_action("wp_ajax_get_card_data", "get_card_data");
add_action("wp_ajax_nopriv_get_card_data", "get_card_data");

function get_card_data() {
    echo get_post_meta($_POST['post'],'json_data',true);
    die();
}