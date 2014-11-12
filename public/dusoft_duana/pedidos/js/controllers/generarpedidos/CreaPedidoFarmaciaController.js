//Controlador de la View creapedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/ClientePedido', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('CreaPedidoFarmaciaController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Farmacia', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService",

        function($scope, $rootScope, Request, Empresa, Farmacia, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService) {

            $scope.expreg = new RegExp("^[0-9]*$");
            
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
            
            $scope.rootCreaPedidoFarmacia.bloquear_tab = true; //Default True
            $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;
            
            $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
            $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
            
            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = true;
            $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = true;
            
            $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = false;
            
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
            
            $scope.rootCreaPedidoFarmacia.observacion = "";
                                                
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
                    
                    if($scope.rootCreaPedidoFarmacia.listado_productos.length > 0){
                        $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = true;
                        $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                    }
                    else {
                        $scope.rootCreaPedidoFarmacia.bloqueo_producto_incluido = false;
                        $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                    }
                    
                    if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && $scope.rootCreaPedidoFarmacia.para_seleccion_empresa !== 0
                    && $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad !== 0 && $scope.rootCreaPedidoFarmacia.para_seleccion_bodega !== 0
                    && $scope.rootCreaPedidoFarmacia.listado_productos.length === 0){
                
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


            //Grid para pedidos ya generados
            $scope.rootCreaPedidoFarmacia.detalle_pedido_generado = {    
                    data: 'rootCreaPedidoFarmacia.listado_productos_pedido',
                    enableColumnResize: true,
                    enableRowSelection: false,
                    //enableCellSelection: true,
                    //selectedItems: $scope.selectedRow,
                    multiSelect: false,
                    columnDefs: [
                        {field: 'codigo_producto', displayName: 'Código Producto', width: "9%"},
                        {field: 'descripcion', displayName: 'Descripción', width: "37%"},
                        {field: 'cantidad_solicitada', displayName: 'Cantidad Solicitada'},
                        {field: 'cantidad_pendiente', displayName: 'Cantidad Pendiente'},
                        {field: 'nueva_cantidad', displayName: 'Modificar Cantidad', enableCellEdit: true, width: "10%"},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "11%",
                            cellTemplate: ' <div class="row">\n\
                                                <button class="btn btn-default btn-xs" ng-click="onRowClick1(row)" ng-disabled="row.entity.nueva_cantidad<0 || row.entity.nueva_cantidad==null || !expreg.test(row.entity.nueva_cantidad)">\n\
                                                    <span class="glyphicon glyphicon-pencil">Modificar</span>\n\
                                                </button>\n\
                                                <button class="btn btn-danger btn-xs" ng-click="onRowClick2(row)">\n\
                                                    <span class="glyphicon glyphicon-minus-sign">Eliminar</span>\n\
                                                </button>\n\
                                            </div>'
                        }
                    ]
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
                        {field: 'codigo_producto', displayName: 'Código Producto', width: "9%"},
                        {field: 'descripcion', displayName: 'Descripción', width: "37%"},
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
                    empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                    bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                };
                
                var observacion = $scope.rootCreaPedidoFarmacia.observacion;
                
                var farmacia = Farmacia.get(
                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0]), //obj.farmacia_id,
                        parseInt($scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]), //obj.bodega_id,
                        $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[1], //obj.nombre_farmacia,
                        $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[1] //obj.nombre_bodega
                        );

                that.pedido.setFarmacia(farmacia);
                that.pedido.setTipo(2);
                
                $scope.$emit('mostrarseleccionproducto', tipo_cliente, datos_de, datos_para, observacion, that.pedido);
                
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
                
                console.log("Para Empresa: ",para_seleccion_empresa[0]);
                console.log("Para CentroUtil: ",para_seleccion_centro_utilidad[0]);
                console.log("Para Bodega: ",para_seleccion_bodega[0]);
                
                /****************************/
                
                /* Validaciones DropDown DE */
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0)
                {
                    $scope.consultarCentrosUtilidadDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_de = false;
                }
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0)
                {
                    $scope.consultarBodegaDe();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_de = false;
                }


                /* Validaciones DropDown PARA */
                
                console.log("para_seleccion_empresa[0] =",para_seleccion_empresa[0]);
                
                if(para_seleccion_empresa[0] !== '0')
                {
                    //console.log("Dentro de IF - para_seleccion_empresa[0] =",para_seleccion_empresa[0]);
                    $scope.consultarCentrosUtilidadPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_centro_utilidad_para = false;
                }
                
                //console.log("para_seleccion_centro_utilidad[0] =",para_seleccion_centro_utilidad[0]);
                
                if(para_seleccion_centro_utilidad[0] !== '0')
                {
                    $scope.consultarBodegaPara();
                    $scope.rootCreaPedidoFarmacia.bloqueo_bodega_para = false;
                }

                /******************************** Validaciones bloqueos ****************************************/
                
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                    && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0')
                {
                    $scope.rootCreaPedidoFarmacia.bloquear_tab = false;
                    $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = false;
                    
                    /* Ejecutar la acción de Consultar los productos del pedido temporal */
                    var obj_detalle = {
                        session:$scope.rootCreaPedidoFarmacia.session,
                        data:{
                            pedidos_farmacias:{
                                empresa_id: para_seleccion_empresa[0],
                                centro_utilidad_id: para_seleccion_centro_utilidad[0],
                                bodega_id: para_seleccion_bodega[0]
                            }
                        }
                    };
                    /* Fin - Objeto para Inserción Detalle */

                    /* Inicio - Validar existencia de producto en Detalle Pedido */

                    var url_productos_detalle = API.PEDIDOS.LISTAR_DETALLE_PEDIDO_TEMPORAL;

                    Request.realizarRequest(url_productos_detalle, "POST", obj_detalle, function(data) {

                        if(data.status == 200) {
                            
                            if(data){

                                console.log("Productos en BD: ", data.obj);
                                $scope.rootCreaPedidoFarmacia.listado_productos = data.obj.listado_productos;
                                
                                //Desabilitar carga de archivo plano si hay producto en la grid cuando hay pedido almacenado en BD
                                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                                    && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0'
                                    && $scope.rootCreaPedidoFarmacia.listado_productos.length === 0)
                                {

                                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                                    $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                                }
                                else{

                                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                                    $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = false;
                                }
                            }
                            else{

                            }
                        }
                    });
                    /*********************************************************************/
                }
                
                //Desabilitar carga de archivo plano si hay producto en la grid cuando no un pedido temporal almacenado en BD
                if($scope.rootCreaPedidoFarmacia.de_seleccion_empresa !== 0 && $scope.rootCreaPedidoFarmacia.de_seleccion_centro_utilidad !== 0
                    && $scope.rootCreaPedidoFarmacia.de_seleccion_bodega !== 0 && para_seleccion_empresa[0] !== '0'
                    && para_seleccion_centro_utilidad[0] !== '0' && para_seleccion_bodega[0] !== '0'
                    && $scope.rootCreaPedidoFarmacia.listado_productos.length === 0)
                {
                    
                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = false;
                }
                else{
                    
                    $scope.rootCreaPedidoFarmacia.bloqueo_upload = true;
                }
                
            };
            
            $scope.generarPedidoFarmacia = function(){
                
                /* Inicio - Objeto para inserción de Encabezado*/
                
                var obj_encabezado = {
                    session:$scope.rootCreaPedidoFarmacia.session,
                    data:{
                        pedidos_farmacias:{
                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0],
                            observacion: $scope.rootCreaPedidoFarmacia.observacion,
                            tipo_pedido: 0 //Pedido Normal. Pedido General tiene un valor de 1
                        }
                    }
                };
                /* Fin - Objeto para inserción de Encabezado*/

                /* Inicio - Validar Existencia de encabezado */

                var url_encabezado = API.PEDIDOS.INSERTAR_PEDIDO_FARMACIA_DEFINITIVO;

                Request.realizarRequest(url_encabezado, "POST", obj_encabezado, function(data) {

                    //console.log("Resultado INSERT Pedido: ",data);

                    if(data.status == 200) {
                        console.log("Encabezado Ingresado : ",data.msj);
                        console.log("El número de pedido es: ",data.obj.numero_pedido[0].solicitud_prod_a_bod_ppal_id)
                        
                        var numero_pedido_generado = data.obj.numero_pedido[0].solicitud_prod_a_bod_ppal_id;

                        /* Inicio - Objeto para Inserción Detalle */
                        var obj_detalle = {
                            session:$scope.rootCreaPedidoFarmacia.session,
                            data:{
                                detalle_pedidos_farmacias:{
                                    numero_pedido: numero_pedido_generado,
                                    empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                    bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                }
                            }
                        };
                        /* Fin - Objeto para Inserción Detalle */

                        /* Inicio - Validar existencia de producto en Detalle Pedido */

                        var url_detalle = API.PEDIDOS.INSERTAR_DETALLE_PEDIDO_FARMACIA_DEFINITIVO;

                        Request.realizarRequest(url_detalle, "POST", obj_detalle, function(data) {

                            if(data.status == 200) {
                                console.log("Detalle Ingresado : ", data.msj);
                                PedidoVenta.pedidoseleccionado = numero_pedido_generado;
                                $scope.rootCreaPedidoFarmacia.pedido.numero_pedido = PedidoVenta.pedidoseleccionado;
                                
                                /* Inicio - Eliminar Detalle Completo Pedido Temporal */
                                /*------------------------------------------------------*/
                                
                                /* Inicio - Objeto para Eliminar Detalle Completo */
                                var obj_detalle = {
                                    session:$scope.rootCreaPedidoFarmacia.session,
                                    data:{
                                        detalle_pedidos_farmacias:{
                                            empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                            centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                            bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                        }
                                    }
                                };
                                /* Fin - Objeto para Eliminar Detalle Completo */

                                /* Inicio - Borrado Detalle Completo Pedido */

                                var url_eliminar_detalle = API.PEDIDOS.ELIMINAR_DETALLE_PEDIDO_FARMACIA_TEMPORAL_COMPLETO;

                                Request.realizarRequest(url_eliminar_detalle, "POST", obj_detalle, function(data) {

                                    if(data.status == 200) {
                                        console.log("Eliminación de detalle Exitosa: ", data.msj);

                                        //Se asignan los valores de la Grid de pedidos temporales a la Grid del Pedido Generado
                                        $scope.rootCreaPedidoFarmacia.listado_productos_pedido = $scope.rootCreaPedidoFarmacia.listado_productos;
                                        $scope.rootCreaPedidoFarmacia.listado_productos = [];
                                        $scope.rootCreaPedidoFarmacia.grid_pedido_generado_visible = true;
                                        $scope.rootCreaPedidoFarmacia.bloqueo_generar_pedido = true;
                                        $scope.rootCreaPedidoFarmacia.bloquear_boton_incluir = true;

                                        //Eliminación de encabezado
                                        var obj_encabezado = {
                                            session:$scope.rootCreaPedidoFarmacia.session,
                                            data:{
                                                pedidos_farmacias:{
                                                    empresa_id: $scope.rootCreaPedidoFarmacia.para_seleccion_empresa.split(",")[0],
                                                    centro_utilidad_id: $scope.rootCreaPedidoFarmacia.para_seleccion_centro_utilidad.split(",")[0],
                                                    bodega_id: $scope.rootCreaPedidoFarmacia.para_seleccion_bodega.split(",")[0]
                                                }
                                            }
                                        };
                                        var url_eliminar_encabezado = API.PEDIDOS.ELIMINAR_REGISTRO_PEDIDO_TEMPORAL;

                                        Request.realizarRequest(url_eliminar_encabezado, "POST", obj_encabezado, function(data) {

                                            if(data.status == 200) {
                                                console.log("Eliminación de encabezado Exitosa: ", data.msj);
                                            }
                                            else
                                            {
                                                console.log("Eliminación de encabezado Fallida: ", data.msj);
                                            }
                                        });                                        
                                    }
                                    else
                                    {
                                        console.log("Eliminación Detalle Fallida: ", data.msj);
                                    }
                                });
                                /* Fin - Borrado Detalle Completo Pedido*/
                                
                                /*------------------------------------------------------*/
                                /* Fin - Eliminar Detalle Completo Pedido Temporal*/
                            }
                            else{
                                console.log("Detalle No Ingresado : ", data.msj);
                            }
                        });
                        
                    }
                    else{
                        console.log("Encabezado No Ingresado : ", data.msj);
                    }
                });
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
