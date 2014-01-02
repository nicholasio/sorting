;(function($){

	window.Animate = Animate = function(flow, arrSwaps) {
		this.$flow = flow;
		this.arrSwaps = arrSwaps;
	}

	Animate.prototype.start = function( fnCallback ) {
		var self = this;
		var count = 0;
		var timeOutId = setTimeout(function animate() {
			var $flow = self.$flow;
			var $el = $flow.find('ul li');
			$el.removeClass('current');

			var _swap = self.arrSwaps[count++];

			if ( typeof _swap === 'undefined' ) return;

			var $actual = $($el[_swap.pos_ini]).find('span');
			var $next = $($el[_swap.pos_final]).find('span');

			$next.parent().addClass('current');

			if ( _swap.ordenado ) { //Indica que o elemente neste índice já está na sua posição
				var $elem = $($el[_swap.pos_ini]);
				$elem.find('span').css("background", "black");
			}
			if ( _swap.pos_ini != _swap.pos_final ) {
				var _actual = { width : $actual.css("width") , value : $actual.data("value") };
				var _next   = { width : $next.css("width") , value : $next.data("value") };

				$actual.css("width", _next.width );
				$actual.data("value", _next.value );

				if ( typeof _swap.unidirecional === 'undefined' || ! _swap.unidirecional ) {
					$next.css("width", _actual.width );
					$next.data("value", _actual.value );		
				}
				
			} 
			
			if ( count == self.arrSwaps.length) {
				clearTimeout(timeOutId);
				if ( typeof fnCallback === 'function' ) fnCallback();

			}
			else setTimeout(animate, 100);
			

		},0);



	}
})(jQuery);