<?php 

trait WP_Modular_Routing {

    static function add_route($uri,$callable) {
        
        if(!isset($_SESSION['WP_MODULAR_ROUTES']) || !is_array($_SESSION['WP_MODULAR_ROUTES'])) $_SESSION['WP_MODULAR_ROUTES'] = array();
        
        $_SESSION['WP_MODULAR_ROUTES'][$uri] = $callable;
        
    }

    function parse_route() {
        
        $uri = $_SERVER['REQUEST_URI'];

        $site_url = explode('/' ,site_url());
        
        if(!empty($site_url[3])) {

            $base_path_length = strlen($site_url[3]);

            $uri = substr($uri, $base_path_length + 1);
           
        }
        
        $uri = empty($uri) ? '/' : $uri;

        $site_url;

        $this->call_route($uri);

    }

    function load_routes() {
       
        $routes_folder = dirname( __DIR__ ) . '/routes/';
        $files =  scandir($routes_folder );
        $files = array_slice($files, 2);

        foreach($files as $file) {
            include $routes_folder . $file;
        }
        
      
    }

    function call_route($uri) {

        if(!isset($_SESSION['WP_MODULAR_ROUTES'][$uri])) return;

        $callable = $_SESSION['WP_MODULAR_ROUTES'][$uri];

        if(is_callable($callable)) {
            call_user_func($callable);
            
        } else {
            
            $reflected_class = new ReflectionClass($callable);
            $reflected_class->newInstance();
        }

    }
}