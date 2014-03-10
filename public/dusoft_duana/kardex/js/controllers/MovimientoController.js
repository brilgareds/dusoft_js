
define(["angular","js/controllers", "models/Movimiento"], function(angular, controllers){
 
    var fo = controllers.controller('MovimientoController', ['$scope', "$rootScope", "$http", "$filter", '$state','Empresa','ProductoMovimiento','$modal',"API",
        "Movimiento", "$sce", "$filter",
	  function ($scope, $rootScope, $http, $filter, $state, Empresa, ProductoMovimiento, $modal, API, Movimiento, $sce) {
	  		
	  		$scope.Empresa = Empresa;
	  		$scope.fechainicial = new Date();
	  		$scope.fechafinal   = "";
            $scope.producto = {};
            $scope.titulo = "KARDEX";
            $scope.cantidad_entradas = 0;
            $scope.cantidad_salidas  = 0;

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



            $scope.validarHtml =function(html){
                var htmlValido = $sce.trustAsHtml(html);
                return htmlValido;
            };

            $scope.formatearFecha = function(fecha){
                return $filter('date')(fecha,'yyyy-MM-dd');
            };


            $scope.lista_movimientos = { 
            	data: 'producto.getMovimientos()',
            	multiSelect: false,
                rowHeight:250,
            	columnDefs: [
            		 { field: 'tipo_movimiento', displayName: 'T M', width:"50" },
                     { field: 'fecha', displayName: 'Fecha', cellTemplate:"<div> {{formatearFecha(row.entity.fecha)}} </div>", width:"10%" },
                     { field: 'numero', displayName: 'Numero', cellTemplate:"<div>{{row.entity.prefijo}} - {{row.entity.numero}} </div>" , width:"10%"},
                     { field: 'factura', displayName: 'Factura', width:"10%" },
                     { field: 'detalle.getDetalle()', height:"200px", displayName: 'Terceros', cellTemplate:"<div class='largeCell' ng-bind-html=\"validarHtml(row.entity.detalle.getDetalle())\"></div>" },
                     { field: 'cantidad_entradas', displayName: 'Entradas',width:"7%" },
                     { field: 'cantidad_salidas', displayName: 'Salidas', width:"7%" },
                     { field: 'costo', displayName: 'Costo', width:"7%" },
                    { field: 'lote', displayName: 'Lote', width:"7%" },
                    { field: 'fecha_vencimiento', displayName: 'Fecha V', cellTemplate:"<div> {{formatearFecha(row.entity.fecha_vencimiento)}} </div>", width:"10%" }
                ]

             };


             $scope.onRowClick = function(row){
             	console.log($filter('date')($scope.fechainicial,"yyyy-MM-dd"));
             	console.log($filter('date')($scope.fechafinal,"yyyy-MM-dd"));


             	$scope.realizarRequest(
                    API.KARDEX.OBTENER_MOVIMIENTO,
                    "GET",
                    {
                    	fecha_inicial:$filter('date')($scope.fechainicial,"yyyy-MM-dd"),
                    	fecha_final:$filter('date')($scope.fechafinal,"yyyy-MM-dd"),
                    	codigo_producto:row.entity.codigo_producto
                    },
                    function(data) {
                    	console.log(data);
                    	$scope.$emit('mostrarkardex');
                        if(data.status == 200){
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


                //eventos personalizados
            $rootScope.$on("mostrarslide",function(e,producto,movimientos){
                $scope.producto = angular.copy(producto);

                for(var i in movimientos){
                    var movimiento = Movimiento.get();
                    movimiento.setDatos(movimientos[i]);
                    $scope.producto.agregarMovimiento(movimiento);

                    if(movimiento.tipo_movimiento == "E"){
                        $scope.cantidad_salidas = $scope.cantidad_salidas + movimiento.cantidad_salidas;
                    } else {
                        $scope.cantidad_entradas = $scope.cantidad_entradas + movimiento.cantidad_entradas;
                    }

                }

                console.log($scope.producto.getMovimientos());

            });

			$scope.buscarProductos("");
			

	 }]);
});