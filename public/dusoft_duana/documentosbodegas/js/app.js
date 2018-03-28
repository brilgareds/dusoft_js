//main app module
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
    'includes/slide/slideContent',
    "includes/validation/ValidacionNumero",
    "includes/validation/ValidacionNumeroEntero",
    "includes/validation/ValidacionNumeroDecimal",
    "includes/validation/CambiarFoco",
    "includes/focus/NgFocus",
    "includes/widgets/InputCheck",
    "includes/menu/menucontroller",
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/classes/Usuario",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/helpersdirectives/selectOnClick",
    "includes/validation/NgValidateEvents",
    "models/I002/Laboratorio",
    "models/I002/EmpresaIngreso",
    "models/I002/ProductoIngreso",
    "models/I002/OrdenCompraIngreso",
    "models/I002/DocumentoIngreso",
    "models/I002/ProveedorIngreso",
    "models/E009/ProductoDevolucion",
    "models/E009/DocumentoDevolucion",
    "models/I011/DocumentoIngresoDevolucion",
    "models/I011/ProductoIngresoDevolucion",
    "models/I012/TipoTerceros",
    "models/I012/FacturaDevolucion",
    "models/I012/ProductoFactura",
    "models/I012/Clientes",
    "models/Index/TipoDocumentos",
    "models/Index/EmpresaDocumento",
    "models/Index/DocumentoBodega",
    "controllers/indexController",
    "controllers/I002/I002Controller",
    "controllers/I002/GestionarProductosController",
    "controllers/E009/E009Controller",
    "controllers/E009/E009GestionarProductosController",
    "controllers/I011/I011Controller",
    "controllers/I011/ModificarProductoController",
    "controllers/I012/I012Controller",
    "controllers/I012/I012GestionarClientesController",
    "controllers/I012/I012ModificarProductoController",
    "webNotification",
    "services/general/GeneralService",
    "services/E009/E009Service",
    "services/I011/I011Service",
    "services/I012/I012Service",
    
], function(angular) {

    /* App Module and its dependencies */

    var documentos_bodegas = angular.module('documentos_bodegas', [
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

    documentos_bodegas.urlRouterProvider;
    documentos_bodegas.stateProvider;

    documentos_bodegas.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            $httpProvider.interceptors.push('HttpInterceptor');
            documentos_bodegas.urlRouterProvider = $urlRouterProvider;
            documentos_bodegas.stateProvider = $stateProvider;

        }]).run(["$rootScope", "localStorageService", "Usuario", "$state", "$location", function($rootScope, localStorageService, Usuario, $state, $location) {

            $rootScope.name = "Administración Documentos de Bodega";

            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                var vista_predeterminada = "DocumentosBodegas";

                documentos_bodegas.urlRouterProvider.otherwise(vista_predeterminada);

                documentos_bodegas.stateProvider.state('DocumentosBodegas', {
                    url: "/DocumentosBodegas",
                    text: "Administración Documentos de Bodega",
                    templateUrl: "views/index.html",
                });

                // E007 
                documentos_bodegas.stateProvider.state('E007', {
                    url: "/E007",
                    text: "Administración Documentos de Bodega [E007]",
                    templateUrl: "views/E007/index.html",
                    parent_name : "DocumentosBodegas"
                });
                
                // I002 
                documentos_bodegas.stateProvider.state('I002', {
                    url: "/I002",
                    text: "Administración Documentos de Bodega [I002]",
                    templateUrl: "views/I002/index.html",
                    parent_name : "DocumentosBodegas",
                    controller: 'I002Controller'
                });
                
                // I0011 
                documentos_bodegas.stateProvider.state('I011', {
                    url: "/I011",
                    text: "Administración Documentos de Bodega [I011]",
                    templateUrl: "views/I011/index.html",
                    parent_name : "DocumentosBodegas",
                    controller: 'I011Controller'
                }).state('modificarProducto', {
                    url: "/modificarProducto",
                    text: "modificador de productos",
                    templateUrl: "views/I011/ventanaModificacion.html",
                    parent_name : "DocumentosBodegas",
                    controller: 'ModificarProductoController'
                });
                                
                // I012 
                documentos_bodegas.stateProvider.state('I012', {
                    url: "/I012",
                    text: "Administración Documentos de Bodega [I012]",
                    templateUrl: "views/I012/index.html",
                    parent_name : "DocumentosBodegas",
                    controller: 'I012Controller'
                });
                // E009
                documentos_bodegas.stateProvider.state('E009', {
                    url: "/E009",
                    text: "Administración Documentos de Bodega [E009]",
                    templateUrl: "views/E009/index.html",
                    parent_name : "DocumentosBodegas",
                    controller: 'E009Controller'
                }).state('buscarProductos', {
                    url: "/buscarProductos",
                    text: "Buscador de productos",
                    templateUrl: "views/E009/gestionarproductosE009.html",
                    parent_name : "DocumentosBodegas",
                    controller: 'E009GestionarProductosController'
                });


                if ($location.path() === "")
                    $state.go(vista_predeterminada);
                else
                    $state.go($location.path().replace("/", ""));
            });
        }]);

    angular.bootstrap(document, ['documentos_bodegas']);
    return documentos_bodegas;
});