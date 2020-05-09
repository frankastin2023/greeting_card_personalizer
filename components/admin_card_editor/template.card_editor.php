<div class="card-editor">

    <div class="col-1">
        @include('admin_card_editor.image_region_editor')
        @include('admin_card_editor.text_region_editor')
        @include('admin_card_editor.image_overlay_editor')
    </div>

    <div class="col-1">

        <div class="card-container">
        </div>
        
        <div class="dimesions-editor card-dimesions">
            <span>Width:</span>
            <input class="card-width" value="100">
            <span>Height:</span>
            <input class="card-height" value="100">
        </div>

    </div>

    <div class="col-2">

        <div class="card_editor_buttons">
            <button class="create-text-region button-outlined">Add Text Region</button>
            <button class="create-image-region button-outlined">Add Image Region</button>
            <button class="create-image-overlay button-outlined">Add Image Overlay </button>
        </div>

        <div class="layers">
            
        </div>

    </div>
    <?php 
        global $post;

        $card_editor_json = $post ? get_post_meta($post->ID, 'card_editor_json',true) : '[]';
        $card_editor_json = htmlspecialchars($card_editor_json);

        $card_editor_json = $post ? get_post_meta($post->ID, 'card_editor_json',true) : '[]';
        $card_editor_json = htmlspecialchars($card_editor_json);
        
    ?>
    <input type="hidden" class="card_editor_json" name="card_editor_json" value="<?= $card_editor_json ?>"/>
    <input type="hidden" class="card_options_json" name="card_options_json" value="<?= $card_options_json ?>"/>
</div>