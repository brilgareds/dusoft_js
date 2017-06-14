define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('facturacionClientesController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho","webNotification",
    function ($scope, $rootScope, Request, API, AlertService, Usuario,
            $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho,webNotification) {

        console.log("facturacionClientesController");
        var that = this;
        $scope.paginaactual = 1;
        $scope.paginaactualFacturasGeneradas = 1;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());
        var fecha_actual = new Date();
        $scope.notificarFacturaGeneradaCosmitet = 0;
        $scope.root = {
            fechaInicialPedidosCosmitet: $filter('date')(new Date("01/01/" + fecha_actual.getFullYear()), "yyyy-MM-dd"),
            fechaFinalPedidosCosmitet: $filter('date')(fecha_actual, "yyyy-MM-dd"),            
            termino_busqueda_proveedores: "",
            termino_busqueda_pedido: "",
            termino_busqueda_nombre: "",
            termino_busqueda_prefijo: "",
            termino_busqueda_cosmitet: "",
            empresaSeleccionada: '',
            termino_busqueda: '',
            termino_busqueda_fg: '',
            pedidosCosmitetSeleccionados: [],
            documentosCosmitetSeleccionadosFiltrados: [],
            estadoSesion: true,
            items: 0,
            items_facturas_generadas: 0,
            pedidos_cosmitet:[],
            clientes: [],
            facturas_proceso: [],
            facturas_generadas: [],
            estadoBotones: [
                "btn btn-danger btn-xs",
                "btn btn-primary btn-xs",
                "btn btn-danger btn-xs",
                "btn btn-info btn-xs",
                "btn btn-warning btn-xs",
                "btn btn-success btn-xs",
                "btn btn-warning btn-xs"
            ],
            opciones: Usuario.getUsuarioActual().getModuloActual().opciones,
            activarTabFacturasGeneradas: false
        };
        $scope.root.empresaSeleccionada = EmpresaDespacho.get(empresa.getNombre(), empresa.getCodigo());
        $scope.session = {
            usuario_id: Usuario.getUsuarioActual().getId(),
            auth_token: Usuario.getUsuarioActual().getToken()
        };
        /*
         * Inicializacion de variables
         * @param {type} empresa
         * @param {type} callback
         * @returns {void}
         */
        that.init = function (empresa, callback) {


            // that.cargar_permisos();
           
           
            $scope.documentosAprobados = [];
            that.centroUtilidad = [];

            $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
            $scope.columnaSizeBusqueda = "col-md-3";
            $scope.root.visibleBuscador = true;
            $scope.root.visibleBotonBuscador = true;

            callback();
        };
        
      /**
        * @author Cristian Ardila
        * @fecha 04/02/2016
        * +Descripcion Funcion que permitira desplegar el popup datePicker
        *               de la fecha iniciañ
        * @param {type} $event
        */   
       $scope.abrir_fecha_inicial = function($event) {

           $event.preventDefault();
           $event.stopPropagation();
           $scope.root.datepicker_fecha_inicial = true;
           $scope.root.datepicker_fecha_final = false;

       };

       /**
       * @author Cristian Ardila
       * @fecha 04/02/2016
       * +Descripcion Funcion que permitira desplegar el popup datePicker
       *               de la fecha final
       * @param {type} $event
       */  
       $scope.abrir_fecha_final = function($event) {
           $event.preventDefault();
           $event.stopPropagation();
           $scope.root.datepicker_fecha_inicial = false;
           $scope.root.datepicker_fecha_final = true;

       };
                
        $scope.contenedorBuscador = "col-sm-2 col-md-2 col-lg-3  pull-right";
        $scope.columnaSizeBusqueda = "col-md-3";
        $scope.root.filtros = [
            {tipo: '', descripcion: "Todos"},
            {tipo: 'Nombre', descripcion: "Nombre"}
        ];
        
        $scope.root.filtrosPrefijos = [
            {tipo: '', descripcion: "Todos"},
            {tipo: 'Nombre', descripcion: "Nombre"}
        ];

        $scope.root.filtro = $scope.root.filtros[0];
        $scope.root.filtroPrefijo = $scope.root.filtrosPrefijos[0];
        
        $scope.onColumnaSize = function (tipo) {
 
        };
        
        /**
         * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
         *              el tipo de documento seleccionado
         * @param {type} filtro
         * @returns {undefined}
         */
        $scope.onSeleccionFiltro = function (filtro) {

            $scope.root.filtro = filtro;
            $scope.root.termino_busqueda = '';
        };

        /**
         * +Descripcion Metodo encargado de visualizar en el boton del dropdwn
         *              el tipo de prefijo
         * @param {type} filtro
         * @returns {undefined}
         */
        $scope.onSeleccionFiltroPrefijos = function (filtroPrefijo) {

            $scope.root.filtroPrefijo = filtroPrefijo;
            //$scope.root.termino_busqueda_fg = '';       
        };

        /**
         * +Descripcion Metodo encargado de invocar el servicio que listara 
         *              los tipos de terceros
         * @author Cristian Ardila
         * @fecha 02/05/2017 DD/MM/YYYY
         * @returns {undefined}
         */
        that.listarTiposTerceros = function () {

            var obj = {
                session: $scope.session,
                data: {listar_tipo_terceros:{}}
            };

            facturacionClientesService.listarTiposTerceros(obj, function (data) {

                if (data.status === 200) {
                    $scope.tipoTercero = facturacionClientesService.renderListarTipoTerceros(data.obj.listar_tipo_terceros);
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            });
        };
        
        
        /**
         * +Descripcion Metodo encargado de invocar el servicio que listara 
         *              los tipos de terceros
         * @author Cristian Ardila
         * @fecha 02/05/2017 DD/MM/YYYY
         * @returns {undefined}
         */
        that.listarPrefijosFacturas = function () {

            var obj = {
                session: $scope.session,
                data: {
                    listar_prefijos:{
                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                    }
                }
            };

            facturacionClientesService.listarPrefijosFacturas(obj, function (data) {

                if (data.status === 200) {
                     
                    $scope.tipoPrefijoFactura = facturacionClientesService.renderListarTipoTerceros(data.obj.listar_prefijos);
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }

            });

        };

        /**
         * +Descripcion Metodo encargado de invocar el servicio que listara 
         *              los tipos de terceros
         * @author Cristian Ardila
         * @fecha 02/05/2017 DD/MM/YYYY
         * @returns {undefined}
         */
        that.listarClientes = function () {

            var obj = {
                session: $scope.session,
                data: {
                    listar_clientes: {
                        filtro: $scope.root.filtro,
                        terminoBusqueda: $scope.root.termino_busqueda, //$scope.root.numero,
                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                        paginaActual: $scope.paginaactual
                    }
                }
            };

            facturacionClientesService.listarClientes(obj, function (data) {
                $scope.root.clientes = [];
                if (data.status === 200) {
                    $scope.root.items = data.obj.listar_clientes.length;
                    $scope.root.clientes = facturacionClientesService.renderTerceroDespacho(data.obj.listar_clientes);
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }

            });

        };



        /**
         * +Descripcion Metodo encargado de invocar el servicio que listara 
         *              las facturas generadas
         * @author Cristian Ardila
         * @fecha 03/05/2017 DD/MM/YYYY
         * @returns {undefined}
         */
        that.listarFacturasGeneradas = function (numero, prefijo) {
             
            var obj = {
                session: $scope.session,
                data: {
                    listar_facturas_generadas: {
                        filtro: $scope.root.filtro,
                        terminoBusqueda: $scope.root.termino_busqueda_fg.length > 0 ? $scope.root.termino_busqueda_fg : '', //$scope.root.termino_busqueda, //$scope.root.numero, 900766903
                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                        paginaActual: $scope.paginaactualFacturasGeneradas,
                        numero: numero > 0 ? numero : $scope.root.termino_busqueda_prefijo.length > 0 ? $scope.root.termino_busqueda_prefijo: '', //52146
                        prefijo: numero > 0 ? prefijo:$scope.root.filtroPrefijo,
                        tipoIdTercero: $scope.root.filtro,
                        pedidoClienteId: $scope.root.termino_busqueda_pedido.length > 0 ? $scope.root.termino_busqueda_pedido: '',
                        nombreTercero: $scope.root.termino_busqueda_nombre.length > 0 ? $scope.root.termino_busqueda_nombre: '',

                    }
                }
            };
             //console.log("obj [listarFacturasGeneradas]: ", obj)
            facturacionClientesService.listarFacturasGeneradas(obj, function (data) {
                //console.log("listarFacturasGeneradas =  ", data)
                $scope.root.facturas_generadas = [];
                if (data.status === 200) {
                  
                    $scope.root.items_facturas_generadas = data.obj.listar_facturas_generadas.length;
                    $scope.root.facturas_generadas = facturacionClientesService.renderDocumentosClientes(data.obj.listar_facturas_generadas,0);
                      
                } else {
                    AlertService.mostrarMensaje("warning", data.msj);
                }

            });

        };
        
        
        $scope.listarPedidosClientes = function(entity) {
            
             localStorageService.add("clientePedidoDespacho",{
               tipoIdTercero: entity.getTipoId(),
               terceroId: entity.getId()

            });
            
            $state.go('PedidosClientesDespacho');
        };
        /**
         * +Descripcion Se visualiza la tabla con todos los clientes
         */
        $scope.listaClientes = {
            data: 'root.clientes',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'Identificacion',  cellClass: "ngCellText", width: "15%", displayName: 'Identificacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoId()}}- {{row.entity.getId()}}</p></div>'},

                {field: 'Cliente', cellClass: "ngCellText", displayName: 'Cliente', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getNombre()}}</p></div>'},

                {field: 'Ubicacion', cellClass: "ngCellText", width: "15%", displayName: 'Ubicacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.getPais()}} - {{ row.entity.getDepartamento()}} - {{ row.entity.getMunicipio()}}</p></div>'},

                {displayName: 'Direccion', cellClass: "ngCellText", width: "10%", cellTemplate: '<div class="col-xs-16 "><p class="text-lowercase">{{ row.entity.getDireccion() }}</p> </div>'},

                {displayName: 'Telefono',  cellClass: "ngCellText",width: "10%", cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.getTelefono()}}</p></div>'},

                {displayName: "Opc", width: "6%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<div class="btn-group">\
                           <button ng-click="listarPedidosClientes(row.entity)" class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown" title="Crear factura"><span class="glyphicon glyphicon-list"></span> Factura</button>\
                      </div>'
                },
            ]
        };


        /**
         * @author Cristian Ardila
         * +Descripcion Se visualizan los registros con todas las facturas
         *              generadas
         * @fecha 03-05-2017 DD-MM-YYYY
         */
        $scope.listaFacturasGeneradas = {
            data: 'root.facturas_generadas',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: '#Factura', cellClass: "ngCellText", width: "5%", displayName: '#Factura', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_prefijo()}}- {{row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_numero()}}</p></div>'},
                
                {field: 'Identificacion', cellClass: "ngCellText", width: "8%", displayName: 'Identificacion', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarFacturasDespachadas()[0].getTipoId()}}- {{row.entity.mostrarFacturasDespachadas()[0].getId()}}</p></div>'},

                {field: 'Cliente', cellClass: "ngCellText", displayName: 'Cliente', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarFacturasDespachadas()[0].getNombre()}}</p></div>'},

                {field: 'Ubicacion', width: "10%",  cellClass: "ngCellText",displayName: 'Ubicacion', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturasDespachadas()[0].getPais()}} - {{ row.entity.mostrarFacturasDespachadas()[0].getDepartamento()}} - {{ row.entity.mostrarFacturasDespachadas()[0].getMunicipio()}} - {{ row.entity.mostrarFacturasDespachadas()[0].getDireccion()}}</p></div>'},

                {displayName: 'Telefono', width: "8%", cellClass: "ngCellText", 
                    cellTemplate: '<div class="col-xs-12 "><p class="text-uppercase">{{row.entity.mostrarFacturasDespachadas()[0].getTelefono()}}</p></div>'},

                {field: 'Vendedor', width: "13%", cellClass: "ngCellText", displayName: 'Vendedor', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarVendedor()[0].getTipoId()}}- {{row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarVendedor()[0].getId()}}: {{ row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarVendedor()[0].getNombre()}}</p></div>'},

                {field: 'F.Factura', width: "10%", cellClass: "ngCellText", displayName: 'F.Factura', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getFechaFactura()}} </p></div>'},

                {field: 'F.Ven', width: "5%", cellClass: "ngCellText", displayName: 'F.Ven', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getFechaVencimientoFactura()}} </p></div>'},

                {field: 'Valor/saldo',  cellClass: "ngCellText",width: "12%", displayName: 'Valor/saldo', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getValor()}} / {{ row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getSaldo()}} </p></div>'},

                {field: 'Estado', width: "8%", cellClass: "ngCellText", displayName: 'Estado', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{ row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getDescripcionEstado()}}</p></div>'},
                
                 /*{field: '#Estado facturacion', cellClass: "ngCellText", width: "5%", displayName: '#Estado facturacion', 
                    cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getDescripcionEstadoFacturacion()}}</p></div>'},
                */
                
                {displayName: "Opc", width: "6%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getEstadoSincronizacion() != 0">\n\
                                   <a href="javascript:void(0);" ng-click="sincronizarFactura(row.entity)" class= "glyphicon glyphicon-refresh"> Sincronizar </a>\
                                </li>\
                                <li ng-if="row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_numero() > 0 ">\
                                   <a href="javascript:void(0);" ng-click="imprimirFacturaGenerada(row.entity)" class = "glyphicon glyphicon-print"> factura </a>\
                                </li>\
                           </ul>\
                      </div>'
                },
            ]
        };
        
        $scope.sincronizarFactura = function(entity){
            
            AlertService.mostrarVentanaAlerta("Sincronizar factura", "Confirma que sincronizara la factura? ",
                function (estadoConfirm) {
                    if (estadoConfirm) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                sincronizar_factura: {
                                    empresa_id: entity.getCodigo(),
                                    factura_fiscal: entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_numero()
                                }
                            }
                        };

                        facturacionClientesService.sincronizarFactura(obj, function (data) {

                            if (data.status === 200) {
                                that.mensajeSincronizacion(data.obj.resultado_sincronizacion_ws.resultado.mensaje_bd,
                                        data.obj.resultado_sincronizacion_ws.resultado.mensaje_ws);
                                that.listarFacturasGeneradas(entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_numero(), {tipo: 'ME', descripcion: "ME"});
                            }
                            ;
                        });

                    }
                }
            );
            
        };
        /*
        * @author Cristian Manuel Ardila
        * +Descripcion Metodo encargado generar el reporte
        * para consultar los medicamentos pendientes           
        * @fecha  2016-10-12
        */
        that.consultaFacturaGeneradaDetalle = function(parametro){
          
            var obj = {                   
                session: $scope.session,
                data: {
                   consulta_factura_generada_detalle: {
                       cabecera:{
                            empresa_id: parametro.getCodigo(),
                            pais_empresa: parametro.pais,
                            departamento_empresa: parametro.departamento,
                            municipio_empresa: parametro.municipio,
                            razon_social: parametro.nombre,
                            direccion_empresa: parametro.direccionEmpresa,
                            telefono_empresa: parametro.telefonoEmpresa,
                            tipo_id_empresa: parametro.tipoIdEmpresa,
                            id: parametro.id,
                            digito_verificacion: parametro.digitoVerificacion,
                            texto2: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].mensaje2,
                            texto3: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].mensaje3, 
                            texto1: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].mensaje1, 
                            mensaje: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].mensaje4, 
                            prefijo: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_prefijo(),
                            factura_fiscal: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_numero(),
                            tipo_id_tercero: parametro.mostrarFacturasDespachadas()[0].getTipoId(),
                            tercero_id: parametro.mostrarFacturasDespachadas()[0].getId() , 
                            nombre_tercero:parametro.mostrarFacturasDespachadas()[0].getNombre(),
                            nombre:parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarVendedor()[0].getNombre(),
                            telefono : parametro.mostrarFacturasDespachadas()[0].getTelefono(),
                            direccion : parametro.mostrarFacturasDespachadas()[0].getDireccion(),
                            ubicacion: parametro.mostrarFacturasDespachadas()[0].getUbicacion(),
                            fecha_registro: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getFechaFactura(),
                            fecha_vencimiento_factura: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getFechaVencimientoFactura(),
                            observaciones: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getObservacion(),
                            pedido_cliente_id: parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].get_numero_cotizacion(),
                            factura_agrupada:parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getTipoFactura(),
                            porcentaje_rtf:parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getPorcentajeRtf(),
                            porcentaje_ica:parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getPorcentajeIca(),
                            porcentaje_reteiva:parametro.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getPorcentajeReteIva(),
                        }
                    }
                }    
            };    
              console.log("obj ", obj);
            facturacionClientesService.consultaFacturaGeneradaDetalle(obj,function(data){

                if (data.status === 200) {
                    var nombre = data.obj.consulta_factura_generada_detalle.nombre_pdf;                    
                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });  
        };
        
        /**
         * +Descripcion Metodo encargado de generar el reporte con la factura
         *              generada
         * @author Cristian Ardila
         * @fecha 18/05/2017
         */
        $scope.imprimirFacturaGenerada = function(entity){
            console.log("imprimirFacturaGenerada [entity]:: ", entity);
            that.imprimirFacturaGeneradaLocalStorage(entity);
        };
        
        that.imprimirFacturaGeneradaLocalStorage = function(parametro){     
            console.log("imprimirFacturaGeneradaLocalStorage");
            that.consultaFacturaGeneradaDetalle(parametro);
        };
        
        
        
        /**
         * +Descripcion Metodo encargado de limpiar el localstorage con los parametros
         *              para filtrar la ultima factura generada
         * @author Cristian Ardila
         * @fecha 18/05/2017
         */
        $scope.limpiarLocalStorageFacturaGenerada = function(){
            $scope.notificarFacturaGeneradaCosmitet = 0;
            localStorageService.add('listaFacturaDespachoGenerada', null); 
        };
        
        /**
         * +Descripcion Metodo encargado de mostrar el mensaje de respuesta de la sincronizacion
         *              de la factura
         * @author Cristian Ardila
         * @fecha 2017/22/05
         */
        that.mensajeSincronizacion = function (mensaje_bd,mensaje_ws) {
                     
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: true,
                keyboard: true,
                templateUrl: 'views/facturacionClientes/ventanaMensajeSincronizacion.html',
                scope: $scope,                  
                controller: "VentanaMensajeSincronizacionController",
                resolve: {
                    mensaje: function() {
                        return {mensaje_bd:mensaje_bd, mensaje_ws:mensaje_ws};
                    }
                }

            };
            var modalInstance = $modal.open($scope.opts);   

            modalInstance.result.then(function(){
            },function(){}); 
        };
        
        /**
         * +Descripcion Validacion esclusiva cuando se realiza una facturacion
         *              y de inmediato se redirecciona la vista al tab de facturas 
         *              generadas
         * @author Cristian Ardila
         * @fecha 18/05/2017
         */
        if ($state.is("Despacho") === true) {
            
            var storageListaFacturaDespachoGenerada = localStorageService.get('listaFacturaDespachoGenerada');     
            if(storageListaFacturaDespachoGenerada){
                console.log("storageListaFacturaDespachoGenerada ", storageListaFacturaDespachoGenerada);
                $scope.root.activarTabFacturasGeneradas = storageListaFacturaDespachoGenerada.active;                
                that.listarFacturasGeneradas(storageListaFacturaDespachoGenerada.datos.numeracion,{tipo: 'ME', descripcion: "ME"});              
                that.mensajeSincronizacion(storageListaFacturaDespachoGenerada.mensaje.mensaje_bd,storageListaFacturaDespachoGenerada.mensaje.mensaje_ws);
            }
        };
        
       
        
        /**
         * @author Cristian Ardila
         * @fecha 04/02/2016
         * +Descripcion Metodo encargado de invocar el servicio que
         *              listara los clientes para facturar
         *  @parametros ($event = eventos del teclado)
         */
        $scope.buscarClientesFactura = function (event) {

            if (event.which === 13 || event.which === 1) {

                that.listarClientes();
            }
            
        };


        /**
         * @author Cristian Ardila
         * @fecha 04/02/2016
         * +Descripcion Metodo encargado de invocar el servicio que
         *              listara las facturas que ya han sido generadas
         *  @parametros ($event = eventos del teclado)
         */
        $scope.buscarFacturaGenerada = function (event) {
            if (event.which === 13 || event.which === 1) {
                that.listarFacturasGeneradas(0,{});
            } 
           
        };
        /*
         * funcion para paginar anterior
         * @returns {lista datos}
         */
        $scope.paginaAnterior = function () {
            if ($scope.paginaactual === 1)
                return;
            $scope.paginaactual--;
            that.listarClientes();
        };


        /*
         * funcion para paginar siguiente
         * @returns {lista datos}
         */
        $scope.paginaSiguiente = function () {
            $scope.paginaactual++;
            that.listarClientes();
        };



        /*
         * +Descripcion funcion para paginar anterior en la lista de facturas
         *              generadas
         * @returns {lista datos}
         */
        $scope.paginaAnteriorFG = function () {
            if ($scope.paginaactualFacturasGeneradas === 1)
                return;
            $scope.paginaactualFacturasGeneradas--;
            that.listarClientes();
        };


        /*
         * +Descripcion funcion para paginar siguiente en la lista
         *              de facturas generadas
         * @returns {lista datos}
         */
        $scope.paginaSiguienteFG = function () {
            $scope.paginaactualFacturasGeneradas++;
            that.listarFacturasGeneradas(0,{});
        };
        
        /**
         * +Descripcion Metodo que se invoca cuando el tab de listar pedidos
         *              de cosmitet esta activo o tiene el foco
         */
        $scope.listarPedidosCosmitet = function(){
            
            $scope.notificarFacturaGeneradaCosmitet = 0;   
            
            var obj = {
                session: $scope.session,
                data: {                               
                    listar_pedidos_clientes: {
                        terminoBusqueda: $scope.root.termino_busqueda_cosmitet, //57760
                        empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                        paginaActual: $scope.paginaactual,
                        tipoIdTercero: '',
                        terceroId: '',
                        pedidoMultipleFarmacia: '1',
                        fechaInicial: $scope.root.fechaInicialPedidosCosmitet,
                        fechaFinal: $scope.root.fechaFinalPedidosCosmitet,
                        estadoProcesoPedido: '0'
                    }
                }
            };
            
            facturacionClientesService.listarPedidosClientes(obj, function (data) {
                $scope.root.pedidos_cosmitet = [];
                var prefijosDocumentos = [];
                var pedidoClientes = [];
                
                if (data.status === 200) {

                    $scope.root.items_pedidos_clientes = data.obj.listar_pedidos_clientes.length;
                    console.log("data.obj.listar_pedidos_clientes ", data.obj.listar_pedidos_clientes)
                    pedidoClientes = facturacionClientesService.renderDocumentosClientes(data.obj.listar_pedidos_clientes, 1);

                    /**
                     * +Descripcion Se recorren los prefijos y se
                     *              almacenan en un arreglo
                     */
                    data.obj.lista_prefijos.forEach(function(rowPrefijos){

                        rowPrefijos.forEach(function(rowPrefijosB){
                            prefijosDocumentos.push(rowPrefijosB)

                        });

                    }) 

                    /**
                     * +Descripcion Lista de los pedidos que estan listos
                     *              para facturarse
                     */
                    prefijosDocumentos.forEach(function(resultado){

                        pedidoClientes.forEach(function(row){
                            
                            if(resultado.pedido_cliente_id === row.pedidos[0].numero_cotizacion){

                                row.pedidos[0].prefijoNumero += " ( " + resultado.prefijo+" - "+ resultado.numero +")";
                                row.pedidos[0].agregarDocumentos(facturacionClientesService.renderDocumentosPrefijosClientes(
                                    row.pedidos[0].numero_cotizacion, 
                                    resultado.prefijo,
                                    resultado.numero,
                                    row.pedidos[0].fechaRegistro,
                                    resultado.empresa_id));
                            }                                             
                        });   
                    });
                    $scope.root.pedidos_cosmitet = pedidoClientes;
                } else {
                    AlertService.mostrarVentanaAlerta("Mensaje del sistema", data.msj);
                }
            });
        };
        
        
        $scope.listaPedidosCosmitet = {
            
                data: 'root.pedidos_cosmitet',
                enableColumnResize: true,
                enableRowSelection: false,
                enableCellSelection: true,
                enableHighlighting: true,
                columnDefs: [

                    {field: '#Pedido', cellClass: "ngCellText", width: "15%", displayName: '#Pedido', 
                        cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].get_numero_cotizacion()}}</p></div>'},

                    {field: 'Vendedor', cellClass: "ngCellText", width: "25%", displayName: 'Vendedor', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].mostrarVendedor()[0].getTipoId()}}- {{row.entity.mostrarPedidos()[0].mostrarVendedor()[0].getId()}}: {{ row.entity.mostrarPedidos()[0].mostrarVendedor()[0].getNombre()}}</p></div>'},

                    {field: '#Fecha', cellClass: "ngCellText", width: "15%", displayName: '#Fecha', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.mostrarPedidos()[0].getFechaRegistro()}}</p></div>'},

                    {field: '#Factura', 
                        cellClass: "ngCellText", 
                        width: "25%", 
                        displayName: '#Factura',
                        cellTemplate: '<ul><button ng-if = "row.entity.mostrarPedidos()[0].mostrarFacturas().length > 3"  \n\
                            ng-click="listaPedidoPrefijos(row.entity.mostrarPedidos()[0].mostrarFacturas())" \n\
                            class="btn btn-default btn-xs" >{{row.entity.mostrarPedidos()[0].mostrarFacturas().length}} Documentos</button>\
                            <li ng-if = "row.entity.mostrarPedidos()[0].mostrarFacturas().length < 4" \n\
                                class="listaPrefijos" ng-repeat="item in row.entity.mostrarPedidos()[0].mostrarFacturas()" >\
                              <a href="javascript:void(0);" ng-click="imprimirReporteDocumento(entity,item)" class = "glyphicon glyphicon-print"></a>\
                              <input type="checkbox"\n\
                               ng-click="onDocumentoSeleccionado($event.currentTarget.checked,this)"> {{item.prefijo}} - {{item.numero}}  <br> \
                            </li>\
                          </ul>'},
                   
                    {displayName: "Opc", cellClass: "txt-center dropdown-button",
                        cellTemplate: '\
                        <div class="btn-group">\
                            <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                            <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.mostrarPedidos()[0].mostrarFacturas()[0].get_numero() > 0 ">\
                                    <a href="javascript:void(0);" ng-click="imprimirReportePedido(row.entity)" class = "glyphicon glyphicon-print"> Imprimir pedido </a>\
                                </li>\
                            </ul>\
                        </div>'
                    },
                    /*<li>\n\
                                <a href="javascript:void(0);" ng-click="generarFacturaIndividualCosmitet(row.entity)" class= "glyphicon glyphicon-refresh"> Generar factura individual </a>\
                             </li>\\n\*/
                    {field: '', cellClass: "checkseleccion", width: "3%",
                        cellTemplate: "<input type='checkbox' class='checkpedido' ng-checked='buscarSeleccionCosmitet(row)'" +
                                " ng-click='onPedidoSeleccionado($event.currentTarget.checked,row)' ng-model='row.seleccionado' />"}, 
                ]
            };
            
        /**
         * @author Cristian Ardila
         * +Descripcion Funcion encargada de invocar el servicio que generara
         *              una factura individual
         * @fecha 25/05/2017
         */
        $scope.generarFacturaIndividualCosmitet = function(entity){
            
            var parametros = {pedido:entity,
                    tipoIdTercero:'NIT',
                    terceroId:'830023202',
                    AlertService:AlertService,
                    documentoSeleccionados:$scope.root.documentosCosmitetSeleccionadosFiltrados,
                    session:$scope.session,
                    termino_busqueda:$scope.root.termino_busqueda,
                    empresaSeleccionada:$scope.root.empresaSeleccionada,
                    paginaactual:$scope.paginaactual,
                    tipoPagoFactura:$scope.tipoPagoFactura,
                    facturacionCosmitet: 1};
            
            facturacionClientesService.generarFacturaIndividualCompleta(parametros,function(data){
                      
                if (data.status === 200) {  
                    $scope.root.activarTabFacturasGeneradas = true;       
                    that.listarFacturasGeneradas(data.obj.generar_factura_agrupada[0].numeracion,{tipo: 'ME', descripcion: "ME"});              
                    that.mensajeSincronizacion(data.obj.resultado_sincronizacion_ws.resultado.mensaje_bd,
                    data.obj.resultado_sincronizacion_ws.resultado.mensaje_ws);                                         
                    AlertService.mostrarMensaje("warning", data.msj);
                }
                if(data.status === 404){
                    AlertService.mostrarMensaje("warning", data.msj);
                }
                if(data.status === 409){
                    AlertService.mostrarMensaje("danger", data.msj);
                }
                if(data.status === 500){
                    AlertService.mostrarMensaje("danger", data.msj);
                }

            });
        };
        
        /**
        * @author Cristian Ardila
        * +Descripcion Metodo encargado de imprimir el reporte
        *              de un despacho
        * @fecha 12/06/2017 DD/MM/YYYY
        */
        $scope.imprimirReporteDocumento = function(entity, documento){

            var obj = {                   
                session: $scope.session,
                data: {
                    imprimir_reporte_despacho: { 
                        documento: documento
                    }
                }
            };

            facturacionClientesService.imprimirReporteDespacho(obj,function(data){

                if (data.status === 200) {
                    var nombre = data.obj.consulta_despacho_generado_detalle.nombre_pdf;                    
                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });  
        };
        
        /**
        * @author Cristian Ardila
        * +Descripcion Metodo encargado de imprimir el detalle del
        *              reporte de un pedido             
        *  @fecha 12/06/2017 DD/MM/YYYY            
        */
        $scope.imprimirReportePedido = function(entity){

            var obj = {                   
                session: $scope.session,
                data: {
                    imprimir_reporte_pedido: {
                        cabecera:{
                           telefono:entity.telefono,
                           direccion:entity.direccion,
                           tipoIdTercero:entity.tipo_id_tercero,
                           terceroId:entity.id,
                           terceroNombre: entity.nombre_tercero,
                           fechaRegistro: entity.pedidos[0].fechaRegistro,
                           observacion: entity.pedidos[0].observacion,
                           numeroPedido: entity.pedidos[0].numero_cotizacion,
                           vendedorId: entity.pedidos[0].vendedor[0].id,
                           tipoIdVendedor: entity.pedidos[0].vendedor[0].tipo_id_tercero,
                           vendedorNombre: entity.pedidos[0].vendedor[0].nombre_tercero
                        }
                    }
                }
            };

            facturacionClientesService.imprimirReportePedido(obj,function(data){

                if (data.status === 200) {
                    var nombre = data.obj.consulta_factura_generada_detalle.nombre_pdf;                    
                    $scope.visualizarReporte("/reports/" + nombre, nombre, "_blank");
                }
            });
        };
        /**
         * @author Cristian Ardila
         * +Descripcion Ventana modal que se desplegara a traves de un boton
         *              que se activara cuando la cantidad de documentos excedan
         *              los 10
         * @fecha 2017/05/25
         */
        $scope.listaPedidoPrefijos = function(prefijos){

            $scope.listaPedidosPrefijos = prefijos;
            $scope.opts = {
                backdrop: true,
                backdropClick: true,
                dialogFade: false,
                keyboard: true,
                template: ' <div class="modal-header">\
                                <button type="button" class="close" ng-click="close()">&times;</button>\
                                <h4 class="modal-title">Seleccionar documentos</h4>\
                            </div>\
                            <div class="modal-body">\
                                <ul>\
                                    <li class="listaPrefijos" ng-repeat="item in listaPedidosPrefijos" >\
                                      <a href="javascript:void(0);" ng-click="imprimirReporteDocumento(entity,item)" class = "glyphicon glyphicon-print"></a>\
                                        <input type="checkbox" ng-model="item.documentoSeleccionado" \
                                        ng-click="onDocumentoSeleccionado($event.currentTarget.checked,this)"\
                                       >\n\
                                        {{item.prefijo}} - {{item.numero}}  <br> \
                                    </li>\
                                </ul>\
                            </div>\
                            <div class="modal-footer">\
                                <button class="btn btn-warning" ng-click="close()">Cerrar</button>\
                            </div>',
                scope: $scope,
                controller: ["$scope", "$modalInstance", function ($scope, $modalInstance) {
                        $scope.close = function () {
                            $modalInstance.close();
                        };
                    }]
            };
            var modalInstance = $modal.open($scope.opts);
        };
        
        
        /**
         * +Descripion Funciones encargadas de procesar los pedidos seleccionados
         */
        that.quitarPedido = function (pedido) {

            for (var i in $scope.root.pedidosCosmitetSeleccionados) {
                var _pedido = $scope.root.pedidosCosmitetSeleccionados[i];
                if (_pedido.mostrarPedidos()[0].get_numero_cotizacion() === pedido.mostrarPedidos()[0].get_numero_cotizacion()) {
                    $scope.root.pedidosCosmitetSeleccionados.splice(i, true);
                    break;
                }
            }
        };

        that.agregarPedido = function (pedido) {
            //valida que no exista el pedido en el array
            for (var i in $scope.root.pedidosCosmitetSeleccionados) {
                var _pedido = $scope.root.pedidosCosmitetSeleccionados[i];
                if (_pedido.mostrarPedidos()[0].get_numero_cotizacion() === pedido.mostrarPedidos()[0].get_numero_cotizacion()) {
                    return false;
                }
            }
            $scope.root.pedidosCosmitetSeleccionados.push(pedido);
        };


        $scope.onPedidoSeleccionado = function (check, row) {

            row.selected = check;
            if (check) {
                that.agregarPedido(row.entity);
            } else {

                that.quitarPedido(row.entity);
            }

        };

        $scope.buscarSeleccionCosmitet = function (row) {
            var pedido = row.entity;

            for (var i in $scope.root.pedidosCosmitetSeleccionados) {
                var _pedido = $scope.root.pedidosCosmitetSeleccionados[i];
                if (_pedido.mostrarPedidos()[0].get_numero_cotizacion() === pedido.mostrarPedidos()[0].get_numero_cotizacion()) {
                    row.selected = true;
                    return true;
                }
            }

            row.selected = false;
            return false;
        };
        
        
        
        /**
         * +Descripcion Funciones encargadas de procesar los documentos seleccionados
         */
         that.quitarDocumento = function (documento) {
                        
            for(var i in $scope.root.documentosCosmitetSeleccionadosFiltrados) {
                var _documento = $scope.root.documentosCosmitetSeleccionadosFiltrados[i];
                if (_documento.prefijo === documento.prefijo && _documento.numero === documento.numero) {
                    $scope.root.documentosCosmitetSeleccionadosFiltrados.splice(i, true);
                    break;
                }  
            }

        }; 

        that.agregarDocumento = function (documento) {

            for(var i in $scope.root.documentosCosmitetSeleccionadosFiltrados) {
                var _documento = $scope.root.documentosCosmitetSeleccionadosFiltrados[i];
                if(_documento.prefijo === documento.prefijo && _documento.numero === documento.numero) {
                    return false;
                }  
            }
            $scope.root.documentosCosmitetSeleccionadosFiltrados.push(documento);

        }; 


        $scope.onDocumentoSeleccionado = function (check, row) {

            row.selected = check;

            if (check) {
                that.agregarDocumento(row.item);
            }else {

                that.quitarDocumento(row.item);
            }

        }; 
        
        $scope.seleccionarTipoPago = function(tipoPago){
            $scope.tipoPagoFactura = tipoPago;
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Metodo encargado de invocar el servicio que pondra en estado
         *              de proceso los pedidos segun el rango de fecha de consulta
         * @fecha 02/06/2016 DD/MM/YYYY
         */
        $scope.procesaFacturasCosmitet = function () {

            AlertService.mostrarVentanaAlerta("Generar factura agrupada", "Confirma que realizara la facturacion ?",
                function (estadoConfirm) {
                    if (estadoConfirm) {
                        var obj = {
                            session: $scope.session,
                            data: {
                                procesar_factura_cosmitet: {
                                    empresaId: $scope.root.empresaSeleccionada.getCodigo(),
                                    tipoIdTercero: 'NIT',
                                    terceroId: '830023202',
                                    tipoPago: $scope.tipoPagoFactura,
                                    pedidoMultipleFarmacia: '1',
                                    fechaInicial: $scope.root.fechaInicialPedidosCosmitet,
                                    fechaFinal: $scope.root.fechaFinalPedidosCosmitet
                                }
                            }
                        };
                        facturacionClientesService.procesarDespachos(obj, function (data) {

                            AlertService.mostrarMensaje("warning", data.msj);
                             that.facturasEnProceso();
                            if (data.status === 404) {
                                AlertService.mostrarMensaje("warning", data.msj);
                            }
                            if (data.status === 409) {
                                AlertService.mostrarMensaje("danger", data.msj);
                            }
                            if (data.status === 500) {
                                AlertService.mostrarMensaje("danger", data.msj);
                            }
                        });

                    }
                }
            );            
        };
        /**
        * +Descripcion Metodo encargado de invocar el servicio
        *              que generara las facturas agrupadas
        * @author Cristian Ardila
        * @fecha 2017-08-05
        */
        $scope.generarFacturasCosmitetAgrupadas = function () {
             
           if ($scope.root.pedidosCosmitetSeleccionados.length > 1) {
  
                var parametros = {
                    terminoBusqueda: $scope.root.termino_busqueda, //$scope.root.numero,
                    empresaSeleccionada: $scope.root.empresaSeleccionada,
                    paginaActual: $scope.paginaactual,
                    tipoIdTercero: 'NIT',
                    terceroId: '830023202',
                    tipoPagoFactura: $scope.tipoPagoFactura,
                    pedidosSeleccionados: $scope.root.pedidosCosmitetSeleccionados,
                    facturacionCosmitet: '1',
                    session: $scope.session,
                    AlertService: AlertService,
                    documentoSeleccionados: $scope.root.documentosCosmitetSeleccionadosFiltrados
                };

                facturacionClientesService.generarFacturasAgrupadasCompleta(parametros, function (data) {
                    
                    
                    AlertService.mostrarMensaje("warning", data.msj);
                        /**
                         * +Descripcion si se genera la factura satisfacturiamente,
                         *              el sistema activara la vista que lista las facturas generadas
                         *              haciendo referencia a la factura reciente
                         */            
                        if (data.status === 200) {

                            $scope.root.activarTabFacturasGeneradas = true;       
                            that.listarFacturasGeneradas(data.obj.generar_factura_agrupada[0].numeracion,{tipo: 'ME', descripcion: "ME"});              
                            that.mensajeSincronizacion(data.obj.resultado_sincronizacion_ws.resultado.mensaje_bd,
                            data.obj.resultado_sincronizacion_ws.resultado.mensaje_ws);
                            AlertService.mostrarMensaje("warning", data.msj);
                        }
                        if (data.status === 404) {
                            AlertService.mostrarMensaje("warning", data.msj);
                        }
                        if (data.status === 409) {
                            AlertService.mostrarMensaje("danger", data.msj);
                        }
                        if (data.status === 500) {
                            AlertService.mostrarMensaje("danger", data.msj);
                        } 
                    
                    //});
                });   
                 
            } else {
                AlertService.mostrarMensaje("warning", "Debe seleccionar mas de dos pedidos");
            }

        };
        
        
        $scope.listarFacturasProceso = {
            data: 'root.facturas_proceso',
            enableColumnResize: true,
            enableRowSelection: false,
            enableCellSelection: true,
            enableHighlighting: true,
            columnDefs: [

                {field: 'Factura',  cellClass: "ngCellText", width: "15%", displayName: 'Factura', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_prefijo()}}- {{row.entity.get_numero()}}</p></div>'},
                {field: 'Empresa',  cellClass: "ngCellText", width: "15%", displayName: 'Empresa', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_empresa()}}</p></div>'},
                {field: 'Fecha creacion',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha creacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.get_fecha_registro()}}</p></div>'},
                {field: 'Fecha Inicial',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha Inicial', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaInicial()}}</p></div>'},
                {field: 'Fecha final',  cellClass: "ngCellText", width: "15%", displayName: 'Fecha final', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getFechaFinal()}}</p></div>'},               
                {field: 'Estado facturacion',  cellClass: "ngCellText",  displayName: 'Estado facturacion', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getDescripcionEstadoFacturacion()}}</p></div>'},
                
               
            ]
        };
        
        /**
         * @author Cristian Ardila
         * +Descripcion Funcion encargada de consultar las facturas en proceso
         * @fecha 2017-14-06
         */
        that.facturasEnProceso = function(){
            
            var obj = {                   
                session: $scope.session,
                data: {
                    
                }
            };

            facturacionClientesService.facturasEnProceso(obj,function(data){
                $scope.root.facturas_proceso = [];
                if (data.status === 200) {
                    $scope.root.facturas_proceso = facturacionClientesService.renderFacturasEnProceso(data.obj.lista_facturas_proceso);                      
                }
            });
        };
        
        $scope.facturasProceso = function(){
            that.facturasEnProceso();
        };
        /**
         * @author Cristian Ardila
         * +Descripcion Funcion encargada de crear una ventana de notificaciones
         *              cuando la factura de cosmitet ya esta lista, al presionar click
         *              sobre la notificacion se abrira en una nueva pestaña el
         *              reporte de la factura
         * @fecha 2017-14-16
         */        
        that.notificarSolicitud = function(title, body, parametros) {
             
            webNotification.showNotification(title, {
                body: body,
                icon: '/images/logo.png',
                onClick: function onNotificationClicked() {},
                autoClose: 90000 //auto close the notification after 2 seconds (you can manually close it via hide function)
            }, function onShow(error, hide) {
                if (error) {
                    window.alert('Error interno: ' + error.message);
                } else {

                    setTimeout(function hideNotification() {

                        hide(); //manually close the notification (you can skip this if you use the autoClose option)
                    }, 90000);
                }
            });
        };
        
        socket.on("onNotificarFacturacionTerminada", function(datos) {
             
             console.log("AQUI SALE ASI ", datos)
            if(datos.status === 200){
                var resultado = datos.obj.generar_factura_agrupada[0];
                that.notificarSolicitud(datos.msj, "Factura " + resultado.id+" - " +resultado.numeracion, 
                {
                 factura:resultado.numeracion,
                 prefijo:resultado.id}
                )}
                console.log("onNotificarFacturacionTerminada {[[[[[]]]]]} ", resultado);
                $scope.notificarFacturaGeneradaCosmitet++;    
            
                that.listarFacturasGeneradas(resultado.numeracion,{tipo: resultado.id, descripcion: resultado.id});   
                
            if(datos.status === 201){
                 AlertService.mostrarMensaje("success", datos.msj); 
            }
            if(datos.status === 500){                       
                AlertService.mostrarMensaje("danger", datos.msj); 
            }
        });
        /**
        * @author Cristian Ardila
        * @fecha 04/02/2016
        * +Descripcion Metodo encargado de invocar el servicio que
        *              listara los clientes para facturar
        *  @parametros ($event = eventos del teclado)
        */
        $scope.buscarPedidosCosmitet = function (event) {

            if (event.which === 13 || event.which === 1) {

               $scope.listarPedidosCosmitet();
            }

        };
        /**
         * +Descripcion Metodo principal, el cual cargara el modulo
         *              siempre y cuando se cumplan las restricciones
         *              de empresa, centro de utilidad y bodega
         */
        that.init(empresa, function () {

            if (!Usuario.getUsuarioActual().getEmpresa()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una empresa valida para ingresar a la aplicacion", tipo: "warning"});
                AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
            } else {
                if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                        Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene un centro de utilidad valido para ingresar a la aplicacion", tipo: "warning"});
                    AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                } else {
                    if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una bodega valida para ingresar a la aplicacion", tipo: "warning"});
                        AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                    } else {
                        that.listarTiposTerceros();
                        that.listarPrefijosFacturas();    
                        
                    }
                }
            }
        });
 
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
             
            socket.remove(['onNotificarFacturacionTerminada']);  
            $scope.$$watchers = null;
            $scope.root.activarTabFacturasGeneradas = false;
            localStorageService.add("listaFacturaDespachoGenerada",null);
            $scope.root = null;

        });

    }]);
});
