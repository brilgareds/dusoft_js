
define(["angular", "js/models"], function(angular, models) {

    models.factory('Tercero', function() {

        function Tercero(nombre, tipo_id_tercero, id, direccion, telefono) {

            this.nombre_tercero = nombre || "";
            this.tipo_id_tercero = tipo_id_tercero || "";
            this.id = id || "";
            this.direccion = direccion || "";
            this.telefono = telefono || "";
            this.pais;
            this.departamento;
            this.municipio;
        }
        ;
        
        //Operaciones Get de parámetros iniciales de creación de Tercero
        Tercero.prototype.getNombre = function(){
            return this.nombre_tercero;
        };
        
        Tercero.prototype.getTipoId = function(){
            return this.tipo_id_tercero;
        };
        
        Tercero.prototype.getId = function(){
            return this.id;
        };
        
        Tercero.prototype.getDireccion = function(){
            return this.direccion;
        };
        
        Tercero.prototype.getTelefono = function(){
            return this.telefono;
        };
        
        //Operaciones Set y Get de atributos adicionales
        Tercero.prototype.setPais = function(pais) {
            this.pais = pais;
        };

        Tercero.prototype.getPais = function() {
            return this.pais;
        };

        Tercero.prototype.setDepartamento = function(departamento) {
            this.departamento = departamento;
        };

        Tercero.prototype.getDepartamento = function() {
            return this.departamento;
        };
        
        Tercero.prototype.setMunicipio = function(municipio) {
            this.municipio = municipio;
        };

        Tercero.prototype.getMunicipio = function() {
            return this.municipio;
        };        

        this.get = function(nombre, tipo_id_tercero, id, direccion, telefono, pais, departamento, municipio) {
            return new Tercero(nombre, tipo_id_tercero, id, direccion, telefono, pais, departamento, municipio);
        };

        this.getClass = function() {
            return Tercero;
        };

        return this;

    });
});