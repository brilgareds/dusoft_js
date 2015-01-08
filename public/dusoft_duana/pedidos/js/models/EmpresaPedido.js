
define(["angular", "js/models", "includes/classes/Empresa"], function(angular, models) {

    models.factory('EmpresaPedido', ["Empresa", function(Empresa) {

        var EmpresaPedido =  Object.create(Empresa.getClass().prototype);
        
        EmpresaPedido.pedidos = [];
        EmpresaPedido.pedidosFarmacias = [];
        EmpresaPedido.separadores = [];
        EmpresaPedido.documentosTemporalesClientes = [];
        EmpresaPedido.documentosTemporalesFarmacias = [];
        EmpresaPedido.pedidoSeleccionado = {};
        EmpresaPedido.lista_farmacias = [];
        EmpresaPedido.pedidosTemporales = [];
        EmpresaPedido.pedidosTemporalesFarmacias = [];

        //Agregar farmacia
        EmpresaPedido.agregarFarmacias = function(farmacia){
            this.lista_farmacias.push(farmacia);
        };
        
        EmpresaPedido.getFarmacias = function(){
            return this.lista_farmacias;
        };
        
        EmpresaPedido.vaciarFarmacias = function() {
            this.lista_farmacias = [];
        };
        
        EmpresaPedido.agregarPedido = function(pedido) {
            this.pedidos.push(pedido);
        };

        EmpresaPedido.getPedidos = function() {
            return this.pedidos;
        };

        EmpresaPedido.vaciarPedidos = function() {
            this.pedidos = [];
        };
        
        // Pedidos Farmacias
        EmpresaPedido.agregarPedidoFarmacia = function(pedido) {
            this.pedidosFarmacias.push(pedido);
        };

        EmpresaPedido.getPedidosFarmacia = function() {
            return this.pedidosFarmacias;
        };

        EmpresaPedido.vaciarPedidosFarmacia = function() {
            this.pedidosFarmacias = [];
        };
        
        EmpresaPedido.agregarSeparador = function(separador) {
            this.separadores.push(separador);
        };

        EmpresaPedido.getSeparadores = function() {
            return this.separadores;
        };

        EmpresaPedido.vaciarSeparadores = function() {
            this.separadores = [];
        };

        EmpresaPedido.obtenerSeparadorPorId = function(id) {
            for (var i in this.separadores) {
                var separador = this.separadores[i];

                if (separador.operario_id == id) {
                    return separador;
                }
            }
        };

        //Documentos Temporales
        EmpresaPedido.agregarDocumentoTemporal = function(documento_temporal, tipo) {
            //console.log("agregar documento >>>>>>>>>>>>>",documento_temporal);
            var arreglo = [];
            if (tipo === 1) {
                arreglo = this.documentosTemporalesClientes;
                //this.documentosTemporalesClientes.push(documento_temporal);
            }
            
            if (tipo === 2) {
                arreglo = this.documentosTemporalesFarmacias;
                //this.documentosTemporalesFarmacias.push(documento_temporal);
            }
            
            for(var i in arreglo){
                var doc = arreglo[i];
                 
                if(doc.documento_temporal_id === documento_temporal.documento_temporal_id){
                    //console.log("agregar documento >>>>>>>>>>>>>",documento_temporal, " buscando ", doc); 
                    doc.esDocumentoNuevo = documento_temporal.esDocumentoNuevo;
                    return;
                }
            }
            
            arreglo.push(documento_temporal);
        };

        EmpresaPedido.getDocumentoTemporal = function(tipo) {
            
            if (tipo === 1) {
                return this.documentosTemporalesClientes;
            }
            
            if (tipo === 2) {
                return this.documentosTemporalesFarmacias;
            }
        };

        EmpresaPedido.vaciarDocumentoTemporal = function(tipo) {
            
            if (tipo === 1) {
                this.documentosTemporalesClientes = [];
            }
            
            if (tipo === 2) {
                this.documentosTemporalesFarmacias = [];
            }
        };
        
        EmpresaPedido.getPedidoSeleccionado = function() {
            return this.pedidoSeleccionado;
        };
        
        EmpresaPedido.setPedidoSeleccionado = function(pedido) {
            this.pedidoSeleccionado = pedido;
        };
        
        //Operaciones para pedidos temporales Clientes
        EmpresaPedido.agregarPedidoTemporal = function(pedido) {
            this.pedidosTemporales.push(pedido);
        };

        EmpresaPedido.getPedidosTemporales = function() {
            return this.pedidosTemporales;
        };

        EmpresaPedido.vaciarPedidosTemporales = function() {
            this.pedidosTemporales = [];
        };
        
        // Pedidos Farmacias
        EmpresaPedido.agregarPedidoTemporalFarmacia = function(pedido) {
            this.pedidosTemporalesFarmacias.push(pedido);
        };

        EmpresaPedido.getPedidosTemporalesFarmacia = function() {
            return this.pedidosTemporalesFarmacias;
        };

        EmpresaPedido.vaciarPedidosTemporalesFarmacia = function() {
            this.pedidosTemporalesFarmacias = [];
        };
        
        EmpresaPedido.eliminarPedidoTemporal = function(index) {
            return this.pedidosTemporales.splice(index,1);
        };
        
        EmpresaPedido.eliminarPedidoTemporalFarmacia = function(index) {
            return this.pedidosTemporalesFarmacias.splice(index,1);
        };
        
        return EmpresaPedido;

    }]);
});