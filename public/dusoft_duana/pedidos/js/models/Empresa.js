
define(["angular", "js/models", "../../../includes/classes/EmpresaBase"], function(angular, models) {

    models.factory('Empresa', function(EmpresaBase) {

        var Empresa =  Object.create(EmpresaBase.getClass().prototype);
        Empresa.pedidos = [];
        Empresa.pedidosFarmacias = [];
        Empresa.separadores = [];
        Empresa.documentosTemporales = [];

        Empresa.agregarPedido = function(pedido) {
            this.pedidos.push(pedido);
        }

        Empresa.getPedidos = function() {
            return this.pedidos;
        }

        Empresa.vaciarPedidos = function() {
            this.pedidos = [];
        }
        
        // Pedidos Farmacias
        Empresa.agregarPedidoFarmacia = function(pedido) {
            this.pedidosFarmacias.push(pedido);
        };

        Empresa.getPedidosFarmacia = function() {
            return this.pedidosFarmacias;
        };

        Empresa.vaciarPedidosFarmacia = function() {
            this.pedidosFarmacias = [];
        };

        
        Empresa.agregarSeparador = function(separador) {
            this.separadores.push(separador);
        }

        Empresa.getSeparadores = function() {
            return this.separadores;
        }

        Empresa.vaciarSeparadores = function() {
            this.separadores = [];
        }

        Empresa.obtenerSeparadorPorId = function(id) {
            for (var i in this.separadores) {
                var separador = this.separadores[i];

                if (separador.operario_id == id) {
                    return separador;
                }
            }
        }

        //Documentos Temporales
        Empresa.agregarDocumentoTemporal = function(documento_temporal) {
            this.documentosTemporales.push(documento_temporal);
        }

        Empresa.getDocumentoTemporal = function() {
            return this.documentosTemporales;
        }

        Empresa.vaciarDocumentoTemporal = function() {
            this.documentosTemporales = [];
        }    
        
        return Empresa;

    });
});