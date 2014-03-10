
define(["angular","js/controllers",'../../../../includes/slide/slidecontent', "controllers/MovimientoController"], function(angular, controllers){
 
    var fo = controllers.controller('productoscontroller', ['$scope', "$http", "$filter", '$state','Empresa','ProductoMovimiento','$modal',"API","AlertService",
	  function ($scope, $http, $filter, $state, Empresa, ProductoMovimiento, $modal, API,AlertService) {
	  		
	  		$scope.Empresa = Empresa;
	  		var fechaActual = new Date();

	  		$scope.fechainicial =  new Date("01/01/"+fechaActual.getFullYear()); ;
	  		$scope.fechafinal   = fechaActual;
	  		$scope.abrirfechafinal = false;

            $scope.realizarRequest = function(url, method, params, callback) {

               // console.log(params)

                var requestObj = {
                    method:method,
                    url:url
                }

                if(method == "GET"){
                    requestObj.params = params;
                } else {
                    requestObj.data = params;
                    requestObj.headers =  {'Content-Type': 'application/json'};
                }


                $http(requestObj).
                    success(function(data, status, headers, config) {
                    callback(data);
                }).
                error(function(data, status, headers, config) {
                    $scope.dialog = true;
                    $scope.msg   = "Se a generado un error";
                    callback(data);
                }); 

            };

            $scope.buscarProductos = function(termino_busqueda){
            	$scope.realizarRequest(
                    API.KARDEX.LISTAR_PRODUCTOS,
                    "GET",
                    {
                    	termino_busqueda:termino_busqueda
                    },
                    function(data) {
                        if(data.status == 200){
                      		 $scope.renderProductos(data.obj);
                      	}                
                    }
                );
            };	

            $scope.renderProductos = function(data){
            	$scope.Empresa.vaciarProductos();

            	for(var i in data.lista_productos){
            		var obj = data.lista_productos[i];
	            	var producto = ProductoMovimiento.get(
	            		obj.codigo_producto,
	            		obj.nombre_producto,
	            		obj.existencia,
	            		obj.precio_venta,
	            		obj.existencia_total,
	            		obj.costo,
	            		obj.costo_ultima_compra,
	            		obj.porc_iva
	            	);

	            	$scope.Empresa.agregarProducto(	
	            		producto
	            	);
	            }

            };


            $scope.gridOptions = { 
            	data: 'Empresa.getProductos()',
            	multiSelect: false,
            	columnDefs: [
            		 { field: 'codigo_producto', displayName: 'Codigo' },
                     { field: 'descripcion', displayName: 'Nombre' },
                     { field: 'existencia', displayName: 'Existencia' },
                     { field: 'existencia_total', displayName: 'Existencia Total' },
                     { field: 'costo', displayName: 'Costo' },
                     { field: 'costo_ultima_compra', displayName: 'Costo Ultima Compra' },
                     { field: 'precio', displayName: 'Precio' },
                     { field: 'porc_iva', displayName: 'Iva' },
                     { field: 'movimiento', displayName: "Movimiento", cellClass:"txt-center", cellTemplate: '<div><button class="btn btn-default btn-xs" ng-click="onRowClick(row)"><span class="glyphicon glyphicon-zoom-in">Ver</span></button></div>'  } ]

             };


             $scope.onRowClick = function(row){
             	console.log($filter('date')($scope.fechainicial,"yyyy-MM-dd"));
             	console.log($filter('date')($scope.fechafinal,"yyyy-MM-dd"));
                if($scope.fechafinal == null || $scope.fechainicial == null){
                    AlertService.mostrarMensaje("danger","Las fechas son invalidas");
                    return;
                }

             	$scope.realizarRequest(
                    API.KARDEX.OBTENER_MOVIMIENTO,
                    "GET",
                    {
                    	fecha_inicial:$filter('date')($scope.fechainicial,"yyyy-MM-dd"),
                    	fecha_final:$filter('date')($scope.fechafinal,"yyyy-MM-dd"),
                    	codigo_producto:row.entity.codigo_producto
                    },
                    function(data) {                    	
                        if(data.status == 200){
                        	$scope.$emit('mostrarslide',row.entity,data.obj.movimientos_producto);
                      	}                
                    }
                );
             	 
             };

             $scope.cerrar = function(){
             	 $scope.$emit('cerrarslide');
             };

            //eventos

              	//eventos de widgets
            $scope.onKeyPress = function(ev, termino_busqueda) {
                if (ev.which == 13) {
                    $scope.buscarProductos(termino_busqueda);
                }
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

			$scope.buscarProductos("");
			

	 }]);
});