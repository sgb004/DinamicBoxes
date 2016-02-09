/*
 * DynamicBoxes
 * 
 * Ajusta la posición de las cajas de forma vertical
 *
 * @author @sgb004
 * @version 0.1
 */
(function($){
	function DynamicBoxes(e, o){
		var d = {
			disabledIn: 0,
			childs: '',
			columns: 0,
			columnsBySize: {}
		};

		jQuery.extend(d, o);

		this.container = e;
		this.childs = e.find( d.childs );
		this.disabledIn = d.disabledIn;
		this.columns = d.columns;
		this.columnsBySize = d.columnsBySize;

		this.init( this );
		return this;
	}

	DynamicBoxes.prototype = {
		init: function( _this ){
			//-> FROM http://stackoverflow.com/questions/5467129/sort-javascript-object-by-key
			var columnsBySizeKeys = Object.keys(this.columnsBySize);
			var temp = {};
			columnsBySizeKeys.sort();

			for( var i=0; i<columnsBySizeKeys.length; i++ ){
				temp[ columnsBySizeKeys[i] ] = this.columnsBySize[ columnsBySizeKeys[i] ];
			}

			this.columnsBySize = temp;
			//-> END FROM

			$(window).on('resize', function(){
				_this.adjust();
			});

			this.adjust();
		},
		adjust: function(){
			if( window.innerWidth > this.disabledIn ){
				var temp = 0;
				var height = 0;
				var child;
				var j = 0;
				var items = [];
				var itemsLength = this.columns;

				$.each(this.columnsBySize, function( size, columns ){
					if( window.innerWidth <= size ){
						itemsLength = columns;
						return false;
					}
				});

				for( var i=0; i<itemsLength; i++ ){
					items.push( { top: 0, height: 0 } );
				}

				for(var i=0; i<this.childs.length; i++){
					child = $(this.childs[i]);

					temp = child.outerHeight( true );

					if( temp > height ){
						height = temp;
					}

					items[j].height = temp;

					child.css({'top': items[j].top});
					items[j].top += items[j].height;

					j++;

					if( j == itemsLength ){
						j = 0;
						height = 0;
					}
				}

				for(var i=0; i<itemsLength; i++){
					if( items[i].top > height ){
						height = items[i].top;
					}
				}

				this.container.css({'min-height': height});
			}
		}
	};

	$.fn.dynamicBoxes = function(p0, p1, p2, p3, p4, p5){
		var result = [];
		var _this;
		var _dynamicBoxes;

		this.each(function($this){
			_this = $(this);
			_dynamicBoxes = _this.data('_dynamicBoxes');

			if(_dynamicBoxes == undefined){
				_dynamicBoxes = new DynamicBoxes(_this, p0);
				_this.data('_dynamicBoxes', _dynamicBoxes);
				result.push(_this);
			}else{
				_dynamicBoxes = _this.data('_dynamicBoxes');
				if( typeof _dynamicBoxes[p0] == 'function' ){
					_dynamicBoxes[p0](p1, p2, p3, p4, p5);
				}else{
					_dynamicBoxes[p0] = p1;
				}
				result.push(_this);
			}
		})

		return result;
	}
})(jQuery);
