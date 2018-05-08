
/* global entregado, si, $flow, that, $http, echo, subirArchivo, flow, data, modalInstancesy, form, backdrop, parametros, parametros, parametros, archivo */

define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa",
], function (angular, controllers) {

    controllers.controller('RadicacionController', [
        '$scope', '$rootScope', "Request",
        "$filter", '$state', '$modal',
        "API", "AlertService", 'localStorageService',
        "Usuario", "socket", "$timeout",
        "Empresa",
        function ($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {
            var that = this;
            $scope.radicacion = '';
            $scope.desactivar = '0';
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
                fecha_vencimiento: "",
                progresoArchivo: "",
                descripcion: ""
            };
            $scope.root.concepto = [];

            $scope.abrir_fecha_inicial = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.abrir_fecha = $scope.abrir_fecha ? false : true;
            };

      


               $scope.consultarMunicipio = function (termino) {
                   if (termino.length <3){
                       return;
                   }                       
                   
                   var obj = {
                       session: $scope.session,
                       data: {
                           ciudades : {
                               termino_busqueda : termino
                           }
                       }
                      
                };
                
                Request.realizarRequest(
                        API.PARAMETRIZACION.LISTAR_MUNICIPIO,
                "POST",
                obj,
                function (data) {
                    if (data.status === 200){
                        $scope.root.farmaciaSeleccionada = [];
                        //that.render(data.obj.farmaciaSeleccionada);
                        $scope.root.municipio = data.obj.ciudades;
                    }
                
                   });
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
                                $scope.root.concepto = [];
//                                $scope.root.conceptoSeleccionado = [];
                                that.render(data.obj.listarConcepto);
                            }
                        }
                );
            };

            that.render = function (lista) {
                lista.forEach(function (data) {
                    var concepto = {concepto_radicacion_id: data.concepto_radicacion_id, observacion: data.observacion};
                   $scope.root.concepto.push(concepto);
                });
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
                            }
                        }
                );

            };


            that.listarAgrupar = function (parametro, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        relacion_id: parametro.relacion_id
                    }
                };

                Request.realizarRequest(
                        API.RADICACION.LISTAR_AGRUPAR,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                // $scope.root.listarAgrupar = data.obj.listarAgrupar;
                                parametro = {};
                                callback(data.obj.listarAgrupar);
                            }
                        }
                );
            };

            that.guardarConcepto = function (nombreConcepto, callback) {
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
                                that.consultarConcepto();
                                $scope.root.nombreConcepto = "";
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Proveedor guardado correctamente");
                                callback(true);
                                return;
                            } else {
                                callback(false);
                                return;
                            }
                        }
                );
            };
            that.guardarArchivo = function (nombreConcepto, callback) {
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
                                that.consultarConcepto();
                                $scope.root.nombreConcepto = "";
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Concepto guardado correctamente");
                                callback(true);
                                return;
                            } else {
                                callback(false);
                                return;
                            }
                        }
                );
            };








            that.modificarFactura = function (parametros) {
              var obj = {
                    session: $scope.session,
                    data: {
                        factura_id: parametros.factura_id,
                        sw_entregado: '1',

                        concepto_radicacion_id: parametros.concepto_radicacion_id,
                        numero_factura: parametros.numeroFactura,
                        fecha_entrega: 'now()',
                        precio: parametros.precio,
                        tipo_mpio_id: parametros.tipo_mpio_id,
                        municipio: parametros.nombre_ciudad,
                        ruta: parametros.ruta
                    }
                };


                Request.realizarRequest(
                        API.RADICACION.MODIFICAR_FACTURA, //Radicacion/guardarFactura
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                that.listarFactura();


                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "factura modificada correctamente");
                                return;
                            }

                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura");
                        }
                );
            };


            that.agrupar = function (form) {
                $scope.opts = {
                    backdrop: 'static',
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-ls-xlg-ls',
                    keyboard: false,
                    showFilter: true,
                    templateUrl: 'views/gestionFacturas/modificarEntregado.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.modificar = {};
                            $scope.modificar.sw_entregado = form.sw_entregado;
                            $scope.modificar.factura_id = form.factura_id;
                            $scope.modificar.facturaSeleccionada = form.factura_id;
                            $scope.modificar.archivo = form.archivo;


                            
                           
                            $scope.onVisualizarAgrupar = function (listado) {

                                that.subirArchivoEntregado(listado, $modalInstance);
                              
                            };
                            
                            that.limpiarGuardar=function(){
                                $scope.root.cargarFormato='';
                        
                            }

                            $scope.guardarEntregado = function () {

                                that.guardarEntregado($scope.modificar.facturaSeleccionada, function (data) {
                                
                                });
                            };
                            $scope.cerrar = function () {
                                $scope.root.activarBoton=true;
                                $modalInstance.close();
                                console.log("222");
                            };


                        }]
                };
                //var modalInstance = $modal.open($scope.opts);
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function () {
                      that.listarAgrupar({radicacion_id: ""}, function (dato) {
                        $scope.root.listarAgrupar = dato;
                    });
                }, function () {});
                
            };





            that.modificarEntregado = function (parametros) {
                var obj = {
                    session: $scope.session,
                    data: {
                        factura_id: parametros.factura_id,
                        sw_entregado: '1',

                    }
                };


                Request.realizarRequest(
                        API.RADICACION.MODIFICAR_ENTREGADO, //Radicacion/guardarFactura
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                that.listarFactura();


                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "factura modificada entregada correctamente");
                                return;
                            }

                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura entregada");
                        }
                );
            };


            that.listarFacturaEntregado = function () {
                var obj = {
                    session: $scope.session,
                    data: {}

                };

                Request.realizarRequest(
                        API.RADICACION.LISTAR_FACTURA_ENTREGADO,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                $scope.root.listarFacturaEntregado = data.obj.listarFacturaEntregado;
                            }
                        }
                );

            };

            that.agregarFacturaEntregado = function () {
                var obj = {
                    session: $scope.session,
                    data: {
                        numeroFactura: $scope.root.listarFacturaEntregado.factura_id,
                        numeroRadicacion: $scope.radicacion,
                        sw_entregado: '1'
                    }

                };
                Request.realizarRequest(
                        API.RADICACION.AGREGAR_FACTURA_ENTREGADO,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                that.listarFacturaEntregado();
                                // $scope.root.agregarFacturaEntregado = data.obj.listarFacturaEntregado;
                               
                            }
                        }
                );

            };



            that.planillaRadicacion = function (parametro) {
                var obj = {
                    session: $scope.session,
                    data: {

                        relacion_id: parametro.relacion_id,
                    }

                };

                Request.realizarRequest(
                        API.RADICACION.PLANILLA_RADICACION,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                setTimeout(function () {
                                    that.listarAgrupar({radicacion_id: ""}, function (dato) {
                                        $scope.root.listarAgrupar = dato;
                                    });
                                }, 500);
                                $scope.visualizarReporte("/reports/" + data.obj.nomb_pdf, data.obj.nomb_pdf, "_blank");
                            }
                        }
                );
            };



            that.guardarFactura = function (ruta) {
               // return;
//                var fecha = new Date($scope.root.fecha_vencimiento);
//
//                var fecha_vencimiento = (fecha.getMonth() + 1) + '-' + fecha.getDate() + '-' + fecha.getFullYear() + ' 00:00:00';

                var obj = {
                    session: $scope.session,
                    data: {
                        numeroFactura: $scope.root.numeroFactura,
                        conceptoRadicacionId: $scope.root.conceptoSeleccionado.concepto_radicacion_id,
                        swEntregado: '1',
                        precio: $scope.root.precioSeleccionado,
                        fechaVencimiento: $scope.root.fecha_vencimiento,
                        descripcion: $scope.root.descripcion,
                        ruta: ruta,
                        municipio: $scope.root.farmaciaSeleccionada.nombre_ciudad,
                        tipo_mpio_id: $scope.root.farmaciaSeleccionada.id,
                        tipo_pais_id: $scope.root.farmaciaSeleccionada.pais_id,
                        tipo_dpto_id:$scope.root.farmaciaSeleccionada.departamento_id
                    }
                    
                    
                };
               

                //aqui

                Request.realizarRequest(
                        API.RADICACION.GUARDAR_FACTURA,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                that.listarFactura();
                                $scope.root.numeroFactura = '';
                                // $scope.root.conceptoSeleccionado = [];
                                //$scope.root.farmaciaSeleccionada = [];
                                $scope.root.farmaciaSeleccionada = "";
                                $scope.root.conceptoSeleccionado = "";
                                $scope.root.precioSeleccionado = '';
                                $scope.root.descripcion = '';
                                $scope.root.fecha_vencimiento = [];
                                $scope.root.farmaciaSeleccionada.id="";
                                $scope.root.farmaciaSeleccionada.pais_id="";
                                $scope.root.farmaciaSeleccionada.departamento_id="";
                                $scope.root.progresoArchivo = 0;
                                $scope.root.files = [];
                                $scope.files = [];
                                var fd = new FormData();
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura guardada correctamente");
                                return;
                            }

                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al guardar la Factura");
                        }
                );
            };

            that.agruparFactura = function () {
//                var fecha = new Date($scope.root.fecha_vencimiento);
//                var fecha_vencimiento = (fecha.getMonth() + 1) + '-' + fecha.getDate() + '-' + fecha.getFullYear() + ' 00:00:00';
                var obj = {
                    session: $scope.session,
                    data: {
                        facturas: $scope.listaFacturaPendiente
                    }
                };


                Request.realizarRequest(
                        API.RADICACION.AGRUPAR_FACTURA,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura agrupada correctamente");
                                return;
                            }
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al guardar la Factura");
                        }
                );
            };

            that.eliminarGrupoFactura = function (parametro, callback) {

                var obj = {
                    session: $scope.session,
                    data: {
                        agrupar_factura_id: parametro.relacion_id,
                        factura_id: parametro.factura_id
                    }
                };

                Request.realizarRequest(
                        API.RADICACION.ELIMINAR_GRUPO_FACTURA,
                        "POST",
                        obj,
                        function (data) {
                            if (data.status === 200) {
                                that.listarAgrupar(parametro, function (listado) {
                                    $scope.listaFacturaPendienteModificar = [];

                                    listado.forEach(function (element) {

                                        $scope.listaFacturaPendienteModificar.push(element);

                                    });
                                    that.listarAgrupar({radicacion_id: ""}, function (dato) {
                                        $scope.root.listarAgrupar = dato;
                                        that.listarFactura();
                                    });
                                });
                                callback(true);
                                return;
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al guardar la Factura");
                                callback(false);
                            }
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
                                that.guardarConcepto($scope.root.nombreConcepto, function (data) {
                                    if (data) {

                                        $scope.cerrar();
                                    }
                                });
                            };

                            $scope.cerrar = function () {
                                console.log("11");
                                $modalInstance.close();
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            $scope.onVistaAgrupar = function () {
                $scope.listaFacturaPendiente = [];

                $scope.root.listarFactura.forEach(function (element) {
                    if (element.sw_entregado === '0') {
                        $scope.listaFacturaPendiente.push(element);
                    }

                });
                that.verAgruparFactura();
            };
//mañana 
            that.factura = function (form) {
                $scope.opts = {
                    backdrop

                }
            }




            that.verAgruparFactura = function (form) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-xlg',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/gestionFacturas/agrupaFactura.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.agrupar = {};
                            // $scope.agrupar.relacion_id = form.relacion_id;
                            /// $scope.agrupar.archivo= form.archivo;
                            //$scope.agrupar.agrupar_factura_id=form.agrupar_factura_id;
                            // $scope.agrupar.fecha_registro=form.fecha_registro;
                            // $scope.agrupar.usuario_id=form.usuario_id;
                            // $scope.agrupar.factura_id = form.factura_id;


                            $scope.guardarAgruparFactura = function () {

                                if (listaAgrupados.length > 0) {
                                    var obj = {
                                        session: $scope.session,
                                        data: {
                                            facturas: listaAgrupados
                                        }
                                    };

                                    Request.realizarRequest(
                                            API.RADICACION.AGRUPAR_FACTURA,
                                            "POST",
                                            obj,
                                            function (data) {
                                                if (data.status === 200) {
                                                    that.listarFactura();
                                                    that.listarAgrupar({radicacion_id: ""}, function (dato) {
                                                        $scope.root.listarAgrupar = dato;
                                                    });

                                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura agrupada correctamente");
                                                    $scope.cerrar();
                                                    return;
                                                }
                                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al agrupar la Factura");
                                            }
                                    );
                                } else {
                                    var mensaje = "";
                                    if (listaAgrupados.length === 0) {
                                        mensaje = "Debe seleccionar una factura";
                                    }

                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", mensaje);
                                    return;
                                }

                            };


                            $scope.onArchivoSeleccionadoFormato = function (files) {
                                $scope.files = files;

                            };

                            $scope.selected = [];
                            var listaAgrupados = [];
                            $scope.onAgruparFactura = function (item, list) {
                                var idx = list.indexOf(item);
                                if (idx > -1) {
                                    list.splice(idx, 1);
                                } else {
                                    list.push(item);
                                }
                                listaAgrupados = list;

                            };
                            $scope.exists = function (item, list) {
                                return list.indexOf(item) > -1;
                            };

                            $scope.cerrar = function () {
                                console.log("11eee");
                                $modalInstance.close();
                            };

                        }]
                };
                var modalInstance = $modal.open($scope.opts);
            };

            that.verModificar = function (form) {
                $scope.opts = {
                    backdrop: true,
                    backdropClick: true,
                    dialogFade: false,
                    windowClass: 'app-modal-window-ls-xlg-ls',
                    keyboard: true,
                    showFilter: true,
                    cellClass: "ngCellText",
                    templateUrl: 'views/gestionFacturas/vistaModificarFactura.html',
                    scope: $scope,
                    controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                            $scope.editar = {};
                            $scope.editar.sw_entregado = form.sw_entregado;
                            $scope.editar.factura_id = form.factura_id;
                            $scope.editar.numeroFactura = form.numero_factura;
                            $scope.editar.precioSeleccionado = form.precio;
                            $scope.editar.conceptooSeleccionado = form.descripcion;
                            $scope.editar.fecha_entrega = form.fecha_vencimiento;
                            $scope.editar.cargarArchivo = form.ruta;
                            $scope.editar.farmacias = form.farmacias;
                            $scope.editar.concepto = form.concepto;
                            $scope.editar.conceptoSeleccionado = {concepto_radicacion_id: form.concepto_radicacion_id, observacion: form.proveedor};
                            $scope.editar.farmaciaSeleccionada = {tipo_mpio_id: form.tipo_mpio_id, nombre_ciudad: form.municipio};
                            $scope.abrir_fecha_editar = false;

                            $scope.onEditarFactura = function () {
                                if ($scope.editar.numeroFactura === '') {
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el numero de la Factura");
                                    return;
                                }
                                editarFactura();
                            };

                            $scope.cancelar = function () {
                                console.log("11sss");
                                $modalInstance.close();
                            };

                            function editarFactura() {
                                //formateo de fecha
                                var data = {
                                    fechaEntrega: $filter('date')($scope.editar.fecha_entrega, "yyyy-MM-dd"),
                                    factura_id: $scope.editar.factura_id,
                                    sw_entregado: '1',
                                    conceptoSeleccionado: $scope.editar.conceptoSeleccionado.concepto_radicacion_id,
                                    numeroFactura: $scope.editar.numeroFactura,
                                    precio: $scope.editar.precioSeleccionado,
                                    conceptooSeleccionado: $scope.editar.conceptooSeleccionado,
                                    tipo_mpio_id: $scope.editar.farmaciaSeleccionada.id,
                                    tipo_dpto_id:  $scope.editar.farmaciaSeleccionada.departamento_id,
                                    ruta: $scope.editar.cargarArchivo,
                                    nombre_ciudad: $scope.editar.farmaciaSeleccionada.nombre_ciudad
                                }
                                that.subirArchivo(2, data, $modalInstance);
                            };

                            $scope.abrir_fecha_inicial_editar = function ($event) {
                                $event.preventDefault();
                                $event.stopPropagation();
                                $scope.abrir_fecha_editar = $scope.abrir_fecha_editar ? false : true;
                            };
                        }]
                };
                var modalInstance = $modal.open($scope.opts);
                modalInstance.result.then(function () {
                    that.listarFactura();
                }, function () {});
            };


//1
            $scope.listar_factura = {
                data: 'root.listarFactura',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'municipio', displayName: "Ciudad", width: "25%"},
                    {field: 'numero_factura', displayName: 'No. Factura', width: "7%"},
                    {field: 'proveedor', displayName: 'Proveedor', width: "10%"},
                    {field: 'descripcion', displayName: 'Descripcion', width: "16%"},
                    {field: 'precio', displayName: 'Precio', width: "8%"},
                    {field: 'fecha_entrega', displayName: 'Radicacion', width: "8%"},
                    {field: 'fecha_vencimiento', displayName: 'Vencimiento', width: "8%"},
                    {displayName: 'Entregado', cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: ' <div class="row">\
                                          <div class= "txt-center dropdown-button" "checkbox" ng-if="row.entity.sw_entregado==0">\
                                            <label> \
                                              <span class="glyphicon glyphicon-remove"></span>\
                                            </label>\
                                         </div>\
                                          <div class=  "txt-center dropdown-button" "checkbox" ng-if="row.entity.sw_entregado==1">\
                                            <label> \
                                              <span class="glyphicon glyphicon-ok"></span>\
                                            </label>\
                                         </div>\
                                       </div>'


                    },

                    {displayName: "Descargas", cellClass: "txt-center dropdown-button", width: "7%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onDescargarArchivo(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-download-alt"></span></button>\
                                     </div>'
                    },
                    {displayName: "Modificar", cellClass: "txt-center dropdown-button", width: "6%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onModificar(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-edit"></span></button>\
                                     </div>'
                    }



                ]
            };
//2            
            $scope.listar_agrupar = {
                data: 'root.listarAgrupar',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'relacion_id', displayName: 'Grupo', width: "5%"},
                    {field: 'municipio', displayName: "Ciudad", width: "14%"}, //
                    {field: 'numero_factura', displayName: 'No. Factura', width: "8%"},
                    {field: 'descripcion', displayName: 'Descripcion', width: "30%"},
                    {displayName: "Img", cellClass: "txt-center dropdown-button", width: "4%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onDescargarArchivo(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-download-alt"></span></button>\
                                     </div>'
                    },
                    {field: 'fecha_entrega', displayName: 'Fecha de Radicacion', width: "13%"},
                    {displayName: 'Formato Cargado', cellClass: "txt-center dropdown-button", width: "10%",
                        cellTemplate: ' <div class="row">\
                                          <div class="txt-center dropdown-button" "checkbox" ng-if="row.entity.archivo==null">\
                                            <label> \
                                              <span class="glyphicon glyphicon-cloud-upload"></span>\
                                            </label>\
                                         </div>\
                                          <div class="txt-center dropdown-button" "checkbox" ng-if="row.entity.archivo!=null">\
                                            <label> \
                                              <span class="glyphicon glyphicon-cloud-download"></span>\
                                            </label>\
                                         </div>\
                                       </div>'


                    },

                    {displayName: "Descargas", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onDescargarArchivoFormato(row.entity)"  class="btn btn-default btn-xs"><span class="glyphicon glyphicon-download-alt"></span></button>\
                                     </div>'
                    },
                    {displayName: "Modificar", cellClass: "txt-center dropdown-button", width: "8%",
                        cellTemplate: '<div class="ngCellText" ng-class="col.colIndex()" style="text-align:center;">\
                                        <button ng-click="onModificarAgrupacion(row.entity)"  class="btn btn-default btn-xs"><span class="glyphicon glyphicon-edit"></span></button>\
                                     </div>'
                    }



                ]
            };

// agrupar              hoy


            $scope.listarFactura = {
                data: 'listaFacturaPendiente',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_factura', displayName: 'No. Factura', width: "30%"},
                    {field: 'descripcion', displayName: 'bodega', width: "30%"},
                    {displayName: 'Entregado', cellClass: "txt-center dropdown-button", width: "40%",
                        cellTemplate: ' <div class="row">\
                                        <div class= "txt-center dropdown-button" "checkbox" ng-if="row.entity.sw_entregado==0">\
                                          <label> \
                                             <input type="checkbox" ng-checked="exists(row.entity, selected)" ng-click="onAgruparFactura(row.entity, selected)" value="">\
                                             </label>\
                                         </div>\
                                       </div>'


                    }
                ]
            };

            //modificar entregado        
            $scope.listarFacturaAgrupada = {
                data: 'listaFacturaPendienteModificar',
                multiSelect: false,
                enableHighlighting: true,
                showFilter: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_factura', displayName: 'No. Factura', width: "40%"},
                    {field: 'descripcion', displayName: 'bodega', width: "40%"},
                    {displayName: 'Entregado', cellClass: "txt-center dropdown-button", width: "20%",
                        cellTemplate: ' <div class="row">\
                                          <label> \
                                           <button ng-click="onEliminarFacturaAgrupada(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-remove"></span></button>\
                                             </label>\
                                         </div>\
                                       </div>'


                    }
                ]
            };

            $scope.onModificar = function (modificar) {
                modificar.concepto = $scope.root.concepto;
                modificar.farmacias = $scope.root.farmacias;
               
                that.verModificar(modificar);
            };


            $scope.onDeshabilitar = function (impresion) {

                var disabled = true;
                if (impresion.archivo === undefined || impresion.archivo === null) {
                    disabled = false;

                }

                return disabled;
            };

            $scope.onDesactivar = function () {
                var disabled = false;
                if ($scope.desactivar === '1') {
                    disabled = true;
                }
                return disabled;

            };

            $scope.onEliminarFacturaAgrupada = function (parametro) {
                that.eliminarGrupoFactura(parametro, function () {
                    that.listarAgrupar(parametro, function () {

                    });
                });

            };

            $scope.onModificarAgrupacion = function (parametro) {

                $scope.radicacion = parametro.relacion_id;
                $scope.desactivar = parametro.imprimir;


                that.listarAgrupar(parametro, function (dato) {
                    // $scope.root.listarAgrupar = dato;
                    dato.relacion_id = parametro.relacion_id;



                    $scope.listaFacturaPendienteModificar = [];

                    dato.forEach(function (element) {

                        $scope.listaFacturaPendienteModificar.push(element);


                    });
$scope.root.botonAgregar = true;
if (parametro.archivo===null){
    console.log("parametro",parametro.archivo)
    $scope.root.botonAgregar = false;
}


                    that.agrupar(dato);
                });
            };

            $scope.onModificarFactura = function (factura) {

                that.modificarFactura(factura);

            };

            $scope.onDescargarArchivo = function (archivo) {
                $scope.visualizarReporte("/Facturas/Sistemas/" + archivo.ruta, archivo.ruta, "blank");
            };
            
//            $scope.onDescargarArchivoFactura = function (archivo) {
//                $scope.visualizarReporte("/Facturas/Sistemas/" + archivo.ruta, archivo.ruta, "blank");
//            };

            $scope.onDescargarArchivoFormato = function (formato) {

                if (formato.archivo === null || formato.archivo === "") {
                    that.planillaRadicacion(formato);
                } else {
                    $scope.visualizarReporte("/Facturas/Sistemas/" + formato.archivo, formato.archivo, "blank");
                    that.listarAgrupar({radicacion_id: ""}, function (dato) {
                   
                        $scope.root.listarAgrupar = dato;
                    });
                }

            };


            $scope.modalConcepto = function () {
                that.verConcepto();
            };



            $scope.onSeleccionMunicipio = function () {
            };

            $scope.onSeleccionFacturaEntregado = function () {
                that.listarFacturaEntregado();
            };

            $scope.onAgregarFactura = function () {

                that.agregarFacturaEntregado();
                var time = setTimeout(function () {
                    that.listarAgrupar({relacion_id: $scope.radicacion}, function (listado) {
                        $scope.listaFacturaPendienteModificar = [];

                        listado.forEach(function (element) {

                            $scope.listaFacturaPendienteModificar.push(element);

                        });
                        that.listarAgrupar({radicacion_id: ""}, function (dato) {
                            $scope.root.listarAgrupar = dato;
                            that.listarFactura();
                        });
                    });
                    clearTimeout(time);
                }, 500);
                
                that.limpiarAgregar();
                
            };
            
            that.limpiarAgregar = function () {
                $scope.root.listarFacturaEntregado = '';
                $scope.root.cargarFormato = '';
            };
            
            

            $scope.onSeleccionConcepto = function () {
                $scope.root.concepto = [];
                that.consultarConcepto();
            };
            
//            $scope.onSeleccionFarmacia = function (){
//                $scope.root.municipio = [];
//                that.consultarMunicipio();
//                
//            };

            $scope.onSeleccionFactura = function () {
                
            };

            $scope.onGuardarFactura = function () {

                if ($scope.root.numeroFactura === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el numero de la Factura");
                    return;
                }

                if ($scope.root.conceptoSeleccionado === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar el proveedor de la Factura");
                    return;
                }
                if ($scope.root.farmaciaSeleccionada === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar la ciudad de la Factura");
                    return;
                }
                if ($scope.root.precioSeleccionado === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el precio de la Factura");
                    return;
                }
//                if ($scope.root.fecha_vencimiento === '') {
//                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar la fecha de la Factura");
//                    return;
//                }
                if ($scope.root.descripcion === '') {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el concepto de la Factura");
                    return;
                }

                that.subirArchivo(1, {}, {});
            };

            $scope.respuestaSubirArchivo = function (file, message) {
                var data = (message !== undefined) ? JSON.parse(message) : {};
                $scope.root.flow.cancel();
                if (data.status === 200) {
                    that.subirArchivo();
                    $scope.visualizarReporte("/reports/" + data.obj.pdf, data.obj.pdf, "download");

                } else {
                    var msj = data.msj;
                    if (msj.msj) {
                        msj = msj.msj;
                    }
                    AlertService.mostrarVentanaAlerta(String.CONSTANTS.ALERTA_TITULO, msj);
                }
            };

            $scope.close = function () {
                // $modalInstance.close();
            };
            //////////////////////////////       
            $scope.root.activarBoton=true;
            $scope.onArchivoSeleccionado = function (files) {
              
                if(files[0].name===''){
                    console.log("fileee333333",files)
                    $scope.root.activarBoton=true;
                    return;
                }else{console.log("fileee22222",files)
                $scope.root.activarBoton=false;
                $scope.root.files = files;                
                that.limpiarArchivoo();
               }
            };

            that.limpiarArchivoo = function () {
                $scope.root.archivo = '';
            }

//            $scope.onArchivoSeleccionadoFactura = function (files) {
//                $scope.root.files = files;
//            };


            that.subirArchivoEntregado = function (data, modalInstance) {
                var fd = new FormData();
                var ruta;

//                if (!$scope.root.files) {
//                    $scope.root.files = [{lastModified: '', lastModifiedDate: '', name: "", size: '', type: '', webkitRelativePath: ''}];
//                }

                fd.append("file", $scope.root.files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify({
                    data: {
                        empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(),
                        ruta: $scope.root.files[0]
                    }
                }));

                Request.subirArchivo(API.RADICACION.SUBIR_ARCHIVO, fd, function (respuesta) {
                    if (respuesta) {
                        ruta = respuesta.obj.data.split('/');
                        ruta = ruta[ruta.length - 1];
                    } else {
                        ruta = respuesta;

                    }

                    var obj = {
                        session: $scope.session,
                        data: {
                            relacion_id: $scope.radicacion,
                            archivo: ruta

                        }
                    };


                    Request.realizarRequest(
                            API.RADICACION.MODIFICAR_NOMBRE_ARCHIVO, //Radicacion/guardarFactura
                            "POST",
                            obj,
                            function (data) {
                                if (data.status === 200) {

                                    modalInstance.close();
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "factura modificada correctamente");
                                    return;
                                }

                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura");
                            }
                    );
                });                       
            };



            that.subirArchivo = function (modo, data, modalInstance) {
                var fd = new FormData();
                var ruta;

                if (!$scope.root.files) {
                    $scope.root.files = [{lastModified: '', lastModifiedDate: '', name: "", size: '', type: '', webkitRelativePath: ''}];
                }

                fd.append("file", $scope.root.files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify({
                    data: {
                        empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo(), 
                        ruta: $scope.root.files[0]
                    }
                }));
                Request.subirArchivo(API.RADICACION.SUBIR_ARCHIVO, fd, function (respuesta) {
                    if (respuesta) {
                        ruta = respuesta.obj.data.split('/');
                        ruta = ruta[ruta.length - 1];
                    } else {
                        ruta = respuesta;
                    }

                    if (modo == 1) {
                        that.guardarFactura(ruta);
                    } else {
                        
                        var obj = {
                            session: $scope.session,
                            data: {
                                factura_id: data.factura_id,
                                sw_entregado: '1',
                                conceptoSeleccionado: data.conceptoSeleccionado,
                                numeroFactura: data.numeroFactura,
                                precio: data.precio,
                                conceptooSeleccionado: data.conceptooSeleccionado,
                                tipo_mpio_id: data.tipo_mpio_id,
                                ruta: ruta,
                                fecha_entrega: data.fechaEntrega,
                                tipo_dpto_id: data.tipo_dpto_id
                            }
                        };

                        Request.realizarRequest(
                                API.RADICACION.MODIFICAR_FACTURA, //Radicacion/guardarFactura
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Factura modificada correctamente");
                                        modalInstance.close();
                                        return;
                                    }
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al modificar la Factura");
                                }
                        );
                    }

                    //$scope.close();
                });
            };

            that.subirArchivoFactura = function () {
                var fd = new FormData();
                fd.append("file", $scope.root.files[0]);
                fd.append("session", JSON.stringify($scope.root.session));
                fd.append("data", JSON.stringify(
                        {
                            data: {
                                empresa_id: Usuario.getUsuarioActual().getEmpresa().getCodigo()
                            }
                        }
                ));

                Request.subirArchivo(API.RADICACION.SUBIR_ARCHIVO_FACTURA, fd, function (respuesta) {
                    $scope.close();
                });
            };
///////////////////
            $scope.cargarArchivo = function ($flow) {
                $scope.root.flow = $flow;
            };

            $scope.onDescagarArchivo = function ($flow) {
                $scope.root.flow = $flow;
            };

            that.init = function () {
//                that.consultarFarmacia(); 
                //that.consultarMunicipio();
                that.consultarConcepto();
                that.listarFactura();

                that.listarAgrupar({radicacion_id: ""}, function (dato) {
                    $scope.root.listarAgrupar = dato;
                });

                $scope.root.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };
                $scope.root.flow = new Flow();
                $scope.root.flow.target = API.RADICACION.SUBIR_ARCHIVO;
                $scope.root.flow.testChunks = false;
                $scope.root.flow.singleFile = true;

                $scope.root.flow.query = {
                    session: JSON.stringify($scope.root.session)
                };
            };

            that.init();
        }])
});

     