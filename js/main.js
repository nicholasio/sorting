;(function($){

	var SortingFlow = {
		$algorithmFlow : $('.algorithm-flow'),

		arrValues : {  },

		defaultValues : { 'random' 			: [1,90, 50,40,43,85,53,12,46,54,20,5,23,40,45], 
						  'nearly-sorted' 	: [20,20,10,10,30,30,40,50,60,60,70,70,80,80,90],
						  'reversed' 		: [100,90,80,70,60,50,40,30,20,10,9,8,7,5,1],
						  'few-unique'		: [40,10,20,30,50,40,20,50,30,10,50,30,20,40,10]
					    },

		currentsAnimations : [ ],

		customValues : { },

		init : function () {
			var self = this;
			//Seta os fluxos para os valores padrões
			this.setFlows();

			//Escute os eventos de início
			this.startEvent();

			this.$algorithmFlow.on('click', $.proxy( this.setCustomFlow, this) );
			this.$algorithmFlow.on('evt.setFlow', this.evtSetFlow );
			
		},
		setCustomFlow : function(evt, $flows) {
			var self = this;
			var $currentFlow;

			if ( evt === null ) {
				$currentFlow = $flows
			} else {
				$currentFlow = $(evt.currentTarget);
			}
			

			var values = [];
			$( "#dialog-message" ).dialog({
				modal: true,
				width: 300,
				buttons: {
					Ok: function() {
						var $textarea = $(this).find("textarea");

						if ( $textarea.val().length == 0 ) {
							$(this).dialog( "close" );
							return;	
						}
						self.stopCurrentsAnimations();
						values = $textarea.val().split(',');

						$.each($currentFlow, function() {
							var _idFlow = $(this).attr('id');

							if (typeof self.customValues[_idFlow] === 'undefined' ) 
								self.customValues[_idFlow] = [];

							self.customValues[_idFlow] = values;

							$(this).trigger('evt.setFlow', [ values, self ]);
						});
						
						$textarea.val("");

						$( this ).dialog( "close" );
					},
					Cancel : function() {
						$( this ).dialog( "close" );
					}
				}
			});

			
		},
		evtSetFlow : function(evt, values, self) {
			self.setFlow($(this), values);
		},
		getSet : function(_idFlow, _set){

			if ( typeof this.customValues[_idFlow] !== 'undefined' && this.customValues[_idFlow].length > 0)
				return this.customValues[_idFlow];

			return this.defaultValues[_set];
		},
		setFlows : function() {
			var self = this;
			for( var _set in this.defaultValues ) {
				var set =  this.defaultValues[_set];

				//Pega o container (tr) do conjunto de fluxos de execução, com exceção do primeiro td
				var $flows = $('#' + _set ).find('td:not(:first-child)'); 

				$.each( $flows, function( index ) {
					var algorithmName = $(this).data('algorithm-name');
					var _idFlow = _set + '-' + algorithmName;

					$(this).attr('id', _idFlow);

					self.setFlow( $(this), self.getSet(_idFlow, _set) );
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
			$flow.find('.time').html("");
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

			this.resetBtn.apply($flow.find('> a'));

		},

		startEvent : function() {
			var self = this;
			var $all 		= $('.all');
			var $sortRow 	= $('.sort-row');
			var $reset 		= $('.reset');
			var $sortCol 	= $('.sort-col');
			var $setRow     = $('.set-row');
			var $setCol  	= $('.set-col');
			var $resetAll   = $('.reset-all');

			var $start 		= $('.start');

			$start.click(function(evt, max, obj){

				var $this = $(this);
				$this.html('...');
				$this.removeClass('btn-primary').addClass('btn-success');
					

				var $flow = $this.parent();
				var algorithmName = $flow.data('algorithm-name');

				var setName = self._getSetName($flow);

				var sort = new Sort(self.arrValues[algorithmName][setName]); // self.arrValues.method


				var typeAnimation = sort[algorithmName](); //equivalente a sort.method();



				var steps = sort.get(typeAnimation);

                var start, diff;
				start = new Date().getTime();

				/* 
					Passando função de callback resetBtn com o contexto do botão
					Para isso é necessário retornar uma função callback que execute a função de reset
					no contexto correto, note que o código return self.resetBtn.apply($this) executaria a função
					e retornaria um possível valor de retorno.
				*/
				var Anim = new Animate($this.parent() , steps, typeAnimation,
				    (function(){
						return function(){
							diff = new Date().getTime() - start;
							$this.parent().find('.time').html("*Tempo: " + diff/1000 + "s");
							self.resetBtn.apply($this);	
						}
					})()
				);

                addAnimation(Anim);

               /*if (  typeof max === 'undefined' || ++(obj.count) == max  ) {
                	console.log('started');
                	$start.__count = 0;
                	startAnimations(self);
                }*/
				return false;
			});

            $('.start-anim').click(function(){
                //console.log(window._animations);
                startAnimations(self);    
            });
            
            
			$all.click(function() {
				self.stopCurrentsAnimations();
				self.setFlows();

				var allFlows = $start.length;
				$start.__max = allFlows;
				$start.click();
				return false;
			});

			$sortRow.click(function(){
				$resetAll.click();
				var obj = { count : 0 };
				var $start = $(this).parent().parent().find('.start');
				$start.trigger('click', [$start.length, obj]);
				console.log(obj);
			});

			$reset.click(function() {
				self.customValues = {};
				self.stopCurrentsAnimations();	
				self.setFlows();
			});

			$sortCol.click(function() {
				$resetAll.click();

				var cellIndex = $(this).parent()[0].cellIndex;
				var $table = $(this).parent().parent().parent();

				var $start = $table.find('tr:not(:first-child) td:nth-child('+ (cellIndex + 1)+') > .start');
				$start.__max = $start.length;
				$start.__count = 0;
				$start.click();
				
			});

			$setRow.click(function() {
				var $flows = $(this).parent().parent().find('.algorithm-flow');
				self.setCustomFlow( null, $flows)
			});

			$setCol.click(function(){
				var cellIndex = $(this).parent()[0].cellIndex;
				var $table = $(this).parent().parent().parent();

				var $flows = $table.find('tr:not(:first-child) td:nth-child('+ (cellIndex + 1)+')');
				self.setCustomFlow(null, $flows);
			});

			$resetAll.click(function() {
				self.stopCurrentsAnimations();	
				self.setFlows();
			});
		},

		resetBtn : function( ) {
			this.removeClass('btn-success').addClass('btn-primary');
			this.html("Start");
			this.addClass('start');
		},

		stopCurrentsAnimations : function() {
			for(var i = 0; i < this.currentsAnimations.length; i++ ){
				clearTimeout(this.currentsAnimations[i]);
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