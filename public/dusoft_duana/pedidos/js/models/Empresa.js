
define(["angular", "js/models"], function(angular, models) {

    models.factory('Empresa', function() {
        this.clientes = [];
        this.proveedores = [];
        this.pedidos = [];
        this.pedidosFarmacias = [];
        this.separadores = [];
        this.documentosTemporales = [];


        this.setClientes = function() {

        }

        this.agregarPedido = function(pedido) {
            this.pedidos.push(pedido);
        }

        this.getPedidos = function() {
            return this.pedidos;
        }

        this.vaciarPedidos = function() {
            this.pedidos = [];
        }
        
        // Pedidos Farmacias
        this.agregarPedidoFarmacia = function(pedido) {
            this.pedidosFarmacias.push(pedido);
        };

        this.getPedidosFarmacia = function() {
            return this.pedidosFarmacias;
        };

        this.vaciarPedidosFarmacia = function() {
            this.pedidosFarmacias = [];
        };

        
        this.agregarSeparador = function(separador) {
            this.separadores.push(separador);
        }

        this.getSeparadores = function() {
            return this.separadores;
        }

        this.vaciarSeparadores = function() {
            this.separadores = [];
        }

        this.obtenerSeparadorPorId = function(id) {
            for (var i in this.separadores) {
                var separador = this.separadores[i];

                if (separador.operario_id == id) {
                    return separador;
                }
            }
        }

        //Documentos Temporales
        this.agregarDocumentoTemporal = function(documento_temporal) {
            this.documentosTemporales.push(documento_temporal);
        }

        this.getDocumentoTemporal = function() {
            return this.documentosTemporales;
        }

        this.vaciarDocumentoTemporal = function() {
            this.documentosTemporales = [];
        }    
        
        return this;

    });
});