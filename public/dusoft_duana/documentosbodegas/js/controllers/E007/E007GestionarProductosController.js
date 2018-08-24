
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('E007GestionarProductosController', [
        '$scope', '$rootScope', 'Request', "E007Service",
        '$modal', '$modalInstance', 'API', "socket", "$timeout", "$filter", "Usuario",
        "AlertService", "$state", "ProductoE007", 'Empresa', 'DocTmp',
        function ($scope, $rootScope, Request, E007Service, $modal, $modalInstance, API, socket, $timeout, $filter, Sesion,
                AlertService, $state, Producto, Empresa, DocTmp) {

            var that = this;
            $scope.parametros = '';
            $scope.paginaactual = 1;
            $scope.tipoProducto;
            $scope.root = {
                termino_busqueda: '',
                cantidad_consulta: 0
            };

            $scope.datos_form = {
                listado_productos: []
            };

            $scope.onCerrar = function () {
                $modalInstance.close(null);
            };

            $scope.filtroNombre = {nombre: "Descripcion", id: '0'};

            $scope.onSeleccionFiltro = function (filtro) {
                $scope.filtroNombre.nombre = filtro.nombre;
                $scope.filtroNombre.id = filtro.id;
            };

            $scope.filtros = [
                {nombre: "Descripcion", id: '0'},
                {nombre: "Codigo", id: '1'},
                {nombre: "Molecula", id: '2'}
            ];

            /**
             * @author German Galvis
             * @fecha 22/05/2018
             * +Descripcion Metodo encargado de invocar el servicio que
             *              listara los productos para trasladar
             *  @parametros ($event = eventos del teclado)
             */

            $scope.buscador_productos = function (event) {
                if (event.which === 13)
                    that.listarProductos();
            };


            /*
             * Descripcion: lista todos los productos de la farmacia 
             * que cuenten con existencias
             * @author German Andres Galvis
             * @fecha  23/05/2018
             */
            that.listarProductos = function () {

                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: Empresa.getCodigo(),
                        centro_utilidad: Empresa.centroUtilidad.codigo,
                        bodega: Empresa.centroUtilidad.bodega.codigo,
                        descripcion: $scope.root.termino_busqueda,
                        tipoFiltro: $scope.filtroNombre.id,
                        paginaActual: $scope.paginaactual
                    }
                };

                E007Service.listarProductos(obj, function (data) {
                    if (data.status === 200) {
                        $scope.root.cantidad_consulta = data.obj.listarProductos.length;

                        if ($scope.root.cantidad_consulta === 0) {
                            AlertService.mostrarMensaje("warning", "no se encontraron registros");
                        }

                        that.renderProductos(data.obj.listarProductos);
                    } else {
                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                    }

                });
            };

            that.renderProductos = function (productos) {
                $scope.datos_form.listado_productos = [];
                productos.forEach(function (data) {
                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.existencia).toFixed(),
                            data.cantidad_disponible, data.tipo_producto_id);
                    $scope.datos_form.listado_productos.push(producto);
                });
            };

            $scope.lista_productos = {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "16%", enableCellEdit: false,
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()">\
                                                <span class="label label-success" ng-show="row.entity.getTipoProductoId() == 1" >N</span>\
                                                <span class="label label-danger" ng-show="row.entity.getTipoProductoId() == 2">A</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 3">C</span>\
                                                <span class="label label-primary" ng-show="row.entity.getTipoProductoId() == 4">I</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 5">Ne</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 6">NeA</span>\
                                                <span class="label label-info" ng-show="row.entity.getTipoProductoId() == 7">MoE</span>\
                                                <span class="label label-default" ng-show="row.entity.getTipoProductoId() == 8">Nut</span>\
                                                <span class="label label-warning" ng-show="row.entity.getTipoProductoId() == 9">Ger</span>\
                                                <span ng-cell-text >{{COL_FIELD}} </span>\
                                                <span class="glyphicon glyphicon-lock text-danger" ng-show="row.entity.estado == \'0\'" ></span>\
                                            </div>'
                    },
                    {field: 'descripcion', displayName: 'Descripcion', width: "50%", enableCellEdit: false},
                    {field: 'existencia', displayName: 'Existencias', width: "12%", enableCellEdit: false},
                    {field: 'disponible', displayName: 'Disponibilidad', width: "12%", enableCellEdit: false},
                    {width: "10%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_adicionar_producto(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                ]
            };

            function sumarDias(fecha, dias) {
                fecha.setDate(fecha.getDate() + dias);
                return fecha;
            }

            $scope.btn_adicionar_producto = function (fila) {

                if (parseInt(fila.cantidad) > parseInt(fila.disponible)) {
                    AlertService.mostrarMensaje("warning", "la cantidad a trasladar supera la cantidad disponible");
                }

                that.listarLotesProductos(fila, function (result) {
                    var lotes = [];
                    for (var i in result) {
                        var fecha = sumarDias(new Date(result[i].fecha_vencimiento), 1);
                        var _lote = {lote: result[i].lote, existencia: result[i].existencia_actual, fecha_vencimiento: $filter('date')(fecha, "dd/MM/yyyy"), cantidad: 0};
                        lotes.push(_lote);
                    }
                    that.listar_lotes(fila, lotes);
                });
            };


            that.listar_lotes = function (producto, lotes) {
                $scope.opts = {
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-ls',
                    keyboard: false,
                    showFilter: true,
                    templateUrl: 'views/E007/buscadorLotes.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.producto = producto;
                            $scope.lotes = lotes;

                            $scope.listadoLotes = {
                                data: 'lotes',
                                enableColumnResize: true,
                                enableRowSelection: false,
                                showFilter: true,
                                enableHighlighting: true,
                                size: 'sm',
                                columnDefs: [
                                    {field: 'lote', displayName: 'Lote', width: "25%", enableCellEdit: false},
                                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "30%", enableCellEdit: false},
                                    {field: 'existencia', displayName: 'Existencias', width: "25%", enableCellEdit: false},
                                    {field: 'cantidad | number : "0" ', displayName: 'Cantidad', width: "12%", enableCellEdit: false,
                                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                                    {width: "10%", displayName: "Opcion", cellClass: "txt-center",
                                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_adicionar_lote(row.entity)" ng-disabled="habilitarCheck(row.entity)"><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'}
                                ]

                            };

                            $scope.habilitarCheck = function (producto) {
                                var disabled = false;

                                if (producto.cantidad === undefined || producto.cantidad === "" || parseInt(producto.cantidad) <= 0) {
                                    disabled = true;
                                }
                                if (parseInt(producto.cantidad) > parseInt(producto.existencia)) {
                                    AlertService.mostrarMensaje("warning", "la cantidad ingresada no puede superar las existencias");
                                    disabled = true;
                                }

                                return disabled;
                            };


                            $scope.btn_adicionar_lote = function (lote) {
                                $scope.producto.lote = lote.lote;
                                $scope.producto.cantidad = lote.cantidad;
                                $scope.producto.fecha_vencimiento = $filter('date')(lote.fecha_vencimiento, "dd/MM/yyyy");
                                if ($scope.doc_tmp_id === "00000" || $scope.doc_tmp_id === "") {
                                    $scope.grabar_documento_tmp(function callback(resul) {
                                        if (resul) {
                                            that.guardarProductoTmp($scope.producto);
                                        }
                                    });
                                } else {
                                    that.guardarProductoTmp($scope.producto);
                                }

                            };

                            /*
                             * Descripcion: agrega los productos al tmp 
                             * @author German Andres Galvis
                             * @fecha  23/05/2018
                             */
                            that.guardarProductoTmp = function (producto) {

                                var obj = {
                                    session: $scope.session,
                                    data: {
                                        empresa_id: Empresa.getCodigo(),
                                        centro_utilidad: Empresa.centroUtilidad.codigo,
                                        bodega: Empresa.centroUtilidad.bodega.codigo,
                                        codigoProducto: producto.codigo_producto,
                                        cantidad: producto.cantidad,
                                        lote: producto.lote,
                                        fechaVencimiento: producto.fecha_vencimiento,
                                        disponible: producto.disponible,
                                        docTmpId: $scope.doc_tmp_id
                                    }
                                };

                                E007Service.agregarProductoTmp(obj, function (data) {
                                    if (data.status === 200) {
                                        AlertService.mostrarMensaje("warning", data.msj);
                                    } else {
                                        AlertService.mostrarMensaje("warning", data.msj);
                                    }
                                });
                            };



                            $scope.onCerrar = function () {
                                $modalInstance.close();
                            };


                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que listara 
             *              los lotes del producto seleccionado
             * @author German Andres Galvis
             * @fecha 26/05/2018 DD/MM/YYYY
             */
            that.listarLotesProductos = function (producto, callback) {
                var obj = {
                    session: $scope.session,
                    data: {
                        empresa_id: Empresa.getCodigo(),
                        centro_utilidad: Empresa.centroUtilidad.codigo,
                        bodega: Empresa.centroUtilidad.bodega.codigo,
                        codigo_producto: producto.codigo_producto
                    }
                };

                Request.realizarRequest(API.E007.CONSULTAR_LOTES_PRODUCTO, "POST", obj, function (data) {
                    if (data.status === 200) {
                        callback(data.obj.lotesProducto);
                    }

                });
            };



            /*
             * funcion para paginar anterior
             * @returns {lista datos}
             */
            $scope.paginaAnterior = function () {
                if ($scope.paginaactual === 1)
                    return;
                $scope.paginaactual--;
                that.listarProductos();
            };


            /*
             * funcion para paginar siguiente
             * @returns {lista datos}
             */
            $scope.paginaSiguiente = function () {
                $scope.paginaactual++;
                that.listarProductos();
            };

        }]);
});