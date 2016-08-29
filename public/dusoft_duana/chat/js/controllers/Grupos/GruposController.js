//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('GruposController', [
        '$scope', '$rootScope', 'Request',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService", '$modal',
        "$timeout",
        function($scope, $rootScope, Request, 
                 API, socket, AlertService,
                 $state, Usuario, localStorageService, $modal,
                 $timeout) {
                     
            
            var self = this;
            $scope.root = {};

            $scope.root.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            
                        
            $scope.root.listaGrupos = {
                data: 'root.pedido.getProductosSeleccionados()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableHighlighting:true,
                multiSelect: false,
                showFilter:true,
                filterOptions:$scope.root.filtroGrid,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width:150,
                        cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
                                                    <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                    <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                    <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                    <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                    <span class="label label-info"    ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                    <span class="label label-info"    ng-show="row.entity.getTipoProductoId() == 8">Nu</span>\
                                                    <span ng-cell-text >{{COL_FIELD}}</span>\
                                                </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "50%"},
                    {field: 'getCantidadSolicitada()', displayName: 'Solicitado'},
                    {field: 'getCantidadPendiente()', displayName: 'Pendiente'},
                    {field: 'nueva_cantidad', displayName: 'Modificar Cantidad',visible:false,
                                cellTemplate: ' <div class="col-xs-12">\n\
                                                    <input ng-disabled="!root.servicio.opciones.sw_modificar_pedido" type="text" validacion-numero-entero class="form-control grid-inline-input"'+
                                                    'ng-keyup="onModificarCantidad($event, row)" ng-model="row.entity.cantidadIngresada" />\
                                                </div>'
                    },
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "5%",
                            cellTemplate: ' <div class="row">\
                                                <button class="btn btn-default btn-xs" ng-click="onEliminarProducto(row.entity, row.rowIndex)" ng-validate-events="{{root.servicio.getOpcionesModulo(root.pedido).btnEliminarPedidoTemporal}}">\
                                                    <span class="glyphicon glyphicon-remove"></span>\n\
                                                </button>\
                                            </div>'
                        }
                ]
            };
            
            
            self.onTraerGrupos = function(){
                var obj = {
                    session: $scope.root.session,
                    data: {
                        chat: {
                            termino_busqueda: '',
                            pagina_actual:1
                        }
                    }
                };

                Request.realizarRequest(API.CHAT.LISTAR_GRUPOS, "POST", obj, function(data) {
                    console.log(">>>>>>>>>>>>>>>>>>>>> ",data);
                    /*var obj = data.obj.parametrizacion_usuarios;

                    if (obj) {
                        var empresas = obj.empresas || [];

                        //se hace el set correspondiente para el plugin de jstree
                        for (var i in empresas) {
                            var empresa = Empresa.get(empresas[i].razon_social, empresas[i].empresa_id);

                            if (empresa.getCodigo() === $scope.Usuario.getEmpresa().getCodigo()) {
                                empresa.setCentrosUtilidad($scope.Usuario.getEmpresa().getCentrosUtilidad());
                                $scope.Usuario.setEmpresa(empresa);
                            }

                            $scope.Usuario.agregarEmpresaUsuario(empresa);


                        }

                        callback();
                    }*/

                });
            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Permite hacer render en los dropdown de las empreas destino y origen
             */
            $scope.renderEncabezado = function(data){
                $scope.seleccionarEmpresaPedido(false, data.empresa_destino, data.centro_destino, data.bodega_destino);
                $scope.seleccionarEmpresaPedido(true, data.farmacia_id, data.centro_utilidad, data.bodega || data.bodega_id);
                $scope.root.pedido.setValido(true).setDescripcion(data.observacion);
            };
            
            
            /*
             * @Author: Eduar
             * @param {Object} data
             * +Descripcion: Permite hacer render en los dropdown de las empreas destino y origen
             */
            $scope.renderDetalle = function(_productos){
                
                /*for (var i in _productos) {
                    var _producto = _productos[i];
                    var producto = ProductoPedidoFarmacia.get(_producto.codigo_producto, _producto.descripcion_producto).
                            setCantidadPendiente(_producto.cantidad_pendiente).
                            setTipoProductoId(_producto.tipo_producto_id).
                            setCantidadSolicitada(_producto.cantidad_solicitada);
                    
                    $scope.root.pedido.setTipoPedido(_producto.tipo_producto_id);
                    $scope.root.pedido.agregarProductoSeleccionado(producto);

                }*/
                
            };
            
            self.onTraerGrupos();
            
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                $scope.$$watchers = null;
                $scope.root = {};

            });

            
            
        }]);
});
