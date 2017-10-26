
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
		for (var ky in $scope.root.productos) {
		    for (var k in $scope.root.productos[ie].actual) {

			$scope.root.productos[i].detalleActual = k + " : " + $scope.root.productos[i].actual[k]+"\n";
			i++;
		    }
		    ie++;
		}
		var j = 0;
		var ie = 0;
		for (var ky in $scope.root.productos) {
		    for (var k in $scope.root.productos[ie].anterior) {

			$scope.root.productos[j].detalleAnterior = k + " : " + $scope.root.productos[j].anterior[k]+"\n";
			j++;
		    }
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
		    {field: 'detalleAnterior', displayName: 'ANTERIOR', width: "35%"},
		    {field: 'detalleActual', displayName: 'ACTUAL', width: "35%"}
		]
	    };

	}]);
});