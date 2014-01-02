;(function($){

	

	var SortingFlow = {
		$algorithmFlow : $('.algorithm-flow'),

		arrValues : { 'bubble' : [], 'insertion' : [], 'selection' : [], 'merge' : [] },

		init : function () {
			var self = this;

			$('.start').click(function(evt){
				var $this = $(this);
				$this.html('...');
				$this.removeClass('btn-primary').addClass('btn-success');

				var $flow = $this.parent();
				var algorithmName = $flow.data('algorithm-name');

				var sort = new Sort(self.arrValues[algorithmName]); // self.arrValues.method

				sort[algorithmName](); //equivalente a sort.method();

				console.log(sort.getArr());
				var swaps = sort.getSwaps();
				var Anim = new Animate($this.parent() , swaps);

				Anim.start(function(){
					$this.removeClass('btn-success').addClass('btn-primary');
					$this.html("Start");
				});

				return false;
			});

			$.each(this.$algorithmFlow, function(index){
				var $this = $(this);
				var maximumValue = $this.data('maximum-value');
				var $li = $this.find('> ul > li');

				var algorithmName = $this.data('algorithm-name');

				$.each($li, function(index){
					var $this = $(this);
					var value = $this.data('value');

					
					var percent = ( value / maximumValue ) * 100;

					//Populando o array
					(function(arr){
						arr[arr.length] = value;

					})(self.arrValues[algorithmName]);
					
					//percent = (percent > 10 ) ? percent : 1;
					$this.find('span').css("width", percent + "%");
				});
				
			});

			$('.all').click(function() {
				$('.start').click();
				return false;
			});
		}

	};


	//Chamando método init mantendo o contexto do objeto SortingFlow
	$(document).ready( $.proxy(SortingFlow.init, SortingFlow) );

})(jQuery);