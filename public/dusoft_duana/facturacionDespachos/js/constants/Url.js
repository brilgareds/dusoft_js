define(["angular"], function (angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
           
            'FACTURACIONCLIENTES':{
                
                 "LISTAR_TIPOS_TERCEROS": BASE_URL + "/FacturacionClientes/listarTiposTerceros", 
                 "LISTAR_PREFIJOS_FACTURAS": BASE_URL + "/FacturacionClientes/listarPrefijosFacturas", 
                 "LISTAR_CLIENTES": BASE_URL + "/FacturacionClientes/listarClientes", 
                 "LISTAR_FACTURAS_GENERADAS": BASE_URL + "/FacturacionClientes/listarFacturasGeneradas", 
                 "LISTAR_PEDIDOS_CLIENTES": BASE_URL + "/FacturacionClientes/listarPedidosClientes", 
                 "GENERAR_FACTURA_AGRUPADA": BASE_URL + "/FacturacionClientes/generarFacturasAgrupadas"
                 
            },
            'FACTURACIONPROVEEDOR':{
                 "LISTAR_ORDENES_COMPRA_PROVEEDORES": BASE_URL + "/FacturacionProveedores/listarOrdenesCompraProveedor", 
            },
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
