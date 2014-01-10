;(function($){

	window.Animate = Animate = function(flow, arrSteps, type, mainObj ) {
		this.$flow = flow;
		this.arrSteps = arrSteps;
		this._type = type;
		this.mainObj = mainObj;
		this.$elementsBar = null;
		this.$elements = null;
	}

	Animate.prototype.start = function( fnCallback ) {
		var self = this;
		var count = 0;
		var end = false;

		//Só precisamos guardar o id do setTimeout atual
		var pos = self.mainObj.currentsAnimations.length;

		this.$elements = this.$flow.find('ul li');
		this.$elementsBar    = this.$elements.find('span');

		var start, end;
		start = new Date().getTime();
		self.mainObj.currentsAnimations[pos] = setTimeout(function animate() {
			switch(self._type) {
				case 'swaps' : 
					count = self.swapsAnimation.call(self, count);
					break;
				case 'conquest' :
					count = self.conquestAnimation.call(self, count);
					break;
			}

			
			if ( ! self.arrSteps.length || count == self.arrSteps.length ) {
				self.$elementsBar.css('background', 'black');
				clearTimeout(self.mainObj.currentsAnimations[pos]);
				end = new Date().getTime();
				if ( typeof fnCallback === 'function' ) fnCallback( start, end );

			} else {
				self.mainObj.currentsAnimations[pos] = setTimeout(animate, 50);
			} 
			
		},0);

	}

	Animate.prototype.swapsAnimation = function(count) {
		var $flow = this.$flow;
		var $el = this.$elementsBar;

		this.$elements.removeClass('current');

		var _swap = this.arrSteps[count++];

		if ( typeof _swap === 'undefined' ) return;

		var $actual = $($el[_swap.pos_ini]);
		var $next = $($el[_swap.pos_final]);

		$next.parent().addClass('current');

		if ( _swap.ordenado ) { //Indica que o elemente neste índice já está na sua posição
			$next.css("background", "black");
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
		var $el = this.$elementsBar;

		this.$elements.removeClass('current');

		var _step = this.arrSteps[count++];

		if ( typeof _step === 'undefined' ) return;

		var $elem = $($el[_step.pos]);
		$elem.parent().addClass('current');
		$elem.css('background', 'black');

		var maximumValue = $flow.data('maximum-value');
		var percent = ( _step.value / maximumValue ) * 100;

		$elem.css("width", percent + "%");
		$elem.data('value', _step.value);


		return count;

	}

})(jQuery);