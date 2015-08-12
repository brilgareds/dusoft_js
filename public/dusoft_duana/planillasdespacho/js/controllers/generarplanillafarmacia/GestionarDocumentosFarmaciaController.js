
define(["angular", "js/controllers",
], function(angular, controllers) {

    controllers.controller('GestionarDocumentosFarmaciaController', [
        '$scope',
        '$rootScope',
        'Request',
        '$modal',
        'API',
        "socket",
        "$timeout",
        "AlertService",
        "localStorageService",
        "$state",
        "EmpresaPlanillaDespacho",
        "ClientePlanillaDespacho",
        "FarmaciaPlanillaDespacho",
        "Documento",
        "Usuario",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Empresa, ClientePlanilla, FarmaciaPlanilla, Documento, Sesion) {

            var that = this;


            /**
             * +Descripcion: Evento que se ejecuta en el momento que se 
             * visualiza la plantilla al cargar el slider
             */
            $rootScope.$on('gestionar_documentos_farmaciaCompleto', function(e, parametros) {


                $scope.datos_view = {
                    // opcion_predeterminada: "0", // 0 = farmacias 1 = clientes 2 = Otras Empresas
                    //  termino_busqueda: '',
                    //  termino_busqueda_documentos: '',
                    // tercero_seleccionado: FarmaciaPlanilla.get(), // tercero_seleccionado es una Farmacia por ser la opcion_predeterminada = 0
                     documento_seleccionado: Documento.get()
                };

                //  $scope.seleccionar_cliente_farmacia();

            });
            //  console.log("AQUI")

            $rootScope.$on('cerrar_gestion_documentos_bodegaCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });



            /*   $scope.buscador_documentos = function(ev) {
             
             if (ev.which == 13) {
             $scope.buscar_documentos_bodega($scope.datos_view.tercero_seleccionado);
             }
             };*/

            //  $scope.seleccionar_cliente_farmacia = function() {


            // $scope.datos_view.tercero_seleccionado.limpiar_documentos();
            //$scope.datos_view.termino_busqueda = '';
            //  $scope.datos_view.termino_busqueda_documentos = '';
            //  $scope.datos_view.documento_seleccionado = Documento.get();
            /// console.log($scope.datos_view.documento_seleccionado)
            /*  if ($scope.datos_view.opcion_predeterminada === "0") {
             that.buscar_farmacias();
             }
             
             if ($scope.datos_view.opcion_predeterminada === "1") {
             that.buscar_clientes();
             }*/

            // };

            /*     that.buscar_clientes = function() {
             
             
             var obj = {
             session: $scope.session,
             data: {
             clientes: {
             empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
             pais_id: $scope.planilla.get_ciudad().get_pais_id(),
             departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
             ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
             termino_busqueda: $scope.datos_view.termino_busqueda
             }
             }
             };
             
             Request.realizarRequest(API.CLIENTES.LISTAR_CLIENTES, "POST", obj, function(data) {
             
             if (data.status === 200) {
             that.render_clientes(data.obj.listado_clientes);
             
             }
             });
             };
             
             that.render_clientes = function(clientes) {
             
             
             $scope.Empresa.limpiar_clientes();
             
             clientes.forEach(function(data) {
             
             var cliente = ClientePlanilla.get(data.nombre_tercero, data.direccion, data.tipo_id_tercero, data.tercero_id, data.telefono);
             $scope.Empresa.set_clientes(cliente);
             });
             
             };*/

            /* that.buscar_farmacias = function() {
             
             var obj = {
             session: $scope.session,
             data: {
             centro_utilidad: {
             pais_id: $scope.planilla.get_ciudad().get_pais_id(),
             departamento_id: $scope.planilla.get_ciudad().get_departamento_id(),
             ciudad_id: $scope.planilla.get_ciudad().get_ciudad_id(),
             termino_busqueda: $scope.datos_view.termino_busqueda
             }
             }
             };
             
             Request.realizarRequest(API.CENTROS_UTILIDAD.LISTAR_CENTROS_UTILIDAD, "POST", obj, function(data) {
             
             if (data.status === 200) {
             that.render_farmacias(data.obj.centros_utilidad);
             
             }
             });
             };
             
             that.render_farmacias = function(farmacias) {
             
             $scope.Empresa.limpiar_farmacias();
             
             farmacias.forEach(function(data) {
             
             var farmacia = FarmaciaPlanilla.get(data.empresa_id, data.centro_utilidad_id, data.descripcion);
             $scope.Empresa.set_farmacias(farmacia);
             });
             
             };*/


            /*   $scope.buscar_documentos_bodega = function(tercero) {
             
             $scope.datos_view.tercero_seleccionado = tercero;
             
             
             if ($scope.datos_view.opcion_predeterminada === "0") {
             that.documentos_bodega_farmacias();
             }
             
             if ($scope.datos_view.opcion_predeterminada === "1") {
             that.documentos_bodega_clientes();
             }
             };
             
             that.documentos_bodega_clientes = function() {
             
             var obj = {
             session: $scope.session,
             data: {
             planillas_despachos: {
             empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
             tipo_id: $scope.datos_view.tercero_seleccionado.getTipoId(),
             tercero_id: $scope.datos_view.tercero_seleccionado.getId(),
             termino_busqueda: $scope.datos_view.termino_busqueda_documentos
             }
             }
             };
             
             Request.realizarRequest(API.PLANILLAS.LISTAR_DOCUMENTOS_CLIENTES, "POST", obj, function(data) {
             
             if (data.status === 200) {
             that.render_documentos(data.obj.planillas_despachos);
             }
             });
             };*/

            /*    that.documentos_bodega_farmacias = function() {
             
             var obj = {
             session: $scope.session,
             data: {
             planillas_despachos: {
             empresa_id: Sesion.getUsuarioActual().getEmpresa().getCodigo(),
             farmacia_id: $scope.datos_view.tercero_seleccionado.get_empresa_id(),
             centro_utilidad_id: $scope.datos_view.tercero_seleccionado.getCodigo(),
             termino_busqueda: $scope.datos_view.termino_busqueda_documentos
             }
             }
             };
             
             Request.realizarRequest(API.PLANILLAS.LISTAR_DOCUMENTOS_FARMACIAS, "POST", obj, function(data) {
             
             if (data.status === 200) {
             
             that.render_documentos(data.obj.planillas_despachos);
             }
             });
             };
             
             that.render_documentos = function(documentos) {
             
             $scope.datos_view.tercero_seleccionado.limpiar_documentos();
             
             documentos.forEach(function(data) {
             
             var documento = Documento.get(0, data.empresa_id, data.prefijo, data.numero, data.numero_pedido);
             
             documento.set_cantidad_cajas_auditadas(data.total_cajas);
             documento.set_cantidad_neveras_auditadas(data.total_neveras);
             
             $scope.datos_view.tercero_seleccionado.set_documentos(documento);
             });
             
             };*/

            /**
             * @author Cristian Manuel Ardila
             * +Descripcion: Metodo que se ejecutara cuando se presione click en el
             * boton (Aceptar) de la view (gestionardocumentosfarmacia.html)
             * y se encargara de registrar los documentos de devoluciones
             */
            $scope.aceptar_documentos_bodegas = function() {

                if ($scope.datos_view.opcion_predeterminada === "2") {

                    $scope.datos_view.documento_seleccionado.set_empresa_id(Sesion.getUsuarioActual().getEmpresa().getCodigo());

                    that.gestionar_planilla_despacho(function(continuar) {
                        if (continuar)
                            $scope.cerrar_gestion_documentos_bodega();
                    });
                } else {
                    $scope.cerrar_gestion_documentos_bodega();
                }
            };




            /**
             * @author Cristian Manuel Ardila
             * @param {type} callback
             * @returns {undefined}
             * +Descripcion: funcion encargada de registrar el detallado de la 
             * devolucion
             * 
             */
            that.ingresar_documentos_planilla = function(id,callback) {
                
              $scope.planilla.set_documento($scope.datos_view.documento_seleccionado);
              $scope.planilla.get_documento().set_empresa_id($scope.planilla.get_empresa().getCodigo());
              //$scope.planilla.get_documento().set_observacion($scope.planilla.get_observacion());
                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_farmacia: {
                          
                            id_inv_planilla_farmacia_devolucion: id,
                            empresa_id: $scope.planilla.get_documento().get_empresa_id(),
                            prefijo: $scope.planilla.get_documento().get_prefijo(),
                            numero: $scope.planilla.get_documento().get_numero(),
                            cantidad_cajas: $scope.planilla.get_documento().get_cantidad_cajas(),
                            cantidad_neveras: $scope.planilla.get_documento().get_cantidad_neveras(),
                            temperatura_neveras: $scope.planilla.get_documento().get_temperatura_neveras(),
                            observacion: ''
                           
                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS_FARMACIAS.INGRESAR_DOCUMENTO_FARMACIA, "POST", obj, function(data) {

                    

                    if (data.status === 200) {
                        
                        AlertService.mostrarMensaje("warning", data.msj);
                       // $scope.planilla.set_documentos($scope.datos_view.documento_seleccionado);
                      //  $scope.datos_view.documento_seleccionado = Documento.get();

                      //  $scope.buscar_documentos_bodega($scope.datos_view.tercero_seleccionado);

                        callback(true);
                    } else {
                        callback(false);
                    }
                });

            };

            $scope.confirmRegistroDocumentoDevolucion = function(documento) {

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
                                                <h4 >Confirma que registrara el documento de devolucion con el seiguiente detalle:<br><br>\
                                                <b>DOCUMENTO:</b>' + documento.get_prefijo() + '(' + documento.get_numero() + ')' + '<br>\
                                                <b>FECHA DE REGISTRO:</b>' + documento.get_fecha_registro() + '<br>\
                                            </div>\
                                        </div>\
                                        <div class="modal-footer">\
                                            <button class="btn btn-primary" ng-click="close()" ng-disabled="" >Cancelar</button>\
                                            <button class="btn btn-primary" ng-click="confirmar()" ng-disabled="" >Confirmar</button>\
                                        </div>',
                    scope: $scope,
                    controller: function($scope, $modalInstance) {
                        $scope.close = function() {
                            $modalInstance.close();
                        };

                        $scope.confirmar = function() {
                            $modalInstance.close();
                            that.registrarDocumentoFarmacia(documento);
                            
                        };
                    }
                };

                var modalInstance = $modal.open($scope.opts);
            };
            /**
             * +Descripcion: function que invocara funcion encargada de ejecutar dos servicios
             * generar planillas e ingresar documentos planilla
             * @param {type} documento
             * @returns {undefined}
             */
            that.registrarDocumentoFarmacia = function(documento) {
                console.log(documento)
                $scope.datos_view.documento_seleccionado = documento;
                //(documento.get_cantidad_cajas() == documento.get_cantidad_cajas_auditadas() && documento.get_cantidad_neveras() == documento.get_cantidad_neveras_auditadas())
                //console.log("registrarDocumentoFarmacia>>>>>>>>>>>>>>>>>>>>>>");
               // console.log($scope.datos_view.documento_seleccionado);
               
                that.gestionar_planilla_farmacia(function() {

                });

            };

            /**
             * @author Cristian Manuel Ardila
             * @param {type} callback
             * @returns {undefined}
             * +Descripcion: funcion encargada de registrar el detallado de la persona
             * encargada de transportar la devolucion,el origen y el destino 
             * 
             */
            that.generar_planilla_farmacia = function(callback) {

                var empresa = Sesion.getUsuarioActual().getEmpresa();

                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_farmacia: {
                            empresa_id: empresa.getCodigo(),
                            centro_utilidad: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                            bodega: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                            id_empresa_destino: $scope.planilla.get_empresa().getCodigo(),
                            transportador_id: $scope.planilla.get_transportadora().get_id(),
                            nombre_conductor: $scope.planilla.get_nombre_conductor(),
                            observacion: $scope.planilla.get_observacion(),
                            numero_guia_externo: $scope.planilla.get_numero_guia_externo()

                        }
                    }
                };

                Request.realizarRequest(API.PLANILLAS_FARMACIAS.GENERAR_PLANILLA_FARMACIA, "POST", obj, function(data) {
                    var idUltimoRegistroPFD = data.obj.id_inv_planilla_farmacia_devolucion[0].id_inv_planilla_farmacia_devolucion;
                    AlertService.mostrarMensaje("warning", data.msj);
                   // console.log();
                    if (data.status === 200) {
                        $scope.planilla.set_numero_guia(data.obj.numero_guia);
                        callback(true,idUltimoRegistroPFD);
                        
                    } else {
                        callback(false,idUltimoRegistroPFD);
                    }
                });
            };
            that.gestionar_planilla_farmacia = function(callback) {
                /* console.log("gestionar_planilla_despacho")
                 console.log($scope.datos_planillas);
                 console.log($scope.planilla);*/
                // $scope.planilla.set_documento($scope.datos_view.documento_seleccionado);

                if ($scope.planilla.get_numero_guia() === 0) {

                    that.generar_planilla_farmacia(function(continuar,idUltimoRegistroPFD) {

                      
                        if (continuar) {

                            that.ingresar_documentos_planilla(idUltimoRegistroPFD,function(continuar) {

                                if (callback)
                                    callback(continuar);
                            });
                        } else {
                            if (callback)
                                callback(continuar);
                        }
                    });
                } else {
                     that.generar_planilla_farmacia(function(continuar,idUltimoRegistroPFD) {

                    
                        if (continuar) {

                            that.ingresar_documentos_planilla(idUltimoRegistroPFD,function(continuar) {

                                if (callback)
                                    callback(continuar);
                            });
                        } else {
                            if (callback)
                                callback(continuar);
                        }
                    });
                }
            };
            /*
             * 
             * @param {type} selected
             * @Author: Cristian Ardila
             * @returns {void}
             * +Descripcion: metodo el cual se encarga ejecutar 
             * las peticiones al servidor y traer los documentos de farmacias
             */
            $scope.traerDocumentosFarmacias = function() {


                var empresa = Sesion.getUsuarioActual().getEmpresa();

                var obj = {
                    session: $scope.session,
                    data: {
                        parametros:
                                {
                                    empresa: empresa.getCodigo(),
                                    centroUtilidad: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                                    bodega: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                                }
                    }
                };


                Request.realizarRequest(API.PLANILLAS_FARMACIAS.LISTAR_DOCUMENTOS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        that.renderDocumentoFarmacia(data);

                    } else {
                        AlertService.mostrarMensaje("warning", data.msj)
                    }
                });

            }

            that.renderDocumentoFarmacia = function(documentos) {

                $scope.Empresa.limpiar_empresas();
                var empresas = Sesion.getUsuarioActual().getEmpresasUsuario();

                $scope.Empresa.limpiar_empresas();

                empresas.forEach(function(empresa) {
                    $scope.Empresa.set_empresas(empresa);
                });

                that.obtenerListaDocumentos(documentos);

            }


            that.obtenerListaDocumentos = function(documentos) {

                for (var i in documentos.obj.listar_documentos) {

                    var _documentos = documentos.obj.listar_documentos[i];
                    var documento = Documento.get(_documentos.bodegas_doc_id, "", _documentos.prefijo, _documentos.numero, "", "", "", "", "", "");
                    documento.set_fecha_registro(_documentos.fecha_registro);
                    $scope.Empresa.set_lista_documentos(documento);
                }
            }

            $scope.traerDocumentosFarmacias();

            $scope.lista_remisiones_bodega = {
                data: 'Empresa.get_lista_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {displayName: 'Prefijo', width: "10%", cellTemplate: '<label ng-model="row.entity.prefijo">{{row.entity.prefijo}}<label/> <label ng-model="row.entity.numero">({{row.entity.numero}}) <label/> '},
                    //  {field: 'get_prefijo()', displayName: 'Prefijo', width: "10%"},
                    {field: 'get_bodegas_doc_id()', displayName: 'bodega documento id', width: "15%", visible: false},
                    {field: 'get_numero()', displayName: 'numero', width: "10%", visible: false},
                    {field: 'get_fecha_registro()', displayName: 'Fecha registro', width: "10%"},
                    {field: 'cantidad_cajas', displayName: 'Cajas', width: "10%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'cantidad_neveras', displayName: 'Nevera', width: "10%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_neveras" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'temperatura_neveras', displayName: '°C Nevera', width: "10%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.temperatura_neveras" validacion-numero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button",
                        cellTemplate: '<div class="btn-group">\
                                            <button class="btn btn-default btn-xs" ng-click="confirmRegistroDocumentoDevolucion(row.entity)" ng-disabled="validar_ingreso_documento(row.entity)" ><span class="glyphicon glyphicon-ok"></span></button>\
                                        </div>'
                    }
                ]
            };



            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.$$watchers = null;
            });
        }]);
});