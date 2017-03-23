define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";

    var BASE_URL_IMG = "/images";

    var data = {
        'API': {
            'BASE_URL': BASE_URL,
            'DESPACHOS_AUDITADOS': {
                "LISTAR_EMPRESAS": BASE_URL + "/ValidacionDespachos/listarempresas",
                'LISTAR_DESPACHOS_AUDITADOS': BASE_URL + '/movBodegas/E008/listarDespachosAuditados',
                'DETALLE_DOCUMENTO_AUDITADO': BASE_URL + '/movBodegas/E008/detalleDocumentoAuditado',
                'DETALLE_PEDIDO_CLIENTE_DOCUMENTO' : BASE_URL + '/movBodegas/E008/detallePedidoClienteDocumento',
                'DETALLE_PEDIDO_FARMACIA_DOCUMENTO' : BASE_URL + '/movBodegas/E008/detallePedidoFarmaciaDocumento'                
            },
            'DOCUMENTOS_TEMPORALES': {
                'LISTAR_DOCUMENTOS_TEMPORALES_CLIENTES': BASE_URL + '/movBodegas/E008/consultarDocumentosTemporalesClientes',
                'LISTAR_DOCUMENTOS_TEMPORALES_FARMACIAS': BASE_URL + '/movBodegas/E008/consultarDocumentosTemporalesFarmacias',
                'CONSULTAR_DOCUMENTO_TEMPORAL_CLIENTES': BASE_URL + '/movBodegas/E008/consultarDocumentoTemporalClientes',
                'CONSULTAR_DOCUMENTO_TEMPORAL_FARMACIAS': BASE_URL + '/movBodegas/E008/consultarDocumentoTemporalFarmacias',
                'CONSULTAR_DOCUMENTO_TEMPORAL': BASE_URL + '/movBodegas/E008/auditoriaProductosDocumentoTemporal',
                'CONSULTAR_DOCUMENTOS_USUARIOS': BASE_URL + '/movBodegas/consultarDocumentosUsuario',
                'ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_CLIENTES': BASE_URL + "/movBodegas/E008/actualizarTipoDocumentoTemporalClientes",
                'ACTUALIZAR_TIPO_DOCUMENTO_TEMPORAL_FARMACIAS': BASE_URL + "/movBodegas/E008/actualizarTipoDocumentoTemporalFarmacias",
                'AUDITAR_DOCUMENTO_TEMPORAL': BASE_URL + "/movBodegas/E008/auditarProductoDocumentoTemporal",
                'CONSULTAR_PRODUCTOS_AUDITADOS': BASE_URL + "/movBodegas/E008/consultarProductosAuditados",
                'VALIDAR_CAJA': BASE_URL + "/movBodegas/E008/validarCajaProducto",
                'GENERAR_ROTULO': BASE_URL + '/movBodegas/E008/generarRotuloCaja',
                'CONSULTAR_PRODUCTOS_AUDITADOS_CLIENTE': BASE_URL + '/movBodegas/E008/auditoriaProductosClientes',
                'CONSULTAR_PRODUCTOS_AUDITADOS_FARMACIA': BASE_URL + '/movBodegas/E008/auditoriaProductosFarmacias',
                'GENERAR_DESPACHO': BASE_URL + '/movBodegas/E008/generarDocumentoDespachoClientes',
                'GENERAR_DESPACHO_FARMACIA': BASE_URL + '/movBodegas/E008/generarDocumentoDespachoFarmacias',
                'MODIFICAR_DETALLE_TEMPORAL': BASE_URL + '/movBodegas/E008/modificarDetalleDocumentoTemporal',
                'AGREGAR_DETALLE_TEMPORAL': BASE_URL + '/movBodegas/E008/detalleDocumentoTemporal',
                'ELIMINAR_ITEM_TEMPORAL': BASE_URL + '/movBodegas/E008/eliminarProductoDocumentoTemporal',
                'CONSULTAR_ITEMS_POR_PRODUCTO': BASE_URL + '/movBodegas/E008/buscarItemsTemporal',
                'ACTUALIZAR_CAJA_TEMPORALES': BASE_URL + '/movBodegas/E008/actualizarCajaDeTemporales',
                'IMPRIMIR_ROTULO_CLIENTES': BASE_URL + '/movBodegas/E008/imprimirRotuloClientes',
                'IMPRIMIR_ROTULO_FARMACIAS': BASE_URL + '/movBodegas/E008/imprimirRotuloFarmacias',
                'NUMERO_MAYOR_ROTULO' : BASE_URL + '/movBodegas/E008/consultarNumeroMayorRotulo'
            },
            'PEDIDOS': {
                CLIENTES: {
                    'LISTAR_COTIZACIONES': BASE_URL + '/PedidosClientes/listarCotizaciones',
                    'CONSULTAR_COTIZACION': BASE_URL + '/PedidosClientes/consultarCotizacion',
                    'CONSULTAR_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/consultarDetalleCotizacion',
                    'LISTAR_PRODUCTOS_CLIENTES': BASE_URL + '/PedidosClientes/listarProductosClientes',
                    'LISTAR_LABORATORIOS': BASE_URL + '/Laboratorios/listarLaboratorios',
                    'LISTAR_MOLECULA': BASE_URL + '/Laboratorios/listarMoleculas',
                    'INSERTAR_COTIZACION': BASE_URL + '/PedidosClientes/insertarCotizacion',
                    'INSERTAR_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/insertarDetalleCotizacion',
                    'MODIFICAR_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/modificarDetalleCotizacion',
                    'ELIMINAR_PRODUCTO_COTIZACION': BASE_URL + '/PedidosClientes/eliminarProductoCotizacion',
                    'SUBIR_ARCHIVO_PLANO': BASE_URL + '/PedidosClientes/subirPlano',
                    'OBSERVACION_CARTERA_COTIZACION': BASE_URL + '/PedidosClientes/observacionCarteraCotizacion',
                    'REPORTE_COTIZACION': BASE_URL + '/PedidosClientes/reporteCotizacion',
                    'GENERAR_PEDIDO': BASE_URL + '/PedidosClientes/generarPedido',
                    'CONSULTAR_PEDIDO': BASE_URL + '/PedidosClientes/consultarPedido',
                    'CONSULTAR_DETALLE_PEDIDO': BASE_URL + '/PedidosClientes/consultarDetallePedido',
                    'ELIMINAR_PRODUCTO_PEDIDO': BASE_URL + '/PedidosClientes/eliminarProductoPedido',
                    'OBSERVACION_CARTERA_PEDIDO': BASE_URL + '/PedidosClientes/observacionCarteraPedido',
                    'INSERTAR_DETALLE_PEDIDO': BASE_URL + '/PedidosClientes/insertarDetallePedido',                   
                    'MODIFICAR_DETALLE_PEDIDO': BASE_URL + '/PedidosClientes/modificarDetallePedido',
                    'REPORTE_PEDIDO': BASE_URL + '/PedidosClientes/reportePedido',
                    'ACTUALIZAR_ESTADO_COTIZACION': BASE_URL +'/PedidosClientes/modificarEstadoCotizacion',
                    'CONSULTAR_ESTADO_PEDIDO': BASE_URL + '/PedidosClientes/consultarEstadoPedido',
                    'CONSULTAR_ESTADO_COTIZACION': BASE_URL + '/PedidosClientes/consultarEstadoCotizacion',
                    'SOLICITAR_AUTORIZACION': BASE_URL + '/PedidosClientes/solicitarAutorizacion',
                    'ACTUALIZAR_CABECERA_COTIZACION': BASE_URL + '/PedidosClientes/actualizarCabeceraCotizacion',
                    'ELIMINAR_COTIZACION' : BASE_URL + '/PedidosClientes/eliminarCotizacion',
                    'VALIDAR_ESTADO_TOTAL_PEDIDO' : BASE_URL + '/PedidosClientes/validarEstadoTotalValorPedido',
                    'INSERTAR_CANTIDAD_DETALLE_PRODUCTO_PEDIDO' : BASE_URL + '/PedidosClientes/insertarCantidadProductoDetallePedido',
                    
                    'ENVIAR_NOTIFICACION_PEDIDOS_CLIENTES' : BASE_URL + '/PedidosClientes/enviarNotificacionPedidosClientes',
                    'PRODUCTOS_COTIZACION': BASE_URL + '/PedidosClientes/ProductosCotizacion',
                    'VALIDAR_DISPONIBILIDAD': BASE_URL + '/PedidosClientes/validarDisponibilidad',
                    'LISTAR_FORMULA_PEDIDO': BASE_URL +'/PedidosClientes/listarFacturasPedido',
                    'GENERAR_PEDIDO_BODEGA_FARMACIA': BASE_URL +'/PedidosClientes/generarPedidoBodegaFarmacia',
 
                    'ACTUALIZAR_PRODUCTO_COTIZACION_COSMITET': BASE_URL +'/PedidosClientes/actualizarProductoCotizacionBodegaCosmitet',
 
                    
                },
                FARMACIAS :{
                    'LISTAR_PRODUCTOS_FARMACIAS': BASE_URL + '/PedidosFarmacias/buscarProductos',
                    'GUARDAR_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/guardarPedidoTemporal',
                    'BUSCAR_USUARIO_BLOQUEO': BASE_URL + '/PedidosFarmacias/buscarUsuarioBloqueo',
                    'GUARDAR_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/guardarDetallePedidoTemporal',
                    'CREAR_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/ingresarDetallePedidoTemporal',
                    'CONSULTAR_ENCABEZADO_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/consultarPedidoFarmaciaTemporal',
                    'LISTAR_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/listarProductosDetalleTemporal',
                    'GENERAR_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/generarPedidoFarmacia',
                    'INSERTAR_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/insertarDetallePedidoFarmacia',
                    'ELIMINAR_REGISTRO_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/eliminarRegistroDetalleTemporal',
                    'ELIMINAR_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/eliminarPedidoTemporal',
                    'SUBIR_ARCHIVO_PLANO': BASE_URL + '/PedidosFarmacias/subirArchivoPlano',
                    'CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/consultarEncabezadoPedido',
                    'CONSULTAR_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/consultarDetallePedido',
                    'ACTUALIZAR_CANTIDADES_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/actualizarCantidadesDetallePedido',
                    'ELIMINAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/eliminarProductoDetallePedido',
                    'INSERTAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/insertarProductoDetallePedidoFarmacia',
                    'ACTUALIZAR_PEDIDO': BASE_URL + '/PedidosFarmacias/actualizarPedido',
                    'GENERAR_PDF_PEDIDO': BASE_URL + '/PedidosFarmacias/generarPdfPedido',
                    'ENVIAR_EMAIL':BASE_URL + '/PedidosFarmacias/enviarEmailPedido',
                    'ANULAR_PENDIENTE_PRODUCTO': BASE_URL +'/PedidosFarmacias/anularPendienteProducto',
                    'GENERAR_PEDIDO_MODULO_CLIENTE': BASE_URL +'/PedidosFarmacias/generarPedidoModuloCliente'
                },
                // URLS PEDIDOS FARMACIAS.
                'LISTAR_PEDIDOS': BASE_URL + '/PedidosClientes/listarPedidos',
                'LISTAR_PEDIDOS_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarPedidos',//depreciado  se debe confirmar hay redundancia?????
                'ASIGNAR_RESPONSABLE_CLIENTE': BASE_URL + '/PedidosClientes/asignarResponsable',
                'ELIMINAR_RESPONSABLE_CLIENTE': BASE_URL + '/PedidosClientes/eliminarResponsablesPedido',
                'ASIGNAR_RESPONSABLE_FARMACIA': BASE_URL + '/PedidosFarmacias/asignarResponsable',
                'ELIMIAR_RESPONSABLE_FARMACIA': BASE_URL + '/PedidosFarmacias/eliminarResponsablesPedido',
                'LISTAR_EMPRESAS': BASE_URL + '/PedidosFarmacias/obtenerEmpresas',
                'DISPONIBILIDAD': BASE_URL + '/Pedidos/consultarDisponibilidad',
                'LISTAR_EMPRESAS_GRUPO': BASE_URL + '/Empresas/listarEmpresas',
                'CENTROS_UTILIDAD_EMPRESAS_GRUPO': BASE_URL + '/CentrosUtilidad/listarCentrosUtilidadEmpresa',
                'BODEGAS_EMPRESAS_GRUPO': BASE_URL + '/Bodegas/listarBodegasEmpresas',
                'LISTAR_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarFarmacias',
                // URLS PEDIDOS CLIENTES.
                'CENTROS_UTILIDAD_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarCentrosUtilidad',
                'BODEGAS_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarBodegas',
                'LISTAR_PRODUCTOS': BASE_URL + '/Productos/listarProductos', 
                'EXISTE_REGISTRO_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/existeRegistroDetalleTemporal',
                'ELIMINAR_REGISTRO_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/eliminarRegistroEncabezadoTemporal',
                'ACTUALIZAR_ESTADO_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/actualizarEstadoActualPedido',
                'LISTADO_PEDIDOS_TEMPORALES_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarPedidosTemporalesFarmacias',
                'ACTUALIZAR_ENCABEZADO_TEMPORAL_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/actualizarRegistroEncabezadoTemporal',
                'CONSULTA_ESTADO_COTIZACION': BASE_URL + '/PedidosClientes/estadoCotizacion',
                'CAMBIAR_ESTADO_COTIZACION': BASE_URL + '/PedidosClientes/cambiarEstadoCotizacion',
                'CAMBIAR_ESTADO_APROBACION_COTIZACION': BASE_URL + '/PedidosClientes/cambiarEstadoAprobacionCotizacion',
                'IMPRIMIR_COTIZACION_CLIENTE': BASE_URL + '/PedidosClientes/imprimirCotizacionCliente',
                'LISTADO_PEDIDOS_CLIENTES': BASE_URL + '/PedidosClientes/listadoPedidosClientes',
                'INSERTAR_PEDIDO_CLIENTE': BASE_URL + '/PedidosClientes/insertarPedidoCliente',
                'LISTAR_DETALLE_PEDIDO': BASE_URL + '/PedidosClientes/listarDetallePedido',
                'CONSULTA_ESTADO_PEDIDO': BASE_URL + '/PedidosClientes/estadoPedido',
                'ELIMINAR_REGISTRO_DETALLE_PEDIDO': BASE_URL + '/PedidosClientes/eliminarRegistroDetallePedido',
                'IMPRIMIR_PEDIDO_CLIENTE': BASE_URL + '/PedidosClientes/imprimirPedidoCliente',
                'MODIFICAR_CANTIDADES_COTIZACION': BASE_URL + '/PedidosClientes/modificarCantidadesCotizacion',
                'MODIFICAR_CANTIDADES_PEDIDO': BASE_URL + '/PedidosClientes/modificarCantidadesPedido',
                'CONSULTAR_PRODUCTO_EN_FARMACIA': BASE_URL + '/PedidosFarmacias/consultarProductoEnFarmacia',
                'CAMBIAR_ESTADO_APROBACION_PEDIDO': BASE_URL + '/PedidosClientes/cambiarEstadoAprobacionPedido'
            },
            'SEPARACION_PEDIDOS':{
                'CONSULTAR_DISPONIBILIDAD': BASE_URL+"/Pedidos/consultarDisponibilidad",
                'E008_DETALLE' : BASE_URL + "/movBodegas/E008/detalleDocumentoTemporal",
                'JUSTIFICACION_PENDIENTES' : BASE_URL + "/movBodegas/E008/justificacionPendientes",
                'ELIMINAR_ITEM_TEMPORAL' : BASE_URL + "/movBodegas/E008/eliminarProductoDocumentoTemporal",
                'OBTENER_JUSTIFICACIONES' : BASE_URL + "/movBodegas/E008/obtenerJustificaciones",
                'CLIENTES':{
                    'LISTAR_PEDIDOS_OPERARIO_CLIENTE': BASE_URL + "/PedidosClientes/listaPedidosOperarioBodega",
                    'CONSULTAR_TEMPORAL_CLIENTES' : BASE_URL + "/movBodegas/E008/consultarDocumentoTemporalClientes",
                    'E008_DOCUMENTO_TEMPORAL_CLIENTES' : BASE_URL + "/movBodegas/E008/documentoTemporalClientes",
                    'FINALIZAR_DOCUMENTO_CLIENTES' : BASE_URL + "/movBodegas/E008/finalizarDocumentoTemporalClientes",
                    'ELIMINAR_DOCUMENTO_TEMPORAL_CLIENTES' : BASE_URL + "/movBodegas/E008/eliminarDocumentoTemporalClientes"
                    
                },
                'FARMACIAS':{
                    'LISTAR_PEDIDOS_OPERARIO_FARMACIA': BASE_URL + "/PedidosFarmacias/listaPedidosOperarioBodega",
                    'CONSULTAR_TEMPORAL_FARMACIAS' : BASE_URL + "/movBodegas/E008/consultarDocumentoTemporalFarmacias",
                    'E008_DOCUMENTO_TEMPORAL_FARMACIAS' : BASE_URL + "/movBodegas/E008/documentoTemporalFarmacias",
                    'FINALIZAR_DOCUMENTO_FARMACIAS' : BASE_URL + "/movBodegas/E008/finalizarDocumentoTemporalFarmacias",
                    'ELIMINAR_DOCUMENTO_TEMPORAL_FARMACIAS' : BASE_URL + "/movBodegas/E008/eliminarDocumentoTemporalFarmacias"
                }
            },
            'TERCEROS': {
                'LISTAR_OPERARIOS': BASE_URL + "/Terceros/operariosBodega/listar",
                'LISTAR_CLIENTES': BASE_URL + "/Terceros/Clientes/listarClientes",
                'LISTAR_VENDEDORES': BASE_URL + "/Terceros/Vendedores/listarVendedores",
                'CONSULTAR_CONTRATO_CLIENTE': BASE_URL + '/Terceros/Clientes/consultarContratoCliente'
            },
            'USUARIOS': {
                'LISTAR_USUARIOS': BASE_URL + "/Usuarios/listar"
            },
            'PAISES': {
                'BUSCAR_PAIS': BASE_URL + '/Paises/seleccionarPais'
            },
            'DEPARTAMENTOS': {
                'BUSCAR_DEPARTAMENTO': BASE_URL + '/Departamentos/seleccionarDepartamento'
            },
            'CIUDADES': {
                'BUSCAR_CIUDAD': BASE_URL + '/Ciudades/seleccionarCiudad'
            },
            'DOCUMENTOS_DESPACHO': {
                'IMPRIMIR_DOCUMENTO_DESPACHO': BASE_URL + "/movBodegas/E008/imprimirDocumentoDespacho",
                'SINCRONIZAR_DOCUMENTO' : BASE_URL + '/movBodegas/E008/sincronizarDocumentoDespacho'
            }
        },
        'STATIC': {
            'BASE_IMG': BASE_URL_IMG
        }
    };


    angular.forEach(data, function(key, value) {
        Url.constant(value, key);
    });


    return Url;
});
