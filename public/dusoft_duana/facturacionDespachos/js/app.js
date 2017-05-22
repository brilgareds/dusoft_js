
define([
    "angular",
    "socketservice",
    "route",
    "bootstrap",
    "bootstrapLib",
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
    "includes/validation/ValidacionNumeroDecimal",
    "includes/widgets/InputCheck",     
    "includes/menu/menucontroller",   
    "includes/alert/Alert",
    "includes/header/HeaderController",           
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/helpersdirectives/selectOnClick",
    "includes/validation/NgValidateEvents",
    "models/TipoTerceros",
    "models/OrdenesComprasProveedores",
    "models/Totales",
    "models/TerceroDespacho",
    "models/EmpresaDespacho",
    "models/FacturaProveedores",
    "models/ProductoRecepcion",
    "models/DocumentoDespacho",
    "models/VendedorDespacho",
    "models/PedidoDespacho",
    "controllers/facturacionCliente/facturacionClientesController",
    "controllers/facturacionCliente/pedidosClientesController",
    "controllers/facturacionCliente/ventanaMensajeSincronizacionController",
    "controllers/facturacionProveedor/FacturacionProveedorController",
    "controllers/facturacionProveedor/DetalleRecepcionParcialController",
    "services/facturacionClientesService",
    "services/facturacionProveedoresService",
    "webNotification"
], function(angular) { 

        /* App Module and its dependencies */
    var facturacionClientes = angular.module('Facturacion', [
        'ui.router',
        'controllers',
        'models',
        'ui.bootstrap',
        'ngGrid',
        'directive',
        'Url',
        'services',
        'ui.select',
        'LocalStorageModule',
        'flow',
        'angular-web-notification'
    ]);

    facturacionClientes.urlRouterProvider;
    facturacionClientes.stateProvider;

    facturacionClientes.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            facturacionClientes.urlRouterProvider = $urlRouterProvider;
            facturacionClientes.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Bienvenido";
            

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {
                
                var vista_predeterminada = "Despacho";

                facturacionClientes.urlRouterProvider.otherwise(vista_predeterminada);

                facturacionClientes.stateProvider.state('Despacho', {
                    url: "/Despacho",
                    text: "Facturacion Despacho", 
                    templateUrl: "views/facturacionClientes/index.html",
                    controller: "facturacionClientesController"
                }).state('PedidosClientesDespacho', {
                    url: "/PedidosClientesDespacho",
                    text: "Listado de los productos listos para facturar",
                    templateUrl: "views/facturacionClientes/listarPedidos.html",
                    controller: "pedidosClientesController",
                    parent_name : "Despacho"
                }).state('FacturacionProveedores', {
                    url: "/FacturacionProveedores",
                    text: "Facturacion Proveedores", 
                    templateUrl: "views/facturacionProveedores/index.html",
                    parent_name: "Despacho",
                    controller: "FacturacionProveedorController"
                }).state('DetalleRecepcionParcial', {
                    url: "/DetalleRecepcionParcial",
                    text: "Detalle Recepcion Parcial", 
                    parent_name: "Despacho",
                    templateUrl: "views/facturacionProveedores/detallePedidos.html",
                    controller: "DetalleRecepcionParcialController"                        
                });
                    

                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });

        }]);

    angular.bootstrap(document, ['Facturacion']);
    return facturacionClientes;
    
});
