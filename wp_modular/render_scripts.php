<?php
 use ScssPhp\ScssPhp\Compiler;
trait WP_Modular_Render_Scripts {
    function search_concat_files($prefix, $dir, &$concat_file) {
       
        $files = scandir($dir);

        $files = array_slice($files,2);
        foreach($files as $file) {
            if(is_dir($dir.'/'.$file)) {
                $this->search_concat_files($prefix,$dir.'/'.$file,$concat_file);
                continue;
            } 

            

            $prefix_length = strlen($prefix);
            
            if(substr($file,0,$prefix_length) == $prefix ) {
                $concat_file .= file_get_contents( $dir . '/' . $file );
                
            }
        }
    
        
    }

    function render_sass() {

        $sass_compiler = new Compiler();

        if(is_admin()) {
            /*
            $sass_concat = '';
            $rendered_admin_css_path = plugin_dir_path( __DIR__ ) . '/rendered_admin_style.css';
            $directory = dirname( __DIR__ ) . '/admin/';
            $this->search_concat_files('style',$directory,$sass_concat);
            file_put_contents($rendered_admin_css_path ,  $sass_compiler->compile($sass_concat));
            */
        }

        if(!is_admin()) {
            /*
            $sass_concat = '';
            $rendered_frontend_css_path = plugin_dir_path( __DIR__ ) . '/rendered_frontend_style.css';
            $directory = dirname( __DIR__ ) . '/frontend/';
            $this->search_concat_files('style',$directory,$sass_concat);
            file_put_contents($rendered_frontend_css_path ,  $sass_compiler->compile($sass_concat) );
        */
        }

        

        add_action( 'wp_enqueue_scripts', function() {
            $rendered_css_path = plugin_dir_path( __DIR__ ) . '/rendered_frontend_style.css';
            $rendered_css_uri = plugin_dir_url( __DIR__ ). '/rendered_frontend_style.css';
            $version = filemtime($rendered_css_path);
            wp_enqueue_style( 'WP_Modular_Styles', $rendered_css_uri,null, $version);
            wp_enqueue_style( 'gfonts', 'https://fonts.googleapis.com/css?family=Bangers|Dancing+Script:400,700|GFS+Didot|Libre+Baskerville:400,700|Lobster|Montserrat:400,700|Satisfy|Material+Icons&display=swap' );
            wp_enqueue_style( 'typekit', 'https://use.typekit.net/eca6hws.css' );
        });

        add_action( 'admin_enqueue_scripts', function() {
            $rendered_css_path = plugin_dir_path( __DIR__ ) . '/rendered_admin_style.css';
            $rendered_css_uri = plugin_dir_url( __DIR__ ). '/rendered_admin_style.css';
            $version = filemtime($rendered_css_path);
            wp_enqueue_style( 'WP_Modular_Styles', $rendered_css_uri,null, $version);
            wp_enqueue_style( 'jquery-ui', 'https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css' );
            wp_enqueue_style( 'gfonts', 'https://fonts.googleapis.com/css?family=Bangers|Dancing+Script:400,700|GFS+Didot|Libre+Baskerville:400,700|Lobster|Montserrat:400,700|Satisfy|Material+Icons&display=swap' );
            wp_enqueue_style( 'typekit', 'https://use.typekit.net/eca6hws.css' );
        });
       
    }

    function render_javascript() {
      
        $javascript_concat = '';
        

        if(is_admin()) {
            $directory = dirname( __DIR__ ) . '/admin/';
            $this->search_concat_files('script',$directory,$javascript_concat);
            $rendered_js_path = plugin_dir_path( __DIR__ ) . '/rendered_admin_script.js';
            file_put_contents($rendered_js_path , $javascript_concat );
        }

        if(!is_admin()) {
            $directory = dirname( __DIR__ ) . '/frontend/';
            $this->search_concat_files('script',$directory,$javascript_concat);
           
            $rendered_js_path = plugin_dir_path( __DIR__ ) . '/rendered_frontend_script.js';
            file_put_contents($rendered_js_path , $javascript_concat );
        }
        
        

        add_action( 'wp_enqueue_scripts', function() {
            $rendered_js_path = plugin_dir_path( __DIR__ ) . '/rendered_frontend_script.js';
            $rendered_js_uri = plugin_dir_url( __DIR__ ). '/rendered_frontend_script.js';
            $version = filemtime($rendered_js_path);
            wp_enqueue_script( 'WP_Modular_Scripts', $rendered_js_uri,array('jquery'), $version);
            wp_localize_script( 'WP_Modular_Scripts', 'ajax_object', array( 'ajax_url' => admin_url( 'admin-ajax.php' )) );
            wp_enqueue_script( 'fontawesome', 'https://kit.fontawesome.com/838de1b5bf.js',array('jquery'), $version);
        });
        
        add_action( 'admin_enqueue_scripts', function() {
            $rendered_js_path = plugin_dir_path( __DIR__ ) . '/rendered_admin_script.js';
            $rendered_js_uri = plugin_dir_url( __DIR__ ). '/rendered_admin_script.js';
            $version = filemtime($rendered_js_path);
            wp_enqueue_script( 'jquery' );
            wp_enqueue_script( 'jquery-ui-core', false, array('jquery') );
            wp_enqueue_script( 'jquery-ui-resizable', false, array('jquery'));
            wp_enqueue_script( 'jquery-ui-draggable', false, array('jquery'));
            wp_enqueue_script( 'WP_Modular_Scripts', $rendered_js_uri,array('jquery'), $version);
            wp_enqueue_script( 'fontawesome', 'https://kit.fontawesome.com/838de1b5bf.js',array('jquery'), $version);
         });
       
    }
}