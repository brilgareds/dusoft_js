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
    "controllers/Admin/AdminController",
    "controllers/Grupos/GuardarGruposController",
    "includes/classes/GrupoChat",
   /* "models/chat/EmpresaPedido",
    "controllers/asignarchat/PedidosController",
    "controllers/asignarchat/PedidosClientesController",
    "controllers/asignarchat/PedidosFarmaciasController",
    "controllers/auditoriachat/AuditoriaPedidosController",
    "controllers/auditoriachat/DetallepedidoSeparadoClienteController",
    "controllers/auditoriachat/DetallepedidoSeparadoFarmaciaController",
    
    //chat farmacias
    "models/generacionchat/chatfarmacias/EmpresaPedidoFarmacia",
    "controllers/generacionchat/chatfarmacias/PedidosFarmaciaController",
    "controllers/generacionchat/chatfarmacias/GuardarPedidoBaseController",
    
    // Nuevas Urls para el proceso de chat clientes
    "controllers/generacionchat/chatclientes/ReportePedidosClientesController",
    "controllers/generacionchat/chatclientes/ListarPedidosClientesController",
    "controllers/generacionchat/chatclientes/PedidosClienteController",
    "controllers/generacionchat/chatclientes/GestionarProductosClientesController",
    "controllers/separacionchat/ContenedorSeparacionController",
    "controllers/separacionchat/SeparacionProductosController",
    "controllers/separacionchat/SeparacionDetalleController",
    "services/separacionchat/SeparacionService",
    "controllers/separacionchat/SeparacionProductosPendientesController",
    
    //Nuevo modelo
    "models/separacionchat/DocumentoDespacho",
    
    //Nuevo controlador
    "controllers/auditoriachat/AuditoriaHTMLReportController",
    
    //Service notificaciones
    
    
    //Nuevos modelos para Opcion Despachos
     "models/auditoriachat/DocumentoAuditado",
     "models/auditoriachat/EmpresaDespacho",
     
    //Nuevo Controlador para el detalle de los EFC
    "controllers/auditoriachat/AuditoriaDespachosDetalle",
    "controllers/auditoriachat/AuditoriaDespachos",
    
    //NUevo servicio para AUditoriaDespachos
    "services/auditoriadespacho/AuditoriaDespachoService",*/
    "webNotification"
    
    
], function(angular) {
    /* App Module and its dependencies */

    var chat = angular.module('chat', [
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

    // se debe declarar estas propiedades para tener la referencia del urlProvider
    chat.urlRouterProvider;
    chat.stateProvider;

    chat.config(["$stateProvider", "$urlRouterProvider", "$httpProvider", function($stateProvider, $urlRouterProvider, $httpProvider) {

            // For any unmatched url, send to /route1
            //console.log($httpProvider, "http provider");
            //intercepta los http para validar el usuario
            $httpProvider.interceptors.push('HttpInterceptor');

            //se pasa la referencia del urlRouterProvider y del stateProvider, ya no debe declararse los routers en esta parte
            chat.urlRouterProvider = $urlRouterProvider;
            chat.stateProvider = $stateProvider;

        }]).run(["$rootScope", "$location", "$state", function($rootScope, $location, $state) {
            //$rootScope.titulo_modulo = "chat";
            $rootScope.name = "chat";
            var vistaDefecto = "Admin";

            //este evento se dispara cuando los permisos del usuario esta listos
            $rootScope.$on("parametrizacionUsuarioLista", function(e, parametrizacion) {

                chat.urlRouterProvider.otherwise(vistaDefecto);

                chat.stateProvider
                .state('Admin', {
                    url: "/Admin",
                    text: "Configuracion",
                    templateUrl: "views/Admin/TabAdministracion.html",
                    controller:"AdminController"
                })
                .state('GuardarGrupo', {
                    url: "/GuardarGrupo",
                    text: "Guardar Grupo",
                    templateUrl: "views/Grupos/GuardarGrupo.html",
                    parent_name: "Admin",
                    controller:"GuardarGruposController"
                })                
                /*.state('ListarPedidosFarmacias',{
                    url: "/ListarPedidosFarmacias",
                    text: "Pedidos Farmacias",
                    templateUrl: "views/generacionchat/chatfarmacias/listachat.html"
                })
                .state('GuardarPedidoTemporal',{
                    url: "/GuardarPedidoTemporal",
                    text: "Pedido Farmacia Temporal",
                    templateUrl: "views/generacionchat/chatfarmacias/guardarpedidotemporal.html",
                    parent_name: "ListarPedidosFarmacias",
                    controller: "GuardarPedidoBaseController"
                })
                .state('GuardarPedido',{
                    url: "/GuardarPedido",
                    text: "Pedido Farmacia",
                    templateUrl: "views/generacionchat/chatfarmacias/guardarpedido.html",
                    parent_name: "ListarPedidosFarmacias",
                    controller: "GuardarPedidoBaseController"
                }).state('DocumentoDespacho',{              
                    url: "/DocumentoDespacho",
                    templateUrl: "views/auditoriachat/AuditoriaHTMLReport.html",
                    parent_name: "AuditarPedidos",
                    controller: "AuditoriaHTMLReportController"
                }).state('AuditoriaDespachos', {
                    url: "/AuditoriaDespachos",
                    text: "Detalle de despachos auditados",
                    templateUrl: "views/auditoriachat/AuditoriaDespachos.html",
                    parent_name: "AuditarPedidos",
                    controller: 'AuditoriaDespachosDetalle'
                });
                // URL's Pedidos Clientes
                chat.stateProvider.state('ListarPedidosClientes', {
                    url: "/ListarPedidosClientes",
                    text: "Listado Pedidos Clientes",
                    templateUrl: "views/generacionchat/chatclientes/index.html"
                }).state('Cotizaciones', {
                    url: "/Cotizaciones",
                    text: "Gestionar Cotizaciones",
                    templateUrl: "views/generacionchat/chatclientes/gestionarpedidocliente.html",
                    parent_name : "ListarPedidosClientes"
                }).state('PedidoCliente', {
                    url: "/PedidoCliente",
                    text: "Gestionar Pedidos Clientes",
                    templateUrl: "views/generacionchat/chatclientes/gestionarpedidocliente.html",
                    parent_name : "ListarPedidosClientes"
                }).state('SeparacionPedidos', {
                    url: "/SeparacionPedidos",
                    text: "Separacion Pedidos",
                    templateUrl: "views/separacionchat/separacionchat.html"
                    
                }).state('SeparacionProducto', {
                    url: "/SeparacionProducto",
                    text: "Separacion producto", 
                    parent_name: "SeparacionPedidos",
                    templateUrl: "views/separacionchat/separacionProducto.html",
                    controller: "SeparacionProductosController"
                    
                }).state('TrasladoExistencias', {
                    url: "/TrasladoExistencias",
                    text: "Traslado Existencias", 
                    templateUrl: "views/trasladoexistencias/listaproductos.html",
                    controller: "TrasladoExistenciasController"
                    
                })*/
                
                
                

                if ($location.path() === "") {
                    $state.go(vistaDefecto);
                } else {
                    //se encarga de ir al ultimo path, despues que se configura las rutas del modulo
                    $state.go($location.path().replace("/", ""));
                }

            });

        }]);

    angular.bootstrap(document, ['chat']);
    return chat;
});