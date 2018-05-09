
define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('E017GestionarProductosController', [
        '$scope', '$rootScope', 'Request', "E017Service",
        '$modal', '$modalInstance', 'API', "socket", "$timeout", "$filter", "Usuario",
        "AlertService", "$state", 'Usuario', "ProductoDevolucion", 'Empresa', 'DocTmp',
        function ($scope, $rootScope, Request, E017Service, $modal, $modalInstance, API, socket, $timeout, $filter, Sesion,
                AlertService, $state, Usuario, Producto, Empresa, DocTmp) {

            var that = this;
            $scope.parametros = '';
            $scope.paginaactual = 1;
            $scope.tipoProducto;
            $scope.root = {
                termino_busqueda: '',
                cantidad_consulta: 0
            };

            $scope.datos_form = {
                listado_clientes: []
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
             * @fecha 03/05/2018
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
             * @fecha  03/05/2018
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

                E017Service.listarProductos(obj, function (data) {
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
                    var fecha = sumarDias(new Date(data.fecha_vencimiento), 1);
                    var producto = Producto.get(data.codigo_producto, data.descripcion, parseFloat(data.existencia).toFixed(),
                            data.tipo_producto_id, data.subClase, data.lote, $filter('date')(fecha, "dd/MM/yyyy"));
                    producto.setNombreTipo(data.nombreTipo);
                    $scope.datos_form.listado_productos.push(producto);
                });
            };

            function sumarDias(fecha, dias) {
                fecha.setDate(fecha.getDate() + dias);
                return fecha;
            }

            $scope.lista_productos = {
                data: 'datos_form.listado_productos',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'codigo_producto', displayName: 'Codigo ', width: "10%", enableCellEdit: false,
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
                    {field: 'descripcion', displayName: 'Descripcion', width: "35%", enableCellEdit: false},
                    {field: 'subClase', displayName: 'Molecula', width: "15%", enableCellEdit: false},
                    {field: 'existencia', displayName: 'Existencias', width: "10%", enableCellEdit: false},
                    {field: 'getCantidad() | number : "0" ', displayName: 'Cantidad', width: "8%", enableCellEdit: false,
                        cellTemplate: '<div class="col-xs-12" cambiar-foco > <input type="text" ng-model="row.entity.cantidad" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'fecha_vencimiento', displayName: 'Fecha. Vencimiento', width: "10%", enableCellEdit: false},
                    {field: 'lote', displayName: 'Lote', width: "7%", enableCellEdit: false},
                    {width: "6%", displayName: "Opcion", cellClass: "txt-center",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="btn_adicionar_producto(row.entity)" ng-disabled="habilitarCheck(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
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

            $scope.restaFechas = function (f1, f2)
            {
                var aFecha1 = f1.split('/');
                var aFecha2 = f2.split('/');
                var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
                var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
                var dif = fFecha2 - fFecha1;
                var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
                return dias;
            };


            $scope.btn_adicionar_producto = function (fila) {

                var fecha_actual = new Date();
                fecha_actual = $filter('date')(new Date(fecha_actual), "dd/MM/yyyy");
                var diferencia = $scope.restaFechas(fecha_actual, fila.fecha_vencimiento);
                if (diferencia <= 0) {
                    AlertService.mostrarMensaje("warning", "No se permite trasladar productos vencidos");
                    return;
                }

                that.guardarProductoTmp(fila);
            };

            /*
             * Descripcion: agrega los productos al tmp 
             * @author German Andres Galvis
             * @fecha  04/05/2018
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
                        docTmpId: DocTmp
                    }
                };


                E017Service.agregarProductoTmp(obj, function (data) {
                    if (data.status === 200) {
                        AlertService.mostrarMensaje("warning", data.msj);
                    } else {
                        AlertService.mostrarMensaje("warning", data.msj);
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