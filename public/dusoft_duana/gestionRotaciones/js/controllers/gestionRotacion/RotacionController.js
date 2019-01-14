define(["angular", "js/controllers", 'includes/slide/slideContent',
    "includes/classes/Empresa"],
        function (angular, controllers) {
            controllers.controller('RotacionController', [
                '$scope', '$rootScope', "Request",
                "$filter", '$state', '$modal',
                "API", "AlertService", 'localStorageService',
                "Usuario", "socket", "$timeout",
                "Empresa",
                function ($scope, $rootScope, Request, $filter, $state, $modal, API, AlertService, localStorageService, Usuario, socket, $timeout, Empresa) {
                    var that = this;
                    var fecha_actual = new Date();
                    $scope.rotacion = '';
                    $scope.desactivar = '0';
                    $scope.abrir_fecha_rotacionI = false;
                    $scope.fecha_rotacion = $filter('date')(fecha_actual, "dd/MM/yyyy");
                    $scope.fecha_digitacion = $filter('date')(fecha_actual, "dd/MM/yyyy");
                    $scope.format='dd/MM/yyyy';

                    $scope.abrir_fecha_inicialR = function ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.abrir_fecha_rotacionI = $scope.abrir_fecha_rotacionI ? false : true;
                    };

                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };

                    that.session = $scope.session;

                    $scope.root = {
                        fecha_digitacion: "",
                        fecha_rotacion: "",
                        empresaSeleccionada: "",
                        empresa: "",
                        buscar: "",
                        zona: "",
                        farmacia: "",
                        id: "",
                        zonaSeleccionada: "",
                        farmaciaSeleccionada: "",
                        buscarSeleccionada: ""
                    };


                    that.Buscar = function (parametros) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                buscar: parametros===undefined?$scope.root.buscar:parametros,
                            }
                        };
                        Request.realizarRequest(
                                API.ROTACION.LISTAR_ROTACION,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        $scope.root.listarRotacion = "";
                                        $scope.root.listarRotacion = data.obj.listarRotacion;
                                    } else {
                                        AlertService.mostrarVentanaAlerta("Respuesta del sistema", "ERROR DE BÚSQUEDA");
                                    }
                                });
                    };


                    $scope.onBuscar = function () {
                        that.Buscar();
                    };

                    that.guardarRotacion = function ($modalInstance) {
//                        var fecha = new Date();
//                        var fecha_rotacion = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
//                        var fecha_digitacion = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
                        var obj = {
                            session: $scope.session,
                            data: {
                                empresa_id: $scope.root.empresaSeleccionada.empresa_id,
                                bodega_id: $scope.root.farmaciaSeleccionada.bodega,
                                zonas_id: $scope.root.zonaSeleccionada.id,
                                fecha_rotacion: $scope.root.fecha_rotacion,
                                fecha_digitacion: $scope.root.fecha_digitacion
                            }
                        };
                        console.log("pasamirar que pasa",obj.data);
                        
                        Request.realizarRequest(
                                API.ROTACION.GUARDAR_ROTACION,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        that.listarRotacion();
                                        AlertService.mostrarVentanaAlerta("Respuesta del sistema", "Rotación guardado correctamente");
                                        return;
                                        $modalInstance.close();
                                    }
                                    AlertService.mostrarVentanaAlerta("Respuesta del sistema", "ERROR DE ROTACIÓN");
                                });
                    };
                    
                    that.modificarRotacion = function (parametros) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                fecha_rotacion: parametros.fecha_rotacion,
                                fecha_digitacion: parametros.fecha_digitacion,
                                id_registro: parametros.id_registro,
                                bodega_id: parametros.farmaciaSeleccionada.bodega
                            }
                        };
                        Request.realizarRequest(
                                API.ROTACION.MODIFICAR_ROTACION,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        var listado = obj.data;
                                        that.Buscar(parametros.farmaciaSeleccionada.descripcion);
                                       

                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Rotación modificada correctamente");
                                        return;
                                    }
                                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error de rotación");
                                }
                        );
                    };


                    that.listarRotacion = function () {
                        var obj = {
                            session: $scope.session,
                            data: {
                            }
                        };
                        Request.realizarRequest(
                                API.ROTACION.LISTAR_ROTACION,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        $scope.root.listarRotacion = data.obj.listarRotacion;
                                    } else {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "ERROR LISTAR ROTACIÓN");
                                    }
                                });
                    };

                    that.listarEmpresas = function () {
                        var obj = {
                            session: $scope.session,
                            data: {}
                        };
                        Request.realizarRequest(
                                API.ROTACION.LISTAR_EMPRESAS,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        $scope.root.empresa = data.obj.listarEmpresas;
                                    } else {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                    }
                                }
                        );
                    };
                    
                    that.listarZonas = function () {
                        var obj = {
                            session: $scope.session,
                            data: {}
                        };
                        Request.realizarRequest(
                                API.ROTACION.LISTAR_ZONAS,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        $scope.root.zona = data.obj.listarZonas;
                                    } else {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                    }
                                }
                        );
                    };

                    that.listarFarmacias = function () {
                        var obj = {
                            session: $scope.session,
                            data: {}
                        };
                        Request.realizarRequest(
                                API.ROTACION.LISTAR_FARMACIAS,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        $scope.root.farmacia = data.obj.listarFarmacias;
                                    } else {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                                    }
                                }
                        );
                    };


                    that.eliminarRotacion = function (parametro, callback) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                id_registro: parametro.id_registro
                            }
                        };
                        Request.realizarRequest(
                                API.ROTACION.ELIMINAR_ROTACION,
                                "POST",
                                obj,
                                function (data) {
                                    if (data.status === 200) {
                                        that.listarRotacion({id: ""}, function (dato) {
                                            $scope.root.listarRotacion = dato;
                                            that.listarRotacion();
                                        });
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Rotación eliminada correctamente");
                                        callback(true);
                                        return;
                                    } else {
                                        AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Error al eliminar rotación");
                                        callback(false);
                                    }
                                }
                        );
                    };

                    $scope.lista_rotacion = {
                        data: 'root.listarRotacion',
                        multiSelect: false,
                        enableHighlighting: true,
                        showFilter: true,
                        enableRowSelection: false,
                        enableColumnResize: true,
                        columnDefs: [
                            {field: 'farmacias', displayName: 'FARMACIA', width: "25%"},
                            {field: 'zonas', displayName: "ZONA", width: "13%"},
                            {field: 'empresas', displayName: "EMPRESA", width: "15%"},
                            {field: 'fecha_rotacion', displayName: "FECHA ROTACIÓN", width: "12%", cellClass: "txt-center dropdown-button"},
                            {field: 'fecha_digitacion', displayName: 'FECHA DIGITACIÓN', width: "12%", cellClass: "txt-center dropdown-button"},
                            {displayName: 'TIEMPO TRANSCURRIDO', cellClass: "txt-center dropdown-button", width: "15%",
                                cellTemplate: ' <div class="row" >\
                                             <button style="width:70px; height:25px" ng-class="tiempoTranscurrido(row.entity.tiempo_transcurrido)"><span ng-style="tiempoTranscurrido(row.entity.tiempo_transcurrido)">{{row.entity.tiempo_transcurrido}} Dias</span></button> \
                                           </div>'
                            },
                            {displayName: 'ACCIONES', cellClass: "txt-center dropdown-button", width: "8%",
                                cellTemplate: ' <div class="row" >\
                                          <label> \
                                           <button title="ELIMINAR INFORMACIÓN" data-toggle="tolltip"  ng-click="onEliminar(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-trash"></span></button>\
                                           <button title="MODIFICAR INFORMACIÓN" data-toggle="tolltip"  ng-click="onVerModificar(row.entity)" class="btn btn-default btn-xs"><span class="glyphicon glyphicon-edit"></span></button>\
                                            </label>\
                                         </div>\
                                       </div>'
                            }
                        ]
                    };
                    
                    $scope.tiempoTranscurrido= function(tiempoTranscurrido){
                        var color;
                       if(tiempoTranscurrido >=25){
                            color="btn btn-danger disabled";
                       }else{
                           color="btn btn-success disabled";
                       }
                       return color;
                    };

                    that.verModificarRotacion = function (form) {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-ls-xlg-ls',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/gestionRotacion/modificarRotacion.html',
                            scope: $scope,
                            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                    $scope.editar = {};
                                    $scope.editar.fecha_rotacion = form.fecha_rotacion;
                                    $scope.editar.id_registro = form.id_registro;
                                    $scope.editar.fecha_digitacion = form.fecha_digitacion;
                                    $scope.editar.empresaSeleccionada = {empresa_id: form.empresa_id, razon_social: form.empresas};
                                    $scope.editar.farmaciaSeleccionada = {bodega: form.bodega_id, descripcion: form.farmacias};
                                    $scope.editar.zonaSeleccionada = {id: form.zonas_id, descripcion: form.zonas};
                                    $scope.onModificarRotacion = function () {
                                        that.modificarRotacion($scope.editar);
                                        $modalInstance.close();
                                    };

                                    $scope.cancelar = function () {
                                        $modalInstance.close();
                                    };

                                    $scope.abrir_fecha_rotacion_editar = function ($event) {
                                        $event.preventDefault();
                                        $event.stopPropagation();
                                        $scope.abrir_fecha_rotacion = $scope.abrir_fecha_rotacion ? false : true;
                                    };
                                    $scope.abrir_fecha_digitacion_editar = function ($event) {
                                        $event.preventDefault();
                                        $event.stopPropagation();
                                        $scope.abrir_fecha_digitacion = $scope.abrir_fecha_digitacion ? false : true;
                                    };

                                    ;
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                    };

                    that.anadirInformacion = function (form) {
                        $scope.opts = {
                            backdrop: true,
                            backdropClick: true,
                            dialogFade: false,
                            windowClass: 'app-modal-window-ls-xlg-ls',
                            keyboard: true,
                            showFilter: true,
                            cellClass: "ngCellText",
                            templateUrl: 'views/gestionRotacion/newRotacion.html',
                            scope: $scope,
                            controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                                    $scope.onGuardarRotacion = function () {
                                        if ($scope.root.fecha_rotacion === '') {
                                            AlertService.mostrarVentanaAlerta("Mensaje del Sistema", "Digite la fecha de la rotación");
                                            return;
                                        }
                                        if ($scope.root.empresaSeleccionada === '') {
                                            AlertService.mostrarVentanaAlerta("Mensaje del Sistema", "Digite la empresa de la rotación");
                                            return;
                                        }
                                        if ($scope.root.farmaciaSeleccionada === '') {
                                            AlertService.mostrarVentanaAlerta("Mensaje del Sistema", "Digite la farmacia de la rotación");
                                            return;
                                        }
                                        if ($scope.root.zonaSeleccionada === '') {
                                            AlertService.mostrarVentanaAlerta("Mensaje del Sistema", "Digite la zona de la rotación");
                                            return;
                                        }
                                        that.guardarRotacion();
                                        that.limpiarCampos();
                                        $modalInstance.close();
                                    };
                                    $scope.cancelar = function () {
                                        $modalInstance.close();
                                    };
                                    $scope.abrir_fecha_rotacionN = function ($event) {
                                        $event.preventDefault();
                                        $event.stopPropagation();
                                        $scope.abrir_fecha_rotacion = $scope.abrir_fecha_rotacion ? false : true;
                                    };
                                    $scope.abrir_fecha_digitacionN = function ($event) {
                                        $event.preventDefault();
                                        $event.stopPropagation();
                                        $scope.abrir_fecha_digitacion = $scope.abrir_fecha_digitacion ? false : true;
                                    };
                                    ;
                                }]
                        };
                        var modalInstance = $modal.open($scope.opts);
                        modalInstance.result.then(function () {
                            that.listarRotacion();
                        }, function () {});
                    };

                    that.limpiarCampos = function () {
                        $scope.root.fecha_digitacion = [];
                        $scope.root.fecha_rotacion = [];
                        $scope.root.empresaSeleccionada = '';
                        $scope.root.zonaSeleccionada = '';
                        $scope.root.farmaciaSeleccionada = '';
                    };

                    $scope.onEliminar = function (parametro) {
                        that.eliminarRotacion(parametro, function () {
                            that.listarRotacion(parametro, function () {
                            });
                        });
                    };

                    $scope.onAnadirInformacion = function () {
                        that.anadirInformacion();
                    };

                    $scope.onVerModificar = function (datos) {
                        that.verModificarRotacion(datos);
                    };

                    that.init = function () {
                        var that = this;
                        that.listarRotacion();
                        that.listarEmpresas();
                        that.listarZonas();
                        that.listarFarmacias();
                    };
                    that.init();
                }]);
        });