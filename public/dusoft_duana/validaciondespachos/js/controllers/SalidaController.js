define(["angular", "js/controllers"], function (angular, controllers) {

    controllers.controller('SalidaController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',
                "$timeout", "$filter", "localStorageService", "$state", "ValidacionDespachosService",
                function ($scope, $rootScope, Request, API, AlertService, Usuario,
                        $timeout, $filter, localStorageService, $state, ValidacionDespachosService) {

                    var that = this;
                    var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

                    var fecha_actual = new Date();
                    $scope.date = $filter('date')(fecha_actual, "yyyy-MM-dd");

                    var hora = "0"+fecha_actual.getHours() + ":" + fecha_actual.getMinutes();// + ":" + fecha_actual.getSeconds();
                    $scope.paginaactual = 1;
                    $scope.format = 'yyyy/MM/dd';


                    $scope.session = {
                        usuario_id: Usuario.getUsuarioActual().getId(),
                        auth_token: Usuario.getUsuarioActual().getToken()
                    };
                 
                    that.init = function (empresa, callback) {

                        $scope.root = {
                            guardarButton: true,
                            modificarButton: false,
                            prefijo: "Prefijo",
                            registrosLength: 0,
                            termino_busqueda_clientes: "",
                            hora_envio: "",
                            fechaEnvio : $scope.date,
                            pref: {},
                            operario: {},
                            cliente: {},
                            filtro: "",
                            empaques: [{id: 0, nombre: 'Caja'}, {id: 1, nombre: 'Nevera'}, {id: 2, nombre: 'Bolsa'}]
                        };
                        that.listarPrefijos();
                        that.listarOperarios();
                        that.limpiar();
                        that.listarCiudadesPais();
                      //  $scope.filtro();
                    };

                    $scope.horaDespacho = {
                        value: new Date(fecha_actual.getFullYear(), fecha_actual.getMonth(), fecha_actual.getDate(), fecha_actual.getHours(), fecha_actual.getMinutes())
                    };

                    /**
                     * @author Cristian Ardila
                     * @fecha 04/02/2016
                     * +Descripcion Funcion que permitira desplegar el popup datePicker
                     *               de la fecha iniciañ
                     * @param {type} $event
                     */
                    $scope.abrir_fecha_inicial = function ($event) {

                        $event.preventDefault();
                        $event.stopPropagation();
                        $scope.root.datepicker_fecha_inicial = true;

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

                    $scope.filtro = function () {
                        $scope.registrosLength = 0;
                        that.listarRegistroSalidaBodega();
                    };

                    that.listarRegistroSalidaBodega = function () {
                        var obj = {
                            session: $scope.session,
                            busqueda: $scope.root.filtro,
                            pagina: $scope.paginaactual
                        };

                        ValidacionDespachosService.listarRegistroSalida(obj, function (data) {
                            console.log("data",data);
                            if (data.status === 200) {
                                $scope.root.registrosLength = data.obj.listarRegistroSalida.length;
                                $scope.root.listarRegistros = data.obj.listarRegistroSalida;
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
                            {field: 'numero_guia', displayName: 'Guia', width: "5%"},
                            {field: 'nombre_tercero', displayName: 'Cliente', width: "10%"},
                            {field: 'cantidad_caja', displayName: 'Caja', width: "5%"},
                            {field: 'cantidad_nevera', displayName: 'Nevera', width: "5%"},
                            {field: 'cantidad_bolsa', displayName: 'Bolsa', width: "5%"},
                            {field: 'nombre_operario', displayName: 'Despachador', width: "5%"},
                            {field: 'observacion', displayName: 'Observacion', width: "10%"},
                            {field: 'fecha_envio', displayName: 'Despacho', width: "10%"},
                            {field: 'municipio', displayName: 'Ciudad', width: "5%"},
                            {field: 'placa', displayName: 'Placa', width: "5%"},
                            {field: 'nombre_conductor', displayName: 'Conductor', width: "10%"},
                            {field: 'nombre_ayudante', displayName: 'Ayudante', width: "10%"},
                            {field: 'detalle', width: "5%",
                                displayName: "Opciones",
                                cellClass: "txt-center",
                                cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="activar(row.entity)">Modificar</span></button></div>'

                            }
                        ]
                    };

                    $scope.activar = function (obj) {
                        var d = new Date(obj.fecha_envio);
                        that.limpiar();
                        $scope.root.guardarButton = false;
                        $scope.root.modificarButton = true;
                        $scope.root.pref = {prefijo: obj.prefijo_id};
                        $scope.root.factura = obj.numero;
                        $scope.root.registro_salida_bodega_id = obj.registro_salida_bodega_id;
                        $scope.root.fechaEnvio = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
                        $scope.horaDespacho = {
                            value: new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds())
                        };
                        $scope.root.operario = {nombre_operario: obj.nombre_operario, operario_id: obj.operario_id};
                        $scope.root.conductor = {nombre_operario: obj.nombre_conductor, conductor: obj.operario_id};
                        $scope.root.ayudante = {nombre_operario: obj.nombre_ayudante, ayudante: obj.operario_id};
                        $scope.root.ciudad = {nombre_ciudad: obj.municipio, pais_id: obj.tipo_pais_id, departamento_id: obj.tipo_dpto_id, tipo_mpio_id: obj.tipo_mpio_id};
                        $scope.root.registro_entrada_bodega_id = obj.registro_entrada_bodega_id;
                        $scope.root.guia = obj.numero_guia;
                        $scope.root.placa = obj.placa;
                        $scope.root.empaque = {cantidadCaja: obj.cantidad_caja, cantidadNevera: obj.cantidad_nevera, cantidadBolsa: obj.cantidad_bolsa};
                        $scope.root.cliente = {tercero_id: obj.tercero_id, tipo_id_tercero: obj.tipo_id_tercero, nombre_tercero: obj.nombre_tercero};
                        $scope.root.observacion = obj.observacion;
                    };

                    $scope.modificar = function (obj) {
                        var d = new Date($scope.root.fechaEnvio);
                        var obj = {
                            session: $scope.session,
                            prefijo: $scope.root.pref.prefijo,
                            numero: $scope.root.factura,
                            numeroGuia: $scope.root.guia,
                            tipoEmpaque: $scope.root.empaque,
                            tipoIdtercero: $scope.root.cliente.tipo_id_tercero,
                            terceroId: $scope.root.cliente.tercero_id,
                            observacion: $scope.root.observacion,
                            operarioId: $scope.root.operario.operario_id,
                            conductor: $scope.root.conductor.operario_id,
                            ayudante: $scope.root.ayudante.operario_id,
                            registro_salida_bodega_id: $scope.root.registro_salida_bodega_id,
                            placa: $scope.root.placa,
                            fechaEnvio: d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + $scope.horaDespacho.value.getHours() + ":" + $scope.horaDespacho.value.getMinutes() + ":" + $scope.horaDespacho.value.getSeconds(),
                            ciudad: $scope.root.ciudad
                        };
                        ValidacionDespachosService.modificaRegistroSalidaBodega(obj, function (data) {

                            if (data.status === 200) {
                                that.limpiar();
                                $scope.filtro();
                                $scope.root.guardarButton = true;
                                $scope.root.modificarButton = false;
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Modificado Correctamente");
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });
                    };

                    that.registroSalidaBodega = function (obj) {

                        obj.session = $scope.session;

                        ValidacionDespachosService.registroSalidaBodega(obj, function (data) {

                            if (data.status === 200) {
                                that.limpiar();
                                if(obj.numero !==""){
                                $scope.root.filtro = obj.numero;
                                }else{
                                $scope.root.filtro = obj.numeroGuia; 
                                }
                                $scope.filtro();
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Almacenado Correctamente");
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                            }

                        });
                    };

                    that.limpiar = function () {
                        $scope.root.pref = "";
                        $scope.root.factura = "";
                        $scope.root.guia = "";
                        $scope.root.empaque = "";
                        $scope.root.ciudad = "";
                        $scope.root.conductor = "";
                        $scope.root.ayudante = "";
                        $scope.root.placa = "";
                        //   $scope.root.fechaEnvio = fecha_actual;
//                        $scope.root.horaDespacho = hora;
                        $scope.root.cliente = "";
                        $scope.root.observacion = "";
                        $scope.root.registro_entrada_bodega_id = "";
                        $scope.root.operario = "";
//                        that.listarRegistroSalidaBodega();
                    };

                    $scope.cancelar = function () {
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

                    $scope.seleccionar_cliente = function () {

                    };
                    $scope.seleccionarTransportadora = function () {

                    };
                    $scope.seleccionarPrefijo = function () {                        
                        if($scope.root.pref.sw_ingreso_automatico_datos === '1'){
//                           $scope.root.operario = {nombre_operario: "RECLAMA EN BODEGA",operario_id: 90};
                           $scope.root.conductor = {nombre_operario: "RECLAMA EN BODEGA",operario_id: 90};
                           $scope.root.ayudante = {nombre_operario: "RECLAMA EN BODEGA",operario_id: 90};
                           $scope.root.ciudad = {departamento_id: "76",id: "001",nombre_ciudad: "CALI",nombre_departamento: "VALLE DEL CAUCA",nombre_pais: "COLOMBIA",pais_id: "CO"};
                           $scope.root.placa = '000';
                           console.log("prefijo::: ",$scope.root.pref); 
                        }
                    };
                    $scope.seleccionar_operario = function () {
console.log("despacha::: ",$scope.root.operario);
                    };
                    $scope.seleccionar_ciudad = function () {
console.log("ciudad::: ",$scope.root.ciudad);
                    };

                    $scope.guardar = function () {
                        if ($scope.root.factura === "" && $scope.root.guia === "") {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar numero de Factura o numero de Guia");
                            return;
                        }

                        if ($scope.root.empaque === "" || $scope.root.empaque === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar la Cantidad de empaque");
                            return;
                        }

                        if ($scope.root.placa === "" || $scope.root.placa === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar la placa");
                            return;
                        }
                        if ($scope.root.operario === "" || $scope.root.operario === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar el despachador");
                            return;
                        }
                        if ($scope.root.conductor === "" || $scope.root.conductor === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar el conductor");
                            return;
                        }
                        if ($scope.root.ayudante === "" || $scope.root.ayudante === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe seleccionar el ayudante");
                            return;
                        }
                        if ($scope.root.fechaEnvio === "" || $scope.root.fechaEnvio === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar la fecha");
                            return;
                        }
                        if ($scope.horaDespacho === "" || $scope.horaDespacho === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar la hora");
                            return;
                        }
                        if ($scope.horaDespacho.value.getHours() === "" || $scope.horaDespacho.value.getHours() === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar la hora");
                            return;
                        }
                        if ($scope.horaDespacho.value.getMinutes() === "" || $scope.horaDespacho.value.getMinutes() === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar los minutos");
                            return;
                        }
                        if ($scope.horaDespacho.value.getSeconds() === "" || $scope.horaDespacho.value.getSeconds() === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar los segundos");
                            return;
                        }
                        if ($scope.root.cliente === "" || $scope.root.cliente === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar el cliente");
                            return;
                        }
                        if ($scope.root.ciudad === "" || $scope.root.ciudad === undefined) {
                            AlertService.mostrarVentanaAlerta("Mensaje del sistema", "Debe digitar la ciudad");
                            return;
                        }

                        var obj = {
                            prefijo: $scope.root.pref.prefijo,
                            numero: $scope.root.factura,
                            numeroGuia: $scope.root.guia,
                            tipoEmpaque: $scope.root.empaque,
                            tipoIdtercero: $scope.root.cliente.tipo_id_tercero,
                            terceroId: $scope.root.cliente.tercero_id,
                            observacion: $scope.root.observacion,
                            operarioId: $scope.root.operario.operario_id,
                            conductor: $scope.root.conductor.operario_id,
                            ayudante: $scope.root.ayudante.operario_id,
                            placa: $scope.root.placa,
                            fechaEnvio: $scope.root.fechaEnvio,//.getFullYear() + "/" + ($scope.root.fechaEnvio.getMonth() + 1) + "/" + $scope.root.fechaEnvio.getDate() + ' ' + $scope.horaDespacho.value.getHours() + ":" + $scope.horaDespacho.value.getMinutes() + ":" + $scope.horaDespacho.value.getSeconds(),
                            ciudad: $scope.root.ciudad
                        };
                        that.registroSalidaBodega(obj);
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
                            $scope.root.clientes = clientes;
                        });
                    };
                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion $scope
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    that.listarCiudadesPais = function (callback) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                pais: 'CO'
                            }
                        };
                        ValidacionDespachosService.listarCiudadesPais(obj, function (respuesta) {
                            if (respuesta.status === 200) {
                                $scope.root.ciudades = respuesta.obj.ciudades;
                            } else {
                                AlertService.mostrarVentanaAlerta("Mensaje del sistema", respuesta.msj);
                            }
                        });
                    };


                    /**
                     * @author Andres Mauricio Gonzalez
                     * +Descripcion Permite realiar peticion al API para traer los terceros
                     * @params callback: {function}
                     * @fecha 2019-04-04
                     */
                    that.buscar_clientes = function (callback) {
                        var busquedaDocumento = [];
                        if(!isNaN($scope.root.termino_busqueda_clientes)){
                           busquedaDocumento = [{entra:0},{entra:0}];
                        }
                        var obj = {
                            session: $scope.session,
                            data: {//tercero.empresa_id
                                tercero: {
//                                    empresa_id: empresa.codigo,
                                    busquedaDocumento: busquedaDocumento,
                                    terminoBusqueda: $scope.root.termino_busqueda_clientes,
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


                    /*
                     * funcion para paginar anterior
                     * @returns {lista datos}
                     */
                    $scope.paginaAnterior = function () {
                        if ($scope.paginaactual === 1)
                            return;
                        $scope.paginaactual--;
                        that.listarRegistroSalidaBodega();
                    };


                    /*
                     * funcion para paginar siguiente
                     * @returns {lista datos}
                     */
                    $scope.paginaSiguiente = function () {
                        $scope.paginaactual++;
                        that.listarRegistroSalidaBodega();
                    };



                    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                        $scope.$$watchers = null;
                        // set localstorage
                        $scope.datos_view = null;
                    });

                    that.init();

                }]);
});
