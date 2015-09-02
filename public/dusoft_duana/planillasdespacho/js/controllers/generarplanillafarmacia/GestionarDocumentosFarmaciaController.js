
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
        "Usuario","$filter",
        function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
                Empresa, ClientePlanilla, FarmaciaPlanilla, Documento, Sesion, $filter) {

            var that = this;

            $scope.paginaactual = 1;
            
            var fecha_actual = new Date();
            /**
             * +Descripcion: Evento que se ejecuta en el momento que se 
             * visualiza la plantilla al cargar el slider
             */
            $rootScope.$on('gestionar_documentos_farmaciaCompleto', function(e, parametros) {


                $scope.datos_view = {
                  
                    termino_busqueda_documentos: '',
                    documento_seleccionado: Documento.get(),
                    fecha_inicial: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
                    fecha_final: $filter('date')(fecha_actual, "yyyy-MM-dd"),
                };

            });
            $scope.datos_view.fecha_inicial = $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd");
            $scope.datos_view.fecha_final =  $filter('date')(fecha_actual, "yyyy-MM-dd");
            
            $rootScope.$on('cerrar_gestion_documentos_bodegaCompleto', function(e, parametros) {
                $scope.$$watchers = null;
            });
            
              $scope.buscador_documentos = function(ev) {
                if (ev.which === 13) {
                    console.log("ENTER ", $scope.datos_view.termino_busqueda_documentos)
                    $scope.datos_view.datepicker_fecha_inicial = false;
                    $scope.datos_view.datepicker_fecha_final = false;
                    
                    that.traerDocumentosFarmacias(function(){
                        
                    })
                    //$scope.consultar_documentos_planilla_despacho();
                }
                $scope.datos_view.datepicker_fecha_inicial = false;
                $scope.datos_view.datepicker_fecha_final = false;
            };
            /**
             * @author Cristian Ardila
             * @param {evento} ng-click
             * +Descripcion: funcion encargada de ejecutar al momento de
             * desplegar el date picker para la fecha inicial
             */
            $scope.abrir_fecha_inicial = function($event) {

                $event.preventDefault();
                $event.stopPropagation();
                $scope.datos_view.datepicker_fecha_inicial = true;
                $scope.datos_view.datepicker_fecha_final = false;
               

            };

            /**
             * @author Cristian Ardila
             * @param {evento} ng-click
             * +Descripcion: funcion encargada de ejecutar al momento de
             * desplegar el date picker para la fecha final
             */
            $scope.abrir_fecha_final = function($event) {

                $event.preventDefault();
                $event.stopPropagation();

                $scope.datos_view.datepicker_fecha_inicial = false;
                $scope.datos_view.datepicker_fecha_final = true;

            };

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
            that.ingresar_documentos_planilla = function(callback) {

                $scope.planilla.set_documento($scope.datos_view.documento_seleccionado);
                $scope.planilla.get_documento().set_empresa_id($scope.planilla.get_empresa().getCodigo());
       
                var obj = {
                    session: $scope.session,
                    data: {
                        planillas_farmacia: {
                            id_inv_planilla_farmacia_devolucion: $scope.planilla.get_numero_guia(),
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
                        $scope.planilla.set_documentos($scope.datos_view.documento_seleccionado);
                        $scope.datos_view.documento_seleccionado = Documento.get();

                        //console.log($scope.datos_view.documento_seleccionado)
                        //  $scope.buscar_documentos_bodega($scope.datos_view.tercero_seleccionado);
                        callback(true);
                    } else {

                        // AlertService.mostrarMensaje("warning", data.msj);
                        callback(false);
                    }
                });

            };

            $scope.confirmRegistroDocumentoDevolucion = function(documento) {
                that.registrarDocumentoFarmacia(documento);
            };
            /**
             * +Descripcion: function que invocara funcion encargada de ejecutar dos servicios
             * generar planillas e ingresar documentos planilla
             * @param {type} documento
             * @returns {undefined}
             */
            that.registrarDocumentoFarmacia = function(documento) {
                $scope.datos_view.documento_seleccionado = documento;

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
                    if ($scope.planilla.get_numero_guia() === 0) {

                        $scope.planilla.set_numero_guia(idUltimoRegistroPFD);

                        AlertService.mostrarMensaje("warning", data.msj);

                        if (data.status === 200) {

                            callback(true);

                        } else {
                            callback(false);
                        }

                    } else {

                        callback(true);
                    }

                });
            };
            that.gestionar_planilla_farmacia = function(callback) {


                var documentoSeleccionado = $scope.datos_view.documento_seleccionado;

                Empresa.eliminarDocumento(documentoSeleccionado);

                if ($scope.planilla.get_numero_guia() === 0) {

                    that.generar_planilla_farmacia(function(continuar) {


                        if (continuar) {

                            that.ingresar_documentos_planilla(function(continuar) {

                                if (callback)
                                    callback(continuar);
                            });
                        } else {

                            if (callback)
                                callback(continuar);
                        }
                    });
                } else {

                    //  that.generar_planilla_farmacia(function(continuar) {


                    //  if (continuar) {

                    that.ingresar_documentos_planilla(function(continuar) {

                        if (callback)
                            callback(continuar);
                    });
                    // } else {

                    //  if (callback)
                    //  callback(continuar);
                    /*}
                     });*/
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
            that.traerDocumentosFarmacias = function(callback) {

              
                var empresa = Sesion.getUsuarioActual().getEmpresa();
                var obj = {
                    session: $scope.session,
                    data: {
                        parametros:
                                {
                                    empresa: empresa.getCodigo(),
                                    centroUtilidad: empresa.getCentroUtilidadSeleccionado().getCodigo(),
                                    bodega: empresa.getCentroUtilidadSeleccionado().getBodegaSeleccionada().getCodigo(),
                                    pagina: $scope.paginaactual,
                                    terminoBusqueda: $scope.datos_view.termino_busqueda_documentos,
                                    fechaInicial:$filter('date')($scope.datos_view.fecha_inicial, "yyyy-MM-dd"), 
                                    fechaFinal: $filter('date')($scope.datos_view.fecha_final, "yyyy-MM-dd")
                                }
                    }
                };
                Request.realizarRequest(API.PLANILLAS_FARMACIAS.LISTAR_DOCUMENTOS, "POST", obj, function(data) {

                    if (data.status === 200) {
                        
                        $scope.items = data.obj.listar_documentos.length;
                        
                        //se limpia la grid cada vez que realice una nueva paginacion
                        Empresa.limpiar_lista_documentos();
                        if (data.obj.listar_documentos.length === 0) {
                            $scope.paginaactual = 1;
                        } else {
                            that.renderDocumentoFarmacia(data);
                            callback();

                        }
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


            /**
             * @param {N/N}
             * @author Cristian Ardila
             * @returns {int} paginaactual
             * +Descripcion: funcion que se invoca al presionar click
             * en el boton izquiero (<) del paginador del gridview
             * y aumentara en 1 la pagina actual, refrescando la gridview
             * de los documentos
             */
            $scope.paginaAnterior = function() {
                if ($scope.paginaactual === 1)
                    return;
                $scope.paginaactual--;
                that.traerDocumentosFarmacias(function() {
                });
            };

            /**
             * @param {N/N}
             * @author Cristian Ardila
             * @returns {int} paginaactual
             * +Descripcion: funcion que se invoca al presionar click
             * en el boton derecho (>) del paginador del gridview
             * y aumentara en 1 la pagina actual, refrescando la gridview
             * de los documentos
             */
            $scope.paginaSiguiente = function() {
                $scope.paginaactual++;
                that.traerDocumentosFarmacias(function() {
                });
            };
            /*
             * 
             * @param {type} selected
             * @Author: Cristian Ardila
             * @returns {void}
             *+Descripcion: metodo handler el cual se comunicara con la
             * vista y carga el componente gridview
             */
            $scope.onListarDocumentos = function(callback) {

                $scope.paginaactual = 1;
                that.traerDocumentosFarmacias(function() {

                });
            }

            $scope.onListarDocumentos();


            $scope.validar_ingreso_documento = function(documento) {


                var disabled = false;

                // Validar que el prefijo y el numero del documento esten presentes
                if (documento.get_prefijo() === undefined || documento.get_numero() === undefined) {
                    return true;
                }

                if (documento.get_prefijo() === '' || documento.get_numero() === '' || documento.get_numero() === 0) {
                    return true;
                }

                // Validar que las cantidad de cajas no sean 0 o vacias                                
                if (documento.get_cantidad_cajas() === '' || documento.get_cantidad_cajas() === 0) {
                    disabled = true;

                }

                // Validar que si ingresar solamente cajas y no ingresa neveras, no debe ingresar temperatura
                if (documento.get_cantidad_cajas() !== '' && documento.get_cantidad_cajas() !== 0) {
                    disabled = false;
                    if (documento.get_temperatura_neveras() !== '') {
                        disabled = true;
                    }
                }
                // Validar que si ingresar neveras, obligatoriamente ingresen la temperatura de la nevera
                if (documento.get_cantidad_neveras() !== '' && documento.get_cantidad_neveras() !== 0) {
                    disabled = false;
                    if (documento.get_temperatura_neveras() === '') {
                        disabled = true;
                    }
                }

                return disabled;
            };


            $scope.lista_remisiones_bodega = {
                data: 'Empresa.get_lista_documentos()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {displayName: 'Prefijo', width: "10%", cellTemplate: '<label ng-model="row.entity.prefijo">{{row.entity.prefijo}}<label/> <label ng-model="row.entity.numero">({{row.entity.numero}}) <label/> '},
                    //  {field: 'get_prefijo()', displayName: 'Prefijo', width: "10%"},
                    {field: 'get_bodegas_doc_id()', displayName: 'bodega documento id', width: "15%", visible: false},
                    {field: 'get_numero()', displayName: 'numero', width: "10%", visible: false},
                    {field: 'get_fecha_registro()', displayName: 'Fecha registro', width: "15%"},
                    {field: 'cantidad_cajas', displayName: 'Cajas', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_cajas" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'cantidad_neveras', displayName: 'Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.cantidad_neveras" validacion-numero-entero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {field: 'temperatura_neveras', displayName: '°C Nevera', width: "15%", cellTemplate: '<div class="col-xs-12"> <input type="text" ng-model="row.entity.temperatura_neveras" validacion-numero class="form-control grid-inline-input" name="" id="" /> </div>'},
                    {displayName: "Opciones", cellClass: "txt-center dropdown-button", width: "5%",
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