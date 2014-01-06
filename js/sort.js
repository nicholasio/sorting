;(function(){

	window.Sort = Sort =  function(arr) {
		this.arr = arr;
		this.arrSwaps = [];
		this.arrValues = [];
	};

	/*
		Para animações em que só ocorrem trocas
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
		Para animações tipo set Value (geralmente algoritmos que usam memória auxiliar)
	*/
	Sort.prototype.setValue = function( pos, value ) {
		this.arrValues.push( { 'pos' : pos, 'value' : value } );
	}

	Sort.prototype.getValues = function() {
		return this.arrValues;
	}

	Sort.prototype.get = function(typeAnimation) {
		switch(typeAnimation) {
			case 'swaps' : 
				return this.getSwaps();
				break;
			case 'conquest' : 
				return this.getValues();
				break;
		}
	}

	/*
		Realiza a troca de dois elementos do vetor
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
				flag = false;
				if ( j == this.arr.length - i - 2) {
					flag = true;
				}
				if ( this.arr[j] > this.arr[j+1] ) {
					this.setSwap(j, j+1, flag);
					this.swap(j, j+1);
				} else { this.setSwap(j, j, flag); }
			}
			//this.setSwap(j,j, true); //Elemento está ordenado
		}
		//this.setSwap(0, 0, true); //Marcando o primeiro

		return 'swaps';

	}

	Sort.prototype.insertion = function() {
		var x;
		var j;

		for (var i = 1 ; i <= this.arr.length - 1; i++) {
			var j = i;
		    while ( j > 0 ) {
		    	if ( this.arr[j] < this.arr[j-1] ) {
		    		this.setSwap(j, j-1, true);
		    		this.swap(j, j-1);

		    	} else {
		    		this.setSwap(j,j, false);
		    		break;
		    	}

		    	j--;
		    }
		}

		return 'swaps';
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

		return 'swaps';
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
			this.arr[i] = w[i-p];
			this.setValue(i, w[i-p]);
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

		return 'conquest';
	}	

	/*
		Implementação QuickSort
	*/
	Sort.prototype.separa = function(p, r){
		var c,j,k;
		c = this.arr[r]; j = p;
		for( k = p; k < r; k++ ) {
			if ( this.arr[k] <= c ){
				this.swap(j,k);
				this.setSwap(j,k);
				j++;
			} else { this.setSwap(k,k,false); }
		}
		this.setSwap(r,j,true);
		this.swap(r,j,true);

		return j;

	}

	Sort.prototype.quick = function() {
		this.quickSort(0, this.arr.length - 1);

		return 'swaps';
	}

	Sort.prototype.quickSort = function(p, r) {
		var j;
		if ( p < r ) {
			j = this.separa(p, r);

			this.quickSort(p,j-1);
			this.quickSort(j+1,r);
		}
	}


	/*
		Implementação HeapSort
	*/
	Sort.prototype._descer = function(pai, n) {
	    var filho = 2*pai + 1;

	    if (filho < n) {
	        if (filho < n - 1)
	            if( this.arr[filho + 1] > this.arr[filho] ) //se o filho direito é maior
	                filho++;
	        if (this.arr[pai] < this.arr[filho] ) { // trocar pai com seu menor filho
	            this.swap(pai, filho);
	            this.setSwap(filho,pai, true);
	            this._descer(filho, n);
	        } else this.setSwap(pai, pai);
	    }
	}

	Sort.prototype._arranjar = function(n) {
	    for( var i = parseInt( (n-1)/2 ); i >= 0; i--) {
	        this._descer(i, n);
	    }
	}

	Sort.prototype.heapSort = function(n){
	    this._arranjar(n); //Cria uma heap binária

	    var m = n-1;
	    while(m > 0) {
	    	this.swap(0,m);
	    	this.setSwap(0,m, true);
	        this._descer( 0, m);
	        --m;
	    }
	}

	Sort.prototype.heap = function() {
		this.heapSort(this.arr.length);

		return 'swaps';
	}

	/*
		Shell Sort
	*/
	Sort.prototype.shell = function() {
		 var i, temp, flag = 1;
	     var d = this.arr.length;

	     while( flag || (d > 1)) {                    // boolean flag (true when not equal to 0)
	          flag = 0;                               // reset flag to 0 to check for future swaps
	          d = parseInt( (d+1) / 2 );
	          for (i = 0; i < (this.arr.length - d); i++) {
	               if (this.arr[i + d] < this.arr[i]) {
	               		this.swap(i+d,i);
	               		this.setSwap(i+d, i, true);
	                    flag = 1;                  // tells swap has occurred
	               } else {
	               	this.setSwap(i+d, i+d, false);
	               }
	          }
	     }
	     return 'swaps';

	}
})();
