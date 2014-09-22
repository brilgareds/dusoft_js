//Controlador de la View seleccioncliente.html asociado a Slide en cotizacioncliente.html

define(["angular", "js/controllers",'includes/slide/slideContent',
        'models/Cliente', 'models/PedidoVenta'], function(angular, controllers) {

    var fo = controllers.controller('SeleccionClienteController', [
        '$scope', '$rootScope', 'Request',
        'Empresa', 'Cliente', 'PedidoVenta',
        'API', "socket", "AlertService",
        '$state',

        function($scope, $rootScope, Request, Empresa, Cliente, PedidoVenta, API, socket, AlertService, $state) {


            $scope.paginas = 0;
            $scope.items = 0;
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.paginaactual = 1;
            $scope.listado_clientes = [];

            $scope.grid_clientes = {
                data: 'listado_clientes',
                enableColumnResize: true,
                enableRowSelection: false,
                columnDefs: [
                        {field: 'nit', displayName: 'Nit'},
                        {field: 'razon_social', displayName: 'Razón Social'},
                        {field: 'direccion', displayName: 'Dirección'},
                        {field: 'fecha_creacion', displayName: 'Fecha Creación'},
                        {field: 'telefono', displayName: 'Telefono'},
                        {field: 'email', displayName: 'E-Mail'},
                        {field: 'opciones', displayName: "Opciones", cellClass: "txt-center", width: "7%", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Activar</span></button></div>'}

                    ]
            };

            

            var estados = ["btn btn-danger btn-xs", "btn btn-warning btn-xs", "btn btn-primary btn-xs", "btn btn-info btn-xs", "btn btn-success btn-xs"];
            
            $scope.cerrar = function(){
               $scope.$emit('cerrarseleccioncliente', {animado:true});
               
               $scope.listado_clientes = [];
            };
            
            
            $rootScope.$on("mostrarseleccioncliente", function(e) {
            
                $scope.buscarSeleccionCliente("");
            });
            

            $scope.buscarSeleccionCliente = function(termino, paginando) {


                for(i=1; i<=10; i++)
                {
                    
                    obj = { 
                            nit: '123456'+i+'-1',
                            razon_social: 'Drogueria la '+i,
                            direccion: 'Cra 1 # 12 - '+i,
                            fecha_creacion: '0'+i+'-09-2014',
                            telefono: i+'251118',
                            email: 'cliente'+i+'@clientes.com'
                        }
                    
                    $scope.listado_clientes.push(obj);
                        
                }
                

            };
            
            $scope.onRowClick = function(row){
                return
                
            };



            //Método para liberar Memoria de todo lo construido en ésta clase
            $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 
               
                //Este evento no funciona para los Slides, así que toca liberar memoria con el emit al cerrar el slide
                //Las siguientes líneas son efectivas si se usa la view sin el slide
                $scope.listado_clientes = [];

            });
            
            //eventos de widgets
            $scope.onKeySeleccionClientePress = function(ev, termino_busqueda) {
                 //if(!$scope.buscarVerPedidosFarmacias($scope.DocumentoTemporal.bodegas_doc_id)) return;

                 if (ev.which == 13) {
                     $scope.buscarSeleccionCliente(termino_busqueda);
                 }
            };

            $scope.paginaAnterior = function() {
                 $scope.paginaactual--;
                 $scope.buscarSeleccionCliente($scope.termino_busqueda, true);
            };

            $scope.paginaSiguiente = function() {
                 $scope.paginaactual++;
                 $scope.buscarSeleccionCliente($scope.termino_busqueda, true);
            };

            $scope.valorSeleccionado = function() {


            };
            

        }]);
});
