define(["angular", "js/models"], function(angular, models) {

    models.factory('Modulo', [function() {

            function Modulo(id, parent, text, url) {
                this.id = (id) ?"modulo_"+id:0;
                this.parent = (parent) ?"modulo_"+parent:"#" ;
                this.text = text || "";
                this.nombre = this.text;
                this.url = url || "";
                this.modulo_id = id || 0;
                this.parent_id = parent || "#";
                this.opciones = [];
                this.icon = "";
                this.state = "";
                this.observacion = "";
                this.nodo_principal = false;
                this.estado = false;
                
                
                if(this.parent === "#"){
                    this.nodo_principal = true;
                }
                
                
            }
            
            Modulo.prototype.getOpciones = function(){
                 return this.opciones;
            };
            
            Modulo.prototype.agregarOpcion = function(opcion){
                 this.opciones.push(opcion);
            };
            
            Modulo.prototype.vaciarOpciones = function(){
                 this.opciones = [];
            };
            
            
            Modulo.prototype.setIcon = function(icon){
                 this.icon = icon;
            };
            
            Modulo.prototype.getIcon = function(){
                 return this.icon;
            };
            
            Modulo.prototype.setState = function(state){
                 this.state = state;
            };
            
            Modulo.prototype.getState = function(){
                return this.state;
            };
            
            Modulo.prototype.setObservacion = function(observacion){
                this.observacion = observacion;
            };
            
            Modulo.prototype.getObservacion = function(){
                return this.observacion;
            };
            
            Modulo.prototype.setEstado = function(estado){
                this.estado = Boolean(estado);
            };
            
            Modulo.prototype.setNodoPrincipal = function(nodo_principal){
                this.nodo_principal = nodo_principal;
            };
            
            this.get = function(id, parent, text, url) {
                return new Modulo(id, parent, text, url);
            };

            return this;
        }]);
});