<?php

class Home {
    function __construct() {
        
        add_action('init', array($this,'render_page'));


    }

    function render_page() {
        global $blade;

        $blade->run('home.home',array());
    }
}