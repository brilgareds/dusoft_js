//Controlador de la View verpedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('VerPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Farmacia', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario",

        function($scope, $rootScope, Request, Empresa, Farmacia, PedidoVenta, API, socket, AlertService, $state, Usuario) {

            $scope.Empresa = Empresa;
            
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = {};
            $scope.paginaactual = 1;
            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.listado_pedidos = [];
            
            $scope.seleccion = "FD";
            $scope.session = {
                usuario_id:Usuario.usuario_id,
                auth_token:Usuario.token
            };
            
            $scope.empresas = [];
            
            var that = this;

            $scope.estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];


            $scope.listarEmpresas = function() {

                var obj = {
                    session: $scope.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.empresas = data.obj.empresas;
                        //console.log(JSON.stringify($scope.empresas))
                    }
                    
                });
            };
            
            /* Código añadido 2 - para revisar */
            $scope.obtenerParametros = function(){
                
                $scope.ultima_busqueda.seleccion = "";
                $scope.ultima_busqueda.termino_busqueda = "";

                //valida si cambio el termino de busqueda
                if($scope.ultima_busqueda.termino_busqueda != $scope.termino_busqueda
                        || $scope.ultima_busqueda.seleccion != $scope.seleccion){
                    $scope.paginaactual = 1;
                }

                var obj = {
                    session:$scope.session,
                    data:{
                        pedidos_farmacias:{
                            termino_busqueda: $scope.termino_busqueda,
                            empresa_id: $scope.seleccion,
                            pagina_actual: $scope.paginaactual,
                            filtro:{}
                        }
                    }
                };

                return obj;
            }               
            
            /* Código añadido 1 - para revisar */
            
            $scope.buscarPedidosFarmacias = function(obj, paginando) {
                
                var url = API.PEDIDOS.LISTAR_PEDIDOS_FARMACIAS;

                Request.realizarRequest(url, "POST", obj, function(data) {
                    
                    console.log("Data: ",data);

                    if(data.status == 200) {
                        
                        $scope.ultima_busqueda = {
                                termino_busqueda: $scope.termino_busqueda,
                                seleccion: $scope.seleccion
                        }
                        
                        $scope.renderPedidosFarmacias(data.obj, paginando);
                    }
                    
//                    if(data.obj.documentos_temporales != undefined) {
//                        //callback(data.obj, paginando, tipo);
//                        $scope.renderPedidosFarmacias(data.obj, paginando);
//                    }

                });

            };
            
            $scope.onKeyPedidoFarmaciaPress = function(ev, termino_busqueda) {
                
                if (ev.which == 13) {
                    $scope.buscarPedidosSeparados($scope.obtenerParametros(), 2, false, $scope.renderPedidosSeparados);
                }
            };

            $scope.renderPedidosFarmacias = function(data, paginando) {

                var items = data.pedidos_farmacias.length;
                //se valida que hayan registros en una siguiente pagina
                if(paginando && items == 0){
                    if($scope.paginaactual > 1){
                        $scope.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning","No se encontraron mas registros");
                    return;
                }

                $scope.Empresa.vaciarPedidosFarmacia();
               
                for (var i in data.pedidos_farmacias) {

                    var obj = data.pedidos_farmacias[i];
                    
                    var pedido = $scope.crearPedido(obj);

                    $scope.Empresa.agregarPedidoFarmacia(pedido);

                }

            };

            $scope.crearPedido = function(obj) {
                
                var pedido = PedidoVenta.get();
                
                datos_pedido = {
                    numero_pedido: obj.numero_pedido,
                    fecha_registro: obj.fecha_registro,
                    descripcion_estado_actual_pedido: obj.descripcion_estado_actual_pedido,
                    estado_actual_pedido: obj.estado_actual_pedido,
                    estado_separacion: obj.estado_separacion
                };
                
                pedido.setDatos(datos_pedido);
                pedido.setTipo(2);

                        
                var farmacia = Farmacia.get(
                        obj.farmacia_id,
                        obj.bodega_id,
                        obj.nombre_farmacia,
                        obj.nombre_bodega
                        );

                pedido.setFarmacia(farmacia);

                return pedido;
            };

            //definicion y delegados del Tabla de pedidos clientes

            $scope.lista_pedidos_farmacias = {
                data: 'Empresa.getPedidosFarmacia()',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                    {field: 'numero_pedido', displayName: 'Número Pedido'},
                    {field: 'farmacia.nombre_farmacia', displayName: 'Farmacia'},
                    {field: 'farmacia.nombre_bodega', displayName: 'Bodega'},
                    {field: 'zona', displayName: 'Zona'},
                    {field: 'fecha_registro', displayName: 'Fecha'},
                    {field: 'estado_actual_pedido', displayName: 'EstadoId', visible: false},
                    {field: 'descripcion_estado_actual_pedido', displayName: 'Estado', cellClass: "txt-center",
                        cellTemplate: "<button ng-class='estados[row.entity.estado_actual_pedido]'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},
                    {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="editarPedidoFarmacia(row.entity)"><span class="glyphicon glyphicon-zoom-in">Activar</span></button></div>'}

                ]

            };
 
            // Agregar Restriccion de acuerdo al estado de asigancion del pedido
            $scope.agregarRestriccion = function(estado_separacion) {

                var clase = "";
                if (estado_separacion)
                    clase = "glyphicon glyphicon-lock";

                return clase;
            };
            
            $scope.abrirViewPedidoFarmacia = function(){
                
                $rootScope.pedidoseleccionado = {numero_pedido: " "}
                $state.go('CreaPedidosFarmacias');
            };
            
            $scope.editarPedidoFarmacia = function(data){
                
                //$scope.creapedidosfarmacias = "views/creapedidosfarmacias.html";
                localStorage.setItem("pedidoseleccionado", data.numero_pedido);
                $rootScope.pedidoseleccionado = data;
                
                console.log("INFORMACION EN DATA: ",data);
                
                $state.go('CreaPedidosFarmacias');
                
                //$scope.$broadcast('pedidoSeleccionado', data);
                
               // $rootScope.$emit('pedidoSeleccionado', data);
                
                //$scope.$broadcast('cargarGridSeleccionadoSlide', $scope.listado_productos);

                
            }
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
               //alert("En éste momento debo limpiar algo");
               $scope.listado_pedidos = [];

            });
            
            //eventos de widgets
            $scope.onKeyVerPedidosFarmaciasPress = function(ev, termino_busqueda) {
                 //if(!$scope.buscarVerPedidosFarmacias($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     $scope.buscarVerPedidosFarmacias(termino_busqueda);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.paginaactual--;
                 $scope.buscarVerPedidosFarmacias($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.paginaactual++;
                 $scope.buscarVerPedidosFarmacias($scope.termino_busqueda, true);
            };

            $scope.valorSeleccionado = function() {
//                 var obj = {
//                     session: $scope.session,
//                     data: {
//                         movimientos_bodegas: {
//                             documento_temporal_id: $scope.documento_temporal_id, 
//                             usuario_id: $scope.usuario_id,
//                             bodegas_doc_id: $scope.seleccion,
//                             numero_pedido:$scope.numero_pedido
//                         }
//                     }
//                 };
//
//                $scope.validarDocumentoUsuario(obj, 2, function(data){
//                    if(data.status === 200){
//                        $scope.DocumentoTemporal.bodegas_doc_id = $scope.seleccion;
//                        AlertService.mostrarMensaje("success", data.msj);
//                    } else {
//                        AlertService.mostrarMensaje("warning", data.msj);
//                    }
//                });

            };
            
            $scope.buscarPedidosFarmacias($scope.obtenerParametros(),"");
            $scope.listarEmpresas("");

        }]);
});
