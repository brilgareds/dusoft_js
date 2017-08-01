define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";


    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'FACTURACIONCLIENTES': {
                "LISTAR_TIPOS_TERCEROS": BASE_URL + "/FacturacionClientes/listarTiposTerceros",
                "LISTAR_PREFIJOS_FACTURAS": BASE_URL + "/FacturacionClientes/listarPrefijosFacturas",
                "LISTAR_CLIENTES": BASE_URL + "/FacturacionClientes/listarClientes",
                "LISTAR_FACTURAS_GENERADAS": BASE_URL + "/FacturacionClientes/listarFacturasGeneradas",
                "LISTAR_PEDIDOS_CLIENTES": BASE_URL + "/FacturacionClientes/listarPedidosClientes",
                "GENERAR_FACTURA_AGRUPADA": BASE_URL + "/FacturacionClientes/generarFacturasAgrupadas",
                "GENERAR_FACTURA_INDIVIDUAL": BASE_URL + "/FacturacionClientes/generarFacturaIndividual",
                "REPORTE_FACTURA_GENERADA_DETALLE": BASE_URL + "/FacturacionClientes/consultaFacturaGeneradaDetalle",
                "SINCRONIZAR_FI": BASE_URL + "/FacturacionClientes/sincronizarFactura"

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
                "LISTAR_IMPUESTOS_TERCERO": BASE_URL + "/CajaGeneral/consultarImpuestosTercero"
            },
            'TERCEROS': {
                'LISTAR_TERCEROS': BASE_URL + "/Terceros/GestionTerceros/listarTerceros",
            }
        }

    };

    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
