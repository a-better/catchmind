Array.prototype.removeById = function(id){
	for(var i = this.length - 1; i >= 0; i--) {
	    if(this[i].id === id) {
	       this.splice(i, 1);
	    }
	}
	return this;
};

Array.prototype.searchById = function(id){
	for(var i=0; i<this.length; i++){
		if(this[i].id === id){
			return this[i];
		}
	}
};