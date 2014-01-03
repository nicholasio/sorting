;(function($){

	window.Animate = Animate = function(flow, arrSteps, type) {
		this.$flow = flow;
		this.arrSteps = arrSteps;
		this._type = type;
	}

	Animate.prototype.start = function( fnCallback ) {
		var self = this;
		var count = 0;
		var end = false;

		var timeOutId = setTimeout(function animate() {
			switch(self._type) {
				case 'swaps' : 
					count = self.swapsAnimation.call(self, count);
					break;
				case 'conquest' :
					count = self.conquestAnimation.call(self, count);
					break;
			}

			
			if ( ! self.arrSteps.length || count == self.arrSteps.length ) {
				self.$flow.find('ul li span').css('background', 'black');
				clearTimeout(timeOutId);
				if ( typeof fnCallback === 'function' ) fnCallback();

			}else {
				setTimeout(animate, 50);	
			} 
			
		},0);

		return timeOutId;
	}

	Animate.prototype.swapsAnimation = function(count) {
		var $flow = this.$flow;
		var $el = $flow.find('ul li');
		$el.removeClass('current');

		var _swap = this.arrSteps[count++];

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

		return count;	
	}

	Animate.prototype.conquestAnimation = function(count) {
		var $flow = this.$flow;
		var $el = $flow.find('ul li');
		$el.removeClass('current');

		var _step = this.arrSteps[count++];

		if ( typeof _step === 'undefined' ) return;

		var $elem = $($el[_step.pos]);
		$elem.addClass('current');
		$elem.find('span').css('background', 'black');
		
		var maximumValue = $flow.data('maximum-value');
		var percent = ( _step.value / maximumValue ) * 100;

		$elem.find('span').css("width", percent + "%");
		$elem.find('span').data('value', _step.value);


		return count;

	}

})(jQuery);