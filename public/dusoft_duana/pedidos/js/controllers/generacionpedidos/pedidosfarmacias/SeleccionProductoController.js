//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers", 'includes/slide/slideContent',
    'models/generarpedidos/ClientePedido', 'models/generarpedidos/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionProductoController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedidoFarmacia', 'FarmaciaPedido', 'PedidoFarmacia',
        'API', "socket", "AlertService",
        '$state', 'Usuario', 'ProductoPedidoFarmacia', '$modal',
        function($scope, $rootScope, Request,
                EmpresaPedidoFarmacia, FarmaciaPedido, PedidoFarmacia,
                API, socket, AlertService, $state, Usuario, ProductoPedidoFarmacia, $modal) {

            var self = this;
            $scope.expreg = new RegExp("^[0-9]*$");

            $scope.lista_productos = {
                data: 'rootSeleccionProductoFarmacia.pedido.obtenerProductos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: false,
                enableHighlighting: true,
                //selectedItems: $scope.selectedRow,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "10%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span ng-if="row.entity.getEnFarmaciaSeleccionada()" ng-cell-text >{{COL_FIELD}}</span>\
                                                <span ng-if="!row.entity.getEnFarmaciaSeleccionada()" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripción', width: "37%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span ng-if="row.entity.getEnFarmaciaSeleccionada()" ng-cell-text >{{COL_FIELD}}</span>\
                                                <span ng-if="!row.entity.getEnFarmaciaSeleccionada()" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
                                            </div>'
                    },
                    //{field: 'descripcion_molecula', displayName: 'Molécula'},
                    {field: 'existenciasFarmacia', displayName: 'Exist. Farmacia', width: "8%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.getEnFarmaciaSeleccionada()" ng-cell-text >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.getEnFarmaciaSeleccionada()" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'totalExistenciasFarmacias', displayName: 'Total Exist. Farmacia', width: "11%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.getEnFarmaciaSeleccionada()" ng-cell-text >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.getEnFarmaciaSeleccionada()" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'existencia', displayName: 'Exist. Bodega', width: "8%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.getEnFarmaciaSeleccionada()" ng-cell-text >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.getEnFarmaciaSeleccionada()" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'disponibilidadBodega', displayName: 'Disponible',
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                            <span ng-if="row.entity.getEnFarmaciaSeleccionada()" ng-cell-text >{{COL_FIELD}}</span>\
                                            <span ng-if="!row.entity.getEnFarmaciaSeleccionada()" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
                                        </div>'
                    },
                    {field: 'cantidadSolicitada', displayName: 'Solicitado', enableCellEdit: false, width: "10%",
                        cellTemplate: ' <div class="col-xs-12">\n\
                                                <input ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()" type="text" ng-model="row.entity.cantidadSolicitada" validacion-numero-entero class="form-control grid-inline-input"' +
                                'ng-keyup="onIngresarProducto($event, row.entity)"/>\n\
                                                <input ng-if="rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()" type="text" ng-model="row.entity.cantidadSolicitada" validacion-numero-entero class="form-control grid-inline-input"' +
                                'ng-keyup="onTeclaIngresaProductoEspecial($event, row)"/>\n\
                                            </div>'
                    },
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "6%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && row.entity.getEnFarmaciaSeleccionada() && row.entity.getEstado()==1" class="btn btn-default btn-xs" ng-click="onIngresarProducto({which:13},row.entity)" ' +
                                ' ng-disabled="row.entity.getCantidadSolicitada()<=0 || row.entity.getCantidadSolicitada()==null || !expreg.test(row.entity.getCantidadSolicitada())">\
                                                    <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
                                                </button>\
                                                <button ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && !row.entity.getEnFarmaciaSeleccionada() && row.entity.getEstado()==1" class="btn btn-default btn-xs" ng-click="" ' +
                                ' ng-disabled="true">\
                                                    <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
                                                </button>\
                                                <button ng-if="rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && row.entity.getEnFarmaciaSeleccionada() && row.entity.getEstado()==1" class="btn btn-default btn-xs" ng-click="onIncluirProductoEspecial(row)" ' +
                                ' ng-disabled="row.entity.getCantidadSolicitada()<=0 || row.entity.getCantidadSolicitada()==null || !expreg.test(row.entity.getCantidadSolicitada())">\
                                                    <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
                                                </button>\
                                                <button ng-if="rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && !row.entity.getEnFarmaciaSeleccionada() && row.entity.getEstado()==1" class="btn btn-default btn-xs" ng-click="" ' +
                                ' ng-disabled="true">\
                                                    <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
                                                </button>\
                                                <button ng-if="row.entity.getEstado()==0" class="btn btn-default btn-xs" ng-click="" ' +
                                ' ng-disabled="true">\
                                                    <span class="glyphicon glyphicon-plus-sign"> Bloqueado</span>\
                                                </button>\n\
                                            </div>'
                    }
                ]
            };

            /*
             * @Author: Eduar
             * +Descripcion: Metodo de inicializacion del controlador
             */
            self.init = function() {
                $scope.rootSeleccionProductoFarmacia = {};
                $scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
                $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                $scope.rootSeleccionProductoFarmacia.tipoProducto = "0";
                $scope.rootSeleccionProductoFarmacia.pedido;
                $scope.rootSeleccionProductoFarmacia.listaTiposProductos  = [];

                $scope.rootSeleccionProductoFarmacia.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

            };

            /*
             * @Author: Eduar
             * @param {object} _productos
             * +Descripcion: metodo que serializa el json del servidor a productos de tipo <ProductoPedidoFarmacia>
             */

            self.renderProductosFarmacia = function(_productos) {
                for (var i in _productos) {
                    var _producto = _productos[i];
                    var producto = ProductoPedidoFarmacia.get(_producto.codigo_producto, _producto.nombre_producto, _producto.existencia).
                            setExistenciasFarmacia(_producto.existencias_farmacia).
                            setTotalExistenciasFarmacias(_producto.total_existencias_farmacias).
                            setDisponibilidadBodega(_producto.disponibilidad_bodega).
                            setEstado(_producto.estado).setEnFarmaciaSeleccionada(_producto.en_farmacia_seleccionada).
                            setTipoProductoId(_producto.tipo_producto_id).
                            setCantidadSolicitada(_producto.cantidad_solicitada);

                    $scope.rootSeleccionProductoFarmacia.pedido.agregarProducto(producto);

                }

            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: metodo que hace la peticion para traer los productos de la empresa seleccionada en el pedido
             */
            self.buscarProductos = function(callback) {

                var obj = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        productos: {
                            termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda,
                            pagina_actual: $scope.rootSeleccionProductoFarmacia.paginaactual,
                            empresa_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaOrigen().getCodigo(),
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            empresa_destino_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_destino_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            tipo_producto: $scope.rootSeleccionProductoFarmacia.tipoProducto,
                            filtro: {}
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.LISTAR_PRODUCTOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        if (data.obj.lista_productos.length) {
                            
                            if(callback){
                                callback();
                            }
                            
                            self.renderProductosFarmacia(data.obj.lista_productos);
                        } else {
                            $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                        }
                    }

                });

            };
            
            /*
             * @Author: Eduar
             * +Descripcion: Lista los tipos de productos (Normales, Alto costo, Controlados, Insumos y Neveras)
             */
            
            self.listarTiposProductos = function(){
                var obj_tipo_producto = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        tipo_producto: {}
                    }
                };

                var url_tipo_producto = API.PEDIDOS.LISTADO_TIPO_PRODUCTOS;

                Request.realizarRequest(url_tipo_producto, "POST", obj_tipo_producto, function(data) {

                    if (data.status === 200) {
                         $scope.rootSeleccionProductoFarmacia.listaTiposProductos = data.obj.lista_tipo_productos;
                    }
                
                });
            }; 

            self.mostrarAlertaSeleccionProducto = function(titulo, mensaje) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">'+titulo+'</h4>\
                                    </div>\
                                    <div class="modal-body row">\
                                    <div class="col-md-12">\
                                    <h4>'+mensaje+'</h4>\
                                    </div>\
                                    </div>\
                                    <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                    </div>',
                                           scope: $scope,
                                           controller: function($scope, $modalInstance) {
                                               $scope.close = function() {
                                                   $modalInstance.close();
                                               };
                                           }
                                       };

                  var modalInstance = $modal.open($scope.opts);
            };
            
            
            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} producto
             * @return Object
             * +Descripcion: Function que valida el ingreso del producto (maximo de 25, un producto por codigo, solo un tipo por pedido  y que no este bloqueado)
             */
            
            self.validarIngresoProducto = function(producto, callback){
                console.log("producto a agregar ", producto);
                var pedido = $scope.rootSeleccionProductoFarmacia.pedido;
                
                if(pedido.esProductoSeleccionado(producto)){
                    
                    callback({msj:"El producto "+producto.getCodigoProducto()+ " ya esta seleccionado", valido:false});
                }
                
                if(pedido.getProductosSeleccionados().length === 25){
                    
                    callback({msj:"El pedido tiene 25 productos agregados", valido:false});
                }
                
                if(!pedido.validarTipoProductoAIngresar(producto)){
                    //var tipo = self.obtenerTipoProducto(producto);
                    
                    callback({msj:"El pedido solo puede contener productos del mismo tipo.", valido:false});
                }
                
                self.verificarBloqueoProducto(function(validacion){
                    callback(validacion);
                });

                
            };
            
            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Verifica si el producto no esta bloqueado por otro usuario
             */
            
            self.verificarBloqueoProducto = function(callback){
                var obj = {
                    session: $scope.rootSeleccionProductoFarmacia.session,
                    data: {
                        usuario_bloqueo: {                            
                            farmacia_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            codigo_producto: $scope.rootSeleccionProductoFarmacia.pedido.getProductoSeleccionado().getCodigoProducto()
                        }
                    }
                 };
             
                var url = API.PEDIDOS.FARMACIAS.BUSCAR_USUARIO_BLOQUEO;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if(data.status === 200){
                        
                        if(data.obj.datos_usuario.length > 0){
                            callback({msj:"El producto se encuentra bloqueado por el usuario "+ data.obj.datos_usuario[0].nombre, valido:false});
                        } else {
                            callback({msj:"", valido:true});
                        }
                    }

                });
            };
            
            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} producto
             * @return Object
             * +Descripcion: Obtiene la descripcion del tipo de producto pasado como argumento
             */
            self.obtenerTipoProducto = function(producto){
                var tipos =  $scope.rootSeleccionProductoFarmacia.listaTiposProductos;
                for(var i in tipos){
                    if(tipos[i].tipo_producto_id === producto.getTipoProductoId()){
                        return tipos[i];
                    }
                }
            };

            /*
             * @Author: Eduar
             * @param {$event} e
             * @param {Object} datos
             * +Descripcion: Evento que espera que el slide termine la animacion
             */
            $rootScope.$on("mostrarSeleccionProductoCompleto", function(e, datos) {
                self.init();
                $scope.rootSeleccionProductoFarmacia.pedido = datos[1];
                console.log("pedido ", $scope.pedido);
                self.listarTiposProductos();
                self.buscarProductos();
            });

            /*
             * @Author: Eduar
             * +Descripcion: Handler para cerrar el slide
             */
            $scope.cerrar = function() {
                $scope.$emit('cerrarSeleccionProducto', {animado: true});

                $scope.rootSeleccionProductoFarmacia = {};
            };

            /*
             * @Author: Eduar
             * @param {$event} event
             * +Descripcion: Handler para el campo de texto
             */
            $scope.onBuscarProductos = function(event) {

                if (event.which === 13) {
                    
                    $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                    self.buscarProductos(function(){
                        $scope.rootSeleccionProductoFarmacia.pedido.vaciarProductos();
                    });
                }
            };

            /*
             * @Author: Eduar
             * +Descripcion: Handler para traer pagina anterior
             */
            $scope.paginaAnterior = function() {
                if ($scope.rootSeleccionProductoFarmacia.paginaactual === 1) {
                    return;
                }
                $scope.rootSeleccionProductoFarmacia.paginaactual--;
                self.buscarProductos();
            };

            /*
             * @Author: Eduar
             * +Descripcion: Handler para traer pagina siguiente
             */
            $scope.paginaSiguiente = function() {
                $scope.rootSeleccionProductoFarmacia.paginaactual++;
                self.buscarProductos();
            };

            /*
             * @Author: Eduar
             * @param {$event} event
             * @param {ProductoPedidoFarmacia} producto
             * +Descripcion: Handler del text input de cantidad solicitada ubicado en la grid
             */

            $scope.onIngresarProducto = function(event, producto) {
                if (event.which === 13) {
                    if (parseInt(producto.getCantidadSolicitada()) > 0) {
                        var pedido = $scope.rootSeleccionProductoFarmacia.pedido;
                        
                        pedido.setProductoSeleccionado(angular.copy(producto));
                        
                        self.validarIngresoProducto(producto, function(validacion){
                            
                            if(validacion.valido){
                                $rootScope.$emit("insertarProductoPedidoTemporal", pedido);
                            } else {
                                self.mostrarAlertaSeleccionProducto("Error agregando producto",validacion.msj);
                            }
                        });
                        
 
                    }
                }
            };

            /*$scope.expreg = new RegExp("^[0-9]*$");
             
             var that = this;
             
             $scope.cerrar = function() {
             $scope.$emit('cerrarseleccionproducto', {animado: true});
             
             $scope.rootSeleccionProductoFarmacia = {};
             };
             
             $rootScope.$on("mostrarseleccionproducto", function(e, tipo_cliente, datos_de, datos_para, observacion, pedido) {
             
             
             console.log("tipo_cliente: ", tipo_cliente);
             console.log("datos_de: ", datos_de);
             console.log("datos_para: ", datos_para);
             console.log("observacion: ", observacion);
             console.log("pedido: ", pedido);
             
             $scope.rootSeleccionProductoFarmacia = {};
             
             //Variable Tipo Producto
             $scope.rootSeleccionProductoFarmacia.tipoProducto = '0';
             
             $scope.rootSeleccionProductoFarmacia.Empresa = EmpresaPedido;
             
             $scope.rootSeleccionProductoFarmacia.session = {
             usuario_id: Usuario.getUsuarioActual().getId(),
             auth_token: Usuario.getUsuarioActual().getToken()
             };
             
             $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
             
             $scope.rootSeleccionProductoFarmacia.tipo_cliente = tipo_cliente;
             
             $scope.rootSeleccionProductoFarmacia.items = 0;
             $scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
             //$scope.rootSeleccionProductoFarmacia.ultima_busqueda = "";
             $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
             
             $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {};
             $scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda = "";
             
             $scope.rootSeleccionProductoFarmacia.de_empresa_id = datos_de.empresa_id;
             $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id = datos_de.centro_utilidad_id;
             $scope.rootSeleccionProductoFarmacia.de_bodega_id = datos_de.bodega_id;
             
             $scope.rootSeleccionProductoFarmacia.para_empresa_id = datos_para.empresa_id;
             $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id = datos_para.centro_utilidad_id;
             $scope.rootSeleccionProductoFarmacia.para_bodega_id = datos_para.bodega_id;
             
             
             var obj_tipo_producto = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             tipo_producto: {}
             }
             }
             
             var url_tipo_producto = API.PEDIDOS.LISTADO_TIPO_PRODUCTOS;
             
             Request.realizarRequest(url_tipo_producto, "POST", obj_tipo_producto, function(data) {
             
             if (data.status === 200) {
             $scope.rootSeleccionProductoFarmacia.lista_tipo_productos = data.obj.lista_tipo_productos;
             }
             else {
             console.log("Error al consultar Tipo Productos", data.msj);
             }
             });
             
             
             $scope.rootSeleccionProductoFarmacia.listado_productos = [];
             //$scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = [];//Eliminar
             //$scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos
             
             $scope.rootSeleccionProductoFarmacia.observacion_encabezado = observacion;
             $scope.rootSeleccionProductoFarmacia.pedido = pedido;
             
             that.actualizarEncabezadoPedidoTemporal();
             
             $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), "");
             });
             
             $rootScope.$on("mostrarseleccionproductoEspecial", function(e, tipo_cliente, datos_de, Empresa) {
             
             $scope.rootSeleccionProductoFarmacia = {};
             
             //Variable Tipo Producto
             $scope.rootSeleccionProductoFarmacia.tipoProducto = '0';
             
             //$scope.rootSeleccionProductoFarmacia.Empresa = EmpresaPedido;
             $scope.rootSeleccionProductoFarmacia.Empresa = Empresa;
             
             console.log(">>> Empresa Slide: ", $scope.rootSeleccionProductoFarmacia.Empresa);
             
             $scope.rootSeleccionProductoFarmacia.session = {
             usuario_id: Usuario.getUsuarioActual().getId(),
             auth_token: Usuario.getUsuarioActual().getToken()
             };
             
             $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
             
             $scope.rootSeleccionProductoFarmacia.tipo_cliente = tipo_cliente;
             
             $scope.rootSeleccionProductoFarmacia.items = 0;
             $scope.rootSeleccionProductoFarmacia.termino_busqueda = "";
             //$scope.rootSeleccionProductoFarmacia.ultima_busqueda = "";
             $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
             
             $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {};
             $scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda = "";
             
             //                $scope.rootSeleccionProductoFarmacia.de_empresa_id = datos_de.empresa_id;
             //                $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id = datos_de.centro_utilidad_id;
             //                $scope.rootSeleccionProductoFarmacia.de_bodega_id = datos_de.bodega_id;
             //
             //                $scope.rootSeleccionProductoFarmacia.para_empresa_id = datos_para.empresa_id;
             //                $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id = datos_para.centro_utilidad_id;
             //                $scope.rootSeleccionProductoFarmacia.para_bodega_id = datos_para.bodega_id;
             
             $scope.rootSeleccionProductoFarmacia.de_empresa_id = datos_de.empresa_id;
             $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id = datos_de.centro_utilidad_id;
             $scope.rootSeleccionProductoFarmacia.de_bodega_id = datos_de.bodega_id;
             
             $scope.rootSeleccionProductoFarmacia.para_empresa_id = Empresa.getPedidoSeleccionado().farmacia.get_farmacia_id();
             $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id = Empresa.getPedidoSeleccionado().farmacia.centro_utilidad_id; //centro_utilidad_id
             $scope.rootSeleccionProductoFarmacia.para_bodega_id = Empresa.getPedidoSeleccionado().farmacia.bodega_id;        //bodega_id           
             
             
             var obj_tipo_producto = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             tipo_producto: {}
             }
             }
             
             var url_tipo_producto = API.PEDIDOS.LISTADO_TIPO_PRODUCTOS;
             
             Request.realizarRequest(url_tipo_producto, "POST", obj_tipo_producto, function(data) {
             
             if (data.status === 200) {
             $scope.rootSeleccionProductoFarmacia.lista_tipo_productos = data.obj.lista_tipo_productos;
             }
             else {
             console.log("Error al consultar Tipo Productos", data.msj);
             }
             });
             
             
             $scope.rootSeleccionProductoFarmacia.listado_productos = [];
             //$scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = [];//Eliminar
             //$scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos
             
             //--$scope.rootSeleccionProductoFarmacia.observacion_encabezado = observacion;
             //--$scope.rootSeleccionProductoFarmacia.pedido = pedido;
             
             //--that.actualizarEncabezadoPedidoTemporal();
             
             $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), "");
             });
             
             $scope.obtenerParametros = function() {
             
             //valida si cambio el termino de busqueda
             if ($scope.rootSeleccionProductoFarmacia.ultima_busqueda.termino_busqueda !== $scope.rootSeleccionProductoFarmacia.termino_busqueda) {
             $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
             }
             
             var obj = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             productos: {
             termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda,
             pagina_actual: $scope.rootSeleccionProductoFarmacia.paginaactual,
             empresa_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
             bodega_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
             empresa_destino_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
             centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
             bodega_destino_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
             tipo_producto: $scope.rootSeleccionProductoFarmacia.tipoProducto,
             filtro: {}
             }
             }
             };
             
             return obj;
             };
             
             $scope.onBuscarSeleccionProducto = function(obj, paginando) {
             
             var url = API.PEDIDOS.LISTAR_PRODUCTOS_FARMACIAS;
             
             //                console.log("Antes de listar Productos ... ");
             
             Request.realizarRequest(url, "POST", obj, function(data) {
             
             //                    console.log("Después de obtener Data ... ");
             //
             //                    console.log("Datos Listado Productos: ", data);
             
             if (data.status === 200) {
             
             $scope.rootSeleccionProductoFarmacia.ultima_busqueda = {
             termino_busqueda: $scope.rootSeleccionProductoFarmacia.termino_busqueda
             };
             
             that.renderProductosFarmacia(data.obj, paginando);
             }
             
             });
             
             that.renderGrid();
             };
             
             that.renderProductosFarmacia = function(data, paginando) {
             
             $scope.rootSeleccionProductoFarmacia.items = data.lista_productos.length;
             
             //se valida que hayan registros en una siguiente pagina
             if (paginando && $scope.rootSeleccionProductoFarmacia.items === 0) {
             if ($scope.rootSeleccionProductoFarmacia.paginaactual > 1) {
             $scope.rootSeleccionProductoFarmacia.paginaactual--;
             }
             AlertService.mostrarMensaje("warning", "No se encontraron más registros");
             return;
             }
             
             $scope.rootSeleccionProductoFarmacia.listado_productos = data.lista_productos;
             
             };
             
             
             
             that.renderGrid = function() {
             
             $scope.lista_productos = {
             data: 'rootSeleccionProductoFarmacia.listado_productos',
             enableColumnResize: true,
             enableRowSelection: false,
             enableCellSelection: false,
             enableHighlighting: true,
             //selectedItems: $scope.selectedRow,
             multiSelect: false,
             columnDefs: [
             {field: 'codigo_producto', displayName: 'Código', width: "10%",
             cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
             <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
             <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
             <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
             <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
             <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
             <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text >{{COL_FIELD}}</span>\
             <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
             </div>'
             },
             {field: 'nombre_producto', displayName: 'Descripción', width: "37%",
             cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
             <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text >{{COL_FIELD}}</span>\
             <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
             </div>'
             },
             //{field: 'descripcion_molecula', displayName: 'Molécula'},
             {field: 'existencias_farmacia', displayName: 'Exist. Farmacia', width: "8%",
             cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
             <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text >{{COL_FIELD}}</span>\
             <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
             </div>'
             },
             {field: 'total_existencias_farmacias', displayName: 'Total Exist. Farmacia', width: "11%",
             cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
             <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text >{{COL_FIELD}}</span>\
             <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
             </div>'
             },
             {field: 'existencia', displayName: 'Exist. Bodega', width: "8%",
             cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
             <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text >{{COL_FIELD}}</span>\
             <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
             </div>'
             },
             {field: 'disponibilidad_bodega', displayName: 'Disponible', 
             cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
             <span ng-if="row.entity.en_farmacia_seleccionada" ng-cell-text >{{COL_FIELD}}</span>\
             <span ng-if="!row.entity.en_farmacia_seleccionada" ng-cell-text class="texto-alerta" >{{COL_FIELD}}</span>\
             </div>'
             },
             {field: 'cantidad_solicitada', displayName: 'Solicitado', enableCellEdit: false, width: "10%",
             cellTemplate: ' <div class="col-xs-12">\n\
             <input ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()" type="text" ng-model="row.entity.cantidad_solicitada" validacion-numero-entero class="form-control grid-inline-input"'+
             'ng-keyup="onTeclaIngresaProducto($event, row)"/>\n\
             <input ng-if="rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()" type="text" ng-model="row.entity.cantidad_solicitada" validacion-numero-entero class="form-control grid-inline-input"'+
             'ng-keyup="onTeclaIngresaProductoEspecial($event, row)"/>\n\
             </div>'
             },
             
             {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "6%",
             cellTemplate: ' <div class="row">\
             <button ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && row.entity.en_farmacia_seleccionada && row.entity.estado==1" class="btn btn-default btn-xs" ng-click="onIncluirProducto(row)" '+
             ' ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null || !expreg.test(row.entity.cantidad_solicitada)">\
             <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
             </button>\
             <button ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && !row.entity.en_farmacia_seleccionada && row.entity.estado==1" class="btn btn-default btn-xs" ng-click="" '+
             ' ng-disabled="true">\
             <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
             </button>\
             <button ng-if="rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && row.entity.en_farmacia_seleccionada && row.entity.estado==1" class="btn btn-default btn-xs" ng-click="onIncluirProductoEspecial(row)" '+
             ' ng-disabled="row.entity.cantidad_solicitada<=0 || row.entity.cantidad_solicitada==null || !expreg.test(row.entity.cantidad_solicitada)">\
             <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
             </button>\
             <button ng-if="rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial() && !row.entity.en_farmacia_seleccionada && row.entity.estado==1" class="btn btn-default btn-xs" ng-click="" '+
             ' ng-disabled="true">\
             <span class="glyphicon glyphicon-plus-sign"> Incluir</span>\
             </button>\
             <button ng-if="row.entity.estado==0" class="btn btn-default btn-xs" ng-click="" '+
             ' ng-disabled="true">\
             <span class="glyphicon glyphicon-plus-sign"> Bloqueado</span>\
             </button>\n\
             </div>'
             }
             ]
             };
             
             $scope.lista_productos_seleccionados = {
             //data: 'rootSeleccionProductoFarmacia.listado_productos_seleccionados',
             data: 'rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos',
             enableColumnResize: true,
             enableRowSelection: false,
             enableHighlighting: true,
             multiSelect: false,
             columnDefs: [
             {field: 'codigo_producto', displayName: 'Código', width: "9%",
             cellTemplate : '<div class="ngCellText" ng-class="col.colIndex()">\
             <span class="label label-success" ng-show="row.entity.tipo_producto_id == 1" >N</span>\
             <span class="label label-danger" ng-show="row.entity.tipo_producto_id == 2">A</span>\
             <span class="label label-warning" ng-show="row.entity.tipo_producto_id == 3">C</span>\
             <span class="label label-primary" ng-show="row.entity.tipo_producto_id == 4">I</span>\
             <span class="label label-info" ng-show="row.entity.tipo_producto_id == 5">Ne</span>\
             <span ng-cell-text class="pull-right" >{{COL_FIELD}}</span>\
             </div>'
             },
             {field: 'descripcion', displayName: 'Descripción', width: "37%"},
             {field: 'cantidad_solicitada', displayName: 'Solicitado'},
             {field: 'cantidad_pendiente', displayName: 'Pendiente'},
             {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%",
             cellTemplate: ' <div class="row">\n\
             <button ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()" class="btn btn-default btn-xs" ng-click="onEliminarProductoPedidoTemporal(row)">\n\
             <span class="glyphicon glyphicon-remove"> Eliminar</span>\n\
             </button>\n\
             <button ng-if="rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()" class="btn btn-default btn-xs" ng-click="onEliminarSeleccionadoEspecial(row)">\n\
             <span class="glyphicon glyphicon-remove"> Eliminar</span>\n\
             </button>\n\
             </div>'
             }
             ]
             };
             };
             
             //Inserta producto presionando Botón
             $scope.onIncluirProducto = function(row) {
             that.insertarProducto(row);
             };
             
             //Nuevo para modificación Especial
             $scope.onIncluirProductoEspecial = function(row) {
             
             var numero_pedido = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().get_numero_pedido();
             
             that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){
             
             //$scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().setEnUso(data.obj.encabezado_pedido[0].en_uso);
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
             
             //console.log(">>>>>> Eliminar - Estado del Pedido: ", data.obj.encabezado_pedido[0].estado);
             
             if($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){ 
             
             that.insertarProductoEspecial(row);
             
             }
             else{
             //Avisar la no posibilidad de modificar porque el pedido está abierto en una tablet
             $scope.opts = {
             backdrop: true,
             backdropClick: true,
             dialogFade: false,
             keyboard: true,
             template: ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Aviso: </h4>\
             </div>\
             <div class="modal-body row">\
             <div class="col-md-12">\
             <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
             </div>\
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
             </div>',
             scope: $scope,
             controller: function($scope, $modalInstance) {
             $scope.close = function() {
             $modalInstance.close();
             };
             }
             };
             
             var modalInstance = $modal.open($scope.opts); 
             }
             });
             
             //--
             //that.insertarProductoEspecial(row);
             }
             
             //Inserta producto presionando ENTER
             $scope.onTeclaIngresaProducto = function(ev, row) {
             //                console.log("Key Evento: ", ev.which);
             if (ev.which === 13) {
             if (parseInt(row.entity.cantidad_solicitada) > 0) {
             that.insertarProducto(row);
             }
             }
             };
             
             //Nuevo para modificación Especial
             $scope.onTeclaIngresaProductoEspecial = function(ev, row) {
             
             if (ev.which === 13) {
             if (parseInt(row.entity.cantidad_solicitada) > 0) {
             
             var numero_pedido = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().get_numero_pedido();
             
             that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
             
             if($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){ 
             
             that.insertarProductoEspecial(row);
             
             }
             else{
             //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
             $scope.opts = {
             backdrop: true,
             backdropClick: true,
             dialogFade: false,
             keyboard: true,
             template: ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Aviso: </h4>\
             </div>\
             <div class="modal-body row">\
             <div class="col-md-12">\
             <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
             </div>\
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
             </div>',
             scope: $scope,
             controller: function($scope, $modalInstance) {
             $scope.close = function() {
             $modalInstance.close();
             };
             }
             };
             
             var modalInstance = $modal.open($scope.opts); 
             }
             });
             
             
             //--that.insertarProductoEspecial(row);
             }
             }
             };
             
             //Función que actualizar la observación si ya existe un encabezado
             that.actualizarEncabezadoPedidoTemporal = function() {
             
             var obj_encabezado = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             pedidos_farmacias: {
             empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
             bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
             empresa_destino_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
             centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
             bodega_destino_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
             observacion: $scope.rootSeleccionProductoFarmacia.observacion_encabezado
             }
             }
             };
             
             
             var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;
             
             Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {
             
             if (data.status === 200) {
             
             console.log(data.msj);
             
             if (data.obj.numero_registros[0].count > 0) {
             
             //Actualizar
             var url_actualizar_encabezado = API.PEDIDOS.ACTUALIZAR_ENCABEZADO_TEMPORAL_PEDIDO_FARMACIA;
             
             Request.realizarRequest(url_actualizar_encabezado, "POST", obj_encabezado, function(data_update) {
             
             if(data_update.status === 200) {
             
             console.log(data_update.msj);
             
             }
             else {
             console.log(data_update.msj);
             }
             });
             }
             else {
             console.log(">>>>> Encabezado Vacío");
             }
             }
             else {
             console.log(data.msj);
             }
             });
             
             };
             
             //Función que inserta el encabezado del pedido temporal
             that.insertarEncabezadoPedidoTemporal = function(callback) {
             
             var obj_encabezado = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             pedidos_farmacias: {
             empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
             bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
             empresa_destino_id: $scope.rootSeleccionProductoFarmacia.de_empresa_id,
             centro_utilidad_destino_id: $scope.rootSeleccionProductoFarmacia.de_centro_utilidad_id,
             bodega_destino_id: $scope.rootSeleccionProductoFarmacia.de_bodega_id,
             observacion: $scope.rootSeleccionProductoFarmacia.observacion_encabezado
             }
             }
             };
             
             
             var url_registros_encabezado = API.PEDIDOS.EXISTE_REGISTRO_PEDIDO_TEMPORAL;
             
             Request.realizarRequest(url_registros_encabezado, "POST", obj_encabezado, function(data) {
             
             if (data.status === 200) {
             //                        console.log("ENCABEZADO: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
             if (data.obj.numero_registros[0].count > 0) {
             
             console.log("Ya existe éste registro en el encabezado");
             if(callback !== undefined && callback !== "" && callback !== 0){
             callback(true);
             }
             }
             else {
             
             var url_encabezado = API.PEDIDOS.CREAR_PEDIDO_TEMPORAL;
             
             Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {
             
             if (data.status === 200) {
             console.log("Registro Insertado Exitosamente en Encabezado");
             
             if(callback !== undefined && callback !== "" && callback !== 0){
             callback(true);
             }
             }
             else {
             console.log(data.msj);
             if(callback !== undefined && callback !== "" && callback !== 0){
             callback(false);
             }
             }
             });
             }
             }
             else {
             console.log(data.msj);
             if(callback !== undefined && callback !== "" && callback !== 0){
             callback(false);
             }
             }
             });
             };
             
             //NUEVO ************************************ NUEVO *******************
             that.insertarDetallePedidoDefinitivo = function(row) {
             
             //Cálculo de cantidad pendiente
             var cantidad_pendiente = row.entity.cantidad_solicitada - row.entity.disponibilidad_bodega;
             
             var obj_detalle = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             detalle_pedidos_farmacias: {
             numero_pedido: $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().get_numero_pedido(),
             empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
             bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
             codigo_producto: row.entity.codigo_producto,
             cantidad_solic: parseInt(row.entity.cantidad_solicitada),
             tipo_producto_id: row.entity.tipo_producto_id,
             cantidad_pendiente: parseInt(row.entity.cantidad_solicitada)//(cantidad_pendiente < 0) ? '0' : cantidad_pendiente
             }
             }
             };
             
             
             var url_registros_detalle = API.PEDIDOS.EXISTE_REGISTRO_DETALLE_PEDIDO;
             
             Request.realizarRequest(url_registros_detalle, "POST", obj_detalle, function(data) {
             
             if (data.status === 200) {
             //                        console.log("DETALLE: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
             if (data.obj.resultado_consulta[0].cantidad_registros > 0) {
             
             console.log("Ya existe éste producto en el detalle");
             }
             else {
             
             //                            console.log("Ingresando el detalle");
             
             
             var producto = ProductoPedido.get(
             row.entity.codigo_producto,        //codigo_producto
             row.entity.nombre_producto,            //descripcion
             0,                               //existencia **hasta aquí heredado
             0,                               //precio
             row.entity.cantidad_solicitada,    //cantidad_solicitada
             0,                               //cantidad_separada
             "",                              //observacion
             "",                              //disponible
             "",                              //molecula
             "",                              //existencia_farmacia
             row.entity.tipo_producto_id,          //tipo_producto_id
             "",                              //total_existencias_farmacia
             "",                              //existencia_disponible
             (cantidad_pendiente < 0) ? '0' : cantidad_pendiente      //cantidad_pendiente
             );
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
             
             var longitud_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length;
             
             var test_index = 0;
             
             if (longitud_seleccionados > 1) {
             test_index = 1;
             }
             else {
             test_index = 0;
             }
             
             if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id !== row.entity.tipo_producto_id) {
             
             var descripcion_tipo_anterior = "";
             var descripcion_tipo_actual = "";
             
             $scope.rootSeleccionProductoFarmacia.lista_tipo_productos.forEach(function(tipo_producto) {
             
             if (tipo_producto.tipo_producto_id === $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id) {
             descripcion_tipo_anterior = tipo_producto.descripcion;
             }
             if (tipo_producto.tipo_producto_id === row.entity.tipo_producto_id) {
             descripcion_tipo_actual = tipo_producto.descripcion;
             }
             });
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>No se puede incluir un producto de ' + descripcion_tipo_actual + ' en un pedido de ' + descripcion_tipo_anterior + ' </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);
             
             } 
             else {
             
             //if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length === 25) {
             if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 25) {
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>Usted ha llegado a los 25 productos para éste Pedido ! </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             
             }
             
             
             $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos;
             $scope.$emit('cargarGridPrincipal', 1);
             
             
             var url_detalle = API.PEDIDOS.INSERTAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA;
             
             Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {
             
             if (data.status === 200) {
             console.log("Registro Insertado Exitosamente en Detalle: ", data.msj);
             
             //Restar Valor de disponibilidad para que se refleje automáticamente en la grid
             row.entity.disponibilidad_bodega -= row.entity.cantidad_solicitada;
             
             }
             else {
             console.log("No se pudo Incluir éste produto: ",data.msj);
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);
             
             var obj_bloqueo = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             usuario_bloqueo: {
             farmacia_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim(),
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim(),
             codigo_producto: row.entity.codigo_producto.trim()
             }
             }
             };
             
             var url_bloqueo = API.PEDIDOS.BUSCAR_USUARIO_BLOQUEO;
             
             Request.realizarRequest(url_bloqueo, "POST", obj_bloqueo, function(data) {
             
             if (data.status === 200) {
             
             console.log("Consulta de usuario bloqueante exitosa: ", data.msj);
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por el usuario '+
             '('+data.obj.datos_usuario[0].usuario_id+') '+data.obj.datos_usuario[0].nombre+' </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             
             }
             else {
             console.log("Consulta de usuario bloqueante fallida: ", data.msj);
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por otro usuario </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             }
             });
             
             }
             
             });
             } 
             }
             }
             else {
             console.log(data.msj);
             }
             });
             };
             
             that.insertarDetallePedidoTemporal = function(row) {
             //Cálculo de cantidad pendiente
             var cantidad_pendiente = row.entity.cantidad_solicitada - row.entity.disponibilidad_bodega;
             
             var obj_detalle = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             detalle_pedidos_farmacias: {
             numero_pedido: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim() + $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim() + row.entity.codigo_producto.trim(),
             empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
             bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
             codigo_producto: row.entity.codigo_producto,
             cantidad_solic: parseInt(row.entity.cantidad_solicitada),
             tipo_producto_id: row.entity.tipo_producto_id,
             cantidad_pendiente: (cantidad_pendiente < 0) ? '0' : cantidad_pendiente
             }
             }
             };
             
             
             var url_registros_detalle = API.PEDIDOS.EXISTE_REGISTRO_DETALLE_PEDIDO_TEMPORAL;
             
             Request.realizarRequest(url_registros_detalle, "POST", obj_detalle, function(data) {
             
             if (data.status === 200) {
             //                        console.log("DETALLE: data.obj.numero_registros[0].count = ", data.obj.numero_registros[0].count)
             if (data.obj.numero_registros[0].count > 0) {
             
             console.log("Ya existe éste producto en el detalle");
             }
             else {
             
             //                            console.log("Ingresando el detalle");
             
             
             var producto = ProductoPedido.get(
             row.entity.codigo_producto,        //codigo_producto
             row.entity.nombre_producto,            //descripcion
             0,                               //existencia **hasta aquí heredado
             0,                               //precio
             row.entity.cantidad_solicitada,    //cantidad_solicitada
             0,                               //cantidad_separada
             "",                              //observacion
             "",                              //disponible
             "",                              //molecula
             "",                              //existencia_farmacia
             row.entity.tipo_producto_id,          //tipo_producto_id
             "",                              //total_existencias_farmacia
             "",                              //existencia_disponible
             (cantidad_pendiente < 0) ? '0' : cantidad_pendiente      //cantidad_pendiente
             );
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().agregarProducto(producto);
             
             var longitud_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length;
             
             var test_index = 0;
             
             if (longitud_seleccionados > 1) {
             test_index = 1;
             }
             else {
             test_index = 0;
             }
             
             if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id !== row.entity.tipo_producto_id) {
             
             var descripcion_tipo_anterior = "";
             var descripcion_tipo_actual = "";
             
             $scope.rootSeleccionProductoFarmacia.lista_tipo_productos.forEach(function(tipo_producto) {
             
             if (tipo_producto.tipo_producto_id === $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos[test_index].tipo_producto_id) {
             descripcion_tipo_anterior = tipo_producto.descripcion;
             }
             if (tipo_producto.tipo_producto_id === row.entity.tipo_producto_id) {
             descripcion_tipo_actual = tipo_producto.descripcion;
             }
             });
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>No se puede incluir un producto de ' + descripcion_tipo_actual + ' en un pedido de ' + descripcion_tipo_anterior + ' </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);
             
             } 
             else { 
             
             //if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length === 25) {
             if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 25) {
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>Usted ha llegado a los 25 productos para éste Pedido ! </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             
             }
             
             
             
             $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos;
             $scope.$emit('cargarGridPrincipal', 1);
             
             
             var url_detalle = API.PEDIDOS.CREAR_DETALLE_PEDIDO_TEMPORAL;
             
             Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {
             
             if (data.status === 200) {
             console.log("Registro Insertado Exitosamente en Detalle: ", data.msj);
             
             //Restar Valor de disponibilidad para que se refleje automáticamente en la grid
             row.entity.disponibilidad_bodega -= row.entity.cantidad_solicitada;
             }
             else {
             console.log("No se pudo Incluir éste produto: ",data.msj);
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.splice(0, 1);
             
             var obj_bloqueo = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             usuario_bloqueo: {
             farmacia_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id.trim(),
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id.trim(),
             codigo_producto: row.entity.codigo_producto.trim()
             }
             }
             };
             
             var url_bloqueo = API.PEDIDOS.BUSCAR_USUARIO_BLOQUEO;
             
             Request.realizarRequest(url_bloqueo, "POST", obj_bloqueo, function(data) {
             
             if (data.status === 200) {
             
             console.log("Consulta de usuario bloqueante exitosa: ", data.msj);
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por el usuario '+
             '('+data.obj.datos_usuario[0].usuario_id+') '+data.obj.datos_usuario[0].nombre+' </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             
             }
             else {
             console.log("Consulta de usuario bloqueante fallida: ", data.msj);
             
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>El producto con código '+row.entity.codigo_producto+' está bloqueado por otro usuario </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             }
             });
             
             }
             
             });
             
             }
             }
             else {
             console.log(data.msj);
             }
             });
             };
             
             //Ejecuta operaciones conjuntas de Inserción del producto en pedido temporal
             that.insertarProducto = function(row) {
             
             $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.forEach(function(valor) {
             if (valor.codigo_producto === row.entity.codigo_producto) {
             $scope.rootSeleccionProductoFarmacia.no_incluir_producto = true;
             return;
             }
             });
             
             if ($scope.rootSeleccionProductoFarmacia.no_incluir_producto === false)
             {
             that.insertarEncabezadoPedidoTemporal(function(insert_encabezado_exitoso) {
             
             if(insert_encabezado_exitoso) {
             that.insertarDetallePedidoTemporal(row);
             } 
             });
             }
             };
             
             that.insertarProductoEspecial = function(row) {
             
             $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.forEach(function(valor) {
             if (valor.codigo_producto === row.entity.codigo_producto) {
             $scope.rootSeleccionProductoFarmacia.no_incluir_producto = true;
             return;
             }
             });
             
             if ($scope.rootSeleccionProductoFarmacia.no_incluir_producto === false)
             {    
             that.insertarDetallePedidoDefinitivo(row);
             }
             };
             
             $scope.onEliminarProductoPedidoTemporal = function(row){
             
             var template = '<div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>Seguro desea eliminar el producto código '+ row.entity.codigo_producto +' ? </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">No</button>\
             <button class="btn btn-primary" ng-click="eliminarProductoPedidoTemporal()">Si</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
             $scope.eliminarProductoPedidoTemporal = function() {
             
             that.onEliminarSeleccionado(row);
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
             
             }
             
             that.onEliminarSeleccionado = function(row) {
             
             $scope.rootSeleccionProductoFarmacia.no_incluir_producto = false;
             
             var codigo_producto = row.entity.codigo_producto;
             var cantidad_solicitada = row.entity.cantidad_solicitada;
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().eliminarProducto(row.rowIndex);
             //$scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.splice(row.rowIndex, 1);
             
             //$scope.rootSeleccionProductoFarmacia.pedido.eliminarProducto(row.rowIndex);
             
             $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos;
             //
             $scope.$emit('cargarGridPrincipal', 1);
             
             var obj_detalle = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             detalle_pedidos_farmacias: {
             empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
             bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
             codigo_producto: row.entity.codigo_producto,
             }
             }
             };
             
             
             var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_REGISTRO_DETALLE_PEDIDO_TEMPORAL;
             
             Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {
             
             if (data.status == 200) {
             console.log("Eliminación de detalle Exitosa: ", data.msj);
             
             //adicionar lo eliminado de éste código a la disponibilidad en la lista de productos
             $scope.rootSeleccionProductoFarmacia.listado_productos.forEach(function(producto){
             
             if(producto.codigo_producto === codigo_producto) {
             producto.disponibilidad_bodega = parseInt(producto.disponibilidad_bodega) + parseInt(cantidad_solicitada);
             console.log("Disponibilidad Bodega: ", producto.disponibilidad_bodega);
             }
             });
             
             //console.log("Longitud de Productos Seleccionados en Grid: ", $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_producto.length);
             //console.log("Longitud Grid Seleccionados", $scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length);
             
             //if ($scope.rootSeleccionProductoFarmacia.listado_productos_seleccionados.length === 0)
             if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().lista_productos.length === 0)
             {
             var obj_encabezado = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             pedidos_farmacias: {
             empresa_id: $scope.rootSeleccionProductoFarmacia.para_empresa_id,
             centro_utilidad_id: $scope.rootSeleccionProductoFarmacia.para_centro_utilidad_id,
             bodega_id: $scope.rootSeleccionProductoFarmacia.para_bodega_id,
             }
             }
             };
             var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;
             
             Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {
             
             if (data.status == 200) {
             console.log("Eliminación de encabezado Exitosa: ", data.msj);
             }
             else
             {
             console.log("Eliminación de encabezado Fallida: ", data.msj);
             }
             });
             
             }
             }
             else
             {
             console.log("Eliminación Detalle Fallida: ", data.msj);
             }
             });
             
             };
             
             //onEliminarSeleccionadoEspecial
             //******************** NUEVO ******************** NUEVO **********************
             $scope.onEliminarSeleccionadoEspecial = function(row) {
             
             var numero_pedido = $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().get_numero_pedido();
             
             that.consultarEncabezadoPedidoFinal(numero_pedido, function(data){
             
             //$scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().setEnUso(data.obj.encabezado_pedido[0].en_uso);
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido = data.obj.encabezado_pedido[0].estado;
             
             //console.log(">>>>>> Eliminar - Estado del Pedido: ", data.obj.encabezado_pedido[0].estado);
             
             if($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().estado_actual_pedido === '0'){ 
             
             var template = '<div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>Seguro desea eliminar el producto '+row.entity.codigo_producto+' ? </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">No</button>\
             <button class="btn btn-primary" ng-click="eliminarProducto()" ng-disabled="" >Si</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
             $scope.eliminarProducto = function() {
             //that.verificarEstadoPedido(function(){
             that.eliminarProductoPedido(
             numero_pedido,
             row.entity,
             row.rowIndex
             );
             //});
             
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
             }
             else{
             //Avisar la no posibilidad de modiificar porque el pedido está abierto en una tablet
             $scope.opts = {
             backdrop: true,
             backdropClick: true,
             dialogFade: false,
             keyboard: true,
             template: ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Aviso: </h4>\
             </div>\
             <div class="modal-body row">\
             <div class="col-md-12">\
             <h4 >El Pedido '+numero_pedido+' ha sido asignado. No puede modificarse!</h4>\
             </div>\
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
             </div>',
             scope: $scope,
             controller: function($scope, $modalInstance) {
             $scope.close = function() {
             $modalInstance.close();
             };
             }
             };
             
             var modalInstance = $modal.open($scope.opts); 
             }
             });
             };
             
             that.eliminarProductoPedido = function(numero_pedido, data, index){
             
             if ($scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().obtenerProductos().length === 1) {
             
             //--$scope.rootSeleccionProductoFarmacia.bloquear_eliminar = true;
             //Mensaje: Solo queda un producto. La cotización debe tener al menos un producto. No puede eliminar éste.
             var template = ' <div class="modal-header">\
             <button type="button" class="close" ng-click="close()">&times;</button>\
             <h4 class="modal-title">Mensaje del Sistema</h4>\
             </div>\
             <div class="modal-body">\
             <h4>Solo queda un producto en el detalle y debe haber al menos uno. <br>No puede eliminar más productos. </h4> \
             </div>\
             <div class="modal-footer">\
             <button class="btn btn-warning" ng-click="close()">Aceptar</button>\
             </div>';
             
             controller = function($scope, $modalInstance) {
             
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
             }
             else {
             obj_eliminar = {
             session:$scope.rootSeleccionProductoFarmacia.session,
             data:{
             pedidos_farmacias:{
             numero_pedido: parseInt(numero_pedido),
             codigo_producto: data.codigo_producto
             }
             }
             };
             
             var url = API.PEDIDOS.ELIMINAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA;
             
             Request.realizarRequest(url, "POST", obj_eliminar, function(datadb) {
             
             if(datadb.status === 200) {
             console.log("Eliminación Exitosa: ", datadb.msj);
             
             //adicionar lo eliminado de éste código a la disponibilidad en la lista de productos
             $scope.rootSeleccionProductoFarmacia.listado_productos.forEach(function(producto){
             
             if(producto.codigo_producto === data.codigo_producto) {
             producto.disponibilidad_bodega = parseInt(producto.disponibilidad_bodega) + parseInt(data.cantidad_solicitada);
             console.log("Disponibilidad Bodega: ", producto.disponibilidad_bodega);
             }
             });
             
             $scope.rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().eliminarProducto(index);
             }
             else {
             console.log("Eliminación Falló: ", datadb.msj);
             }
             });
             
             }
             };
             
             that.consultarEncabezadoPedidoFinal = function(numero_pedido, callback){
             
             var obj = {
             session: $scope.rootSeleccionProductoFarmacia.session,
             data: {
             pedidos_farmacias: {
             numero_pedido: numero_pedido,
             }
             }
             };
             
             var url = API.PEDIDOS.CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA;
             
             Request.realizarRequest(url, "POST", obj, function(data) {
             
             if(data.status === 200) {
             
             console.log("Consulta exitosa: ", data.msj);
             
             if(callback !== undefined && callback !== "" && callback !== 0){
             callback(data);
             }
             }
             else{
             console.log("Error en la consulta: ", data.msj);
             }
             });
             };
             
             
             //Método para liberar Memoria de todo lo construido en ésta clase
             $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
             
             //Este evento no funciona para los Slides, asi que toca liberar memoria con el emit al cerrar el slide
             //Las siguientes lineas son efectivas si se usa la view sin el slide
             
             $scope.rootSeleccionProductoFarmacia = {};
             
             });
             
             //eventos de widgets
             
             
             $scope.paginaAnterior = function() {
             $scope.rootSeleccionProductoFarmacia.paginaactual--;
             $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), true);
             };
             
             $scope.paginaSiguiente = function() {
             $scope.rootSeleccionProductoFarmacia.paginaactual++;
             $scope.onBuscarSeleccionProducto($scope.obtenerParametros(), true);
             };*/


        }]);
});
