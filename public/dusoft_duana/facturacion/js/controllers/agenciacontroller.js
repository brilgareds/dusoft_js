
define(["angular","js/controllers"], function(angular, controllers){
 
    controllers.controller('agenciacontroller', ['$scope','AgenciaFacturacion','ClienteFacturacion', 'Proveedor',
	  function ($scope, Agencia, Cliente, Proveedor) {
	  		
	  		$scope.agencia = Agencia;

			$scope.onCrearProveedor = function(nombre){

				if(!nombre){
					return
				}

				$scope.proveedorNombre = "";
				$scope.agencia.agregarProveedor(
					Proveedor.get(nombre, 2)
				);
			}

			$scope.onBorrarProveedor= function(proveedor){
				for(var i in $scope.agencia.proveedores){
					var _proveedor = $scope.agencia.proveedores[i];

					if(_proveedor.nombre == proveedor.nombre){
						$scope.agencia.proveedores.splice(i,1);
						break;
					}

				}

			}

	 }]);
});