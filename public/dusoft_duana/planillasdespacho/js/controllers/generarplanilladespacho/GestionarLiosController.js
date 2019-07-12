define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('GestionarLiosController', [
        '$scope', '$rootScope', 'Request', '$modal',
        '$modalInstance', 'API', "socket", "AlertService",
        "Usuario", "documentos", "tipo", "numeroGuia",
        function ($scope, $rootScope, Request, $modal,
                $modalInstance, API, socket, AlertService,
                Usuario, documentos, tipo, numeroGuia) {


            var self = this;


            self.init = function () {
                $scope.root = {
                    cantidadCajas: 0,
                    cantidadLios: 0,
                    cantidadNeveras: 0,
                    cantidadBolsas: 0,
                    observacion: "",
                    tipo: tipo
                };

                $scope.root.session = {
                    usuario_id: Usuario.getUsuarioActual().getId(),
                    auth_token: Usuario.getUsuarioActual().getToken()
                };

                $scope.root.documentos = documentos;

            };

            self.validarLios = function () {
                var cantidadCajas = parseInt($scope.root.cantidadCajas);
                var cantidadLios = parseInt($scope.root.cantidadLios);
                var cantidadNeveras = parseInt($scope.root.cantidadNeveras);
                var cantidadBolsas = parseInt($scope.root.cantidadBolsas);

                if (isNaN(cantidadCajas) || isNaN(cantidadLios) || isNaN(cantidadNeveras) || isNaN(cantidadBolsas) || cantidadLios === 0 || cantidadCajas < 0 || cantidadNeveras < 0
                        || cantidadBolsas < 0 || (cantidadCajas === 0 && cantidadNeveras === 0 && cantidadBolsas === 0)) {
                    return false;
                } else if (!isNaN(cantidadCajas) && !isNaN(cantidadLios) &&
                        ((cantidadCajas > 0 && cantidadLios > cantidadCajas) || (cantidadNeveras > 0 && cantidadLios > cantidadNeveras) || (cantidadBolsas > 0 && cantidadLios > cantidadBolsas))) {
                    return false;
                }


                return true;

            };

            $modalInstance.opened.then(function () {
//                console.log("documentos ", documentos);

            });

            $modalInstance.result.then(function () {
                $scope.root.documentos = [];
                $scope.root = null;
                $rootScope.$emit("onLiosRegistrados");

            }, function () {
            });


            $scope.listaDocumentos = {
                data: 'root.documentos',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'lios', displayName: "", width: "40", cellClass: "txt-center dropdown-button", cellTemplate: "<div><input-check   ng-model='row.entity.seleccionado' ng-change='onAgregarDocumentoALio(row.entity)' ng-disabled='!datos_view.despachoPorLios'   /></div>"},
                    {field: 'get_descripcion()', displayName: 'Documento Bodega'}
                ]
            };

            $scope.cerrar = function () {
                $modalInstance.close();
            };

            $scope.cerrarLio = function () {
                $scope.gestionar_consultas();
                $scope.cerrar();
            };


            $scope.onIngresarLios = function () {

                if (!self.validarLios()) {
                    AlertService.mostrarVentanaAlerta("Alerta del sistema", "La cantidad de cajas, neveras, bolsas o lios no son correctos");

                    return;
                }

                if (tipo === 4) {
                    self.modificarLio();
                } else {
                    self.crearLio();
                }

            };

            //btn encargado de desplegar el modal de adicionar nuevos doc a un lio
            $scope.btn_adicionar_documento_lio = function () {
                self.mostrarVentanaAdjuntarDoc(documentos[0]);
            };



            self.mostrarVentanaAdjuntarDoc = function (documento) {
                $scope.opts = {
                    backdrop: 'static',
                    windowClass: 'app-modal-window-xlg-ls',
                    templateUrl: 'views/generarplanilladespacho/AdjuntarDocumentoALio.html',
                    scope: $scope,
                    controller: "AdjuntarDocumentoController",
                    resolve: {
                        documentoLio: function () {
                            return documento;
                        },
                        numeroGuia: function () {
                            return numeroGuia;
                        }
                    }

                };
                var modalInstance = $modal.open($scope.opts);

                modalInstance.result.then(function (doc) {
                    if (doc.length > 0) {
                        doc.forEach(function (data) {
                            $scope.root.documentos.push(data);
                        });
                    }
                });
            };



            /**
             * +Descripcion Metodo encargado de invocar el servicio que creara
             *              los lios
             * @author German Galvis
             * @fecha 26/04/2019 DD/MM/YYYY
             * @returns {undefined}
             */
            self.crearLio = function () {

                var totalCajas = 0;
                var totalNeveras = 0;
                var totalBolsas = 0;

                documentos.forEach(function (data) {
                    totalCajas += data.cantidad_cajas_auditadas;
                    totalNeveras += data.cantidad_neveras_auditadas;
                    totalBolsas += data.cantidad_bolsas_auditadas;
                });

                if (parseInt(totalCajas) !== parseInt($scope.root.cantidadCajas) || parseInt(totalNeveras) !== parseInt($scope.root.cantidadNeveras) || parseInt(totalBolsas) !== parseInt($scope.root.cantidadBolsas)) {
                    AlertService.mostrarVentanaAlerta("Alerta del sistema", "El número de cajas, neveras o bolsas es diferente al auditado.\n Nro cajas auditadas: " + totalCajas + "\
                                                      , Nro Neveras auditadas: " + totalNeveras + ", Nro Bolsas auditadas: " + totalBolsas);

                    return;
                }

                var obj = {
                    session: $scope.root.session,
                    data: {
                        planillas_despachos: {
                            documentos: documentos,
                            totalCaja: $scope.root.cantidadCajas,
                            cantidadLios: $scope.root.cantidadLios,
                            cantidadNeveras: $scope.root.cantidadNeveras,
                            cantidadBolsas: $scope.root.cantidadBolsas,
                            numeroGuia: numeroGuia,
                            observacion: $scope.root.observacion
                        }
                    }
                };


                Request.realizarRequest(API.PLANILLAS.GESTIONAR_LIOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Se ha guardado el registro correctamente");
                        $scope.cerrar();
                    } else if (data.status === 403) {

                        AlertService.mostrarVentanaAlerta("Alerta del sistema", data.msj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Ha ocurrido un error...");
                    }

                });
            };

            /**
             * +Descripcion Metodo encargado de invocar el servicio que modificara
             *              los lios
             * @author German Galvis
             * @fecha 26/04/2019 DD/MM/YYYY
             * @returns {undefined}
             */
            self.modificarLio = function () {

                var obj = {
                    session: $scope.root.session,
                    data: {
                        planillas_despachos: {
                            documentos: documentos,
                            totalCaja: $scope.root.cantidadCajas,
                            cantidadLios: $scope.root.cantidadLios,
                            cantidadNeveras: $scope.root.cantidadNeveras,
                            cantidadBolsas: $scope.root.cantidadBolsas,
                            numeroGuia: numeroGuia,
                            observacion: $scope.root.observacion
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS.MODIFICAR_LIOS, "POST", obj, function (data) {

                    if (data.status === 200) {
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Se ha modificado el registro correctamente");
                        $scope.gestionar_consultas();
                        $scope.cerrar();
                    } else if (data.status === 403) {

                        AlertService.mostrarVentanaAlerta("Alerta del sistema", data.msj);
                    } else {
                        AlertService.mostrarVentanaAlerta("Alerta del sistema", "Ha ocurrido un error...");
                    }

                });
            };

            self.init();


        }]);

});


