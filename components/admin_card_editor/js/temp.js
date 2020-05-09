
		var PSD = require('psd'), psdDoc;

		$('#dropzone')[0].addEventListener('dragover', onDragOver, true);
		$('#dropzone')[0].addEventListener('drop', onDrop, true);

		function onDragOver(e) {
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
		}

		function onDrop(e) {
			e.stopPropagation();
			e.preventDefault();

			$('#loader').text('formatting layer 1');
			$('#loader').show();

			PSD.fromEvent(e).then(function (psd) {
				psdDoc = psd.tree();
				$('#canvas > div').empty();
				$('.layer').remove();
				$('body').addClass('canvas-mode'); $('.show-canvas').show();
				var canvasImage = $(psd.image.toPng());
				$('#canvas > div').append(canvasImage);
				var ratioW = $('#canvas').width() / canvasImage.width();
				var ratioH = $('#canvas').height() / canvasImage.height();
				var ratio = ratioW < ratioH ? ratioW : ratioH;
				$('#canvas > div').css('zoom', ratio);
				$('#zoom > input').val((ratio * 100).toFixed(1));
				layersProcessed = 0;
				insertPosition = 0;
				components = [];
				layersToProcess = [psdDoc];
				drawLayer();
			});

		}

		var notShown = ['type', 'visible', 'name', 'children'];
		function getInfo(layerJson, child = false){
			var infoKeys = Object.keys(layerJson);
			var result = '';
			if(!child) infoKeys = $(infoKeys).not(notShown).get();

			if(!child) result += '<div class="layer dark">info<i class="fa fa-caret-right pull-right"></i><div class="info">';
			for(var j in infoKeys)
				if(layerJson.hasOwnProperty(infoKeys[j]) && layerJson[infoKeys[j]] && typeof layerJson[infoKeys[j]] !== 'object'){
					if(infoKeys[j] == 'sizes') result += '<br/>sizes: '+ layerJson[infoKeys[j]].join(', ');
					else if(infoKeys[j] == 'colors'){
						result += '<br/>colors: ';
						comma = '';
						for(var k in layerJson[infoKeys[j]]){
							result += comma +'<span style="color:rgba('+ layerJson[infoKeys[j]][k].join(', ') +');">rgba('+ layerJson[infoKeys[j]][k].join(', ') +')</span>';
							comma = ', ';
						}
					}
					else if(infoKeys[j] == 'alignment') result += '<br/>alignment: '+ layerJson[infoKeys[j]].join(', ');
					else
						result += '<br/>'+ infoKeys[j] +': '+ layerJson[infoKeys[j]];
				}
			if(!child) result += '</div></div>';

			for(var j in infoKeys)
				if(layerJson.hasOwnProperty(infoKeys[j]) && typeof layerJson[infoKeys[j]] === 'object' && !$.isEmptyObject(layerJson[infoKeys[j]])){
					if(infoKeys[j] == 'sizes') result += '<br/>sizes: '+ layerJson[infoKeys[j]].join(', ');
					else if(infoKeys[j] == 'colors'){
						result += '<br/>colors: ';
						comma = '';
						for(var k in layerJson[infoKeys[j]]){
							result += comma +'<span style="color:rgba('+ layerJson[infoKeys[j]][k].join(', ') +');">rgba('+ layerJson[infoKeys[j]][k].join(', ') +')</span>';
							comma = ', ';
						}
					}
					else if(infoKeys[j] == 'alignment') result += '<br/>alignment: '+ layerJson[infoKeys[j]].join(', ');
					else
						result += '<div class="layer dark">'+ infoKeys[j] +'<i class="fa fa-caret-right pull-right"></i><div class="info">'+ getInfo(layerJson[infoKeys[j]], true) +'</div></div>';
				}
			return result;
		}


		var layersProcessed, components, insertPosition, layersToProcess;
		var tmo = 10;
		function drawLayer(){
			layer = layersToProcess.shift();
			layersProcessed++;
			$('#loader').html('formatting layer '+ layersProcessed);
			var name = layer.get('name');
			var path = layer.path();
			var torender = name && name != 'null';
			if(torender){
				components.splice(insertPosition++, 0, '<div class="layer" data-path="' + path + '">' + name);

				// render image
				var image = '';
				if(layer.childless()){
					// try{ image = layer.toPng(); }catch(e){}
					components.splice(insertPosition++, 0, '<i class="fa fa-caret-right pull-right" aria-hidden="true"></i>');
					components.splice(insertPosition++, 0, '<div class="info"><img src="" class="part"/><a class="download dark" href="" download="'+ name +'.png" target="_blank"><i class="fa fa-download"></i> download PNG</a>'+ getInfo(layer.export()) +'</div>');
				}
				else
					components.splice(insertPosition++, 0, '<i class="fa fa-caret-down pull-right" aria-hidden="true"></i>');
			}

			// add children
			var sublayers = layer.children();
			for(var i in sublayers) layersToProcess.unshift(sublayers[i]);

			if(torender) components.splice(insertPosition + 1, 0, '</div>');

			layerJump = !layersToProcess.length || layer.depth() - layersToProcess[0].depth();
			layerJump++;
			if(!sublayers.length && layerJump > 0) insertPosition += layerJump;

			if(!layersToProcess.length) {
				$('#layers').append(components.join(''));
				$('#loader').hide();
			}
			else setTimeout(drawLayer, tmo);
		}

		$('#layers').resizable({
			handles: 'w',
			minWidth: 200,
			containment: 'parent',
			resize: function( event, ui ){ $('#canvas').css('right', ui.size.width + 'px'); }
		});

		$('.hide-canvas').click(function(){ $('.canvas-mode').removeClass('canvas-mode'); });
		$('.show-canvas').click(function(){ $('body').addClass('canvas-mode'); });

		$(document).on('click', '.download', function(event){
			$(this).attr('href', $(this).prev('img').attr('src'));
		});
		
		$(document).on('click', '.layer', function(event){
			if(this === event.target){
				img = $(this).children('.info').children('img').first();
				if(img.length && !img.attr('src')){
					lr = psdDoc.childrenAtPath($(this).attr('data-path'))[0];
					el = lr.toPng();
					img.attr('src', el.src);
					el = null; lr = null;
				}

				$(this).children('.layer, .info').toggle();
				$(this).children('.fa.pull-right').toggleClass('fa-caret-right fa-caret-down');
			}
		});

		$('#zoom input').change(function(){
			$('#canvas > div').css('zoom', parseFloat($(this).val()) / 100);
		});
  