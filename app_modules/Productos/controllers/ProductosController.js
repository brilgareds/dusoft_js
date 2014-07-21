
var Productos = function(productos) {

    console.log("Modulo Productos  Cargado ");

    this.m_productos = productos;
};



Productos.prototype.consultarExistenciasProducto = function(req, res) {

    var that = this;


    var empresa_id = '03';
    var centro_utilidad_id = '1';
    var bodega_id = '03';
    var codigo_producto = '168D0501607';

    that.m_productos.consultar_existencias_producto(empresa_id, centro_utilidad_id, bodega_id, codigo_producto, function(err, existencias){
        console.log(existencias);
    });

};

Productos.$inject = ["m_productos"];

module.exports = Productos;