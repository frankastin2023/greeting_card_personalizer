<?php
include plugin_dir_path( __FILE__ ) . 'routing.php';
include plugin_dir_path( __FILE__ ) . 'render_scripts.php';
include plugin_dir_path( __FILE__ ) . 'load_controllers.php';
include plugin_dir_path( __FILE__ ) . 'scssphp/scss.inc.php';
include plugin_dir_path( __FILE__ ) . 'bladeone.php';

class WP_Modular {
    use WP_Modular_Routing;
    use WP_Modular_Render_Scripts;
    use WP_Modular_Load_Controllers;
    function __construct() {
        $this->load_controllers();
        $this->load_functions();
        $this->render_sass();
        $this->render_javascript();
        $this->load_routes();
        $this->blade_setup();
        $this->parse_route();
        add_filter('use_block_editor_for_post', '__return_false', 10);
        add_filter('the_content', array($this,'rendered_page') );
    }

    function blade_setup() {
        global $blade;

        $views = plugin_dir_path( __DIR__ ) . '/components/'; // it uses the folder /views to read the templates
        $cache = plugin_dir_path( __DIR__ ) . '/cache';      // it uses the folder /cache to compile the result.

        $blade = new \eftec\bladeone\BladeOne($views,$cache,\eftec\bladeone\BladeOne::MODE_DEBUG);
    }

    function rendered_page() {
        global $WP_Modular_Post_Content;
    
        return $WP_Modular_Post_Content;
    }
} 