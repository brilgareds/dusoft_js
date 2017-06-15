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
                 "GENERAR_FACTURA_AGRUPADA": BASE_URL + "/FacturacionClientes/generarFacturasAgrupadas",
                 "GENERAR_FACTURA_INDIVIDUAL": BASE_URL + "/FacturacionClientes/generarFacturaIndividual",
                 "REPORTE_FACTURA_GENERADA_DETALLE": BASE_URL + "/FacturacionClientes/consultaFacturaGeneradaDetalle",
                 "IMPRIMIR_REPORTE_PEDIDO": BASE_URL + "/FacturacionClientes/generarReportePedido",
                 "IMPRIMIR_REPORTE_DESPACHO": BASE_URL + "/FacturacionClientes/generarReporteDespacho",
                 "IMPRIMIR_REPORTE_FACTURA": BASE_URL + "/FacturacionClientes/generarReporteFacturaGenerada",
                 "SINCRONIZAR_FI": BASE_URL + "/FacturacionClientes/sincronizarFactura",
                 "PROCESAR_DESPACHOS": BASE_URL + "/FacturacionClientes/procesarDespachos",
                 "FACTURAS_EN_PROCESO": BASE_URL + "/FacturacionClientes/procesosFacturacion"
                 
            },
            'FACTURACIONPROVEEDOR':{
                 "LISTAR_ORDENES_COMPRA_PROVEEDORES": BASE_URL + "/FacturacionProveedores/listarOrdenesCompraProveedor", 
                 "DETALLE_RECEPCION_PARCIAL": BASE_URL + "/FacturacionProveedores/detalleRecepcionParcial", 
                 "INSERTAR_FACTURA": BASE_URL + "/FacturacionProveedores/ingresarFactura", 
                 "LISTAR_FACTURA_PROVEEDOR": BASE_URL + "/FacturacionProveedores/listarFacturaProveedor", 
                 "REPORTE_FACTURA_PROVEEDOR": BASE_URL + "/FacturacionProveedores/reporteFacturaProveedor", 
                 "SINCRONIZAR_FI": BASE_URL + "/FacturacionProveedores/sincronizarFi", 
            },
        }

    };

    angular.forEach(data, function (key, value) {
        Url.constant(value, key);
    });


    return Url;
});
