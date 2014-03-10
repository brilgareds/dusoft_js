
define(["angular","js/controllers", 'models/Usuario', 'models/Cliente', 'models/Pedido'], function(angular, controllers){
 
    var fo = controllers.controller('pedidoscontroller', ['$scope','$http','$modal', 'Usuario', 'Cliente', 'Pedido',
	  function ($scope, $http, $modal, Usuario, Cliente, Pedido) {
	  		
	  		console.log(Pedido)
	  		$scope.myData = [];
	  		$scope.termino_busqueda = "";



	  		$scope.obtenerPedidos= function(url,termino,callback){
	  			$http({method: 'GET', url: url,params:{empresa_id:'03', termino_busqueda:termino}}).
				    success(function(data, status, headers, config) {
				      callback(data.obj);
				    }).
				    error(function(data, status, headers, config) {
				      // called asynchronously if an error occurs
				      // or server returns response with an error status.
				    });
	  		};


	  		$scope.buscarPedidosCliente = function(termino){
	  			$scope.obtenerPedidos("/api/PedidosClientes/listarPedidos",termino, function(data){
	  				$scope.renderPedidosClinte(data);
		  		});
	  		};

	  		$scope.renderPedidosClinte = function(data){
	  			$scope.myData = [];
	  			for(var i in data.pedidos_clientes){
  					var obj = data.pedidos_clientes[i];
  					var pedido = Pedido.get();
  					pedido.setDatos(obj)
	            	$scope.myData.push(
	            		pedido
	            	)
	            }
	  		};

	  		$scope.onKeyPress = function(ev, termino_busqueda){
	  			if (ev.which==13){
	  				$scope.buscarPedidosCliente(termino_busqueda);
	  			}
	  		};


	  		$scope.obtenerPedidos("/api/PedidosClientes/listarPedidos","", function(data){
  				$scope.renderPedidosClinte(data);
	  		});

            

            $scope.gridOptions = { 
            	data: 'myData',
            	multiSelect: false,
            	columnDefs: [
            		 { field: 'numero_pedido', displayName: 'Numero Pedido' },
            		 { field: 'nombre_cliente', displayName: 'Cliente' },
                     { field: 'direccion_cliente', displayName: 'Ubicacion' },
                     { field: 'telefono_cliente', displayName: 'Telefono' },
                     { field: 'nombre_vendedor', displayName: 'Vendedor' },
                     { field: 'fecha_registro', displayName: "Fecha Registro"},
                     { field: 'fecha_registro', displayName: "Fecha Registro", cellTemplate: '<div><input type="checkbox" ng-click="onRowClick(row)"/></div>'  } ]

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
						    

						    console.log($scope.fechainicial)
						};

						$scope.abrirFechaFinal = function($event) {
						    $event.preventDefault();
						    $event.stopPropagation();

						    $scope.abrirfechafinal = true;
						    $scope.abrirfechainicial = false;
						};

						$scope.fechainicialselected = function(){
							$scope.fechafinal = $scope.fechainicial;
							console.log($scope.fechafinal)
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
		            console.log("Modal Closed");
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