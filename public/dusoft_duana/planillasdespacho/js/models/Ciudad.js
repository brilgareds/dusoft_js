define(["angular", "js/models"], function(angular, models) {

    models.factory('Ciudad', [function() {

            function Ciudad(pais_id, nombre_pais, departamento_id, nombre_departamento, ciudad_id, nombre_ciudad) {                

                this.pais_id = pais_id;
                this.nombre_pais = nombre_pais; 

                this.departamento_id = departamento_id;
                this.nombre_departamento =  nombre_departamento;

                this.ciudad_id = ciudad_id;
                this.nombre_ciudad = nombre_ciudad;                
            }

            this.get = function(pais_id, nombre_pais, departamento_id, nombre_departamento, ciudad_id, nombre_ciudad) {
                return new Ciudad(pais_id, nombre_pais, departamento_id, nombre_departamento, ciudad_id, nombre_ciudad);
            };

            
            Ciudad.prototype.get_pais_id = function() {
                return this.pais_id;
            };
            
            Ciudad.prototype.get_nombre_pais = function() {
                return this.nombre_pais;
            };
            
            Ciudad.prototype.get_departamento_id = function() {
                return this.departamento_id;
            };
            
            Ciudad.prototype.get_nombre_departamento = function() {
                return this.nombre_departamento;
            };

            Ciudad.prototype.get_ciudad_id = function() {
                return this.ciudad_id;
            };
            
            Ciudad.prototype.get_nombre_ciudad = function() {
                return this.nombre_ciudad+' ('+this.nombre_departamento+')';
            };
            return this;
        }]);
});