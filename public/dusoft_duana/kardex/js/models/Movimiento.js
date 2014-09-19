
define(["angular","js/models", "js/models/Detalle"], function(angular, models){

	 models.factory('Movimiento', ["Detalle", function(Detalle) {

		function Movimiento(){
		}

		Movimiento.prototype.setDatos = function(datos){

			datos.cantidad = parseInt(datos.cantidad);
			datos.stock_actual = parseInt(datos.stock_actual);
                        
			this.bodegas_doc_id  = datos.bodegas_doc_id;
			this.cantidad_entradas = 0;
			this.cantidad_salidas  = 0;
			this.costo = datos.costo;
			this.factura = datos.factura;
			this.fecha = datos.fecha; 
			this.fecha_registro = datos.fecha_registro;
			this.fecha_vencimiento = datos.fecha_vencimiento;
			this.lote = datos.lote;
			this.nombre = datos.nombre;
			this.numero = datos.numero;
			this.observacion = datos.observacion;
			this.prefijo = datos.prefijo;
			this.tipo = datos.tipo;
			this.tipo_movimiento = datos.tipo_movimiento;
			this.usuario = datos.usuario;
			this.valor = datos.valor;
			this.detalle = Detalle.get(datos.detalle);
                        this.stock_actual = datos.stock_actual;

			if(this.tipo_movimiento == "E"){
				this.cantidad_salidas = datos.cantidad;
			} else {
				this.cantidad_entradas = datos.cantidad;
			}
 

			
		};

		this.get = function(nombre, tipo){
	    	return new Movimiento(nombre, tipo);
	    };

	    return this;

	}]);
});