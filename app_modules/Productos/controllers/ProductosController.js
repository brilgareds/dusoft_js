
var Productos = function(productos) {

    console.log("Modulo Productos  Cargado ");

    this.m_productos = productos;
};


Productos.prototype.listar_productos = function(req, res) {
    
    var that = this;

    var args = req.body.data;

    if (args.productos === undefined || args.productos.termino_busqueda === undefined || args.productos.empresa_id === undefined || args.productos.centro_utilidad_id === undefined || args.productos.bodega_id === undefined || args.productos.termino_busqueda === undefined || args.productos.pagina_actual === undefined) {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id, termino_busqueda o  pagina_actual no estan definidos', 404, {}));
        return;
    }

    if (args.productos.empresa_id === '' || args.productos.centro_utilidad_id === '' || args.productos.bodega_id === '') {
        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacíos', 404, {}));
        return;
    }
    
    if (args.productos.pagina_actual === '') {
        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
        return;
    }

    var empresa_id = args.productos.empresa_id;
    var centro_utilidad_id = args.productos.centro_utilidad_id;
    var bodega_id = args.productos.bodega_id;
    var termino_busqueda = args.productos.termino_busqueda;
    var pagina_actual = args.productos.pagina_actual;

    /* Inicio - Modificación para Tipo Producto */
    var tipo_producto = '0';

    if(args.productos.tipo_producto !== undefined){
        tipo_producto = args.productos.tipo_producto;
    }
    /* Fin - Modificación para Tipo Producto */

    this.m_productos.buscar_productos(empresa_id, centro_utilidad_id, bodega_id, termino_busqueda, pagina_actual, tipo_producto, function(err, lista_productos) {

        if (err) {
            res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_productos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
            return;
        }
    });
};

/**/
//Productos.prototype.listarProductosClientes = function(req, res) {
//    
//    var that = this;
//
//    var args = req.body.data;
//
//    if (args.productos === undefined || args.productos.termino_busqueda === undefined || args.productos.empresa_id === undefined || args.productos.centro_utilidad_id === undefined || args.productos.bodega_id === undefined || args.productos.termino_busqueda === undefined || args.productos.pagina_actual === undefined) {
//        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id, bodega_id, termino_busqueda o  pagina_actual no estan definidos', 404, {}));
//        return;
//    }
//
//    if (args.productos.empresa_id === '' || args.productos.centro_utilidad_id === '' || args.productos.bodega_id === '') {
//        res.send(G.utils.r(req.url, 'empresa_id, centro_utilidad_id o bodega_id estan vacíos', 404, {}));
//        return;
//    }
//    
//    if (args.productos.pagina_actual === '') {
//        res.send(G.utils.r(req.url, 'Se requiere el numero de la Pagina actual', 404, {}));
//        return;
//    }
//
//    var empresa_id = args.productos.empresa_id;
//    var centro_utilidad_id = args.productos.centro_utilidad_id;
//    var bodega_id = args.productos.bodega_id;
//    var contrato_cliente_id = args.productos.contrato_cliente_id;
//    var termino_busqueda = args.productos.termino_busqueda;
//    var pagina_actual = args.productos.pagina_actual;
//    var pedido_cliente_id_tmp = args.productos.pedido_cliente_id_tmp;
//    var filtro = args.productos.filtro;
//
//    /* Inicio - Modificación para Tipo Producto */
//    var tipo_producto = '0';
//
//    if(args.productos.tipo_producto !== undefined){
//        tipo_producto = args.productos.tipo_producto;
//    }
//    /* Fin - Modificación para Tipo Producto */
//
//    this.m_productos.listar_productos_clientes_test(empresa_id, centro_utilidad_id, bodega_id, contrato_cliente_id, termino_busqueda, pedido_cliente_id_tmp, tipo_producto, pagina_actual, filtro, function(err, lista_productos) {
//
//        if (err) {
//            res.send(G.utils.r(req.url, 'Error Listado de Productos', 500, {lista_productos: {}}));
//            return;
//        } else {
//            res.send(G.utils.r(req.url, 'Listado de Productos', 200, {lista_productos: lista_productos}));
//            return;
//        }
//    });
//};

/**/

Productos.prototype.consultarExistenciasProducto = function(req, res) {

    var that = this;


    var empresa_id = '03';
    var centro_utilidad_id = '1';
    var bodega_id = '03';
    var codigo_producto = '168D0501607';

    that.m_productos.consultar_existencias_producto(empresa_id, codigo_producto, function(err, existencias) {
        console.log(existencias);
    });
};

Productos.prototype.listarTipoProductos = function(req, res) {
    
    var that = this;
    
    that.m_productos.listar_tipo_productos( function(err, tipo_productos) {
        
        if (err) {
            res.send(G.utils.r(req.url, 'Error en consulta de tipos de Producto', 500, {lista_tipo_productos: {}}));
            return;
        } else {
            res.send(G.utils.r(req.url, 'Listado de tipos de Productos', 200, {lista_tipo_productos: tipo_productos}));
            return;
        }
    });
    
};



Productos.$inject = ["m_productos"];

module.exports = Productos;