define(["angular"], function(angular) {
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
                 "IMPRIMIR_REPORTE_FACTURA_DIAN": BASE_URL + "/FacturacionClientes/generarReporteFacturaGeneradaDian",
                 "SINCRONIZAR_FI": BASE_URL + "/FacturacionClientes/sincronizarFactura",
                 "PROCESAR_DESPACHOS": BASE_URL + "/FacturacionClientes/procesarDespachos",
                 "FACTURAS_EN_PROCESO": BASE_URL + "/FacturacionClientes/procesosFacturacion",
                 "DOCUMENTOS_POR_FACTURAR": BASE_URL + "/FacturacionClientes/listarDocumentosPorFacturar",
                 "OBTENER_DETALLE_POR_FACTURAR" : BASE_URL + "/FacturacionClientes/obtenerDetallePorFacturar",
                 "GENERAR_TMP_FACTURA_CONSUMO" : BASE_URL + "/FacturacionClientes/generarTemporalFacturaConsumo",
                 "CONSULTAR_DETALLE_TMP_FACTURA_CONSUMO" : BASE_URL + "/FacturacionClientes/consultarDetalleTemporalFacturaConsumo",
                 "ELIMINAR_PRODUCTO_TEMPORAL_FACTURA_CONSUMO" : BASE_URL + "/FacturacionClientes/eliminarProductoTemporalFacturaConsumo",
                 "ELIMINAR_TOTAL_TEMPORAL_FACTURA_CONSUMO" : BASE_URL + "/FacturacionClientes/eliminarTotalTemporalFacturaConsumo",
                 "ELIMINAR_CABECERA_TEMPORAL_FACTURA_CONSUMO" : BASE_URL + "/FacturacionClientes/eliminarCabeceraTemporalFacturaConsumo",
                 "GENERAR_FACTURA_POR_CONSUMO" : BASE_URL + "/FacturacionClientes/generarFacturaXConsumo",
                 "LISTAR_FACTURAS_TEMPORALES" : BASE_URL + "/FacturacionClientes/listarFacturasTemporales",
                 "BUSCAR_FARMACIAS" : BASE_URL + "/FacturacionClientes/buscarFarmacias",
                 "LISTAR_FACTURAS_BARRANQUILLA_TEMPORALES" : BASE_URL + "/FacturacionClientes/listarFacturasConsumoBarranquillaTemporales",
                 "ELIMINAR_TEMPORAL_FACTURA_CONSUMO_BARRANQUILLA" : BASE_URL + "/FacturacionClientes/eliminarTemporalFacturaConsumoBarranquilla",
                 "LISTAR_PRODUCTOS" : BASE_URL + "/FacturacionClientes/listarProductos",
                 "IMPRIMIRCSV" : BASE_URL + "/FacturacionClientes/imprimirCsv",
                 "SUBIR_ARCHIVO" : BASE_URL + "/FacturacionClientes/subirArchivo",
                 "GENERAR_SINCRONIZACION_DIAN" : BASE_URL + "/FacturacionClientes/generarSincronizacionDian"
            },   
            'FACTURACIONPROVEEDOR': {
                "LISTAR_ORDENES_COMPRA_PROVEEDORES": BASE_URL + "/FacturacionProveedores/listarOrdenesCompraProveedor",
                "DETALLE_RECEPCION_PARCIAL": BASE_URL + "/FacturacionProveedores/detalleRecepcionParcial",
                "INSERTAR_FACTURA": BASE_URL + "/FacturacionProveedores/ingresarFactura",
                "LISTAR_FACTURA_PROVEEDOR": BASE_URL + "/FacturacionProveedores/listarFacturaProveedor",
                "REPORTE_FACTURA_PROVEEDOR": BASE_URL + "/FacturacionProveedores/reporteFacturaProveedor",
                "SINCRONIZAR_FI": BASE_URL + "/FacturacionProveedores/sincronizarFi",

            },
            'CAJA_GENERAL': {
                "LISTAR_CAJA_GENERAL": BASE_URL + "/CajaGeneral/listarCajaGeneral",
                "LISTAR_GRUPOS": BASE_URL + "/CajaGeneral/listarGrupos",
                "INSERTAR_TMP_DETALLE_CONCEPTOS": BASE_URL + "/CajaGeneral/insertarTmpDetalleConceptos",
                "LISTAR_CONCEPTOS_DETALLE": BASE_URL + "/CajaGeneral/listarConceptosDetalle",
                "ELIMINAR_TMP_DETALLE_CONCEPTOS": BASE_URL + "/CajaGeneral/eliminarTmpDetalleConceptos",
                "GUARDAR_FACTURA_CAJA_GENERAL": BASE_URL + "/CajaGeneral/guardarFacturaCajaGenral",
                "LISTAR_FACTURAS_GENERADAS_NOTAS": BASE_URL + "/CajaGeneral/listarFacturasGeneradasNotas",
                "IMPRIMIR_FACTURA_NOTAS": BASE_URL + "/CajaGeneral/imprimirFacturaNotas",
                "IMPRIMIR_FACTURA_NOTAS_DETALLE": BASE_URL + "/CajaGeneral/imprimirFacturaNotasDetalle",
                "IMPRIMIR_NOTA": BASE_URL + "/CajaGeneral/imprimirNota",
                "SINCRONIZAR_FACTURA_NOTAS": BASE_URL + "/CajaGeneral/sincronizarFacturaNotas",
                "LISTAR_PREFIJOS": BASE_URL + "/CajaGeneral/listarPrefijos",
                "INSERTAR_FAC_FACTURAS_CONCEPTOS_NOTAS": BASE_URL + "/CajaGeneral/insertarFacFacturasConceptosNotas",
                "LISTAR_FAC_FACTURAS_CONCEPTOS_NOTAS": BASE_URL + "/CajaGeneral/listarFacConceptosNotas",
                "LISTAR_IMPUESTOS_TERCERO": BASE_URL + "/CajaGeneral/consultarImpuestosTercero",
                "LISTAR_NOTAS": BASE_URL + "/CajaGeneral/listarNotas"
            },
            'NOTAS': {
                "CONSULTAR_NOTAS": BASE_URL + "/Notas/ConsultarNotas",
                "LISTAR_FACTURAS": BASE_URL + "/Notas/listarFacturas",
                "LISTAR_PORCENTAJES": BASE_URL + "/Notas/listarPorcentajes",
                "LISTAR_PORCENTAJES_ANIO": BASE_URL + "/Notas/listarPorcentajesAnio",
                "DETALLE_FACTURA": BASE_URL + "/Notas/ConsultarDetalleFactura",
                "CREAR_NOTA": BASE_URL + "/Notas/crearNota",
                "CREAR_NOTA_CREDITO": BASE_URL + "/Notas/crearNotaCredito",
                "LISTAR_CONCEPTOS": BASE_URL + "/Notas/listarConceptos",
                "IMPRIMIR_NOTA": BASE_URL + "/Notas/imprimirNota",
                "IMPRIMIR_NOTA_CREDITO": BASE_URL + "/Notas/imprimirNotaCredito",
                "SINCRONIZAR_NOTAS": BASE_URL + "/Notas/sincronizarNotas",
                "GENERAR_SINCRONIZACION_DIAN_DEBITO" : BASE_URL + "/Notas/generarSincronizacionDianDebito",
                "GENERAR_SINCRONIZACION_DIAN_CREDITO" : BASE_URL + "/Notas/generarSincronizacionDianCredito"
            },
            'TERCEROS': {
                'LISTAR_TERCEROS': BASE_URL + "/Terceros/GestionTerceros/listarTerceros",
            },
	    'I002':{
	        "CREAR_HTML_AUTORIZACION": BASE_URL + '/movBodegas/I002/crearHtmlAutorizacion'
	    }
	    
        }

    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
