//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CreaPedidoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', '$stateParams', "Usuario", "localStorageService",

        function($scope, $rootScope, Request, Empresa, Cliente, PedidoVenta, API, socket, AlertService, $state, $stateParams, Usuario, localStorageService) {

            //$scope.Empresa = Empresa;
            
            $scope.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            $scope.bloquear = true; //Default True
            $scope.bloqueo_producto_incluido = false;
            $scope.bloqueo_upload = true;
            $scope.tab_estados = {tab1: true, tab2: false};
            
            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.listado_productos = [];
            
            console.log("state ============ state params",$stateParams);
            console.log("state *************" , $state);
            
//            $scope.flujoArchivo = flowFactory.create({
//                target: '/upload'
//            });
//            
//            $scope.flujoArchivo.on('catchAll', function (event) {
//                alert("Hola");
//            });
            
            //$scope.ruta_upload = {target: '/subida'}; //ruta del servidor para subir el archivo
            
            //$scope.existingFlowObject = flowFactory.create();
            
            //$scope.existingFlowObject.defaults = { target: '/subida', permanentErrors:[404, 500, 501], minFileSize: 0 };
            
//            $scope.existingFlowObject.on('catchAll', function (event) {
//                
//                alert("Acceso al Evento");
//                
//            });
            
            $scope.de_seleccion_empresa = 0;
            $scope.de_seleccion_centro_utilidad = 0;
            $scope.de_seleccion_bodega = 0;

            $scope.para_seleccion_empresa = 0;
            $scope.para_seleccion_centro_utilidad = 0;
            $scope.para_seleccion_bodega = 0;
            
            $scope.de_lista_empresas = [];
            
            $scope.de_lista_centro_utilidad = [];
            
            $scope.de_lista_bodegas = [];
            
            $scope.para_lista_empresas = [];
            
            $scope.para_lista_centro_utilidad = [];
            
            $scope.para_lista_bodegas = [];
            

            /*$scope.de_lista_empresas = [    {id: 1, nombre: 'COSMITET'},
                                            {id: 2, nombre: 'DUANA'},
                                            {id: 3, nombre: 'DUMIAN'},
                                            {id: 4, nombre: 'DUCATI'}
                                            ];
                                            
            $scope.de_lista_centro_utilidad = [     {id: 1, nombre: 'CENTRO_1'},
                                                    {id: 2, nombre: 'CENTRO_2'},
                                                    {id: 3, nombre: 'CENTRO_3'},
                                                    {id: 4, nombre: 'CENTRO_4'}
                                                    ];
            $scope.de_lista_bodegas = [     {id: 1, nombre: 'BODEGA_1'},
                                            {id: 2, nombre: 'BODEGA_2'},
                                            {id: 3, nombre: 'BODEGA_3'},
                                            {id: 4, nombre: 'BODEGA_4'}
                                            ];*/
            
            /*$scope.para_lista_empresas = [      {id: 1, nombre: 'FARMASANITAS'},
                                                {id: 2, nombre: 'FARMAGISTERIO'},
                                                {id: 3, nombre: 'FARMDEFENSA'},
                                                {id: 4, nombre: 'FARMACIA X'}
                                                ];
            $scope.para_lista_centro_utilidad = [       {id: 1, nombre: 'CENTRO_1'},
                                                        {id: 2, nombre: 'CENTRO_2'},
                                                        {id: 3, nombre: 'CENTRO_3'},
                                                        {id: 4, nombre: 'CENTRO_4'}
                                                        ];
            $scope.para_lista_bodegas = [       {id: 1, nombre: 'BODEGA_1'},
                                                {id: 2, nombre: 'BODEGA_2'},
                                                {id: 3, nombre: 'BODEGA_3'},
                                                {id: 4, nombre: 'BODEGA_4'}
                                                ];*/
                                                
            $scope.pedido = {numero_pedido: ""};
            
            //$scope.pedido.numero_pedido_temp = "";
//                                                
//            $scope.farmaciaFlowObject = flowFactory.create({
//                target: '/upload'
//             });
            
            
            /******************** DE ***********************/
            
            $scope.consultarEmpresasDe = function() {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.de_lista_empresas = data.obj.empresas;
                    }
                    
                });
                
            };
            
            $scope.consultarCentrosUtilidadDe = function() {
                
                var obj = {
                    session: $scope.session,
                    data: { 
                         centro_utilidad : {
                             empresa_id : $scope.de_seleccion_empresa
                         }
                     }
                };

                Request.realizarRequest(API.PEDIDOS.CENTROS_UTILIDAD_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.de_lista_centro_utilidad = data.obj.centros_utilidad;
                    }
                    
                });
            };
            
            $scope.consultarBodegaDe = function() {
                
                var obj = {
                    session: $scope.session,
                    data: { 
                         bodegas : { empresa_id : $scope.de_seleccion_empresa,
                                     centro_utilidad_id : $scope.de_seleccion_centro_utilidad
                         }
                     }
                };

                Request.realizarRequest(API.PEDIDOS.BODEGAS_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    console.log("Consulta de Bodegas: ",data);
                    
                    if (data.status == 200) {
                        $scope.de_lista_bodegas = data.obj.bodegas;
                    }
                    
                });
            };
            
            /******************** PARA ***********************/
            
            $scope.consultarEmpresasPara = function() {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_FARMACIAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.para_lista_empresas = data.obj.empresas;
                    }
                    
                });
                
            };
            
            $scope.consultarCentrosUtilidadPara = function() {
                
                var obj = {
                    session: $scope.session,
                    data: { 
                         centro_utilidad : {
                             empresa_id : $scope.para_seleccion_empresa
                         }
                     }
                };

                Request.realizarRequest(API.PEDIDOS.CENTROS_UTILIDAD_FARMACIAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.para_lista_centro_utilidad = data.obj.centros_utilidad;
                    }
                    
                });
            };
            
            $scope.consultarBodegaPara = function() {
                
                var obj = {
                    session: $scope.session,
                    data: { 
                         bodegas : { empresa_id : $scope.para_seleccion_empresa,
                                     centro_utilidad_id : $scope.para_seleccion_centro_utilidad
                         }
                     }
                };

                Request.realizarRequest(API.PEDIDOS.BODEGAS_FARMACIAS, "POST", obj, function(data) {
                    
                    console.log("Consulta de Bodegas: ",data);
                    
                    if (data.status == 200) {
                        $scope.para_lista_bodegas = data.obj.bodegas;
                    }
                    
                });
            };
            
            /*************** EVENTO CARGA GRID **********************/
            
            $scope.$on('cargarGridPrincipal', function(event, data) {
                    //alert("Ingreso Carga Grid");
                    $scope.listado_productos = data;
                    
                    if($scope.listado_productos.length){
                        $scope.bloqueo_producto_incluido = true;
                    }
                    else {
                        $scope.bloqueo_producto_incluido = false;
                    }
                    
                    if($scope.de_seleccion_empresa != 0 && $scope.de_seleccion_centro_utilidad != 0
                    && $scope.de_seleccion_bodega != 0 && $scope.para_seleccion_empresa != 0
                    && $scope.para_seleccion_centro_utilidad != 0 && $scope.para_seleccion_bodega != 0 && $scope.listado_productos.length == 0){
                
                        $scope.bloqueo_upload = false;
                    }
                    else{
                        
                        $scope.bloqueo_upload = true;
                    }
                    
                });

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            $scope.buscarCotizaciones = function(termino, paginando) {

                //Prueba Impresión pedido
                console.log("PedidoVenta.pedidoseleccionado = ",PedidoVenta.pedidoseleccionado);
                
                //valida si cambio el termino de busqueda
                if ($scope.ultima_busqueda != $scope.termino_busqueda) {
                    $scope.paginaactual = 1;
                }

                if(PedidoVenta.pedidoseleccionado !== ""){

                    $scope.pedido.numero_pedido = PedidoVenta.pedidoseleccionado;
                    localStorageService.set("pedidoseleccionado", PedidoVenta.pedidoseleccionado);

                }
                else if(localStorageService.get("pedidoseleccionado")){
                    
                    if(localStorageService.get("pedidoseleccionado").length > 0 ){

                        $scope.pedido.numero_pedido = localStorageService.get("pedidoseleccionado");

                    }
                }
//                else if($rootScope.pedidoseleccionado === undefined && !localStorageService.get("pedidoseleccionado")){
//                    
//                    $state.go("VerPedidosFarmacias");
//                }
                
                
                
//                for(i=0; i<10; i++)
//                {
//                    //var pedido = Pedido.get();
//                    
//                    obj = { 
//                            /*codigo_producto: '123456'+i,
//                            descripcion: 'LOBOTOMICINA X '+i,
//                            molecula: 'LOBOTONINA'+i,
//                            existencia_farmacia: '10'+i,
//                            existencia_bodega: '20'+i,
//                            existencia_disponible: '10'+i,
//                            existencia_reservada: '10'+i,
//                            existencia_x_farmacia: 20*i*/
//                        
//                            codigo_producto: '123456'+i,
//                            descripcion: 'LOBOTOMICINA X '+i,
//                            cantidad_solicitada: 150,
//                            cantidad_pendiente: 0
//                        
//                        }
//                    
//                    $scope.listado_productos.push(obj);
//                        
//                }
                

                
//                var obj = {
//                    session: $scope.session,
//                    data: {
//                        documento_temporal: {
//                            termino_busqueda: termino,
//                            pagina_actual: $scope.paginaactual,
//                            filtro: {
//                                finalizados: true
//                            }
//                        }
//                    }
//                };
//
//                Request.realizarRequest(API.DOCUMENTOS_TEMPORALES.LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES, "POST", obj, function(data) {
//                    $scope.ultima_busqueda = $scope.termino_busqueda;
//                    
//                    if(data.obj.documentos_temporales != undefined) {
//                        $scope.renderPedidosSeparadosCliente(data.obj, paginando);
//                    }
//
//                });

            };

//            $scope.renderPedidosSeparadosCliente = function(data, paginando) {
//
//                $scope.items = data.documentos_temporales.length;
//                //se valida que hayan registros en una siguiente pagina
//                if(paginando && $scope.items == 0){
//                    if($scope.paginaactual > 1){
//                        $scope.paginaactual--;
//                    }
//                    AlertService.mostrarMensaje("warning","No se encontraron mas registros");
//                    return;
//                }
//
//                $scope.Empresa.vaciarDocumentoTemporal("Cliente");
//               
//                for (var i in data.documentos_temporales) {
//
//                    var obj = data.documentos_temporales[i];
//                    
//                    var documento_temporal = $scope.crearDocumentoTemporal(obj);
//
//                    $scope.Empresa.agregarDocumentoTemporal(
//                        documento_temporal, "Cliente"
//                    );
//
//
//                }
//
//            };

//            $scope.crearDocumentoTemporal = function(obj) {
//                var documento_temporal = DocumentoTemporal.get();
//                documento_temporal.setDatos(obj);
//
//                var pedido = Pedido.get(obj);
//                pedido.setDatos(obj);
//                        
//                var cliente = Cliente.get(
//                        obj.nombre_cliente,
//                        obj.direccion_cliente,
//                        obj.tipo_id_cliente,
//                        obj.identificacion_cliente,
//                        obj.telefono_cliente
//                        );
//
//                pedido.setCliente(cliente);
//                
//                documento_temporal.setPedido(pedido);
//                
//                var separador = Separador.get(obj.responsable_pedido, obj.responsable_id, 1);
//                
//                documento_temporal.setSeparador(separador);
//                
//                return documento_temporal;
//            };

            //definicion y delegados del Tabla de pedidos clientes
            
            $scope.lista_productos = {    
                    data: 'listado_productos',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    //enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código Producto'},
                        {field: 'descripcion', displayName: 'Descripción'},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                        {field: 'cantidad_pendiente', displayName: 'Cantidad Pendiente'}
                    ]
                };
            
            
/********* Antigua Grid ***************************/
//            $scope.lista_productos = {
//                data: 'listado_productos',
//                enableColumnResize: true,
//                enableRowSelection: false,
//                enableCellSelection: true,
//                selectedItems: $scope.selectedRow,
//                multiSelect: false,
//                columnDefs: [
//                    {field: 'codigo_producto', displayName: 'Código Producto'},
//                    {field: 'descripcion', displayName: 'Descripción'},
//                    {field: 'molecula', displayName: 'Molécula'},
//                    {field: 'existencia_farmacia', displayName: 'Existencia Farmacia'},
//                    {field: 'existencia_bodega', displayName: 'Existencia Bodega'},
//                    {field: 'existencia_disponible', displayName: 'Disponible'},
//                    {field: 'existencia_reservada', displayName: 'Reservado'},
//                    {field: 'existencia_x_farmacia', displayName: 'Existencias Farmacias', width: "12%"},
//                    {field: 'cantidad', displayName: 'Cantidad'},
//                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Eliminar</span></button></div>'}
//                ]
//
//            };
/********* Antigua Grid ***************************/
            
//            $scope.abrirViewCotizacion = function()
//            {
//                $state.go('CotizacionCliente');
//            }
//            
//            $scope.onRowClickSelectCliente = function() {
//                $scope.slideurl = "views/seleccioncliente.html?time=" + new Date().getTime();
//                $scope.$emit('mostrarseleccioncliente');
//            };
            
            $scope.onRowClickSelectProducto = function(tipo_cliente) {
                $scope.slideurl = "views/generarpedidos/seleccionproductofarmacia.html?time=" + new Date().getTime();
                $scope.$emit('mostrarseleccionproducto', tipo_cliente);
                
                $scope.$broadcast('cargarGridSeleccionadoSlide', $scope.listado_productos);
            };
            
            $scope.$on('flow::fileAdded', function (event, $flow, flowFile) {
              //$scope.farmaciaFlowObject.fileAdded = function(event, $flow, flowFile) {
                    //event.preventDefault();//prevent file from uploading
                    //$scope.nombre_archivo = $flow;
//                    console.log("El Evento es",event);
//                    console.log("El Flow es",$flow);
//                    console.log("El File Flow es",flowFile);
                    var arreglo_nombre = flowFile.name.split(".");
                    
                    if(arreglo_nombre[1] !== 'txt' && arreglo_nombre[1] !== 'csv') {
                        alert("El archivo debe ser TXT o CSV. Intente de nuevo ...");
                        //flowFile = {};
                    }
              //};
                });
                
//            $scope.$on('flow::filesAdded', function (event, $flow, flowFile) {
//
//                    console.log("El Evento es",event);
//                    console.log("El Flow es",$flow);
//                    console.log("El File Flow es",flowFile);
//                    
//                    var arreglo_nombre = flowFile.name.split(".");
//                    
//                    if(arreglo_nombre[1] !== 'txt') {
//                        alert("El tipo de archivo no es Valido. Debe ser TXT.");
//                        flowFile.cancel();
//                    }
//
//                });

            
//            $scope.onClickFile = function (data) {
//                alert("Botón Cargar Presionado");
//            }
            
            $scope.valorSeleccionado = function() {

                /*console.log("Ingreso Selects");
                console.log($scope.de_seleccion_empresa);
                console.log($scope.de_seleccion_centro_utilidad);
                console.log($scope.de_seleccion_bodega);
                console.log($scope.para_seleccion_empresa);
                console.log($scope.para_seleccion_centro_utilidad);
                console.log($scope.para_seleccion_bodega);*/
                
                /* Verificación DropDown DE */
                
                console.log("Id Empresa en Valor Seleccionado: ",$scope.de_seleccion_empresa);
                
                if($scope.de_seleccion_empresa != 0)
                {
                    $scope.consultarCentrosUtilidadDe();
                }
                
                if($scope.de_seleccion_centro_utilidad != 0)
                {
                    $scope.consultarBodegaDe();
                }
                
                if($scope.de_seleccion_bodega != 0)
                {
                    console.log("La bodega seleccionada es: ",$scope.de_seleccion_bodega);
                }
                
                /* Verificación DropDown PARA */
                
                console.log("Id Empresa en Valor Seleccionado PARA: ",$scope.de_seleccion_empresa);
                
                if($scope.para_seleccion_empresa != 0)
                {
                    $scope.consultarCentrosUtilidadPara();
                }
                
                console.log("Id Centro Utilidad en Valor Seleccionado PARA: ",$scope.de_seleccion_empresa);
                
                if($scope.para_seleccion_centro_utilidad != 0)
                {
                    $scope.consultarBodegaPara();
                }
                
                if($scope.para_seleccion_bodega != 0)
                {
                    console.log("La bodega seleccionada en PARA es: ",$scope.para_seleccion_bodega);
                }

                /**********************************************************************************************/
                
                if($scope.de_seleccion_empresa != 0 && $scope.de_seleccion_centro_utilidad != 0
                    && $scope.de_seleccion_bodega != 0 && $scope.para_seleccion_empresa != 0
                    && $scope.para_seleccion_centro_utilidad != 0 && $scope.para_seleccion_bodega != 0)
                {
                    $scope.bloquear = false;
                }
                
                if($scope.de_seleccion_empresa != 0 && $scope.de_seleccion_centro_utilidad != 0
                    && $scope.de_seleccion_bodega != 0 && $scope.para_seleccion_empresa != 0
                    && $scope.para_seleccion_centro_utilidad != 0 && $scope.para_seleccion_bodega != 0 && $scope.listado_productos.length == 0){
                    
                    $scope.bloqueo_upload = false;
                }
                else{
                    
                    $scope.bloqueo_upload = true;
                }
                
            };
            
            $scope.setTabActivo = function(number){
                
                if(number == 1)
                {
                    $scope.tab_estados.tab1 = true;
                }
                    
                if(number == 2)
                {
                    $scope.tab_estados.tab2 = true;    
                }
                
            };
            
            $scope.abrirViewVerPedidosFarmacias = function()
            {
                $state.go('VerPedidosFarmacias'); //Crear la URL para éste acceso y relacionarlo con el botón de "Cancelar en la View"
            };
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
               //alert("En éste momento debo limpiar algo");
               
               console.log('$stateChangeStart - Estado 1');
               
                $scope.listado_productos = [];
               
                $scope.de_lista_empresas = [];
                $scope.de_lista_centro_utilidad = [];
                $scope.de_lista_bodegas = [];

                $scope.para_lista_empresas = [];
                $scope.para_lista_centro_utilidad = [];
                $scope.para_lista_bodegas = [];
                
                localStorageService.remove("pedidoseleccionado");

            });
                
            $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){

              });
              
            $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){

              });
            
            $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 

            });
            
            $scope.consultarEmpresasDe();
            $scope.consultarEmpresasPara();
            $scope.buscarCotizaciones("");

        }]);
});
