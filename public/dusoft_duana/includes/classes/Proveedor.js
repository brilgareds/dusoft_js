define(["angular", "js/models","includes/classes/Tercero"], function(angular, models) {

    models.factory('Proveedor', ["Tercero", function(Tercero) {
 
        function Proveedor(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {            
            Tercero.getClass().call(this,nombre, tipo_id, id, direccion, telefono);
            this.codigo_proveedor_id = codigo_proveedor_id || "";
        };

        this.get = function(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono) {
            return new Proveedor(tipo_id, id, codigo_proveedor_id, nombre, direccion, telefono);
        };


        Proveedor.prototype = Object.create(Tercero.getClass().prototype)
        
        this.getClass = function(){
            return Proveedor;
        };

        return this;

    }]);
});