<?php 
trait WP_Modular_Load_Controllers {

    function load_controllers() {
        $this->search_include_files('controller' , dirname( __DIR__ ) . '/admin/' );
        $this->search_include_files('controller' , dirname( __DIR__ ) . '/frontend/' );
    }

    function load_functions() {
       
        $this->search_include_files('functions', dirname( __DIR__ ) . '/admin/'  );
        $this->search_include_files('functions' , dirname( __DIR__ ) . '/frontend/' );
    }

    function search_include_files($prefix, $dir) {
        
        $files = scandir($dir);

        $files = array_slice($files,2);

        foreach($files as $file) {
            if(is_dir($dir.$file)) {
                $this->search_include_files($prefix,$dir.$file);
                continue;
            } 

            $prefix_length = strlen($prefix);
            
            if(substr($file,0,$prefix_length) == $prefix ) {
                include $dir . '/' . $file ;
                
            }
        }
        
    }
}