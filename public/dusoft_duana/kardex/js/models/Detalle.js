define(["angular","js/models"], function(angular, models){
	models.factory('Detalle', function() {

		function Detalle(detalle){
			this.objectodetalle = detalle;
			this.detalle = "";
			this.armarStringDetalle();
		}

		Detalle.prototype.armarStringDetalle = function(){

			for(var i in this.objectodetalle){
				this.detalle += "<p><strong>"+i +"</strong> "+this.objectodetalle[i] || ""+"</p>"; 
			}

		};

		Detalle.prototype.getDetalle = function(){
			return this.detalle;
		};

		this.get = function(detalle){
			return new Detalle(detalle);
		}

		return this;
	});
});