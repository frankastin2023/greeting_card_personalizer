<div class="clearfix">
    <div class="ui-option col-2"><label>Standard Price(£):</label> <input v-model="$store.state.card.prices.standard" type="number"></div>
    <div class="ui-option col-2"><label>Sale Price(£):</label> <input v-model="$store.state.card.prices.sale" type="number"></div>
</div>
<div>
<input style="display:none" v-model="json_data" name="json_data"/>
</div>

