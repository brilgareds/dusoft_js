
define(["angular", "js/controllers"
], function(angular, controllers) {

    controllers.controller('GestionarRecepcionesController', [
        '$scope', '$rootScope', 'Request',
        '$modal', 'API', "socket", "$timeout",
        "AlertService", "localStorageService", "$state", "$filter",
        "EmpresaOrdenCompra",
        "RecepcionMercancia",
        "ProveedorOrdenCompra",
        "OrdenCompraPedido",
        "Transportadora",
        "NovedadRecepcion",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state, $filter,
                Empresa, Recepcion, Proveedor, OrdenCompra, Transportadora, Novedad, Sesion) {

            var that = this;

            $scope.Empresa = Empresa;

            // Variables de Sesion
            $scope.session = {
                usuario_id: Sesion.getUsuarioActual().getId(),
                auth_token: Sesion.getUsuarioActual().getToken()
            };

            // Variables

            $scope.datos_view = {
                hstep: 1,
                mstep: 1,
                ismeridian: false,
                datepicker: false,
                format: 'dd-MM-yyyy',
                termino_busqueda_proveedores: '',
                btn_agregar_eliminar_registro: true,
                disabled_agregar_eliminar_registro: true,
                recepciones: []
            };


            //=========== Transportadora =============
            that.buscar_transportadoras = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        transportadoras: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.TRANSPORTADORAS.LISTAR_TRANSPORTADORAS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.render_transportadoras(data.obj.transportadoras);
                    }
                });
            };

            that.render_transportadoras = function(transportadoras) {

                $scope.Empresa.limpiar_transportadoras();

                transportadoras.forEach(function(data) {

                    var transportadora = Transportadora.get(data.id, data.descripcion, data.placa, data.estado);
                    transportadora.set_solicitar_guia(data.sw_solicitar_guia);

                    $scope.Empresa.set_transportadoras(transportadora);
                });
            };

            $scope.seleccionar_transportadora = function(recepcion) {

            };

            //=========== Proveeedores =============
            $scope.listar_proveedores = function(termino_busqueda) {

                if (termino_busqueda.length < 3) {
                    return;
                }

                $scope.datos_view.termino_busqueda_proveedores = termino_busqueda;

                that.buscar_proveedores(function(proveedores) {

                    that.render_proveedores(proveedores);
                });
            };

            that.buscar_proveedores = function(callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        proveedores: {
                            termino_busqueda: $scope.datos_view.termino_busqueda_proveedores
                        }
                    }
                };

                Request.realizarRequest(API.PROVEEDORES.LISTAR_PROVEEDORES, "POST", obj, function(data) {

                    if (data.status === 200) {

                        callback(data.obj.proveedores);
                    }
                });
            };

            that.render_proveedores = function(proveedores) {

                $scope.Empresa.limpiar_proveedores();

                proveedores.forEach(function(data) {

                    var proveedor = Proveedor.get(data.tipo_id_tercero, data.tercero_id, data.codigo_proveedor_id, data.nombre_proveedor, data.direccion, data.telefono);

                    $scope.Empresa.set_proveedores(proveedor);
                });
            };

            $scope.seleccionar_proveedor = function(recepcion) {
                // Buscar Ordenes Compra del Proveedor Seleccionado
                that.buscar_ordenes_compra(recepcion);
            };

            //=========== Ordenes Compra Proveeedor =============
            that.buscar_ordenes_compra = function(recepcion) {

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            codigo_proveedor_id: recepcion.get_proveedor().get_codigo_proveedor()
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.LISTAR_ORDENES_COMPRAS_PROVEEDOR, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_ordenes_compras(data.obj.ordenes_compras);
                    }
                });
            };

            that.render_ordenes_compras = function(ordenes_compras) {

                $scope.Empresa.limpiar_ordenes_compras();

                ordenes_compras.forEach(function(orden) {

                    var orden_compra = OrdenCompra.get(orden.numero_orden, orden.estado, orden.observacion, orden.fecha_registro);

                    $scope.Empresa.set_ordenes_compras(orden_compra);
                });
            };

            //======== Novedades Recepcion Mercancia =========
            that.buscar_novedades_mercancia = function() {

                var obj = {
                    session: $scope.session,
                    data: {
                        novedades_mercancia: {
                            termino_busqueda: ''
                        }
                    }
                };

                Request.realizarRequest(API.NOVEDADES_MERCANCIA.LISTAR_NOVEDADES_MERCANCIA, "POST", obj, function(data) {

                    if (data.status === 200) {

                        that.render_novedades_mercancia(data.obj.novedades_mercancia);
                    }
                });
            };

            that.render_novedades_mercancia = function(novedades) {

                $scope.Empresa.limpiar_novedades_mercancia();

                novedades.forEach(function(novedad) {

                    var novedad_mercancia = Novedad.get(novedad.id, novedad.codigo, novedad.descripcion, novedad.estado);

                    $scope.Empresa.set_novedades_mercancia(novedad_mercancia);
                });

            };

            //======== Ingresar Recepcion Mercancia =========
            that.ingresar_recepcion_mercancia = function(recepcion, callback) {

                recepcion.fecha_ingreso = $filter('date')(recepcion.fecha_ingreso, "dd-MM-yyyy")

                var obj = {
                    session: $scope.session,
                    data: {
                        ordenes_compras: {
                            recepcion_mercancia: recepcion
                        }
                    }
                };

                Request.realizarRequest(API.ORDENES_COMPRA.INGRESAR_RECEPCION_MERCANCIA, "POST", obj, function(data) {

                    AlertService.mostrarMensaje("warning", data.msj);

                    if (data.status === 200) {
                        recepcion.set_numero_recepcion(data.obj.ordenes_compras.numero_recepcion);
                        //$scope.datos_view.response = data;
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            };


            //=========== Funcionalidades View =============

            $scope.abrir_calendario = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker = true;
            };

            $scope.agregar_eliminar_registro = function() {

                if ($scope.datos_view.btn_agregar_eliminar_registro) {
                    $scope.agregar_registro();
                    $scope.datos_view.btn_agregar_eliminar_registro = false;
                } else {
                    $scope.eliminar_registro();
                    $scope.datos_view.btn_agregar_eliminar_registro = true;
                }
            };

            $scope.agregar_registro = function() {

                var recepcion = Recepcion.get(Sesion.getUsuarioActual().getEmpresa().getCodigo(), 0);
                recepcion.disabled_btn = false;
                recepcion.class_btn_add = 'glyphicon glyphicon-plus';
                recepcion.fn_btn_add = $scope.agregar_anexo;

                $scope.datos_view.recepciones.push(recepcion);
            };

            $scope.eliminar_registro = function() {

                $scope.datos_view.recepciones.pop();
            };

            $scope.agregar_anexo = function(row) {

                row.disabled_btn = true;

                $scope.datos_view.disabled_agregar_eliminar_registro = true;

                var recepcion = Recepcion.get(Sesion.getUsuarioActual().getEmpresa().getCodigo(), 0);
                recepcion.disabled_btn = false;
                recepcion.class_btn_add = 'glyphicon glyphicon-minus';
                recepcion.fn_btn_add = $scope.eliminar_anexo;

                $scope.datos_view.recepciones.push(recepcion);
            };

            $scope.eliminar_anexo = function() {

                $scope.datos_view.recepciones.pop();

                var row = $scope.datos_view.recepciones[$scope.datos_view.recepciones.length - 1];
                row.disabled_btn = false;

                $scope.datos_view.disabled_agregar_eliminar_registro = true;
            };

            $scope.crear_recepcion = function(recepcion) {

                var validacion = recepcion.validar_campos_ingreso();

                if (validacion.continuar) {
                    
                    $scope.datos_view.disabled_agregar_eliminar_registro = false;
                    $scope.datos_view.btn_agregar_eliminar_registro = true;

                    that.ingresar_recepcion_mercancia(recepcion, function(continuar) {
                        if (continuar)
                            recepcion.disabled_btn = true;
                    });

                } else {
                    AlertService.mostrarMensaje("warning", validacion.msj);
                }
            };

            $scope.cancelar_recepcion = function() {
                $state.go('ListarRecepciones');
            };

            $scope.finalizar_recepcion = function() {
                $state.go('ListarRecepciones');
            };

            $scope.agregar_registro();
            that.buscar_transportadoras();
            that.buscar_novedades_mercancia();

            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });

        }]);
});