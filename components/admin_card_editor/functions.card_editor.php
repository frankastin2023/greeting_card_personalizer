<?php 
add_action('init', function() {
    $args = array(
        'public'    => true,
        'label'     => __( 'Cards', 'textdomain' ),
        'menu_icon' => 'dashicons-buddicons-pm',
        'supports'  => array( 'title' ),
        'register_meta_box_cb' => 'card_editor_metaboxes',
        'show_ui' => true
    );
    register_post_type( 'card', $args );
});


function card_editor_metaboxes() {

    add_meta_box(
		'card_views',
		'Card Views',
		'card_views_content',
		'card',
		'normal',
		'default'
    );

    add_meta_box(
		'card_layers',
		'Card Layers',
		'card_layers_content',
		'card',
		'normal',
		'default'
    );

   add_meta_box(
		'card_stage',
		'Stage',
		'card_stage_content',
		'card',
		'normal',
		'default'
    );
}

function card_views_content() {
    include plugin_dir_path( __FILE__ ) . '/template.views_panel.php';
}

function card_layers_content() {
    include plugin_dir_path( __FILE__ ) . '/template.layers_panel.php';
}

function card_stage_content() {
    include plugin_dir_path( __FILE__ ) . '/template.stage_panel.php';
}


function load_media_files() {
    wp_enqueue_media();
}

add_action( 'admin_enqueue_scripts', 'load_media_files' );


function upload_image() {  

    $upload_dir    = wp_upload_dir();
    $upload_folder = $upload_dir['path'];
    $upload_url = $upload_dir['url'];

    $_FILES['picture']['name'] = $_POST['filename'].".png";

    // Set filename, incl path
    $filename = "{$upload_folder}/".$_POST['filename'].".png";

    if(file_exists($filename)) {
         echo "{$upload_url}/".$_POST['filename'].".png";
         exit;
    }

    $support_title = !empty($_POST['supporttitle']) ? 
    $_POST['supporttitle'] : 'Support Title';

     if (!function_exists('wp_handle_upload')) {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
    }
   // echo $_FILES["upload"]["name"];
   
   $uploadedfile = $_FILES['picture'];
   
   $upload_overrides = array('test_form' => false);

   $movefile = wp_handle_upload($uploadedfile, $upload_overrides);

 // echo $movefile['url'];
   if ($movefile && !isset($movefile['error'])) {
    echo "{$upload_url}/".$_POST['filename'].".png";
 } else {
     /**
      * Error generated by _wp_handle_upload()
      * @see _wp_handle_upload() in wp-admin/includes/file.php
      */
     echo $movefile['error'];
 }
    die();
}

add_action("wp_ajax_upload_image", "upload_image");


add_action( 'admin_enqueue_scripts', 'load_media_files' );

define('ALLOW_UNFILTERED_UPLOADS', true);

add_action('save_post', function($post) {
if(isset($_POST['json_data'])) {
    update_post_meta($post,'json_data',$_POST['json_data']);
}


});

add_action("wp_ajax_get_saved_data", "get_saved_data");

function get_saved_data() {
    echo get_post_meta($_POST['post'],'json_data',true);
    die();
}