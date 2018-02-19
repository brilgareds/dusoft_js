
/* global entregado, si, $flow, that, $http, echo */

define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function (angular, controllers) {

    controllers.controller('radicacionController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa",
        function ($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {
            var that = this;
            var fecha_actual = new Date();
            $scope.abrir_fecha = false;
            $scope.fecha_vencimiento = $filter('date')(fecha_actual, "yyyy-MM-dd"),
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
            $scope.root = {
                farmaciaSeleccionada: "",
                conceptoSeleccionado: "",
                numeroFactura: "",
                precioSeleccionado: "",
                fecha_vencimiento: ""
            };

            $scope.abrir_fecha_inicial = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.abrir_fecha = $scope.abrir_fecha ? false : true;
                console.log($scope.abrir_fecha);

            };

            that.consultarFarmacia = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(
                        API.BODEGAS.LISTAR_BODEGA_DUANA_FARMACIA,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                $scope.root.farmacias = data.obj.bodegas[0];
                            }
                        }
                );
            };

            that.consultarConcepto = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(
                        API.RADICACION.LISTAR_CONCEPTO,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                that.render(data.obj.listarConcepto, function (datas) {
                                    $scope.root.concepto = datas;
                                    $scope.root.conceptoSeleccionado = datas;
                                });
                            }
                        }
                );
            };

            that.listarFactura = function () {
                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(
                        API.RADICACION.LISTAR_FACTURA,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                $scope.root.listarFactura = data.obj.listarFactura;
                                console.log("data", $scope.root.listarFactura);
                            }
                        }
                );

            };

            that.render = function (lista, callback) {
                var conceptos = [];
                lista.forEach(function (data) {
                    console.log(data);
                    var concepto = {concepto_radicacion_id: data.concepto_radicacion_id, observacion: data.observacion};
                    conceptos.push(concepto);
                });
                console.log("Refresca", conceptos);
                callback(conceptos);
            };

            that.guardarConcepto = function (nombreConcepto, callback) {
                console.log("guardarConcepto ", nombreConcepto);
                var obj = {
                    session: $scope.session,
                    data: {
                        nombre: nombreConcepto.toUpperCase()
                    }
                };
            

                Request.realizarRequest(
                        API.RADICACION.GUARDAR_CONCEPTO,
                        "POST",
                        obj,
                        function (data) {

                            if (data.status === 200) {
                                $scope.root.concepto = "";
                                $scope.root.conceptoSeleccionado = "";
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Concepto guardado correctamente");
                                callback(true);
                                return;
                            }
                        }
                );
            };

            that.guardarFactura = function () {
                var fecha = new Date($scope.root.fecha_vencimiento);
                var fecha_vencimiento = (fecha.getMonth() + 1) + '-' + fecha.getDate() + '-' + fecha.getFullYear() + ' 00:00:00';

                var obj = {
                    session: $scope.session,
                    data: {
                        numeroFactura: $scope.root.numeroFactura,
                        conceptoRadicacionId: $scope.root.conceptoSeleccionado.concepto_radicacion_id,
                        swEntregado: '1',
                        bodegaId: $scope.root.farmaciaSeleccionada.bodega_id,
                        precio: $scope.root.precioSeleccionado,
                        fechaVencimiento: fecha_vencimiento,
                        ruta: ''
                    }
                };


                Request.realizarRequest(
                        API.RADICACION.GUARDAR_FACTURA, //Radicacion/guardarFactura
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                $scope.root.numeroFactura = '';
                                $scope.root.conceptoSeleccionado = {};
                                $scope.root.farmaciaSeleccionada = {};
                                $scope.root.precioSeleccionado = '';
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "factura guardada correctamente");
                                return;
                            }

                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al guardar la Factura");
                        }
                );
            };
           
            that.verConcepto = function () {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-smlg',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/gestionFacturas/vistaConceptos.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {

                            $scope.guardarConcepto = function () {
                                that.guardarConcepto($scope.root.nombreConcepto, function () {
                                    that.consultarConcepto();
                                    $scope.cerrar();
                                });
                            };

                            $scope.cerrar = function () {
                                $modalInstance.close();
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };
            
            /**
             * +Descripcion: objeto ng-grid
             * @author Andres M Gonzalez
             * @fecha: 11/05/2016
             */
            /*$scope.listar_factura2 = {
                data: 'root.listarFactura',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'bodega_id', displayName: "Bodega", cellClass: "txt-center dropdown-button", width: "10%"},
                    {field: 'numero_factura', displayName: 'No. Factura', width: "8%"},
                    {field: 'concepto_radicacion_id', displayName: 'Concepto', width: "32%"},
                    {field: 'fecha_entrega', displayName: 'Fecha de entrega', width: "10%"},
                    {field: 'precio', displayName: 'Precio', width: "10%"},
                    {field: 'observacion', displayName: 'observacion', width: "10%"},
                    {displayName: "DUSOFT FI", cellClass: "txt-center dropdown-button", width: "20%",
                        celltemplate: ' <div class="row">\
							  <div  >\
							    <button class="btn btn-danger btn-xs " >\
								<span class="glyphicon glyphicon-export"> Sincronizar</span>\
							    </button>\
							  </div>\
							  <div>\
							    <button class="btn btn-success btn-xs">\
								<span class="glyphicon glyphicon-saved"> Sincronizar</span>\
							    </button>\
							  </div>\
						       </div>'}

                ]

            };*/

            $scope.listar_factura = {
                data: 'root.listarFactura',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [
                    {field: 'descripcion', displayName: "Bodega", cellClass: "txt-center dropdown-button", width: "32%"}, //
                    {field: 'numero_factura', displayName: 'No. Factura', width: "8%"},
                    {field: 'observacion', displayName: 'observacion', width: "20%"},
                    {field: 'precio', displayName: 'Precio', width: "10%"},
                    {field: 'fecha_entrega', displayName: 'Fecha de entrega', width: "20%"},
                    {displayName: 'Entrega', cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                        <div class="checkbox">\
                                          <label><input type="checkbox" value=""></label>\
                                        </div>\
                                            </div>'
                    }
                ]
            };
            
            $scope.modalConcepto = function () {
                that.verConcepto();
            };
            
            $scope.subiArchivo = function () {
                console.log("subirArchivo");
            };

            $scope.onSeleccionFarmacia = function () {
                // console.log(" AAAAAAAAAAA", $scope.root.farmaciaSeleccionada);  
            };

            $scope.onSeleccionConcepto = function () {
            };
            //  console.log("aaaaaaa", $scope.root.conceptoSeleccionada);

            $scope.onSeleccionFactura = function () {
            };

            $scope.onGuardarFactura = function () {
                $scope.onSubirArchivo();
                /*if ($scope.root.numeroFactura === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el numero de la Factura");
                    return;
                }
                that.guardarFactura();*/
            };

            $scope.respuestaSubidaArchivo = function(file, message) {
                console.log('respuesta Subida archivo', file, message);
                var data = (message !== undefined) ? JSON.parse(message) : {};
                $scope.root.flow.cancel();
                if (data.status === 200) {
                    $scope.visualizarReporte("/reports/" + data.obj.pdf, data.obj.pdf , "download");
                    $modalInstance.close();
                } else {
                    var msj = data.msj;
                    if(msj.msj){
                        msj = msj.msj;
                    }
                    AlertService.mostrarVentanaAlerta(String.CONSTANTS.ALERTA_TITULO, msj);
                }
                $scope.root.progresoArchivo = 0;
            };

            $scope.cargarArchivo = function($flow) {
                $scope.root.flow = $flow;
                console.log($scope.root.flow);

            };

            $scope.onSubirArchivo = function() {
                that.subirArchivoOrdenes();
            };

            that.subirArchivoOrdenes = function() {
                $scope.root.flow.opts.query.data = JSON.stringify({
                    ordenes_compras: {
                        empresa_id : '03'
                    }
                });
                $scope.root.progresoArchivo = 1;
                $scope.root.flow.upload();
            };
       
            that.init = function () {
                that.consultarFarmacia();
                that.consultarConcepto();
                that.listarFactura();

                $scope.root.flow = new Flow();
                $scope.root.flow.target = API.RADICACION.SUBIR_ARCHIVO;
                $scope.root.flow.testChunks = false;
                $scope.root.flow.singleFile = true;
                $scope.root.progresoArchivo = 0;

                $scope.root.flow.query = {
                    session: JSON.stringify($scope.root.session)
                };
            };

            that.init();
        }])});

     