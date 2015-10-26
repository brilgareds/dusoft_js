//Este controlador sirve como parent para los controladores DetallepedidoSeparadoCliente y DetallepedidoSeparadoFarmacia, encapsula logica en comun por estos dos ultimos
define(["angular", "js/controllers",
    'includes/slide/slideContent',
    'models/auditoriapedidos/ClientePedido',
    'models/auditoriapedidos/PedidoAuditoria',
    'models/auditoriapedidos/Separador',
    'models/auditoriapedidos/Auditor',
    'models/auditoriapedidos/DocumentoTemporal',
    'models/auditoriapedidos/Caja',
    "controllers/auditoriapedidos/AuditoriaPedidosClientesController",
    "controllers/auditoriapedidos/AuditoriaPedidosFarmaciasController",
    "controllers/auditoriapedidos/EditarProductoController"], function(angular, controllers) {

    var fo = controllers.controller('AuditoriaHTMLReportController', [
        '$scope', '$rootScope', 'Request',
        'EmpresaPedido', 'Cliente', 'Farmacia', 'PedidoAuditoria',
        'Separador', 'DocumentoTemporal', 'API',
        "socket", "AlertService", "ProductoPedido", "LoteProductoPedido",
        "$modal", 'Auditor', 'Usuario', "localStorageService", "$state",
        function($scope, $rootScope, Request,
                Empresa, Cliente, Farmacia,
                PedidoAuditoria, Separador, DocumentoTemporal,
                API, socket, AlertService,
                ProductoPedido, LoteProductoPedido, $modal, Auditor, Usuario, localStorageService, $state) {

            $scope.Empresa = Empresa;

            $scope.session = {
                usuario_id: Usuario.getUsuarioActual().getId(),
                auth_token: Usuario.getUsuarioActual().getToken()
            };
            $scope.DatosDocumentoDespachado="";
            $scope.termino_busqueda = "";
            $scope.ultima_busqueda = "";
            $scope.productosAuditados = [];
            $scope.productosNoAuditados = [];
            $scope.productosPendientes = [];
            $scope.cajasSinCerrar = [];
            $scope.notificacionclientes = 0;
            $scope.notificacionfarmacias = 0;
            $scope.activarTabFarmacias = false;
            $scope.filtro = {
                codigo_barras: false
            };


            var opciones = Usuario.getUsuarioActual().getModuloActual().opciones;
     
           
            $scope.DatosDocumentoDespachado = localStorageService.get("DocumentoDespachoImprimir");
           // $scope.DatosDocumentoDespachado = dattta;
            //permisos auditoria
            $scope.opcionesModulo = {
                btnAuditarClientes: {
                    'click': opciones.sw_auditar_clientes
                },
                btnAuditarFarmacias: {
                    'click': opciones.sw_auditar_farmacias
                }
            };

        }]);
});
