;(function($){

    window._animations = [];
    
    window.addAnimation = function( animObj ) {
        window._animations.push(animObj);
    }
    
    window.startAnimations = function( mainObj ) {
        var pos = mainObj.currentsAnimations.length;
        
        var animId;
        animId = setTimeout(function animate(){
            var hasAnimations = false;
            for( var i = 0; i < window._animations.length; i++ ) {
                var currObj = window._animations[i];
                //console.log(currObj.count + '-' + currObj.arrSteps.length);
                if ( currObj === null ) {
                	continue;
                }
                else if ( currObj.count == currObj.arrSteps.length) {
                    currObj.fnCallback();
                    currObj.$elementsBar.css('background', 'black');
                    window._animations[i] = null;
                } else {
                    hasAnimations = true;
                    //window.doAnimation(currObj, animate, mainObj, pos);   
                    //console.log(currObj);
                    var $elements, $elementsBar;
        
			        currObj.$elements       = currObj.$flow.find('ul li');
					currObj.$elementsBar    = currObj.$elements.find('span');
					
					//console.log(currObj);
					switch(currObj._type) {
						case 'swaps' : 
							//console.log("swap animation done");
							currObj.swapsAnimation.call(currObj);
							break;
						case 'conquest' :
							//console.log("conquest animation");
							currObj.conquestAnimation.call(currObj);
							break;
					}
                }
            }    
            if ( ! hasAnimations ) {
			    clearTimeout(animId);
			    window._animations = [];
            }  else {
            	animId = setTimeout(animate, 50);
            }
            
        },0);

    }
    
    window.doAnimation = function( currObj, fnAnimate, mainObj, pos ) {
        var $elements, $elementsBar;
        
        currObj.$elements       = currObj.$flow.find('ul li');
		currObj.$elementsBar    = currObj.$elements.find('span');
		
		switch(currObj._type) {
			case 'swaps' : 
				currObj.swapsAnimation.call(currObj);
				break;
			case 'conquest' :
				currObj.conquestAnimation.call(currObj);
				break;
		}

		

		mainObj.currentsAnimations[pos] = setTimeout(fnAnimate, 50);
		
    }
    
	window.Animate = Animate = function(flow, arrSteps, type, fnCallback ) {
		this.$flow = flow;
		this.arrSteps = arrSteps;
		this._type = type;
		//this.mainObj = mainObj;
		this.$elementsBar = null;
		this.$elements = null;
		this.count = 0;
		this.fnCallback = fnCallback;
	}

	Animate.prototype.start = function( fnCallback ) {
		var self = this;
		var count = 0;
		var end = false;

		//Só precisamos guardar o id do setTimeout atual
		var pos = self.mainObj.currentsAnimations.length;

		this.$elements = this.$flow.find('ul li');
		this.$elementsBar    = this.$elements.find('span');

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
				if ( typeof fnCallback === 'function' ) fnCallback();

			} else {
				self.mainObj.currentsAnimations[pos] = setTimeout(animate, 50);
			} 
			
		},0);

	}

	Animate.prototype.swapsAnimation = function() {
		var $flow = this.$flow;
		var $el = this.$elementsBar;

		this.$elements.removeClass('current');

		var _swap = this.arrSteps[this.count++];

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

	}

	Animate.prototype.conquestAnimation = function() {
		var $flow = this.$flow;
		var $el = this.$elementsBar;

		this.$elements.removeClass('current');

		var _step = this.arrSteps[this.count++];

		if ( typeof _step === 'undefined' ) return;

		var $elem = $($el[_step.pos]);
		$elem.parent().addClass('current');
		$elem.css('background', 'black');

		var maximumValue = $flow.data('maximum-value');
		var percent = ( _step.value / maximumValue ) * 100;

		$elem.css("width", percent + "%");
		$elem.data('value', _step.value);



	}

})(jQuery);