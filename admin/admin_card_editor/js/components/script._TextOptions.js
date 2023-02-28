var template = `
<div>
            <div class="ui-option col-2">
                <label>Text:</label>
                <textarea @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.text"></textarea>
            </div>
            <div class="ui-option col-1">
                <label>X:</label>
                <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.x"/>
            </div>
            <div class="ui-option col-1">
                <label>Y:</label>
                <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.y"/>
            </div>
            <div class="ui-option col-1">
            <label>Width:</label>
            <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.width"/>
            </div>
            <div class="ui-option col-1">
                <label>Height:</label>
                <input type="number" @keyup="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.height"/>
            </div>
            <div class="ui-option col-2">
                <label>Font Family:</label>

                <div @click="openDropDown" class="font-familys ui-dropdown">
                    <div :class="activeLayer.fontFamily ? activeLayer.fontFamily.replace(' ','-').toLowerCase() : ''">{{activeLayer.fontFamily ? toTitleCase(activeLayer.fontFamily.replace('-',' ')) : ''}}<span class="fa fa-sort-down"></span></div>
                    <ul>
                        <li @click="changeFontFamily('Libre Baskerville')"  class="libre-baskerville">Libre Baskerville</li>
                        <li @click="changeFontFamily('Montserrat')"  class="montserrat">Montserrat</li>
                        <li @click="changeFontFamily('Lobster')"  class="lobster">Lobster</li>
                        <li @click="changeFontFamily('Dancing Script')"  class="dancing-script">Dancing Script</li>
                        <li @click="changeFontFamily('Satisfy')"  class="satisfy">Satisfy</li>
                        <li @click="changeFontFamily('Bangers')"  class="bangers">Bangers</li>
                        <li @click="changeFontFamily('GFS Didot')"  class="gfs-didot">Ήταναπλώς θέμα χρόνου</li>
                        <li @click="changeFontFamily('Autumn In November')"  class="autumn-in-november">Autumn In November</li>
                    </ul>
                </div>
            </div>
            <div class="ui-option col-2">
            <label>Font Color:</label>
            <label for="font-color-1" class="font-color" :style="{background:activeLayer.color}" ></label>
            <input @input="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.color" id="font-color-1" type="color" style="display:none"/>
            <input @input="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.color" id="font-color" type="text"/>
        </div>
        <div class="ui-option col-1">
            <label>Font Size:</label>
            <input @input="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.fontSize" type="number"  />
        </div>
        <div class="ui-option col-1">
            <label>Line Height:</label>
            <input @input="renderCanvas()" @change="renderCanvas()" v-model="activeLayer.lineHeight" type="number"  />
        </div>
            <div class="ui-option  col-2">
                <label>Text Modifyer:</label>
            
                <div class="text-modifyer ui-dropdown">
                    <div @click="openDropDown">{{activeLayer.textModifyer ? toTitleCase(activeLayer.textModifyer) : ''}}<span class="fa fa-sort-down"></span></div>
                    <ul>
                        <li @click="changeTextModifyer('static')"  class="sans-serif">Static (customer cannot edit the text)</li>
                        <li @click="changeTextModifyer('editable')"  class="great-vibes">Editable (customer can edit any part of the text)</li>
                        <li @click="changeTextModifyer('variable')"  class="amatic-sc">Variable (customer can edit only the variable part of the string : {variable})</li>
                    </ul>
                </div>
            </div>

            <div class="ui-option  col-2">
                <label>Text Align:</label>
            
                <div class="text-modifyer ui-dropdown">
                    <div @click="openDropDown">{{activeLayer.textAlign ? toTitleCase(activeLayer.textAlign) : ''}}<span class="fa fa-sort-down"></span></div>
                    <ul>
                        <li @click="changeTextAlign('left')">Left</li>
                        <li @click="changeTextAlign('center')">Center</li>
                        <li @click="changeTextAlign('right')">Right</li>
                      </ul>
                </div>
            </div>
           
            <div class="ui-option col-2">
                <label>Font Weight:</label>
                <div class="font-weight ui-dropdown">
                    <div @click="openDropDown">{{toTitleCase(activeLayer.fontWeight)}}<span class="fa fa-sort-down"></span></div>
                        <ul>
                            <li @click="changeFontWeight('normal')" >Normal</li>
                            <li @click="changeFontWeight('bold')" >Bold</li>
                        </ul>
                    </div>
            </div>
            </div>
</div>
`

Vue.component('TextOptions', {
    computed : {
        views() { return this.$store.state.card.views },
        card() { return this.$store.state.card },
        activeLayer() { return this.$store.state.card ?  this.$store.state.card.activeView.activeLayer : null },
        window : () => window,
    },
    methods : {
        toTitleCase : function(str) {
            return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) },
        closeDropDown() {
            $('.open-ul').removeClass('open-ul').hide();
        },
        changeFontFamily : function(fontFamily) {
            this.activeLayer.fontFamily = fontFamily;
            this.renderCanvas();
            this.closeDropDown()
        },
        changeFontWeight : function(fontWeight) {
            this.activeLayer.fontWeight = fontWeight; 
            this.renderCanvas();
            this.closeDropDown()
        },
        changeTextModifyer : function(textModifyer) {
            this.activeLayer.textModifyer = textModifyer;
            this.renderCanvas(); 
            this.closeDropDown()
        },
        changeTextAlign : function(textAlign) {
            this.activeLayer.textAlign = textAlign;
            this.renderCanvas(); 
            this.closeDropDown()
        },
        renderCanvas : function() {
            this.$root.$emit('renderCanvas'); 
        },
        openDropDown : function(e) {
        
            if($(e.target).siblings('ul').hasClass('open-ul')) {
                $('.open-ul').removeClass('open-ul').hide();
            } else {
                $('.open-ul').removeClass('open-ul').hide();
                $(e.target).siblings('ul').show().addClass('open-ul');
            }
            
        }
    },
    created : function() {
      
       
    },
    template : template
});