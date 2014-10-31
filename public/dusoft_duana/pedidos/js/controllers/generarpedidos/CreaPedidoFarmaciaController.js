//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CreaPedidoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Farmacia', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService",

        function($scope, $rootScope, Request, Empresa, Farmacia, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService) {

            var that = this;
            
            $scope.rootCreaPedidoFarmacia = {};

            $scope.rootCreaPedidoFarmacia.session = {
                usuario_id: Usuario.usuario_id,
                auth_token: Usuario.token
            };
            
            $scope.rootCreaPedidoFarmacia.paginas = 0;
            $scope.rootCreaPedidoFarmacia.items = 0;
            $scope.rootCreaPedidoFarmacia.termino_busqueda = "";
            $scope.rootCreaPedidoFarmacia.ultima_busqueda = "";
            $scope.rootCreaPedidoFarmacia.paginaactual = 1;
            
            $scope.rootCreaPedidoFarmacia.bloquear = true; //Default True
            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
            $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
            
            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = true;
            
            $scope.rootCreaPedidoFarmacia.tab_estados = {tab1: true, tab2: false};
            
            $scope.rootCreaPedidoFarmacia.listado_productos = [];
            
            $scope.rootCreaPedidoFarmacia.de_seleccion_empresa = 0;
            $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad = 0;
            $scope.rootCreaPedidoFarmacia.de_seleccion_bodega = 0;
            $scope.rootCreaPedidoFarmacia.para_seleccion_empresa = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad = "0,";
            $scope.rootCreaPedidoFarmacia.para_seleccion_bodega = "0,";
            
            $scope.rootCreaPedidoFarmacia.de_lista_empresas = [];
            $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad = [];
            $scope.rootCreaPedidoFarmacia.de_lista_bodegas = [];
            $scope.rootCreaPedidoFarmacia.para_lista_empresas = [];
            $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = [];
            $scope.rootCreaPedidoFarmacia.para_lista_bodegas = [];
                                                
            $scope.rootCreaPedidoFarmacia.pedido = {numero_pedido: ""};
            
            that.pedido = PedidoVenta.get();

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
            
//                                                
//            $scope.farmaciaFlowObject = flowFactory.create({
//                target: '/upload'
//             });
            
            
            /******************** DROPDOWN DE ***********************/
            
            $scope.consultarEmpresasDe = function() {

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_empresas = data.obj.empresas;
                    }
                    
                });
                
            };
            
            $scope.consultarCentrosUtilidadDe = function() {
                
                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: { 
                         centro_utilidad : {
                             empresa_id : $scope.rootCreaPedidoFarmacia.de_seleccion_empresa
                         }
                     }
                };

                Request.realizarRequest(API.PEDIDOS.CENTROS_UTILIDAD_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_centro_utilidad = data.obj.centros_utilidad;
                    }
                    
                });
            };
            
            $scope.consultarBodegaDe = function() {
                
                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: { 
                         bodegas : { empresa_id : $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                                     centro_utilidad_id : $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad
                         }
                     }
                };

                Request.realizarRequest(API.PEDIDOS.BODEGAS_EMPRESAS_GRUPO, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.rootCreaPedidoFarmacia.de_lista_bodegas = data.obj.bodegas;
                    }
                    
                });
            };
            
            /******************** DROPDOWN PARA ***********************/
            
            $scope.consultarEmpresasPara = function() {

                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_FARMACIAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.rootCreaPedidoFarmacia.para_lista_empresas = data.obj.lista_farmacias;
                    }
                    
                });
                
            };
            
            $scope.consultarCentrosUtilidadPara = function() {
                
                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: { 
                         pedidos_farmacias : {
                             empresa_id : $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',')[0]
                         }
                     }
                };
                console.log("Consultando Centro Utilidad Para");
                Request.realizarRequest(API.PEDIDOS.CENTROS_UTILIDAD_FARMACIAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad = data.obj.lista_centros_utilidad;
                        console.log("Listado Centro Utilidad - Data: ",data.obj.lista_centros_utilidad);
                        console.log("Listado Centro Utilidad: ",$scope.rootCreaPedidoFarmacia.para_lista_centro_utilidad);
                    }
                    
                });
            };
            
            $scope.consultarBodegaPara = function() {
                
                var obj = {
                    session: $scope.rootCreaPedidoFarmacia.session,
                    data: { 
                         pedidos_farmacias : {
                                empresa_id : $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',')[0],
                                centro_utilidad_id : $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',')[0]
                         }
                     }
                };

                Request.realizarRequest(API.PEDIDOS.BODEGAS_FARMACIAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.rootCreaPedidoFarmacia.para_lista_bodegas = data.obj.lista_bodegas;
                    }
                    
                });
            };
            
            /*************** EVENTO CARGA GRID **********************/
            
            $scope.$on('cargarGridPrincipal', function(event, data) {

                    $scope.rootCreaPedidoFarmacia.listado_productos = data;
                    
                    //console.log("El pedido devuelto de Selección Producto: ",that.pedido);
                    
                    if($scope.rootCreaPedidoFarmacia.listado_productos.length){
                        $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                    }
                    else {
                        $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
                    }
                    
                    if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa != 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad != 0
                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega != 0 && $scope.rootCreaPedidoFarmacia.para_seleccion_empresa != 0
                    && $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad != 0 && $scope.rootCreaPedidoFarmacia.para_seleccion_bodega != 0
                    && $scope.rootCreaPedidoFarmacia.listado_productos.length == 0){
                
                        $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                    }
                    else{
                        
                        $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                    }
                    
                });

            $scope.rootCreaPedidoFarmacia.estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];

            $scope.buscarCotizaciones = function(termino, paginando) {
                
                //valida si cambio el termino de busqueda
                if ($scope.rootCreaPedidoFarmacia.ultima_busqueda != $scope.rootCreaPedidoFarmacia.termino_busqueda) {
                    $scope.rootCreaPedidoFarmacia.paginaactual = 1;
                }

                if(PedidoVenta.pedidoseleccionado !== ""){

                    $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = PedidoVenta.pedidoseleccionado;
                    localStorageService.set("pedidoseleccionado", PedidoVenta.pedidoseleccionado);

                }
                else if(localStorageService.get("pedidoseleccionado")){
                    
                    if(localStorageService.get("pedidoseleccionado").length > 0 ){

                        $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = localStorageService.get("pedidoseleccionado");

                    }
                }

            };

            //definicion y delegados del Tabla de pedidos clientes
            
            $scope.rootCreaPedidoFarmacia.lista_productos = {    
                    data: 'rootCreaPedidoFarmacia.listado_productos',
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
            
            $scope.onRowClickSelectProducto = function(tipo_cliente) {
                $scope.slideurl = "views/generarpedidos/seleccionproductofarmacia.html?time=" + new Date().getTime();
                
                var datos_de = {
                    empresa_id: $scope.rootCreaPedidoFarmacia.de_seleccion_empresa,
                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad,
                    bodega_id: $scope.rootCreaPedidoFarmacia.de_seleccion_bodega
                };
                
                var datos_para = {
                    empresa_destino_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                    centro_utilidad_destino_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                    bodega_destino_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                };
                
                var farmacia = Farmacia.get(
                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0]), //obj.farmacia_id,
                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]), //obj.bodega_id,
                        $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[1], //obj.nombre_farmacia,
                        $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[1] //obj.nombre_bodega
                        );

                that.pedido.setFarmacia(farmacia);
                that.pedido.setTipo(2);
                
                $scope.$emit('mostrarseleccionproducto', tipo_cliente, datos_de, datos_para, that.pedido);
                
                $scope.$broadcast('cargarGridSeleccionadoSlide', $scope.rootCreaPedidoFarmacia.listado_productos);
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
                
                var para_seleccion_empresa = [];
                var para_seleccion_centro_utilidad = [];
                var para_seleccion_bodega = [];
                
                if($scope.rootCreaPedidoFarmacia.para_seleccion_empresa)
                {
                    para_seleccion_empresa = $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(',');
                }
                
                if($scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad)
                {
                    para_seleccion_centro_utilidad = $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(',');
                }
                
                if($scope.rootCreaPedidoFarmacia.para_seleccion_bodega)
                {
                    para_seleccion_bodega = $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(',');
                }
                
                /* Mostrar valores selección */

                console.log("De Empresa: ",$scope.rootCreaPedidoFarmacia.de_seleccion_empresa);
                console.log("De CentroUtil: ",$scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad);
                console.log("De Bodega: ",$scope.rootCreaPedidoFarmacia.de_seleccion_bodega);
                
                console.log("Para Empresa: ",para_seleccion_empresa);
                console.log("Para CentroUtil: ",para_seleccion_centro_utilidad);
                console.log("Para Bodega: ",para_seleccion_bodega);
                
                /****************************/
                
                /* Validaciones DropDown DE */
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa != 0)
                {
                    $scope.consultarCentrosUtilidadDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                }
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad != 0)
                {
                    $scope.consultarBodegaDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                }


                /* Validaciones DropDown PARA */
                
                console.log("para_seleccion_empresa[0] =",para_seleccion_empresa[0]);
                
                if(para_seleccion_empresa[0] != 0)
                {
                    console.log("Dentro de IF - para_seleccion_empresa[0] =",para_seleccion_empresa[0]);
                    $scope.consultarCentrosUtilidadPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                }
                
                console.log("para_seleccion_centro_utilidad[0] =",para_seleccion_centro_utilidad[0]);
                
                if(para_seleccion_centro_utilidad[0] != 0)
                {
                    $scope.consultarBodegaPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                }

                /******************************** Validaciones bloqueos ****************************************/
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa != 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad != 0
                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega != 0 && para_seleccion_empresa[0] != 0
                    && para_seleccion_centro_utilidad[0] != 0 && para_seleccion_bodega[0] != 0)
                {
                    $scope.rootCreaPedidoFarmacia.bloquear = false;
                }
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa != 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad != 0
                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega != 0 && para_seleccion_empresa[0] != 0
                    && para_seleccion_centro_utilidad[0] != 0 && para_seleccion_bodega[0] != 0
                    && $scope.rootCreaPedidoFarmacia.listado_productos.length == 0)
                {
                    
                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                }
                else{
                    
                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                }
                
            };
            
            $scope.setTabActivo = function(number){
                
                if(number == 1)
                {
                    $scope.rootCreaPedidoFarmacia.tab_estados.tab1 = true;
                }
                    
                if(number == 2)
                {
                    $scope.rootCreaPedidoFarmacia.tab_estados.tab2 = true;    
                }
                
            };
            
            $scope.abrirViewVerPedidosFarmacias = function()
            {
                $state.go('VerPedidosFarmacias'); //Crear la URL para éste acceso y relacionarlo con el botón de "Cancelar en la View"
            };
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
                
                $scope.rootCreaPedidoFarmacia = {};
                $scope.$$watchers = null;
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
