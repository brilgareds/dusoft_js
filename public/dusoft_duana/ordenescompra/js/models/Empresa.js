
define(["angular", "js/models", "../../../includes/classes/EmpresaBase"], function(angular, models) {

    models.factory('Empresa', ["EmpresaBase", function(EmpresaBase) {

        var Empresa =  Object.create(EmpresaBase.getClass().prototype);
        
        Empresa.pedidos = [];
        Empresa.pedidosFarmacias = [];
        Empresa.separadores = [];
        Empresa.documentosTemporalesClientes = [];
        Empresa.documentosTemporalesFarmacias = [];

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
        Empresa.agregarDocumentoTemporal = function(documento_temporal, tipo) {
            
            if (tipo == 1) {
                this.documentosTemporalesClientes.push(documento_temporal);
            }
            
            if (tipo == 2) {
                this.documentosTemporalesFarmacias.push(documento_temporal);
            }
        }

        Empresa.getDocumentoTemporal = function(tipo) {
            
            if (tipo == 1) {
                return this.documentosTemporalesClientes;
            }
            
            if (tipo == 2) {
                return this.documentosTemporalesFarmacias;
            }
        }

        Empresa.vaciarDocumentoTemporal = function(tipo) {
            
            if (tipo == 1) {
                this.documentosTemporalesClientes = [];
            }
            
            if (tipo == 2) {
                this.documentosTemporalesFarmacias = [];
            }
        }    
        
        return Empresa;

    }]);
});