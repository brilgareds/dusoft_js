define(["angular", "js/controllers"], function (angular, controllers) {

    var fo = controllers.controller('facturacionClientesController',
            ['$scope', '$rootScope', 'Request', 'API', 'AlertService', 'Usuario',

                "$timeout",
                "$filter",
                "localStorageService",
                "$state", "$modal", "socket", "facturacionClientesService", "EmpresaDespacho",
    function ($scope, $rootScope, Request, API, AlertService, Usuario,
            $timeout, $filter, localStorageService, $state, $modal, socket, facturacionClientesService, EmpresaDespacho) {

        console.log("facturacionClientesController");
        var that = this;
        $scope.paginaactual = 1;
        $scope.paginaactualFacturasGeneradas = 1;
        var empresa = angular.copy(Usuario.getUsuarioActual().getEmpresa());

        $scope.root = {
            termino_busqueda_proveedores: "",
            termino_busqueda_pedido: "",
            termino_busqueda_nombre: "",
            termino_busqueda_prefijo: "",
            empresaSeleccionada: '',
            termino_busqueda: '',
            termino_busqueda_fg: '',
            estadoSesion: true,
            items: 0,
            items_facturas_generadas: 0,
            clientes: [],
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

                {field: 'Identificacion',  cellClass: "ngCellText", width: "15%", displayName: 'Cliente', cellTemplate: '<div class="col-xs-16 "><p class="text-uppercase">{{row.entity.getTipoId()}}- {{row.entity.getId()}}</p></div>'},

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
                 
                {displayName: "Opc", width: "6%", cellClass: "txt-center dropdown-button",
                    cellTemplate: '<div class="btn-group">\
                           <button class="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">Accion<span class="caret"></span></button>\
                           <ul class="dropdown-menu dropdown-options">\
                                <li ng-if="row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].getEstadoSincronizacion() != 0">\n\
                                   <a href="javascript:void(0);" ng-click="sincronizarFormula(row.entity)" class= "glyphicon glyphicon-refresh"> Sincronizar </a>\
                                </li>\
                                <li ng-if="row.entity.mostrarFacturasDespachadas()[0].mostrarPedidos()[0].mostrarFacturas()[0].get_numero() > 0 ">\
                                   <a href="javascript:void(0);" ng-click="imprimirFacturaGenerada(row.entity)" class = "glyphicon glyphicon-print"> factura </a>\
                                </li>\
                           </ul>\
                      </div>'
                },
            ]
        };
        
        /*
        * @author Cristian Manuel Ardila
        * +Descripcion Metodo encargado generar el reporte
        * para consultar los medicamentos pendientes           
        * @fecha  2016-10-12
        */
        that.consultaFacturaGeneradaDetalle = function(parametro){
            console.log("consultaFacturaGeneradaDetalle");
          
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
                controller: "ventanaMensajeSincronizacionController",
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
         * +Descripcion Metodo principal, el cual cargara el modulo
         *              siempre y cuando se cumplan las restricciones
         *              de empresa, centro de utilidad y bodega
         */
        that.init(empresa, function () {

            if (!Usuario.getUsuarioActual().getEmpresa()) {
                $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una empresa valida para dispensar formulas", tipo: "warning"});
                AlertService.mostrarMensaje("warning", "Debe seleccionar la empresa");
            } else {
                if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() ||
                        Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado() === undefined) {
                    $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene un centro de utilidad valido para dispensar formulas.", tipo: "warning"});
                    AlertService.mostrarMensaje("warning", "Debe seleccionar el centro de utilidad");
                } else {
                    if (!Usuario.getUsuarioActual().getEmpresa().getCentroUtilidadSeleccionado().getBodegaSeleccionada()) {
                        $rootScope.$emit("onIrAlHome", {mensaje: "El usuario no tiene una bodega valida para dispensar formulas.", tipo: "warning"});
                        AlertService.mostrarMensaje("warning", "Debe seleccionar la bodega");
                    } else {
                        that.listarTiposTerceros();
                        that.listarPrefijosFacturas();
                        that.listarClientes();
                        
                    }
                }
            }
        });



        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            
            console.log("SALIO Y BORRO ")
            $scope.$$watchers = null;
            $scope.root.activarTabFacturasGeneradas = false;
            localStorageService.add("listaFacturaDespachoGenerada",null);
            $scope.root = null;

        });

    }]);
});
