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
    "controllers/generarpedidos/CotizacionesController",
    "controllers/generarpedidos/CreaCotizacionesController",
    "controllers/generarpedidos/SeleccionClienteController",
    "controllers/generarpedidos/SeleccionProductoClienteController",
    "controllers/generarpedidos/SeleccionProductoFarmaciaController",
    "controllers/generarpedidos/CreaPedidoFarmaciaController",
    "controllers/generarpedidos/VerPedidosFarmaciasController",
    "controllers/generarpedidos/VerPedidosTempFarmaciasController",
    "controllers/generarpedidos/PedidosClientesVentasController",
    "controllers/generarpedidos/MailPdfController",
    "controllers/generarpedidos/ContenedorPedidosFarmaciasController",
    "controllers/generarpedidos/AprobarCotizacionController",
    "controllers/generarpedidos/AprobarPedidoController",
    "controllers/asignarpedidos/PedidosController",
    "controllers/asignarpedidos/PedidosClientesController",
    "controllers/asignarpedidos/PedidosFarmaciasController",
    "controllers/auditoriapedidos/AuditoriaPedidosController",
    "controllers/auditoriapedidos/DetallepedidoSeparadoClienteController",
    "controllers/auditoriapedidos/DetallepedidoSeparadoFarmaciaController",
    
    //pedidos farmacias

    "models/generacionpedidos/pedidosfarmacias/EmpresaPedidoFarmacia",
    "controllers/generacionpedidos/pedidosfarmacias/PedidosFarmaciaController",
    
    // Nuevas Urls para el proceso de pedidos clientes
    "controllers/generacionpedidos/pedidosclientes/ListarPedidosClientesController",
    "controllers/generacionpedidos/pedidosclientes/PedidosClienteController",
    "controllers/generacionpedidos/pedidosclientes/GestionarProductosClientesController"

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
        'ui.select2',
        //'ui.select',
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
                            //controller:"pedidoscontroller"
                })
                .state('AuditarPedidos', {
                    url: "/AuditarPedidos",
                    text: "Auditar Pedidos",
                    templateUrl: "views/auditoriapedidos/AuditoriaPedidos.html"
                })
                .state('PedidosClientes', {
                    url: "/PedidosClientes",
                    text: "Pedidos Clientes",
                    templateUrl: "views/generarpedidos/pedidosclientes.html"
                })
                .state('CotizacionCliente', {
                    url: "/CotizacionCliente",
                    text: "Cotización Clientes",
                    templateUrl: "views/generarpedidos/cotizacioncliente.html",
                    parent_name: "PedidosClientes"
                })
                .state('VerPedidosFarmacias', {
                    url: "/VerPedidosFarmacias",
                    text: "Pedidos Farmacias",
                    templateUrl: "views/generarpedidos/verpedidosfarmacias.html"
                })
                .state('CreaPedidosFarmacias', {
                    url: "/CreaPedidosFarmacias",
                    text: "Crear/Editar Pedidos Farmacias",
                    templateUrl: "views/generarpedidos/creapedidosfarmacias.html",
                    parent_name: "VerPedidosFarmacias"
                })
                .state('ListarPedidosFarmacias',{
                    url: "/ListarPedidosFarmacias",
                    text: "Pedidos Farmacias",
                    templateUrl: "views/generacionpedidos/listapedidos.html"
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