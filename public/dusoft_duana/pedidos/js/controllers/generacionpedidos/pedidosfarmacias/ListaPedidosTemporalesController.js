//Controlador de la View verpedidosfarmacias.html

define(["angular",
    "js/controllers",
    'includes/slide/slideContent',
    'models/generarpedidos/ClientePedido',
    'models/generarpedidos/PedidoVenta'], function(angular, controllers) {

    controllers.controller('ListaPedidosTemporalesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaPedido', 'PedidoFarmacia',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        "CentroUtilidadPedidoFarmacia", "BodegaPedidoFarmacia", "ListaPedidosFarmaciasService",
        function($scope, $rootScope, Request, EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                API, socket, AlertService, $state, Usuario, localStorageService, $modal,
                CentroUtilidadPedidoFarmacia, BodegaPedidoFarmacia, ListaPedidosFarmaciasService) {
            var self = this;

            $scope.rootPedidosTempFarmacias = {};

            var self = this;

            $scope.rootPedidosTempFarmacias.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };

            $scope.rootPedidosTempFarmacias.paginaactual = 1;

            $scope.rootPedidosTempFarmacias.termino_busqueda = "";

            var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

            $scope.rootPedidosTempFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(empresa.getNombre(), empresa.getCodigo());


            $scope.rootPedidosTempFarmacias.lista_pedidos_temporales_farmacias = {
                data: 'rootPedidosTempFarmacias.empresaSeleccionada.obtenerPedidos()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'farmaciaOrigen.nombre_farmacia', displayName: 'Farmacia', width: "15%"},
                    {field: 'farmaciaOrigen.getCentroUtilidadSeleccionado().getNombre()', displayName: 'Centro Utilidad', width: "15%"},
                    {field: 'farmaciaOrigen.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getNombre()', displayName: 'Bodega', width: "15%"},
                    {field: 'observacion', displayName: 'Observación'},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: '<div class="btn-group">\
                                        <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
                                        <ul class="dropdown-menu dropdown-options">\
                                            <li><a href="javascript:void(0);" ng-click="onEditarPedidoFarmaciaTemp(row.entity)">Modificar</a></li>\
                                            <li class="divider"></li>\
                                            <li><a href="javascript:void(0);" ng-click="onEliminarPedidoTemporal(row.entity, row.entity)" >Eliminar</a></li>\
                                        </ul>\n\
                                        </div>'

                    }

                ]

            };

            /*
             * @Author: Eduar
             * +Descripcion: function helper que prepara los parametros y hace el llamado para buscar los encabezados de pedidos de farmacia temporales
             * depende de self.consultarEncabezados() y self.renderPedidos()
             */

            self.buscarPedidos = function(callback) {
                var obj = {
                    session: $scope.rootPedidosTempFarmacias.session,
                    data: {
                        pedidos_farmacias: {
                            termino_busqueda: $scope.rootPedidosTempFarmacias.termino_busqueda,
                            empresa_id: $scope.rootPedidosTempFarmacias.empresaSeleccionada.getCodigo(),
                            pagina_actual: $scope.rootPedidosTempFarmacias.paginaactual,
                            filtro: {}
                        }
                    }
                };

                self.consultarEncabezadosPedidos(obj, function(data) {
                    console.log("datos encontrados ", data);
                    if (data.status === 200) {
                        if (data.obj.pedidos_farmacias.length > 0) {

                            /*las empresas del usuario (de la session) son de tipo Empresa, por lo tanto se requiere asegurar 
                             que sean de tipo EmpresaPedidoFarmacia para acceder a los metodos 
                             de esta ultima*/

                            $scope.rootPedidosTempFarmacias.empresaSeleccionada = EmpresaPedidoFarmacia.get(
                                    $scope.rootPedidosTempFarmacias.empresaSeleccionada.getNombre(),
                                    $scope.rootPedidosTempFarmacias.empresaSeleccionada.getCodigo()
                                    );


                            self.renderPedidos(data.obj.pedidos_farmacias);

                            if (callback) {
                                callback(true);
                            }
                        } else {
                            if (callback) {
                                callback(false);
                            }
                        }
                    } else {
                        AlertService.mostrarMensaje("warning", "Ha ocurrido un error");
                    }
                });
            };


            /*
             * @Author: Eduar
             * @param {object} obj
             * @param {function} callback
             * +Descripcion: Metodo encargado de consultar los encabezados de los pedidos de farmacia
             */

            self.consultarEncabezadosPedidos = function(obj, callback) {

                var url = API.PEDIDOS.LISTADO_PEDIDOS_TEMPORALES_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    callback(data);

                });
            };


            /*
             * @Author: Eduar
             * @param {Array<object>} pedidos
             * +Descripcion: metodo encargado de serializar el json de pedidos, depende de self.crearPedido()
             */

            self.renderPedidos = function(data) {
                for (var i in data) {
                    var obj = data[i];
                    var pedido = ListaPedidosFarmaciasService.crearPedido(obj);
                    $scope.rootPedidosTempFarmacias.empresaSeleccionada.agregarPedido(pedido);
                }

            };

            /*
             * @Author: Eduar
             * +Descripcion: handler del combo de empresas
             */

            $scope.onBuscarPedidos = function() {
                console.log("on buscar pedidos");
                $scope.rootPedidosTempFarmacias.paginaactual = 1;
                self.buscarPedidos();
            };


            /*
             * @Author: Eduar
             * @param {Object} event
             * +Descripcion: handler del text input para buscar pedidos por descripcion
             */
            $scope.onCampoBuscarPedidos = function(event) {
                if (event.which === 13) {
                    $scope.rootPedidosTempFarmacias.paginaactual = 1;
                    self.buscarPedidos();
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: function helper que permite paginar
             */
            $scope.paginaAnterior = function() {
                if ($scope.rootPedidosTempFarmacias.paginaactual === 1) {
                    return;
                }

                $scope.rootPedidosTempFarmacias.paginaactual--;
                self.buscarPedidos();
            };

            /*
             * @Author: Eduar
             * +Descripcion: function helper que permite paginar
             */
            $scope.paginaSiguiente = function() {
                $scope.rootPedidosTempFarmacias.paginaactual++;
                self.buscarPedidos(function(resultado) {
                    if (!resultado) {
                        $scope.rootPedidosTempFarmacias.paginaactual--;
                    }
                });
            };
            
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * @param {index} index
             * +Descripcion: handler de la opcion de eliminar en el grid de temoprales
             */

            $scope.onEliminarPedidoTemporal = function(pedido, index) {

                var template = '<div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">Mensaje del Sistema</h4>\
                                    </div>\
                                    <div class="modal-body">\
                                    <h4>Seguro desea eliminar el Pedido Temporal ? </h4> \
                                    </div>\
                                    <div class="modal-footer">\
                                    <button class="btn btn-warning" ng-click="close()">No</button>\
                                    <button class="btn btn-primary" ng-click="eliminarPedidoTemporal()">Si</button>\
                                </div>';

                controller = function($scope, $modalInstance) {

                    $scope.eliminarPedidoTemporal = function() {

                        self.eliminarDetallePedidoTemporal(pedido, index);
                        $modalInstance.close();
                    };

                    $scope.close = function() {
                        $modalInstance.close();
                    };
                };

                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: template,
                    scope: $scope,
                    controller: controller
                };

                var modalInstance = $modal.open($scope.opts);
            };
            
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * @param {index} index
             * +Descripcion: eliminar detalle de pedido de temporales
             */
            
            self.eliminarDetallePedidoTemporal = function(pedido, index) {
                var farmacia = pedido.getFarmaciaOrigen();
                
                var obj_detalle = {
                    session: $scope.rootPedidosTempFarmacias.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: farmacia.get_farmacia_id(),
                            centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                        }
                    }
                };

                var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_DETALLE_PEDIDO_FARMACIA_TEMPORAL_COMPLETO;

                Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        console.log("Eliminación del detalle Exitosa: ", data.msj);
                        //Eliminación encabezado temporal
                       self.eliminarEncabezado(farmacia, index);

                    }
                    else
                    {
                        console.log("Eliminación del detalle Fallida: ", data.msj);
                    }
                });
            };
            
            /*
             * @Author: Eduar
             * @param {PedidoFarmacia} pedido
             * @param {index} index
             * +Descripcion: eliminar encabezado de pedido de temporales
             */
            
            self.eliminarEncabezado = function(farmacia, index){
                  var obj_encabezado = {
                        session: $scope.rootPedidosTempFarmacias.session,
                        data: {
                            pedidos_farmacias: {
                               empresa_id: farmacia.get_farmacia_id(),
                               centro_utilidad_id: farmacia.getCentroUtilidadSeleccionado().getCodigo(),
                               bodega_id: farmacia.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()
                            }
                        }
                    };

                    var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                    Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                        if (data.status === 200) {
                           self.buscarPedidos();
                        }
                        else {
                            console.log("Eliminación de encabezado Fallida: ", data.msj);
                        }
                    });
            };


            self.buscarPedidos();


            /*that.pedido = PedidoVenta.get();
             
             $scope.rootPedidosTempFarmacias = {};
             
             $scope.rootPedidosTempFarmacias.Empresa = EmpresaPedido;
             $scope.rootPedidosTempFarmacias.Pedido = PedidoVenta;
             
             $scope.rootPedidosTempFarmacias.paginas = 0;
             
             $scope.rootPedidosTempFarmacias.termino_busqueda = "";
             $scope.rootPedidosTempFarmacias.ultima_busqueda = {};
             $scope.rootPedidosTempFarmacias.paginaactual = 1;
             
             $scope.rootPedidosTempFarmacias.ultima_busqueda.seleccion = "";
             $scope.rootPedidosTempFarmacias.ultima_busqueda.termino_busqueda = "";
             
             $scope.rootPedidosTempFarmacias.seleccion = Usuario.getUsuarioActual().getEmpresa().getCodigo();;
             
             $scope.rootPedidosTempFarmacias.session = {
             usuario_id: Usuario.getUsuarioActual().getId(),
             auth_token: Usuario.getUsuarioActual().getToken()
             };
             
             //$scope.rootPedidosTempFarmacias.empresasDestino = Usuario.getUsuarioActual().getEmpresa().getCentrosUtilidad();
             $scope.rootPedidosTempFarmacias.empresasDestino = Usuario.getUsuarioActual().getEmpresasFarmacias();
             
             $scope.rootPedidosTempFarmacias.listado_farmacias = [];
             
             that.listarFarmacias = function() {
             
             var listado_farmacias = [];
             
             console.log("Listado Empresas Farmacias: ", $scope.rootPedidosTempFarmacias.empresasDestino);
             
             $scope.rootPedidosTempFarmacias.empresasDestino.forEach(function(farmacia){
             
             var obj_farmacia = {
             empresa_id: farmacia.codigo,
             razon_social: farmacia.nombre
             };
             
             listado_farmacias.push(obj_farmacia);
             
             });
             
             $scope.rootPedidosTempFarmacias.listado_farmacias = listado_farmacias;
             console.log("Listado Farmacias: ", $scope.rootPedidosTempFarmacias.listado_farmacias);
             
             
             };
             
             $scope.obtenerParametrosTemp = function() {
             
             //valida si cambio el termino de busqueda
             if ($scope.rootPedidosTempFarmacias.ultima_busqueda.termino_busqueda !== $scope.rootPedidosTempFarmacias.termino_busqueda
             || $scope.rootPedidosTempFarmacias.ultima_busqueda.seleccion !== $scope.rootPedidosTempFarmacias.seleccion)
             
             {
             $scope.rootPedidosTempFarmacias.paginaactual = 1;
             
             }
             
             var obj = {
             session: $scope.rootPedidosTempFarmacias.session,
             data: {
             pedidos_farmacias: {
             termino_busqueda: $scope.rootPedidosTempFarmacias.termino_busqueda,
             empresa_id: $scope.rootPedidosTempFarmacias.seleccion,
             //empresa_id: $scope.farmacia_seleccionada.get_farmacia_id(),
             pagina_actual: $scope.rootPedidosTempFarmacias.paginaactual,
             filtro: {}
             }
             }
             };
             
             return obj;
             };
             
             that.consultarEncabezadosPedidos = function(obj, callback) {
             
             var url = API.PEDIDOS.LISTADO_PEDIDOS_TEMPORALES_FARMACIAS;
             
             Request.realizarRequest(url, "POST", obj, function(data) {
             
             if (data.status === 200) {
             console.log("Consulta exitosa: ", data.msj);
             
             if (callback !== undefined && callback !== "" && callback !== 0) {
             callback(data);
             }
             }
             else {
             console.log("Error en la consulta: ", data.msj);
             
             if (callback !== undefined && callback !== "" && callback !== 0) {
             callback(data);
             }
             }
             });
             };
             
             $scope.onBuscarPedidosFarmaciasTemp = function(obj, paginando) {
             
             that.consultarEncabezadosPedidos(obj, function(data) {
             
             $scope.rootPedidosTempFarmacias.ultima_busqueda = {
             termino_busqueda: $scope.rootPedidosTempFarmacias.termino_busqueda,
             seleccion: $scope.rootPedidosTempFarmacias.seleccion
             //seleccion: $scope.farmacia_seleccionada.get_farmacia_id()
             };
             
             that.renderPedidosFarmacias(data.obj, paginando);
             
             });
             };
             
             that.renderPedidosFarmacias = function(data, paginando) {
             
             $scope.rootPedidosTempFarmacias.items = data.pedidos_farmacias.length;
             
             //se valida que hayan registros en una siguiente pagina
             if (paginando && $scope.rootPedidosTempFarmacias.items === 0) {
             if ($scope.rootPedidosTempFarmacias.paginaactual > 1) {
             $scope.rootPedidosTempFarmacias.paginaactual--;
             }
             AlertService.mostrarMensaje("warning", "No se encontraron más registros");
             return;
             }
             
             $scope.rootPedidosTempFarmacias.Empresa.vaciarPedidosTemporalesFarmacia();
             
             if (data.pedidos_farmacias.length > 0)
             {
             $scope.rootPedidosTempFarmacias.Empresa.setCodigo(data.pedidos_farmacias[0].empresa_destino);
             }
             
             for (var i in data.pedidos_farmacias) {
             
             var obj = data.pedidos_farmacias[i];
             
             var pedido = that.crearPedido(obj);
             
             $scope.rootPedidosTempFarmacias.Empresa.agregarPedidoTemporalFarmacia(pedido);
             
             }
             
             };
             
             
             
             //Grid Lista Pedidos Temporales
             $scope.rootPedidosTempFarmacias.lista_pedidos_temporales_farmacias = {
             data: 'rootPedidosTempFarmacias.Empresa.getPedidosTemporalesFarmacia()',
             enableColumnResize: true,
             enableRowSelection: false,
             columnDefs: [
             {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia', width: "15%"},
             {field: 'farmacia.nombre_centro_utilidad', displayName: 'Centro Utilidad', width: "15%"},
             {field: 'farmacia.nombre_bodega', displayName: 'Bodega', width: "15%"},
             {field: 'observacion', displayName: 'Observación'},
             {field: 'opciones', displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "8%",
             
             cellTemplate: '<div class="btn-group">\
             <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" >Acción<span class="caret"></span></button>\
             <ul class="dropdown-menu dropdown-options">\
             <li><a href="javascript:void(0);" ng-click="onEditarPedidoFarmaciaTemp(row.entity)">Modificar</a></li>\
             <li class="divider"></li>\
             <li><a href="javascript:void(0);" ng-click="onEliminarPedidoTemporal(row.entity.farmacia.farmacia_id, row.entity.farmacia.centro_utilidad_id, row.entity.farmacia.bodega_id, row.rowIndex, row.entity)" >Eliminar</a></li>\
             </ul>\n\
             </div>'
             
             }
             
             ]
             
             };
             
             $scope.onEditarPedidoFarmaciaTemp = function(data) {
             
             PedidoVenta.pedidoseleccionado = "";
             
             var pedido = PedidoVenta.get();
             
             var datos_pedido = {
             numero_pedido: '',
             fecha_registro: '',
             descripcion_estado_actual_pedido: '',
             estado_actual_pedido: '',
             estado_separacion: ''
             };
             
             pedido.setDatos(datos_pedido);
             pedido.setTipo(2);
             pedido.setObservacion(data.observacion);
             
             var farmacia = FarmaciaVenta.get(
             data.farmacia.farmacia_id,
             data.farmacia.bodega_id,
             data.farmacia.nombre_farmacia,
             data.farmacia.nombre_bodega,
             data.farmacia.centro_utilidad_id,
             data.farmacia.nombre_centro_utilidad
             );
             
             pedido.setFarmacia(farmacia);
             
             //Verificación Previa de Farmacias, Centros de Utilidad y Bodega asignadas al usuario
             
             
             
             //Insertar aquí el pedido seleccionado para el singleton Empresa
             $scope.rootPedidosTempFarmacias.Empresa.setPedidoSeleccionado(pedido);
             
             //PedidoVenta.pedidoseleccionado = data.numero_pedido;
             $state.go('CreaPedidosFarmacias');
             
             };
             
             
             
             $scope.abrirViewPedidoFarmaciaTemp = function() {
             
             PedidoVenta.pedidoseleccionado = "";
             localStorageService.set("pedidoseleccionado", PedidoVenta.pedidoseleccionado);
             
             
             var datos_pedido = {
             numero_pedido: "",
             fecha_registro: "",
             descripcion_estado_actual_pedido: "",
             estado_actual_pedido: "",
             estado_separacion: ""
             };
             
             that.pedido.setDatos(datos_pedido);
             that.pedido.setTipo(2);
             that.pedido.setObservacion("");
             //that.pedido.setEnUso(0);
             
             //Creación objeto farmacia
             var farmacia = FarmaciaVenta.get(
             0,
             0,
             "",
             "",
             0,
             ""
             );
             
             that.pedido.setFarmacia(farmacia);
             
             $scope.rootPedidosTempFarmacias.Empresa.setPedidoSeleccionado(that.pedido);
             
             
             $scope.rootPedidosTempFarmacias.Empresa.getPedidoSeleccionado().vaciarProductos();
             
             $state.go('CreaPedidosFarmacias');
             };            
             
             $scope.paginaAnteriorTemp = function() {
             $scope.rootPedidosTempFarmacias.paginaactual--;
             $scope.onBuscarPedidosFarmaciasTemp($scope.obtenerParametrosTemp(), true);
             };
             
             $scope.paginaSiguienteTemp = function() {
             $scope.rootPedidosTempFarmacias.paginaactual++;
             $scope.onBuscarPedidosFarmaciasTemp($scope.obtenerParametrosTemp(), true);
             };            
             
             $scope.valorSeleccionadoTemp = function() {
             
             $scope.onBuscarPedidosFarmaciasTemp($scope.obtenerParametrosTemp());
             };
             
             that.listarFarmacias();
             $scope.onBuscarPedidosFarmaciasTemp($scope.obtenerParametrosTemp());*/



        }]);

});
