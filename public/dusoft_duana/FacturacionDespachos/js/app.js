
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
    "includes/validation/CambiarFoco",
    "includes/widgets/InputCheck",     
    "includes/menu/menucontroller",   
    "includes/alert/Alert",
    "includes/header/HeaderController",
    "includes/classes/Usuario",
    "includes/classes/Concepto",
    "includes/http/Request",
    "includes/helpersdirectives/visualizarReporte",
    "includes/helpersdirectives/selectOnClick",
    "includes/validation/NgValidateEvents",
    "includes/classes/Factura",
    "includes/classes/FacturaDetalle",
    "models/TipoTerceros",
    "models/OrdenesComprasProveedores",
    "models/Totales",
    "models/ConceptoCaja",
    "models/TerceroDespacho",
    "models/EmpresaDespacho",
    "models/FacturaProveedores",
    "models/ProductoRecepcion",
    "models/ProductoFacturas",
    "models/DocumentoDespacho",
    "models/VendedorDespacho",
    "models/PedidoDespacho",
    "models/CajaGeneral",
    "models/Grupos",
    "models/Notas",
    "controllers/facturacionCliente/FacturacionClientesController",
    "controllers/facturacionCliente/PedidosClientesController",
    "controllers/facturacionCliente/VentanaMensajeSincronizacionController",
    "controllers/facturacionCliente/FacturacionConsumoController",
    "controllers/facturacionCliente/GuardarFacturaConsumoController",
    "controllers/facturacionProveedor/FacturacionProveedorController",
    "controllers/facturacionProveedor/DetalleRecepcionParcialController",
    "controllers/facturacionElectronica/FacturacionElectronicaController",
    "controllers/cajaGeneral/CajaGeneralController",
    "controllers/notas/NotasController",
    "services/facturacionClientesService",
    "services/facturacionProveedoresService",   
    "services/cajaGeneralService",
    "services/notasService",
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
                    controller: "FacturacionClientesController"
                }).state('PedidosClientesDespacho', {  
                    url: "/PedidosClientesDespacho",
                    text: "Listado de los productos listos para facturar",
                    templateUrl: "views/facturacionClientes/listarPedidos.html",
                    controller: "PedidosClientesController",
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
                }).state('GuardarFacturaConsumo', {
                    url: "/GuardarFacturaConsumo",
                    text: "Generar factura de consumo", 
                    parent_name: "Despacho",
                    templateUrl: "views/facturacionClientes/guardarFacturaConsumo.html",
                    controller: "GuardarFacturaConsumoController"                        
                }).state('CajaGeneral', {
                    url: "/CajaGeneral",
                    text: "Caja General",
                    parent_name: "Despacho",
                    templateUrl: "views/cajaGeneral/index.html",
                    controller: "CajaGeneralController"
                }).state('Notas', {
                    url: "/Notas",
                    text: "Notas",
                    parent_name: "Despacho",
                    templateUrl: "views/notas/index.html",
                    controller: "NotasController"
                }).state('FacturacionElectronica', {
                    url: "/FacturacionElectronica",
                    text: "Facturacion Electronica",
                    parent_name: "Despacho",
                    templateUrl: "views/facturacionElectronica/index.html",
                    controller: "FacturacionElectronicaController"
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
