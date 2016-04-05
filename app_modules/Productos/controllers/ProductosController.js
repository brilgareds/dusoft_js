
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


/*
* @Author: Eduar
* @param {Object} req
* @param {Object} res
* +Descripcion: Permite consumir el servicio para consultar las existencias de un producto
*/
Productos.prototype.consultarExistenciasProducto = function(req, res) {

    var that = this;
    var args = req.body.data;

    if (!args.productos || !args.productos.empresa_id || !args.productos.codigo_producto || !args.productos.centro_utilidad_id || 
        !args.productos.bodega_id) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    
    var empresaId = args.productos.empresa_id;
    var codigoProducto = args.productos.codigo_producto;
    var centroUtilidad = args.productos.centro_utilidad_id;
    var bodega = args.productos.bodega_id;

    G.Q.ninvoke(that.m_productos,"consultar_existencias_producto", empresaId, codigoProducto, centroUtilidad, bodega, {}).then(function(existencias){
        console.log("existencias encontradas ", existencias);
        res.send(G.utils.r(req.url, 'Lista Existencias Producto', 200, {existencias: existencias}));
    }).fail(function(err){
       res.send(G.utils.r(req.url, 'Error consultando las existencias', 500, {lista_productos: {}}));
    });
};

/*
* @Author: Eduar
* @param {Object} req
* @param {Object} res
* +Descripcion: Permite consumir el servicio para guardar una existencia(lote) de un producto
*/
Productos.prototype.guardarExistenciaBodega = function(req, res){
    var that = this;
    var args = req.body.data;

    if (!args.productos || !args.productos.empresa_id || !args.productos.codigo_producto || !args.productos.centro_utilidad_id || 
        !args.productos.bodega_id || !args.productos.fechaVencimiento || !args.productos.codigoLote) {
        res.send(G.utils.r(req.url, 'Algunos Datos Obligatorios No Estan Definidos', 404, {}));
        return;
    }
    var params = {};
    params.empresaId = args.productos.empresa_id;
    params.codigoProducto = args.productos.codigo_producto;
    params.centroUtilidad = args.productos.centro_utilidad_id;
    params.bodega = args.productos.bodega_id;
    params.fechaVencimiento = args.productos.fechaVencimiento;
    params.codigoLote = args.productos.codigoLote;

    G.Q.ninvoke(that.m_productos,"guardarExistenciaBodega", params).then(function(existencias){
        res.send(G.utils.r(req.url, 'Guardar existencia bodega', 200, {existencias: existencias}));
    }).fail(function(err){
       res.send(G.utils.r(req.url, 'Error guardando la existencia del producto', 500, {lista_productos: {}}));
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