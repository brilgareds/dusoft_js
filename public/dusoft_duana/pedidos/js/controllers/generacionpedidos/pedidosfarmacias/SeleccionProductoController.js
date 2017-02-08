//Controlador de la View seleccionproducto.html asociado a Slide en cotizacioncliente.html y creapedidosfarmacias.html

define(["angular", "js/controllers", 'includes/slide/slideContent'], function(angular, controllers) {

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
                data: 'root.pedido.obtenerProductos()',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: false,
                enableHighlighting: true,
                multiSelect: false,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Código', width: "10%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span ng-cell-text >{{COL_FIELD}}</span>\
                                            </div>'
                    },
                    {field: 'nombreBodega', displayName: 'Bodega', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                    {field: 'existenciasFarmacia', displayName: 'Exist. Farmacia', width: "8%"},
                    {field: 'totalExistenciasFarmacias', displayName: 'Total Exist. Farmacia', width: "11%"},
                    {field: 'existencia', displayName: 'Exist. Bodega', width: "8%"},
                    {field: 'disponibilidadBodega', displayName: 'Disponible'},
                    {field: 'cantidadSolicitada', displayName: 'Solicitado', enableCellEdit: false, width: "10%",
                        cellTemplate: ' <div class="col-xs-12">\n\
                                                <input ng-if="!rootSeleccionProductoFarmacia.Empresa.getPedidoSeleccionado().getModificacionEspecial()" type="text" ng-model="row.entity.cantidadSolicitada" validacion-numero-entero class="form-control grid-inline-input"\
                                ng-keyup="onIngresarProducto($event, row.entity)" ng-disabled="!row.entity.getEnFarmaciaSeleccionada()"/>\
                                            </div>'
                    },
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "6%",
                        cellTemplate: ' <div class="row">\
                                                <button ng-if="row.entity.getEnFarmaciaSeleccionada()" class="btn btn-default btn-xs" ng-click="onIngresarProducto({which:13},row.entity)" ' +
                                ' ng-disabled="row.entity.getCantidadSolicitada()<=0 || row.entity.getCantidadSolicitada()==null || !expreg.test(row.entity.getCantidadSolicitada())  ">\
                                                    <span class="glyphicon glyphicon-ok"></span>\
                                                </button>\
                                                <button ng-if="!row.entity.getEnFarmaciaSeleccionada()" ng-click="mostrarAlertaProducto()" class="btn btn-default btn-xs" >\
                                                    <span class="glyphicon glyphicon-lock"></span>\
                                                </button>\
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
                $scope.root.pedido;

                $scope.rootSeleccionProductoFarmacia.filtros = [
                    {nombre: "Descripcion", tipo_busqueda: 0},
                    {nombre: "Molecula", tipo_busqueda: 1},
                    {nombre: "Codigo", tipo_busqueda: 2}
                ];                           

                $scope.rootSeleccionProductoFarmacia.filtro = $scope.rootSeleccionProductoFarmacia.filtros[0];

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
                            setCantidadSolicitada(_producto.cantidad_solicitada).
                            setNombreBodega(_producto.nombre_bodega).
                            setEmpresaOrigenProducto(_producto.empresa_id).
                            setCentroUtilidadOrigenProducto(_producto.centro_utilidad).
                            setBodegaOrigenProducto(_producto.bodega);
                    $scope.root.pedido.agregarProducto(producto);

                }

            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: metodo que hace la peticion para traer los productos de la empresa seleccionada en el pedido
             */
            self.buscarProductos = function(callback) {

                $scope.rootSeleccionProductoFarmacia.filtro.termino_busqueda = $scope.rootSeleccionProductoFarmacia.termino_busqueda;
                $scope.rootSeleccionProductoFarmacia.filtro.tipo_producto = $scope.rootSeleccionProductoFarmacia.tipoProducto;

                var empresa_id='0';
                var centro_utilidad_id='0';
                var bodega_id='0';
                if(!$scope.root.bodegaMultiple.bools){
                 empresa_id=$scope.root.pedido.getFarmaciaOrigen().getCodigo()!==undefined?$scope.root.pedido.getFarmaciaOrigen().getCodigo():0;
                 centro_utilidad_id=$scope.root.pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getCodigo()!==undefined?$scope.root.pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getCodigo():0;
                 bodega_id=$scope.root.pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo()!==undefined?$scope.root.pedido.getFarmaciaOrigen().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo():0;
                }

                var obj = {
                    session: $scope.root.session,
                    data: {
                        productos: {
                            pagina_actual: $scope.rootSeleccionProductoFarmacia.paginaactual,
                            empresa_id: empresa_id,
                            centro_utilidad_id: centro_utilidad_id,
                            bodega_id: bodega_id,
                            empresa_destino_id: $scope.root.pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_destino_id: $scope.root.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            bodega_destino_id: $scope.root.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            filtro: $scope.rootSeleccionProductoFarmacia.filtro,
                            multibodega: $scope.root.bodegaMultiple.bools
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.LISTAR_PRODUCTOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    if (data.status === 200) {
                        if (data.obj.lista_productos.length) {

                            if (callback) {
                                callback();
                            }
                            $scope.root.pedido.vaciarProductos();
                            self.renderProductosFarmacia(data.obj.lista_productos);
                        } else {
                            $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                        }
                    }

                });

            };


            /*
             * @Author: Eduar
             * @param {String} titulo
             * @param {String} mensaje
             * +Descripcion: Mensaje de alerta
             */
            self.mostrarAlertaSeleccionProducto = function(titulo, mensaje) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    keyboard: true,
                    template: ' <div class="modal-header">\
                                    <button type="button" class="close" ng-click="close()">&times;</button>\
                                    <h4 class="modal-title">' + titulo + '</h4>\
                                    </div>\
                                    <div class="modal-body row">\
                                    <div class="col-md-12">\
                                    <h4>' + mensaje + '</h4>\
                                    </div>\
                                    </div>\
                                    <div class="modal-footer">\
                                    <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Aceptar</button>\
                                    </div>',
                    scope: $scope,
                    controller: ["$scope", "$modalInstance", function($scope, $modalInstance) {
                        $scope.close = function() {
                            $modalInstance.close();
                        };
                    }]
                };

                var modalInstance = $modal.open($scope.opts);
            };


            /*
             * @Author: Eduar
             * @param {ProductoPedidoFarmacia} producto
             * @return Object
             * +Descripcion: Function que valida el ingreso del producto (maximo de 50, un producto por codigo, solo un tipo por pedido  y que no este bloqueado)
             */

            self.validarIngresoProducto = function(producto, callback) {
                var pedido = $scope.root.pedido;
console.log("comparar temporal ",pedido);
console.log("comparar producto ",producto);

                if (pedido.esProductoSeleccionado(producto)) {

                    callback({msj: "El producto " + producto.getCodigoProducto() + " ya esta seleccionado", valido: false});
                    return;
                }

                if (pedido.getProductosSeleccionados().length === 50) {

                    callback({msj: "El pedido tiene 50 productos agregados", valido: false});
                    return;
                }

                if (!pedido.validarTipoProductoAIngresar(producto)) {
                    //var tipo = self.obtenerTipoProducto(producto);

                    callback({msj: "El pedido solo puede contener productos del mismo tipo.", valido: false});
                    return;
                }

                self.verificarBloqueoProducto(function(validacion) {
                    callback(validacion);
                });


            };

            /*
             * @Author: Eduar
             * @param {function} callback
             * +Descripcion: Verifica si el producto no esta bloqueado por otro usuario
             */
            
            self.verificarBloqueoProducto = function(callback) {
                var obj = {
                    session: $scope.root.session,
                    data: {
                        usuario_bloqueo: {
                            farmacia_id: $scope.root.pedido.getFarmaciaDestino().getCodigo(),
                            centro_utilidad_id: $scope.root.pedido.getFarmaciaDestino().getCentroUtilidadSeleccionado().getCodigo(),
                            codigo_producto: $scope.root.pedido.getProductoSeleccionado().getCodigoProducto(),
                            empresaOrigenProducto: $scope.root.pedido.getProductoSeleccionado().getEmpresaOrigenProducto(),
                            centroUtilidadOrigenProducto: $scope.root.pedido.getProductoSeleccionado().getCentroUtilidadOrigenProducto(),
                            bodegaOrigenProducto: $scope.root.pedido.getProductoSeleccionado().getBodegaOrigenProducto()
                        }
                    }
                };

                var url = API.PEDIDOS.FARMACIAS.BUSCAR_USUARIO_BLOQUEO;

                Request.realizarRequest(url, "POST", obj, function(data) {

                    if (data.status === 200) {

                        if (data.obj.datos_usuario.length > 0) {
                            callback({msj: "El producto se encuentra bloqueado por el usuario " + data.obj.datos_usuario[0].nombre, valido: false});
                        } else {
                            callback({msj: "", valido: true});
                        }
                    }

                });
            };

            /*
             * @Author: Eduar
             * @param {Object} filtro
             * +Descripcion: Handler del dropdown de filtros
             */
            $scope.onSeleccionFiltro = function(filtro) {
                $scope.rootSeleccionProductoFarmacia.filtro = filtro;
            };

            $scope.mostrarAlertaProducto = function() {
                self.mostrarAlertaSeleccionProducto("Error agregando producto", "El producto esta bloqueado o no se encuentra en la farmacia destino");
            };

            /*
             * @Author: Eduar
             * @param {$event} e
             * @param {Object} datos
             * +Descripcion: Evento que espera que el slide termine la animacion
             */
            $scope.root.mostrarSeleccionProductoCompleto = $scope.$on("seleccionProductoCompleto", function(e, datos) {
                self.init();
                self.buscarProductos();
            });

            /*
             * @Author: Eduar
             * +Descripcion: Handler para cerrar el slide
             */
            $scope.cerrar = function() {
                $scope.$emit('cerrarSeleccionProducto', {animado: true});
                $scope.$$watchers = null;
                $scope.rootSeleccionProductoFarmacia = {};
                console.log("slide de productos cerrado", $scope);
            };

            /*
             * @Author: Eduar
             * @param {$event} event
             * +Descripcion: Handler para el campo de texto
             */
            $scope.onBuscarProductos = function(event) {

                if (event.which === 13) {

                    $scope.rootSeleccionProductoFarmacia.paginaactual = 1;
                    self.buscarProductos(function() {
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
                //validación para verificar la disponibilidad.
            if (parseInt(producto.getCantidadSolicitada()) > parseInt(producto.getDisponibilidadBodega())) {
                self.mostrarAlertaSeleccionProducto("Diponibilidad del Producto", "LA CANTIDAD INGRESADA " + producto.getCantidadSolicitada() + " ES MAYOR A LA DISPONIBLE " + producto.getDisponibilidadBodega());
                producto.setCantidadSolicitada('');
            }
                if (event.which === 13) {
                    if (parseInt(producto.getCantidadSolicitada()) > 0) {
                        var pedido = $scope.root.pedido;

                        pedido.setProductoSeleccionado(angular.copy(producto));

                        self.validarIngresoProducto(producto, function(validacion) {
                          console.log("validacion.valido ",validacion.valido);
                          console.log("validacion.valido ",producto);
                            if (validacion.valido) {
                                console.log("validacion.valido ",validacion.valido);
                                if (pedido.get_numero_pedido()) {
                                    $scope.$emit("insertarProductoPedido", pedido);
                                } else {
                                    $scope.$emit("insertarProductoPedidoTemporal", pedido);
                                }

                            } else {
                                self.mostrarAlertaSeleccionProducto("Error agregando producto", validacion.msj);
                            }
                        });


                    }
                }
            };

        }]);
});
