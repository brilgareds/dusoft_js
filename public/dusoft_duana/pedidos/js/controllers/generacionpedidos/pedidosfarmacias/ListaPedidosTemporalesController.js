//Controlador de la View verpedidosfarmacias.html

define(["angular", 
    "js/controllers",
    'includes/slide/slideContent',
    'models/generarpedidos/ClientePedido',
    'models/generarpedidos/PedidoVenta'], function(angular, controllers) {

    controllers.controller('ListaPedidosTemporalesController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaVenta', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", "$modal",
        function($scope, $rootScope, Request, EmpresaPedido, FarmaciaVenta, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService, $modal) {
            var self = this;
            
            $scope.rootPedidosTempFarmacias = {};
            
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

            that.crearPedido = function(obj) {

                var pedido = PedidoVenta.get();

                var datos_pedido = {
                    numero_pedido: '',
                    fecha_registro: '',
                    descripcion_estado_actual_pedido: '',
                    estado_actual_pedido: '',
                    estado_separacion: ''
                };

                pedido.setDatos(datos_pedido);
                pedido.setTipo(PedidoVenta.TIPO_FARMACIA);

                pedido.setObservacion(obj.observacion);

                //pedido.setEnUso(obj.en_uso);

                var farmacia = FarmaciaVenta.get(
                        obj.farmacia_id,
                        obj.bodega,
                        obj.nombre_farmacia,
                        obj.nombre_bodega,
                        obj.centro_utilidad,
                        obj.nombre_centro_utilidad
                        );

                pedido.setFarmacia(farmacia);

                return pedido;
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
            
            $scope.onEliminarPedidoTemporal = function(farmacia_id, centro_utilidad_id, bodega_id, index, pedido){
                


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

                        that.onEliminarPedidoFarmaciaTemp(farmacia_id, centro_utilidad_id, bodega_id, index);
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
            
            that.onEliminarPedidoFarmaciaTemp = function(farmacia_id, centro_utilidad_id, bodega_id, index){

                //Eliminación Detalle Temporal
                var obj_detalle = {
                    session: $scope.rootPedidosTempFarmacias.session,
                    data: {
                        detalle_pedidos_farmacias: {
                            empresa_id: farmacia_id,
                            centro_utilidad_id: centro_utilidad_id,
                            bodega_id: bodega_id
                        }
                    }
                };
                
                var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_DETALLE_PEDIDO_FARMACIA_TEMPORAL_COMPLETO;

                Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                    if (data.status === 200) {
                        console.log("Eliminación del detalle Exitosa: ", data.msj);
                        
                        //Eliminación encabezado temporal
                        var obj_encabezado = {
                            session: $scope.rootPedidosTempFarmacias.session,
                            data: {
                                pedidos_farmacias: {
                                    empresa_id: farmacia_id,
                                    centro_utilidad_id: centro_utilidad_id,
                                    bodega_id: bodega_id
                                }
                            }
                        };

                        var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                        Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                            if (data.status === 200) {
                                console.log("Eliminación de encabezado Exitosa: ", data.msj);
                                //$scope.rootPedidosTempFarmacias.Empresa.getPedidoSeleccionado().eliminarProducto(index);
                                $scope.rootPedidosTempFarmacias.Empresa.eliminarPedidoTemporalFarmacia(index);
                                //$state.go('VerPedidosFarmacias');
                            }
                            else{
                                console.log("Eliminación de encabezado Fallida: ", data.msj);
                            }
                        });
                        
                        
                    }
                    else
                    {
                        console.log("Eliminación del detalle Fallida: ", data.msj);
                    }
                });
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
