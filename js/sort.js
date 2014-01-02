;(function(){

	window.Sort = Sort =  function(arr) {
		this.arr = arr;
		this.arrSwaps = [];
	};

	/*
		Salva a troca para a animação futura
	*/
	Sort.prototype.setSwap = function( pos_ini, pos_final, ordenado, unidirecional ) {
		this.arrSwaps.push( {'pos_ini' : pos_ini, 'pos_final' : pos_final, 'ordenado' : ordenado, 'unidirecional' : unidirecional} );
	}

	Sort.prototype.getSwaps = function() {
		return this.arrSwaps;
	}

	Sort.prototype.getArr = function() {
		return this.arr;
	}
	/*
		Realiza a troca
	*/

	Sort.prototype.swap = function( a, b ){
		var aux = this.arr[a];
		this.arr[a] = this.arr[b];
		this.arr[b] = aux;
	}

	/* Bubble */
	Sort.prototype.bubble = function() {
		for( var i = 0; i < this.arr.length - 1; i++) {
			var j = 0
			for (; j < this.arr.length - i - 1; j++) {

				if ( this.arr[j] > this.arr[j+1] ) {
					this.setSwap(j, j+1, false);
					this.swap(j, j+1);
				} else { this.setSwap(j, j, false); }
			}
			this.setSwap(j,j, true); //Elemento está ordenado
		}
		this.setSwap(0, 0, true); //Marcando o primeiro

	}

	Sort.prototype.insertion = function() {
		var x;
		var j;

		for (var i = 1 ; i <= this.arr.length - 1; i++) {
			var j = i;
		    while ( j > 0 && this.arr[j] < this.arr[j-1]) {
		    	this.setSwap(j, j-1, false);
		    	this.swap(j, j-1);
		    	j--;
		    }
		}
	}

	Sort.prototype.selection = function() {
		var min;
		for( var i = 0; i <= this.arr.length - 1; i++ ) {
			min = i;
			for ( var j = i + 1; j <= this.arr.length; j++ ) {
				if ( this.arr[j] < this.arr[min] ) min = j;
				this.setSwap(j, j, false);
			}
			this.setSwap(i, min, false);
			this.swap(min,i);
			this.setSwap(i,i,true);
		}
	}

	/* MergeSort */

	Sort.prototype.intercala = 	function (p, q, r) {
		var i, j, k;
		i = p; j = q; k = 0;
		w = [ ];
		while ( i < q && j < r ) {
			if ( this.arr[i] <= this.arr[j] ) w[k++] = this.arr[i++];
			else w[k++] = this.arr[j++];
		}
		
		while (i < q) {
			w[k++] = this.arr[i++];
		}
		while (j < r){
			w[k++] = this.arr[j++];	
		}

		for (i = p; i < r; i++ ) {
			this.setSwap(i, p, false, false);
			this.arr[i] = w[i-p];
			console.log(this.arr[i-p] + " " + this.arr[ p ]);
		}
	}

	Sort.prototype.mergeSort = function(p, r) {
		if ( p < r - 1) {
			var q = parseInt((p + r) / 2);

			this.mergeSort(p,q);
			this.mergeSort(q,r);
			this.intercala(p,q,r);
		}
	}

	Sort.prototype.merge = function() {
		this.mergeSort(0, this.arr.length);
	}	



})();