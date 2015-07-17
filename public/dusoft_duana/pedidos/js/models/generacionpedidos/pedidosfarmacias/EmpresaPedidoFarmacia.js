
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaPedidoFarmacia', ["Empresa", function(Empresa) {

        var EmpresaPedidoFarmacia =  Object.create(Empresa.getClass().prototype);
        
        EmpresaPedidoFarmacia.farmacias = [];
        EmpresaPedidoFarmacia.farmaciaSeleccionada;

        //Agregar farmacia
        EmpresaPedidoFarmacia.agregarFarmacias = function(farmacia){
            this.farmacias.push(farmacia);
        };
        
        EmpresaPedidoFarmacia.getFarmacias = function(){
            return this.farmacias;
        };
        
        EmpresaPedidoFarmacia.vaciarFarmacias = function() {
            this.farmacias = [];
        };

        EmpresaPedidoFarmacia.setFarmaciaSeleccionada = function(farmaciaSeleccionada) {
            this.farmaciaSeleccionada = farmaciaSeleccionada;
        };
        
        EmpresaPedidoFarmacia.getFarmaciaSeleccionada = function() {
            return this.farmaciaSeleccionada;
        };
        

        return EmpresaPedidoFarmacia;

    }]);
});