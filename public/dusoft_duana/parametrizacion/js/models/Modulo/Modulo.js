define(["angular", "js/models"], function(angular, models) {

    models.factory('Modulo', [function() {

            function Modulo(id, parent, text, url) {
                //propiedades necesarias para el plugin de jstree
                this.id = (id) ? "modulo_" + id : 0;
                this.parent = (parent) ? "modulo_" + parent : "#";
                this.text = text || "";
                this.icon = "";
                //

                this.nombre = this.text;
                this.url = url || "";
                this.modulo_id = id || 0;
                this.parent_id = parent || "#";
                this.opciones = [];
                this.state = "";
                this.observacion = "";
                this.nodo_principal = false;
                this.estado = false;
                this.opcionAGuardar;

                if (this.parent === "#") {
                    this.nodo_principal = true;
                }
                
                //arreglo necesario para guardar en modulos_empresas, incluye los modulos padre
                this.modulosPadre = [];
                
                this.modulosHijo  = [];

                this.empresasModulos = [];

            }

            Modulo.prototype.setId = function(id) {
                this.id = "modulo_" + id;
                this.modulo_id = id;
            };
            
            Modulo.prototype.getId = function(id) {
                return  this.modulo_id ;
            };
            
            Modulo.prototype.getNombre = function() {
                return  this.nombre ;
            };

            Modulo.prototype.getOpciones = function() {
                return this.opciones;
            };

            Modulo.prototype.agregarOpcion = function(opcion) {

                for (var i in this.opciones) {
                    if (this.opciones[i].id === opcion.id) {
                        return false;
                    }
                }

                this.opciones.unshift(opcion);
            };

            Modulo.prototype.eliminarOpcion = function(opcion) {

                for (var i in this.opciones) {
                    if (this.opciones[i].id === opcion.id) {
                        this.opciones.splice(i, 1);
                        break;
                    }
                }

            };

            Modulo.prototype.vaciarOpciones = function() {
                this.opciones = [];
            };


            Modulo.prototype.setIcon = function(icon) {
                this.icon = icon;
            };

            Modulo.prototype.getIcon = function() {
                return this.icon;
            };

            Modulo.prototype.setState = function(state) {
                this.state = state;
            };

            Modulo.prototype.getState = function() {
                return this.state;
            };

            Modulo.prototype.setObservacion = function(observacion) {
                this.observacion = observacion;
            };

            Modulo.prototype.getObservacion = function() {
                return this.observacion;
            };

            Modulo.prototype.setEstado = function(estado) {
                this.estado = Boolean(estado);
            };

            Modulo.prototype.setNodoPrincipal = function(nodo_principal) {
                this.nodo_principal = nodo_principal;
            };

            Modulo.prototype.setOpcionAGuardar = function(opcion) {
                this.opcionAGuardar = opcion;
            };

            Modulo.prototype.getOpcionAGuardar = function() {
                return this.opcionAGuardar;
            };

            Modulo.prototype.vaciarListaEmpresas = function(opcion) {
                this.empresasModulos = [];
            };

            Modulo.prototype.agregarEmpresa = function(empresa_modulo) {
                for (var i in this.empresasModulos) {
                    var empresa = this.empresasModulos[i];
                    if (empresa_modulo.getEmpresa().getCodigo() === empresa.getEmpresa().getCodigo()
                        && empresa_modulo.getModulo().getId() === empresa.getModulo().getId()) {
                        console.log("changing empresa codigo to ",empresa_modulo.getEmpresa().getEstado(), " module ", empresa.getModulo().getId());
                        this.empresasModulos[i] = empresa_modulo;
                        return;
                    }
                }

                this.empresasModulos.push(empresa_modulo);
            };

            Modulo.prototype.getListaEmpresas = function() {
                return this.empresasModulos;
            };
            
            Modulo.prototype.getModulosPadre = function() {
                return this.modulosPadre;
            };
            
             Modulo.prototype.setModulosPadre = function(modulos) {
                this.modulosPadre = modulos;
            };
            
            Modulo.prototype.getModulosHijo = function() {
                return this.modulosHijo;
            };
            
             Modulo.prototype.setModulosHijo = function(modulos) {
                this.modulosHijo = modulos;
            };
            
            this.get = function(id, parent, text, url) {
                return new Modulo(id, parent, text, url);
            };

            return this;
        }]);
});