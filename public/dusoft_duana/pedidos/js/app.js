//main app module
define([
    "angular",
    "socketservice",
    "route",
    "bootstrap",
    "js/controllers",
    "js/models",
    "js/services",
    "js/directive",
    "nggrid",
    "uiselect2",
    "loader",
    "url",
    'storage',
    "httpinterceptor",
    "dragndropfile",
    "includes/validation/ValidacionNumero",
    "includes/validation/ValidacionNumeroEntero",
    "includes/widgets/InputCheck",
    "includes/menu/menucontroller",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/validation/NgValidateEvents",
    "models/pedidos/EmpresaPedido",
    "controllers/asignarpedidos/PedidosController",
    "controllers/asignarpedidos/PedidosClientesController",
    "controllers/asignarpedidos/PedidosFarmaciasController",
    "controllers/auditoriapedidos/AuditoriaPedidosController",
    "controllers/auditoriapedidos/DetallepedidoSeparadoClienteController",
    "controllers/auditoriapedidos/DetallepedidoSeparadoFarmaciaController",
    
    //pedidos farmacias

    "models/generacionpedidos/pedidosfarmacias/EmpresaPedidoFarmacia",
    "controllers/generacionpedidos/pedidosfarmacias/PedidosFarmaciaController",
    "controllers/generacionpedidos/pedidosfarmacias/GuardarPedidoBaseController",
    
    // Nuevas Urls para el proceso de pedidos clientes
    "controllers/generacionpedidos/pedidosclientes/ReportePedidosClientesController",
    "controllers/generacionpedidos/pedidosclientes/ListarPedidosClientesController",
    "controllers/generacionpedidos/pedidosclientes/PedidosClienteController",
    "controllers/generacionpedidos/pedidosclientes/GestionarProductosClientesController",
    "controllers/separacionpedidos/ContenedorSeparacionController",
    "controllers/separacionpedidos/SeparacionProductosController",
    "services/separacionpedidos/SeparacionService"

], function(angular) {
    /* App Module and its dependencies */

    var pedidos = angular.module('pedidos', [
        'ui.router',
        'controllers',
        'models',
        'ui.bootstrap',
        'ngGrid',
        'directive',
        'Url',
        'services',
        //'ui.select2',
        'ui.select',
        'LocalStorageModule',
        'flow'
    ]);

    // se debe declarar estas propiedades para tener la referencia del urlProvider
    pedidos.urlRouterProvider;
    pedidos.stateProvider;

    pedidos.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //console.log($httpProvider, "http provider");
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            //se pasa la referencia del urlRouterProvider y del stateProvider, ya no debe declararse los routers en esta parte
            pedidos.urlRouterProvider = $urlRouterProvider;
            pedidos.stateProvider = $stateProvider;

        }]).run(["$rootScope", "$location", "$state", function($rootScope, $location, $state) {
            //$rootScope.titulo_modulo = "pedidos";
            $rootScope.name = "pedidos";
            var vistaDefecto = "AsignarPedidos";

            //este evento se dispara cuando los permisos del usuario esta listos
            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                pedidos.urlRouterProvider.otherwise(vistaDefecto);

                pedidos.stateProvider
                .state('AsignarPedidos', {
                    url: "/AsignarPedidos",
                    text: "Asignar Pedidos",
                    templateUrl: "views/asignarpedidos/AsignarPedidos.html"
                })
                .state('AuditarPedidos', {
                    url: "/AuditarPedidos",
                    text: "Auditar Pedidos",
                    templateUrl: "views/auditoriapedidos/AuditoriaPedidos.html"
                })                
                .state('ListarPedidosFarmacias',{
                    url: "/ListarPedidosFarmacias",
                    text: "Pedidos Farmacias",
                    templateUrl: "views/generacionpedidos/pedidosfarmacias/listapedidos.html"
                })
                .state('GuardarPedidoTemporal',{
                    url: "/GuardarPedidoTemporal",
                    text: "Pedido Farmacia Temporal",
                    templateUrl: "views/generacionpedidos/pedidosfarmacias/guardarpedidotemporal.html",
                    parent_name: "ListarPedidosFarmacias",
                    controller: "GuardarPedidoBaseController"
                })
                .state('GuardarPedido',{
                    url: "/GuardarPedido",
                    text: "Pedido Farmacia",
                    templateUrl: "views/generacionpedidos/pedidosfarmacias/guardarpedido.html",
                    parent_name: "ListarPedidosFarmacias",
                    controller: "GuardarPedidoBaseController"
                });

                // URL's Pedidos Clientes
                pedidos.stateProvider.state('ListarPedidosClientes', {
                    url: "/ListarPedidosClientes",
                    text: "Listado Pedidos Clientes",
                    templateUrl: "views/generacionpedidos/pedidosclientes/index.html"
                }).state('Cotizaciones', {
                    url: "/Cotizaciones",
                    text: "Gestionar Cotizaciones",
                    templateUrl: "views/generacionpedidos/pedidosclientes/gestionarpedidocliente.html",
                    parent_name : "ListarPedidosClientes"
                }).state('PedidoCliente', {
                    url: "/PedidoCliente",
                    text: "Gestionar Pedidos Clientes",
                    templateUrl: "views/generacionpedidos/pedidosclientes/gestionarpedidocliente.html",
                    parent_name : "ListarPedidosClientes"
                }).state('SeparacionPedidos', {
                    url: "/SeparacionPedidos",
                    text: "Separacion Pedidos",
                    templateUrl: "views/separacionpedidos/separacionpedidos.html"
                    
                }).state('SeparacionProducto', {
                    url: "/SeparacionProducto",
                    text: "Separacion producto", 
                    parent_name: "SeparacionPedidos",
                    templateUrl: "views/separacionpedidos/separacionProducto.html",
                    controller: "SeparacionProductosController"
                    
                });
                
                
                

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['pedidos']);
    return pedidos;
});