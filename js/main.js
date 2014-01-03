;(function($){

	var SortingFlow = {
		$algorithmFlow : $('.algorithm-flow'),

		arrValues : {  },

		defaultValues : { 'random' : [1,90, 50,40,43,85,53,12,46,54,20,5,23,40], 
						  'nearly-sorted' : [20,20,10,10,30,30,40,50,60,60,70,70,80,80,90,90],
						  'reversed' : [100,90,80,70,60,50,40,30,20,10,5,1],
						  'few-unique' : [40,10,20,30,50,40,20,50,30,10,50,30,20,40,10]
					    },

		currentAnimation : [ ],

		init : function () {
			var self = this;

			//Set os fluxos para os valores padrões
			this.setFlows();

			//Escute os eventos de início
			this.startEvent();
			

		},
		setFlows : function() {
			var self = this;
			for( var _set in this.defaultValues ) {
				var set =  this.defaultValues[_set];

				//Pega o container (tr) do conjunto de fluxos de execução, com exceção do primeiro td
				var $flows = $('#' + _set ).find('td:not(:first-child)'); 

				$.each( $flows, function(index) {
					var algorithmName = $(this).data('algorithm-name');
					$(this).attr('id',_set + '-' + algorithmName);

					self.setFlow( $(this), set );
				});
			}
		},

		setFlow : function( $flow, set ) {
			var $ul = $flow.find( 'ul' );
			_li = '';

			for( value in set ) {
				_li += '<li data-value="'+ set[value] + '"><span></span></li>\n';
			}

			$ul.html(_li);

			var maximumValue = Math.max.apply(Math, set);
			$flow.data('maximum-value', maximumValue);

			//REFATORAR
			this.initializeFlow($flow);
		},

		initializeFlow : function($flow) {
			var self = this;
			var maximumValue = $flow.data('maximum-value');

			var $li = $flow.find('> ul > li');

			var algorithmName = $flow.data('algorithm-name');

			var setName = this._getSetName($flow);

			//Inicializando array
			if (typeof this.arrValues[algorithmName] === 'undefined' )
				this.arrValues[algorithmName] = {};

			this.arrValues[algorithmName][setName] = [];

			$.each($li, function(index){
				var $this = $(this);
				var value = $this.data('value');
				
				var percent = ( value / maximumValue ) * 100;

				//Populando o array
				(function(arr){
					arr[arr.length] = value;
				})(self.arrValues[algorithmName][setName]);

				//percent = (percent > 10 ) ? percent : 1;
				$this.find('span').css("width", percent + "%");
			});

		},

		startEvent : function() {
			var self = this;

			$('.start').click(function(evt){
				var $this = $(this);
				$this.html('...');
				$this.removeClass('btn-primary').addClass('btn-success');

				var $flow = $this.parent();
				var algorithmName = $flow.data('algorithm-name');

				var setName = self._getSetName($flow);

				var sort = new Sort(self.arrValues[algorithmName][setName]); // self.arrValues.method
				var typeAnimation = sort[algorithmName](); //equivalente a sort.method();

				var steps = sort.get(typeAnimation);
				//console.log(sort.getArr());
				var Anim = new Animate($this.parent() , steps, typeAnimation);

				Anim.start(function(){
					$this.removeClass('btn-success').addClass('btn-primary');
					$this.html("Start");
				});

				return false;
			});

			$('.all').click(function() {
				//self.stopCurrentAnimation();
				//self.setFlows();
				$('.start').click();
				return false;
			});

			$('.sort-row').click(function(){
				//self.stopCurrentAnimation();
				//self.setFlows();
				$(this).parent().parent().find('.start').click();
			});
			$('.reset-row').click(function() {
				self.setFlows();

			});
		},

		stopCurrentAnimation : function() {
			for(var i = 0; i < this.currentAnimation.length; i++ ){
				clearTimeout(this.currentAnimation[i]);
			}
				
		},
		_getSetName : function($flow) {
			var setName = $flow.attr('id');
			var algorithmName = $flow.data('algorithm-name');

			//Pegando o tipo de conjunto de dados
			setName = setName.replace('-' +algorithmName, ''); 

			return setName;
		}

	};


	//Chamando método init mantendo o contexto do objeto SortingFlow
	$(document).ready( $.proxy(SortingFlow.init, SortingFlow) );

})(jQuery);