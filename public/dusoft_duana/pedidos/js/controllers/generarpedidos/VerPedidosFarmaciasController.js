//Controlador de la View verpedidosfarmacias.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('VerPedidosFarmaciasController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Farmacia', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state', "Usuario", "localStorageService",

        function($scope, $rootScope, Request, Empresa, Farmacia, PedidoVenta, API, socket, AlertService, $state, Usuario, localStorageService) {

            /*$scope.Empresa = Empresa;
            
            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = {};
            $scope.paginaactual = 1;
            //$scope.numero_pedido = "";
            //$scope.obj = {};
            $scope.listado_pedidos = [];
            
            $scope.ultima_busqueda.seleccion = "";
            $scope.ultima_busqueda.termino_busqueda = "";
            
            $scope.seleccion = "FD";
            
            $scope.session = {
                usuario_id:Usuario.usuario_id,
                auth_token:Usuario.token
            };
            
            $scope.empresas = [];

            $scope.estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];*/
            
            $scope.rootVerPedidosFarmacias = {};
            
            $scope.rootVerPedidosFarmacias.Empresa = Empresa;
            
            $scope.rootVerPedidosFarmacias.paginas = 0;
            $scope.rootVerPedidosFarmacias.items = 0;
            $scope.rootVerPedidosFarmacias.termino_busqueda = "";
            $scope.rootVerPedidosFarmacias.ultima_busqueda = {};
            $scope.rootVerPedidosFarmacias.paginaactual = 1;

            $scope.rootVerPedidosFarmacias.listado_pedidos = [];
            
            $scope.rootVerPedidosFarmacias.ultima_busqueda.seleccion = "";
            $scope.rootVerPedidosFarmacias.ultima_busqueda.termino_busqueda = "";
            
            $scope.rootVerPedidosFarmacias.seleccion = "FD";
            
            $scope.rootVerPedidosFarmacias.session = {
                usuario_id:Usuario.usuario_id,
                auth_token:Usuario.token
            };
            
            $scope.rootVerPedidosFarmacias.empresas = [];

            $scope.rootVerPedidosFarmacias.estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            var that = this;            


            $scope.listarEmpresas = function() {

                var obj = {
                    session: $scope.rootVerPedidosFarmacias.session,
                    data: {}
                };

                Request.realizarRequest(API.PEDIDOS.LISTAR_EMPRESAS, "POST", obj, function(data) {
                    
                    if (data.status == 200) {
                        $scope.rootVerPedidosFarmacias.empresas = data.obj.empresas;
                        //console.log(JSON.stringify($scope.empresas))
                    }
                    
                });
            };
            
            /* Código añadido 2 - para revisar */
            $scope.obtenerParametros = function(){

                //valida si cambio el termino de busqueda
                if($scope.rootVerPedidosFarmacias.ultima_busqueda.termino_busqueda != $scope.rootVerPedidosFarmacias.termino_busqueda
                        || $scope.rootVerPedidosFarmacias.ultima_busqueda.seleccion != $scope.rootVerPedidosFarmacias.seleccion){
                    $scope.rootVerPedidosFarmacias.paginaactual = 1;
                }

                var obj = {
                    session:$scope.rootVerPedidosFarmacias.session,
                    data:{
                        pedidos_farmacias:{
                            termino_busqueda: $scope.rootVerPedidosFarmacias.termino_busqueda,
                            empresa_id: $scope.rootVerPedidosFarmacias.seleccion,
                            pagina_actual: $scope.rootVerPedidosFarmacias.paginaactual,
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
                        
                        $scope.rootVerPedidosFarmacias.ultima_busqueda = {
                                termino_busqueda: $scope.rootVerPedidosFarmacias.termino_busqueda,
                                seleccion: $scope.rootVerPedidosFarmacias.seleccion
                        }
                        
                        that.renderPedidosFarmacias(data.obj, paginando);
                    }

                });

            };

            that.renderPedidosFarmacias = function(data, paginando) {

                $scope.rootVerPedidosFarmacias.items = data.pedidos_farmacias.length;
                
                //se valida que hayan registros en una siguiente pagina
                if(paginando && $scope.rootVerPedidosFarmacias.items == 0){
                    if($scope.rootVerPedidosFarmacias.paginaactual > 1){
                        $scope.rootVerPedidosFarmacias.paginaactual--;
                    }
                    AlertService.mostrarMensaje("warning","No se encontraron más registros");
                    return;
                }

                $scope.rootVerPedidosFarmacias.Empresa.vaciarPedidosFarmacia();
               
                for (var i in data.pedidos_farmacias) {

                    var obj = data.pedidos_farmacias[i];
                    
                    var pedido = that.crearPedido(obj);

                    $scope.rootVerPedidosFarmacias.Empresa.agregarPedidoFarmacia(pedido);

                }

            };

            that.crearPedido = function(obj) {
                
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

            $scope.rootVerPedidosFarmacias.lista_pedidos_farmacias = {
                data: 'rootVerPedidosFarmacias.Empresa.getPedidosFarmacia()',
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
                        cellTemplate: "<button ng-class='rootVerPedidosFarmacias.estados[row.entity.estado_actual_pedido]'> <span ng-class='agregarRestriccion(row.entity.estado_separacion)'></span> {{row.entity.descripcion_estado_actual_pedido}} </button>"},
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
                
                $state.go('CreaPedidosFarmacias');
            };
            
            $scope.editarPedidoFarmacia = function(data){
                
                PedidoVenta.pedidoseleccionado = data.numero_pedido;
                $state.go('CreaPedidosFarmacias');                
            }
            
            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 

                $scope.rootVerPedidosFarmacias = {};
                $scope.$$watchers = null;

            });
            
            //eventos de widgets
            $scope.onKeyVerPedidosFarmaciasPress = function(ev) {

                 if (ev.which == 13) {
                     $scope.buscarPedidosFarmacias($scope.obtenerParametros());
                 }
            };
            
            $scope.paginaAnterior = function() {
                 $scope.rootVerPedidosFarmacias.paginaactual--;
                 $scope.buscarPedidosFarmacias($scope.obtenerParametros(), true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.rootVerPedidosFarmacias.paginaactual++;
                 $scope.buscarPedidosFarmacias($scope.obtenerParametros(), true);
            };

            $scope.valorSeleccionado = function() {
                
                $scope.buscarPedidosFarmacias($scope.obtenerParametros());
            };
            
            $scope.buscarPedidosFarmacias($scope.obtenerParametros());
            $scope.listarEmpresas("");

        }]);
});
