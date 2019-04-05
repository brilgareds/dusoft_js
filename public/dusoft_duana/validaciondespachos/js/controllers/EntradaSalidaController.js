define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('EntradaSalidaController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                'EmpresaAprobacionDespacho', 'CentroUtilidadInduccion', 'BodegaInduccion', 'ProductoInduccion', 'AprobacionDespacho',
                "$timeout", "$filter", "localStorageService", "$state", "ValidacionDespachosService",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        EmpresaAprobacionDespacho, CentroUtilidadInduccion, BodegaInduccion, ProductoInduccion, AprobacionDespacho,
                        $timeout, $filter, localStorageService, $state, ValidacionDespachosService) {

                    var that = this;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
         
                    var fecha_actual = new Date();
                    $scope.paginaactual = 1;
                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };

                    that.init = function (empresa, callback) {                        
                        
                        $scope.root = {
                            guardarButton : true,
                            modificarButton : false,
                            prefijo: "Prefijo",
                            registrosLength :0,
                            termino_busqueda_clientes:"",
                            pref: {},
                            operario: {},
                            cliente: {},
                            transportadora: {},
                            filtro: "",
                            empaques: [{id: 0, nombre: 'Caja'}, {id: 1, nombre: 'Nevera'}, {id: 2, nombre: 'Bolsa'}]
                        };
                        that.listarPrefijos();
                        that.listarOperarios();
                        that.limpiar();
                    };
                   
                    $scope.onColumnaSize = function (tipo) {

                        if (tipo === "AS" || tipo === "MS" || tipo === "CD") {
                            $scope.columnaSizeBusqueda = "col-md-4";
                        } else {
                            $scope.columnaSizeBusqueda = "col-md-4";
                        }

                    };

                    $scope.onSeleccionPrefijo = function (obj) {
                        $scope.root.prefijo = obj.prefijo;
                        $scope.root.termino_busqueda = '';
                    };
                    
                    $scope.filtro=function(){
                        $scope.registrosLength=0;
                       that.listarRegistroEntradaBodega();  
                    };

                    that.listarRegistroEntradaBodega = function () {
                         var obj = {
                            session: $scope.session,
                            busqueda : $scope.root.filtro,
                            pagina : $scope.paginaactual
                        };
                        
                        ValidacionDespachosService.listarRegistroEntrada(obj, function (data) {
                            if (data.status === 200) {
                                $scope.root.registrosLength = data.obj.listarRegistroEntrada.length;
                                $scope.root.listarRegistros=data.obj.listarRegistroEntrada;
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }
                        });
                    };
                    
                 /**
                 * +Descripcion Se visualiza la lista de los registros de bodega
                 */
             
                $scope.listaRegistros = {
                    data: 'root.listarRegistros',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    enableCellSelection: true,
                    enableHighlighting: true,
                    columnDefs: [
                        {field: 'prefijo_id', displayName: 'Prefijo', width: "5%"},
                        {field: 'numero', displayName: 'Numero', width: "5%"},
                        {field: 'nombre_transportadora', displayName: 'Transportadora', width: "10%"},
                        {field: 'numero_guia', displayName: 'Guia', width: "5%"},
                        {field: 'nombre_tercero', displayName: 'Cliente', width: "10%"},
                        {field: 'cantidad_caja', displayName: 'Caja', width: "5%"},
                        {field: 'cantidad_nevera', displayName: 'Nevera', width: "5%"},
                        {field: 'cantidad_bolsa', displayName: 'Bolsa', width: "5%"},
                        {field: 'nombre_operario', displayName: 'Operario', width: "10%"},
                        {field: 'observacion', displayName: 'Observacion', width: "10%"},
                        {field: 'nombre_usuario', displayName: 'Usuario', width: "10%"},
                        {field: 'fecha_registro', displayName: 'Fecha Registro', width: "10%"},
                        {field: 'detalle', width: "10%",
                            displayName: "Opciones",
                            cellClass: "txt-center",
                            cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="activar(row.entity)">Modificar</span></button></div>'

                        }
                    ]
                };
                  
                    $scope.activar = function(obj){
                        that.limpiar();
                        console.log("obj.operario",obj);
                        $scope.root.guardarButton = false;
                        $scope.root.modificarButton = true;
                        $scope.root.pref = {prefijo:obj.prefijo_id};
                        $scope.root.factura=obj.numero;
                        $scope.root.operario={nombre_operario:obj.nombre_operario,operario_id:obj.operario_id};
                        $scope.root.registro_entrada_bodega_id=obj.registro_entrada_bodega_id;
                        $scope.root.guia=obj.numero_guia;
                        $scope.root.empaque={cantidadCaja:obj.cantidad_caja,cantidadNevera:obj.cantidad_nevera,cantidadBolsa:obj.cantidad_bolsa};
                        $scope.root.cliente={tercero_id:obj.tercero_id,tipo_id_tercero:obj.tipo_id_tercero,nombre_tercero:obj.nombre_tercero};
                        $scope.root.observacion = obj.observacion;
                        $scope.root.transportadora={transportadora_id:obj.transportadora_id,descripcion:obj.nombre_transportadora};
                    };
                    
                    $scope.modificar = function(obj){
                         var obj = {
                            session: $scope.session,
                            prefijo : $scope.root.pref.prefijo,
                            numero : $scope.root.factura,
                            numeroGuia : $scope.root.guia,
                            tipoEmpaque : $scope.root.empaque,
                            tipoIdtercero : $scope.root.cliente.tipo_id_tercero,
                            terceroId : $scope.root.cliente.tercero_id,
                            transportadoraId :  $scope.root.transportadora_id,
                            observacion : $scope.root.observacion,
                            operario_id : $scope.root.operario.operario_id,                            
                            registro_entrada_bodega_id : $scope.root.registro_entrada_bodega_id
                        };
                        ValidacionDespachosService.modificaRegistroEntradaBodega(obj, function (data) {

                            if (data.status === 200) {
                                that.limpiar();
                                $scope.root.guardarButton = true;
                                $scope.root.modificarButton = false;
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Modificado Correctamente");
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });
                    };
                    
                    that.registroEntradaBodega = function (obj) {

                        var obj = {
                            session : $scope.session,
                            prefijo : obj.prefijo,
                            numero : obj.numero,
                            numeroGuia : obj.numeroGuia,
                            tipoEmpaque : obj.tipoEmpaque,
                            tipoIdtercero : obj.tipoIdtercero,
                            terceroId : obj.terceroId,
                            transportadoraId : obj.transportadoraId,
                            observacion : obj.observacion,
                            operario_id : obj.operario_id
                        };

                        ValidacionDespachosService.registroEntradaBodega(obj, function (data) {

                            if (data.status === 200) {
                                that.limpiar();
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Almacenado Correctamente");
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });
                    };
                    
                    that.limpiar=function(){
                        $scope.root.pref="";
                        $scope.root.factura="";
                        $scope.root.guia="";
                        $scope.root.empaque="";
                        $scope.root.cliente="";
                        $scope.root.observacion="";
                        $scope.root.registro_entrada_bodega_id="";
                        $scope.root.transportadora="";
                        $scope.root.operario="";
                        that.listarRegistroEntradaBodega();
                    };
                    
                    $scope.cancelar=function(){
                        $scope.root.guardarButton = true;
                        $scope.root.modificarButton = false;
                        that.limpiar();
                    };


                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer los prefijos
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    that.listarPrefijos = function () {

                        var parametros = {
                            session: $scope.session,
                            data: {
                                data: {
                                    empresaId: Usuario.getUsuarioActual().getEmpresa().codigo
                                }
                            }
                        };

                        ValidacionDespachosService.listarPrefijos(parametros, function (respuesta) {
                            if (respuesta.status === 200) {
                                $scope.root.prefijos = respuesta.obj.listarPrefijos.prefijos;
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
                            }
                        });
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer los prefijos
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    that.listarOperarios = function () {

                        var parametros = {
                            session: $scope.session,
                            data: {
                            }
                        };

                        ValidacionDespachosService.listarOperarios(parametros, function (respuesta) {
                            if (respuesta.status === 200) {
                                $scope.root.operarios = respuesta.obj.listarOperarios;
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
                            }
                        });
                    };
                    
                    $scope.seleccionar_cliente = function(){
                      console.log("---> ",$scope.root.cliente);  
                    };
                    $scope.seleccionarTransportadora = function(){
                      console.log("---> ",$scope.root.transportadora);  
                    };
                    $scope.seleccionarPrefijo = function(){
                      console.log("---> ",$scope.root.pref);  
                    };
                    $scope.seleccionar_operario = function(){
                      console.log("---> ",$scope.root.operario);  
                    };
                    
                    $scope.guardar = function(){
                         if($scope.root.factura === "" && $scope.root.guia === ""){
                             AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar numero de Factura o numero de Guia"); 
                             return;
                         }
                         
                         if($scope.root.empaque === "" || $scope.root.empaque === undefined){
                             AlertService.mostrarVentanaAlerta("Mensaje del sistema","Debe digitar la Cantidad de empaque"); 
                             return;
                         }
                         
                         var obj = {
                            prefijo: $scope.root.pref.prefijo,
                            numero: $scope.root.factura,
                            numeroGuia: $scope.root.guia,
                            tipoEmpaque: $scope.root.empaque,
                            tipoIdtercero: $scope.root.cliente.tipo_id_tercero,
                            terceroId: $scope.root.cliente.tercero_id,
                            transportadoraId: $scope.root.transportadora.id,
                            observacion: $scope.root.observacion,
                            operario_id: $scope.root.operario.operario_id
                        };
                        that.registroEntradaBodega(obj);
                    };
                    
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion $scope
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    $scope.listar_clientes = function (termino_busqueda) {
                        if (termino_busqueda.length < 3) {
                            return;
                        }
                        $scope.root.termino_busqueda_clientes = termino_busqueda;
                        that.buscar_clientes(function (clientes) {
                            $scope.root.clientes=clientes;
                        });
                    };
                    
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer los terceros
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    that.buscar_clientes = function (callback) {
                        var obj = {
                            session: $scope.session,
                            data: {//tercero.empresa_id
                                tercero: {
                                    empresa_id: empresa.codigo,
                                    busquedaDocumento: [],
                                    terminoBusqueda:$scope.root.termino_busqueda_clientes,
                                    paginacion: false
                                }
                            }
                        };
                        Request.realizarRequest(API.TERCEROS.LISTAR_CLIENTES, "POST", obj, function (data) {
                            if (data.status === 200) {
                                callback(data.obj.terceros);
                            }
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion $scope transportadoras
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    $scope.listarTransportadoras = function (termino_busqueda) {
                        if (termino_busqueda.length < 3) {
                            return;
                        }
                        $scope.root.termino_busqueda_transportadoras = termino_busqueda;
                        that.buscarTransportadoras(function (transportadoras) {
                            $scope.root.transportadoras=transportadoras;
                        });
                    };
                    
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer las transportadoras
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    that.buscarTransportadoras = function (callback) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                transportadoras: {
                                    termino_busqueda: $scope.root.termino_busqueda_transportadoras
                                }
                            }
                        };
                        Request.realizarRequest(API.TRANSPORTADORAS.LISTAR_TRANSPORTADORAS, "POST", obj, function (data) {
                            if (data.status === 200) {
                                callback(data.obj.transportadoras);
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
                       that.listarRegistroEntradaBodega();
                   };


                   /*
                    * funcion para paginar siguiente
                    * @returns {lista datos}
                    */
                   $scope.paginaSiguiente = function () {
                       $scope.paginaactual++;
                       that.listarRegistroEntradaBodega();
                   };



                    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                        $scope.$$watchers = null;
                        // set localstorage
                        $scope.datos_view = null;
                    });

                    that.init();

                }]);
});
