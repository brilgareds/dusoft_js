define(["angular"], function(angular) {
    var Url = angular.module('Url', []);

    var BASE_URL = "/api";

    var BASE_URL_IMG = "/images";

    var data = {
        'API': {
            'BASE_URL': BASE_URL,
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
                'IMPRIMIR_ROTULO_FARMACIAS': BASE_URL + '/movBodegas/E008/imprimirRotuloFarmacias'
            },
            'PEDIDOS': {
                CLIENTES: {
                    'LISTAR_COTIZACIONES': BASE_URL + '/PedidosClientes/listarCotizaciones',
                    'CONSULTAR_COTIZACION': BASE_URL + '/PedidosClientes/consultarCotizacion',
                    'CONSULTAR_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/consultarDetalleCotizacion',
                    'LISTAR_PRODUCTOS_CLIENTES': BASE_URL + '/PedidosClientes/listarProductosClientes',
                    'LISTAR_LABORATORIOS': BASE_URL + '/Laboratorios/listarLaboratorios',
                    'INSERTAR_COTIZACION': BASE_URL + '/PedidosClientes/insertarCotizacion',
                    'INSERTAR_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/insertarDetalleCotizacion',
                    'ELIMINAR_PRODUCTO_COTIZACION': BASE_URL + '/PedidosClientes/eliminarProductoCotizacion',
                    'SUBIR_ARCHIVO_PLANO': BASE_URL + '/PedidosClientes/subirPlano',
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
                    'ELIMINAR_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/eliminarPedidoTemporal'
                },
                // URLS PEDIDOS FARMACIAS.
                'LISTAR_PEDIDOS': BASE_URL + '/PedidosClientes/listarPedidos',
                'LISTAR_PEDIDOS_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarPedidos',
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
                'LISTAR_PRODUCTOS_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarProductos',//depreciado
                'CREAR_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/crearPedidoTemporal', //depreciado
                'CREAR_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/ingresarDetallePedidoTemporal',//depreciado
                'EXISTE_REGISTRO_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/existeRegistroEncabezadoTemporal',//depreciado
                'EXISTE_REGISTRO_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/existeRegistroDetalleTemporal',
                'EXISTE_REGISTRO_DETALLE_PEDIDO': BASE_URL + '/PedidosFarmacias/existeRegistroDetallePedido',//depreciado
                'CONSULTAR_ENCABEZADO_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/consultarPedidoFarmaciaTemporal',//depreciado
                'LISTAR_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/listarProductosDetalleTemporal',//depreciado
                'ELIMINAR_REGISTRO_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/eliminarRegistroEncabezadoTemporal',
                'ELIMINAR_REGISTRO_DETALLE_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/eliminarRegistroDetalleTemporal',//depreciado
                'ELIMINAR_PEDIDO_TEMPORAL': BASE_URL + '/PedidosFarmacias/eliminarPedidoTemporal',//depreciado
                'INSERTAR_PEDIDO_FARMACIA_DEFINITIVO': BASE_URL + '/PedidosFarmacias/insertarPedidoFarmacia',//depreciado
                'INSERTAR_DETALLE_PEDIDO_FARMACIA_DEFINITIVO': BASE_URL + '/PedidosFarmacias/insertarDetallePedidoFarmacia',//depreciado
                'INSERTAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/insertarProductoDetallePedidoFarmacia',
                'CONSULTAR_ENCABEZADO_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/consultarEncabezadoPedidoFinal',
                'CONSULTAR_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/consultarDetallePedidoFinal',
                'ACTUALIZAR_CANTIDADES_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/actualizarCantidadesDetallePedidoFinal',
                'ELIMINAR_PRODUCTO_DETALLE_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/eliminarProductoDetallePedidoFinal',
                'LISTADO_TIPO_PRODUCTOS': BASE_URL + '/Productos/listarTipoProductos',
                'ARCHIVO_PLANO_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/pedidoFarmaciaArchivoPlano',
                'IMPRIMIR_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/imprimirPedidoFarmacia',
                'ACTUALIZAR_ESTADO_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/actualizarEstadoActualPedido',
                'LISTADO_PEDIDOS_TEMPORALES_FARMACIAS': BASE_URL + '/PedidosFarmacias/listarPedidosTemporalesFarmacias',
                'ACTUALIZAR_ENCABEZADO_TEMPORAL_PEDIDO_FARMACIA': BASE_URL + '/PedidosFarmacias/actualizarRegistroEncabezadoTemporal',
                //'LISTAR_PRODUCTOS_CLIENTES': BASE_URL + '/PedidosClientes/listarProductosClientes', // ------- url clientes => Pdte remover ---
                'BUSCAR_USUARIO_BLOQUEO': BASE_URL + '/PedidosFarmacias/buscarUsuarioBloqueo', //depreciado
                //'CREAR_COTIZACION': BASE_URL + '/PedidosClientes/insertarCotizacion',
                //'INSERTAR_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/insertarDetalleCotizacion',
                //'LISTAR_COTIZACIONES': BASE_URL + '/PedidosClientes/listarCotizaciones',
                'CONSULTA_ESTADO_COTIZACION': BASE_URL + '/PedidosClientes/estadoCotizacion',
                //'LISTAR_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/listarDetalleCotizacion',
                //'ELIMINAR_REGISTRO_DETALLE_COTIZACION': BASE_URL + '/PedidosClientes/eliminarRegistroDetalleCotizacion',
                'CAMBIAR_ESTADO_COTIZACION': BASE_URL + '/PedidosClientes/cambiarEstadoCotizacion',
                'CAMBIAR_ESTADO_APROBACION_COTIZACION': BASE_URL + '/PedidosClientes/cambiarEstadoAprobacionCotizacion',
                //'ARCHIVO_PLANO_PEDIDO_CLIENTE': BASE_URL + '/PedidosClientes/pedidoClienteArchivoPlano',
                'IMPRIMIR_COTIZACION_CLIENTE': BASE_URL + '/PedidosClientes/imprimirCotizacionCliente',
                'LISTADO_PEDIDOS_CLIENTES': BASE_URL + '/PedidosClientes/listadoPedidosClientes',
                'INSERTAR_PEDIDO_CLIENTE': BASE_URL + '/PedidosClientes/insertarPedidoCliente',
                'LISTAR_DETALLE_PEDIDO': BASE_URL + '/PedidosClientes/listarDetallePedido',
                'CONSULTA_ESTADO_PEDIDO': BASE_URL + '/PedidosClientes/estadoPedido',
                'INSERTAR_DETALLE_PEDIDO_CLIENTE': BASE_URL + '/PedidosClientes/insertarDetallePedido',
                'ELIMINAR_REGISTRO_DETALLE_PEDIDO': BASE_URL + '/PedidosClientes/eliminarRegistroDetallePedido',
                'IMPRIMIR_PEDIDO_CLIENTE': BASE_URL + '/PedidosClientes/imprimirPedidoCliente',
                'MODIFICAR_CANTIDADES_COTIZACION': BASE_URL + '/PedidosClientes/modificarCantidadesCotizacion',
                'MODIFICAR_CANTIDADES_PEDIDO': BASE_URL + '/PedidosClientes/modificarCantidadesPedido',
                'CONSULTAR_PRODUCTO_EN_FARMACIA': BASE_URL + '/PedidosFarmacias/consultarProductoEnFarmacia',
                'ACTUALIZAR_ENCABEZADO_PEDIDO_DEFINITIVO': BASE_URL + '/PedidosFarmacias/actualizarEncabezadoPedidoDefinitivo',
                'CAMBIAR_ESTADO_APROBACION_PEDIDO': BASE_URL + '/PedidosClientes/cambiarEstadoAprobacionPedido',
                //'CONSULTAR_ENCABEZADO_COTIZACION_CLIENTE': BASE_URL + '/PedidosClientes/consultarEncabezadoCotizacion',
                'CONSULTAR_ENCABEZADO_PEDIDO_CLIENTE': BASE_URL + '/PedidosClientes/consultarEncabezadoPedido'
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
                'IMPRIMIR_DOCUMENTO_DESPACHO': BASE_URL + "/movBodegas/E008/imprimirDocumentoDespacho"
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
