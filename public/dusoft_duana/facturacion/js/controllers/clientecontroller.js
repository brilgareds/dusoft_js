
define(["angular","js/controllers"], function(angular, controllers){
 
    controllers.controller('clientecontroller', ['$scope','Cliente', 'Agencia',
	  function ($scope, Cliente,Agencia) {
	  		$scope.agencia = Agencia;
	  		console.log($scope.agencia.clientes);
	 }]);
});