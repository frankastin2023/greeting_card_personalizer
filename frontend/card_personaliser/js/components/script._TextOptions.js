var template = `
<textarea type="text" @input="renderCanvas" v-model="activeLayer.text"></textarea>
`;

Vue.component('TextOptions', {
    computed : {
        activeLayer() { return this.$store.state.card.activeView.activeLayer },
    },
    methods : {
        renderCanvas() {
            this.$root.$emit('renderCanvas');
        }
    },
    template : template
})
