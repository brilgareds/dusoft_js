define(["angular", "js/models"], function(angular, models) {

    models.factory('Modulo', [function() {

            function Modulo(id, parent, text, url, prefijo) {

                //propiedades necesarias para el plugin de jstree
                this.prefijo = (prefijo) ? prefijo : "modulo_";
                this.id = (id) ? this.prefijo + id : 0;
                this.parent = (parent) ? this.prefijo + parent : "#";
                this.text = text || "";
                this.icon = "";
                this.carpetaRaiz = "";
                //

                this.nombre = this.text;
                this.url = url || "";
                this.modulo_id = parseInt(id) || 0;
                this.parent_id = parent || "#";
                this.opciones = [];
                this.variables = [];
                this.state = "";
                this.observacion = "";
                this.nodo_principal = false;
                this.estado = false;
                this.opcionAGuardar;
                this.variableAGuardar;

                if (this.parent === "#") {
                    this.nodo_principal = true;
                }

                //arreglo necesario para guardar en modulos_empresas, incluye los modulos padre
                this.modulosPadre = [];
                this.modulosHijo = [];
                this.empresasModulos = [];
                this.rolesModulos = [];

            }

            Modulo.prototype.setId = function(id) {
                this.id = this.prefijo + id;
                this.modulo_id = id;
            };

            Modulo.prototype.getId = function(id) {
                return  this.modulo_id;
            };


            Modulo.prototype.setCarpetaRaiz = function(carpeta) {
                this.carpetaRaiz = carpeta;
            };

            Modulo.prototype.getCarpetaRaiz = function() {
                return  this.carpetaRaiz;
            };

            Modulo.prototype.getNombre = function() {
                return  this.nombre;
            };

            Modulo.prototype.getOpciones = function(objetoValor) {
                //se retorna un objeto llave valor para facilitar el acceso en los permisos
                if (objetoValor) {
                    var _opciones = {};
                    for (var i in this.opciones) {
                        var opcion = this.opciones[i];
                        _opciones[opcion.alias] = opcion.estado_opcion_rol;

                    }

                    return _opciones;
                }


                return this.opciones;
            };
            
            
            Modulo.prototype.getVariables = function() {
                return this.variables;
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

            Modulo.prototype.agregarVariable = function(variable) {

                for (var i in this.variables) {
                    if (this.variables[i].id === variable.id) {
                        return false;
                    }
                }

                this.variables.unshift(variable);
            };

            Modulo.prototype.eliminarVariable = function(variable) {

                for (var i in this.variables) {
                    if (this.variables[i].id === variable.id) {
                        this.variables.splice(i, 1);
                        break;
                    }
                }

            };

            Modulo.prototype.vaciarOpciones = function() {
                this.opciones = [];
            };
            
            Modulo.prototype.vaciarVariables = function() {
                this.variables = [];
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
                this.estado = Boolean(Number(estado));
            };

            Modulo.prototype.getEstado = function(estado) {
                return this.estado;
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

            Modulo.prototype.setVariableAGuardar = function(variable) {
                this.variableAGuardar = variable;
            };

            Modulo.prototype.getVariableAGuardar = function() {
                return this.variableAGuardar;
            };


            Modulo.prototype.vaciarListaEmpresas = function(opcion) {
                this.empresasModulos = [];
            };

            Modulo.prototype.agregarEmpresa = function(empresa_modulo) {
                for (var i in this.empresasModulos) {
                    var empresa = this.empresasModulos[i];
                    if (empresa_modulo.getEmpresa().getCodigo() === empresa.getEmpresa().getCodigo()
                            && empresa_modulo.getModulo().getId() === empresa.getModulo().getId()) {
                        console.log("changing empresa codigo to ", empresa_modulo.getEmpresa().getEstado(), " module ", empresa.getModulo().getId());
                        this.empresasModulos[i] = empresa_modulo;
                        return;
                    }
                }

                this.empresasModulos.push(empresa_modulo);
            };

            Modulo.prototype.getListaEmpresas = function() {
                return this.empresasModulos;
            };

            Modulo.prototype.setListasEmpresas = function(empresas) {
                this.empresasModulos = empresas;
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


            Modulo.prototype.vaciarRoles = function() {
                this.rolesModulos = [];
            };

            Modulo.prototype.getRoles = function() {
                return this.rolesModulos;
            };

            Modulo.prototype.setRoles = function(roles) {
                this.rolesModulos = roles;
            };

            Modulo.prototype.agregarRol = function(rolModulo) {
                for (var i in this.rolesModulos) {
                    var modulo = this.rolesModulos[i];
                    if (modulo.getRol().getId() === rolModulo.getRol().getId()
                            && modulo.getRol().getEmpresaId() === rolModulo.getRol().getEmpresaId()
                            && modulo.getModulo().getId() === rolModulo.getModulo().getId()) {

                        return false;
                    }
                }

                this.rolesModulos.push(rolModulo);
            };

            this.get = function(id, parent, text, url, prefijo) {
                return new Modulo(id, parent, text, url, prefijo);
            };

            return this;
        }]);
});