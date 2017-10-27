
define(["angular", "js/controllers"], function(angular, controllers) {

    controllers.controller('ListarLogsOrdenCompraController', [
	'$scope',
	'$rootScope',
	'Request',
	'$modal',
	'API',
	"socket",
	"$timeout",
	"AlertService",
	"localStorageService",
	"$state",
	"Usuario", "$sce", "$modalInstance", "productos",
	function($scope, $rootScope, Request, $modal, API, socket, $timeout, AlertService, localStorageService, $state,
		Sesion, $sce, $modalInstance, productos) {

	    var that = this;

	    $scope.root = {
		productos: productos
	    };

	    $scope.cerrarVentanaLogOC = function() {
		$modalInstance.close();
	    };

	    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		$scope.$$watchers = null;
	    });

	    if ($scope.root.productos.length > 0) {
		var i = 0;
		var ie = 0;
		var mensaje="";
		for (var ky in $scope.root.productos) {
		    for (var k in $scope.root.productos[ie].actual) {
			mensaje += k + " : " + $scope.root.productos[ie].actual[k]+"\n";
			i++;
		    }
		    $scope.root.productos[ie].detalleActual = mensaje;
		     mensaje="";
		    i=0;
		    ie++;
		}
		var j = 0;
		var ie = 0;
		var mensajes="";
		for (var ky in $scope.root.productos) {
		    for (var k in $scope.root.productos[ie].anterior) {
			mensajes += k + " : " + $scope.root.productos[ie].anterior[k]+"\n";
			j++;
		    }
		    $scope.root.productos[ie].detalleAnterior=mensajes;
		    mensajes="";
		    j=0;
		    ie++;
		}
	    } else {
		$scope.listaLogOC = {
		    enableColumnResize: true,
		    enableRowSelection: false,
		    enableCellSelection: true,
		    enableHighlighting: true,
		    columnDefs: [{field: 'NO HAY DATOS', displayName: 'NO HAY DATOS', width: "100%"}]
		};
		return;
	    }

	    $scope.listaLogOC = {
		data: 'root.productos',
		enableColumnResize: true,
		enableRowSelection: false,
		enableCellSelection: true,
		enableHighlighting: true,
		columnDefs: [
		    {field: 'orden_compra_id', displayName: 'OC', width: "5%"},
		    {field: 'accion', displayName: 'ACCION', width: "5%"},
		    {field: 'fecha', displayName: 'FECHA', width: "10%"},
		    {field: 'detalle', displayName: 'FUNCION', width: "10%", cellFilter: "currency:'$ '", enableCellEdit: true,
			cellTemplate: '<div class="ngCellText">\
                                            <span class="label label-primary" >{{row.entity.detalle.descripcion}}</span>\
                                        </div>'},
		    {field: 'producto', displayName: 'COD. PRODUCTO', width: "10%"},
		    {field: 'detalleAnterior', displayName: 'ANTERIOR', width: "35%"},
		    {field: 'detalleActual', displayName: 'ACTUAL', width: "35%"}
		]
	    };

	}]);
});