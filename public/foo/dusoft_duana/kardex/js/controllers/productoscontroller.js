
define(["angular","js/controllers"], function(angular, controllers){
 
    var fo = controllers.controller('productoscontroller', ['$scope','Empresa','Producto','$modal', 'AgenciaFacturacion',
	  function ($scope, Empresa, Producto, $modal, AgenciaFacturacion) {
	  		
	  		$scope.agencia = Empresa;

	  		//console.log(AgenciaFacturacion)

	  		$scope.myData = [];

            for(var i= 0; i< 1000; i++){
            	$scope.myData.push(
            		Producto.get("codigo"+i,"nombre"+i,"existencia"+i,"precio"+200 )
            	)
            }

          //  codigo:"codigo"+i, nombre:"nombre"+i, existencia:"existencia"+i, precio:"precio"+200, movimiento:"Ver"

            $scope.gridOptions = { 
            	data: 'myData',
            	multiSelect: false,
            	columnDefs: [
            		 { field: 'codigo', displayName: 'Codigo' },
                     { field: 'nombre', displayName: 'Nombre' },
                     { field: 'existencia', displayName: 'Existencia' },
                     { field: 'precio', displayName: 'Precio' },
                     { field: 'movimiento', displayName: "Movimiento", cellTemplate: '<div><a href="#" ng-click="onRowClick(row)">Ver</a></div>'  } ]

             };


             $scope.onRowClick = function(row){
             	$scope.open(row);
             }
             

             $scope.open = function (row) {

		        $scope.opts = {
			        backdrop: true,
			        backdropClick: true,
			        dialogFade: false,
			        keyboard: true,
			        templateUrl : 'views/modal-producto.html',
			        controller : function($scope, $modalInstance, row){
			        	$scope.row = row;
			        	$scope.fechainicial = new Date();
					    $scope.ok = function () {

					    };
					    $scope.cancel = function () {
					    	$modalInstance.dismiss('cancel');
					    };


					    $scope.abrirFechaInicial = function($event) {
						    $event.preventDefault();
						    $event.stopPropagation();

						    $scope.abrirfechainicial = true;
						    $scope.abrirfechafinal = false;
						    

						    //console.log($scope.fechainicial)
						};

						$scope.abrirFechaFinal = function($event) {
						    $event.preventDefault();
						    $event.stopPropagation();

						    $scope.abrirfechafinal = true;
						    $scope.abrirfechainicial = false;
						};

						$scope.fechainicialselected = function(){
							$scope.fechafinal = $scope.fechainicial;
							//console.log($scope.fechafinal)
						};

						$scope.fechafinalselected = function(){
							$scope.fechainicial = $scope.fechafinal;
						};

						
			        },
			        resolve: {
			        	row: function() {
			        		return row.entity
			        	}
			        } // empty storage
		        };


		        /*$scope.opts.resolve.row = function() {
		            return angular.copy(
                        {nombre: $scope.nombre}
                    ); // pass name to resolve storage
		        }*/

		        var modalInstance = $modal.open($scope.opts);

		        modalInstance.result.then(function(){
		            //on ok button press 
		        },function(){
		            //on cancel button press
		           // console.log("Modal Closed");
		        });
			}


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